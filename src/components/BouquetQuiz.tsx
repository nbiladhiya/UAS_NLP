import React, { useState } from 'react';
import { QuizAnswers, RecommendedBouquet } from '../types';
import { 
  Sparkles, Gift, Heart, ArrowRight, ArrowLeft, RefreshCw, 
  Coins, User, GraduationCap, Cake, HeartHandshake, Smile, Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BouquetQuizProps {
  onRecommendationSelect: (rec: RecommendedBouquet) => void;
  onTraceUpdate?: (data: any) => void;
}

export default function BouquetQuiz({ onRecommendationSelect, onTraceUpdate }: BouquetQuizProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    event: '',
    color: '',
    budget: '',
    recipient: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendedBouquet | null>(null);

  // Options Data
  const events = [
    { label: 'Wisuda 🎓', value: 'Wisuda' },
    { label: 'Ulang Tahun 🎂', value: 'Ulang Tahun' },
    { label: 'Anniversary 💖', value: 'Anniversary' },
    { label: 'Pernikahan 👰', value: 'Pernikahan' },
    { label: 'Lamaran 💍', value: 'Lamaran' },
    { label: 'Hari Ibu 👩', value: 'Hari Ibu' },
  ];

  const budgets = [
    { label: 'Rp 50.000 – Rp 100.000 (Sweet Bundle)', value: 'Rp50.000–100.000' },
    { label: 'Rp 100.000 – Rp 250.000 (Elegant Standard)', value: 'Rp100.000–250.000' },
    { label: 'Rp 250.000 – Rp 500.000 (Premium Luxury)', value: 'Rp250.000–500.000' },
  ];

  const colors = [
    { label: 'Romantic Blush Pink 🌸', value: 'Blush Pink/Merah Muda Pastel', hex: '#FFCAD4' },
    { label: 'Dreamy Pastel Blue 💎', value: 'Pastel Blue/Biru Muda Tenang', hex: '#E2E2FF' },
    { label: 'Sweet Peach & Cream 🍑', value: 'Soft Peach & Cream', hex: '#FFDDC1' },
    { label: 'Royal Lavish Purple 💜', value: 'Pastel Purple/Ungu Lilac', hex: '#E8D2E9' },
    { label: 'Sunny Warm Yellow ☀️', value: 'Pastel Yellow/Kuning Lembut', hex: '#FFF2B2' },
  ];

  const recipients = [
    { label: 'Pasangan / Kekasih 💝', value: 'Pasangan Romantis' },
    { label: 'Ibu Tercinta 👩', value: 'Ibu' },
    { label: 'Sahabat Terbaik 👭', value: 'Sahabat' },
    { label: 'Rekan Kerja / Guru 💼', value: 'Rekan Kerja / Mentor' },
    { label: 'Diri Sendiri (Self-Love) ✨', value: 'Self-Care' },
  ];

  const handleSelect = (field: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getStepProgress = () => {
    return (step / 4) * 100;
  };

  const isStepValid = () => {
    if (step === 1) return answers.event !== '';
    if (step === 2) return answers.budget !== '';
    if (step === 3) return answers.color !== '';
    if (step === 4) return answers.recipient !== '';
    return false;
  };

  const calculateRecommendation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quiz-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      const data = await response.json();
      setResult(data);
      if (onTraceUpdate) {
        onTraceUpdate(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({
      event: '',
      color: '',
      budget: '',
      recipient: '',
    });
    setResult(null);
    setStep(1);
  };

  return (
    <div id="interactive-quiz-section" className="bg-white border border-[#EFE9E1] rounded-2xl p-6.5 shadow-xs flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-[#FDF1F2] border border-[#EFE9E1] rounded-full text-[#E8B4B8]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-gray-900">Asisten Kuis Bouquet</h2>
          <p className="text-xs text-gray-400 font-medium">Temukan kombinasi bunga kustom yang melambangkan perasaan Anda.</p>
        </div>
      </div>

      {!result && !loading && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Progress Bar */}
            <div className="w-full bg-[#FCFBFA] border border-[#EFE9E1] h-2 rounded-full overflow-hidden mb-6">
              <motion.div 
                className="bgGradient bg-gradient-to-r from-[#FDF1F2] to-[#E8B4B8] h-full"
                animate={{ width: `${getStepProgress()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Quiz Screen Stagger */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase block flex items-center gap-1.5 mb-1">
                    <GraduationCap className="w-4 h-4 text-[#E8B4B8]" /> 1. Untuk acara istimewa apa buket ini dirancang?
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {events.map((ev) => (
                      <button
                        key={ev.value}
                        type="button"
                        onClick={() => handleSelect('event', ev.value)}
                        className={`p-3.5 text-xs font-semibold rounded-xl border text-left transition-all flex items-center justify-between ${
                          answers.event === ev.value
                            ? 'bg-[#FDF1F2] border-[#E8B4B8] text-gray-900 shadow-xs font-bold'
                            : 'bg-[#FCFBFA] border-[#EFE9E1] hover:bg-white text-gray-500 hover:text-[#E8B4B8]'
                        }`}
                      >
                        {ev.label}
                        {answers.event === ev.value && <Check className="w-3.5 h-3.5 text-[#E8B4B8]" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase block flex items-center gap-1.5 mb-1">
                    <Coins className="w-4 h-4 text-[#E8B4B8]" /> 2. Berapa rentang budget belanja bunga Anda?
                  </label>
                  <div className="space-y-2">
                    {budgets.map((bg) => (
                      <button
                        key={bg.value}
                        type="button"
                        onClick={() => handleSelect('budget', bg.value)}
                        className={`w-full p-4 text-xs font-semibold rounded-xl border text-left transition-all flex items-center justify-between ${
                          answers.budget === bg.value
                            ? 'bg-[#FDF1F2] border-[#E8B4B8] text-gray-900 shadow-xs font-bold'
                            : 'bg-[#FCFBFA] border-[#EFE9E1] hover:bg-white text-gray-500 hover:text-[#E8B4B8]'
                        }`}
                      >
                        {bg.label}
                        {answers.budget === bg.value && <Check className="w-3.5 h-3.5 text-[#E8B4B8]" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase block flex items-center gap-1.5 mb-1">
                    <Heart className="w-4 h-4 text-[#E8B4B8]" /> 3. Apa nuansa warna pastel kegemaran penerima?
                  </label>
                  <div className="space-y-2">
                    {colors.map((cl) => (
                      <button
                        key={cl.value}
                        type="button"
                        onClick={() => handleSelect('color', cl.value)}
                        className={`w-full p-4 text-xs font-semibold rounded-xl border text-left transition-all flex items-center justify-between ${
                          answers.color === cl.value
                            ? 'bg-[#FDF1F2] border-[#E8B4B8] text-gray-900 shadow-xs font-bold'
                            : 'bg-[#FCFBFA] border-[#EFE9E1] hover:bg-white text-gray-500 hover:text-[#E8B4B8]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0" 
                            style={{ backgroundColor: cl.hex }}
                          />
                          {cl.label}
                        </div>
                        {answers.color === cl.value && <Check className="w-3.5 h-3.5 text-[#E8B4B8]" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <label className="text-xs font-bold tracking-wider text-gray-400 uppercase block flex items-center gap-1.5 mb-1">
                    <User className="w-4 h-4 text-[#E8B4B8]" /> 4. Kepada siapa buket mempesona ini didedikasikan?
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {recipients.map((rc) => (
                      <span key={rc.value}>
                        <button
                          type="button"
                          onClick={() => handleSelect('recipient', rc.value)}
                          className={`w-full p-3.5 text-xs font-semibold rounded-xl border text-left transition-all flex items-center justify-between h-[52px] ${
                            answers.recipient === rc.value
                              ? 'bg-[#FDF1F2] border-[#E8B4B8] text-gray-900 shadow-xs font-bold'
                              : 'bg-[#FCFBFA] border-[#EFE9E1] hover:bg-white text-gray-500 hover:text-[#E8B4B8]'
                          }`}
                        >
                          <span className="leading-tight">{rc.label}</span>
                          {answers.recipient === rc.value && <Check className="w-3.5 h-3.5 text-[#E8B4B8]" />}
                        </button>
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#EFE9E1]">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="p-2 py-2.5 px-4 bg-[#FCFBFA] border border-[#EFE9E1] rounded-full text-xs font-semibold text-gray-500 hover:bg-white transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`p-2 py-2.5 px-5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isStepValid()
                    ? 'bg-[#E8B4B8] text-white shadow-xs hover:bg-gray-900'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Selanjutnya <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={calculateRecommendation}
                disabled={!isStepValid()}
                className={`p-2 py-2.5 px-6 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isStepValid()
                    ? 'bg-gray-900 text-white shadow-xs hover:bg-[#E8B4B8]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Analisis Kuis AI ✨
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-[#FDF1F2] border-t-[#E8B4B8] animate-spin" />
            <Gift className="w-5 h-5 text-[#E8B4B8] absolute top-[14px] left-[14px] animate-bounce" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-semibold text-gray-950">Merumuskan Buket Impian...</h4>
            <p className="text-[11px] text-gray-400">Merangkai kelopak berdasarkan rona pastel & filosofi mendalam.</p>
          </div>
        </div>
      )}

      {/* Recommended Result Screen */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 overflow-y-auto space-y-5 max-h-[460px] pr-1"
        >
          {/* Header Title Accent */}
          <div className="bg-[#FDF1F2]/60 rounded-2xl p-5 border border-[#EFE9E1] space-y-2">
            <span className="text-[9px] bg-[#E8B4B8] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest block w-max">
              Rekomendasi Kustom
            </span>
            <h3 className="font-serif text-base font-bold text-gray-955 flex items-center gap-1.5 mt-0.5">
              🌸 {result.bouquetName}
            </h3>
            <p className="text-[11px] leading-relaxed text-gray-600 mt-1.5 italic">
              &ldquo;{result.description}&rdquo;
            </p>
          </div>

          {/* Stems list */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold tracking-widest text-gray-400 uppercase flex items-center gap-1">
              📌 Anatomi Rangkaian Bunga:
            </h4>
            <div className="space-y-2">
              {result.flowersUsed.map((item, idx) => (
                <div key={idx} className="bg-[#FCFBFA] border border-[#EFE9E1] p-3 rounded-xl text-xs flex justify-between gap-4">
                  <div>
                    <strong className="text-gray-900 block">{item.name}</strong>
                    <span className="text-[10px] text-gray-400 italic leading-tight">{item.meaning}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-white border border-[#EFE9E1] text-[#E8B4B8] font-semibold text-[10px] rounded-lg shrink-0 self-center">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Tag */}
          <div className="bg-white rounded-2xl p-4 border border-[#EFE9E1] flex justify-between items-center text-xs">
            <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Estimasi Modal / Harga:</span>
            <span className="font-bold text-[#E8B4B8] text-sm bg-[#FCFBFA] px-3.5 py-1.5 rounded-xl border border-[#EFE9E1]">
              {result.estimatedCost}
            </span>
          </div>

          {/* Flora Care list */}
          <div className="space-y-2.5 bg-[#FCFBFA] rounded-2xl p-5 border border-[#EFE9E1]">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              🌿 Tips Spesifik Rangkaian Ini:
            </h4>
            <ul className="text-[11px] space-y-2 text-gray-600 pl-1">
              {result.careTips.map((tip, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-bold text-[#E8B4B8]">{idx+1}.</span>
                  <span className="leading-relaxed font-semibold">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onRecommendationSelect(result)}
              className="p-3 bg-[#E8B4B8] text-white hover:bg-gray-900 rounded-full text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" /> Terapkan ke Chat
            </button>
            <button
              onClick={resetQuiz}
              className="p-3 bg-white border border-[#EFE9E1] hover:bg-[#FCFBFA] rounded-full text-xs text-gray-500 font-semibold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Ulang kuis
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
