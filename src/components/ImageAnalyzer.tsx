import React, { useState, useRef } from 'react';
import { Camera, Upload, Coins, Sparkles, RefreshCw, AlertCircle, Check, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BudgetAlternative {
  original: string;
  alternative: string;
  savingDesc: string;
}

interface AnalysisResult {
  detectedFlowers: string[];
  styleDescription: string;
  estimatedMarketPrice: string;
  budgetHacks: BudgetAlternative[];
  isDemo?: boolean;
}

interface ImageAnalyzerProps {
  onTraceUpdate?: (data: any) => void;
}

export default function ImageAnalyzer({ onTraceUpdate }: ImageAnalyzerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-loaded sample bouquet images for quick trials
  const sampleBouquets = [
    {
      name: 'Lovely Rose & Carnation Bouquet',
      url: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Vibrant Sunflower Delight',
      url: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=600&auto=format&fit=crop',
    },
    {
      name: 'Dreamy Pastel Lilac Elegance',
      url: 'https://images.unsplash.com/photo-1588613449339-fcbe031be038?q=80&w=600&auto=format&fit=crop',
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Batas ukuran foto adalah 5MB.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSample = async (url: string) => {
    setLoading(true);
    setError(null);
    setSelectedImage(url);
    setResult(null);
    
    try {
      // Fetch image from URL and convert to base64
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        await runAnalysis(base64data);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError('Gagal meload foto contoh. Silakan unggah foto Anda sendiri.');
    }
  };

  const runAnalysis = async (imgBase64: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imgBase64 }),
      });
      
      if (!response.ok) {
        throw new Error('Terjadi kegagalan komunikasi dengan server.');
      }
      
      const data = await response.json();
      setResult(data);
      if (onTraceUpdate) {
        onTraceUpdate(data);
      }
    } catch (err: any) {
      console.error(err);
      setError('Gagal menganalisis gambar. Pastikan format gambar sesuai.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAnalysis = () => {
    if (selectedImage) {
      runAnalysis(selectedImage);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div id="image-analyzer-section" className="bg-white border border-[#EFE9E1] rounded-2xl p-6.5 shadow-xs flex flex-col h-full">
      {/* Header Info */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-[#FDF1F2] border border-[#EFE9E1] rounded-full text-[#E8B4B8]">
          <Camera className="w-5 h-5 text-[#E8B4B8]" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900">Pindai Buket Foto AI</h2>
          <p className="text-xs text-gray-400 font-medium">Unggah foto karangan bunga untuk dicarikan paduan bunga hemat budget.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Upload Container (Left) */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex-1 border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all min-h-[220px] relative ${
              selectedImage ? 'border-[#E8B4B8] bg-white' : 'border-[#EFE9E1] hover:border-[#E8B4B8] bg-[#FCFBFA]'
            }`}
          >
            {selectedImage ? (
              <div className="w-full h-full relative flex flex-col items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Chosen Bouquet"
                  className="max-h-48 md:max-h-60 rounded-xl object-contain shadow-xs border border-[#EFE9E1]"
                  referrerPolicy="no-referrer"
                />
                
                {!result && !loading && (
                  <button
                    onClick={handleTriggerAnalysis}
                    className="mt-4 px-5 py-2.5 bg-gray-900 hover:bg-[#E8B4B8] text-white rounded-full text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Pindai Sekarang
                  </button>
                )}
                
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full text-[10px] transition-colors font-semibold"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <div className="space-y-3 cursor-pointer flex flex-col items-center py-6" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-10 h-10 text-gray-300 stroke-1" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Drag & drop foto buket di sini</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">Atau klik untuk menelusuri dari perangkat Anda</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Quick Sample Buttons */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">
              💡 Belum Ada Foto? Cobalah Sampel Ini:
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {sampleBouquets.map((samp, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => loadSample(samp.url)}
                  disabled={loading}
                  className="relative group rounded-xl overflow-hidden h-14 border border-[#EFE9E1] hover:border-[#E8B4B8] transition-all bg-white shadow-xs"
                  title={samp.name}
                >
                  <img
                    src={samp.url}
                    alt={samp.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <span className="text-[9px] text-white font-bold tracking-wider text-center leading-snug px-1 line-clamp-2 uppercase">
                      Sampel {idx + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-1.5 border border-red-100 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Scan Results Screen (Right) */}
        <div className="lg:col-span-3 bg-[#FCFBFA] rounded-2xl border border-[#EFE9E1] p-5 flex flex-col justify-between overflow-y-auto max-h-[460px]">
          <AnimatePresence mode="wait">
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-t-[#E8B4B8] border-[#FDF1F2] rounded-full animate-spin" />
                  <Camera className="w-5 h-5 text-[#E8B4B8] absolute top-[14px] left-[14px]" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-gray-950">Asisten AI Menganalisa Piksel...</h4>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">Menguraikan rona bunga, kerapihan kelopak, dan cara wrap.</p>
                </div>
              </div>
            )}

            {!loading && result && (
              <motion.div
                key="result-pane"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4.5"
              >
                {/* Result header */}
                <div className="bg-[#FDF1F2]/60 rounded-2xl p-4.5 border border-[#EFE9E1] space-y-2">
                  <span className="text-[9px] bg-[#E8B4B8] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest block w-max">
                    Hasil Pindaian Visi AI
                  </span>
                  
                  {/* Detected Flowers tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.detectedFlowers.map((name, idx) => (
                      <span key={idx} className="bg-white border border-[#EFE9E1] text-gray-800 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs">
                        🌸 {name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wrapping Style Description */}
                <div className="space-y-2 bg-white border border-[#EFE9E1] p-4.5 rounded-xl shadow-xs">
                  <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Gaya & Estetika Kemasan:</h4>
                  <p className="text-xs text-gray-800 leading-relaxed font-semibold italic">{result.styleDescription}</p>
                </div>

                {/* Market Price Box */}
                <div className="flex justify-between items-center bg-white border border-[#EFE9E1] rounded-2xl p-4.5 text-xs shadow-xs">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Estimasi Harga Ritel Premium:</span>
                  <span className="font-bold text-[#E8B4B8] text-sm bg-[#FCFBFA] px-3.5 py-1.5 rounded-xl border border-[#EFE9E1]">
                    {result.estimatedMarketPrice}
                  </span>
                </div>

                {/* Budget Hacks / Substitution Options */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                    💵 Rekomendasi Hemat Budget (Florist Swaps):
                  </h4>
                  <div className="space-y-2.5">
                    {result.budgetHacks.map((hack, idx) => (
                      <div key={idx} className="bg-white border border-[#EFE9E1] p-4 rounded-xl text-xs space-y-2 shadow-xs">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-red-400 line-through text-[11px] font-semibold">{hack.original}</span>
                          <span className="text-gray-300 font-medium">➔</span>
                          <span className="text-emerald-700 font-bold bg-emerald-50/50 border border-emerald-100 px-2 py-0.5 rounded text-[11px]">
                            {hack.alternative}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{hack.savingDesc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {!loading && !result && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-gray-400 font-medium">
                <HelpCircle className="w-10 h-10 stroke-1 text-[#EFE9E1] animate-bounce mb-3" />
                <h4 className="text-xs font-bold text-gray-900">Pindaian Kosong</h4>
                <p className="text-[10px] mt-1.5 max-w-[200px] leading-relaxed">Silakan sertakan/unggah foto buket Anda sendiri atau klik foto sampel yang kami sediakan untuk meluncurkan analisis.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
