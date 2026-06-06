import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Cpu, Database, Network, ArrowRight, UserCheck, Code } from "lucide-react";
import SSAMedicalDiscovery from "./components/SSAMedicalDiscovery";
import GenomicAudit from "./components/GenomicAudit";

export default function App() {
  const [activeModule, setActiveModule] = useState<"rag" | "gwas">("rag");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between select-none">
      
      {/* Top Professional Master Navigation Bar */}
      <header className="bg-slate-900/60 border-b border-slate-850 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand / Workspace */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-blue-600 p-2 rounded-lg shadow-inner shadow-white/10">
              <Database className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white uppercase font-sans">
                Medical & Genomic Intelligence Workspace
              </h1>
              <p className="text-[10px] text-slate-500 font-mono leading-none mt-0.5">
                Clinical-Legal Discovery  •  GWAS Audit Ledgers v2.4
              </p>
            </div>
          </div>

          {/* Module Toggles */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-805">
            <button
              onClick={() => setActiveModule("rag")}
              className={`px-4 py-1.5 rounded text-xs font-semibold font-sans transition-all flex items-center gap-2 cursor-pointer ${
                activeModule === "rag"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              SSA Medical Discovery (RAG)
            </button>
            <button
              onClick={() => setActiveModule("gwas")}
              className={`px-4 py-1.5 rounded text-xs font-semibold font-sans transition-all flex items-center gap-2 cursor-pointer ${
                activeModule === "gwas"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-950/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Genomic Audit (GWAS PRS)
            </button>
          </div>

        </div>
      </header>

      {/* Main Container Viewport */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
        
        {/* Module Switching with Smooth Transitions */}
        <AnimatePresence mode="wait">
          {activeModule === "rag" ? (
            <motion.div
              key="rag-module"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-850 p-5 rounded-xl mb-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-900 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono uppercase">
                    <ShieldCheck className="w-3 h-3" /> HIPAA SECURED PIPELINE
                  </div>
                  <h3 className="text-md font-semibold text-white tracking-tight">
                    Social Security Administration disability discovery
                  </h3>
                  <p className="text-xs text-slate-400 max-w-2xl font-mono">
                    Processes longitudinal diagnostic files through automated Agent networks (Supervisor, Entitiy Parser, Listing Expert, Brief Draftsman, and zero-tolerance Citations Auditor).
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">BETA STANDARD RELEASES</span>
                  <span className="text-xs text-slate-300 font-mono font-medium">Bates Audit v2.10</span>
                </div>
              </div>

              {/* Core SSAMedicalDiscovery component */}
              <SSAMedicalDiscovery />

            </motion.div>
          ) : (
            <motion.div
              key="gwas-module"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-850 p-5 rounded-xl mb-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-blue-950 border border-blue-900 px-2 py-0.5 rounded text-[10px] text-blue-400 font-mono uppercase">
                    <Code className="w-3 h-3" /> MULTI-STAGE REPRODUCIBLE GWAS
                  </div>
                  <h3 className="text-md font-semibold text-white tracking-tight">
                    Genomic Polygenic Risk (PRS) Audit Trails
                  </h3>
                  <p className="text-xs text-slate-400 max-w-2xl font-mono">
                    Combines Python workflow manifests with R statistics modeling, validating heritability indicators, post-quantum signers, and legacy mainframe COBOL tracking lines.
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">CRYSTOGRAPHIC SYSTEM</span>
                  <span className="text-xs text-slate-300 font-mono font-medium">Dilithium Signature Approved</span>
                </div>
              </div>

              {/* Core GenomicAudit component */}
              <GenomicAudit />

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Subtle Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-550 gap-2 font-mono">
          <span className="text-slate-500">
            SYSTEM ENGINE OPERATIONAL  •  IMMUTABLE LOGGERS ENGAGED  •  NO RECENT FAULTS DETECTED
          </span>
          <span className="text-slate-500">
            LOCALTTIME: {new Date().toISOString().substring(0, 19).replace('T', ' ')} UTC  •  SECURE SESSION
          </span>
        </div>
      </footer>

    </div>
  );
}
