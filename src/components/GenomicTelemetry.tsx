import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, ComposedChart, Area, Line, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { 
  Activity, ShieldAlert, Cpu, Heart, CheckCircle2, 
  TrendingUp, RefreshCw, AlertCircle, Zap, ShieldCheck 
} from "lucide-react";
import { GWASPipelineStep } from "../types";

interface GenomicTelemetryProps {
  isRunning: boolean;
  currentStepIndex: number;
}

interface PerformanceData {
  name: string;
  throughput: number; // kSNPs/sec
  errorRate: number;  // %
  cpuLoad: number;    // %
  memory: number;     // MB
}

export default function GenomicTelemetry({ isRunning, currentStepIndex }: GenomicTelemetryProps) {
  // Baseline static historical metrics for the core calculation stages
  const baseData: PerformanceData[] = [
    { name: "Orchestration", throughput: 5.2, errorRate: 0.01, cpuLoad: 12, memory: 256 },
    { name: "Harmonization", throughput: 14.8, errorRate: 0.14, cpuLoad: 45, memory: 512 },
    { name: "LD Correlation", throughput: 8.1, errorRate: 0.08, cpuLoad: 88, memory: 1840 },
    { name: "PRS LDpred2", throughput: 21.4, errorRate: 0.22, cpuLoad: 92, memory: 2048 },
    { name: "ROC Validation", throughput: 26.5, errorRate: 0.03, cpuLoad: 35, memory: 768 },
  ];

  const [liveData, setLiveData] = useState<PerformanceData[]>(baseData);
  const [activeMetrics, setActiveMetrics] = useState({
    throughput: 0,
    errorRate: 0,
    cpuLoad: 0,
    memory: 0
  });

  // Live noise simulation for real-time visualization when running
  useEffect(() => {
    let timer: any;
    if (isRunning) {
      timer = setInterval(() => {
        // Find which base metrics index matches current calculation stage
        // Map 0 -> 0, 1 -> 1, 2 -> 2, 3 -> 3, 4 -> 4, others clip to last or first
        const matchedIndex = Math.min(Math.max(currentStepIndex, 0), 4);
        const base = baseData[matchedIndex];

        // Add subtle real-time fluctuation
        const randThroughput = Math.max(1, +(base.throughput + (Math.random() - 0.5) * 3).toFixed(1));
        const randError = Math.max(0, +(base.errorRate + (Math.random() - 0.5) * 0.05).toFixed(3));
        const randCpu = Math.max(5, Math.min(100, Math.round(base.cpuLoad + (Math.random() - 0.5) * 10)));
        const randMemory = Math.round(base.memory + (Math.random() - 0.5) * 50);

        setLiveData(prev => {
          const next = [...prev];
          next[matchedIndex] = {
            ...base,
            throughput: randThroughput,
            errorRate: randError,
            cpuLoad: randCpu,
            memory: randMemory
          };
          return next;
        });

        setActiveMetrics({
          throughput: randThroughput,
          errorRate: randError,
          cpuLoad: randCpu,
          memory: randMemory
        });
      }, 400);
    } else {
      // Default idle average metrics
      setLiveData(baseData);
      setActiveMetrics({
        throughput: 0,
        errorRate: 0,
        cpuLoad: 0,
        memory: 0
      });
    }

    return () => clearInterval(timer);
  }, [isRunning, currentStepIndex]);

  // Derive status/alerts based on active metrics limits
  const isCpuCritical = activeMetrics.cpuLoad > 85;
  const isErrorWarning = activeMetrics.errorRate > 0.18;

  return (
    <div className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col gap-4 select-none">
      
      {/* Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? "bg-blue-400" : "bg-slate-505 bg-slate-500"}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isRunning ? "bg-blue-500 animate-pulse" : "bg-slate-600"}`}></span>
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Live PRS Engine Telemetry
            </h3>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            Statistical execution indicators, processing throughput indices, and system error rates.
          </p>
        </div>

        {/* Live indicator block */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <div className="flex items-center gap-1.5 bg-blue-950/80 border border-blue-900 px-2 py-0.5 rounded text-[10px] text-blue-400 font-mono animate-pulse">
              <Zap className="w-3 h-3 text-blue-400" />
              PRS COMPILING
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono">
              <AlertCircle className="w-3 h-3" />
              ENGINE IDLE
            </div>
          )}
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Metric: Throughput */}
        <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Throughput Rate</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold font-mono text-blue-400">
              {isRunning ? activeMetrics.throughput : "0.0"}
            </span>
            <span className="text-[9px] text-slate-500 font-mono">kSNPs/s</span>
          </div>
          <span className="text-[8px] text-slate-450 mt-1 font-mono">
            {isRunning ? "Real-time solver speed" : "Average: 15.2 kSNPs/s"}
          </span>
        </div>

        {/* Metric: Error Rate */}
        <div className={`bg-slate-950 border p-2.5 rounded-lg flex flex-col justify-between transition-colors ${isErrorWarning ? "border-amber-900" : "border-slate-850"}`}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">SNP Alignment Error</span>
            {isRunning && isErrorWarning && <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0" />}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-lg font-extrabold font-mono ${isErrorWarning ? "text-amber-400 animate-pulse" : "text-emerald-400"}`}>
              {isRunning ? `${activeMetrics.errorRate.toFixed(2)}%` : "0.00%"}
            </span>
          </div>
          <span className="text-[8px] text-slate-450 mt-1 font-mono">
            {isRunning ? (isErrorWarning ? "Approaching critical SNP bounds" : "Compliant alignment standard") : "Allowed limit: < 0.5%"}
          </span>
        </div>

        {/* Metric: CPU Strain */}
        <div className={`bg-slate-950 border p-2.5 rounded-lg flex flex-col justify-between transition-colors ${isCpuCritical ? "border-red-900" : "border-slate-850"}`}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Core CPU Load</span>
            {isRunning && isCpuCritical && <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-lg font-extrabold font-mono ${isCpuCritical ? "text-red-400" : "text-slate-250"}`}>
              {isRunning ? `${activeMetrics.cpuLoad}%` : "0%"}
            </span>
          </div>
          <span className="text-[8px] text-slate-450 mt-1 font-mono">
            {isRunning ? "8 Thread execution cluster" : "Multicore VM standing by"}
          </span>
        </div>

        {/* Metric: System Memory */}
        <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg flex flex-col justify-between">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Physical Memory</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-extrabold font-mono text-purple-400">
              {isRunning ? `${activeMetrics.memory}` : "0"}
            </span>
            <span className="text-[9px] text-slate-500 font-mono">MB</span>
          </div>
          <span className="text-[8px] text-slate-450 mt-1 font-mono">
            {isRunning ? "Sliding window footprint" : "Maximum capacity: 8,192MB"}
          </span>
        </div>

      </div>

      {/* Composed Chart Visualizer */}
      <div className="bg-slate-950 border border-slate-850 p-3 rounded-lg h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={liveData}
            margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
          >
            <defs>
              <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={10}
              tickLine={false}
              fontFamily="monospace"
            />
            
            {/* Primary Y-Axis for Throughput */}
            <YAxis 
              yAxisId="left"
              stroke="#3b82f6" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
              label={{ value: 'Throughput (kSNPs/s)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }, offset: 5 }}
            />

            {/* Secondary Y-Axis for Error Rate */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#10b981" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="monospace"
              label={{ value: 'Error Rate (%)', angle: 90, position: 'insideRight', style: { fill: '#64748b', fontSize: 9, fontFamily: 'monospace' }, offset: 5 }}
            />

            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '6px' }}
              labelStyle={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: 11, fontFamily: 'monospace' }}
              itemStyle={{ fontSize: 10, padding: '2px 0', fontFamily: 'monospace' }}
            />

            <Legend 
              verticalAlign="top" 
              height={28}
              iconSize={8}
              wrapperStyle={{ fontSize: 9, color: '#94a3b8', paddingBottom: 10, fontFamily: 'monospace' }}
            />

            {/* Bar chart representing heritability/throughput metric */}
            <Bar 
              yAxisId="left"
              name="Throughput speed (kSNPs/s)" 
              dataKey="throughput" 
              fill="url(#throughputGrad)"
              stroke="#3b82f6"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
              barSize={24}
            />

            {/* Area Line chart representing SNP alignment error rate */}
            <Area
              yAxisId="right"
              type="monotone"
              name="SNP Error Rate (%)"
              dataKey="errorRate"
              fill="url(#errorGrad)"
              stroke="#10b981"
              strokeWidth={2}
            />

            {/* CPU usage indicator line */}
            <Line 
              yAxisId="left"
              type="monotone"
              name="Core CPU load (%)"
              dataKey="cpuLoad"
              stroke="#f43f5e"
              strokeWidth={1.5}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
              strokeDasharray="4 4"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Safety Compliance Footnote */}
      <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg text-[9px] font-mono text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Acoustics compliance: Safe hardware standard. Verification manifest remains locked with post-quantum post-processor.</span>
      </div>

    </div>
  );
}
