import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ─── FONTS & CONSTANTS ──────────────────────────────────────────────── */
const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

const CANDLE_COUNT = 5;
const WISH_MESSAGE =
  "May your smile always stay this beautiful, may your heart always stay peaceful, and may happiness follow you forever. You deserve all the love and beautiful moments in this world. Uhmma ♡";

/* ─── BOKEH PARTICLE ─────────────────────────────────────────────────── */
function BokehParticles({ magical = false }) {
  const particles = useMemo(() => 
    Array.from({ length: 28 }, (_, i) => {
      const p1 = -(Math.random() * 80 + 40);
      const p2 = -(Math.random() * 40 + 20);
      const p3 = -(Math.random() * 100 + 50);
      const drift = (Math.random() - 0.5) * 40;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 28 + 8,
        dur: Math.random() * 14 + 10,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.18 + 0.04,
        color: ["rgba(255,180,120,", "rgba(255,140,160,", "rgba(255,220,160,", "rgba(220,160,200,"][Math.floor(Math.random() * 4)],
        yPath: [0, p1, p2, p3],
        xPath: [0, drift],
      };
    }),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden layer-isolated">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full gpu-accelerated glow-stabilized"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: magical ? p.size * 1.6 : p.size,
            height: magical ? p.size * 1.6 : p.size,
            background: `radial-gradient(circle, ${p.color}${magical ? "0.55)" : "0.35)"} 0%, transparent 70%)`,
            filter: `blur(${p.size * 0.4}px)`,
          }}
          animate={{
            y: p.yPath,
            x: p.xPath,
            opacity: magical
              ? [0, p.opacity * 3, p.opacity * 2.5, 0]
              : [0, p.opacity, p.opacity * 0.6, 0],
            scale: magical ? [0.8, 1.4, 1.2, 0.6] : [0.8, 1, 0.9, 0.5],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── DUST SPARKLES ──────────────────────────────────────────────────── */
function DustSparkles({ burst = false }) {
  const sparkles = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => {
      const drift = (Math.random() - 0.5) * 30;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        dur: Math.random() * 10 + 6,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.1,
        xPath: [0, drift],
      };
    }),
    []
  );

  const activeSparkles = burst ? sparkles : sparkles.slice(0, 20);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden layer-isolated">
      {activeSparkles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full gpu-accelerated"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: burst
              ? `radial-gradient(circle, rgba(255,220,100,0.9) 0%, rgba(255,160,120,0.6) 60%, transparent 100%)`
              : `rgba(255,220,160,${p.opacity})`,
          }}
          animate={{
            y: [0, -60, -30, -100],
            x: p.xPath,
            opacity: [0, p.opacity, p.opacity * 0.5, 0],
            scale: burst ? [0, 1.5, 1, 0] : [0.5, 1, 0.7, 0],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── CONFETTI ───────────────────────────────────────────────────────── */
function Confetti() {
  const pieces = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ["#ffb6c1", "#ffd700", "#ff8c94", "#ffc8a2", "#e8c5e5", "#fffacd"][Math.floor(Math.random() * 6)],
      size: Math.random() * 8 + 4,
      dur: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 120,
      repeatDelay: Math.random() * 3 + 1,
    })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden layer-isolated">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute gpu-accelerated"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * 0.5,
            background: p.color,
            borderRadius: "1px",
          }}
          initial={{ y: -20, rotate: p.rotate, opacity: 1 }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift],
            rotate: [p.rotate, p.rotate + 720],
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: p.repeatDelay,
          }}
        />
      ))}
    </div>
  );
}

/* ─── SMOKE PUFF ─────────────────────────────────────────────────────── */
function SmokePuff({ x, delay = 0 }) {
  const drift = useRef((Math.random() - 0.5) * 20).current;
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, bottom: "100%", translateX: "-50%" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.6, 0.4, 0],
        scale: [0, 1.2, 1.8, 2.5],
        y: [0, -30, -60, -100],
        x: [0, drift],
      }}
      transition={{ duration: 2.5, delay, ease: "easeOut" }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,190,180,0.5) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
    </motion.div>
  );
}

/* ─── CANDLE FLAME ───────────────────────────────────────────────────── */
function CandleFlame({ lit, index }) {
  return (
    <AnimatePresence>
      {lit && (
        <motion.div
          key="flame"
          className="absolute pointer-events-none"
          style={{ bottom: "100%", left: "50%", translateX: "-50%", transformOrigin: "bottom center" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {/* Outer glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 0.95, 1.1, 1], opacity: [0.6, 0.8, 0.65, 0.75, 0.6] }}
            transition={{ duration: 1.4 + index * 0.13, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: -2,
              left: "50%",
              transform: "translateX(-50%)",
              width: 20,
              height: 26,
              borderRadius: "50% 50% 40% 40%",
              background: "radial-gradient(ellipse at 50% 80%, rgba(255,160,40,0.5) 0%, rgba(255,80,0,0.2) 50%, transparent 80%)",
              filter: "blur(4px)",
            }}
          />
          {/* Main flame */}
          <motion.div
            animate={{
              scaleX: [1, 0.88, 1.06, 0.92, 1],
              scaleY: [1, 1.08, 0.95, 1.04, 1],
              rotate: [-2, 2, -3, 1, -2],
            }}
            transition={{ duration: 0.9 + index * 0.07, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 10,
              height: 18,
              borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%",
              background: "linear-gradient(to top, #ff6b00 0%, #ffac00 40%, #ffe066 75%, rgba(255,240,200,0.8) 100%)",
              position: "relative",
              zIndex: 2,
              boxShadow: "0 0 8px rgba(255,160,30,0.9), 0 0 16px rgba(255,100,0,0.5), 0 0 28px rgba(255,80,0,0.25)",
            }}
          />
          {/* Inner bright core */}
          <div
            style={{
              position: "absolute",
              bottom: 3,
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              height: 7,
              borderRadius: "50% 50% 30% 30%",
              background: "linear-gradient(to top, #fff 0%, #fffae0 100%)",
              opacity: 0.9,
              zIndex: 3,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── SINGLE CANDLE ──────────────────────────────────────────────────── */
function Candle({ lit, index, onSmoke }) {
  const colors = [
    ["#faf6ec", "#ebd7ab"], // Warm cream
    ["#facc15", "#ca8a04"], // Gold/yellow
    ["#fbbf24", "#d97706"], // Honey gold
    ["#f59e0b", "#b45309"], // Amber copper
    ["#ebd7ab", "#78350f"], // Antique bronze
  ];
  const [c1, c2] = colors[index % colors.length];

  return (
    <div className="relative flex flex-col items-center" style={{ width: 18 }}>
      {/* Flame */}
      <div className="relative" style={{ height: 24 }}>
        <CandleFlame lit={lit} index={index} />
        {!lit && <SmokePuff x="50%" delay={index * 0.1} />}
      </div>

      {/* Wick */}
      <div
        style={{
          width: 2,
          height: 7,
          background: lit ? "#4a3820" : "#2a1a0a",
          borderRadius: "1px 1px 0 0",
          zIndex: 2,
          position: "relative",
        }}
      />

      {/* Candle body */}
      <div
        style={{
          width: 14,
          height: 48,
          background: `linear-gradient(to right, ${c2} 0%, ${c1} 40%, rgba(255,255,255,0.3) 55%, ${c1} 70%, ${c2} 100%)`,
          borderRadius: "3px 3px 2px 2px",
          position: "relative",
          boxShadow: lit
            ? `0 0 8px ${c1}88, 0 0 20px ${c1}44, inset 1px 0 0 rgba(255,255,255,0.2)`
            : "inset 1px 0 0 rgba(255,255,255,0.15)",
        }}
      >
        {/* Wax drip */}
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 2,
            width: 3,
            height: 10,
            background: `${c1}cc`,
            borderRadius: "0 0 3px 3px",
          }}
        />
        {/* Candle shine */}
        <div
          style={{
            position: "absolute",
            top: 4,
            left: 4,
            width: 3,
            height: 20,
            background: "rgba(255,255,255,0.25)",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* Candle base */}
      <div
        style={{
          width: 18,
          height: 5,
          background: `linear-gradient(to bottom, ${c1}, ${c2})`,
          borderRadius: "2px",
          marginTop: -1,
        }}
      />
    </div>
  );
}

/* ─── BIRTHDAY CAKE ──────────────────────────────────────────────────── */
function BirthdayCake({ candlesLit, magical }) {
  return (
    <div className="relative flex flex-col items-center" style={{ userSelect: "none" }}>

      {/* Glow halo behind cake */}
      <motion.div
        animate={magical
          ? { scale: [1, 1.3, 1.1, 1.25, 1], opacity: [0.3, 0.7, 0.55, 0.65, 0.3] }
          : { scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }
        }
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute pointer-events-none glow-stabilized gpu-accelerated"
        style={{
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 280,
          height: 180,
          borderRadius: "50%",
          background: magical
            ? "radial-gradient(ellipse, rgba(255,160,180,0.55) 0%, rgba(255,100,120,0.3) 40%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(255,180,100,0.35) 0%, rgba(255,130,80,0.15) 50%, transparent 75%)",
          filter: "blur(20px)",
        }}
      />

      {/* Candles row */}
      <div className="relative flex items-end justify-center gap-5 z-10" style={{ marginBottom: -4 }}>
        {Array.from({ length: CANDLE_COUNT }).map((_, i) => (
          <Candle key={i} lit={candlesLit[i]} index={i} />
        ))}
      </div>

      {/* Cake top tier */}
      <div
        className="relative z-10"
        style={{
          width: 200,
          height: 64,
          background: "linear-gradient(to bottom, #fff1f5 0%, #fce7ef 30%, #f9d0e0 70%, #f0b8cc 100%)",
          borderRadius: "12px 12px 4px 4px",
          boxShadow: "0 4px 20px rgba(240,130,160,0.35), inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(200,100,130,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Frosting drips top */}
        {[14, 38, 62, 90, 118, 146, 170].map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: x,
              width: 14,
              height: 18 + (i % 3) * 6,
              background: "rgba(255,255,255,0.85)",
              borderRadius: "0 0 8px 8px",
            }}
          />
        ))}
        {/* Decorative dots */}
        {[30, 60, 100, 140, 170].map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 26 + (i % 2) * 8,
              left: x,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: ["#f472b6", "#fb923c", "#facc15", "#f472b6", "#fb7185"][i],
              boxShadow: `0 0 6px ${["#f472b6","#fb923c","#facc15","#f472b6","#fb7185"][i]}88`,
            }}
          />
        ))}
        {/* Horizontal ribbon */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: 0,
            right: 0,
            height: 1,
            background: "rgba(240,150,180,0.3)",
          }}
        />
        {/* Text on cake */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ paddingTop: 14 }}
        >
          <span
            style={{
              ...FONT_SCRIPT,
              fontSize: "16px",
              color: "rgba(120,70,30,0.8)",
              letterSpacing: "1px",
            }}
          >
            Happy Birthday
          </span>
        </div>
      </div>

      {/* Middle tier */}
      <div
        style={{
          width: 240,
          height: 78,
          background: "linear-gradient(to bottom, #faf5e6 0%, #f3e5c4 30%, #e8d6ad 65%, #d9b566 100%)",
          borderRadius: "4px 4px 4px 4px",
          position: "relative",
          zIndex: 9,
          marginTop: -2,
          boxShadow: "0 6px 24px rgba(217,181,102,0.2), inset 0 2px 0 rgba(255,255,255,0.4)",
          overflow: "hidden",
        }}
      >
        {/* Frosting drips */}
        {[8, 28, 52, 76, 104, 130, 160, 188, 210].map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: x,
              width: 16,
              height: 16 + (i % 4) * 5,
              background: "rgba(255,250,240,0.85)",
              borderRadius: "0 0 10px 10px",
            }}
          />
        ))}
        {/* Decorative flowers */}
        {[40, 90, 140, 200].map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 30 + (i % 2) * 10,
              left: x,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,215,100,0.7) 50%, transparent 80%)",
              boxShadow: "0 0 8px rgba(255,215,100,0.6)",
            }}
          />
        ))}
        {/* Vertical stripe accents */}
        {[60, 120, 180].map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 20,
              left: x,
              width: 1,
              height: 40,
              background: "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* Bottom tier */}
      <div
        style={{
          width: 286,
          height: 90,
          background: "linear-gradient(to bottom, #f3e5c4 0%, #e8d6ad 30%, #cca052 70%, #a57e3c 100%)",
          borderRadius: "4px 4px 6px 6px",
          position: "relative",
          zIndex: 8,
          marginTop: -3,
          boxShadow: "0 8px 32px rgba(165,126,60,0.25), inset 0 2px 0 rgba(255,255,255,0.35)",
          overflow: "hidden",
        }}
      >
        {/* Frosting drips */}
        {[6, 26, 50, 74, 100, 124, 150, 176, 202, 228, 252].map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: x,
              width: 18,
              height: 18 + (i % 4) * 6,
              background: "rgba(255,250,240,0.8)",
              borderRadius: "0 0 10px 10px",
            }}
          />
        ))}
        {/* Decorative hearts row */}
        {[30, 80, 130, 180, 240].map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 30 + (i % 2) * 12,
              left: x,
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1,
            }}
          >
            ♡
          </div>
        ))}
        {/* Pearl border bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 8,
            right: 8,
            height: 8,
            borderRadius: "4px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 80%, transparent)",
          }}
        />
        {/* Wave decoration */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          style={{ height: 20 }}
          viewBox="0 0 286 20"
          preserveAspectRatio="none"
        >
          <path
            d="M0,10 Q20,0 40,10 Q60,20 80,10 Q100,0 120,10 Q140,20 160,10 Q180,0 200,10 Q220,20 240,10 Q260,0 280,10 L286,10 L286,20 L0,20 Z"
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
      </div>

      {/* Cake board / plate */}
      <div
        style={{
          width: 320,
          height: 22,
          background: "linear-gradient(to bottom, #f5eedc 0%, #ebd29f 50%, #d1ab62 100%)",
          borderRadius: "4px 4px 12px 12px",
          marginTop: -2,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.8)",
          position: "relative",
          zIndex: 7,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "4px 12px",
            borderRadius: "2px 2px 8px 8px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
          }}
        />
      </div>

      {/* Table surface shadow */}
      <motion.div
        animate={{ scaleX: magical ? [1, 1.15, 1] : [1, 1.05, 1], opacity: magical ? [0.35, 0.55, 0.35] : [0.2, 0.3, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          width: 340,
          height: 28,
          background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 75%)",
          filter: "blur(8px)",
          marginTop: 4,
        }}
      />
    </div>
  );
}

/* ─── NEXT CHAPTER BUTTON ────────────────────────────────────────────── */
function NextChapterButton({ onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        width: "clamp(180px, 50vw, 215px)",
        height: "52px",
        borderRadius: "2px",
        border: "1px solid rgba(255,190,100,0.45)",
        background: "linear-gradient(135deg, rgba(140,80,20,0.6), rgba(80,40,10,0.8))",
        boxShadow: "0 0 35px rgba(255,180,80,0.25), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,150,0.25)",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
      }}
    >
      {/* Shimmer */}
      <motion.div
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
        className="absolute inset-0 skew-x-12"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,220,150,0.2), transparent)" }}
      />
      {/* Ornamental lines */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-30">
        <div className="flex-1 h-px bg-amber-200" />
        <span className="text-amber-200 text-[8px]">✦</span>
        <div className="flex-1 h-px bg-amber-200" />
      </div>
      <span
        className="relative text-amber-50/90 uppercase"
        style={{ ...FONT_BODY, fontSize: "10px", letterSpacing: "5px", fontWeight: 600 }}
      >
        Next Chapter
      </span>
    </motion.button>
  );
}

/* ─── WISH RESULT MESSAGE ────────────────────────────────────────────── */
function WishMessage() {
  return (
    <div
      className="relative text-center"
      style={{ maxWidth: 420, margin: "0 auto" }}
    >
      {/* Decorative top – tighter spacing */}
      <div className="flex items-center justify-center gap-1 mb-0">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-200/30" />
        <motion.span
          animate={{ scale: [1, 1.15, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: "#fbbf24", fontSize: 15 }}
        >
          ✦
        </motion.span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-200/30" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="leading-[2.1] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] text-center mb-0"
        style={{
          ...FONT_BODY,
          fontSize: "clamp(14px, 3vw, 16.5px)",
          color: "rgba(255,245,230,0.96)",
          fontStyle: "italic",
          maxWidth: "90%",
          margin: "0 auto",
        }}
      >
        {WISH_MESSAGE}
      </motion.p>
    </div>
  );
}

/* ─── MICROPHONE BLOW DETECTOR ───────────────────────────────────────── */
function useMicDetector(onBlow) {
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const check = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        if (avg > 28) {
          onBlow();
          stop();
          return;
        }
        rafRef.current = requestAnimationFrame(check);
      };
      check();
    } catch {
      // mic not available – user can click instead
    }
  }, [onBlow]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    analyserRef.current = null;
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { start, stop };
}

/* ─── CAKE SECTION ROOT ──────────────────────────────────────────────── */
function CakeSection() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro"); // intro | ready | blown | done
  const [candlesLit, setCandlesLit] = useState(Array(CANDLE_COUNT).fill(true));
  const [magical, setMagical] = useState(false);
  const [micActive, setMicActive] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const bgX = useTransform(mouseX, [0, 1], [-12, 12]);
  const bgY = useTransform(mouseY, [0, 1], [-8, 8]);

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  }, [mouseX, mouseY]);

  /* Intro → ready after 2s */
  useEffect(() => {
    if (phase === "intro") {
      const t = setTimeout(() => setPhase("ready"), 2200);
      return () => clearTimeout(t);
    }
  }, [phase]);

  /* Blow out all candles */
  const blowCandles = useCallback(() => {
    if (phase !== "ready" && phase !== "blowing") return;
    setPhase("blowing");

    // Extinguish candles one by one
    candlesLit.forEach((_, i) => {
      setTimeout(() => {
        setCandlesLit((prev) => {
          const next = [...prev];
          next[i] = false;
          return next;
        });
      }, i * 180);
    });

    // After all blown
    setTimeout(() => {
      setMagical(true);
      setPhase("blown");
      setTimeout(() => setPhase("done"), 2000);
    }, CANDLE_COUNT * 180 + 600);
  }, [phase, candlesLit]);

  const { start: startMic } = useMicDetector(blowCandles);

  const handleMicStart = useCallback(async () => {
    if (micActive || phase !== "ready") return;
    setMicActive(true);
    await startMic();
  }, [micActive, phase, startMic]);

  const isBlown = phase === "blown" || phase === "done";
  const showWish = phase === "blown" || phase === "done";
  const showButton = phase === "done";

  return (
    <section
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center layer-isolated"
      style={{ background: "#0d0a07" }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Deep night gradient background ── */}
      <div
        className="absolute inset-0 glow-stabilized"
        style={{
          background: magical
            ? "radial-gradient(ellipse at 50% 60%, rgba(217,143,43,0.18) 0%, rgba(160,103,32,0.12) 30%, rgba(15,10,5,0.98) 70%, #0d0a07 100%)"
            : "radial-gradient(ellipse at 50% 65%, rgba(140,90,30,0.14) 0%, rgba(90,58,18,0.09) 40%, rgba(12,8,4,0.99) 70%, #0d0a07 100%)",
          transition: "background 2s ease",
        }}
      />

      {/* ── Parallax ambient blobs ── */}
      <motion.div
        className="absolute pointer-events-none glow-stabilized gpu-accelerated"
        animate={{ scale: magical ? [1, 1.3, 1] : [1, 1.15, 1], opacity: magical ? [0.2, 0.45, 0.2] : [0.08, 0.18, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          x: bgX,
          y: bgY,
          top: "-10%",
          left: "-10%",
          width: "55vw",
          height: "55vw",
          borderRadius: "50%",
          background: magical
            ? "radial-gradient(circle, rgba(255,200,100,0.3) 0%, rgba(200,140,40,0.15) 50%, transparent 70%)"
            : "radial-gradient(circle, rgba(200,140,60,0.18) 0%, rgba(140,90,30,0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{ scale: magical ? [1.2, 1, 1.2] : [1.1, 1, 1.1], opacity: magical ? [0.15, 0.4, 0.15] : [0.06, 0.14, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute pointer-events-none glow-stabilized gpu-accelerated"
        style={{
          bottom: "-5%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: magical
            ? "radial-gradient(circle, rgba(255,180,80,0.25) 0%, rgba(200,110,40,0.12) 50%, transparent 70%)"
            : "radial-gradient(circle, rgba(160,110,40,0.14) 0%, rgba(120,70,25,0.06) 50%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* ── Ambient lines ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

      {/* ── Side labels ── */}
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="hidden md:flex flex-col items-center gap-2 md:gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-10"
        >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>magical</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-100/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>birthday</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="hidden md:flex flex-col items-center gap-2 md:gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-10"
        >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>forever</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-100/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>yours</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      {/* ── Bokeh & sparkles ── */}
      <BokehParticles magical={magical} />
      <DustSparkles burst={magical} />
      {magical && <Confetti />}

      {/* ── Vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,200,100,0.04),transparent_65%)] pointer-events-none" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center px-6 py-12 w-full" style={{ gap: "clamp(2px, 0.5vh, 4px)" }}>

        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "2px" }}
            animate={{ opacity: 1, letterSpacing: "8px" }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="uppercase text-amber-200/40 text-[10px] mb-0 tracking-[8px]"
            style={FONT_BODY}
          >
            A Special Moment
          </motion.p>

          <motion.h1
            animate={magical
              ? { textShadow: ["0 0 20px rgba(255,200,100,0.6)", "0 0 40px rgba(255,160,80,0.9)", "0 0 20px rgba(255,200,100,0.6)"] }
              : { textShadow: ["0 0 20px rgba(255,200,100,0.3)", "0 0 30px rgba(255,160,80,0.5)", "0 0 20px rgba(255,200,100,0.3)"] }
            }
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              ...FONT_SCRIPT,
              fontSize: "clamp(2rem, 8vw, 3.5rem)",
              color: magical ? "rgba(255,245,220,0.98)" : "rgba(255,235,200,0.92)",
              lineHeight: 1.0,
              marginBottom: 0,
              transition: "color 1.5s ease",
            }}
          >
            Happy Birthday, Ammuni ♡
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-amber-100/40 tracking-[5px] uppercase text-[11px]"
            style={FONT_BODY}
          >
            To My Most Favourite Girl
          </motion.p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex items-center gap-1"
          style={{ width: "min(180px, 45vw)" }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-200/20" />
          <span className="text-amber-200/40 text-xs">✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-200/20" />
        </motion.div>

        {/* Grid container to stack cake and wish message on top of each other with zero layout shifts */}
        <div className="relative w-full grid grid-cols-1 grid-rows-1 items-center justify-items-center">
          
          {/* Cake & Prompt Block */}
          <motion.div
            animate={{
              opacity: isBlown ? 0 : 1,
              y: isBlown ? -15 : 0,
              scale: isBlown ? 0.97 : 1,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full flex flex-col items-center"
            style={{
              gap: "clamp(20px, 4vh, 36px)",
              gridArea: "1 / 1 / 2 / 2",
              pointerEvents: isBlown ? "none" : "auto",
            }}
          >
            {/* Cake */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: magical ? [0, -0.5, 0.5, 0] : [0, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <BirthdayCake candlesLit={candlesLit} magical={magical} />
            </motion.div>

            {/* Interactive prompt */}
            <div className="text-center flex flex-col items-center gap-4">
              <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{
                  ...FONT_SCRIPT,
                  fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                  color: "rgba(255,220,180,0.75)",
                }}
              >
                Make a wish and blow the candles...
              </motion.p>

              {/* Interaction buttons */}
              <div className="flex gap-3 flex-wrap justify-center mt-1">
                {/* Click/tap button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={blowCandles}
                  disabled={phase !== "ready"}
                  className="relative flex items-center justify-center gap-2 overflow-hidden"
                  style={{
                    height: 44,
                    paddingInline: 22,
                    borderRadius: "2px",
                    border: "1px solid rgba(220,190,130,0.28)",
                    background: "linear-gradient(135deg, rgba(60,35,8,0.45), rgba(30,15,3,0.65))",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                    opacity: phase !== "ready" ? 0.5 : 1,
                  }}
                >
                  <span style={{ ...FONT_BODY, fontSize: "10px", letterSpacing: "4px", color: "rgba(255,235,200,0.85)", textTransform: "uppercase" }}>
                    Tap to Blow
                  </span>
                </motion.button>

                {/* Mic button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMicStart}
                  disabled={phase !== "ready" || micActive}
                  className="relative flex items-center justify-center gap-2 overflow-hidden"
                  style={{
                    height: 44,
                    paddingInline: 22,
                    borderRadius: "2px",
                    border: "1px solid rgba(220,190,130,0.18)",
                    background: "linear-gradient(135deg, rgba(45,25,5,0.4), rgba(25,12,3,0.6))",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                    opacity: phase !== "ready" || micActive ? 0.5 : 1,
                  }}
                >
                  {micActive && (
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ fontSize: 12, color: "#fbbf24" }}
                    >
                      🎤
                    </motion.span>
                  )}
                  <span style={{ ...FONT_BODY, fontSize: "10px", letterSpacing: "4px", color: "rgba(255,235,200,0.75)", textTransform: "uppercase" }}>
                    {micActive ? "Listening..." : "Blow into mic"}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Wish Message & Button Block */}
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{
              opacity: isBlown ? 1 : 0,
              y: isBlown ? 0 : 15,
              scale: isBlown ? 1 : 0.98,
            }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: isBlown ? 0.25 : 0 }}
            className="w-full flex flex-col items-center gap-2"
            style={{
              maxWidth: 480,
              gridArea: "1 / 1 / 2 / 2",
              pointerEvents: isBlown ? "auto" : "none",
            }}
          >
            <WishMessage />

            {showButton && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <NextChapterButton onClick={() => navigate("/memories")} />
              </motion.div>
            )}
          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default CakeSection;