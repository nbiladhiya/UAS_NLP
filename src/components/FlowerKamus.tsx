import React, { useState } from 'react';
import { FLOWER_CATALOG, FlowerDetail } from '../types';
import { Search, Heart, Sparkles, BookOpen, Clock, Activity, Flower } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FlowerKamusProps {
  onTraceUpdate?: (data: any) => void;
}

export default function FlowerKamus({ onTraceUpdate }: FlowerKamusProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlower, setSelectedFlower] = useState<FlowerDetail | null>(FLOWER_CATALOG[0]);
  const [likedFlowers, setLikedFlowers] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (selectedFlower && onTraceUpdate) {
      const query = `kamus ${selectedFlower.id}`;
      const ragDocs = `[Knowledge Doc - Bunga: ${selectedFlower.name}]
Scientific Name: ${selectedFlower.scientificName}
Signifikansi & Bahasa Bunga: ${selectedFlower.meaning}
Varian Warna Dan Simbolisme: ${selectedFlower.colors.map(c => `${c.color} (${c.meaning})`).join(', ')}
Aturan Perawatan Vas: ${selectedFlower.careTips.join(' ')}`;

      onTraceUpdate({
        activeNode: 'flower_encyclopedia',
        ragContext: ragDocs,
        promptTrace: `Anda adalah Florologis & Ensiklopedis Bunga Senior dari Fleuria Boutique.\n\nRAG Knowledge Base:\n${ragDocs}\n\nPertanyaan Pelanggan: ${query}`,
        traces: [
          {
            node: 'router',
            description: `Rute ditentukan secara otomatis berdasarkan kata kunci kamus: '${selectedFlower.id}'.`,
            latencyMs: 6,
            timestamp: new Date().toISOString(),
            tokens: { input: 8, output: 2 }
          },
          {
            node: 'flower_encyclopedia',
            description: `Membuka direktori RAG Kamus Bunga untuk menganalisis filosofi '${selectedFlower.name}'.`,
            latencyMs: 75,
            timestamp: new Date().toISOString(),
            tokens: { input: 110, output: 240 }
          }
        ]
      });
    }
  }, [selectedFlower]);

  const filteredFlowers = FLOWER_CATALOG.filter(flower =>
    flower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flower.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flower.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedFlowers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="flower-kamus-section" className="bg-white border border-[#EFE9E1] rounded-2xl p-6.5 shadow-xs flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-[#FDF1F2] border border-[#EFE9E1] rounded-full text-[#E8B4B8]">
          <BookOpen className="w-5 h-5 text-[#E8B4B8]" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900">Kamus Bahasa Bunga</h2>
          <p className="text-xs text-gray-400 font-medium">Telusuri arti tersembunyi & cara perawatan puspa indah Fleuria.</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari makna mawar, tulip, peony..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#FCFBFA] border border-[#EFE9E1] rounded-2xl pl-11 pr-5 py-3.5 text-xs text-gray-800 focus:outline-none focus:border-[#E8B4B8] focus:bg-white transition-colors placeholder:text-gray-400 font-medium"
        />
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Flower List (Left Column) */}
        <div className="md:col-span-2 overflow-y-auto max-h-[360px] md:max-h-[500px] space-y-2.5 pr-1">
          {filteredFlowers.length > 0 ? (
            filteredFlowers.map((flower) => {
              const isSelected = selectedFlower?.id === flower.id;
              const isLiked = likedFlowers[flower.id];
              return (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  key={flower.id}
                  onClick={() => setSelectedFlower(flower)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#FDF1F2] border-[#E8B4B8] shadow-xs'
                      : 'bg-[#FCFBFA] border-[#EFE9E1] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative shadow-xs border border-[#EFE9E1]">
                      <img
                        src={flower.imageUrl}
                        alt={flower.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900">{flower.name}</h3>
                      <p className="text-[10px] italic text-gray-400 font-medium">{flower.scientificName}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => toggleLike(flower.id, e)}
                    className="p-1 px-1.5 hover:bg-[#FDF1F2] rounded-full transition-colors border border-transparent hover:border-[#EFE9E1]"
                  >
                    <Heart className={`w-3.5 h-3.5 transition-colors ${isLiked ? 'fill-[#E8B4B8] text-[#E8B4B8]' : 'text-gray-300'}`} />
                  </button>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs text-gray-400 font-medium flex flex-col items-center justify-center gap-3">
              <Flower className="w-8 h-8 text-[#EFE9E1] animate-pulse" />
              Puspa yang Anda cari belum mekar di Fleuria...
            </div>
          )}
        </div>

        {/* Selected Flower Details (Right Column) */}
        <div className="md:col-span-3 bg-[#FCFBFA] rounded-2xl border border-[#EFE9E1] p-5 overflow-y-auto max-h-[460px] md:max-h-[500px]">
          <AnimatePresence mode="wait">
            {selectedFlower ? (
              <motion.div
                key={selectedFlower.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="relative h-36 md:h-44 rounded-xl overflow-hidden shadow-xs border border-[#EFE9E1]">
                  <img
                    src={selectedFlower.imageUrl}
                    alt={selectedFlower.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-4">
                    <div>
                      <span className="text-[9px] bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/10 uppercase tracking-wider font-semibold">
                        {selectedFlower.season}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-white mt-1.5">{selectedFlower.name}</h4>
                      <p className="text-[10px] italic text-pink-100">{selectedFlower.scientificName}</p>
                    </div>
                  </div>
                </div>

                {/* Meaning Section */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E8B4B8]" /> Filosofi & Arti
                  </h5>
                  <p className="text-xs leading-relaxed text-gray-800 bg-white p-4 rounded-xl border border-[#EFE9E1] font-semibold">
                    {selectedFlower.meaning}
                  </p>
                </div>

                {/* Color Meanings */}
                <div className="space-y-3.5">
                  <h5 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#E8B4B8]" /> Simbolisme Warna
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedFlower.colors.map((colorItem, idx) => (
                      <div key={idx} className="flex gap-2.5 p-3 rounded-xl bg-white border border-[#EFE9E1] text-[11px] shadow-xs">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 self-center"
                          style={{ backgroundColor: colorItem.hex }}
                        />
                        <div>
                          <strong className="text-gray-900 block font-semibold">{colorItem.color}</strong>
                          <p className="text-gray-500 text-[10px] leading-snug mt-0.5 font-medium">{colorItem.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Care Tips */}
                <div className="space-y-3.5">
                  <h5 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#E8B4B8]" /> Tips Perawatan Vas Florist
                  </h5>
                  <ul className="space-y-2 text-[11px] text-gray-700 pl-1">
                    {selectedFlower.careTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#EFE9E1] shadow-xs">
                        <span className="text-[#E8B4B8] font-bold shrink-0 mt-0.5">{idx + 1}.</span>
                        <span className="leading-relaxed font-semibold">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-gray-400 italic font-medium">
                Pilih bunga dari daftar kiri untuk menganalisis pesona filofosinya.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
