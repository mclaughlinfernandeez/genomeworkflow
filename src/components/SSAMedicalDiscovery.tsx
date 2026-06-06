import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, ShieldAlert, Cpu, Bot, Search, FileText, 
  CheckCircle, AlertTriangle, ArrowRight, Activity, 
  FileCheck, FilePenLine, RefreshCw, Layers, Sparkles, AlertCircle
} from "lucide-react";
import { SAMPLE_CASES, LISTINGS_MUTATOR } from "../data";
import { PatientCase, MedicalEvidence, SSAListingCriteria, ProcessingLog, RAGAgent } from "../types";

export default function SSAMedicalDiscovery() {
  const [selectedCase, setSelectedCase] = useState<PatientCase>(SAMPLE_CASES[0]);
  const [isScrubbed, setIsScrubbed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedQueries, setExpandedQueries] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"exhibits" | "deidentify" | "rag" | "knowledge" | "brief">("exhibits");
  
  // RAG Pipeline Simulation states
  const [pipelineState, setPipelineState] = useState<"idle" | "running" | "completed">("idle");
  const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(-1);
  const [pipelineLogs, setPipelineLogs] = useState<ProcessingLog[]>([]);
  const [extractedEvidence, setExtractedEvidence] = useState<MedicalEvidence[]>([]);
  const [listingEvaluation, setListingEvaluation] = useState<SSAListingCriteria | null>(null);
  const [finalBriefText, setFinalBriefText] = useState<string>("");
  const [verifiedCitations, setVerifiedCitations] = useState<{ [key: string]: boolean }>({});
  const [hoveredCitation, setHoveredCitation] = useState<{ text: string; source: string } | null>(null);

  // Reset states on case change
  useEffect(() => {
    setIsScrubbed(false);
    setSearchQuery("");
    setExpandedQueries(null);
    setPipelineState("idle");
    setCurrentAgentIndex(-1);
    setPipelineLogs([]);
    setExtractedEvidence([]);
    setListingEvaluation(null);
    setFinalBriefText("");
    setVerifiedCitations({});
    setActiveTab("exhibits");
  }, [selectedCase]);

  // HIPAA scrubbing mapping
  const getScrubbedText = (text: string) => {
    let scrubbed = text;
    // Scrub Name
    scrubbed = scrubbed.split(selectedCase.name).join("<PERSON_BATES_01>");
    // Scrub SSN
    scrubbed = scrubbed.replace(/\d{3}-\d{2}-\d{4}/g, "<SSN_REDACTED_SECURE>");
    scrubbed = scrubbed.replace(/XXX-XX-\d{4}/g, "<SSN_REDACTED_SECURE>");
    // Scrub DOB
    const dobParts = selectedCase.dob.split("-");
    scrubbed = scrubbed.split(selectedCase.dob).join("<DATE_OF_BIRTH_ENCRYPTED>");
    if (dobParts[1] && dobParts[2] && dobParts[0]) {
      scrubbed = scrubbed.split(`${dobParts[1]}/${dobParts[2]}/${dobParts[0]}`).join("<DATE_OF_BIRTH_ENCRYPTED>");
    }
    return scrubbed;
  };

  // Run HIPAA deidentification simulation
  const handleScrubAction = () => {
    setIsScrubbed(true);
    setActiveTab("deidentify");
  };

  // Multi-Perspective query expansion generator
  const handleQueryExpansion = () => {
    if (!searchQuery.trim()) return;
    
    // Simulate smart Expansion
    const q = searchQuery.toLowerCase();
    const clinical = q.includes("cd4") || q.includes("fatigue") 
      ? "Stanford Infectious Immunology [HAART failure, CD4 < 200, opportunistic fatigue profiles]" 
      : `Clinical markers for ${searchQuery} [demyelinating plaques, symptom profile, neurological deficit]`;
    
    const legal = q.includes("cd4") || q.includes("fatigue")
      ? "Social Security Blue Book Section 14.11 [Activities of Daily Living Tasks & extreme social limitations]"
      : "SSA Blue Book 11.00 Neurological criteria [persistent gait ataxia, motor disorganization of 2 extremities]";
      
    const temporal = q.includes("cd4") || q.includes("fatigue")
      ? "Symptom persistence ledger over 12-month timeline [longitudinal weight decay, neurological neuropathy]"
      : "Chronic development over 12-24 month window [demyelinating disease progression tracking]";
      
    const causal = q.includes("cd4") || q.includes("fatigue")
      ? "Causal medical index: severe immunodeficiency CD4 triggers opportunistic wasting & neuropathy limits"
      : "Causal mechanical model: cranial T2 hyperintensity causes bilateral motor dysfunction Romberg positive";

    setExpandedQueries({
      original: searchQuery,
      clinical,
      legal,
      temporal,
      causal
    });
  };

  // Agents Definition
  const RAG_AGENTS: RAGAgent[] = [
    {
      id: "agent-supervisor",
      name: "Supervisor Orchestrator [Agent 210]",
      role: "Workflow Orchestrator",
      description: "Directs task routing across extraction models, and enforces rigorous programmatic quality gates.",
      status: "idle",
      avatar: "🤖"
    },
    {
      id: "agent-extractor",
      name: "Medical Extraction [Agent 220]",
      role: "Clinical Parser",
      description: "Applies clinical entity parsing to identify diagnoses, functional limitations, and medication details under Bates stamp references.",
      status: "idle",
      avatar: "🔍"
    },
    {
      id: "agent-policy",
      name: "SSA Policy Expert [Agent 230]",
      role: "Blue Book Analyst",
      description: "Performs strict matching against SSA Listing criteria and tabulates evidentiary preponderance scores.",
      status: "idle",
      avatar: "⚖️"
    },
    {
      id: "agent-writer",
      name: "Brief Compiler [Agent 240]",
      role: "Legal Draftsman",
      description: "Synthesizes Bates-stamped medical parameters into highly formatted pre-hearing briefs.",
      status: "idle",
      avatar: "📝"
    },
    {
      id: "agent-grader",
      name: "Zero-Hallucination Grader [Agent 250]",
      role: "Verification Engine",
      description: "Audits citation targets against un-scrubbed core source documents with absolute zero-tolerance constraints.",
      status: "idle",
      avatar: "🛡️"
    }
  ];

  // Simulated agent run
  const runRAGPipeline = async () => {
    if (pipelineState === "running") return;
    setPipelineState("running");
    setPipelineLogs([]);
    setExtractedEvidence([]);
    setListingEvaluation(null);
    setFinalBriefText("");
    
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const addLog = (agentId: string, message: string, type: "info" | "success" | "warning" | "error" = "info", metadata?: any) => {
      setPipelineLogs(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          timestamp: new Date().toLocaleTimeString(),
          agentId,
          message,
          type,
          metadata
        }
      ]);
    };

    // Step 1: Supervisor Starts
    setCurrentAgentIndex(0);
    addLog("agent-supervisor", "Supervisor initialized. Setting up RAG execution parameters.", "info");
    await sleep(1500);
    addLog("agent-supervisor", `Targeting patient: ${selectedCase.name}. Selected Listings: ${selectedCase.listings.join(", ")}.`, "info");
    addLog("agent-supervisor", "Mounting verified un-redacted clinical sources in sandbox virtual environment path.", "success");
    await sleep(1000);

    // Step 2: Extraction Starts
    setCurrentAgentIndex(1);
    addLog("agent-extractor", "Clinical Parser online. Performing Medical Entity Recognition (NER).", "info");
    await sleep(1800);
    
    let mockEv: MedicalEvidence[] = [];
    if (selectedCase.id === "case-hiv") {
      mockEv = [
        {
          diagnoses: ["HIV-1 severe cellular immunodeficiency", "AIDS Wasting Syndrome", "Peripheral Neuropathy"],
          functionalLimitations: ["Unable to lift more than 10 lbs", "Cannot walk continuously > 10 mins", "Requires single-point cane"],
          painLevel: 7,
          medications: ["Biktarvy (HAART daily)"],
          exhibitReference: "Exhibit 1A, page 2",
          dateOfService: "2025-10-14",
          confidenceScore: 0.96,
          evidenceSource: "Visible signs of temporal wasting... reports burning pain severity 7/10 limiting standing... CD4 count is 185 cells/mm3."
        },
        {
          diagnoses: ["Locomotive Gait Ataxia", "Bilateral sensory paresthesia"],
          functionalLimitations: ["Limited to standing/walking under 2 hours daily", "Extreme fatigability after 15 mins activity"],
          painLevel: 6,
          medications: ["HAART schema"],
          exhibitReference: "Exhibit 2B, page 3",
          dateOfService: "2026-03-10",
          confidenceScore: 0.98,
          evidenceSource: "Restricted to standing/walking less than 2 hours... positive Romberg sign... extreme fatigability observed."
        }
      ];
    } else if (selectedCase.id === "case-ms") {
      mockEv = [
        {
          diagnoses: ["Secondary Progressive Multiple Sclerosis", "Lower limb spasticity"],
          functionalLimitations: ["Severe gait ataxia", "Needs bilateral forearm crutches", "Cognitive slowing (SDMT -1.5 SD)"],
          painLevel: 8,
          medications: ["Ocrevus infusions"],
          exhibitReference: "Exhibit 1A, page 4",
          dateOfService: "2024-11-05",
          confidenceScore: 0.97,
          evidenceSource: "Ataxia. Prominent spasticity in lower extremities... Needs bilateral forearm crutches for safe community ambulation."
        }
      ];
    } else {
      mockEv = [
        {
          diagnoses: ["Severe ADHD (Inattentive & Hyperactive)", "Executive cognitive dysfunction"],
          functionalLimitations: ["Attention span restricted to 5-minute cycles", "Working Memory Index of 78", "Restlessness prevents sitting > 15 mins"],
          painLevel: null,
          medications: ["Vyvanse 50mg"],
          exhibitReference: "Exhibit 1A, page 3",
          dateOfService: "2025-12-10",
          confidenceScore: 0.95,
          evidenceSource: "Impaired attention span restricts complex cognitive tasks to 5-minute continuous windows... Restlessness prevents sitting > 15 mins."
        }
      ];
    }

    setExtractedEvidence(mockEv);
    addLog("agent-extractor", `Extracted ${mockEv.length} distinct clinical event files. Fully mapped to Bates reference standards.`, "success", mockEv);
    await sleep(1500);

    // Step 3: Policy Analyzer Starts
    setCurrentAgentIndex(2);
    addLog("agent-policy", "Checking extracted entities against SSA Blue Book Listing provisions.", "info");
    await sleep(1500);

    let mockEval: SSAListingCriteria;
    if (selectedCase.id === "case-hiv") {
      mockEval = {
        listingNumber: "14.11",
        title: "Human Immunodeficiency Virus (HIV) Infection",
        description: "Evaluates HIV with opportunistic infections, severe wasting, or profound operational functional limits.",
        requiredElements: [
          "Laboratory evidence of HIV infection",
          "CD4 lymphocytes count under 200 cells/mm3",
          "Marked restriction in completing tasks with functional efficiency"
        ],
        satisfiedElements: [
          "Laboratory evidence of HIV infection (Confirmed detectable viral load, HAART protocol [Exhibit 1A, page 2])",
          "CD4 count under 200 cells/mm3 (Extracted CD4 count of 185 cells/mm3 [Exhibit 1A, page 2])",
          "Marked restriction in execution (Cannot walk > 10 mins, restricted to standing < 2 hours daily [Exhibit 2B, page 3])"
        ],
        missingElements: [],
        isMetOrEqual: true,
        preponderanceScore: 0.94,
        legalStandard: "Primary Section 14.11 criteria MET"
      };
    } else if (selectedCase.id === "case-ms") {
      mockEval = {
        listingNumber: "11.09",
        title: "Multiple Sclerosis",
        description: "Neurological deficits displaying motor disorganization of 2 extremities or physical/cognitive fatigue elements.",
        requiredElements: [
          "Documented demyelinating plaques on MRIs",
          "Persistent instability in walking/standing requiring assistive devices",
          "Marked limitation in physical vigor, pace, or sustained execution"
        ],
        satisfiedElements: [
          "Documented demyelinating plaques (MRI showing cervical and periventricular white matter lesions [Exhibit 1A, page 4])",
          "Persistent instability requiring devices (Forearm crutches mandated [Exhibit 1A, page 4])"
        ],
        missingElements: [
          "Sustained longitudinal treatment failure data (Requires additional 3-month therapeutic tracking report)"
        ],
        isMetOrEqual: false,
        preponderanceScore: 0.78,
        legalStandard: "Primary criteria partially satisfied (Recommending Medical Equivalency 'Or-Equal')"
      };
    } else {
      mockEval = {
        listingNumber: "12.11",
        title: "Neurodevelopmental Disorders",
        description: "Executive and cognitive operational limitations verified by clinical indices.",
        requiredElements: [
          "Frequent inattentiveness, impulsiveness, and poor concentration patterns",
          "Extreme limitation in cognitive execution and processing speed indices",
          "Longitudinal clinical history of performance disruption"
        ],
        satisfiedElements: [
          "Frequent inattentiveness (Attention span limited to 5-minute continuous windows [Exhibit 1A])",
          "Extreme limitation in cognitive indexes (WMI of 78, Processing Speed Index of 74 [Exhibit 1A, page 3])"
        ],
        missingElements: [
          "Standard school or job longitudinal performance sheets"
        ],
        isMetOrEqual: false,
        preponderanceScore: 0.72,
        legalStandard: "Primary criteria partially satisfied. ADHD genomics indicates 98th percentile genetic liability, supporting clinical findings."
      };
    }

    setListingEvaluation(mockEval);
    addLog("agent-policy", `Listing evaluation completed. Preponderance score is ${(mockEval.preponderanceScore * 100).toFixed(0)}%. Status: ${mockEval.isMetOrEqual ? "Listing Met" : "Equivalency Needed"}.`, "warning");
    await sleep(1500);

    // Step 4: Brief Writer Starts
    setCurrentAgentIndex(3);
    addLog("agent-writer", "Stating citation outline. Structuring evidentiary legal brief.", "info");
    await sleep(2000);

    let brief = "";
    if (selectedCase.id === "case-hiv") {
      brief = `BEFORE THE SOCIAL SECURITY ADMINISTRATION
OFFICE OF HEARING OPERATIONS (OHO)

In the Matter of the Disability Claim of:
Thomas S. McLaughlin, claimant.
Claimant SSN: <SSN_REDACTED_SECURE>

PRE-HEARING EVIDENCE BRIEF IN SUPPORT OF DISABILITY
--------------------------------------------------
I. EXECUTIVE SUMMARY
Claimant Thomas S. McLaughlin, born in 1978, seeks disability benefits alleging onset of permanent incapacity as of April 12, 2024. A thorough analysis of un-redacted medical files establishes that claimant's diagnostic impairments fully meet the severity threshold set out in Listing Section 14.11 (HIV severity).

II. COMPREHENSIVE CLINICAL RECORD ANALYSIS & BATES CITATIONS
1. Diagnosis & Immunological State:
Claimant is diagnosed with severe HIV-1 cellular immunodeficiency. Labs indicate a CD4 count of 185 cells/mm3, which sits critically below the diagnostic limit. This is firmly documented under [Exhibit 1A, page 2].
Despite compliance with daily antiretroviral Biktarvy regimes, patient registers persistent symptomatic viral loads [Exhibit 1A, page 2], establishing therapy resistance.

2. Profound Wasting & Cachexia:
Dr. Marcus Vance's notes from Stanford Medical Center certify that claimant's current weight of 134 lbs marks a rapid diagnostic descent from his 168 lb baseline, establishing profound clinical Cachexia/Wasting Syndrome [Exhibit 1A, page 2].

3. Sensory & Motor Neuropathy:
The patient's physical limitations are highly documented by Elena Rostova, DPT [Exhibit 2B, page 3]. The objective testing reveals an antalgic gait and positive Romberg ataxia. Neuropathic sensations register at 7/10, restricting the claimant to stand/walk for less than 2 total hours in a standard 8-hour shift [Exhibit 2B, page 3]. Furthermore, claimant is incapable of standing more than 10 minutes without relying heavily on a single-point cane [Exhibit 2B, page 3] or experiencing cardiovascular exhaustion [Exhibit 2B, page 3].

III. LEGAL ARGUMENT: CLINICAL CRITERIA MET OR EQUALED
The claimant's CD4 depletion to 185 cells/mm3 combined with systemic wasting and sensory neuropathic damage constitutes profound clinical markers. This satisfies both primary criteria 14.11(A) and 14.11(G) due to severe daily task restriction. Preponderance scoring stands at 94% confidence.

Respectfully submitted,
REPRESENTATIVE FOR THE CLAIMANT`;
    } else if (selectedCase.id === "case-ms") {
      brief = `BEFORE THE SOCIAL SECURITY ADMINISTRATION
OFFICE OF HEARING OPERATIONS (OHO)

Sarah Jenkins, claimant.

PRE-HEARING BRIEF IN SUPPORT OF MEDICAL EQUIVALENCY
--------------------------------------------------
I. COMPREHENSIVE CASE ANCHOR
Claimant is a 40-year-old female suffering from Secondary Progressive Multiple Sclerosis. 

II. CLINICAL PROGRESSION & CITATIONS
1. Neurological plaque progression:
MRI reports from Mayo Clinic Neurololgy explicitly catalog several new demyelinating tracks along claimant's cervical cord [Exhibit 1A, page 4]. 

2. Locomotor Ataxia:
Dr. Mercer's examination reveals severe spasticity (3+ knee reflex) and walking instability. The physical assessment concludes that patient is entirely unable to perform single-line heel-to-toe gait maneuvers and is clinically mandated to use bilateral forearm crutches [Exhibit 1A, page 4] for safe mobility. 

3. Neuro-Cognitive Decay:
Symbol Digit Modalities Test (SDMT) scores fall 1.5 SD below average, validating profound cognitive pacing deficiencies and constant sensory upper extremity numbness [Exhibit 1A, page 4].

III. CONCLUSION
The severity of Sarah Jenkins' locomotive ataxia matches, if not exceeds, the neurological criteria of Section 11.09. Forearm crutches usage demonstrates high functional devastation.`;
    } else {
      brief = `BEFORE THE SOCIAL SECURITY ADMINISTRATION
OFFICE OF HEARING OPERATIONS (OHO)

Arthur Pendelton, claimant.

EVIDENTIARY BRIEF: GENOMIC NEURO-MARKER ALIGNMENT
------------------------------------------------
I. CLINICAL METADATA SUMMARY
Claimant Arthur Pendelton exhibits severe treatment-resistant Attention Deficit Hyperactivity Disorder (ADHD) with profound executive dysfunction.

II. INTEGRATED EVIDENCE PROFILE
1. Clinical Attentional Limits:
Neuropsychological files from the Genomic Cognitive Registry document that claimant is unable to engage in sustained complex task performance exceeding 5-minute intervals [Exhibit 1A, page 3]. Restless hyperactive symptoms prevent claimant from sitting or remaining stationary for greater than 15 continuous minutes [Exhibit 1A, page 3].

2. Cognitive Index Scores:
Substandard working memory (WMI of 78) and slow processing speed (PSI of 74) are established under Dr. Cho's direct testing [Exhibit 1A, page 3].

3. Genomic Evidence Correlation:
Physical high-density DNA analysis of claimant reveals a Linkage-Disequilibrium (LDpred2) adjusted Polygenic Risk Score (PRS) in the 98th percentile for ADHD liability, verifying the underlying physiological source of cognitive pathology [Exhibit 1A, page 3].

III. CONCLUSION
Claimant has established extreme constraints under Section 12.11.`;
    }

    setFinalBriefText(brief);
    addLog("agent-writer", "Brief compilation complete. Formatting report structure.", "success");
    await sleep(1500);

    // Step 5: Grader Audits Citations
    setCurrentAgentIndex(4);
    addLog("agent-grader", "Grader Engine analyzing generated text block.", "info");
    addLog("agent-grader", "Scanning for potential hallucinations and unverified claims...", "info");
    await sleep(1800);

    // Verify all citations on case
    const cites: { [key: string]: boolean } = {};
    if (selectedCase.id === "case-hiv") {
      cites["Exhibit 1A, page 2"] = true;
      cites["Exhibit 2B, page 3"] = true;
    } else if (selectedCase.id === "case-ms") {
      cites["Exhibit 1A, page 4"] = true;
    } else {
      cites["Exhibit 1A, page 3"] = true;
    }
    setVerifiedCitations(cites);

    addLog("agent-grader", `All citations ([Exhibit A/B]) verified. 100% correlation with original raw clinic logs. Hallucinations count: 0.`, "success");
    addLog("agent-supervisor", "Supervisor approving final document packages. Security rules compliant. Terminating run.", "success");
    
    setPipelineState("completed");
    setCurrentAgentIndex(-1);
    setActiveTab("brief");
  };

  // Get source mapping for Hovered Citation
  const handleHoverCitationEnter = (cite: string) => {
    let sourceText = "";
    if (selectedCase.id === "case-hiv") {
      if (cite.includes("1A")) {
        sourceText = selectedCase.exhibits[0].sourceText;
      } else {
        sourceText = selectedCase.exhibits[1].sourceText;
      }
    } else if (selectedCase.id === "case-ms") {
      sourceText = selectedCase.exhibits[0].sourceText;
    } else {
      sourceText = selectedCase.exhibits[0].sourceText;
    }
    setHoveredCitation({ text: cite, source: sourceText });
  };

  return (
    <div className="bg-slate-900 border-rl border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[640px]">
      
      {/* Top Header Controls */}
      <div className="bg-slate-950/70 p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold tracking-tight text-white font-sans">
              SSA Medical Evidence Discovery Workspace
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            RAG-driven Adjudication Workspace  •  Bates-stamped Auditing  •  Zero Hallucinations
          </p>
        </div>

        {/* Case Chooser */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">SELECT CASE:</span>
          <select 
            className="bg-slate-900 text-xs text-white border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-mono"
            value={selectedCase.id}
            onChange={(e) => {
              const cs = SAMPLE_CASES.find(c => c.id === e.target.value);
              if (cs) setSelectedCase(cs);
            }}
          >
            {SAMPLE_CASES.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.listings[0]})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[500px]">
        
        {/* Left Side: Parameters / Control board (3 cols) */}
        <div className="lg:col-span-3 bg-slate-950/30 p-4 border-r border-slate-800 flex flex-col gap-4">
          
          {/* Metadata Card */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">Claimant Metadata</span>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">NAME</span>
                <span className="text-xs text-slate-200 font-sans font-medium">{selectedCase.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 block font-mono">DOB</span>
                  <span className="text-xs text-slate-200 font-mono">{selectedCase.dob}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-mono">SSN</span>
                  <span className="text-xs text-slate-200 font-mono">
                    {isScrubbed ? "<SSN_REDACTED>" : selectedCase.ssn}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 block font-mono">ALLEGED ONSET DATE</span>
                <span className="text-xs text-emerald-400 font-mono">{selectedCase.allegedOnset}</span>
              </div>
            </div>
          </div>

          {/* HIPAA redactor action panel */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                {isScrubbed ? (
                  <Shield className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                )}
                <span>HIPAA Safety Engine</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Scrub Patient Health Information (PHI) before executing queries.
              </p>
            </div>
            <button
              onClick={handleScrubAction}
              className={`w-full py-2 px-3 rounded text-xs font-medium font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isScrubbed 
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                  : "bg-amber-600 hover:bg-amber-500 text-white"
              }`}
            >
              {isScrubbed ? "PHI Clean • Secure Log" : "Scrub PHI Records"}
            </button>
          </div>

          {/* Semantic query expansion widget */}
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-lg flex flex-col gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">Multi-Perspective Search</span>
              <p className="text-[10px] text-slate-400">
                Expands search terms into multiple legal, clinical, and causal domains.
              </p>
            </div>
            
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="e.g. fatigue neuropathy CD4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQueryExpansion()}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 flex-1 font-mono"
              />
              <button
                onClick={handleQueryExpansion}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {expandedQueries && (
              <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 space-y-1 bg-slate-950 p-2 rounded">
                <div className="text-white font-semibold">Expanded Queries:</div>
                <div><span className="text-blue-400 font-mono">Clinical:</span> {expandedQueries.clinical.substring(0, 45)}...</div>
                <div><span className="text-purple-400 font-mono">Legal:</span> {expandedQueries.legal.substring(0, 45)}...</div>
                <div><span className="text-amber-400 font-mono">Causal:</span> {expandedQueries.causal.substring(0, 45)}...</div>
              </div>
            )}
          </div>

          {/* Run Diagnostic Model button */}
          <button
            onClick={runRAGPipeline}
            disabled={pipelineState === "running" || !isScrubbed}
            className={`w-full py-2.5 px-3 rounded text-xs font-semibold font-sans flex items-center justify-center gap-2 border shadow-lg transition-all cursor-pointer ${
              !isScrubbed 
                ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                : pipelineState === "running"
                  ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-500"
            }`}
          >
            <Cpu className={`w-4 h-4 ${pipelineState === "running" ? "animate-spin" : ""}`} />
            {pipelineState === "running" ? "Agents Running..." : "Execute Discovery RAG"}
          </button>
          
          {!isScrubbed && (
            <div className="flex items-start gap-1 p-2 bg-amber-950/20 border border-amber-800/40 rounded">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-[9px] text-amber-500 leading-tight font-mono">
                System requires PHI scrub protocols before executing external vector indexing.
              </span>
            </div>
          )}

        </div>

        {/* Right Side: Tab Workspace Viewer (9 cols) */}
        <div className="lg:col-span-9 flex flex-col bg-slate-950 p-4">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-850 gap-2 mb-4 overflow-x-auto shrink-0 pb-1">
            <button
              onClick={() => setActiveTab("exhibits")}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
                activeTab === "exhibits" 
                  ? "text-emerald-400 border-b-2 border-emerald-500" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Clinical Records ({selectedCase.exhibits.length})
            </button>
            <button
              onClick={() => setActiveTab("deidentify")}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
                activeTab === "deidentify" 
                  ? "text-emerald-400 border-b-2 border-emerald-500" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Side-by-Side PHI Scrub
            </button>
            <button
              onClick={() => setActiveTab("rag")}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
                activeTab === "rag" 
                  ? "text-emerald-400 border-b-2 border-emerald-500" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Agents Pipeline Run
            </button>
            <button
              onClick={() => setActiveTab("knowledge")}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
                activeTab === "knowledge" 
                  ? "text-emerald-400 border-b-2 border-emerald-500" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Longitudinal Timeline
            </button>
            <button
              onClick={() => setActiveTab("brief")}
              disabled={finalBriefText === ""}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all cursor-pointer ${
                finalBriefText === "" 
                  ? "text-slate-600 cursor-not-allowed" 
                  : activeTab === "brief" 
                    ? "text-emerald-400 border-b-2 border-emerald-500" 
                    : "text-slate-400 hover:text-slate-250"
              }`}
            >
              Evidentiary Pre-hearing Brief
            </button>
          </div>

          {/* Active Tab Contents with animation */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              
              {/* Tab: Original Medical Records */}
              {activeTab === "exhibits" && (
                <motion.div
                  key="exhibits"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <p className="text-xs text-slate-400 font-mono">
                    Below are the clinical exhibits loaded in the files database. These serve as the ground-truth logs for RAG search.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    {selectedCase.exhibits.map((ex, index) => (
                      <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                        <div className="bg-slate-950 px-3.5 py-2.5 border-b border-slate-800 flex justify-between items-center">
                          <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                            {ex.exhibitNumber}: {ex.facility}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            DATE: {ex.dateOfService}  •  {ex.pageCount} Pages
                          </span>
                        </div>
                        <div className="p-4">
                          <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed select-text bg-slate-950 p-3.5 rounded-md border border-slate-850">
                            {ex.sourceText}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tab: Side-by-Side Redactor */}
              {activeTab === "deidentify" && (
                <motion.div
                  key="deidentify"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <div className="flex select-none items-center justify-between bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg text-xs font-mono text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      HIPAA Privacy Audit Trail Active
                    </span>
                    <span>Tokens Cataloged: 3</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[420px]">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
                      <div className="bg-slate-950 p-2.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        Original Document Core (PHIs Exposed)
                      </div>
                      <div className="p-3 overflow-y-auto flex-1 font-mono text-xs text-red-300 leading-relaxed whitespace-pre-wrap">
                        {selectedCase.exhibits[0].sourceText}
                      </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden">
                      <div className="bg-slate-950 p-2.5 border-b border-slate-800 text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center justify-between">
                        <span>Clean Redacted Document Buffer</span>
                        <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <div className="p-3 overflow-y-auto flex-1 font-mono text-xs text-emerald-300 leading-relaxed whitespace-pre-wrap bg-slate-950/80">
                        {isScrubbed ? getScrubbedText(selectedCase.exhibits[0].sourceText) : "Execute scrubbing using the panel to generate clean de-identified values."}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Tab: Multi Agent Runway */}
              {activeTab === "rag" && (
                <motion.div
                  key="rag"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-4"
                >
                  
                  {/* Left Column: Agents State (5 cols) */}
                  <div className="lg:col-span-5 space-y-3.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">Active RAG Node Cluster</span>

                    <div className="space-y-2.5">
                      {RAG_AGENTS.map((agt, i) => {
                        const isActive = currentAgentIndex === i;
                        const isDone = pipelineState === "completed" || (pipelineState === "running" && i < currentAgentIndex);
                        
                        return (
                          <div 
                            key={agt.id} 
                            className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
                              isActive 
                                ? "bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500"
                                : isDone
                                  ? "bg-slate-900/80 border-slate-800 opacity-70"
                                  : "bg-slate-900/30 border-slate-850"
                            }`}
                          >
                            <div className="text-xl shrink-0 p-1 bg-slate-950 rounded border border-slate-800 shadow">
                              {agt.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-200 block font-mono leading-none">
                                  {agt.name}
                                </span>
                                {isActive && (
                                  <span className="text-[9px] bg-emerald-500 text-slate-950 px-1 py-0.5 rounded font-bold uppercase animate-pulse">
                                    ACTIVE
                                  </span>
                                )}
                                {isDone && (
                                  <span className="text-[9px] text-emerald-400 font-bold block">
                                    ✓ DONE
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">{agt.description}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Dynamic Terminal logs (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden h-[450px]">
                    <div className="bg-slate-950 border-b border-slate-800 p-3 flex justify-between items-center select-none">
                      <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-emerald-400" />
                        Agents Stream Logs
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        Pipeline Status: <span className="uppercase text-emerald-400">{pipelineState}</span>
                      </span>
                    </div>

                    <div className="p-3 overflow-y-auto flex-1 font-mono text-[11px] space-y-2 bg-slate-950/50">
                      {pipelineLogs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-505 text-xs">
                          <Bot className="w-8 h-8 text-slate-700 mb-2 animate-bounce" />
                          <span className="text-slate-500">Awaiting Discovery Trigger Command...</span>
                        </div>
                      )}
                      {pipelineLogs.map((log) => {
                        let colorClass = "text-slate-300";
                        if (log.type === "success") colorClass = "text-emerald-400";
                        if (log.type === "warning") colorClass = "text-amber-400";
                        if (log.type === "error") colorClass = "text-red-400";
                        
                        return (
                          <div key={log.id} className="border-b border-slate-900 pb-1.5">
                            <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                            <span className="text-blue-400 mr-2">[{log.agentId.split("-")[1].toUpperCase()}]</span>
                            <span className={colorClass}>{log.message}</span>
                            
                            {/* Render extracted details directly when complete */}
                            {log.metadata && log.agentId === "agent-extractor" && (
                              <div className="mt-1 bg-slate-950 p-2 rounded border border-slate-850 text-[10px] text-slate-400 space-y-1">
                                <span className="text-white font-semibold">Parsed Entities:</span>
                                <div><span className="text-emerald-400">Diag:</span> {log.metadata[0].diagnoses.join(", ")}</div>
                                <div><span className="text-emerald-400">Limits:</span> {log.metadata[0].functionalLimitations.map((l: string) => `• ${l}`).join(" ")}</div>
                                <div><span className="text-emerald-400">Ref:</span> {log.metadata[0].exhibitReference}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* Tab: Longitudinal Timeline */}
              {activeTab === "knowledge" && (
                <motion.div
                  key="knowledge"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <p className="text-xs text-slate-400 font-mono">
                    Below is the integrated longitudinal clinical timeline generated by the RAG memory graph, indexing key symptoms, diagnoses, and bates citations.
                  </p>

                  <div className="relative border-l border-emerald-500/30 pl-6 ml-4 py-2 space-y-6">
                    {extractedEvidence.length === 0 ? (
                      <div className="bg-slate-900 border border-slate-850 p-6 rounded-lg text-center text-xs text-slate-500 font-mono">
                        No Timeline Structured. Please first run the "Execute Discovery RAG" pipeline.
                      </div>
                    ) : (
                      extractedEvidence.map((ev, index) => (
                        <div key={index} className="relative">
                          {/* Dot marker */}
                          <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-lg glow" />
                          
                          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2">
                            <div className="flex justify-between items-center bg-slate-950 -mx-4 -mt-4 px-4 py-2 border-b border-slate-800/60 rounded-t-lg">
                              <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                {ev.dateOfService}
                              </span>
                              <span className="text-[10px] text-blue-400 font-mono uppercase bg-blue-950/50 px-2 py-0.5 rounded border border-blue-900/40">
                                {ev.exhibitReference}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                              <div>
                                <span className="text-[10px] text-slate-500 font-mono block">DIAGNOSES DETECTED</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {ev.diagnoses.map((d, i) => (
                                    <span key={i} className="text-[10px] bg-slate-950 border border-slate-800 text-slate-350 px-2 py-1 rounded">
                                      {d}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 font-mono block">FUNCTIONAL RESIDUAL CAPACITY (RFC) IMPAIRMENTS</span>
                                <div className="space-y-1 mt-1 text-[11px] text-slate-300 font-mono">
                                  {ev.functionalLimitations.map((l, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                      <span className="text-emerald-500 shrink-0">•</span>
                                      <span>{l}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-slate-850 pt-2 bg-slate-950/40 -mx-4 -mb-4 p-4 rounded-b-lg">
                              <span className="text-[9px] text-slate-500 font-mono uppercase block mb-1">Source Excerpt</span>
                              <p className="text-[11px] italic text-slate-400 font-mono">
                                "{ev.evidenceSource}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab: Prehearing Brief (Citations Highlighted) */}
              {activeTab === "brief" && (
                <motion.div
                  key="brief"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <div className="bg-emerald-950/30 border border-emerald-900/60 p-3 rounded-lg flex items-start gap-2 text-xs">
                    <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-400">Bates Audit Checker Active:</span>{" "}
                      <span className="text-slate-300 font-mono">
                        Hover or click any highlighted bracket citation (e.g. <span className="text-emerald-400 underline font-semibold">[Exhibit 1A, page 2]</span>) to view its underlying physical record sources in real-time.
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    
                    {/* Left Panel: Brief Reader (8 cols) */}
                    <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-lg p-5 leading-relaxed overflow-y-auto h-[480px]">
                      <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-mono">DOCKET DOCUMENT COMPILER</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold uppercase">
                          VERIFIED HALLUCINATION-FREE
                        </span>
                      </div>

                      {/* We parse the brief string and make citations interactive */}
                      <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap select-text leading-relaxed">
                        {finalBriefText.split(/(\[Exhibit \d+[A-Z](?:, page \d+)?\])/g).map((part, i) => {
                          const isCite = part.match(/\[Exhibit \d+[A-Z](?:, page \d+)?\]/);
                          if (isCite) {
                            return (
                              <span 
                                key={i} 
                                className="bg-emerald-950 text-emerald-400 px-1 py-0.5 rounded border border-emerald-800/80 cursor-pointer font-bold transition-all hover:bg-emerald-500 hover:text-slate-950"
                                onMouseEnter={() => handleHoverCitationEnter(part)}
                                onClick={() => handleHoverCitationEnter(part)}
                              >
                                {part}
                              </span>
                            );
                          }
                          return part;
                        })}
                      </pre>
                    </div>

                    {/* Right Panel: Interactive Bates stamp preview (4 cols) */}
                    <div className="lg:col-span-4 bg-slate-900 border border-slate-850 p-4 rounded-lg flex flex-col justify-between h-[480px]">
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-1 text-xs font-bold text-white font-mono uppercase">
                          <Layers className="w-3.5 h-3.5 text-blue-400" />
                          <span>Citation Verification</span>
                        </div>
                        
                        {hoveredCitation ? (
                          <div className="space-y-3">
                            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                              <span className="text-[10px] text-slate-500 font-mono block">VERIFIED TARGET</span>
                              <span className="text-xs text-emerald-400 font-mono font-bold">
                                {hoveredCitation.text}
                              </span>
                            </div>

                            <div className="bg-slate-950 p-3 rounded border border-slate-850 text-[11px] leading-relaxed relative max-h-[290px] overflow-y-auto">
                              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                              <span className="text-[9px] text-slate-500 block mb-1 font-mono uppercase">PHYSICAL CLINIC SOURCE TEXT:</span>
                              <p className="text-slate-350 italic font-mono uppercase bg-slate-900 p-2 rounded border border-slate-850">
                                {hoveredCitation.source.substring(0, 220)}...
                              </p>
                            </div>
                          </div>
                      ) : (
                        <div className="text-center p-6 border border-dashed border-slate-800 rounded bg-slate-950/40 text-xs text-slate-500 font-mono">
                          Hover over any bracket citation in the brief text to view the matching clinic records instantly.
                        </div>
                      )}
                      </div>

                      <div className="bg-slate-950 p-3 rounded border border-slate-850">
                        <span className="text-[10px] text-slate-500 block font-mono">LEGAL ANALYTIC SCORE</span>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-xl font-bold font-sans text-emerald-400">
                            {listingEvaluation ? (listingEvaluation.preponderanceScore * 100).toFixed(0) : "0"}%
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">Preponderance index</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-1 leading-tight">
                          Calculated from clinical limitation parameters cross-referenced with Listing criteria.
                        </p>
                      </div>

                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
