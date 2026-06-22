import React, { useState, useEffect, useRef } from 'react';
import { Message, RecommendedBouquet } from './types';
import FlowerKamus from './components/FlowerKamus';
import BouquetQuiz from './components/BouquetQuiz';
import CardGenerator from './components/CardGenerator';
import ImageAnalyzer from './components/ImageAnalyzer';
import LangGraphDashboard from './components/LangGraphDashboard';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, Heart, Sparkles, BookOpen, PenTool, Camera, 
  Send, Trash2, HelpCircle, Sun, MapPin, Feather, CheckCircle2,
  Network, Settings, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz' | 'kamus' | 'card' | 'scanner'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // LangGraph / LangChain Trace States
  const [activeNode, setActiveNode] = useState<string>('router');
  const [traces, setTraces] = useState<any[]>([
    {
      node: 'router',
      description: 'Asisten menunggu masukan teks Anda untuk mulai merumuskan rute kustom di dalam LangGraph.',
      latencyMs: 15,
      timestamp: new Date().toISOString(),
      tokens: { input: 0, output: 0 }
    }
  ]);
  const [ragContext, setRagContext] = useState<string>('');
  const [promptTrace, setPromptTrace] = useState<string>('');
  const [langsmithConfig, setLangsmithConfig] = useState<any>({
    LANGCHAIN_TRACING_V2: 'true',
    LANGCHAIN_ENDPOINT: 'https://api.smith.langchain.com',
    LANGCHAIN_API_KEY: 'ls__fleuria_demo_key_********',
    LANGCHAIN_PROJECT: 'fleuria-boutique-agentic-workflow'
  });

  // Callbacks to propagate subtab telemetry
  const handleTraceUpdate = (data: any) => {
    if (data.activeNode) setActiveNode(data.activeNode);
    if (data.traces) setTraces(data.traces);
    if (data.ragContext) setRagContext(data.ragContext);
    if (data.promptTrace) setPromptTrace(data.promptTrace);
    if (data.langsmithConfig) setLangsmithConfig(data.langsmithConfig);
  };

  // Quick suggestion prompts
  const suggestions = [
    { text: 'Apa arti bunga tulip ungu? 🌷', prompt: 'Apa makna filosofis dan arti dari bunga tulip ungu?' },
    { text: 'Buket pink wisuda pacar 🌸', prompt: 'Saya mencari rekomendasi kombinasi buket bunga pink yang cantik untuk acara wisuda pacar.' },
    { text: 'Tips agar mawar segar lama 🌹', prompt: 'Bagaimana tips atau cara merawat mawar agar tetap segar lama di vas?' },
    { text: 'Buatkan ucapan wisuda sahabat 🎓', prompt: 'Tolong buatkan teks ucapan manis dan menyentuh untuk kartu buket wisuda sahabat karib saya.' }
  ];

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (rawPrompt: string) => {
    if (!rawPrompt.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: rawPrompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi asisten Fleuria.');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      // Update Tracing Live Panel
      if (data.activeNode) setActiveNode(data.activeNode);
      if (data.traces) setTraces(data.traces);
      if (data.ragContext) setRagContext(data.ragContext);
      if (data.promptTrace) setPromptTrace(data.promptTrace);
      if (data.langsmithConfig) setLangsmithConfig(data.langsmithConfig);

    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Maaf, saya mengalami kendala teknis saat memproses pesan Anda. Pastikan koneksi internet lancar 💐.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyRecommendationToChat = (rec: RecommendedBouquet) => {
    setActiveTab('chat');
    const promptText = `Saya baru saja menyelesaikan Kuis Pemilihan Bouquet dan mendapatkan rekomendasi rasa "${rec.bouquetName}". Bunga yang digunakan: ${rec.flowersUsed.map(f => f.name).join(', ')}. Bisakah Anda jelaskan filosofi rangkaian ini secara lebih luas dan berikan saran penyesuaian khusus?`;
    
    // Set timing slightly later to ensure tab has switched
    setTimeout(() => {
      handleSendMessage(promptText);
    }, 150);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-gray-800 flex flex-col selection:bg-[#FDF1F2] selection:text-[#E8B4B8]">
      {/* Delicate Ribbon Banner Header */}
      <header className="bg-white border-b border-[#EFE9E1] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E8B4B8] flex items-center justify-center text-white font-serif text-xl shadow-xs">F</div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-1.5 leading-none">
                Fleuria <span className="font-normal italic text-[#E8B4B8] text-xl">Bouquet Assistant</span>
              </h1>
              <p className="text-[10px] tracking-widest text-gray-400 font-semibold mt-1 uppercase">
                Premium Floral Styling & Floriography Consultant (LangGraph Orchestrated)
              </p>
            </div>
          </div>

          {/* Quick shop coordinates (Minimalist styling) */}
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <span className="flex items-center gap-1.5 bg-[#FCFBFA] px-3.5 py-2 rounded-full border border-[#EFE9E1]">
              <Sun className="w-3.5 h-3.5 text-[#E8B4B8]" /> Buka Tiap Hari: 08:30 - 21:00
            </span>
            <span className="hidden md:flex items-center gap-1.5 bg-[#FCFBFA] px-3.5 py-2 rounded-full border border-[#EFE9E1]">
              <MapPin className="w-3.5 h-3.5 text-[#E8B4B8]" /> Jakarta, Indonesia
            </span>
          </div>
        </div>
      </header>

      {/* Main Structural Tab Bar */}
      <nav className="bg-[#FCFBFA] border-b border-[#EFE9E1] py-3.5 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4.5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-[#E8B4B8] text-white shadow-xs'
                : 'bg-white text-gray-500 border border-[#EFE9E1] hover:bg-[#FDF1F2] hover:text-[#E8B4B8]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Asisten Chat
          </button>
          
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4.5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-[#E8B4B8] text-white shadow-xs'
                : 'bg-white text-gray-500 border border-[#EFE9E1] hover:bg-[#FDF1F2] hover:text-[#E8B4B8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Kuis Bouquet
          </button>

          <button
            onClick={() => setActiveTab('kamus')}
            className={`px-4.5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'kamus'
                ? 'bg-[#E8B4B8] text-white shadow-xs'
                : 'bg-white text-gray-500 border border-[#EFE9E1] hover:bg-[#FDF1F2] hover:text-[#E8B4B8]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Kamus Bunga
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`px-4.5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'card'
                ? 'bg-[#E8B4B8] text-white shadow-xs'
                : 'bg-white text-gray-500 border border-[#EFE9E1] hover:bg-[#FDF1F2] hover:text-[#E8B4B8]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Kartu Ucapan
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-4.5 py-2 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'scanner'
                ? 'bg-[#E8B4B8] text-white shadow-xs'
                : 'bg-white text-gray-500 border border-[#EFE9E1] hover:bg-[#FDF1F2] hover:text-[#E8B4B8]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" /> Pindai Foto AI
          </button>
        </div>
      </nav>

      {/* Main Responsive Layout Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col min-h-0">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Main column - Active Application Functionalities (cols: 8) */}
          <div className="xl:col-span-8 flex flex-col gap-6 min-h-0">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div
                  key="chatTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0"
                >
                  {/* Chat Panel Left Sidebar */}
                  <div className="lg:col-span-1 hidden lg:flex flex-col space-y-4">
                    <div className="bg-white border border-[#EFE9E1] p-6 rounded-2xl shadow-xs space-y-5">
                      <div className="space-y-1">
                        <h3 className="font-serif text-base font-semibold text-gray-900 flex items-center gap-1.5">
                          <Feather className="w-4 h-4 text-[#E8B4B8]" /> Ide Konsultasi Bunga
                        </h3>
                        <p className="text-[11px] text-gray-400">Klik salah satu ide di bawah untuk berdiskusi dengan desainer Fleuria secara instan.</p>
                      </div>
                      
                      <div className="space-y-2.5">
                        {suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(s.prompt)}
                            className="w-full text-left p-3.5 rounded-xl border border-[#EFE9E1] bg-[#FCFBFA] hover:bg-[#FDF1F2] hover:border-[#E8B4B8] text-xs text-gray-700 transition-all flex items-start gap-2.5 group font-semibold"
                          >
                            <span className="text-[#E8B4B8] group-hover:scale-125 transition-transform shrink-0 mt-0.5">•</span>
                            <span className="leading-normal">{s.text}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FDF1F2] border border-[#EFE9E1] p-5.5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-[#E8B4B8] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#E8B4B8]" /> Ketentuan Bouquet
                      </h4>
                      <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
                        Setiap rangkaian bunga Fleuria menggunakan bunga segar terpilih dari perkebunan lokal dan import. Anda dapat memesan kertas wrapping satin, pita mewah, dan kartu ucapan kustom lewat asisten AI kami.
                      </p>
                    </div>
                  </div>

                  {/* Central Chatbot Interface */}
                  <div className="lg:col-span-2 bg-white border border-[#EFE9E1] rounded-2xl flex flex-col overflow-hidden shadow-xs h-[520px] lg:h-[580px] relative">
                    {/* Chat window Header */}
                    <div className="bg-white border-b border-[#EFE9E1] p-4.5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FDF1F2] border border-[#EFE9E1] flex items-center justify-center text-lg">
                          🌸
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 font-serif">
                            Asisten Desain Fleuria <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-ping" />
                          </h3>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold font-sans">Saran rona buket bunga kustom & Floriologi</p>
                        </div>
                      </div>
                      
                      {messages.length > 0 && (
                        <button
                          onClick={clearChat}
                          className="p-1.5 px-3 hover:bg-[#FDF1F2] text-[#E8B4B8] rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold border border-[#EFE9E1]"
                          title="Bersihkan percakapan"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Bersihkan
                        </button>
                      )}
                    </div>

                    {/* Messages Box */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto px-4 py-8">
                          <div className="w-12 h-12 rounded-full bg-[#FDF1F2] flex items-center justify-center text-2xl shadow-xs">💐</div>
                          <div>
                            <h4 className="font-serif text-lg font-semibold text-gray-950">Selamat Datang di Fleuria Boutique</h4>
                            <p className="text-xs text-gray-500 leading-relaxed mt-2 font-medium">
                              Saya asisten rangkaian floral Anda. Tanyakan apa saja mengenai rona bunga pastel, makna simbolis mawar dan tulip, ide kado kustom, maupun tips ketahanan vas.
                            </p>
                          </div>

                          {/* Small inline suggestion buttons for mobile layout */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full lg:hidden pt-4">
                            {suggestions.map((s, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(s.prompt)}
                                className="bg-[#FCFBFA] border border-[#EFE9E1] p-3 text-left rounded-xl text-xs text-gray-700 font-bold hover:bg-[#FDF1F2] transition-colors"
                              >
                                {s.text}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((m) => {
                            const isUser = m.role === 'user';
                            return (
                              <div
                                key={m.id}
                                className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
                                  {/* Avatar in messages */}
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold shadow-xs ${
                                    isUser ? 'bg-[#E8B4B8] text-white' : 'bg-[#FDF1F2] text-[#E8B4B8] border border-[#EFE9E1]'
                                  }`}>
                                    {isUser ? '👤' : 'FL'}
                                  </div>

                                  <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                                    isUser
                                      ? 'bg-[#E8B4B8] text-white border-[#E8B4B8] rounded-tr-none font-bold'
                                      : 'bg-[#FCFBFA] text-gray-800 border-[#EFE9E1] rounded-tl-none shadow-xs font-semibold'
                                  }`}>
                                    {isUser ? (
                                      <p className="whitespace-pre-line">{m.content}</p>
                                    ) : (
                                      <div className="markdown-body text-gray-800 space-y-1.5">
                                        <ReactMarkdown>{m.content}</ReactMarkdown>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="flex items-start gap-3 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-[#FDF1F2] text-[#E8B4B8] border border-[#EFE9E1] flex items-center justify-center shrink-0 text-xs shadow-xs font-bold">
                                  FL
                                </div>
                                <div className="bg-[#FCFBFA] p-4 rounded-2xl rounded-tl-none border border-[#EFE9E1] text-xs flex items-center gap-1.5 tracking-wide">
                                  <span className="w-1.5 h-1.5 bg-[#E8B4B8] rounded-full animate-bounce" />
                                  <span className="w-1.5 h-1.5 bg-[#E8B4B8] rounded-full animate-bounce [animation-delay:0.2s]" />
                                  <span className="w-1.5 h-1.5 bg-[#E8B4B8] rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div ref={chatEndRef} />
                        </div>
                      )}
                    </div>

                    {/* Input Text box */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage(inputVal);
                      }} 
                      className="bg-[#FCFBFA] border-t border-[#EFE9E1] p-4 flex gap-2.5 bg-gradient-to-r from-[#FCFBFA] to-white"
                    >
                      <input
                        type="text"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="Tanya makna tulip putih kemurnian, kado rona pink, saran budget..."
                        className="flex-1 bg-[#FAF7F2] border border-[#EFE9E1] rounded-2xl px-5 py-3.5 text-xs text-gray-800 focus:outline-none focus:border-[#E8B4B8] focus:bg-white transition-all placeholder:text-gray-400 font-bold"
                      />
                      <button
                        type="submit"
                        className="bg-gray-900 text-white px-5 rounded-2xl text-xs font-bold hover:bg-[#E8B4B8] transition-colors flex items-center gap-2 shadow-xs shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Kirim</span>
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="quizTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <BouquetQuiz onRecommendationSelect={handleApplyRecommendationToChat} onTraceUpdate={handleTraceUpdate} />
                </motion.div>
              )}

              {activeTab === 'kamus' && (
                <motion.div
                  key="kamusTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <FlowerKamus onTraceUpdate={handleTraceUpdate} />
                </motion.div>
              )}

              {activeTab === 'card' && (
                <motion.div
                  key="cardTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <CardGenerator onTraceUpdate={handleTraceUpdate} />
                </motion.div>
              )}

              {activeTab === 'scanner' && (
                <motion.div
                  key="scannerTab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <ImageAnalyzer onTraceUpdate={handleTraceUpdate} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Observability dashboard- cols: 4 (Persistent on desktop, handles LangChain/LangGraph/LangSmith visual tracing) */}
          <div className="xl:col-span-4 space-y-4">
            <LangGraphDashboard 
              activeNode={activeNode} 
              traces={traces} 
              ragContext={ragContext} 
              promptTrace={promptTrace} 
              langsmithConfig={langsmithConfig}
            />

            {/* Explanatory Craft Guide */}
            <div className="bg-white border border-[#EFE9E1] p-5 rounded-2xl space-y-4 shadow-xs">
              <h4 className="text-xs font-bold text-gray-900 border-b border-[#FAF7F2] pb-2 uppercase tracking-wide flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#E8B4B8]" /> Panduan Demo Evaluasi
              </h4>
              <ul className="text-[11px] text-gray-500 space-y-2.5 pl-1 list-none font-semibold">
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#E8B4B8] font-bold">1.</span>
                  <span>Setiap aksi pemanggilan di tab kiri dirutekan serentak melalui <strong className="text-gray-800">StateGraph LangGraph</strong> di server.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#E8B4B8] font-bold">2.</span>
                  <span>Gunakan tab <strong className="text-[#E8B4B8]">Tracing Trace</strong> untuk mengamati latensi dan token yang berhasil dilacak oleh <strong className="text-gray-800">LangSmith</strong>.</span>
                </li>
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-[#E8B4B8] font-bold">3.</span>
                  <span>Selidiki <strong className="text-[#E8B4B8]">Dokumen RAG</strong> untuk memahami potongan pengetahuan database bunga kustom yang diinjeksikan.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-white border-t border-[#EFE9E1] py-6 mt-auto text-center text-[10px] text-gray-400 font-bold tracking-widest uppercase">
        Fleuria Boutique © 2026. Made with love for Indonesian flower lovers. 🍃 
      </footer>
    </div>
  );
}
