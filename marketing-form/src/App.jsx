import { useState } from "react";

const steps = [
  { id: 1, title: "Design Needed" },
  { id: 2, title: "Campaigns" },
  { id: 3, title: "Budget & Timeline" },
  { id: 4, title: "Goals & Audience" },
];

const CheckBox = ({ label, checked, onChange }) => (
  <label onClick={onChange} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "10px 14px", borderRadius: "8px", border: `1.5px solid ${checked ? "#f97316" : "#2a2a2a"}`, background: checked ? "rgba(249,115,22,0.08)" : "#111", transition: "all 0.2s", userSelect: "none" }}>
    <span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${checked ? "#f97316" : "#444"}`, background: checked ? "#f97316" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
      {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </span>
    <span style={{ fontSize: "14px", color: checked ? "#f97316" : "#aaa" }}>{label}</span>
  </label>
);

const Radio = ({ label, value, current, onChange, description }) => {
  const selected = current === value;
  return (
    <label onClick={() => onChange(value)} style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", padding: "10px 14px", borderRadius: "8px", border: `1.5px solid ${selected ? "#f97316" : "#2a2a2a"}`, background: selected ? "rgba(249,115,22,0.08)" : "#111", transition: "all 0.2s", userSelect: "none" }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? "#f97316" : "#444"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: description ? 1 : 0 }}>
        {selected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />}
      </span>
      <div>
        <span style={{ fontSize: "14px", color: selected ? "#f97316" : "#aaa", display: "block" }}>{label}</span>
        {description && <span style={{ fontSize: "12px", color: "#555", display: "block", marginTop: 2 }}>{description}</span>}
      </div>
    </label>
  );
};

const Field = ({ label, children, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    <label style={{ fontSize: "13px", fontWeight: 600, color: "#e5e5e5", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</label>
    {hint && <span style={{ fontSize: "12px", color: "#666", marginTop: -4 }}>{hint}</span>}
    {children}
  </div>
);

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
    <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
    <span style={{ fontSize: 11, color: "#444", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
  </div>
);

const inputStyle = { background: "#111", border: "1.5px solid #2a2a2a", borderRadius: "8px", padding: "11px 14px", color: "#e5e5e5", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "inherit" };

const DESIGN_SERVICES = [
  "Social media graphics (posts, stories, reel covers)",
  "Paid ad creatives (static banners, carousels)",
  "Print materials (flyers, brochures, banners)",
  "Email marketing templates",
  "Presentation / pitch deck design",
  "Infographics & data visualisation",
  "Video / motion graphics / reels editing",
  "Outdoor advertising (billboards, signage)",
  "Packaging design",
  "Website banners & landing page visuals",
];

const PRINT_TYPES = ["Flyers", "Brochures", "Banners / Roll-ups", "Business cards", "Posters", "Catalogues", "Packaging", "Outdoor / Billboard"];

const CAMPAIGN_CHANNELS = [
  "Meta Ads (Facebook & Instagram)",
  "Google Search Ads",
  "Google Display & YouTube",
  "LinkedIn Ads",
  "TikTok Ads",
  "Email campaigns (Mailchimp, Klaviyo…)",
  "SMS / WhatsApp",
  "Influencer / affiliate",
];

export default function App() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    services: [],
    printTypes: [],
    campaignMgmt: "",
    campaignChannels: [],
    campaignSituation: "",
    budget: "",
    timeline: "",
    projectFrequency: "",
    primaryGoal: "",
    targetAudience: "",
    geographicFocus: "",
    additionalNotes: "",
  });

  const toggle = (field, value) => setData(d => ({ ...d, [field]: d[field].includes(value) ? d[field].filter(v => v !== value) : [...d[field], value] }));
  const set = (field, value) => setData(d => ({ ...d, [field]: value }));

  const needsPrint = data.services.some(s => s.toLowerCase().includes("print") || s.toLowerCase().includes("outdoor") || s.toLowerCase().includes("packaging"));
  const needsCampaignDetails = data.campaignMgmt === "Yes — full management (strategy + execution)" || data.campaignMgmt === "Only setup & launch (I'll manage after)";

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("https://formspree.io/f/xlgpelzp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          services: data.services.join(", "),
          printTypes: data.printTypes.join(", "),
          campaignChannels: data.campaignChannels.join(", "),
        }),
      });
    } catch (err) {
      console.error("Submission error:", err);
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    const summaryItems = [
      { label: "Design needs", value: data.services.join(", ") },
      { label: "Campaign management", value: data.campaignMgmt },
      needsCampaignDetails && { label: "Channels", value: data.campaignChannels.join(", ") },
      needsCampaignDetails && { label: "Current situation", value: data.campaignSituation },
      { label: "Service budget", value: data.budget },
      { label: "Timeline", value: data.timeline },
      { label: "Goal", value: data.primaryGoal },
    ].filter(Boolean);

    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 480, width: "100%" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(249,115,22,0.12)", border: "2px solid #f97316", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 16L12 22L26 8" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>Thanks, brief received!</h2>
          <p style={{ color: "#666", fontSize: 15, lineHeight: 1.6, margin: "0 0 32px" }}>Nicu will review your needs and come back with the best-fit specialist or agency recommendation.</p>
          <div style={{ background: "#111", border: "1.5px solid #2a2a2a", borderRadius: 12, padding: "20px 24px", textAlign: "left", display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Your Summary</p>
            {summaryItems.map(({ label, value }) => value ? (
              <p key={label} style={{ color: "#e5e5e5", fontSize: 14, margin: 0 }}>
                <span style={{ color: "#f97316" }}>{label}:</span> {value}
              </p>
            ) : null)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "'DM Sans', sans-serif", padding: "32px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />
            <span style={{ fontSize: 12, color: "#f97316", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Marketing Brief</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 6px", lineHeight: 1.2 }}>Find Your Perfect<br />Marketing Partner</h1>
          <p style={{ color: "#555", fontSize: 14, margin: 0 }}>Help us understand your needs so we can recommend the right specialist.</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
          {steps.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: step > s.id ? "#f97316" : step === s.id ? "transparent" : "#111", border: `2px solid ${step >= s.id ? "#f97316" : "#2a2a2a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: step > s.id ? "#fff" : step === s.id ? "#f97316" : "#444", flexShrink: 0 }}>
                  {step > s.id ? "✓" : s.id}
                </div>
                <span style={{ fontSize: 10, color: step >= s.id ? "#f97316" : "#444", whiteSpace: "nowrap", fontWeight: 600, letterSpacing: "0.03em" }}>{s.title}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 1.5, background: step > s.id ? "#f97316" : "#2a2a2a", margin: "0 6px", marginBottom: 16, transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div style={{ background: "#0f0f0f", border: "1.5px solid #1e1e1e", borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 24 }}>

          {step === 1 && (
            <>
              <Field label="Design Needed" hint="Select all that apply">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {DESIGN_SERVICES.map(v => <CheckBox key={v} label={v} checked={data.services.includes(v)} onChange={() => toggle("services", v)} />)}
                </div>
              </Field>
              {needsPrint && (
                <Field label="Print / Outdoor Formats" hint="Which formats specifically?">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {PRINT_TYPES.map(v => <CheckBox key={v} label={v} checked={data.printTypes.includes(v)} onChange={() => toggle("printTypes", v)} />)}
                  </div>
                </Field>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Campaign Management" hint="Do you need someone to run the campaigns, or just the design?">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Radio label="Yes — full management" description="Strategy, setup, execution & reporting" value="Yes — full management (strategy + execution)" current={data.campaignMgmt} onChange={v => set("campaignMgmt", v)} />
                  <Radio label="Only setup & launch" description="I'll take over the management after" value="Only setup & launch (I'll manage after)" current={data.campaignMgmt} onChange={v => set("campaignMgmt", v)} />
                  <Radio label="No — just the creatives / design" value="No — just the creatives / design" current={data.campaignMgmt} onChange={v => set("campaignMgmt", v)} />
                  <Radio label="Not sure yet, open to discuss" value="Not sure yet, open to discuss" current={data.campaignMgmt} onChange={v => set("campaignMgmt", v)} />
                </div>
              </Field>
              {needsCampaignDetails && (
                <>
                  <Divider label="Channel details" />
                  <Field label="Which Channels?" hint="Select all platforms you want managed">
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {CAMPAIGN_CHANNELS.map(v => <CheckBox key={v} label={v} checked={data.campaignChannels.includes(v)} onChange={() => toggle("campaignChannels", v)} />)}
                    </div>
                  </Field>
                  <Field label="Current Situation" hint="Where are you starting from?">
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <Radio label="Starting from scratch" description="No ad accounts set up yet" value="Starting from scratch — no accounts set up" current={data.campaignSituation} onChange={v => set("campaignSituation", v)} />
                      <Radio label="Accounts exist, never ran ads" description="Pages & accounts ready but unused" value="Accounts exist but never ran ads" current={data.campaignSituation} onChange={v => set("campaignSituation", v)} />
                      <Radio label="Ran ads before, want to improve" description="Past experience, looking for better results" value="Ran ads before, want to improve" current={data.campaignSituation} onChange={v => set("campaignSituation", v)} />
                      <Radio label="Currently running, need takeover" description="Active campaigns that need new management" value="Already running, need someone to take over" current={data.campaignSituation} onChange={v => set("campaignSituation", v)} />
                    </div>
                  </Field>
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Service Fee Budget / Month (EUR)" hint="Design, management fees — excluding ad spend">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["< €500", "€500 – €1,500", "€1,500 – €3,000", "€3,000 – €5,000", "€5,000+", "Not sure yet"].map(v => (
                    <Radio key={v} label={v} value={v} current={data.budget} onChange={v => set("budget", v)} />
                  ))}
                </div>
              </Field>
              <Field label="When do you need this to start?">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["ASAP", "Within 2 weeks", "Within a month", "Flexible"].map(v => (
                    <Radio key={v} label={v} value={v} current={data.timeline} onChange={v => set("timeline", v)} />
                  ))}
                </div>
              </Field>
              <Field label="Project Frequency">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["One-off project", "Ongoing monthly retainer", "Seasonal / campaign-based", "Not sure"].map(v => (
                    <Radio key={v} label={v} value={v} current={data.projectFrequency} onChange={v => set("projectFrequency", v)} />
                  ))}
                </div>
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <Field label="Primary Goal">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Generate leads / sales", "Build brand awareness", "Promote an event / launch", "Grow social following", "Retain existing customers", "Drive website traffic"].map(v => (
                    <Radio key={v} label={v} value={v} current={data.primaryGoal} onChange={v => set("primaryGoal", v)} />
                  ))}
                </div>
              </Field>
              <Field label="Target Audience">
                <input style={inputStyle} placeholder="e.g. Local homeowners aged 35–55, B2B decision makers…" value={data.targetAudience} onChange={e => set("targetAudience", e.target.value)} />
              </Field>
              <Field label="Geographic Focus">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {["Local (city/region)", "National", "International", "Online only"].map(v => (
                    <Radio key={v} label={v} value={v} current={data.geographicFocus} onChange={v => set("geographicFocus", v)} />
                  ))}
                </div>
              </Field>
              <Field label="Anything else we should know?" hint="Style refs, competitors, past experiences, current tools…">
                <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} placeholder="Add any context that will help find the best match…" value={data.additionalNotes} onChange={e => set("additionalNotes", e.target.value)} />
              </Field>
            </>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 12 }}>
          {step > 1
            ? <button onClick={() => setStep(s => s - 1)} style={{ padding: "12px 24px", background: "transparent", border: "1.5px solid #2a2a2a", borderRadius: 8, color: "#888", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
            : <div />
          }
          <button
            onClick={() => step < steps.length ? setStep(s => s + 1) : handleSubmit()}
            disabled={submitting}
            style={{ padding: "12px 28px", background: submitting ? "#7c3a10" : "#f97316", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: "0.02em" }}
          >
            {submitting ? "Sending…" : step < steps.length ? "Continue →" : "Submit Brief ✓"}
          </button>
        </div>
        <p style={{ textAlign: "center", color: "#333", fontSize: 12, marginTop: 16 }}>Step {step} of {steps.length}</p>
      </div>
    </div>
  );
}
