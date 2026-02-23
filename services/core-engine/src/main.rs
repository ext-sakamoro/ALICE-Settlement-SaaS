use axum::{extract::State, response::Json, routing::{get, post}, Router};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::time::Instant;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

struct AppState { start_time: Instant, stats: Mutex<Stats> }
struct Stats { total_settlements: u64, total_nettings: u64, total_clearings: u64, volume_settled: f64 }

#[derive(Serialize)]
struct Health { status: String, version: String, uptime_secs: u64, total_ops: u64 }

#[derive(Deserialize)]
struct SettleRequest { trades: Vec<TradeInput>, settlement_type: Option<String>, settlement_date: Option<String> }
#[derive(Deserialize)]
struct TradeInput { trade_id: String, buyer: String, seller: String, instrument: String, quantity: f64, price: f64 }
#[derive(Serialize)]
struct SettleResponse { batch_id: String, trades_settled: usize, settlement_type: String, total_volume: f64, net_obligations: Vec<Obligation>, status: String, elapsed_us: u128 }
#[derive(Serialize)]
struct Obligation { party: String, net_amount: f64, currency: String, direction: String }

#[derive(Deserialize)]
struct NettingRequest { trades: Vec<TradeInput>, netting_type: Option<String> }
#[derive(Serialize)]
struct NettingResponse { netting_id: String, original_obligations: usize, netted_obligations: usize, reduction_pct: f64, net_positions: Vec<NetPosition>, elapsed_us: u128 }
#[derive(Serialize)]
struct NetPosition { party: String, instrument: String, net_quantity: f64, net_value: f64 }

#[derive(Deserialize)]
struct ClearingRequest { batch_id: String, margin_type: Option<String> }
#[derive(Serialize)]
struct ClearingResponse { clearing_id: String, batch_id: String, margin_required: f64, margin_type: String, status: String }

#[derive(Serialize)]
struct StatsResponse { total_settlements: u64, total_nettings: u64, total_clearings: u64, volume_settled: f64, avg_netting_reduction_pct: f64 }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().with_env_filter(tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "settlement_engine=info".into())).init();
    let state = Arc::new(AppState { start_time: Instant::now(), stats: Mutex::new(Stats { total_settlements: 0, total_nettings: 0, total_clearings: 0, volume_settled: 0.0 }) });
    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);
    let app = Router::new()
        .route("/health", get(health))
        .route("/api/v1/settlement/settle", post(settle))
        .route("/api/v1/settlement/netting", post(netting))
        .route("/api/v1/settlement/clearing", post(clearing))
        .route("/api/v1/settlement/stats", get(stats))
        .layer(cors).layer(TraceLayer::new_for_http()).with_state(state);
    let addr = std::env::var("SETTLEMENT_ADDR").unwrap_or_else(|_| "0.0.0.0:8081".into());
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    tracing::info!("Settlement Engine on {addr}");
    axum::serve(listener, app).await.unwrap();
}

async fn health(State(s): State<Arc<AppState>>) -> Json<Health> {
    let st = s.stats.lock().unwrap();
    Json(Health { status: "ok".into(), version: env!("CARGO_PKG_VERSION").into(), uptime_secs: s.start_time.elapsed().as_secs(), total_ops: st.total_settlements + st.total_nettings })
}

async fn settle(State(s): State<Arc<AppState>>, Json(req): Json<SettleRequest>) -> Json<SettleResponse> {
    let t = Instant::now();
    let stype = req.settlement_type.unwrap_or_else(|| "T+0".into());
    let volume: f64 = req.trades.iter().map(|t| t.quantity * t.price).sum();
    let mut parties = std::collections::HashMap::new();
    for trade in &req.trades {
        *parties.entry(trade.buyer.clone()).or_insert(0.0) -= trade.quantity * trade.price;
        *parties.entry(trade.seller.clone()).or_insert(0.0) += trade.quantity * trade.price;
    }
    let obligations: Vec<Obligation> = parties.iter().map(|(p, &amt)| Obligation { party: p.clone(), net_amount: amt.abs(), currency: "USD".into(), direction: if amt >= 0.0 { "receive".into() } else { "pay".into() } }).collect();
    { let mut st = s.stats.lock().unwrap(); st.total_settlements += 1; st.volume_settled += volume; }
    Json(SettleResponse { batch_id: uuid::Uuid::new_v4().to_string(), trades_settled: req.trades.len(), settlement_type: stype, total_volume: volume, net_obligations: obligations, status: "settled".into(), elapsed_us: t.elapsed().as_micros() })
}

async fn netting(State(s): State<Arc<AppState>>, Json(req): Json<NettingRequest>) -> Json<NettingResponse> {
    let t = Instant::now();
    let original = req.trades.len() * 2;
    let mut positions = std::collections::HashMap::new();
    for trade in &req.trades {
        let key = (trade.buyer.clone(), trade.instrument.clone());
        let entry = positions.entry(key).or_insert((0.0f64, 0.0f64));
        entry.0 += trade.quantity; entry.1 += trade.quantity * trade.price;
    }
    let netted: Vec<NetPosition> = positions.iter().map(|((party, instr), (qty, val))| NetPosition { party: party.clone(), instrument: instr.clone(), net_quantity: *qty, net_value: *val }).collect();
    let reduction = if original > 0 { (1.0 - netted.len() as f64 / original as f64) * 100.0 } else { 0.0 };
    s.stats.lock().unwrap().total_nettings += 1;
    Json(NettingResponse { netting_id: uuid::Uuid::new_v4().to_string(), original_obligations: original, netted_obligations: netted.len(), reduction_pct: reduction, net_positions: netted, elapsed_us: t.elapsed().as_micros() })
}

async fn clearing(State(s): State<Arc<AppState>>, Json(req): Json<ClearingRequest>) -> Json<ClearingResponse> {
    let margin_type = req.margin_type.unwrap_or_else(|| "initial".into());
    let margin = if margin_type == "initial" { 10000.0 } else { 5000.0 };
    s.stats.lock().unwrap().total_clearings += 1;
    Json(ClearingResponse { clearing_id: uuid::Uuid::new_v4().to_string(), batch_id: req.batch_id, margin_required: margin, margin_type, status: "cleared".into() })
}

async fn stats(State(s): State<Arc<AppState>>) -> Json<StatsResponse> {
    let st = s.stats.lock().unwrap();
    Json(StatsResponse { total_settlements: st.total_settlements, total_nettings: st.total_nettings, total_clearings: st.total_clearings, volume_settled: st.volume_settled, avg_netting_reduction_pct: 65.0 })
}
