"use client";
import { useState } from "react";

type Tab = "settle" | "netting" | "clearing" | "stats";

const DEFAULTS: Record<Tab, string> = {
  settle: JSON.stringify({
    trade_id: "TRD-20260226-001",
    buyer_id: "PARTY-A",
    seller_id: "PARTY-B",
    instrument: "AAPL",
    quantity: 1000,
    price: 182.50,
    currency: "USD",
    settlement_date: "2026-02-28"
  }, null, 2),
  netting: JSON.stringify({
    participant_id: "PARTY-A",
    trades: [
      { trade_id: "TRD-001", direction: "buy", quantity: 500, price: 182.50 },
      { trade_id: "TRD-002", direction: "sell", quantity: 300, price: 183.00 },
      { trade_id: "TRD-003", direction: "buy", quantity: 200, price: 182.75 }
    ],
    instrument: "AAPL",
    currency: "USD"
  }, null, 2),
  clearing: JSON.stringify({
    settlement_id: "STLM-20260226-001",
    clearing_member: "CLEAR-MEMBER-01",
    collateral_posted: 500000.00,
    currency: "USD",
    margin_call: false
  }, null, 2),
  stats: JSON.stringify({}, null, 2),
};

const ENDPOINTS: Record<Tab, { method: string; path: string }> = {
  settle:   { method: "POST", path: "/api/v1/settlement/settle" },
  netting:  { method: "POST", path: "/api/v1/settlement/netting" },
  clearing: { method: "POST", path: "/api/v1/settlement/clearing" },
  stats:    { method: "GET",  path: "/api/v1/stats" },
};

const TAB_LABELS: Record<Tab, string> = {
  settle:   "Settle",
  netting:  "Netting",
  clearing: "Clearing",
  stats:    "Stats",
};

export default function ConsolePage() {
  const [activeTab, setActiveTab] = useState<Tab>("settle");
  const [inputs, setInputs] = useState<Record<Tab, string>>(DEFAULTS);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:8081";

  const send = async () => {
    setLoading(true);
    setResponse("");
    const { method, path } = ENDPOINTS[activeTab];
    try {
      const opts: RequestInit = { method, headers: { "Content-Type": "application/json" } };
      if (method !== "GET") opts.body = inputs[activeTab];
      const res = await fetch(`${API}${path}`, opts);
      setResponse(JSON.stringify(await res.json(), null, 2));
    } catch (e: any) {
      setResponse(`Error: ${e.message}`);
    }
    setLoading(false);
  };

  const tabs: Tab[] = ["settle", "netting", "clearing", "stats"];

  return (
    <div style={{ padding: 24, fontFamily: "monospace", background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <h1 style={{ marginBottom: 4 }}>ALICE Settlement-SaaS — Console</h1>
      <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>
        Trade settlement with multilateral netting, clearing, and T+2 lifecycle management.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              background: activeTab === tab ? "#00d4ff" : "#1a1a2e",
              color: activeTab === tab ? "#000" : "#fff",
              border: "1px solid #333",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: "monospace",
              fontWeight: activeTab === tab ? 700 : 400,
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 8, fontSize: 12, color: "#888" }}>
        <span style={{ color: ENDPOINTS[activeTab].method === "GET" ? "#0f0" : "#00d4ff" }}>
          {ENDPOINTS[activeTab].method}
        </span>{" "}
        {API}{ENDPOINTS[activeTab].path}
      </div>

      {ENDPOINTS[activeTab].method !== "GET" && (
        <textarea
          value={inputs[activeTab]}
          onChange={e => setInputs(prev => ({ ...prev, [activeTab]: e.target.value }))}
          rows={12}
          style={{
            width: "100%",
            fontFamily: "monospace",
            background: "#111",
            color: "#fff",
            border: "1px solid #333",
            borderRadius: 6,
            padding: 12,
            boxSizing: "border-box",
            fontSize: 13,
          }}
        />
      )}

      <button
        onClick={send}
        disabled={loading}
        style={{
          marginTop: 8,
          padding: "10px 24px",
          background: loading ? "#333" : "#00d4ff",
          color: loading ? "#666" : "#000",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "monospace",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          marginTop: 16,
          minHeight: 200,
          overflow: "auto",
          borderRadius: 6,
          border: "1px solid #222",
          fontSize: 13,
        }}
      >
        {response || "// Response will appear here"}
      </pre>
    </div>
  );
}
