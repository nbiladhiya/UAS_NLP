import React, { useState } from 'react';
import { GiftCardResult } from '../types';
import { Mail, Check, Copy, Sparkles, Send, PenTool, Edit3, Smile, Heart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CardGeneratorProps {
  onTraceUpdate?: (data: any) => void;
}

export default function CardGenerator({ onTraceUpdate }: CardGeneratorProps) {
  const [occasion, setOccasion] = useState('Ulang Tahun');
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState('Puitis & Anggun');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GiftCardResult[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const tones = [
    'Puitis & Anggun ✨',
    'Sangat Romantis 💖',
    'Jenaka & Santai 🎈',
    'Hangat & Tulus 🥰',
    'Sopan & Formal 👔'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/card-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          recipient: recipient || 'orang tersayang',
          tone,
        }),
      });
      const data = await response.json();
      setResults(data.cards);
      if (onTraceUpdate) {
        onTraceUpdate(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div id="card-generator-section" className="bg-white border border-[#EFE9E1] rounded-2xl p-6.5 shadow-xs flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-[#FDF1F2] border border-[#EFE9E1] rounded-full text-[#E8B4B8]">
          <PenTool className="w-5 h-5 text-[#E8B4B8]" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900">Generator Kartu Ucapan</h2>
          <p className="text-xs text-gray-400 font-medium">Tulis rangkaian kata-kata puitis seindah paduan bunga Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Form Inputs (Left) */}
        <form onSubmit={handleGenerate} className="lg:col-span-2 space-y-4 pr-1 self-start">
          <div>
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 mb-2">
              📌 Momen Acara
            </label>
            <input
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Contoh: Kelulusan Sidang, Pernikahan Kakak..."
              className="w-full bg-[#FCFBFA] border border-[#EFE9E1] rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#E8B4B8] focus:bg-white transition-colors font-medium"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 mb-2">
              👤 Nama/Panggilan Penerima
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Contoh: Sahabatku Diana, Mama, Adinda..."
              className="w-full bg-[#FCFBFA] border border-[#EFE9E1] rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#E8B4B8] focus:bg-white transition-colors font-medium"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5 mb-2">
              🎭 Nada & Emosi Kartu
            </label>
            <div className="space-y-1.5">
              {tones.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTone(t)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                    tone === t
                      ? 'bg-[#FDF1F2] border-[#E8B4B8] text-gray-900 shadow-xs'
                      : 'bg-[#FCFBFA] border-[#EFE9E1] hover:bg-white text-gray-500 hover:text-[#E8B4B8]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white hover:bg-[#E8B4B8] transition-colors rounded-full py-3.5 text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 pt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengukir Paragraf...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Karang Ucapan Cantik
              </>
            )}
          </button>
        </form>

        {/* Results output (Right) */}
        <div className="lg:col-span-3 bg-[#FCFBFA] rounded-2xl border border-[#EFE9E1] p-5 flex flex-col justify-between overflow-y-auto max-h-[460px]">
          <AnimatePresence mode="wait">
            {results ? (
              <motion.div
                key="results-loaded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {results.map((card, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-[#EFE9E1] p-5 relative shadow-xs group">
                    <div className="flex justify-between items-center mb-1.5 border-b border-[#FCFBFA] pb-2">
                      <span className="text-[10px] font-bold text-[#E8B4B8] uppercase tracking-widest flex items-center gap-1.5">
                        <Edit3 className="w-3 h-3" /> {card.title}
                      </span>
                      <button
                        onClick={() => handleCopy(card.content, idx)}
                        className="p-1.5 hover:bg-[#FDF1F2] rounded-lg transition-all text-[#E8B4B8] relative border border-transparent hover:border-[#EFE9E1]"
                        title="Copy text to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#E8B4B8]" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap italic font-semibold">
                      &ldquo;{card.content}&rdquo;
                    </p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-gray-400 font-medium">
                <Mail className="w-10 h-10 stroke-1 text-[#EFE9E1] animate-bounce mb-3" />
                <h4 className="text-xs font-bold text-gray-900">Format Kata Belum Terukir</h4>
                <p className="text-[10px] mt-1.5 max-w-[200px] leading-relaxed">Silakan isikan data kartu ucapan Anda di kolom kiri, lalu biarkan asisten merangkainya.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
