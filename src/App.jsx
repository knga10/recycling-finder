import { useState, useEffect } from "react";

const SEED_PROGRAMS = [
  { id: "seed-1", company: "Kitchen Warehouse", program: "The Great Pan Exchange", category: "Cookware", items: "pots pans baking trays frying pan wok casserole iron steel aluminium copper non-stick cookware", itemsNot: "Ceramic, glass, non-metal cookware", cost: "Free", reward: "10% off a new Tefal pan", whatHappens: "Metals stripped and recycled; every component including handles given a second life.", howTo: "Drop off old cookware at any Kitchen Warehouse store collection bin.", website: "https://www.kitchenwarehouse.com.au/the-great-pan-exchange", notes: "First dedicated cookware exchange in Australia", coverage: "nationwide", locationFinderUrl: "https://www.kitchenwarehouse.com.au/store-finder", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-2", company: "Tefal (via Myer)", program: "Act Together", category: "Cookware", items: "pots pans frying pan wok casserole iron steel aluminium copper cookware any brand", itemsNot: "Non-metal cookware, ceramic, glass", cost: "Free", reward: "None", whatHappens: "EcoCycle processes metals; aluminium, stainless steel, cast iron and copper recycled and repurposed.", howTo: "Drop off at designated bins in 14 selected Myer stores across Australian capital cities.", website: "https://www.tefal.com.au/act-together", notes: "Available at selected Myer stores in capital cities only", coverage: "selected-locations", locationFinderUrl: "", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-3", company: "Officeworks", program: "Bring it Back", category: "Electronics / Stationery", items: "computer laptop monitor printer phone hard drive keyboard mouse cable ink toner cartridge pen marker stationery tablet electronics e-waste headphones charger", itemsNot: "Large appliances, toasters, hair dryers, vacuums, smoke detectors, broken screens, swollen batteries", cost: "Free for most small electronics; larger items may incur a small fee", reward: "Working phones/laptops/tablets can earn gift cards via Tech Trade-In", whatHappens: "Copper and steel processed by ANZ RP; plastics by Close the Loop; pens turned into outdoor furniture via TerraCycle & BIC.", howTo: "Drop off at dedicated bins in any of 173 Officeworks stores nationwide.", website: "https://www.officeworks.com.au/information/about-us/recycling", notes: "173 stores across Australia", coverage: "nationwide", locationFinderUrl: "https://www.officeworks.com.au/store-finder", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-4", company: "MECCA", program: "Beauty Product Free Recycling (TerraCycle)", category: "Beauty / Personal Care", items: "makeup mascara foundation concealer lipstick lip gloss lip balm eyeliner eyeshadow blush skincare moisturiser serum toner cleanser shampoo conditioner perfume fragrance glass bottle beauty packaging cosmetics", itemsNot: "Outer cardboard packaging, items still containing product", cost: "Free", reward: "None", whatHappens: "Items cleaned, separated by material type; plastics recycled into raw formats for new products.", howTo: "Drop empties into TerraCycle collection bins at any MECCA store.", website: "https://www.mecca.com.au/beauty-loop/", notes: "1M+ empties diverted from landfill to date", coverage: "nationwide", locationFinderUrl: "https://www.mecca.com.au/store-finder", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-5", company: "H&M", program: "Garment Collecting Program", category: "Clothing / Textiles", items: "clothing clothes shirt pants jeans dress jacket coat sweater jumper knitwear sportswear t-shirt tops skirt shorts accessories scarf hat gloves any brand garment textile worn ripped stained", itemsNot: "Underwear, wired bras, bags", cost: "Free", reward: "Reward voucher (~15% off next H&M purchase — confirm in-store)", whatHappens: "60% donated to charities; remainder shredded into insulation, cleaning cloths; ~0.1% woven into new material.", howTo: "Drop washed items into garment collection bins in H&M stores.", website: "https://www.hm.com/en_au/sustainability/garment-collecting.html", notes: "World's largest garment collecting program — active since 2013", coverage: "nationwide", locationFinderUrl: "https://www.hm.com/en_au/store-finder", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-6", company: "Zara", program: "Textile Collection Program", category: "Clothing / Textiles", items: "clothing clothes shirt pants jeans dress jacket coat sweater jumper textile any condition garment", itemsNot: "Items in poor hygiene condition", cost: "Free", reward: "None", whatHappens: "Wearable items donated or sold second-hand; rest recycled into blankets, seat padding or other materials.", howTo: "Drop washed clothing into collection bins in select Zara stores.", website: "https://www.zara.com/au/en/z-sustainability-mkt1399.html", notes: "Available at select Zara stores", coverage: "selected-locations", locationFinderUrl: "https://www.zara.com/au/en/store-locator/stores", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-7", company: "Uniqlo", program: "RE.UNIQLO / All-Product Recycling", category: "Clothing / Textiles", items: "uniqlo clothing fleece down jacket puffer thermal heattech airism uniqlo brand garment", itemsNot: "Other brands, underwear, socks", cost: "Free", reward: "None", whatHappens: "Wearable items donated to NGO partners globally; worn items recycled into new Uniqlo products.", howTo: "Drop off Uniqlo clothing at any Uniqlo store recycling bin.", website: "https://www.uniqlo.com/au/en/sustainability/environment/all-product-recycling/", notes: "Uniqlo-branded items only", coverage: "nationwide", locationFinderUrl: "https://www.uniqlo.com/au/en/store-finder", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-8", company: "Macpac (via Upparel)", program: "Macpac Clothing Recycling", category: "Clothing / Textiles", items: "macpac jacket fleece outdoor clothing hiking gear activewear macpac brand", itemsNot: "Non-Macpac items, unwashed items", cost: "$35+ for a pickup collection (up to 10kg in 1 box)", reward: "$25 Macpac store voucher (first collection only; min. $100 spend)", whatHappens: "65% reused/donated; 35% upcycled or recycled into insulation and track surfaces.", howTo: "Book contactless pickup via Upparel or drop off at select Macpac store bins.", website: "https://www.macpac.com.au/sustainability/recycling", notes: "In partnership with Upparel. Pickup available nationally.", coverage: "nationwide", locationFinderUrl: "https://www.macpac.com.au/store-finder", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-9", company: "Banish (BRAD Program)", program: "BRAD — Banish Recycling and Diversion", category: "Hard-to-Recycle", items: "blister pack medicine foil pill pack toothpaste tube coffee pod bottle cap lid beauty packaging soft plastic chip bag wrapper cling wrap zip lock bag bread bag", itemsNot: "Batteries, pressurised canisters, aerosols, pesticides, oil paint, medical sharps, food waste, broken glass, hazardous", cost: "$15 per collection (includes postage label + recycling)", reward: "None", whatHappens: "Sorted by type and sent to Australian micro-recyclers; all waste recycled onshore.", howTo: "Purchase a BRAD collection label at banish.com.au, pack into a box/satchel, post via Australia Post.", website: "https://www.banish.com.au/pages/recycling-program", notes: "3.2M+ pieces diverted from landfill since 2020. Post from anywhere in Australia.", coverage: "mail-in", locationFinderUrl: "", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-10", company: "TerraCycle Australia", program: "Free Recycling Programs (brand-sponsored)", category: "Beauty / Household / Stationery", items: "garnier loreal maybelline schwarzkopf gillette razor beauty packaging dish soap air freshener glad bag writing pen bic pen marker highlighter shampoo bottle hair dye packaging beauty empty", itemsNot: "Wet items, hazardous materials, outer cardboard packaging", cost: "Free (programs funded by brand sponsors)", reward: "TerraCycle points per kg — redeemable as donations to schools/charities", whatHappens: "Sorted by material type; turned into park benches, bike racks, pet food bowls, outdoor furniture.", howTo: "Sign up at terracycle.com/en-AU, join relevant program, drop off at community hubs or mail with free prepaid label.", website: "https://www.terracycle.com/en-AU", notes: "Programs available in every postcode. Drop-off points vary by program.", coverage: "nationwide", locationFinderUrl: "https://www.terracycle.com/en-AU/brigades", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-11", company: "Container Deposit Schemes", program: "Return and Earn / Containers for Change", category: "Beverage Containers", items: "aluminium can beer can soft drink can soda can sparkling water bottle plastic bottle juice bottle water bottle glass bottle drink bottle beverage container", itemsNot: "Milk cartons, juice cartons, wine bottles, spirit bottles, cordial, food cans", cost: "Free", reward: "10 cents refund per eligible container (cash, voucher or charity donation)", whatHappens: "Containers sorted; aluminium, glass and plastic recycled into new packaging and products.", howTo: "Return to a reverse vending machine, depot or authorised collection point in your state.", website: "https://www.containersforchange.com.au", notes: "ACT: actsmart.act.gov.au | NSW: returnandearnanywhere.com.au | QLD/WA/SA/TAS/NT: containersforchange.com.au", coverage: "nationwide", locationFinderUrl: "https://www.containersforchange.com.au/find-a-location", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-12", company: "B-cycle", program: "Battery Recycling", category: "Batteries", items: "battery batteries AA AAA C D 9V button cell coin cell lithium ion rechargeable phone battery laptop battery power tool battery alkaline battery watch battery", itemsNot: "Car batteries, large industrial batteries", cost: "Free", reward: "None", whatHappens: "Batteries safely processed to recover lithium, cobalt, nickel, manganese for reuse in new batteries.", howTo: "Drop off at any B-cycle collection point — supermarkets, hardware stores, offices.", website: "https://b-cycle.com.au", notes: "National battery stewardship scheme. Collection points at most major supermarkets and hardware stores.", coverage: "nationwide", locationFinderUrl: "https://b-cycle.com.au/drop-off", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
  { id: "seed-13", company: "Pharmacies (RUM Project)", program: "Return Unwanted Medicines", category: "Pharmaceuticals", items: "medicine medication tablets pills capsules vitamins supplements expired medicine old prescription antibiotics paracetamol ibuprofen panadol nurofen over the counter drugs", itemsNot: "Sharps/needles, chemotherapy drugs, large volumes of liquid medications", cost: "Free", reward: "None", whatHappens: "Collected medicines safely incinerated at high temperatures to prevent environmental contamination.", howTo: "Take unwanted medicines in original packaging to any participating pharmacy.", website: "https://returnmed.com.au", notes: "Government-backed program. Available at most pharmacies across Australia.", coverage: "nationwide", locationFinderUrl: "https://returnmed.com.au/find-a-pharmacy", verified: true, status: "active", lastChecked: null, submittedBy: "seed" },
];

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "recycle2026";
const CATEGORIES = [
  "Batteries",
  "Beauty / Personal Care",
  "Beverage Containers",
  "Clothing / Shoes",
  "Clothing / Textiles",
  "Cookware",
  "Electronics / Stationery",
  "Hard-to-Recycle",
  "Pharmaceuticals",
  "Other",
];
const COVERAGE_OPTIONS = [
  { value: "nationwide", label: "🌏 Nationwide" },
  { value: "selected-locations", label: "📍 Selected locations" },
  { value: "mail-in", label: "📬 Mail-in only" },
  { value: "unknown", label: "❓ Unknown" },
];
const EMPTY_FORM = { company: "", program: "", category: "", items: "", itemsNot: "", cost: "", reward: "", whatHappens: "", howTo: "", website: "", notes: "", coverage: "unknown", locationFinderUrl: "" };
const STORAGE_KEY = "recycling-programs-v3";

async function callClaude(messages, systemPrompt = "") {
  const body = { model: "claude-sonnet-4-20250514", max_tokens: 1500, messages };
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
    } catch { return defaultValue; }
  });
  const setAndStore = (newValue) => {
    const resolved = typeof newValue === "function" ? newValue(value) : newValue;
    setValue(resolved);
    try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
  };
  return [value, setAndStore];
}

// API helpers for shared KV database
async function apiGetPrograms() {
  const res = await fetch('/api/programs');
  if (!res.ok) throw new Error('Failed to fetch programs');
  const data = await res.json();
  return data.programs || [];
}

async function apiAction(action, payload) {
  const res = await fetch('/api/programs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) throw new Error('API action failed');
  return res.json();
}

function coverageLabel(coverage) {
  return COVERAGE_OPTIONS.find(o => o.value === coverage)?.label || "❓ Unknown";
}

function coverageStyle(coverage) {
  if (coverage === "nationwide") return { background: "#e8f5e8", color: "#1b5e1b" };
  if (coverage === "selected-locations") return { background: "#fff8e1", color: "#f57f17" };
  if (coverage === "mail-in") return { background: "#e3f2fd", color: "#1565c0" };
  return { background: "#f5f5f5", color: "#757575" };
}

export default function App() {
  const [view, setView] = useState("search");
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
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
  const [scrapeUrls, setScrapeUrls] = useState("");
  const [scrapeResults, setScrapeResults] = useState([]);
  const [scraping, setScraping] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState({ done: 0, total: 0, current: "" });

  // Feedback state
  const [feedback, setFeedback] = useState({ searchUsefulness: "", featuresWanted: [], recommendBarrier: "" });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);

  // Notification tracking
  const [lastProgramNotifyAt, setLastProgramNotifyAt] = useLocalStorage("last-program-notify", null);

  // Load programs from shared KV database on mount
  useEffect(() => {
    (async () => {
      setProgramsLoading(true);
      try {
        const loaded = await apiGetPrograms();
        if (loaded.length === 0) {
          // First time — seed the database
          await apiAction('seed', { programs: SEED_PROGRAMS });
          setPrograms(SEED_PROGRAMS);
        } else {
          setPrograms(loaded);
        }
      } catch (err) {
        console.error('Failed to load programs, falling back to seed:', err);
        setPrograms(SEED_PROGRAMS);
      }
      setProgramsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (programs.length === 0) return;
    const stale = programs.filter(p => !p.lastChecked || Date.now() - new Date(p.lastChecked).getTime() > 7 * 24 * 60 * 60 * 1000);
    if (stale.length > 0) runStatusCheck(programs, stale);
  }, []);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const callNotify = async (type, data) => {
    try {
      await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, data }) });
    } catch {}
  };

  const submitFeedback = async () => {
    if (!feedback.searchUsefulness || !feedback.recommendBarrier) return;
    setFeedbackSubmitting(true);
    try {
      await callNotify("feedback", { ...feedback, timestamp: new Date().toISOString() });
      setFeedbackDone(true);
      setFeedback({ searchUsefulness: "", featuresWanted: [], recommendBarrier: "" });
    } catch {}
    setFeedbackSubmitting(false);
  };

  // Check program review notification whenever unverified count changes
  const checkProgramNotify = async (unverifiedCount) => {
    if (unverifiedCount >= 5) {
      const result = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "program_review_check", data: { unverifiedCount, lastNotifiedAt: lastProgramNotifyAt } }) });
      const json = await result.json();
      if (json.sent) setLastProgramNotifyAt(new Date().toISOString());
    }
  };

  const runStatusCheck = async (allPrograms, toCheck) => {
    setChecking(true);
    let updated = [...allPrograms];
    for (let i = 0; i < toCheck.length; i++) {
      const p = toCheck[i];
      setCheckProgress({ done: i, total: toCheck.length, current: p.company });
      try {
        const raw = await callClaude(
          [{ role: "user", content: `Is this Australian recycling program still operating as of 2025–2026? Company: ${p.company}, Program: ${p.program}, Website: ${p.website || p.notes}. Reply with JSON only: {"status":"active"|"possibly_inactive"|"unknown","reason":"one short sentence"}` }],
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
    await apiAction('replace', { programs: updated });
    setCheckProgress({ done: toCheck.length, total: toCheck.length, current: "" });
    setChecking(false);
  };

  const doSearch = async (q) => {
    if (!q.trim()) return;
    setSearching(true);
    setSearchResults(null);
    const active = programs.filter(p => p.status !== "inactive");
    const dataStr = active.map(p => `ID:${p.id} | Company:${p.company} | Category:${p.category} | Coverage:${p.coverage || "unknown"} | Items:${p.items}`).join("\n");
    try {
      const raw = await callClaude(
        [{ role: "user", content: `User searched: "${q}"\n\nPrograms:\n${dataStr}\n\nReturn JSON only: {"matched":["id1","id2"...],"summary":"max 25 words","tip":"optional max 20 word tip or null"}` }],
        "You are a recycling lookup assistant for Australia. Return only valid JSON, no markdown. Be generous with matching. Clothing/Shoes category covers footwear like sneakers, boots, sandals."
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
    await apiAction('add', { program: newProgram });
    setForm(EMPTY_FORM);
    setSubmitDone(true);
    setSubmitting(false);
    setTimeout(() => setSubmitDone(false), 4000);
  };

  // Check program notifications whenever programs change
  useEffect(() => {
    const unverifiedCount = programs.filter(p => !p.verified).length;
    if (unverifiedCount >= 5) checkProgramNotify(unverifiedCount);
  }, [programs.filter(p => !p.verified).length]);

  const runScraper = async () => {
    const urls = scrapeUrls.split(/[\n,]+/).map(u => u.trim()).filter(u => u.startsWith("http"));
    if (urls.length === 0) return;
    setScraping(true);
    setScrapeResults([]);
    const results = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      setScrapeProgress({ done: i, total: urls.length, current: url });
      let result = { url, status: "processing", program: null, error: null };
      try {
        const fetchRes = await fetch("/api/fetch-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
        const { html, error: fetchError } = await fetchRes.json();
        if (fetchError || !html) {
          result = { url, status: "error", error: fetchError || "Could not fetch page", program: null };
        } else {
          const raw = await callClaude(
            [{ role: "user", content: `Extract recycling/take-back program details from this webpage. URL: ${url}\n\nContent:\n${html}\n\nReturn JSON only:\n{"company":"","program":"","category":"","items":"many descriptive keywords for search","itemsNot":"","cost":"Free or describe","reward":"discount/reward or None","whatHappens":"","howTo":"","website":"${url}","notes":"","coverage":"nationwide|selected-locations|mail-in|unknown","locationFinderUrl":"store finder URL if mentioned else empty"}\n\nIf no recycling program: {"notAProgram": true}` }],
            `Extract Australian recycling data. JSON only. Category must be one of: ${CATEGORIES.join(", ")}. coverage: nationwide=all AU stores, selected-locations=some only, mail-in=post items, unknown=unclear.`
          );
          const extracted = JSON.parse(raw.replace(/```json|```/g, "").trim());
          if (extracted.notAProgram) {
            result = { url, status: "not_a_program", error: "No recycling program found", program: null };
          } else {
            result = { url, status: "extracted", error: null, program: { ...extracted, id: `scraped-${Date.now()}-${i}`, verified: false, status: "active", lastChecked: null, submittedBy: "scraper", submittedAt: new Date().toISOString() } };
          }
        }
      } catch (err) {
        result = { url, status: "error", error: err.message, program: null };
      }
      results.push(result);
      setScrapeResults([...results]);
      await new Promise(r => setTimeout(r, 500));
    }
    setScrapeProgress({ done: urls.length, total: urls.length, current: "" });
    setScraping(false);
  };

  const addScrapedProgram = async (program) => {
    setPrograms(prev => [...prev, program]);
    await apiAction('add', { program });
    setScrapeResults(prev => prev.map(r => r.program?.id === program.id ? { ...r, status: "added" } : r));
    showToast(`${program.company} added ✓`);
  };

  const addAllScraped = async () => {
    const toAdd = scrapeResults.filter(r => r.status === "extracted" && r.program);
    const newPrograms = toAdd.map(r => r.program);
    setPrograms(prev => [...prev, ...newPrograms]);
    await apiAction('replace', { programs: [...programs, ...newPrograms] });
    setScrapeResults(prev => prev.map(r => r.status === "extracted" ? { ...r, status: "added" } : r));
    showToast(`${toAdd.length} programs added ✓`);
  };

  const verifyProgram = async (id) => {
    const updated = programs.map(p => p.id === id ? { ...p, verified: true } : p);
    setPrograms(updated);
    await apiAction('replace', { programs: updated });
    showToast("Program verified ✓");
  };
  const removeProgram = async (id) => {
    const updated = programs.filter(p => p.id !== id);
    setPrograms(updated);
    await apiAction('replace', { programs: updated });
    showToast("Program removed", "warn");
  };
  const forceCheck = async () => {
    const reset = programs.map(p => ({ ...p, lastChecked: null }));
    setPrograms(reset);
    await apiAction('replace', { programs: reset });
    runStatusCheck(reset, reset);
  };

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
        .nav-btn { background: none; border: none; padding: 9px 15px; border-radius: 10px; font-size: 0.84rem; font-weight: 500; color: #6b7280; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
        .nav-btn:hover { background: #e8f0e8; color: #2d6a2d; }
        .nav-btn.active { background: #2d6a2d; color: #fff; }
        .pill { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 0.73rem; font-weight: 600; white-space: nowrap; }
        .pill-cat { background: #e8f5e8; color: #2d6a2d; }
        .pill-free { background: #e8f5e8; color: #1b5e1b; }
        .pill-cost { background: #fdecea; color: #b71c1c; }
        .pill-reward { background: #fdf6e3; color: #b8860b; }
        .pill-unverified { background: #fff3e0; color: #e65100; }
        .pill-inactive { background: #fce4ec; color: #880e4f; }
        .chip { background: #eef4ee; border: 1px solid #c5d9c5; color: #3a6b3a; font-size: 0.8rem; padding: 5px 12px; border-radius: 20px; cursor: pointer; transition: all 0.15s; border: 1px solid #c5d9c5; }
        .chip:hover { background: #d4ebd4; border-color: #2d6a2d; }
        .field label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.09em; color: #6b7280; font-weight: 600; margin-bottom: 5px; }
        .field input, .field textarea, .field select { width: 100%; border: 1.5px solid #dde8dd; border-radius: 10px; padding: 10px 13px; font-size: 0.9rem; background: #fff; color: #1a1a1a; transition: border-color 0.15s; outline: none; }
        .field input:focus, .field textarea:focus, .field select:focus { border-color: #2d6a2d; }
        .field textarea { resize: vertical; min-height: 70px; }
        .submit-btn { background: #2d6a2d; color: #fff; border: none; border-radius: 12px; padding: 13px 28px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
        .submit-btn:hover { background: #3d8a3d; }
        .submit-btn:disabled { background: #a5c4a5; cursor: not-allowed; }
        .slabel { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; font-weight: 600; margin-bottom: 3px; }
        .ext-link { color: #2d6a2d; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; font-size: 0.84rem; font-weight: 500; }
        .ext-link:hover { text-decoration: underline; }
        .loc-btn { color: #1565c0; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; font-size: 0.82rem; font-weight: 500; background: #e3f2fd; border: 1px solid #bbdefb; padding: 6px 14px; border-radius: 20px; transition: background 0.15s; }
        .loc-btn:hover { background: #bbdefb; }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "warn" ? "#3e2723" : "#2d6a2d", color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: "0.88rem", fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", animation: "fadeIn 0.2s ease" }}>{toast.msg}</div>
      )}

      {checking && (
        <div style={{ background: "#e8f5e8", borderBottom: "1px solid #c5d9c5", padding: "10px 20px", textAlign: "center", fontSize: "0.83rem", color: "#2d6a2d", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div className="spin" style={{ width: 14, height: 14, border: "2px solid #c5d9c5", borderTopColor: "#2d6a2d", borderRadius: "50%", flexShrink: 0 }} />
          Checking program status… {checkProgress.done}/{checkProgress.total}
          {checkProgress.current && <span style={{ color: "#6b7280" }}>— {checkProgress.current}</span>}
        </div>
      )}

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 20px" }}>

        {/* Header */}
        <div style={{ padding: "40px 0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#2d6a2d", letterSpacing: "-0.03em", lineHeight: 1.05 }}>♻️ Can I recycle this?</h1>
            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: 5, fontWeight: 300 }}>Australian take-back & recycling programs</p>
          </div>
          <nav style={{ display: "flex", gap: 4, background: "#fff", border: "1.5px solid #dde8dd", borderRadius: 14, padding: 5, flexWrap: "wrap" }}>
            <button className={`nav-btn${view === "search" ? " active" : ""}`} onClick={() => setView("search")}>🔍 Search</button>
            <button className={`nav-btn${view === "submit" ? " active" : ""}`} onClick={() => setView("submit")}>＋ Add</button>
            <button className={`nav-btn${view === "scraper" ? " active" : ""}`} onClick={() => setView("scraper")}>🌐 Scraper</button>
            <button className={`nav-btn${view === "feedback" ? " active" : ""}`} onClick={() => setView("feedback")}>💬 Feedback</button>
            <button className={`nav-btn${view === "admin" ? " active" : ""}`} onClick={() => setView("admin")}>
              🛡 Admin
              {(unverified.length + flagged.length) > 0 && <span style={{ background: "#e53e3e", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", marginLeft: 4 }}>{unverified.length + flagged.length}</span>}
            </button>
          </nav>
        </div>

        {/* ── SEARCH ── */}
        {view === "search" && (
          <div className="fade-in">
            {programsLoading && (
              <div style={{ textAlign: "center", padding: 48, color: "#6b7280" }}>
                <div className="spin" style={{ width: 24, height: 24, border: "3px solid #c5d9c5", borderTopColor: "#2d6a2d", borderRadius: "50%", display: "inline-block", marginBottom: 12 }} />
                <p style={{ fontSize: "0.9rem" }}>Loading programs…</p>
              </div>
            )}
            {!programsLoading && (
            <div style={{ background: "#fff", border: "2px solid #c5d9c5", borderRadius: 18, display: "flex", overflow: "hidden", boxShadow: "0 4px 24px rgba(45,106,45,0.08)", marginBottom: 14 }}>
              <input style={{ flex: 1, border: "none", outline: "none", padding: "17px 20px", fontSize: "1.05rem", background: "transparent" }}
                placeholder="e.g. old frying pan, mascara, AA batteries, sneakers…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doSearch(searchQuery)} />
              <button onClick={() => doSearch(searchQuery)} style={{ margin: 6, background: "#2d6a2d", color: "#fff", border: "none", borderRadius: 12, padding: "12px 22px", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                {searching ? <div className="spin" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%" }} /> : "Search"}
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 32 }}>
              {["frying pan","mascara","AA batteries","old jeans","sneakers","running shoes","expired medicine","ink cartridge","soft drink can","coffee pod","laptop","toothpaste tube"].map(t => (
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
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.15rem", color: "#5c4033" }}>No programs found for this item</h3>
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
            )}
          </div>
        )}

        {/* ── SUBMIT ── */}
        {view === "submit" && (
          <div className="fade-in" style={{ maxWidth: 640 }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#2d6a2d" }}>Add a recycling program</h2>
              <p style={{ color: "#6b7280", fontSize: "0.88rem", marginTop: 6 }}>Submissions go live immediately and are flagged for review. Fields marked * are required.</p>
            </div>
            {submitDone && <div style={{ background: "#e8f5e8", border: "1.5px solid #a5d6a5", borderRadius: 12, padding: "14px 18px", marginBottom: 20, color: "#1b5e1b", fontSize: "0.9rem" }}>✅ Program submitted — thank you!</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Company *</label><input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. H&M" /></div>
                <div className="field"><label>Program name *</label><input value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} placeholder="e.g. Garment Collecting" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Coverage</label>
                  <select value={form.coverage} onChange={e => setForm(f => ({ ...f, coverage: e.target.value }))}>
                    {COVERAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="field"><label>Items accepted * (descriptive — used for search)</label><textarea value={form.items} onChange={e => setForm(f => ({ ...f, items: e.target.value }))} placeholder="e.g. clothing, jackets, jeans, shirts, shoes, sneakers, boots, worn, any brand..." /></div>
              <div className="field"><label>Items NOT accepted</label><input value={form.itemsNot} onChange={e => setForm(f => ({ ...f, itemsNot: e.target.value }))} placeholder="e.g. underwear, wired bras" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Cost to recycle</label><input value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} placeholder="Free / $15 per box…" /></div>
                <div className="field"><label>Rewards / discount</label><input value={form.reward} onChange={e => setForm(f => ({ ...f, reward: e.target.value }))} placeholder="e.g. 10% off, None" /></div>
              </div>
              <div className="field"><label>What happens to the waste</label><textarea value={form.whatHappens} onChange={e => setForm(f => ({ ...f, whatHappens: e.target.value }))} placeholder="e.g. Items sorted and sent to recyclers…" /></div>
              <div className="field"><label>How to participate</label><textarea value={form.howTo} onChange={e => setForm(f => ({ ...f, howTo: e.target.value }))} placeholder="e.g. Drop off at any store bin…" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div className="field"><label>Program website URL</label><input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." /></div>
                <div className="field"><label>Store / drop-off finder URL</label><input value={form.locationFinderUrl} onChange={e => setForm(f => ({ ...f, locationFinderUrl: e.target.value }))} placeholder="https://.../store-finder" /></div>
              </div>
              <div className="field"><label>Notes</label><input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any extra context, caveats, state restrictions…" /></div>
            </div>
            <button className="submit-btn" style={{ marginTop: 24 }} disabled={submitting || !form.company || !form.program || !form.category || !form.items} onClick={submitProgram}>
              {submitting ? "Submitting…" : "Submit program →"}
            </button>
          </div>
        )}

            )}
        {/* ── SCRAPER ── */}
        {view === "scraper" && (
          <div className="fade-in">
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#2d6a2d" }}>🌐 URL Scraper</h2>
              <p style={{ color: "#6b7280", fontSize: "0.88rem", marginTop: 6, lineHeight: 1.6 }}>Paste URLs of recycling program pages — one per line. Claude will extract program details and let you add them to your database.</p>
            </div>
            <div style={{ background: "#fff", border: "1.5px solid #dde8dd", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>URLs — one per line</label>
                <textarea value={scrapeUrls} onChange={e => setScrapeUrls(e.target.value)} placeholder={"https://www.officeworks.com.au/recycling\nhttps://www.mecca.com.au/beauty-loop"} style={{ minHeight: 120, fontFamily: "monospace", fontSize: "0.82rem" }} disabled={scraping} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <button className="submit-btn" onClick={runScraper} disabled={scraping || !scrapeUrls.trim()}>
                  {scraping ? `Scraping ${scrapeProgress.done + 1}/${scrapeProgress.total}…` : "▶ Start scraping"}
                </button>
                {!scraping && scrapeUrls && <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{scrapeUrls.split(/[\n,]+/).filter(u => u.trim().startsWith("http")).length} URL(s)</span>}
                {scraping && scrapeProgress.current && <span style={{ fontSize: "0.78rem", color: "#6b7280", fontStyle: "italic", wordBreak: "break-all" }}>Fetching {scrapeProgress.current}</span>}
              </div>
            </div>

            {scrapeResults.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 16, fontSize: "0.82rem", color: "#6b7280" }}>
                    <span>✅ {scrapeResults.filter(r => r.status === "extracted" || r.status === "added").length} extracted</span>
                    <span>➕ {scrapeResults.filter(r => r.status === "added").length} added</span>
                    <span>❌ {scrapeResults.filter(r => r.status === "error" || r.status === "not_a_program").length} failed</span>
                  </div>
                  {scrapeResults.some(r => r.status === "extracted") && (
                    <button className="submit-btn" style={{ padding: "9px 18px", fontSize: "0.85rem" }} onClick={addAllScraped}>➕ Add all ({scrapeResults.filter(r => r.status === "extracted").length})</button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {scrapeResults.map((r, i) => (
                    <div key={i} style={{ background: "#fff", border: `1.5px solid ${r.status === "added" ? "#a5d6a5" : r.status === "extracted" ? "#dde8dd" : "#f5c6cb"}`, borderLeft: `4px solid ${r.status === "added" ? "#2d6a2d" : r.status === "extracted" ? "#4a9e4a" : "#e53e3e"}`, borderRadius: 12, padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: r.program && r.status === "extracted" ? 12 : 0 }}>
                        <div>
                          <div style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "#6b7280", wordBreak: "break-all" }}>{r.url}</div>
                          {r.status === "error" && <div style={{ fontSize: "0.8rem", color: "#c0392b", marginTop: 4 }}>❌ {r.error}</div>}
                          {r.status === "not_a_program" && <div style={{ fontSize: "0.8rem", color: "#e65100", marginTop: 4 }}>⚠️ No recycling program found</div>}
                          {r.status === "added" && <div style={{ fontSize: "0.8rem", color: "#2d6a2d", marginTop: 4 }}>✅ Added — {r.program?.company} / {r.program?.program}</div>}
                        </div>
                        {r.status === "extracted" && r.program && (
                          <button onClick={() => addScrapedProgram(r.program)} style={{ background: "#2d6a2d", color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>➕ Add</button>
                        )}
                      </div>
                      {r.program && r.status === "extracted" && (
                        <div style={{ background: "#f7faf7", borderRadius: 8, padding: "12px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                          {[
                            { label: "Company", value: r.program.company },
                            { label: "Program", value: r.program.program },
                            { label: "Category", value: r.program.category },
                            { label: "Coverage", value: coverageLabel(r.program.coverage) },
                            { label: "Cost", value: r.program.cost },
                            { label: "Reward", value: r.program.reward },
                            { label: "Items accepted", value: r.program.items, full: true },
                            { label: "How to participate", value: r.program.howTo, full: true },
                          ].filter(f => f.value).map(f => (
                            <div key={f.label} style={{ gridColumn: f.full ? "1/-1" : undefined }}>
                              <span className="slabel">{f.label}</span>
                              <div style={{ fontSize: "0.83rem", color: "#374151", lineHeight: 1.4 }}>{f.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scrapeResults.length === 0 && !scraping && (
              <div style={{ background: "#fff", border: "2px dashed #c5d9c5", borderRadius: 14, padding: "32px 24px" }}>
                <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#2d6a2d", marginBottom: 10 }}>💡 Tips</p>
                <ul style={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: 2.1, paddingLeft: 18 }}>
                  <li>Link directly to the recycling/sustainability page, not the homepage</li>
                  <li>Search Google for <em>"[brand name] recycling program Australia"</em></li>
                  <li>All scraped programs are marked Unverified — review in Admin</li>
                  <li>Up to ~20 URLs at once recommended</li>
                </ul>
              </div>
            )}
          </div>
        )}


        {/* ── FEEDBACK ── */}
        {view === "feedback" && (
          <div className="fade-in" style={{ maxWidth: 600 }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#2d6a2d" }}>💬 Help us improve</h2>
              <p style={{ color: "#6b7280", fontSize: "0.88rem", marginTop: 6, lineHeight: 1.6 }}>3 quick questions — your answers help us make this more useful for everyone.</p>
            </div>

            {feedbackDone ? (
              <div style={{ background: "#e8f5e8", border: "1.5px solid #a5d6a5", borderRadius: 16, padding: "36px 28px", textAlign: "center" }}>
                <div style={{ fontSize: "2.4rem", marginBottom: 12 }}>🌿</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.2rem", color: "#2d6a2d" }}>Thank you!</h3>
                <p style={{ color: "#6b7280", fontSize: "0.88rem", marginTop: 8 }}>Your feedback has been recorded and will help shape what we build next.</p>
                <button className="chip" style={{ marginTop: 20 }} onClick={() => setFeedbackDone(false)}>Submit another response</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                {/* Q1 */}
                <div style={{ background: "#fff", border: "1.5px solid #e0e8e0", borderRadius: 14, padding: "20px 22px" }}>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.98rem", color: "#1a1a1a", marginBottom: 14 }}>
                    1. When you search for an item, how useful are the results you get back?
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Always find what I need", "Usually helpful but sometimes misses things", "Hit or miss", "Often doesn't find relevant programs"].map(opt => (
                      <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${feedback.searchUsefulness === opt ? "#2d6a2d" : "#e0e8e0"}`, background: feedback.searchUsefulness === opt ? "#e8f5e8" : "#fafafa", transition: "all 0.15s" }}>
                        <input type="radio" name="searchUsefulness" value={opt} checked={feedback.searchUsefulness === opt} onChange={() => setFeedback(f => ({ ...f, searchUsefulness: opt }))} style={{ accentColor: "#2d6a2d" }} />
                        <span style={{ fontSize: "0.88rem", color: "#374151" }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div style={{ background: "#fff", border: "1.5px solid #e0e8e0", borderRadius: 14, padding: "20px 22px" }}>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.98rem", color: "#1a1a1a", marginBottom: 6 }}>
                    2. Which features would make this most useful to you?
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: 14 }}>Select all that apply</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Filter by my state / city", "Filter by free programs only", "Save or favourite programs", "Email alerts when new programs are added"].map(opt => {
                      const checked = feedback.featuresWanted.includes(opt);
                      return (
                        <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${checked ? "#2d6a2d" : "#e0e8e0"}`, background: checked ? "#e8f5e8" : "#fafafa", transition: "all 0.15s" }}>
                          <input type="checkbox" value={opt} checked={checked} onChange={() => setFeedback(f => ({ ...f, featuresWanted: checked ? f.featuresWanted.filter(x => x !== opt) : [...f.featuresWanted, opt] }))} style={{ accentColor: "#2d6a2d" }} />
                          <span style={{ fontSize: "0.88rem", color: "#374151" }}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Q3 */}
                <div style={{ background: "#fff", border: "1.5px solid #e0e8e0", borderRadius: 14, padding: "20px 22px" }}>
                  <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.98rem", color: "#1a1a1a", marginBottom: 14 }}>
                    3. What's one thing that would make you recommend this site to a friend — or what's stopping you right now?
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["I'd already recommend it", "Needs more programs listed", "Needs to be easier to use on mobile", "I'd need to trust the information more first"].map(opt => (
                      <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${feedback.recommendBarrier === opt ? "#2d6a2d" : "#e0e8e0"}`, background: feedback.recommendBarrier === opt ? "#e8f5e8" : "#fafafa", transition: "all 0.15s" }}>
                        <input type="radio" name="recommendBarrier" value={opt} checked={feedback.recommendBarrier === opt} onChange={() => setFeedback(f => ({ ...f, recommendBarrier: opt }))} style={{ accentColor: "#2d6a2d" }} />
                        <span style={{ fontSize: "0.88rem", color: "#374151" }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  className="submit-btn"
                  disabled={feedbackSubmitting || !feedback.searchUsefulness || !feedback.recommendBarrier}
                  onClick={submitFeedback}
                  style={{ alignSelf: "flex-start" }}
                >
                  {feedbackSubmitting ? "Submitting…" : "Submit feedback →"}
                </button>
                <p style={{ fontSize: "0.78rem", color: "#9ca3af", marginTop: -16 }}>All responses are anonymous and go directly to the site admin.</p>
              </div>
            )}
          </div>
        )}

        {/* ── ADMIN ── */}
        {view === "admin" && (
          <div className="fade-in">
            {!adminAuthed ? (
              <div style={{ maxWidth: 380 }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#2d6a2d", marginBottom: 20 }}>Admin access</h2>
                <div className="field">
                  <label>Password</label>
                  <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { adminPass === ADMIN_PASSWORD ? (setAdminAuthed(true), setAdminError("")) : setAdminError("Incorrect password"); }}}
                    placeholder="Enter admin password" />
                </div>
                {adminError && <p style={{ color: "#c0392b", fontSize: "0.83rem", marginTop: 8 }}>{adminError}</p>}
                <button className="submit-btn" style={{ marginTop: 14 }} onClick={() => adminPass === ADMIN_PASSWORD ? (setAdminAuthed(true), setAdminError("")) : setAdminError("Incorrect password")}>Unlock →</button>
                
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#2d6a2d" }}>Admin Panel</h2>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="chip" onClick={forceCheck} disabled={checking}>{checking ? "Checking…" : "🔄 Re-check all"}</button>
                    <button className="chip" style={{ color: "#c0392b", borderColor: "#f5c6cb" }} onClick={() => setAdminAuthed(false)}>Sign out</button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, marginBottom: 28 }}>
                  {[{ label: "Total", value: programs.length, color: "#2d6a2d" }, { label: "Pending review", value: unverified.length, color: "#e65100" }, { label: "Flagged inactive", value: flagged.length, color: "#880e4f" }, { label: "Verified", value: programs.filter(p => p.verified).length, color: "#1b5e1b" }].map(s => (
                    <div key={s.label} style={{ background: "#fff", border: "1.5px solid #e0e8e0", borderRadius: 12, padding: "16px 18px" }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.8rem", color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: "0.77rem", color: "#6b7280", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {unverified.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#e65100", marginBottom: 12 }}>⏳ Pending review ({unverified.length})</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{unverified.map(p => <AdminRow key={p.id} program={p} onVerify={verifyProgram} onRemove={removeProgram} />)}</div>
                  </div>
                )}
                {flagged.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#880e4f", marginBottom: 12 }}>⚠️ Possibly inactive ({flagged.length})</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{flagged.map(p => <AdminRow key={p.id} program={p} onVerify={verifyProgram} onRemove={removeProgram} flagMode />)}</div>
                  </div>
                )}
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem", color: "#2d6a2d", marginBottom: 12 }}>All programs ({programs.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{programs.map(p => <AdminRow key={p.id} program={p} onVerify={verifyProgram} onRemove={removeProgram} />)}</div>
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
  const cvgStyle = coverageStyle(p.coverage);

  return (
    <div className="card-in" onClick={compact ? () => setExpanded(v => !v) : undefined}
      style={{ background: "#fff", border: "1.5px solid #e0e8e0", borderLeft: "4px solid #2d6a2d", borderRadius: 14, padding: compact ? "14px 18px" : "20px 22px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", animationDelay: `${delay}s`, cursor: compact ? "pointer" : "default" }}>

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: compact ? "0.98rem" : "1.1rem" }}>{p.company}</div>
          <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: 2 }}>{p.program}</div>
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
          <span className="pill pill-cat">{p.category}</span>
          {p.coverage && <span className="pill" style={cvgStyle}>{coverageLabel(p.coverage)}</span>}
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
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
            <div style={{ gridColumn: "1/-1" }}>
              <span className="slabel">Items accepted</span>
              <div style={{ fontSize: "0.86rem", color: "#374151", lineHeight: 1.5 }}>
                {p.items?.split(" ").slice(0, 14).join(", ")}{p.items?.split(" ").length > 14 ? "…" : ""}
              </div>
            </div>
            {p.itemsNot && (
              <div style={{ gridColumn: "1/-1" }}>
                <span className="slabel">Not accepted</span>
                <div style={{ fontSize: "0.86rem", color: "#374151", lineHeight: 1.5 }}>{p.itemsNot}</div>
              </div>
            )}
            <div>
              <span className="slabel">Cost</span>
              <div style={{ fontSize: "0.86rem", color: "#374151" }}>{p.cost}</div>
            </div>
            <div>
              <span className="slabel">Reward / discount</span>
              <div style={{ fontSize: "0.86rem", color: "#374151" }}>{p.reward || "None"}</div>
            </div>
            {p.whatHappens && (
              <div style={{ gridColumn: "1/-1" }}>
                <span className="slabel">What happens to your items</span>
                <div style={{ fontSize: "0.86rem", color: "#374151", lineHeight: 1.5 }}>{p.whatHappens}</div>
              </div>
            )}
            {p.howTo && (
              <div style={{ gridColumn: "1/-1" }}>
                <span className="slabel">How to participate</span>
                <div style={{ fontSize: "0.86rem", color: "#374151", lineHeight: 1.5 }}>{p.howTo}</div>
              </div>
            )}
            {p.notes && (
              <div style={{ gridColumn: "1/-1" }}>
                <span className="slabel">Notes</span>
                <div style={{ fontSize: "0.83rem", color: "#6b7280", lineHeight: 1.5 }}>{p.notes}</div>
              </div>
            )}
          </div>

          {/* Links */}
          <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {p.website && (
              <a className="ext-link" href={p.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                🔗 Program website ↗
              </a>
            )}
            {p.locationFinderUrl && (
              <a className="loc-btn" href={p.locationFinderUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                📍 Find drop-off locations ↗
              </a>
            )}
          </div>

          {p.lastChecked && <div style={{ marginTop: 10, fontSize: "0.71rem", color: "#c4c9d0" }}>Status checked {new Date(p.lastChecked).toLocaleDateString("en-AU")}</div>}
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
          {p.category} · {coverageLabel(p.coverage || "unknown")} · {p.submittedAt ? `Submitted ${new Date(p.submittedAt).toLocaleDateString("en-AU")}` : "Seed data"}
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
