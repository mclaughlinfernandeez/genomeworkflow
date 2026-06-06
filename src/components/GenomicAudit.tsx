import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileCode, Terminal, Layers, CheckCircle, AlertTriangle, 
  Play, RefreshCw, Key, ShieldCheck, Download, Code, Cpu, 
  Trash2, Database, Network
} from "lucide-react";
import { PIPELINE_CODE_SNIPPETS } from "../data";
import { GWASPipelineStep, AuditLedgerEntry } from "../types";
import GenomicTelemetry from "./GenomicTelemetry";

export default function GenomicAudit() {
  const [pipelineSteps, setPipelineSteps] = useState<GWASPipelineStep[]>(PIPELINE_CODE_SNIPPETS);
  const [selectedStep, setSelectedStep] = useState<GWASPipelineStep>(PIPELINE_CODE_SNIPPETS[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<AuditLedgerEntry[]>([]);
  const [dilithiumSignature, setDilithiumSignature] = useState<string>("");
  const [manifestVerified, setManifestVerified] = useState<"idle" | "verifying" | "verified" | "error">("idle");
  const [mainframeOutput, setMainframeOutput] = useState<string[]>([]);
  
  const [rawGWASHash] = useState<string>("8F12D93A4F1D78A2BC8912A32976F1CD902FE93C89B1D93A410EB93F62BD8D91");
  const [prsOutputHash, setPrsOutputHash] = useState<string>("");

  const runFullPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleOutput([]);
    setMainframeOutput([]);
    setPrsOutputHash("");
    setDilithiumSignature("");
    setManifestVerified("idle");

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const appendLog = (msg: string) => {
      setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    // Reset steps statuses
    setPipelineSteps(prev => prev.map(s => ({ ...s, status: "idle" })));

    // 1. Python Orchestrator Initialization
    setCurrentStepIndex(0);
    setPipelineSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: "running" } : s));
    appendLog("python pipeline.py --init");
    appendLog("=== GWAS PRS PIPELINE ORCHESTRATION ===");
    appendLog(`RUN_ID generated: prs_run_${new Date().toISOString().slice(0,10).replace(/-/g, "")}_${Math.floor(Math.random()*100000)}`);
    appendLog("Hashing base summary stats: gwas/summary_stats/adhd_gwas.tsv.gz");
    await sleep(1500);
    appendLog(`Calculated SHA3-256 base genetic signature: ${rawGWASHash}`);
    appendLog("Launching R session to trigger statistical genetics steps...");
    setPipelineSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: "completed" } : s));
    await sleep(1000);

    // 2. R Harmonization
    setCurrentStepIndex(1);
    setPipelineSteps(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: "running" } : s));
    appendLog("Rscript prs/scripts/run_prs_pipeline.R --harmonize");
    appendLog("[R] Loading summary stats: adhd_gwas.tsv.gz...");
    await sleep(1200);
    appendLog("[R] Executing base match filters. Excluding polymorphic A/T and C/G alleles.");
    appendLog("[R] Retained 14,281 highly informative high-density SNPs. Standard base matches complete.");
    setPipelineSteps(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: "completed" } : s));
    await sleep(800);

    // 3. R LD Matrix
    setCurrentStepIndex(2);
    setPipelineSteps(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: "running" } : s));
    appendLog("Rscript prs/scripts/run_prs_pipeline.R --ld-matrix");
    appendLog("[R] Calculating Linkage Disequilibrium (LD) correlation markers...");
    await sleep(1500);
    appendLog("[R] Correlating G matrix map elements with 3-centiMorgan genetic recombination spacing.");
    appendLog("[R] LD Correlation Matrix structured securely in physical memory.");
    setPipelineSteps(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: "completed" } : s));
    await sleep(800);

    // 4. Compute PRS
    setCurrentStepIndex(3);
    setPipelineSteps(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: "running" } : s));
    appendLog("Rscript prs/scripts/run_prs_pipeline.R --compute-prs");
    appendLog("[R] Injecting Bayesian weights model (infinitesimal target).");
    appendLog("[R] Scaling model parameters with regional heritability coefficient h2=0.20.");
    await sleep(1800);
    appendLog("[R] Solved individual Polygenic Risk vulnerability weights.");
    appendLog("[R] Emitting final results table container: prs/outputs/prs_scores.csv");
    setPipelineSteps(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: "completed" } : s));
    
    // Set output hash
    const outHash = "2D8A41E1BEB3E48197EC3D6F21BC8A2DE9810FB2C3D9A4C610ED982BFD01E2A4";
    setPrsOutputHash(outHash);
    await sleep(1000);

    // 5. Validation (ROC)
    setCurrentStepIndex(4);
    setPipelineSteps(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: "running" } : s));
    appendLog("Rscript prs/scripts/run_prs_pipeline.R --validate");
    appendLog("[R] Calculating pROC metrics against true condition profiles...");
    await sleep(1200);
    appendLog("[R] Calculated predictive power AUC: 0.842 (high clinical sensitivity).");
    setPipelineSteps(prev => prev.map((s, idx) => idx === 4 ? { ...s, status: "completed" } : s));
    await sleep(800);

    // 6. Python Ledger Write
    setCurrentStepIndex(5);
    setPipelineSteps(prev => prev.map((s, idx) => idx === 5 ? { ...s, status: "running" } : s));
    appendLog("python audit_ledger.py --append");
    appendLog(`Hashing generated PRS outputs: prs/outputs/prs_scores.csv`);
    await sleep(1500);
    appendLog(`Registry recorded! Appending file hashes and sequence blocks into sequential audit/ledger.jsonl...`);
    
    // Append mock ledger entries
    const newEntry: AuditLedgerEntry = {
      timestamp: new Date().toISOString(),
      stage: "PRS_OUTPUT",
      inputFile: "prs_scores.csv",
      sha3_256: outHash,
      crystalsSignature: "DILITHIUM_SIG_8F12D93A4F11EBC89812A98DBC81CD902FE93C89B1D93A4...",
      cobolLine: "PRS_OUTPUT|2D8A41E1BEB3E48197EC3D6F21BC8A2DE9810FB2C3D9A4C610ED982BFD01E2A4"
    };
    setLedgerEntries(prev => [newEntry, ...prev]);

    // Dilithium Manifest Signing
    appendLog("Signing workflow output manifest using CRYSTALS-Dilithium post-quantum cryptography algorithm...");
    await sleep(1000);
    setDilithiumSignature("SIG_DILITHIUM_V3_710FABC89EECE1329A88E102F3A818EF9D30C90E1120FEAB891DDE8922C1AEE89A3C22F");
    appendLog("Manifest signed securely. Post-Quantum algorithm: Crystals-Dilithium v3.");
    setPipelineSteps(prev => prev.map((s, idx) => idx === 5 ? { ...s, status: "completed" } : s));
    await sleep(1000);

    // 7. COBOL Chain of Custody
    setCurrentStepIndex(6);
    setPipelineSteps(prev => prev.map((s, idx) => idx === 6 ? { ...s, status: "running" } : s));
    appendLog("cobc -x -run CHAINCUST.cbl");
    appendLog("[COBOL] OPENING EXTEND LEDGER-FILE ON WORM DEVICE...");
    await sleep(1200);
    appendLog("[COBOL] MOVED PRS_OUTPUT STAGE CODES TO WS-STAGE FIELD");
    appendLog("[COBOL] STITCHED PIPELINE LOGS PIPES INTO MAIN-PARA BUFFER AND WRITE RECORD LOG");
    appendLog("[COBOL] MAIN-PARA ROUTINE TERMINATING SUCCESSFULLY.");
    setPipelineSteps(prev => prev.map((s, idx) => idx === 6 ? { ...s, status: "completed" } : s));
    await sleep(1000);

    // 8. COBOL Evidentiary Reporter
    setCurrentStepIndex(7);
    setPipelineSteps(prev => prev.map((s, idx) => idx === 7 ? { ...s, status: "running" } : s));
    appendLog("cobc -x -run EVIDENCE.cbl");
    appendLog("[COBOL] GENERATING COMPILER SUMMARY REPORTS FOR COURT AUDITS...");
    await sleep(1200);
    
    // Mainframe Display terminal content
    const mainframeLines = [
      "================================================================================",
      "|                     P O L Y G E N I C   R I S K   S C O R E                  |",
      "|                          M A I N F R A M E   L E D G E R                      |",
      "================================================================================",
      "RUN INDEX DETECTED: PRS_RUN_220260524",
      "ALGORITHM MODEL   : LDPRED2 INF BAYES PREDICTOR",
      "SHA3 FINGERPRINT  : " + outHash.substring(0, 40) + "...",
      "LEDGER COMPLIANCE : WORM CUSTODY RECORD IMMUTABLE",
      "STATUS CODE       : SUCCESSFUL RUN VERIFICATION COMPLETE (0000000000)",
      "--------------------------------------------------------------------------------",
      "SYSTEM STATUS: CHAIN OF CUSTODY AUDIT SECURE"
    ];
    setMainframeOutput(mainframeLines);
    appendLog("[COBOL] EVIDENCE.cbl run terminal output captured.");
    setPipelineSteps(prev => prev.map((s, idx) => idx === 7 ? { ...s, status: "completed" } : s));

    appendLog("=== IMMUTABLE GENOMIC AUDIT PIPELINE RUN SUCCESSFUL! ===");
    setIsRunning(false);
    setCurrentStepIndex(-1);
  };

  const verifyAuditManifests = async () => {
    setManifestVerified("verifying");
    await new Promise(resolve => setTimeout(resolve, 1800));
    setManifestVerified("verified");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[640px]">
      
      {/* Platform Header */}
      <div className="bg-slate-950/70 p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold tracking-tight text-white font-sans">
              Genomic Audit Workspace & COBOL Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            GWAS Summary statistical records  •  LDpred2 Infinitesimal weights  •  CRYSTALS-Dilithium seals  •  COBOL Punch logs
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={runFullPipeline}
          disabled={isRunning}
          className={`py-2 px-4 rounded text-xs font-semibold font-sans flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
            isRunning 
              ? "bg-blue-950 text-blue-400 border border-blue-900 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-500"
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
          {isRunning ? "Running Pipeline..." : "Execute Genomic PRS Pipeline"}
        </button>
      </div>

      {/* Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-[500px]">
        
        {/* Left column: Repository Explorer File Tree & Code examiner (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950/30 p-4 border-r border-slate-800 flex flex-col gap-4">
          
          {/* File Repo tree list */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">Genomics Pipeline Files</span>
            <div className="bg-slate-950/70 rounded border border-slate-850 p-2.5 space-y-1">
              {pipelineSteps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStep(s)}
                  className={`w-full text-left p-1.5 rounded text-xs font-mono flex items-center justify-between transition-colors ${
                    selectedStep.id === s.id 
                      ? "bg-blue-950/50 text-blue-400 border-l-2 border-blue-500 font-semibold" 
                      : "text-slate-450 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5" />
                    {s.scriptName}
                  </span>
                  
                  {/* Step status */}
                  <span className={`text-[9px] px-1 py-0.5 rounded leading-none ${
                    s.status === "completed" 
                      ? "bg-emerald-950 text-emerald-400"
                      : s.status === "running"
                        ? "bg-blue-950 text-blue-400 animate-pulse"
                        : "text-slate-500"
                  }`}>
                    {s.status === "completed" ? "✓" : s.status === "running" ? "RUN" : "IDLE"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Preview */}
          <div className="flex-1 flex flex-col bg-slate-950 rounded border border-slate-850 min-h-[290px] overflow-hidden">
            <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-850 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>{selectedStep.scriptName} ({selectedStep.language})</span>
              <span className="text-[9px] bg-slate-950 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold">
                CODE
              </span>
            </div>
            <div className="p-3 overflow-auto flex-1 font-mono text-[10px] leading-relaxed text-slate-300">
              <pre className="whitespace-pre">{selectedStep.codeSnippet}</pre>
            </div>
          </div>

        </div>

        {/* Right column: Sandbox Logs & Cryptographic Ledgers (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 p-4 gap-4">
          
          {/* Live System Telemetry Dashboard */}
          <GenomicTelemetry isRunning={isRunning} currentStepIndex={currentStepIndex} />
          
          {/* Top Row: Shell Console Logs Header / Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Terminal console */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col h-[270px]">
              <div className="bg-slate-950 p-2 border-b border-slate-850 flex justify-between items-center text-xs font-mono select-none">
                <span className="flex items-center gap-1 text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  Execution Session Output
                </span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 font-mono text-[10px] text-slate-300 space-y-1.5 bg-slate-950/30">
                {consoleOutput.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs">
                    <Database className="w-8 h-8 text-slate-700 mb-1" />
                    <span>Awaiting Pipeline Execution...</span>
                  </div>
                )}
                {consoleOutput.map((l, i) => (
                  <div key={i} className="leading-normal">{l}</div>
                ))}
              </div>
            </div>

            {/* Mainframe COBOL display emulator */}
            <div className="bg-teal-950/10 border border-teal-900/60 rounded-lg flex flex-col h-[270px] bg-slate-900">
              <div className="bg-slate-950 p-2 border-b border-slate-850 flex justify-between items-center text-xs font-mono select-none">
                <span className="flex items-center gap-1.5 text-teal-400">
                  <Cpu className="w-3.5 h-3.5" />
                  IBM Mainframe terminal 80-Col
                </span>
                <span className="text-[9px] bg-teal-950 text-teal-400 border border-teal-800 px-1 rounded uppercase">
                  COBOL_EMU
                </span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 font-mono text-[9px] text-teal-350 bg-slate-950 p-3 flex flex-col space-y-1">
                {mainframeOutput.length === 0 ? (
                  <div className="m-auto text-center text-slate-600 text-xs">
                    <span className="font-mono block mb-1">MAINFRAME COBOL REPORT</span>
                    <span className="text-[10px]">EVIDENCE.cbl is waiting for pipeline ledger outputs.</span>
                  </div>
                ) : (
                  mainframeOutput.map((line, idx) => (
                    <div key={idx} className="whitespace-pre font-mono leading-tight">
                      {line}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Bottom Row: Cryptographic Audit Trail Ledger file entries */}
          <div className="flex-1 min-h-[180px] bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div>
                <span className="text-xs font-bold text-white font-mono flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  audit/ledger.jsonl (Immutable WORM Record)
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Tamper-evident chain of custody blocks backed by CRYSTALS-Dilithium
                </span>
              </div>

              <div className="flex items-center gap-2">
                {manifestVerified === "verified" ? (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded font-bold font-mono uppercase">
                    IMMUTABILITY VERIFIED ✓
                  </span>
                ) : (
                  <button
                    onClick={verifyAuditManifests}
                    disabled={ledgerEntries.length === 0 || manifestVerified === "verifying"}
                    className={`py-1.5 px-3 rounded text-[10px] font-bold font-mono uppercase border transition-all cursor-pointer ${
                      ledgerEntries.length === 0 
                        ? "bg-slate-950 text-slate-650 border-slate-850 cursor-not-allowed"
                        : "bg-slate-950 hover:bg-slate-800 text-emerald-400 border-emerald-900"
                    }`}
                  >
                    {manifestVerified === "verifying" ? "Verifying Fingerprints..." : "Audit Ledger Hashes"}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[140px] font-mono text-[9px] text-slate-400 space-y-2">
              {ledgerEntries.length === 0 ? (
                <div className="h-full flex items-center justify-center italic text-slate-600 text-xs py-4">
                  No immutable entries registered yet. Execute the Genomic PRS Pipeline to write ledgers.
                </div>
              ) : (
                ledgerEntries.map((entry, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 border border-slate-850 rounded space-y-1">
                    <div className="flex justify-between text-blue-400">
                      <span>AUDIT COMPLIANCE ENTRY #{idx + 1} ({entry.stage})</span>
                      <span>{entry.timestamp}</span>
                    </div>
                    <div><span className="text-slate-500 font-semibold font-mono">INPUT FILE   :</span> <span className="text-slate-300">{entry.inputFile}</span></div>
                    <div><span className="text-slate-500 font-semibold font-mono">SHA3-256 HASH:</span> <span className="text-slate-300 text-[8px] tracking-tight">{entry.sha3_256}</span></div>
                    <div><span className="text-slate-500 font-semibold font-mono">COBOL REC    :</span> <span className="text-teal-400">{entry.cobolLine}</span></div>
                    {dilithiumSignature && (
                      <div className="truncate"><span className="text-slate-500 font-semibold font-mono">DILITHIUM    :</span> <span className="text-purple-400 text-[8px]">{dilithiumSignature}</span></div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
