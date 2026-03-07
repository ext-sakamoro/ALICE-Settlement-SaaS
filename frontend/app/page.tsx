export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a, #1a1a2e)",
        color: "#fff",
        fontFamily: "system-ui",
      }}
    >
      <header
        style={{
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ffffff10",
        }}
      >
        <h2 style={{ margin: 0, color: "#00d4ff" }}>ALICE Settlement-SaaS</h2>
        <a href="/dashboard/console" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: 600 }}>
          Console →
        </a>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "#00d4ff20",
            color: "#00d4ff",
            borderRadius: 20,
            padding: "4px 16px",
            fontSize: 13,
            marginBottom: 24,
            border: "1px solid #00d4ff40",
          }}
        >
          T+2 Settlement Infrastructure
        </div>

        <h1 style={{ fontSize: 48, marginBottom: 16, lineHeight: 1.2 }}>
          Settle Trades at Institutional Scale
        </h1>
        <p style={{ fontSize: 20, color: "#aaa", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
          Multilateral netting, CCP clearing, and full T+2 lifecycle management for high-volume trade settlement.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 80 }}>
          <a
            href="/dashboard/console"
            style={{
              padding: "12px 32px",
              background: "#00d4ff",
              color: "#000",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            Open Console
          </a>
          <a
            href="#features"
            style={{
              padding: "12px 32px",
              background: "#ffffff10",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
              border: "1px solid #ffffff20",
            }}
          >
            Learn More
          </a>
        </div>

        <div
          id="features"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "left" }}
        >
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
            <h3 style={{ margin: "0 0 8px" }}>Multilateral Netting</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Offset opposing positions across multiple participants to minimize gross settlement obligations and reduce counterparty exposure.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏦</div>
            <h3 style={{ margin: "0 0 8px" }}>CCP Clearing</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Central counterparty clearing with real-time margin calls, collateral management, and default fund contributions.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
            <h3 style={{ margin: "0 0 8px" }}>T+2 Lifecycle</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Full trade lifecycle from execution through settlement with automated status tracking, fail management, and DVP enforcement.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <h3 style={{ margin: "0 0 8px" }}>High Throughput</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Process millions of settlement instructions per day with sub-millisecond netting calculations and atomic DVP commitment.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            <h3 style={{ margin: "0 0 8px" }}>Regulatory Compliance</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Built-in CSDR, Dodd-Frank, and EMIR compliance with full audit trails, reporting, and regulatory submission support.
            </p>
          </div>
          <div style={{ background: "#ffffff10", borderRadius: 12, padding: 24, border: "1px solid #ffffff10" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            <h3 style={{ margin: "0 0 8px" }}>Real-Time Analytics</h3>
            <p style={{ color: "#aaa", margin: 0, fontSize: 14, lineHeight: 1.6 }}>
              Live settlement efficiency metrics, fail rate monitoring, liquidity forecasting, and counterparty exposure dashboards.
            </p>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: 32, color: "#555", borderTop: "1px solid #ffffff10" }}>
        ALICE Settlement-SaaS — AGPL-3.0-or-later
      </footer>
    </div>
  );
}
