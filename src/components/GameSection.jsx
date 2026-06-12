import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import localTeddyImg from "../assets/teddy.png";
import { getAssetUrl } from "../config/cdn";

const teddyImg = getAssetUrl(localTeddyImg, "teddy.png");

const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

// ─── BOKEH GLOW PARTICLES ─────────────────────────────────────────────
function GameBokeh() {
  const particles = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 8,
      dur: Math.random() * 12 + 8,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.12 + 0.03,
    })),
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
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, rgba(255,215,150,0.3) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
          animate={{
            y: [0, -40, -10, -50],
            opacity: [0, p.opacity, p.opacity * 0.5, 0],
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

// ─── CONFETTI SPARKLE BURST ───────────────────────────────────────────
function SparkleBurst({ active }) {
  const pieces = useMemo(() => 
    Array.from({ length: 35 }, (_, i) => {
      const angle = (i / 35) * Math.PI * 2;
      const velocity = Math.random() * 120 + 60;
      return {
        id: i,
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity - 30,
        size: Math.random() * 6 + 3,
        color: ["#ffd700", "#ff8c94", "#ffc8a2", "#f472b6", "#fffacd"][Math.floor(Math.random() * 5)],
        dur: Math.random() * 1.5 + 0.8,
      };
    }),
    []
  );

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-30">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full gpu-accelerated"
          style={{
            left: "50%",
            top: "50%",
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: p.dur,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── GLASSMORPHIC CUP COMPONENT ────────────────────────────────────────
function GlassCup({ label, isLifted, revealedContent, onClick, customX, index }) {
  return (
    <motion.div
      style={{ x: customX }}
      className="relative flex flex-col items-center justify-end h-[220px] w-[90px] cursor-pointer"
      onClick={onClick}
    >
      {/* Revealed letter/heart behind the cup */}
      <div className="absolute bottom-4 flex items-center justify-center w-full h-[80px] z-10 pointer-events-none">
        <AnimatePresence>
          {isLifted && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.15 }}
              className="flex items-center justify-center"
            >
              {revealedContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The Cup Object */}
      <motion.div
        animate={{
          y: isLifted ? -90 : 0,
          rotate: isLifted ? [0, -5, 5, 0] : 0,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative w-full h-[120px] rounded-t-full border border-amber-200/25 bg-white/[0.04] backdrop-blur-[10px] shadow-[inset_0_4px_12px_rgba(255,255,255,0.15),0_12px_24px_rgba(0,0,0,0.5)] flex flex-col items-center justify-between py-4 select-none z-20 page-transform-3d"
      >
        {/* Golden rim top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-t-full opacity-80" />
        
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent rounded-t-full pointer-events-none" />

        {/* Decorative monogram */}
        <span className="text-[10px] text-amber-200/25 tracking-[2px] mt-4" style={FONT_BODY}>
          {label}
        </span>

        {/* Gold ring band */}
        <div className="w-[85%] h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent my-1" />

        {/* Bottom pedestal rim */}
        <div className="w-[90%] h-2 bg-gradient-to-b from-amber-400/20 to-amber-600/40 border border-amber-400/30 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.3)] mb-1" />
      </motion.div>

      {/* Surface shadow under cup */}
      <motion.div
        animate={{
          scale: isLifted ? 0.7 : 1,
          opacity: isLifted ? 0.15 : 0.4,
        }}
        className="w-[80px] h-[10px] bg-black/60 blur-[4px] rounded-full mt-2 pointer-events-none"
      />
    </motion.div>
  );
}

// ─── GAME SECTION ROOT ────────────────────────────────────────────────
function GameSection() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("intro"); // intro | shuffling | choose | reveal | done
  const [lifted, setLifted] = useState([false, false, false]); // [left, middle, right]
  const [shuffleRound, setShuffleRound] = useState(0);
  const [sparkleActive, setSparkleActive] = useState(false);

  // Position offset state for cup animation shuffles
  const [offsets, setOffsets] = useState([0, 0, 0]); // indices: 0 = left, 1 = middle, 2 = right
  const [cupMapping, setCupMapping] = useState([0, 1, 2]); // keeps track of cup indices

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const bgX = useTransform(mouseX, [0, 1], [-12, 12]);
  const bgY = useTransform(mouseY, [0, 1], [-8, 8]);

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  }, [mouseX, mouseY]);

  // Set up the heart model
  const Heart = useMemo(() => (
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      style={{
        fontSize: "36px",
        color: "#f43f5e",
        filter: "drop-shadow(0 0 12px rgba(244,63,94,0.85)) drop-shadow(0 0 24px rgba(244,63,94,0.4))",
        lineHeight: 1,
      }}
    >
      💖
    </motion.div>
  ), []);

  // Set up the letters
  const LetterI = useMemo(() => (
    <span className="text-4xl text-amber-200 font-light tracking-widest leading-none drop-shadow-[0_0_12px_rgba(251,191,36,0.65)]" style={FONT_BODY}>
      I
    </span>
  ), []);

  const LetterU = useMemo(() => (
    <span className="text-4xl text-amber-200 font-light tracking-widest leading-none drop-shadow-[0_0_12px_rgba(251,191,36,0.65)]" style={FONT_BODY}>
      U
    </span>
  ), []);

  // Trigger the start of shuffling
  const startShuffling = () => {
    setPhase("shuffling");
    setLifted([false, false, false]);
    setShuffleRound(0);
  };

  // Perform a single shuffle step
  useEffect(() => {
    if (phase !== "shuffling") return;

    if (shuffleRound >= 6) {
      // Shuffling finishes, make sure the cup with the heart ends up in the middle (index 1)
      setTimeout(() => {
        // Resolve positions to perfect default centered state
        setOffsets([0, 0, 0]);
        setCupMapping([0, 1, 2]);
        setPhase("choose");
      }, 600);
      return;
    }

    const timer = setTimeout(() => {
      // Pick two random cups to swap
      const idxA = Math.floor(Math.random() * 3);
      let idxB = Math.floor(Math.random() * 3);
      while (idxB === idxA) {
        idxB = Math.floor(Math.random() * 3);
      }

      setOffsets((prev) => {
        const next = [...prev];
        // Swap their relative visual coordinates
        const spacing = 110; // offset in px
        const posA = idxA === 0 ? -spacing : idxA === 1 ? 0 : spacing;
        const posB = idxB === 0 ? -spacing : idxB === 1 ? 0 : spacing;

        next[idxA] = posB - posA;
        next[idxB] = posA - posB;
        return next;
      });

      setShuffleRound((r) => r + 1);
    }, 450);

    return () => clearTimeout(timer);
  }, [phase, shuffleRound]);

  // Handle cup selection
  const handleCupClick = (index) => {
    if (phase !== "choose") return;

    // The heart is forced to be in the middle cup (index 1)
    if (index === 1) {
      setLifted((prev) => {
        const next = [...prev];
        next[1] = true;
        return next;
      });
      setSparkleActive(true);
      setPhase("reveal");

      // Auto-lift the remaining two glasses after a short delay to reveal "I" and "U"
      setTimeout(() => {
        setLifted([true, true, true]);
        setPhase("done");
      }, 1500);
    }
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center layer-isolated"
      style={{ background: "#0d0a07" }}
      onMouseMove={handleMouseMove}
    >
      {/* Parallax ambient glows */}
      <motion.div
        className="absolute pointer-events-none glow-stabilized gpu-accelerated"
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          x: bgX,
          y: bgY,
          top: "-15%",
          left: "-15%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,140,60,0.18) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <motion.div
        className="absolute pointer-events-none glow-stabilized gpu-accelerated"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.06, 0.13, 0.06] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        style={{
          bottom: "-10%",
          right: "-15%",
          width: "45vw",
          height: "45vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(160,110,40,0.14) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Bokeh background */}
      <GameBokeh />

      {/* Radial vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,200,100,0.03),transparent_65%)] pointer-events-none" />

      {/* Top / bottom hairline decorators */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

      {/* Side labels */}
      <div className="hidden md:flex flex-col items-center gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-amber-200/20" />
        <span className="text-amber-200/25 text-[9px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>the game</span>
        <div className="w-1 h-1 rounded-full bg-amber-200/20" />
        <span className="text-amber-100/15 text-[9px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>of love</span>
        <div className="w-px h-20 bg-gradient-to-b from-amber-200/20 to-transparent" />
      </div>

      <div className="hidden md:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <div className="w-px h-20 bg-gradient-to-b from-transparent to-amber-200/20" />
        <span className="text-amber-200/25 text-[9px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>forever</span>
        <div className="w-1 h-1 rounded-full bg-amber-200/20" />
        <span className="text-amber-100/15 text-[9px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>yours</span>
        <div className="w-px h-20 bg-gradient-to-b from-amber-200/20 to-transparent" />
      </div>

      {/* Main interactive window */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6 text-center select-none" style={{ gap: 20 }}>
        
        {/* Heading */}
        <div className="flex flex-col items-center">
          <p className="uppercase text-amber-200/40 text-[10px] tracking-[8px] mb-2" style={FONT_BODY}>
            Teddy's Challenge
          </p>
          <h1 className="text-4xl sm:text-5xl text-amber-50 leading-relaxed" style={{ ...FONT_SCRIPT, textShadow: "0 0 15px rgba(255,200,100,0.3)" }}>
            Find My Heart
          </h1>
          {/* Subtle separator */}
          <div className="flex items-center gap-2 mt-1 w-24">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-200/30" />
            <span className="text-amber-300 text-[8px]">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-200/30" />
          </div>
        </div>

        {/* Teddy Bear Host Frame */}
        <div className="relative w-36 h-36 rounded-full border border-amber-200/20 bg-[#120d09]/65 overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(255,200,100,0.06)] flex items-center justify-center z-10">
          {/* Outer glow ring */}
          <div className="absolute inset-0 border border-amber-300/10 rounded-full blur-[2px]" />
          <img
            src={teddyImg}
            alt="Teddy Bear"
            className="w-full h-full object-cover transform scale-105"
            style={{ filter: "brightness(0.9) contrast(1.05)" }}
          />
        </div>

        {/* Shuffling Table Setup */}
        <div className="relative w-full min-h-[300px] border border-amber-200/15 rounded-3xl bg-gradient-to-b from-white/[0.02] to-white/[0.005] shadow-[0_30px_70px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col items-center justify-center p-8 overflow-visible">
          {/* Sparkle burst inside the table */}
          <SparkleBurst active={sparkleActive} />

          {/* Interactive instruction label */}
          <div className="absolute top-4 w-full text-center z-10">
            <AnimatePresence mode="wait">
              {phase === "intro" && (
                <motion.p
                  key="intro"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="text-amber-100/50 text-xs tracking-wider"
                  style={FONT_BODY}
                >
                  Teddy hid a heart under the middle cup.
                </motion.p>
              )}
              {phase === "shuffling" && (
                <motion.p
                  key="shuffling"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-amber-300/70 text-xs tracking-[2px] uppercase animate-pulse"
                  style={FONT_BODY}
                >
                  Shuffling in progress...
                </motion.p>
              )}
              {phase === "choose" && (
                <motion.p
                  key="choose"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-amber-100 text-xs font-semibold tracking-wider"
                  style={FONT_BODY}
                >
                  Tap the <span className="text-amber-400">middle glass</span> to reveal the heart!
                </motion.p>
              )}
              {phase === "reveal" && (
                <motion.p
                  key="reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-amber-200 text-xs tracking-wider uppercase"
                  style={FONT_BODY}
                >
                  A match made in heaven!
                </motion.p>
              )}
              {phase === "done" && (
                <motion.p
                  key="done"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-amber-200/90 text-sm font-semibold tracking-[4px] uppercase"
                  style={FONT_BODY}
                >
                  I ♡ U
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* The three cups row */}
          <div className="flex justify-center items-end gap-6 w-full max-w-sm mt-8 overflow-visible relative">
            
            {/* Left Cup */}
            <GlassCup
              label="Cup I"
              isLifted={lifted[0]}
              revealedContent={LetterI}
              customX={offsets[0]}
              index={0}
            />

            {/* Middle Cup */}
            <GlassCup
              label="Cup II"
              isLifted={lifted[1]}
              revealedContent={Heart}
              onClick={() => handleCupClick(1)}
              customX={offsets[1]}
              index={1}
            />

            {/* Right Cup */}
            <GlassCup
              label="Cup III"
              isLifted={lifted[2]}
              revealedContent={LetterU}
              customX={offsets[2]}
              index={2}
            />

          </div>

          {/* Wooden tabletop edge decoration */}
          <div className="w-[105%] h-3 bg-gradient-to-r from-amber-900/40 via-amber-800/80 to-amber-900/40 border-t border-amber-600/30 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.5)] mt-4 z-10" />
        </div>

        {/* Buttons and messages area */}
        <div className="relative min-h-[90px] w-full flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.button
                key="btn-start"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startShuffling}
                className="relative flex items-center justify-center overflow-hidden cursor-pointer"
                style={{
                  width: "200px",
                  height: "48px",
                  borderRadius: "2px",
                  border: "1px solid rgba(255,190,100,0.45)",
                  background: "linear-gradient(135deg, rgba(140,80,20,0.6), rgba(80,40,10,0.8))",
                  boxShadow: "0 0 25px rgba(255,180,80,0.2), inset 0 1px 0 rgba(255,220,150,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="relative text-amber-50/90 uppercase tracking-[4px] text-[9px] font-semibold" style={FONT_BODY}>
                  Start Shuffle
                </span>
              </motion.button>
            )}

            {phase === "done" && (
              <motion.div
                key="msg-done"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1 }}
                className="flex flex-col items-center gap-6"
              >
                {/* Romantic Message */}
                <p className="text-amber-100/90 text-center text-lg italic max-w-sm px-4 leading-[2.0]" style={FONT_BODY}>
                  "My heart was always yours, and it will always find you in the center of my world. ♡"
                </p>

                {/* Continue button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/memories")}
                  className="relative flex items-center justify-center overflow-hidden cursor-pointer mt-2"
                  style={{
                    width: "215px",
                    height: "52px",
                    borderRadius: "2px",
                    border: "1px solid rgba(220,190,130,0.28)",
                    background: "linear-gradient(135deg, rgba(60,35,8,0.45), rgba(30,15,3,0.65))",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,200,100,0.06)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Shimmer sweep */}
                  <motion.div
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
                    className="absolute inset-0 skew-x-12"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,200,100,0.13), transparent)" }}
                  />
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-30">
                    <div className="flex-1 h-px bg-amber-200/60" />
                    <span className="text-amber-200 text-[8px]">✦</span>
                    <div className="flex-1 h-px bg-amber-200/60" />
                  </div>
                  <span className="relative text-amber-50/90 uppercase tracking-[4px] text-[10px] font-semibold" style={FONT_BODY}>
                    Next Chapter
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

export default GameSection;
