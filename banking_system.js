const { useState, useEffect, useRef, useCallback } = React;

const C = {
  bg0: "#F2F3F0",
  bg1: "#E3E4E2",
  bg2: "#CFD0CE",
  sidebar: "#151918",
  sidebarDark: "#1b1919",
  border: "#D8DAD8",
  borderHover: "#B4B8B6",
  text: "#373938",
  textMuted: "#6C6C6C",
  textDim: "#A3A7A6",
  white: "#FEFEFE",
  success: "#4CAF50",
  warning: "#EE723E",
  danger: "#D9534F",
  mastercardRed: "#EB001B",
  mastercardOrange: "#F79E1B",
  gold: "#D4A843",
  goldDim: "#F4C862",
  glass: "rgba(255,255,255,0.65)",
  emerald: "#16A34A",
  red: "#DC2626",
  blue: "#2563EB",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: ${C.bg0}; font-family: 'Inter', sans-serif; color: ${C.text}; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: ${C.bg1}; }
  ::-webkit-scrollbar-thumb { background: ${C.borderHover}; border-radius: 2px; }

  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:.6; } 50% { opacity:1; } }
  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes countUp { from { opacity:0; } to { opacity:1; } }
  @keyframes glow {
    0%,100% { box-shadow: 0 0 20px rgba(212,168,67,0.1); }
    50% { box-shadow: 0 0 40px rgba(212,168,67,0.25); }
  }
  @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }

  .fade-in { animation: fadeIn 0.4s ease forwards; }
  .shimmer {
    background: linear-gradient(90deg, ${C.glass} 25%, rgba(255,255,255,0.07) 50%, ${C.glass} 75%);
    background-size: 400px 100%;
    animation: shimmer 1.6s infinite;
  }
  .card {
    background: ${C.glass};
    border: 1px solid ${C.border};
    border-radius: 20px;
    backdrop-filter: blur(12px);
    transition: border-color .2s, transform .2s, box-shadow .2s;
  }
  .card:hover { border-color: ${C.borderHover}; transform: translateY(-2px); box-shadow: 0 16px 48px rgba(0,0,0,.15); }
  .card-glow { animation: glow 3s ease-in-out infinite; }
  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; letter-spacing: .3px;
  }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 20px; border-radius: 12px; font-weight: 600; font-size: 14px;
    cursor: pointer; transition: all .2s; border: none; outline: none;
  }
  .btn-gold {
    background: linear-gradient(135deg, ${C.gold}, ${C.goldDim});
    color: #0B0F14;
  }
  .btn-gold:hover { filter: brightness(1.05); transform: translateY(-1px); }
  .btn-ghost {
    background: ${C.glass}; border: 1px solid ${C.border}; color: ${C.text};
  }
  .btn-ghost:hover { border-color: ${C.borderHover}; background: rgba(255,255,255,0.08); }
  .metric-big { font-size: 32px; font-weight: 800; letter-spacing: -1px; }
  .metric-med { font-size: 22px; font-weight: 700; letter-spacing: -.5px; }
  .spinner { width:24px; height:24px; border:2px solid ${C.border}; border-top-color:${C.gold}; border-radius:50%; animation:spin .7s linear infinite; }
  .input-field {
    background: rgba(255,255,255,0.04); border: 1px solid ${C.border};
    color: ${C.text}; border-radius: 12px; padding: 10px 14px;
    font-family: inherit; font-size: 14px; outline: none; width: 100%;
    transition: border-color .2s;
  }
  .input-field:focus { border-color: ${C.gold}; }
  .input-field::placeholder { color: ${C.textMuted}; }
  .progress-bar {
    height: 4px; border-radius: 2px; background: rgba(255,255,255,0.06);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%; border-radius: 2px;
    transition: width 1s ease;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 12px;
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: all .15s; color: ${C.textDim}; border: none; background: none;
    width: 100%; text-align: left;
  }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: ${C.text}; }
  .nav-item.active { background: rgba(212,168,67,0.12); color: ${C.gold}; }
  .section-label {
    font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: ${C.textMuted}; margin-bottom: 12px;
  }
  .divider { height: 1px; background: ${C.border}; margin: 16px 0; }
  .confidence-dot {
    width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 5px;
  }
  textarea.input-field { resize: vertical; min-height: 60px; }
`;

const DEMO_DATA = {
  profile: {
    name: "User",
    age: 21,
    pan: "ABCDE1234F",
    aadhaar: "XXXX-XXXX-7823",
    occupation: "Senior Software Engineer",
    employmentType: "Private Employee",
    monthlyIncome: 185000,
    annualIncome: 2220000,
    incomeSource: "Salary + Investments",
    confidence: { name: 98, income: 91, employment: 87 },
  },
  banking: {
    banks: ["HDFC Bank", "SBI", "ICICI Bank"],
    accounts: 3,
    currentBalance: 847250,
    avgBalance: 623000,
    monthlyCashFlow: 142000,
    totalCredits: 9840000,
    totalDebits: 8312000,
    activity: "Highly Active",
  },
  investments: [
    { type: "Mutual Funds", amount: 1850000, currentValue: 2430000, cagr: 14.2, pl: 580000, status: "Active" },
    { type: "Fixed Deposits", amount: 500000, currentValue: 565000, cagr: 7.1, pl: 65000, maturity: "Mar 2026", status: "Active" },
    { type: "EPF", amount: 1200000, currentValue: 1680000, cagr: 8.5, pl: 480000, status: "Active" },
    { type: "Stocks", amount: 620000, currentValue: 895000, cagr: 18.4, pl: 275000, status: "Active" },
    { type: "PPF", amount: 350000, currentValue: 418000, cagr: 7.1, pl: 68000, maturity: "Apr 2029", status: "Active" },
    { type: "NPS", amount: 280000, currentValue: 342000, cagr: 9.2, pl: 62000, status: "Active" },
    { type: "Gold ETF", amount: 150000, currentValue: 198000, cagr: 11.3, pl: 48000, status: "Active" },
    { type: "SIP (Ongoing)", amount: 420000, currentValue: 510000, cagr: 15.1, pl: 90000, status: "Active" },
  ],
  insurance: [
    { type: "Term Life", provider: "LIC", premium: 28000, coverage: 10000000, status: "Active", renewal: "Jan 2026" },
    { type: "Health Insurance", provider: "Star Health", premium: 32000, coverage: 1000000, status: "Active", renewal: "Mar 2026" },
    { type: "Vehicle Insurance", provider: "ICICI Lombard", premium: 12500, coverage: 800000, status: "Active", renewal: "Jun 2025" },
  ],
  scores: { financialHealth: 78, investmentDiversity: 84, riskProfile: 65, wealthGrowth: 82 },
  netWorth: {
    current: 8450000,
    assets: 9720000,
    liabilities: 1270000,
    breakdown: { banking: 847250, investments: 6468000, insurance: 1680000, realEstate: 725000 },
  },
  projections: { yr1: 9380000, yr5: 14820000, yr10: 26140000 },
};

const fmt = {
  inr: (v) =>
    v >= 1e7
      ? `₹${(v / 1e7).toFixed(2)}Cr`
      : v >= 1e5
      ? `₹${(v / 1e5).toFixed(1)}L`
      : `₹${v?.toLocaleString("en-IN")}`,
  pct: (v) => `${v > 0 ? "+" : ""}${v}%`,
  num: (v) => v?.toLocaleString("en-IN"),
};

const confColor = (score) => (score >= 85 ? C.emerald : score >= 65 ? C.gold : C.red);
const confLabel = (score) => (score >= 85 ? "Confirmed" : score >= 65 ? "Inferred" : "Unknown");

function Sparkline({ data, color = C.gold, width = 120, height = 40 }) {
  if (!data?.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <polyline fill={`${color}18`} stroke="none" points={`0,${height} ${pts} ${width},${height}`} />
    </svg>
  );
}

function DonutChart({ segments, size = 120, strokeWidth = 14 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const element = (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray .8s ease" }}
          />
        );
        offset += dash;
        return element;
      })}
    </svg>
  );
}

function BarChart({ data, maxVal, color = C.gold }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: i === data.length - 1 ? color : `${color}60`,
            borderRadius: "3px 3px 0 0",
            height: `${(v / maxVal) * 100}%`,
            transition: "height .6s ease",
            minHeight: 3,
          }}
        />
      ))}
    </div>
  );
}

function Tag({ label, color, bg }) {
  return (
    <span className="tag" style={{ background: bg || `${color}20`, color }}>
      {label}
    </span>
  );
}

function ConfidencePill({ score }) {
  const color = confColor(score);
  return (
    <span className="tag" style={{ background: `${color}18`, color }}>
      <span className="confidence-dot" style={{ background: color }} />
      {confLabel(score)} · {score}%
    </span>
  );
}

function ScoreRing({ score, label, color = C.gold, size = 80 }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={6} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div style={{ textAlign: "center", marginTop: -4 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color }}>{score}</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{label}</div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, trend, color = C.gold, spark, onClick }) {
  return (
    <div className="card" onClick={onClick} style={{ padding: "20px 22px", cursor: onClick ? "pointer" : "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, marginBottom: 6 }}>{label}</div>
          <div className="metric-big" style={{ color }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>{sub}</div>}
          {trend !== undefined && (
            <div style={{ fontSize: 12, color: trend >= 0 ? C.emerald : C.red, marginTop: 4, fontWeight: 600 }}>
              {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
            </div>
          )}
        </div>
        {spark && <div style={{ marginTop: 4 }}><Sparkline data={spark} color={color} /></div>}
      </div>
    </div>
  );
}

function UploadPanel({ onAnalyze, analyzing }) {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [apiLink, setApiLink] = useState("");
  const fileRef = useRef();

  const addFiles = useCallback((newFiles) => {
    setFiles((prev) => [
      ...prev,
      ...Array.from(newFiles).map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        id: Math.random().toString(36).slice(2),
      })),
    ]);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const fileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    return { csv: "📊", xlsx: "📗", xls: "📗", pdf: "📄", json: "📋" }[ext] || "📁";
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }} className="fade-in">
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 3,
            color: C.gold,
            fontWeight: 600,
            marginBottom: 14,
            textTransform: "uppercase",
          }}
        >
          AI-Powered Analysis
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: -1,
            marginBottom: 12,
            lineHeight: 1.15,
          }}
        >
          Build Your Financial<br />
          <span style={{ color: C.gold }}>Intelligence Profile</span>
        </h1>
        <p style={{ color: C.textDim, fontSize: 15, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          Upload bank statements, investment reports, or insurance documents. Financial Dashboard will analyze everything and generate your complete wealth profile.
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: 32,
          textAlign: "center",
          border: `2px dashed ${dragOver ? C.gold : C.border}`,
          background: dragOver ? "rgba(212,168,67,0.05)" : C.glass,
          transition: "all .2s",
          marginBottom: 16,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Drop financial documents here</div>
        <div style={{ color: C.textMuted, fontSize: 13, marginBottom: 18 }}>
          CSV · Excel · PDF · JSON · Bank Statements · Investment Reports
        </div>
        <button className="btn btn-ghost" onClick={() => fileRef.current.click()}>
          Browse Files
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".csv,.xlsx,.xls,.pdf,.json"
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      <div className="card" style={{ padding: "16px 20px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ fontSize: 18 }}>🔗</span>
        <input
          className="input-field"
          placeholder="Or paste a secure data API endpoint (bank, broker, insurance)"
          value={apiLink}
          onChange={(e) => setApiLink(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn btn-ghost" style={{ whiteSpace: "nowrap" }}>
          Connect
        </button>
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {files.map((f) => (
            <div
              key={f.id}
              className="card"
              style={{ padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}
            >
              <span style={{ fontSize: 22 }}>{fileIcon(f.name)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{(f.size / 1024).toFixed(1)} KB</div>
              </div>
              <Tag label="Ready" color={C.emerald} />
              <button
                style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 18 }}
                onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 10, flexDirection: "column", alignItems: "center" }}>
        <button
          className="btn btn-gold"
          style={{ width: "100%", padding: "14px", fontSize: 15 }}
          onClick={() => onAnalyze(files)}
          disabled={analyzing}
        >
          {analyzing ? (
            <>
              <span className="spinner" style={{ width: 16, height: 16 }} /> Analyzing with AI...
            </>
          ) : (
            "🧠 Analyze & Generate Profile"
          )}
        </button>
        <button
          className="btn btn-ghost"
          style={{ width: "100%", fontSize: 13 }}
          onClick={() => onAnalyze([], true)}
        >
          ⚡ Demo Profile (User)
        </button>
      </div>
    </div>
  );
}

const NAV = [
  { id: "overview", icon: "◈", label: "Overview" },
  { id: "profile", icon: "👤", label: "Financial Profile" },
  { id: "banking", icon: "🏦", label: "Banking" },
  { id: "investments", icon: "📈", label: "Investments" },
  { id: "insurance", icon: "🛡", label: "Insurance" },
  { id: "analytics", icon: "🧠", label: "AI Insights" },
  { id: "projections", icon: "🔭", label: "Projections" },
  { id: "chat", icon: "💬", label: "AI Assistant" },
];

function Sidebar({ active, onSelect, data }) {
  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        background: C.bg1,
        borderRight: `1px solid ${C.border}`,
        padding: "24px 12px",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "4px 8px 24px", display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 800,
            color: "#0B0F14",
          }}
        >
          F
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.3 }}>Financial Dashboard</div>
        </div>
      </div>

      <div className="divider" />

      {NAV.map((n) => (
        <button key={n.id} className={`nav-item ${active === n.id ? "active" : ""}`} onClick={() => onSelect(n.id)}>
          <span style={{ fontSize: 15 }}>{n.icon}</span>
          <span>{n.label}</span>
        </button>
      ))}

      <div style={{ flex: 1 }} />
      <div className="divider" />

      {data && (
        <div style={{ padding: "8px 6px" }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Profile</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
            {data.profile.name.split(" ")[0]} {data.profile.name.split(" ").slice(-1)[0]}
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>{data.profile.occupation}</div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Financial Health</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${data.scores.financialHealth}%`, background: C.gold }} />
            </div>
            <div style={{ fontSize: 11, color: C.gold, marginTop: 3 }}>{data.scores.financialHealth}/100</div>
          </div>
        </div>
      )}
    </aside>
  );
}

function OverviewPage({ data }) {
  const sparkData = [62, 65, 71, 68, 74, 78, 82, 80, 85, 88, 84, 89];
  const invSegs = [
    { color: C.gold, value: data.netWorth.breakdown.investments },
    { color: C.emerald, value: data.netWorth.breakdown.banking },
    { color: "#3B82F6", value: data.netWorth.breakdown.insurance },
    { color: "#8B5CF6", value: data.netWorth.breakdown.realEstate },
  ];
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const expBar = [88, 92, 79, 95, 87, 103, 88, 91, 99, 85, 94, 108];

  return (
    <div style={{ padding: "32px 32px", animation: "fadeIn .4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
          Wealth Overview
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
            Good morning, {data.profile.name.split(" ")[0]}
          </h2>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard label="Net Worth" value={fmt.inr(data.netWorth.current)} sub={`Assets ${fmt.inr(data.netWorth.assets)}`} trend={12.4} color={C.gold} spark={sparkData} />
        <MetricCard label="Total Investments" value={fmt.inr(data.netWorth.breakdown.investments)} sub="8 instruments" trend={16.2} color={C.emerald} />
        <MetricCard label="Monthly Income" value={fmt.inr(data.profile.monthlyIncome)} sub={data.profile.incomeSource} color={C.text} />
        <MetricCard label="Financial Score" value={`${data.scores.financialHealth}/100`} sub="Excellent standing" color={C.gold} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ padding: "22px 24px" }}>
          <div className="section-label">Asset Allocation</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <DonutChart segments={invSegs} size={110} strokeWidth={12} />
            <div style={{ flex: 1 }}>
              {[
                { label: "Investments", color: C.gold, val: data.netWorth.breakdown.investments },
                { label: "Banking", color: C.emerald, val: data.netWorth.breakdown.banking },
                { label: "Insurance", color: "#3B82F6", val: data.netWorth.breakdown.insurance },
                { label: "Real Estate", color: "#8B5CF6", val: data.netWorth.breakdown.realEstate },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                    <span style={{ fontSize: 12, color: C.textDim }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{fmt.inr(item.val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "22px 24px" }}>
          <div className="section-label">Monthly Expenses (₹K)</div>
          <BarChart data={expBar} maxVal={120} color={C.gold} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {months.map((m) => (
              <span key={m} style={{ fontSize: 9, color: C.textMuted }}>{m}</span>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Avg/month</div>
              <div style={{ fontWeight: 700, color: C.text }}>₹91K</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Savings rate</div>
              <div style={{ fontWeight: 700, color: C.emerald }}>50.8%</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "22px 24px" }}>
          <div className="section-label">Health Scores</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
            <ScoreRing score={data.scores.financialHealth} label="Health" color={C.gold} size={76} />
            <ScoreRing score={data.scores.investmentDiversity} label="Diversity" color={C.emerald} size={76} />
            <ScoreRing score={data.scores.riskProfile} label="Risk" color="#3B82F6" size={76} />
            <ScoreRing score={data.scores.wealthGrowth} label="Growth" color="#8B5CF6" size={76} />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "22px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Investment Portfolio</div>
          <Tag label="8 Instruments" color={C.gold} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {["Type", "Invested", "Current Value", "P&L", "CAGR", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{ textAlign: "left", padding: "6px 12px", color: C.textMuted, fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.investments.map((inv, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{inv.type}</td>
                  <td style={{ padding: "10px 12px", color: C.textDim }}>{fmt.inr(inv.amount)}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{fmt.inr(inv.currentValue)}</td>
                  <td style={{ padding: "10px 12px", color: inv.pl >= 0 ? C.emerald : C.red, fontWeight: 600 }}>
                    {inv.pl >= 0 ? "+" : ""}{fmt.inr(inv.pl)}
                  </td>
                  <td style={{ padding: "10px 12px", color: C.gold, fontWeight: 600 }}>{inv.cagr}%</td>
                  <td style={{ padding: "10px 12px" }}><Tag label={inv.status} color={C.emerald} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ data }) {
  const fields = [
    { label: "Full Name", value: data.profile.name, confidence: data.profile.confidence.name },
    { label: "Age", value: `${data.profile.age} years`, confidence: 95 },
    { label: "PAN Number", value: data.profile.pan.replace(/\w(?=\w{4})/g, "X"), confidence: 99 },
    { label: "Aadhaar (Masked)", value: data.profile.aadhaar, confidence: 98 },
    { label: "Occupation", value: data.profile.occupation, confidence: 88 },
    { label: "Employment Type", value: data.profile.employmentType, confidence: data.profile.confidence.employment },
    { label: "Monthly Income", value: fmt.inr(data.profile.monthlyIncome), confidence: data.profile.confidence.income },
    { label: "Annual Income", value: fmt.inr(data.profile.annualIncome), confidence: data.profile.confidence.income },
    { label: "Income Sources", value: data.profile.incomeSource, confidence: 83 },
  ];

  const empTypes = [
    { label: "Private Employee", score: 87, active: true },
    { label: "Government Employee", score: 8, active: false },
    { label: "Self-Employed", score: 14, active: false },
    { label: "Business Owner", score: 6, active: false },
    { label: "Pensioner", score: 4, active: false },
  ];

  return (
    <div style={{ padding: "32px 32px", animation: "fadeIn .4s ease" }}>
      <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        Individual Profile
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 24 }}>Financial Identity</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: "24px" }}>
          <div className="section-label">Extracted Profile Data</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {fields.map((f) => (
              <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}>{f.label}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{f.value}</div>
                </div>
                <ConfidencePill score={f.confidence} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ padding: "24px" }}>
            <div className="section-label">Employment Detection Engine</div>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 14 }}>
              AI-inferred from salary patterns, transaction descriptions & employer names
            </div>
            {empTypes.map((e) => (
              <div key={e.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: e.active ? C.text : C.textDim, fontWeight: e.active ? 600 : 400 }}>{e.label}</span>
                  <span style={{ fontSize: 12, color: e.active ? C.emerald : C.textMuted, fontWeight: 600 }}>{e.score}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${e.score}%`, background: e.active ? C.emerald : C.border }} />
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: "24px" }}>
            <div className="section-label">Banking Summary</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Banks Detected", value: data.banking.banks.length, color: C.text },
                { label: "Accounts", value: data.banking.accounts, color: C.text },
                { label: "Current Balance", value: fmt.inr(data.banking.currentBalance), color: C.gold },
                { label: "Monthly Cash Flow", value: fmt.inr(data.banking.monthlyCashFlow), color: C.emerald },
              ].map((m) => (
                <div key={m.label} style={{ background: C.glass, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Banks Found</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {data.banking.banks.map((b) => (
                  <Tag key={b} label={b} color={C.blue} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BankingPage({ data }) {
  const b = data.banking;
  const cashFlowData = [92, 88, 103, 97, 88, 112, 105, 98, 110, 142, 127, 139];

  return (
    <div style={{ padding: "32px 32px", animation: "fadeIn .4s ease" }}>
      <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        Banking Analysis
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 24 }}>Account Intelligence</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard label="Current Balance" value={fmt.inr(b.currentBalance)} color={C.gold} />
        <MetricCard label="Average Balance" value={fmt.inr(b.avgBalance)} color={C.text} />
        <MetricCard label="Total Credits" value={fmt.inr(b.totalCredits)} trend={8.3} color={C.emerald} />
        <MetricCard label="Total Debits" value={fmt.inr(b.totalDebits)} color={C.red} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: "24px" }}>
          <div className="section-label">Monthly Cash Flow (₹K)</div>
          <BarChart data={cashFlowData} maxVal={150} color={C.emerald} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
              <span key={m} style={{ fontSize: 9, color: C.textMuted }}>{m}</span>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Net monthly savings</div>
              <div style={{ fontWeight: 700, color: C.emerald, fontSize: 18 }}>{fmt.inr(b.monthlyCashFlow)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.textMuted }}>Activity status</div>
              <div style={{ fontWeight: 700, color: C.gold, fontSize: 18 }}>{b.activity}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {b.banks.map((bank) => (
            <div key={bank} className="card" style={{ padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{bank}</div>
                <Tag label="Active" color={C.emerald} />
              </div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Salary account detected</div>
              <div style={{ marginTop: 8, fontSize: 13, color: C.gold, fontWeight: 700 }}>
                {fmt.inr(Math.floor(b.currentBalance / b.banks.length))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InvestmentsPage({ data }) {
  const totalInvested = data.investments.reduce((s, i) => s + i.amount, 0);
  const totalCurrent = data.investments.reduce((s, i) => s + i.currentValue, 0);
  const totalPL = totalCurrent - totalInvested;
  const overallReturn = ((totalPL / totalInvested) * 100).toFixed(1);

  return (
    <div style={{ padding: "32px 32px", animation: "fadeIn .4s ease" }}>
      <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        Investment Portfolio
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 24 }}>Wealth Builder</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard label="Total Invested" value={fmt.inr(totalInvested)} color={C.text} />
        <MetricCard label="Current Value" value={fmt.inr(totalCurrent)} color={C.gold} />
        <MetricCard label="Total P&L" value={`+${fmt.inr(totalPL)}`} trend={parseFloat(overallReturn)} color={C.emerald} />
        <MetricCard label="Avg CAGR" value={`${(data.investments.reduce((s, i) => s + i.cagr, 0) / data.investments.length).toFixed(1)}%`} color={C.emerald} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: "24px" }}>
          <div className="section-label">Instrument Allocation</div>
          <DonutChart
            segments={data.investments.map((inv, i) => ({
              value: inv.currentValue,
              color: [C.gold, C.emerald, "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4", "#84CC16"][i],
            }))}
            size={160}
            strokeWidth={18}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {data.investments.map((inv, i) => (
              <div key={inv.type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: [C.gold, C.emerald, "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#06B6D4", "#84CC16"][i],
                  }}
                />
                <span style={{ fontSize: 11, color: C.textDim }}>{inv.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: "24px" }}>
          <div className="section-label">Performance by Instrument</div>
          {data.investments.map((inv) => (
            <div key={inv.type} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{inv.type}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{inv.cagr}%</span>
                  <span style={{ fontSize: 12, color: C.emerald, fontWeight: 600 }}>+{fmt.inr(inv.pl)}</span>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(inv.currentValue / totalCurrent) * 100}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.emerald})` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsurancePage({ data }) {
  const totalCoverage = data.insurance.reduce((s, i) => s + i.coverage, 0);
  const totalPremium = data.insurance.reduce((s, i) => s + i.premium, 0);

  return (
    <div style={{ padding: "32px 32px", animation: "fadeIn .4s ease" }}>
      <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        Insurance Coverage
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 24 }}>Protection Shield</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
        <MetricCard label="Total Coverage" value={fmt.inr(totalCoverage)} color={C.gold} />
        <MetricCard label="Annual Premium" value={fmt.inr(totalPremium)} color={C.text} />
        <MetricCard label="Active Policies" value={`${data.insurance.filter((i) => i.status === "Active").length}`} color={C.emerald} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {data.insurance.map((ins) => (
          <div key={ins.type} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ fontSize: 32 }}>{ins.type === "Term Life" ? "🛡" : ins.type === "Health Insurance" ? "🏥" : "🚗"}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{ins.type}</div>
                  <div style={{ color: C.textDim, fontSize: 13 }}>
                    Provider: <span style={{ color: C.text, fontWeight: 500 }}>{ins.provider}</span>
                  </div>
                  <div style={{ color: C.textDim, fontSize: 13 }}>
                    Renewal: <span style={{ color: C.gold, fontWeight: 500 }}>{ins.renewal}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Tag label={ins.status} color={ins.status === "Active" ? C.emerald : C.red} />
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 11, color: C.textMuted }}>Coverage</div>
                  <div style={{ fontWeight: 800, color: C.gold, fontSize: 20 }}>{fmt.inr(ins.coverage)}</div>
                </div>
              </div>
            </div>
            <div className="divider" />
            <div style={{ display: "flex", gap: 32 }}>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Annual Premium</div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{fmt.inr(ins.premium)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.textMuted }}>Coverage Ratio</div>
                <div style={{ fontWeight: 600, color: C.emerald, fontSize: 15 }}>{(ins.coverage / ins.premium).toFixed(1)}x</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage({ data }) {
  const insights = [
    { icon: "💰", title: "Spending Behavior", badge: "Disciplined", badgeColor: C.emerald, detail: "Monthly savings rate of 50.8% — significantly above the 30% benchmark for your income bracket." },
    { icon: "📊", title: "Investment Discipline", badge: "Excellent", badgeColor: C.gold, detail: "SIPs running consistently. Portfolio diversified across 8 instruments with low concentration risk." },
    { icon: "⚖️", title: "Debt Profile", badge: "Low Risk", badgeColor: C.emerald, detail: "Debt-to-income ratio at 14%. Home loan EMI is the primary liability — well within safe limits." },
    { icon: "🛡", title: "Insurance Coverage", badge: "Adequate", badgeColor: C.blue, detail: "Sum assured at 5x annual income. Health cover at ₹10L for a family of 3 is borderline; upgrade recommended." },
    { icon: "📈", title: "Wealth Growth Trajectory", badge: "Strong", badgeColor: C.emerald, detail: "Net worth growing at ~12% CAGR. On track for financial independence by age 57 based on current trajectory." },
    { icon: "⚠️", title: "Risk Exposure", badge: "Moderate", badgeColor: C.gold, detail: "Equity exposure at 38% of investable assets. Consider slightly reducing direct equity exposure given age profile." },
  ];

  return (
    <div style={{ padding: "32px 32px", animation: "fadeIn .4s ease" }}>
      <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        AI Intelligence
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 24 }}>Financial Health Analysis</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Financial Health", score: data.scores.financialHealth, color: C.gold },
          { label: "Investment Diversity", score: data.scores.investmentDiversity, color: C.emerald },
          { label: "Risk Profile", score: data.scores.riskProfile, color: "#3B82F6" },
          { label: "Wealth Growth", score: data.scores.wealthGrowth, color: "#8B5CF6" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "24px", textAlign: "center" }}>
            <ScoreRing score={s.score} label={s.label} color={s.color} size={90} />
            <div className="progress-bar" style={{ marginTop: 12 }}>
              <div className="progress-fill" style={{ width: `${s.score}%`, background: s.color }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {insights.map((ins) => (
          <div key={ins.title} className="card" style={{ padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{ins.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{ins.title}</span>
              </div>
              <Tag label={ins.badge} color={ins.badgeColor} />
            </div>
            <p style={{ color: C.textDim, fontSize: 13, lineHeight: 1.7 }}>{ins.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectionsPage({ data }) {
  const projYears = [0, 1, 2, 3, 5, 7, 10];
  const baseNW = data.netWorth.current;
  const growthRate = 0.11;
  const projValues = projYears.map((y) => Math.round(baseNW * Math.pow(1 + growthRate, y)));
  const maxProj = projValues[projValues.length - 1];

  return (
    <div style={{ padding: "32px 32px", animation: "fadeIn .4s ease" }}>
      <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        Future Forecasting
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 24 }}>Wealth Projections</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        <MetricCard label="1 Year Projection" value={fmt.inr(data.projections.yr1)} trend={11.1} color={C.gold} />
        <MetricCard label="5 Year Projection" value={fmt.inr(data.projections.yr5)} trend={75.4} color={C.emerald} />
        <MetricCard label="10 Year Projection" value={fmt.inr(data.projections.yr10)} trend={209.3} color="#8B5CF6" />
      </div>

      <div className="card" style={{ padding: "28px", marginBottom: 16 }}>
        <div className="section-label">Wealth Growth Timeline (₹ Cr)</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, marginTop: 16, marginBottom: 8 }}>
          {projValues.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>{fmt.inr(v)}</div>
              <div
                style={{
                  width: "100%",
                  background: `linear-gradient(180deg, ${i === projValues.length - 1 ? C.gold : C.emerald}, ${i === projValues.length - 1 ? C.goldDim : C.emerald} )`,
                  borderRadius: "4px 4px 0 0",
                  height: `${(v / maxProj) * 100}%`,
                  minHeight: 8,
                  transition: "height .8s ease",
                }}
              />
              <div style={{ fontSize: 10, color: C.textMuted }}>Y{projYears[i]}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Tag label="Growth Rate: 11% CAGR" color={C.emerald} />
          <Tag label="Inflation adjusted" color={C.textDim} bg="rgba(255,255,255,0.05)" />
          <Tag label="Based on current portfolio" color={C.textDim} bg="rgba(255,255,255,0.05)" />
        </div>
      </div>

      <div className="card" style={{ padding: "24px" }}>
        <div className="section-label">Investment Maturity Schedule</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 8 }}>
          <thead>
            <tr>
              {["Instrument", "Current Value", "Maturity", "Expected Value", "Expected Return"].map((h) => (
                <th
                  key={h}
                  style={{ textAlign: "left", padding: "6px 12px", color: C.textMuted, fontWeight: 600, fontSize: 11 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.investments
              .filter((i) => i.maturity)
              .map((inv) => (
                <tr key={inv.type} style={{ borderTop: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{inv.type}</td>
                  <td style={{ padding: "10px 12px" }}>{fmt.inr(inv.currentValue)}</td>
                  <td style={{ padding: "10px 12px", color: C.gold }}>{inv.maturity}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{fmt.inr(Math.round(inv.currentValue * 1.08))}</td>
                  <td style={{ padding: "10px 12px", color: C.emerald, fontWeight: 600 }}>+{fmt.inr(Math.round(inv.currentValue * 0.08))}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChatPage({ data }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I'm your Financial Dashboard assistant. I have analyzed **${data.profile.name}'s** complete financial profile. Ask me anything about your finances — net worth, investments, insurance, projections, or recommendations.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPrompts = [
    "What is my current net worth?",
    "Which investment gives the highest return?",
    "Am I financially healthy?",
    "What will my wealth be after 10 years?",
    "Do I have active insurance?",
    "How diversified is my portfolio?",
  ];

  const generateReply = (text) => {
    const normalized = text.toLowerCase();

    if (normalized.includes("net worth")) {
      return `Your current net worth is **${fmt.inr(data.netWorth.current)}**. Your asset base is strong with **${fmt.inr(data.netWorth.assets)}** in assets and a well-managed liability profile.`;
    }
    if (normalized.includes("highest return") || normalized.includes("best return")) {
      const best = [...data.investments].sort((a, b) => b.cagr - a.cagr)[0];
      return `The highest return is from **${best.type}** at **${best.cagr}% CAGR**. Its current value is **${fmt.inr(best.currentValue)}**.`;
    }
    if (normalized.includes("financially healthy") || normalized.includes("financial health")) {
      return `Your financial health score is **${data.scores.financialHealth}/100**. You are in a strong position with disciplined savings and diversified investments.`;
    }
    if (normalized.includes("10 years") || normalized.includes("year projection") || normalized.includes("wealth be")) {
      return `Based on the current portfolio, your 10-year projection is **${fmt.inr(data.projections.yr10)}**. This assumes continued growth and disciplined savings.`;
    }
    if (normalized.includes("insurance")) {
      const activeCount = data.insurance.filter((item) => item.status === "Active").length;
      return `You have **${activeCount} active policies**. Total coverage is **${fmt.inr(data.insurance.reduce((sum, item) => sum + item.coverage, 0))}**.`;
    }
    if (normalized.includes("diversified")) {
      return `Your investment diversity score is **${data.scores.investmentDiversity}/100**. You have exposure across mutual funds, FDs, EPF, stocks, PPF, NPS, gold, and SIPs.`;
    }
    if (normalized.includes("balance") || normalized.includes("bank")) {
      return `Your current bank balance is **${fmt.inr(data.banking.currentBalance)}** across **${data.banking.accounts} accounts** with **${data.banking.banks.length} banks**.`;
    }

    return `I can help with net worth, investment returns, insurance status, projections, and financial health. Ask me about those topics for a precise summary.`;
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));
    const reply = generateReply(msg);
    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  const renderMessage = (content) => {
    return content.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${C.gold}">$1</strong>`).replace(/\n/g, "<br/>");
  };

  return (
    <div style={{ padding: "32px 32px", animation: "fadeIn .4s ease", height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 12, color: C.gold, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
        AI Assistant
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginBottom: 16 }}>Ask Your Financial Advisor</h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {quickPrompts.map((p) => (
          <button key={p} className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 12, borderRadius: 20 }} onClick={() => sendMessage(p)}>
            {p}
          </button>
        ))}
      </div>

      <div className="card" style={{ flex: 1, padding: "20px", overflowY: "auto", marginBottom: 14, display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", animation: "slideIn .3s ease" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: m.role === "assistant" ? `linear-gradient(135deg, ${C.gold}, ${C.goldDim})` : C.bg2,
                border: `1px solid ${C.border}`,
                fontSize: 13,
                fontWeight: 700,
                color: m.role === "assistant" ? "#0B0F14" : C.text,
              }}
            >
              {m.role === "assistant" ? "F" : "R"}
            </div>
            <div
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 14,
                fontSize: 14,
                lineHeight: 1.7,
                background: m.role === "assistant" ? "rgba(212,168,67,0.06)" : C.glass,
                border: `1px solid ${m.role === "assistant" ? "rgba(212,168,67,0.2)" : C.border}`,
              }}
              dangerouslySetInnerHTML={{ __html: renderMessage(m.content) }}
            />
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#0B0F14",
              }}
            >
              F
            </div>
            <div style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.2)" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, animation: `pulse 1.4s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          className="input-field"
          style={{ flex: 1, padding: "13px 18px" }}
          placeholder="Ask anything about your finances..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
        />
        <button className="btn btn-gold" style={{ padding: "13px 20px" }} onClick={() => sendMessage()} disabled={loading}>
          {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : "Send ↗"}
        </button>
      </div>
    </div>
  );
}

function AnalyzingLoader({ files, isDemo }) {
  const steps = isDemo
    ? [
        "Loading demo financial data...",
        "Building profile structure...",
        "Running AI analytics...",
        "Generating insights...",
        "Ready!",
      ]
    : [
        `Processing ${files.length || 1} document(s)...`,
        "Extracting financial entities...",
        "Running banking analysis...",
        "Analyzing investment portfolio...",
        "Scoring financial health...",
        "Generating AI insights...",
        "Compiling wealth profile...",
      ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s < steps.length - 1 ? s + 1 : s)), isDemo ? 400 : 700);
    return () => clearInterval(t);
  }, [isDemo, steps.length]);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center", padding: "60px 20px" }} className="fade-in">
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          margin: "0 auto 28px",
          animation: "glow 2s infinite",
        }}
      >
        🧠
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Analyzing Your Finances</h2>
      <p style={{ color: C.textMuted, marginBottom: 32, fontSize: 14 }}>
        Financial Dashboard is building your complete wealth intelligence profile
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              borderRadius: 10,
              background: i <= step ? "rgba(212,168,67,0.08)" : C.glass,
              border: `1px solid ${i <= step ? "rgba(212,168,67,0.25)" : C.border}`,
              transition: "all .3s",
              opacity: i > step + 1 ? 0.3 : 1,
            }}
          >
            <span style={{ fontSize: 16 }}>{i < step ? "✓" : i === step ? "⟳" : "○"}</span>
            <span style={{ fontSize: 13, color: i <= step ? C.text : C.textMuted, fontWeight: i === step ? 600 : 400 }}>{s}</span>
          </div>
        ))}
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / (steps.length - 1)) * 100}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.emerald})` }} />
      </div>
    </div>
  );
}

function App() {
  const [phase, setPhase] = useState("upload");
  const [analyzing, setAnalyzing] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [files, setFiles] = useState([]);
  const [data, setData] = useState(null);
  const [activeNav, setActiveNav] = useState("overview");
  const styleRef = useRef(false);

  useEffect(() => {
    if (styleRef.current) return;
    styleRef.current = true;
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
  }, []);

  const handleAnalyze = useCallback(async (uploadedFiles, demo = false) => {
    setIsDemo(demo);
    setFiles(uploadedFiles);
    setAnalyzing(true);
    setPhase("analyzing");

    await new Promise((resolve) => setTimeout(resolve, demo ? 2200 : 4500));

    setData(DEMO_DATA);
    setPhase("dashboard");
    setAnalyzing(false);
  }, []);

  const renderPage = () => {
    if (!data) return null;
    switch (activeNav) {
      case "overview":
        return <OverviewPage data={data} />;
      case "profile":
        return <ProfilePage data={data} />;
      case "banking":
        return <BankingPage data={data} />;
      case "investments":
        return <InvestmentsPage data={data} />;
      case "insurance":
        return <InsurancePage data={data} />;
      case "analytics":
        return <AnalyticsPage data={data} />;
      case "projections":
        return <ProjectionsPage data={data} />;
      case "chat":
        return <ChatPage data={data} />;
      default:
        return <OverviewPage data={data} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg0 }}>
      {phase === "upload" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 20px" }}>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              padding: "16px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(11,15,20,0.85)",
              backdropFilter: "blur(16px)",
              borderBottom: `1px solid ${C.border}`,
              zIndex: 100,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: "#0B0F14",
                }}
              >
                F
              </div>
              <span style={{ fontWeight: 800, letterSpacing: -0.3 }}>
                Financial Dashboard
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Tag label="256-bit Encryption" color={C.emerald} />
              <Tag label="SOC 2 Compliant" color={C.blue} />
            </div>
          </div>
          <div style={{ paddingTop: 60 }}>
            <UploadPanel onAnalyze={handleAnalyze} analyzing={analyzing} />
          </div>
        </div>
      )}

      {phase === "analyzing" && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 20px" }}>
          <AnalyzingLoader files={files} isDemo={isDemo} />
        </div>
      )}

      {phase === "dashboard" && data && (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar active={activeNav} onSelect={setActiveNav} data={data} />
          <main style={{ flex: 1, overflow: "auto", background: C.bg0 }}>
            <div
              style={{
                padding: "14px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(16,24,39,0.85)",
                backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${C.border}`,
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, color: C.textDim }}>
                {NAV.find((n) => n.id === activeNav)?.icon} <span style={{ color: C.text, marginLeft: 4 }}>{NAV.find((n) => n.id === activeNav)?.label}</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Tag label={`Net Worth: ${fmt.inr(data.netWorth.current)}`} color={C.gold} />
                <button className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: 12 }} onClick={() => setPhase("upload")}>Upload New</button>
              </div>
            </div>
            {renderPage()}
          </main>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
