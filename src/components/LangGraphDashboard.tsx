import React, { useState } from 'react';
import { 
  Network, Flame, Clock, Cpu, Code2, Sparkles, BookOpen, AlertCircle, 
  Layers, CheckCircle, Database, Settings, Terminal, RefreshCw, Layers2
} from 'lucide-react';
import { motion } from 'motion/react';

interface TraceStep {
  node: string;
  description: string;
  latencyMs: number;
  timestamp: string;
  promptTemplate?: string;
  ragDocuments?: string;
  tokens?: { input: number; output: number };
}

interface LangGraphDashboardProps {
  activeNode: string | null;
  traces: TraceStep[];
  ragContext: string;
  promptTrace: string;
  langsmithConfig: {
    LANGCHAIN_TRACING_V2: string;
    LANGCHAIN_ENDPOINT: string;
    LANGCHAIN_API_KEY: string;
    LANGCHAIN_PROJECT: string;
  };
}

export default function LangGraphDashboard({
  activeNode = 'router',
  traces = [],
  ragContext = '',
  promptTrace = '',
  langsmithConfig
}: LangGraphDashboardProps) {

  const [activeDebugTab, setActiveDebugTab] = useState<'graph' | 'telemetry' | 'rag' | 'prompt'>('graph');

  // Node description helper
  const nodes = [
    { id: 'router', label: '1. Router Node', icon: Network, desc: 'Menganalisis kueri & merutekan rute' },
    { id: 'flower_consultation', label: '2. Flower Consultation', icon: Sparkles, desc: 'Menjawab diskusi rancangan buket' },
    { id: 'bouquet_recommendation', label: '3. Bouquet Recommendation', icon: Layers, desc: 'Kuis buket & kompilasi budget' },
    { id: 'greeting_card_generator', label: '4. Greeting Card Generator', icon: Code2, desc: 'Variasi naskah ucapan puitis' },
    { id: 'flower_encyclopedia', label: '5. Flower Encyclopedia', icon: BookOpen, desc: 'Layanan floriologi & pustaka RAG' },
    { id: 'image_bouquet_analysis', label: '6. Image Bouquet Analysis', icon: Cpu, desc: 'Visi AI penaksir budget hemat' }
  ];

  // Calculate overall performance
  const totalLatency = traces.reduce((acc, curr) => acc + curr.latencyMs, 0);
  const totalTokens = traces.reduce((acc, curr) => acc + (curr.tokens ? curr.tokens.input + curr.tokens.output : 0), 0);

  return (
    <div id="langgraph-orchestrator-panel" className="bg-white border border-[#EFE9E1] rounded-2xl shadow-xs overflow-hidden flex flex-col h-full bg-gradient-to-b from-white to-[#FCFBFA]">
      {/* Visualizer Header */}
      <div className="p-4.5 bg-gray-900 text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1 px-2.5 rounded-full bg-[#E8B4B8] text-white text-[10px] font-bold tracking-wider uppercase">
            LangGraph / LangChain
          </div>
          <h3 className="text-xs font-bold font-serif tracking-tight">Observability Dashboard</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-400 font-bold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
          LangSmith Active
        </div>
      </div>

      {/* Debug Tabs Selection */}
      <div className="flex border-b border-[#EFE9E1] bg-[#FCFBFA]">
        {(['graph', 'telemetry', 'rag', 'prompt'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveDebugTab(tab)}
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider text-center border-r last:border-r-0 border-[#EFE9E1] transition-colors ${
              activeDebugTab === tab 
                ? 'bg-white text-gray-900 border-b-2 border-b-[#E8B4B8]' 
                : 'text-gray-400 hover:text-gray-900 hover:bg-white'
            }`}
          >
            {tab === 'graph' && '📍 Flowchart Node'}
            {tab === 'telemetry' && '📊 Tracing Trace'}
            {tab === 'rag' && '🗄️ Dokumen RAG'}
            {tab === 'prompt' && '📝 Prompt Template'}
          </button>
        ))}
      </div>

      {/* Panel Viewport */}
      <div className="p-5 flex-1 min-h-0 overflow-y-auto max-h-[500px]">
        {activeDebugTab === 'graph' && (
          <div className="space-y-5">
            <div className="p-3 bg-gray-50 border border-[#EFE9E1] rounded-xl text-[11px] text-gray-500 leading-relaxed font-semibold">
              💡 <strong className="text-gray-900">Penjelasan Diagram:</strong> Sistem ini menggunakan <strong className="text-gray-900">LangGraph Agentic Routing</strong>. Masukan pelanggan dialirkan ke <strong className="text-gray-800">Router Node</strong>, kemudian secara bersyarat dialirkan menuju sub-node ahli di bawah. Node merah muda menandakan agen aktif saat ini.
            </div>

            {/* Visual Graph Layout Grid */}
            <div className="space-y-3.5 relative">
              {/* Connective Line Design element */}
              <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-dashed border-l border-gray-200 -z-0" />

              {nodes.map((node) => {
                const isSelected = activeNode === node.id || (node.id === 'router' && !activeNode);
                const NodeIcon = node.icon;
                
                return (
                  <motion.div
                    key={node.id}
                    animate={isSelected ? { scale: 1.02 } : { scale: 1 }}
                    className={`relative flex items-start gap-3.5 p-3 rounded-xl border transition-all z-10 ${
                      isSelected 
                        ? 'bg-[#FDF1F2] border-[#E8B4B8] shadow-xs' 
                        : 'bg-white border-[#EFE9E1]'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg border shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-[#E8B4B8] text-white border-transparent' 
                        : 'bg-gray-50 text-gray-400 border-[#EFE9E1]'
                    }`}>
                      <NodeIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold transition-colors ${
                          isSelected ? 'text-gray-950 font-extrabold' : 'text-gray-700'
                        }`}>
                          {node.label}
                        </h4>
                        {isSelected && (
                          <span className="text-[8px] bg-pink-100 text-[#E8B4B8] px-1.5 py-0.5 rounded font-extrabold uppercase animate-pulse">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{node.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {activeDebugTab === 'telemetry' && (
          <div className="space-y-4">
            {/* LangSmith Configurations parameters */}
            <div className="bg-gray-950 text-gray-200 p-4 rounded-xl font-mono text-[10px] space-y-1.5 shadow-inner border border-gray-800">
              <span className="text-gray-500 font-bold uppercase text-[9px] block mb-2 tracking-widest flex items-center gap-1">
                <Settings className="w-3.5 h-3.5 text-gray-500" /> LangSmith Environment Variables:
              </span>
              <div><strong className="text-gray-400">export</strong> LANGCHAIN_TRACING_V2={langsmithConfig?.LANGCHAIN_TRACING_V2 || 'true'}</div>
              <div><strong className="text-gray-400">export</strong> LANGCHAIN_ENDPOINT="{langsmithConfig?.LANGCHAIN_ENDPOINT || 'https://api.smith.langchain.com'}"</div>
              <div><strong className="text-gray-400">export</strong> LANGCHAIN_PROJECT="{langsmithConfig?.LANGCHAIN_PROJECT || 'fleuria-boutique-agentic-workflow'}"</div>
              <div><strong className="text-gray-400">export</strong> LANGCHAIN_API_KEY="ls__****************fleuria"</div>
            </div>

            {/* Telemetry Overview Box */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-[#EFE9E1] p-3 rounded-xl flex items-center gap-2.5 shadow-xs">
                <Clock className="w-4 h-4 text-[#E8B4B8]" />
                <div>
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase block tracking-wider">Durasi Eksekusi:</span>
                  <span className="text-xs font-serif font-bold text-gray-900">{totalLatency || 140} ms</span>
                </div>
              </div>
              <div className="bg-white border border-[#EFE9E1] p-3 rounded-xl flex items-center gap-2.5 shadow-xs">
                <Flame className="w-4 h-4 text-[#E8B4B8]" />
                <div>
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase block tracking-wider">Total Konsumsi:</span>
                  <span className="text-xs font-serif font-bold text-gray-900">{totalTokens || 382} Tokens</span>
                </div>
              </div>
            </div>

            {/* Step-by-step Trace List */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase flex items-center gap-1.5">
                📜 Jejak Workflow Node (LangGraph Execution Steps):
              </h4>
              {traces.length > 0 ? (
                traces.map((step, idx) => (
                  <div key={idx} className="bg-white border border-[#EFE9E1] rounded-xl p-3.5 text-xs space-y-1 py-3 shadow-xs">
                    <div className="flex justify-between items-center bg-[#FCFBFA] -mx-3.5 -mt-3 p-2 px-3.5 rounded-t-xl border-b border-[#EFE9E1]">
                      <span className="font-extrabold text-gray-950 uppercase text-[10px]">
                        👉 [{idx + 1}] node: {step.node}
                      </span>
                      <span className="text-[9px] bg-red-50 text-[#E8B4B8] px-1.5 py-0.5 rounded font-extrabold">
                        ⏱️ {step.latencyMs} ms
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-2">{step.description}</p>
                    {step.tokens && (
                      <div className="text-[9px] text-gray-400 font-bold pt-1">
                        Input: {step.tokens.input} tokens | Output: {step.tokens.output} tokens
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 bg-white border border-dashed border-[#EFE9E1] rounded-xl text-center text-[11px] text-gray-400 font-medium">
                  Belum ada rekaman alur. Silakan gunakan fitur kuis, kamus, atau kirim pesan di sebelah kiri untuk merekam jejak evaluasi model secara real-time.
                </div>
              )}
            </div>
          </div>
        )}

        {activeDebugTab === 'rag' && (
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#E8B4B8]" />
              <h4 className="text-[10px] font-bold text-gray-450 tracking-widest uppercase">
                RAG Document Retrieval Context:
              </h4>
            </div>

            {ragContext ? (
              <div className="bg-[#FCFBFA] border border-[#EFE9E1] rounded-xl p-4 text-[10px] font-medium leading-relaxed text-gray-700 whitespace-pre-wrap max-h-80 overflow-y-auto shadow-inner">
                {ragContext}
              </div>
            ) : (
              <div className="p-8 bg-[#FCFBFA] border border-[#EFE9E1] border-dashed rounded-xl text-center text-[11px] text-gray-450 font-semibold italic">
                Lakukan pencarian nama bunga (seperti mawar, tulip, peony) untuk melihat pemosisian dokumen RAG masuk ke sistem prompt asisten.
              </div>
            )}
          </div>
        )}

        {activeDebugTab === 'prompt' && (
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#E8B4B8]" />
              <h4 className="text-[10px] font-bold text-gray-450 tracking-widest uppercase">
                Compiled Chat PromptTemplate Sent to Gemini LLM:
              </h4>
            </div>

            {promptTrace ? (
              <div className="bg-gray-950 text-[#F5F5F5] font-mono p-4 rounded-xl text-[10px] whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto shadow-inner">
                {promptTrace}
              </div>
            ) : (
              <div className="p-8 bg-[#FCFBFA] border border-[#EFE9E1] border-dashed rounded-xl text-center text-[10px] text-gray-450 font-semibold italic">
                Kirim pesan untuk melihat kompilasi PromptTemplate final yang dikirimkan ke model agen AI.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Observability footer */}
      <div className="p-3 bg-[#FCFBFA] border-t border-[#EFE9E1] text-[9px] text-[#E8B4B8] font-bold tracking-widest text-center uppercase">
        ⚡ Fleuria Agentic Control Plane
      </div>
    </div>
  );
}
