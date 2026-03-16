import { useState, useEffect } from "react";

const SEED_PROGRAMS = [
  { id: "seed-1", company: "Kitchen Warehouse", program: "The Great Pan Exchange", category: "Cookware", items: "pots pans baking trays frying pan wok casserole iron steel aluminium copper non-stick cookware", itemsNot: "Ceramic, glass, non-metal cookware", cost: "Free", reward: "10% off a new Tefal pan", whatHappens: "Metals stripped and recycled; every component including handles given a second life.", howTo: "Drop off old cookware at any Kitchen Warehouse store collection bin.", notes: "kitchenwarehouse.com.au — The Great Pan Exchange", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-2", company: "Tefal (via Myer)", program: "Act Together", category: "Cookware", items: "pots pans frying pan wok casserole iron steel aluminium copper cookware any brand", itemsNot: "Non-metal cookware, ceramic, glass", cost: "Free", reward: "None", whatHappens: "EcoCycle processes metals; aluminium, stainless steel, cast iron and copper recycled and repurposed.", howTo: "Drop off at designated bins in 14 selected Myer stores across Australian capital cities.", notes: "tefal.com.au — first dedicated cookware recycling scheme in Australia (2023)", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-3", company: "Officeworks", program: "Bring it Back", category: "Electronics / Stationery", items: "computer laptop monitor printer phone hard drive keyboard mouse cable ink toner cartridge pen marker stationery tablet electronics e-waste headphones charger", itemsNot: "Large appliances, toasters, hair dryers, vacuums, smoke detectors, broken screens, swollen batteries", cost: "Free for most small electronics; larger items may incur a small fee", reward: "Working phones/laptops/tablets can earn gift cards via Tech Trade-In", whatHappens: "Copper and steel processed by ANZ RP; plastics by Close the Loop; pens turned into outdoor furniture via TerraCycle & BIC.", howTo: "Drop off at dedicated bins in any of 173 Officeworks stores nationwide.", notes: "officeworks.com.au/recycling", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-4", company: "MECCA", program: "Beauty Product Free Recycling (TerraCycle)", category: "Beauty / Personal Care", items: "makeup mascara foundation concealer lipstick lip gloss lip balm eyeliner eyeshadow blush skincare moisturiser serum toner cleanser shampoo conditioner perfume fragrance glass bottle beauty packaging cosmetics", itemsNot: "Outer cardboard packaging, items still containing product", cost: "Free", reward: "None", whatHappens: "Items cleaned, separated by material type; plastics recycled into raw formats for new products.", howTo: "Drop empties into TerraCycle collection bins at any MECCA store.", notes: "mecca.com.au — 1M+ empties diverted from landfill to date", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-5", company: "H&M", program: "Garment Collecting Program", category: "Clothing / Textiles", items: "clothing clothes shirt pants jeans dress jacket coat sweater jumper knitwear sportswear t-shirt tops skirt shorts accessories scarf hat gloves any brand garment textile worn ripped stained", itemsNot: "Underwear, wired bras, bags", cost: "Free", reward: "Reward voucher (~15% off next H&M purchase — confirm in-store)", whatHappens: "60% donated to charities; remainder shredded into insulation, cleaning cloths; ~0.1% woven into new material.", howTo: "Drop washed items into garment collection bins in H&M stores.", notes: "hm.com/en_au — world's largest garment collecting program since 2013", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-6", company: "Zara", program: "Textile Collection Program", category: "Clothing / Textiles", items: "clothing clothes shirt pants jeans dress jacket coat sweater jumper textile any condition garment", itemsNot: "Items in poor hygiene condition", cost: "Free", reward: "None", whatHappens: "Wearable items donated or sold second-hand; rest recycled into blankets, seat padding or other materials.", howTo: "Drop washed clothing into collection bins in select Zara stores.", notes: "zara.com/au", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-7", company: "Uniqlo", program: "RE.UNIQLO / All-Product Recycling", category: "Clothing / Textiles", items: "uniqlo clothing fleece down jacket puffer thermal heattech airism uniqlo brand garment", itemsNot: "Other brands, underwear, socks", cost: "Free", reward: "None", whatHappens: "Wearable items donated to NGO partners globally; worn items recycled into new Uniqlo products.", howTo: "Drop off Uniqlo clothing at any Uniqlo store recycling bin.", notes: "uniqlo.com/au — Uniqlo-branded only", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-8", company: "Macpac (via Upparel)", program: "Macpac Clothing Recycling", category: "Clothing / Textiles", items: "macpac jacket fleece outdoor clothing hiking gear activewear macpac brand", itemsNot: "Non-Macpac items, unwashed items", cost: "$35+ for a pickup collection (up to 10kg in 1 box)", reward: "$25 Macpac store voucher (first collection only; min. $100 spend)", whatHappens: "65% reused/donated; 35% upcycled or recycled into insulation and track surfaces.", howTo: "Book contactless pickup via upparel.com.au/macpac or drop off at select store bins.", notes: "macpac.com.au — in partnership with Upparel", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-9", company: "Banish (BRAD Program)", program: "BRAD — Banish Recycling and Diversion", category: "Hard-to-Recycle", items: "blister pack medicine foil pill pack toothpaste tube coffee pod bottle cap lid beauty packaging soft plastic chip bag wrapper cling wrap zip lock bag bread bag", itemsNot: "Batteries, pressurised canisters, aerosols, pesticides, oil paint, medical sharps, food waste, broken glass, hazardous", cost: "$15 per collection (includes postage label + recycling)", reward: "None", whatHappens: "Sorted by type and sent to Australian micro-recyclers; all waste recycled onshore.", howTo: "Purchase a BRAD collection label at banish.com.au, pack into a box/satchel, post via Australia Post.", notes: "banish.com.au/pages/recycling-program — 3.2M+ pieces diverted since 2020", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-10", company: "TerraCycle Australia", program: "Free Recycling Programs (brand-sponsored)", category: "Beauty / Household / Stationery", items: "garnier loreal maybelline schwarzkopf gillette razor beauty packaging dish soap air freshener glad bag writing pen bic pen marker highlighter shampoo bottle hair dye packaging beauty empty", itemsNot: "Wet items, hazardous materials, outer cardboard packaging", cost: "Free (programs funded by brand sponsors)", reward: "TerraCycle points per kg — redeemable as donations to schools/charities", whatHappens: "Sorted by material type; turned into park benches, bike racks, pet food bowls, outdoor furniture.", howTo: "Sign up at terracycle.com/en-AU, join relevant program, drop off at community hubs or mail with free prepaid label.", notes: "terracycle.com/en-AU — programs in every postcode across Australia", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-11", company: "Container Deposit Schemes", program: "Return and Earn / Containers for Change", category: "Beverage Containers", items: "aluminium can beer can soft drink can soda can sparkling water bottle plastic bottle juice bottle water bottle glass bottle drink bottle beverage container", itemsNot: "Milk cartons, juice cartons, wine bottles, spirit bottles, cordial, food cans", cost: "Free", reward: "10 cents refund per eligible container (cash, voucher or charity donation)", whatHappens: "Containers sorted; aluminium, glass and plastic recycled into new packaging and products.", howTo: "Return to a reverse vending machine, depot or authorised collection point in your state.", notes: "ACT: actsmart.act.gov.au | NSW: returnandearnanywhere.com.au | QLD: containersforchange.com.au", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-12", company: "B-cycle", program: "Battery Recycling", category: "Batteries", items: "battery batteries AA AAA C D 9V button cell coin cell lithium ion rechargeable phone battery laptop battery power tool battery alkaline battery watch battery", itemsNot: "Car batteries, large industrial batteries", cost: "Free", reward: "None", whatHappens: "Batteries safely processed to recover lithium, cobalt, nickel, manganese for reuse in new batteries.", howTo: "Drop off at any B-cycle collection point — supermarkets, hardware stores, offices. Find via b-cycle.com.au.", notes: "b-cycle.com.au — national battery stewardship scheme", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-13", company: "Pharmacies (RUM Project)", program: "Return Unwanted Medicines", category: "Pharmaceuticals", items: "medicine medication tablets pills capsules vitamins supplements expired medicine old prescription antibiotics paracetamol ibuprofen panadol nurofen over the counter drugs", itemsNot: "Sharps/needles, chemotherapy drugs, large volumes of liquid medications", cost: "Free", reward: "None", whatHappens: "Collected medicines safely incinerated at high temperatures to prevent environmental contamination.", howTo: "Take unwanted medicines in original packaging to any participating pharmacy.", notes: "returnmed.com.au — government-backed program", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
];

const ADMIN_PASSWORD = "recycle2026";
const CATEGORIES = ["Cookware", "Electronics / Stationery", "Beauty / Personal Care", "Clothing / Textiles", "Hard-to-Recycle", "Batteries", "Beverage Containers", "Pharmaceuticals", "Other"];
const EMPTY_FORM = { company: "", program: "", category: "", items: "", itemsNot: "", cost: "", reward: "", whatHappens: "", howTo: "", notes: "" };
const STORAGE_KEY = "recycling-programs-v2";

// All Claude calls go through our Vercel proxy — API key stays server-side
async function callClaude(messages, systemPrompt = "") {
  const body = { model: "claude-sonnet-4-20250514", max_tokens: 1000, messages };
  if (systemPrompt) body.system = systemPrompt;
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content?.map(c => c.text || "").join("") || "";
}

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setAndStore = (newValue) => {
    const resolved = typeof newValue === "function" ? newValue(value) : newValue;
    setValue(resolved);
    try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
  };

  return [value, setAndStore];
}

export default function App() {
  const [view, setView] = useState("search");
  const [programs, setPrograms] = useLocalStorage(STORAGE_KEY, SEED_PROGRAMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState({ done: 0, total: 0, current: "" });
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [toast, setToast] = useState(null);

  // Seed if storage is empty or missing seed programs
  useEffect(() => {
    if (!programs || programs.length === 0) setPrograms(SEED_PROGRAMS);
  }, []);

  // Auto status check on load for stale programs (>7 days)
  useEffect(() => {
    if (programs.length === 0) return;
    const stale = programs.filter(p => !p.lastChecked || Date.now() - new Date(p.lastChecked).getTime() > 7 * 24 * 60 * 60 * 1000);
    if (stale.length > 0) runStatusCheck(programs, stale);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const runStatusCheck = async (allPrograms, toCheck) => {
    setChecking(true);
    let updated = [...allPrograms];
    for (let i = 0; i < toCheck.length; i++) {
      const p = toCheck[i];
      setCheckProgress({ done: i, total: toCheck.length, current: p.company });
      try {
        const raw = await callClaude(
          [{ role: "user", content: `Is this Australian recycling program still operating as of 2025–2026? Company: ${p.company}, Program: ${p.program}, Notes: ${p.notes}. Reply with JSON only: {"status":"active"|"possibly_inactive"|"unknown","reason":"one short sentence"}` }],
          "You are a factual assistant. Reply only with valid JSON, no markdown."
        );
        const result = JSON.parse(raw.replace(/```json|```/g, "").trim());
        updated = updated.map(x => x.id === p.id ? { ...x, status: result.status, statusReason: result.reason, lastChecked: new Date().toISOString() } : x);
      } catch {
        updated = updated.map(x => x.id === p.id ? { ...x, status: "unknown", lastChecked: new Date().toISOString() } : x);
      }
      await new Promise(r => setTimeout(r, 400));
    }
    setPrograms(updated);
    setCheckProgress({ done: toCheck.length, total: toCheck.length, current: "" });
    setChecking(false);
  };

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setSearching(true);
    setSearchResults(null);
    const active = programs.filter(p => p.status !== "inactive");
    const dataStr = active.map(p => `ID:${p.id} | Company:${p.company} | Category:${p.category} | Items:${p.items}`).join("\n");
    try {
      const raw = await callClaude(
        [{ role: "user", content: `User searched: "${q}"\n\nPrograms:\n${dataStr}\n\nReturn JSON only: {"matched":["id1","id2"...],"summary":"max 25 words","tip":"optional max 20 word tip or null"}` }],
        "You are a recycling lookup assistant for Australia. Return only valid JSON, no markdown. Be generous with matching."
      );
      const result = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const matched = (result.matched || []).map(id => active.find(p => p.id === id)).filter(Boolean);
      setSearchResults({ programs: matched, summary: result.summary, tip: result.tip });
    } catch {
      const q2 = q.toLowerCase();
      const fallback = active.filter(p => p.items?.toLowerCase().includes(q2) || p.category?.toLowerCase().includes(q2) || p.company?.toLowerCase().includes(q2));
      setSearchResults({ programs: fallback, summary: `Results for "${q}"`, tip: null });
    }
    setSearching(false);
  };

  const submitProgram = async () => {
    if (!form.company || !form.program || !form.category || !form.items) return;
    setSubmitting(true);
    const newProgram = { ...form, id: `user-${Date.now()}`, verified: false, status: "active", lastChecked: null, submittedBy: "public", submittedAt: new Date().toISOString() };
    setPrograms(prev => [...prev, newProgram]);
    setForm(EMPTY_FORM);
    setSubmitDone(true);
    setSubmitting(false);
    setTimeout(() => setSubmitDone(false), 4000);
  };

  const verifyProgram = (id) => { setPrograms(prev => prev.map(p => p.id === id ? { ...p, verified: true } : p)); showToast("Program verified ✓"); };
  const removeProgram = (id) => { setPrograms(prev => prev.filter(p => p.id !== id)); showToast("Program removed", "warn"); };
  const forceCheck = () => { const reset = programs.map(p => ({ ...p, lastChecked: null })); setPrograms(reset); runStatusCheck(reset, reset); };

  const unverified = programs.filter(p => !p.verified);
  const flagged = programs.filter(p => p.status === "possibly_inactive");

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f0", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #aaa; }
        input, textarea, select, button { font-family: inherit; }
        .fade-in { animation: fadeIn 0.35s ease both; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        .card-in { animation: cardIn 0.3s ease both; }
        @keyframes cardIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        .spin { animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .nav-btn { background: none; border: none; padding: 10px 18px; border-radius: 10px; font-size: 0.88rem; font-weight: 500; color: #6b7280; cursor: pointer; transition: all 0.15s; }
        .nav-btn:hover { background: #e8f0e8; color: #2d6a2d; }
        .nav-btn.active { background: #2d6a2d; color: #fff; }
        .pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 0.73rem; font-weight: 600; letter-spacing: 0.03em; }
        .pill-cat { background: #e8f5e8; color: #2d6a2d; }
        .pill-free { background: #e8f5e8; color: #1b5e1b; }
        .pill-cost { background: #fdecea; color: #b71c1c; }
        .pill-reward { background: #fdf6e3; color: #b8860b; }
        .pill-unverified { background: #fff3e0; color: #e65100; }
        .pill-inactive { background: #fce4ec; color: #880e4f; }
        .chip { background: #eef4ee; border: 1px solid #c5d9c5; color: #3a6b3a; font-size: 0.8rem; padding: 5px 12px; border-radius: 20px; cursor: pointer; transition: all 0.15s; }
        .chip:hover { background: #d4ebd4; border-color: #2d6a2d; }
        .field label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.09em; color: #6b7280; font-weight: 600; margin-bottom: 5px; }
        .field input, .field textarea, .field select { width: 100%; border: 1.5px solid #dde8dd; border-radius: 10px; padding: 10px 13px; font-size: 0.9rem; background: #fff; color: #1a1a1a; transition: border-color 0.15s; outline: none; }
        .field input:focus, .field textarea:focus, .field select:focus { border-color: #2d6a2d; }
        .field textarea { resize: vertical; min-height: 70px; }
        .submit-btn { background: #2d6a2d; color: #fff; border: none; border-radius: 12px; padding: 13px 28px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
        .submit-btn:hover { background: #3d8a3d; }
        .submit-btn:disabled { background: #a5c4a5; cursor: not-allowed; }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "warn" ? "#3e2723" : "#2d6a2d", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: "0.88rem", fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          {toast.msg}
        </div>
      )}

      {checking && (
        <div style={{ background: "#e8f5e8", borderBottom: "1px solid #c5d9c5", padding: "10px 20px", textAlign: "center", fontSize: "0.83rem", color: "#2d6a2d", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div className="spin" style={{ width: 14, height: 14, border: "2px solid #c5d9c5", borderTopColor: "#2d6a2d", borderRadius: "50%", flexShrink: 0 }} />
          Checking program status… {checkProgress.done}/{checkProgress.total}
          {checkProgress.current && <span style={{ color: "#6b7280" }}>— {checkProgress.current}</span>}
        </div>
      )}

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ padding: "40px 0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#2d6a2d", letterSpacing: "-0.03em", lineHeight: 1.05 }}>♻️ Can I recycle this?</h1>
            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: 5, fontWeight: 300 }}>Australian take-back & recycling programs</p>
          </div>
          <nav style={{ display: "flex", gap: 6, background: "#fff", border: "1.5px solid #dde8dd", borderRadius: 14, padding: 5 }}>
            <button className={`nav-btn${view === "search" ? " active" : ""}`} onClick={() => setView("search")}>🔍 Search</button>
            <button className={`nav-btn${view === "submit" ? " active" : ""}`} onClick={() => setView("submit")}>＋ Add Program</button>
            <button className={`nav-btn${view === "admin" ? " active" : ""}`} onClick={() => setView("admin")}>
              🛡 Admin
              {(unverified.length + flagged.length) > 0 && (
                <span style={{ background: "#e53e3e", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", marginLeft: 4 }}>
                  {unverified.length + flagged.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* SEARCH */}
        {view === "search" && (
          <div className="fade-in">
            <div style={{ background: "#fff", border: "2px solid #c5d9c5", borderRadius: 18, display: "flex", overflow: "hidden", boxShadow: "0 4px 24px rgba(45,106,45,0.08)", marginBottom: 14 }}>
              <input
                style={{ flex: 1, border: "none", outline: "none", padding: "17px 20px", fontSize: "1.05rem", background: "transparent" }}
                placeholder="e.g. old frying pan, mascara, AA batteries, winter jacket…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doSearch(searchQuery)}
              />
              <button onClick={() => doSearch(searchQuery)} style={{ margin: 6, background: "#2d6a2d", color: "#fff", border: "none", borderRadius: 12, padding: "12px 22px", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                {searching ? <div className="spin" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%" }} /> : "Search"}
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 32 }}>
              {["frying pan", "mascara", "AA batteries", "old jeans", "expired medicine", "ink cartridge", "soft drink can", "coffee pod", "laptop", "toothpaste tube"].map(t => (
                <button key={t} className="chip" onClick={() => { setSearchQuery(t); doSearch(t); }}>{t}</button>
              ))}
            </div>

            {searching && (
              <div style={{ textAlign: "center", padding: 48, color: "#6b7280" }}>
                <div className="spin" style={{ width: 28, height: 28, border: "3px solid #c5d9c5", borderTopColor: "#2d6a2d", borderRadius: "50%", display: "inline-block", marginBottom: 14 }} />
                <p style={{ fontSize: "0.92rem" }}>Searching recycling programs…</p>
              </div>
            )}

            {searchResults && !searching && (
              <div className="fade-in">
                {searchResults.summary && <p style={{ marginBottom: 16, color: "#5c4033", fontSize: "0.9rem", fontStyle: "italic" }}>💡 {searchResults.summary}</p>}
                {searchResults.programs.length === 0 ? (
                  <div style={{ background: "#fff", border: "2px dashed #c5d9c5", borderRadius: 16, padding: "40px 28px", textAlign: "center" }}>
                    <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>🌿</div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.15rem", color: "#5c4033" }}>No programs found for this item</h3>
                    <p style={{ color: "#6b7280", marginTop: 8, fontSize: "0.88rem", lineHeight: 1.6 }}>Try your kerbside bin or check your local council's website.</p>
                    <button className="chip" style={{ marginTop: 16 }} onClick={() => setView("submit")}>＋ Add a program</button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280", fontWeight: 600, marginBottom: 14 }}>{searchResults.programs.length} program{searchResults.programs.length !== 1 ? "s" : ""} found</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {searchResults.programs.map((p, i) => <ProgramCard key={p.id} program={p} delay={i * 0.07} />)}
                    </div>
                  </div>
                )}
                {searchResults.tip && <p style={{ marginTop: 18, color: "#6b7280", fontSize: "0.8rem", textAlign: "center" }}>💡 {searchResults.tip}</p>}
              </div>
            )}

            {!searchResults && !searching && (
              <div>
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b7280", fontWeight: 600, marginBottom: 14 }}>All {programs.filter(p => p.status !== "inactive").length} programs</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {programs.filter(p => p.status !== "inactive").map((p, i) => <ProgramCard key={p.id} program={p} delay={i * 0.04} compact />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBMIT */}
        {view === "submit" && (
          <div className="fade-in" style={{ maxWidth: 620 }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#2d6a2d" }}>Add a recycling program</h2>
              <p style={{ color: "#6b7280", fontSize: "0.88rem", marginTop: 6 }}>Submissions go live immediately and are flagged for review. Fields marked * are required.</p>
            </div>
            {submitDone && (
              <div style={{ background: "#e8f5e8", border: "1.5px solid #a5d6a5", borderRadius: 12, padding: "14px 18px", marginBottom: 20, color: "#1b5e1b", fontSize: "0.9rem" }}>
                ✅ Program submitted — thank you!
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Company *</label><input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. H&M" /></div>
                <div className="field"><label>Program name *</label><input value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} placeholder="e.g. Garment Collecting" /></div>
              </div>
              <div className="field">
                <label>Category *</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field"><label>Items accepted * (descriptive — used for search)</label><textarea value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} placeholder="e.g. clothing, jackets, jeans, shirts, worn, ripped, any brand..." /></div>
              <div className="field"><label>Items NOT accepted</label><input value={form.itemsNot} onChange={e => setForm(f => ({ ...f, itemsNot: e.target.value }))} placeholder="e.g. underwear, wired bras" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Cost to recycle</label><input value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} placeholder="Free / $15 per box…" /></div>
                <div className="field"><label>Rewards / discount</label><input value={form.reward} onChange={e => setForm(f => ({ ...f, reward: e.target.value }))} placeholder="e.g. 10% off, None" /></div>
              </div>
              <div className="field"><label>What happens to the waste</label><textarea value={form.whatHappens} onChange={e => setForm(f => ({ ...f, whatHappens: e.target.value }))} placeholder="e.g. Items sorted and sent to recyclers…" /></div>
              <div className="field"><label>How to participate</label><textarea value={form.howTo} onChange={e => setForm(f => ({ ...f, howTo: e.target.value }))} placeholder="e.g. Drop off at any store bin…" /></div>
              <div className="field"><label>Website / notes</label><input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. hm.com/en_au" /></div>
            </div>
            <button className="submit-btn" style={{ marginTop: 24 }} disabled={submitting || !form.company || !form.program || !form.category || !form.items} onClick={submitProgram}>
              {submitting ? "Submitting…" : "Submit program →"}
            </button>
          </div>
        )}

        {/* ADMIN */}
        {view === "admin" && (
          <div className="fade-in">
            {!adminAuthed ? (
              <div style={{ maxWidth: 380 }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#2d6a2d", marginBottom: 20 }}>Admin access</h2>
                <div className="field">
                  <label>Password</label>
                  <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { adminPass === ADMIN_PASSWORD ? (setAdminAuthed(true), setAdminError("")) : setAdminError("Incorrect password"); }}} placeholder="Enter admin password" />
                </div>
                {adminError && <p style={{ color: "#c0392b", fontSize: "0.83rem", marginTop: 8 }}>{adminError}</p>}
                <button className="submit-btn" style={{ marginTop: 14 }} onClick={() => adminPass === ADMIN_PASSWORD ? (setAdminAuthed(true), setAdminError("")) : setAdminError("Incorrect password")}>Unlock →</button>
                <p style={{ color: "#9ca3af", fontSize: "0.75rem", marginTop: 10 }}>Default password: recycle2026 — change in src/App.jsx before deploying</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#2d6a2d" }}>Admin Panel</h2>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="chip" onClick={forceCheck} disabled={checking}>{checking ? "Checking…" : "🔄 Re-check all programs"}</button>
                    <button className="chip" style={{ color: "#c0392b", borderColor: "#f5c6cb" }} onClick={() => setAdminAuthed(false)}>Sign out</button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
                  {[{ label: "Total programs", value: programs.length, color: "#2d6a2d" }, { label: "Pending review", value: unverified.length, color: "#e65100" }, { label: "Flagged inactive", value: flagged.length, color: "#880e4f" }, { label: "Verified", value: programs.filter(p => p.verified).length, color: "#1b5e1b" }].map(s => (
                    <div key={s.label} style={{ background: "#fff", border: "1.5px solid #e0e8e0", borderRadius: 12, padding: "16px 18px" }}>
                      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: "0.77rem", color: "#6b7280", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {unverified.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#e65100", marginBottom: 12 }}>⏳ Pending review ({unverified.length})</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {unverified.map(p => <AdminRow key={p.id} program={p} onVerify={verifyProgram} onRemove={removeProgram} />)}
                    </div>
                  </div>
                )}

                {flagged.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#880e4f", marginBottom: 12 }}>⚠️ Possibly inactive ({flagged.length})</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {flagged.map(p => <AdminRow key={p.id} program={p} onVerify={verifyProgram} onRemove={removeProgram} flagMode />)}
                    </div>
                  </div>
                )}

                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#2d6a2d", marginBottom: 12 }}>All programs ({programs.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {programs.map(p => <AdminRow key={p.id} program={p} onVerify={verifyProgram} onRemove={removeProgram} />)}
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}

function ProgramCard({ program: p, delay = 0, compact = false }) {
  const [expanded, setExpanded] = useState(!compact);
  const isFree = p.cost?.toLowerCase() === "free";
  const hasCost = p.cost && p.cost !== "Free" && p.cost !== "None";
  const hasReward = p.reward && p.reward !== "None";

  return (
    <div className="card-in" onClick={compact ? () => setExpanded(v => !v) : undefined}
      style={{ background: "#fff", border: "1.5px solid #e0e8e0", borderLeft: "4px solid #2d6a2d", borderRadius: 14, padding: compact ? "14px 18px" : "20px 22px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", animationDelay: `${delay}s`, cursor: compact ? "pointer" : "default" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: compact ? "0.98rem" : "1.1rem" }}>{p.company}</div>
          <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: 2 }}>{p.program}</div>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          <span className="pill pill-cat">{p.category}</span>
          {isFree && <span className="pill pill-free">✓ Free</span>}
          {hasCost && <span className="pill pill-cost">💰 Paid</span>}
          {hasReward && <span className="pill pill-reward">🎁 Reward</span>}
          {!p.verified && <span className="pill pill-unverified">Unverified</span>}
          {p.status === "possibly_inactive" && <span className="pill pill-inactive">⚠ May be inactive</span>}
        </div>
      </div>

      {p.status === "possibly_inactive" && p.statusReason && (
        <div style={{ background: "#fce4ec", borderRadius: 8, padding: "7px 11px", marginTop: 10, fontSize: "0.8rem", color: "#880e4f" }}>⚠️ {p.statusReason}</div>
      )}

      {expanded && (
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
          {[
            { label: "Items accepted", value: p.items?.split(" ").slice(0, 12).join(", ") + (p.items?.split(" ").length > 12 ? "…" : ""), full: true },
            { label: "Cost", value: p.cost },
            { label: "Reward / discount", value: p.reward || "None" },
            { label: "What happens to items", value: p.whatHappens },
            { label: "How to participate", value: p.howTo },
            { label: "Website / notes", value: p.notes },
          ].filter(f => f.value).map(f => (
            <div key={f.label} style={{ gridColumn: f.full ? "1/-1" : undefined }}>
              <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", fontWeight: 600, marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: "0.86rem", color: "#374151", lineHeight: 1.5 }}>{f.value}</div>
            </div>
          ))}
          {p.lastChecked && <div style={{ gridColumn: "1/-1", fontSize: "0.73rem", color: "#9ca3af", marginTop: 4 }}>Last status check: {new Date(p.lastChecked).toLocaleDateString("en-AU")}</div>}
        </div>
      )}
      {compact && <div style={{ marginTop: 6, fontSize: "0.73rem", color: "#9ca3af" }}>{expanded ? "▲ less" : "▼ more"}</div>}
    </div>
  );
}

function AdminRow({ program: p, onVerify, onRemove, flagMode = false }) {
  return (
    <div style={{ background: flagMode ? "#fff8f8" : "#fafafa", border: `1.5px solid ${flagMode ? "#f5c6cb" : "#e0e8e0"}`, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{p.company} — <span style={{ fontWeight: 400, color: "#6b7280" }}>{p.program}</span></div>
        <div style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: 2 }}>
          {p.category} · {p.submittedAt ? `Submitted ${new Date(p.submittedAt).toLocaleDateString("en-AU")}` : "Seed data"}
          {p.status && p.status !== "active" && <span style={{ marginLeft: 6, color: "#880e4f" }}>· {p.status}</span>}
          {p.statusReason && <span style={{ marginLeft: 6, color: "#880e4f" }}>"{p.statusReason}"</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {!p.verified && <button onClick={() => onVerify(p.id)} style={{ background: "#e8f5e8", border: "1px solid #a5d6a5", color: "#1b5e1b", borderRadius: 8, padding: "6px 14px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>✓ Verify</button>}
        <button onClick={() => onRemove(p.id)} style={{ background: "#fdecea", border: "1px solid #f5c6cb", color: "#c0392b", borderRadius: 8, padding: "6px 14px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>Remove</button>
      </div>
    </div>
  );
}
