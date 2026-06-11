import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

/* ─── LIGHTWEIGHT BOKEH & STARFIELD FOR INTRO ─────────────────────────── */
function IntroAtmosphere() {
  const elements = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      dur: Math.random() * 6 + 4,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.3 + 0.1,
    })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden layer-isolated">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full bg-amber-200 gpu-accelerated"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: el.size,
            height: el.size,
            opacity: el.opacity,
            boxShadow: "0 0 8px rgba(251,191,36,0.4)",
          }}
          animate={{
            y: [0, -40, -10, -60],
            x: [0, 8, -6, 10],
            opacity: [0, el.opacity, el.opacity * 0.5, 0],
          }}
          transition={{
            duration: el.dur,
            repeat: Infinity,
            delay: el.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function IntroLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 3000; // 3 seconds matching the loader duration
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[999] bg-[#0f0b07] flex flex-col items-center justify-center overflow-hidden layer-isolated"
    >
      {/* ── Ambient background glows ── */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[600px] h-[600px] bg-amber-200/10 blur-[160px] rounded-full pointer-events-none glow-stabilized gpu-accelerated"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute w-[450px] h-[450px] bg-orange-300/8 blur-[140px] rounded-full pointer-events-none glow-stabilized gpu-accelerated"
      />

      {/* ── Atmosphere Particles ── */}
      <IntroAtmosphere />

      {/* ── Hairline borders ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

      {/* ── Side decorations ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="hidden md:flex flex-col items-center gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/20 text-[9px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>written</span>
        <div className="w-1 h-1 rounded-full bg-amber-200/20" />
        <span className="text-amber-200/10 text-[9px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>with love</span>
        <div className="w-px h-20 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="hidden md:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/20 text-[9px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>forever</span>
        <div className="w-1 h-1 rounded-full bg-amber-200/20" />
        <span className="text-amber-200/10 text-[9px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>yours</span>
        <div className="w-px h-20 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      {/* ── Content Container ── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center select-none" style={{ gap: 20 }}>
        
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "2px" }}
          animate={{ opacity: 1, letterSpacing: "10px" }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="uppercase text-amber-100/35 text-xs md:text-sm tracking-[10px] mb-2"
          style={FONT_BODY}
        >
          A Special Surprise
        </motion.p>

        {/* Cursive text block */}
        <div className="flex flex-col items-center" style={{ gap: 4 }}>
          <motion.h1
            initial={{ y: 30, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.3, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl text-amber-50 leading-relaxed px-8 sm:px-12"
            style={{ ...FONT_SCRIPT, textShadow: "0 0 30px rgba(255,190,100,0.3)", overflow: "visible" }}
          >
            <span style={{ display: "inline-block", paddingLeft: "0.3em", paddingRight: "0.3em" }}>
              For Someone
            </span>
          </motion.h1>

          <motion.h1
            initial={{ y: 30, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.3, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl text-amber-50 leading-relaxed px-8 sm:px-12"
            style={{ ...FONT_SCRIPT, textShadow: "0 0 30px rgba(255,190,100,0.3)", overflow: "visible" }}
          >
            <span style={{ display: "inline-block", paddingLeft: "0.3em", paddingRight: "0.3em" }}>
              Truly Special
            </span>
          </motion.h1>
        </div>

        {/* Vintage Ornament Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="flex items-center gap-3 w-40 my-3 justify-center"
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-200/30" />
          <span className="text-amber-300 text-xs">✦</span>
          <span className="text-amber-400 text-sm">♡</span>
          <span className="text-amber-300 text-xs">✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-200/30" />
        </motion.div>

        {/* Luxury Progress Bar */}
        <div className="relative mt-4 flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="relative w-[220px] sm:w-[280px] h-[3px] bg-amber-200/10 overflow-hidden"
            style={{ borderRadius: "999px" }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut" }}
            />
          </motion.div>
          
          {/* Subtle loading indicator */}
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.3 }}
            className="text-amber-200/40 text-[9px] tracking-[4px] uppercase"
            style={FONT_BODY}
          >
            preparing your story...
          </motion.span>
        </div>

      </div>
    </motion.div>
  );
}

export default IntroLoader;