import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ─── FONTS (exact project match) ────────────────────────────────────── */
const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

/* ─── POEM CONTENT ───────────────────────────────────────────────────── */
const STANZAS = [
  {
    id: "s0",
    lines: [
      "From the very first moment I noticed you,",
      "something inside me quietly changed —",
      "not all at once,",
      "but slowly, the way dawn changes the sky.",
    ],
  },
  {
    id: "s1",
    lines: [
      "You became my favourite thought,",
      "my softest feeling,",
      "my most honest prayer.",
    ],
  },
  {
    id: "s2",
    lines: [
      "I'm waiting for your message, I'm waiting for your love,",
      "I'm waiting for you to show my entire love,",
      "until then, I miss you a lot.",
    ],
  },
  {
    id: "s3",
    lines: [
      "This entire journey —",
      "every word, every page, every candle —",
      "was made only for you.",
      "Only ever for you.",
    ],
  },
];

const CLOSING = {
  name:  "Happy Birthday, Ammuni.",
  verse: "I love you beyond every word I know.",
  sign:  "Forever yours, ♡",
};



/* ─── DUST PARTICLES (exact letter section style) ────────────────────── */
function DustParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 22 }, (_, i) => {
      const seed = i + 1;
      const rand1 = Math.abs((Math.sin(seed * 12.9898) * 43758.5453) % 1);
      const rand2 = Math.abs((Math.sin(seed * 78.233) * 43758.5453) % 1);
      const rand3 = Math.abs((Math.sin(seed * 45.164) * 43758.5453) % 1);
      const rand4 = Math.abs((Math.sin(seed * 92.128) * 43758.5453) % 1);
      return {
        id: i,
        x: rand1 * 100,
        y: rand2 * 100,
        size: rand3 * 3 + 1,
        dur: rand4 * 12 + 8,
        delay: rand1 * 6,
        opacity: rand2 * 0.25 + 0.05,
      };
    }),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden layer-isolated">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-200 gpu-accelerated"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [0, -60, -20, -80], x: [0, 10, -8, 15], opacity: [0, p.opacity, p.opacity * 0.5, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── FLOATING GOLD FLECKS ───────────────────────────────────────────── */
function GoldFlecks() {
  const flecks = useMemo(() => 
    Array.from({ length: 18 }, (_, i) => {
      const seed = i + 50;
      const rand1 = Math.abs((Math.sin(seed * 12.9898) * 43758.5453) % 1);
      const rand2 = Math.abs((Math.sin(seed * 78.233) * 43758.5453) % 1);
      const rand3 = Math.abs((Math.sin(seed * 45.164) * 43758.5453) % 1);
      const rand4 = Math.abs((Math.sin(seed * 92.128) * 43758.5453) % 1);
      return {
        id: i,
        x: rand1 * 100,
        y: 100 + rand2 * 20,
        size: rand3 * 5 + 2,
        dur: rand4 * 18 + 14,
        delay: rand1 * 10,
        opacity: rand2 * 0.18 + 0.06,
        drift: (rand3 - 0.5) * 80,
        repeatDelay: rand4 * 4 + 2,
      };
    }),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden layer-isolated">
      {flecks.map((p) => (
        <motion.div
          key={p.id}
          className="absolute gpu-accelerated"
          style={{
            left: `${p.x}%`,
            bottom: `${100 - p.y}%`,
            width: p.size,
            height: p.size * 0.5,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,210,120,${p.opacity * 3}) 0%, rgba(200,160,60,${p.opacity}) 60%, transparent 100%)`,
          }}
          animate={{
            y: ["0px", "-110vh"],
            x: [0, p.drift * 0.5, p.drift],
            opacity: [0, p.opacity, p.opacity * 0.6, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, repeatDelay: p.repeatDelay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ─── BOKEH ORBS (amber/gold palette) ───────────────────────────────── */
function BokehOrbs() {
  const orbs = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => {
      const seed = i + 150;
      const rand1 = Math.abs((Math.sin(seed * 12.9898) * 43758.5453) % 1);
      const rand2 = Math.abs((Math.sin(seed * 78.233) * 43758.5453) % 1);
      const rand3 = Math.abs((Math.sin(seed * 45.164) * 43758.5453) % 1);
      const rand4 = Math.abs((Math.sin(seed * 92.128) * 43758.5453) % 1);
      return {
        id: i,
        x: rand1 * 100,
        y: rand2 * 100,
        size: rand3 * 140 + 50,
        dur: rand4 * 14 + 9,
        delay: rand1 * 7,
        opacity: rand2 * 0.09 + 0.02,
        color: [
          "rgba(255,200,100,", "rgba(220,160,60,",
          "rgba(255,180,80,",  "rgba(200,140,40,",
        ][i % 4],
      };
    }),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden layer-isolated">
      {orbs.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full gpu-accelerated glow-stabilized"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(circle, ${p.color}${p.opacity * 5}) 0%, transparent 70%)`,
            filter: `blur(${p.size * 0.38}px)`,
          }}
          animate={{ scale: [1, 1.22, 0.9, 1.12, 1], opacity: [0, p.opacity, p.opacity * 0.7, p.opacity, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── STAR FIELD ─────────────────────────────────────────────────────── */
function StarField() {
  const stars = useMemo(() => 
    Array.from({ length: 55 }, (_, i) => {
      const seed = i + 300;
      const rand1 = Math.abs((Math.sin(seed * 12.9898) * 43758.5453) % 1);
      const rand2 = Math.abs((Math.sin(seed * 78.233) * 43758.5453) % 1);
      const rand3 = Math.abs((Math.sin(seed * 45.164) * 43758.5453) % 1);
      const rand4 = Math.abs((Math.sin(seed * 92.128) * 43758.5453) % 1);
      return {
        id: i,
        x: rand1 * 100,
        y: rand2 * 100,
        size: rand3 * 1.8 + 0.4,
        dur: rand4 * 4 + 2,
        delay: rand1 * 5,
        opacity: rand2 * 0.45 + 0.1,
      };
    }),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden layer-isolated">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full gpu-accelerated"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            background: `rgba(255,220,160,${s.opacity})`,
          }}
          animate={{ opacity: [0, s.opacity, 0], scale: [0.7, 1.4, 0.7] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─── PULSING HEART ──────────────────────────────────────────────────── */
function PulsingHeart({ size = 44 }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 0.94, 1.14, 1] }}
      transition={{ duration: 1.7, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }}
      style={{ position: "relative", display: "inline-block" }}
    >
      <motion.div
        animate={{ scale: [1, 1.7, 1], opacity: [0.35, 0, 0.35] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: -size * 0.35,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,180,80,0.45) 0%, transparent 70%)",
          filter: `blur(${size * 0.22}px)`,
        }}
      />
      <span style={{
        fontSize: size,
        lineHeight: 1,
        color: "rgba(255,190,80,0.85)",
        filter: "drop-shadow(0 0 14px rgba(255,170,60,0.75)) drop-shadow(0 0 28px rgba(220,140,30,0.4))",
        display: "block",
      }}>
        ♡
      </span>
    </motion.div>
  );
}

/* ─── ORNAMENT DIVIDER ───────────────────────────────────────────────── */
function OrnamentDivider({ delay = 0, visible = true }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3"
          style={{ width: "min(240px, 55vw)" }}
        >
          <motion.div
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-200/30"
          />
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            style={{ color: "rgba(255,200,100,0.35)", fontSize: 9 }}
          >✦</motion.span>
          <motion.span
            animate={{ opacity: [0.3, 0.75, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: "rgba(255,180,70,0.55)", fontSize: 14 }}
          >♡</motion.span>
          <motion.span
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            style={{ color: "rgba(255,200,100,0.35)", fontSize: 9 }}
          >✦</motion.span>
          <motion.div
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
            className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-200/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── POEM LINE ──────────────────────────────────────────────────────── */
function PoemLine({ text, type = "verse", delay = 0, visible = true }) {
  const styles = {
    verse: {
      ...FONT_BODY,
      fontSize: "clamp(1.15rem, 4vw, 1.65rem)",
      color: "rgba(255,225,175,0.86)",
      fontStyle: "italic",
      lineHeight: 1.8,
      textShadow: "0 1px 4px rgba(0,0,0,0.5)",
    },
    name: {
      ...FONT_BODY,
      fontSize: "clamp(1.4rem, 4.5vw, 2.2rem)",
      color: "rgba(255,220,150,0.95)",
      lineHeight: 1.3,
      letterSpacing: "4px",
      textTransform: "uppercase",
      fontWeight: 300,
      filter: "drop-shadow(0 0 15px rgba(255,180,60,0.3))",
    },
    sign: {
      ...FONT_BODY,
      fontSize: "clamp(1.1rem, 3.8vw, 1.5rem)",
      color: "rgba(255,210,140,0.78)",
      fontStyle: "italic",
      lineHeight: 1.7,
    },
    sub: {
      ...FONT_BODY,
      fontSize: "clamp(13px, 2.8vw, 16px)",
      color: "rgba(255,200,140,0.6)",
      fontStyle: "italic",
      lineHeight: 1.9,
      letterSpacing: "0.01em",
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ ...styles[type], textAlign: "center", display: "block" }}
        >
          {text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* ─── OPENING CARD ───────────────────────────────────────────────────── */
function OpeningCard({ onBegin }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.93 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88, y: -30, filter: "blur(6px)" }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center px-6 min-h-screen"
      style={{ gap: 32 }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, letterSpacing: "2px" }}
        animate={{ opacity: 1, letterSpacing: "10px" }}
        transition={{ duration: 1.6, delay: 0.3 }}
        className="uppercase text-amber-100/35 text-[10px] tracking-[10px]"
        style={FONT_BODY}
      >
        A moment just for you
      </motion.p>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
        style={{ width: "min(380px, 90vw)" }}
      >
        {/* Outer glow — amber like the letter bg */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: -40,
            background: "radial-gradient(ellipse at 50% 50%, rgba(180,120,40,0.1) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />

        {/* Card body — exactly like envelope */}
        <div
          className="relative bg-gradient-to-b from-[#1e160e] to-[#170f08] border border-amber-200/15 rounded-2xl overflow-hidden"
          style={{
            boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 60px rgba(180,120,40,0.08), inset 0 1px 0 rgba(255,200,100,0.06)",
          }}
        >
          {/* Envelope flap triangle — same as EnvelopeView */}
          <div className="relative w-full overflow-hidden" style={{ paddingBottom: "36%" }}>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 380 138"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="finalFlapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2a1c0f" />
                  <stop offset="100%" stopColor="#1a1008" />
                </linearGradient>
              </defs>
              <polygon points="0,0 380,0 190,138" fill="url(#finalFlapGrad)" />
              <line x1="0"   y1="0" x2="190" y2="138" stroke="rgba(255,200,100,0.07)" strokeWidth="0.5" />
              <line x1="380" y1="0" x2="190" y2="138" stroke="rgba(255,200,100,0.07)" strokeWidth="0.5" />
              <line x1="0"   y1="0" x2="380" y2="0"   stroke="rgba(255,200,100,0.14)" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="px-10 pb-12 pt-2 flex flex-col items-center gap-5 -mt-1">
            {/* Divider */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-amber-200/10" />
              <span className="text-amber-200/20 text-xs">✦</span>
              <div className="flex-1 h-px bg-amber-200/10" />
            </div>

            {/* Pulsing heart */}
            <PulsingHeart size={48} />

            {/* Text */}
            <div className="text-center">
              <p className="text-amber-100/22 text-[10px] tracking-[5px] uppercase mb-3" style={FONT_BODY}>
                The Final Chapter
              </p>
              <p className="text-amber-50 leading-snug italic" style={{ ...FONT_BODY, fontSize: "clamp(1.6rem, 5vw, 2.2rem)" }}>
                Everything I felt,
              </p>
              <p className="text-amber-50/80 leading-snug mb-5 italic" style={{ ...FONT_BODY, fontSize: "clamp(1.3rem, 4vw, 1.7rem)" }}>
                written in the stars.
              </p>
              <p
                className="leading-[1.95]"
                style={{ ...FONT_BODY, fontSize: "clamp(13px, 2.8vw, 15px)", color: "rgba(255,200,140,0.45)", fontStyle: "italic" }}
              >
                This last page is the quietest one —<br />
                yet the one that holds the most.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-amber-200/10" />
              <span className="text-amber-200/20 text-xs">✦</span>
              <div className="flex-1 h-px bg-amber-200/10" />
            </div>

            {/* Stamp corner */}
            <div className="self-end border border-amber-200/15 rounded-sm w-12 h-14 flex items-center justify-center bg-amber-200/3">
              <span className="text-amber-200/30 text-lg" style={FONT_SCRIPT}>♡</span>
            </div>
          </div>
        </div>

        {/* Card shadow */}
        <div className="absolute -bottom-6 left-6 right-6 h-8 bg-black/40 blur-xl rounded-full -z-10" />
      </motion.div>

      {/* Begin — wax seal style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="flex flex-col items-center gap-5"
      >
        {/* Twin threads like WaxSeal */}
        <div className="flex gap-6">
          <motion.div
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-14 bg-gradient-to-b from-amber-200/55 to-amber-200/10"
          />
          <motion.div
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="w-px h-14 bg-gradient-to-b from-amber-200/55 to-amber-200/10"
          />
        </div>

        {/* Seal button */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          onClick={onBegin}
          className="relative"
        >
          <div className="relative w-24 h-24">
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.65, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-amber-300/20 blur-md"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 border border-amber-400/30 shadow-[0_0_40px_rgba(180,100,20,0.4),inset_0_1px_0_rgba(255,200,100,0.2)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-amber-300/20 flex items-center justify-center">
                <span className="text-amber-100/80 text-2xl" style={FONT_SCRIPT}>♡</span>
              </div>
            </div>
            <div className="absolute top-2 left-3 w-4 h-2 bg-amber-200/25 rounded-full blur-sm rotate-[-30deg]" />
          </div>
          <motion.p
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-amber-100/40 text-[10px] tracking-[4px] uppercase whitespace-nowrap"
            style={FONT_BODY}
          >
            tap to open
          </motion.p>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ─── CINEMATIC REVEAL ───────────────────────────────────────────────── */
const REVEAL_SCHEDULE = [
  { id: "eye",    at: 300  },
  { id: "s0-0",   at: 1400 },
  { id: "s0-1",   at: 2500 },
  { id: "s0-2",   at: 3400 },
  { id: "s0-3",   at: 4200 },
  { id: "div0",   at: 5200 },
  { id: "s1-0",   at: 6100 },
  { id: "s1-1",   at: 7000 },
  { id: "s1-2",   at: 7700 },
  { id: "div1",   at: 8600 },
  { id: "s2-0",   at: 9500 },
  { id: "s2-1",   at: 10400 },
  { id: "s2-2",   at: 11300 },
  { id: "div2",   at: 12300 },
  { id: "s3-0",   at: 13200 },
  { id: "s3-1",   at: 14100 },
  { id: "s3-2",   at: 15000 },
  { id: "s3-3",   at: 15900 },
  { id: "div3",   at: 16900 },
  { id: "heart",  at: 17700 },
  { id: "name",   at: 18500 },
  { id: "verse",  at: 19700 },
  { id: "sign",   at: 20900 },
];
const REVEAL_DONE_AT = 22400;

function CinematicReveal({ onComplete }) {
  const [visible, setVisible] = useState(new Set());
  const refs = useRef([]);

  useEffect(() => {
    refs.current.forEach(clearTimeout);
    refs.current = [];

    REVEAL_SCHEDULE.forEach(({ id, at }) => {
      refs.current.push(setTimeout(() => setVisible((p) => new Set([...p, id])), at));
    });
    refs.current.push(setTimeout(onComplete, REVEAL_DONE_AT));
    return () => refs.current.forEach(clearTimeout);
  }, [onComplete]);

  const has = (id) => visible.has(id);

  return (
    <div
      className="relative z-10 flex flex-col items-center justify-start text-center"
      style={{ minHeight: "100vh", maxWidth: 500, margin: "0 auto", padding: "clamp(60px,10vh,100px) 24px" }}
    >
      {/* Eyebrow */}
      <AnimatePresence>
        {has("eye") && (
          <motion.p
            initial={{ opacity: 0, letterSpacing: "2px" }}
            animate={{ opacity: 1, letterSpacing: "9px" }}
            transition={{ duration: 1.5 }}
            className="uppercase text-amber-100/30 text-[10px] mb-10"
            style={{ ...FONT_BODY, letterSpacing: "9px" }}
          >
            for you · only you
          </motion.p>
        )}
      </AnimatePresence>

      {/* Stanza 0 */}
      <div className="flex flex-col items-center" style={{ gap: "0.28em", marginBottom: "0.6em" }}>
        {STANZAS[0].lines.map((line, i) => (
          <PoemLine key={i} text={line} type="verse" visible={has(`s0-${i}`)} />
        ))}
      </div>

      <div style={{ margin: "0.5em 0" }}>
        <OrnamentDivider visible={has("div0")} />
      </div>

      {/* Stanza 1 */}
      <div className="flex flex-col items-center" style={{ gap: "0.28em", marginBottom: "0.6em" }}>
        {STANZAS[1].lines.map((line, i) => (
          <PoemLine key={i} text={line} type="verse" visible={has(`s1-${i}`)} />
        ))}
      </div>

      <div style={{ margin: "0.5em 0" }}>
        <OrnamentDivider visible={has("div1")} />
      </div>

      {/* Stanza 2 */}
      <div className="flex flex-col items-center" style={{ gap: "0.28em", marginBottom: "0.6em" }}>
        {STANZAS[2].lines.map((line, i) => (
          <PoemLine key={i} text={line} type="verse" visible={has(`s2-${i}`)} />
        ))}
      </div>

      <div style={{ margin: "0.5em 0" }}>
        <OrnamentDivider visible={has("div2")} />
      </div>

      {/* Stanza 3 */}
      <div className="flex flex-col items-center" style={{ gap: "0.28em", marginBottom: "0.6em" }}>
        {STANZAS[3].lines.map((line, i) => (
          <PoemLine key={i} text={line} type="verse" visible={has(`s3-${i}`)} />
        ))}
      </div>

      <div style={{ margin: "0.6em 0" }}>
        <OrnamentDivider visible={has("div3")} />
      </div>

      {/* Heart */}
      <AnimatePresence>
        {has("heart") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ margin: "0.6em 0" }}
          >
            <PulsingHeart size={44} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Closing */}
      <div className="flex flex-col items-center" style={{ gap: "0.15em" }}>
        <PoemLine text={CLOSING.name}  type="name"  visible={has("name")}  />
        <PoemLine text={CLOSING.verse} type="sub"   visible={has("verse")} />
        <PoemLine text={CLOSING.sign}  type="sign"  visible={has("sign")}  />
      </div>
    </div>
  );
}



/* ─── FINAL FRAME ────────────────────────────────────────────────────── */
function FinalFrame({ onReplay }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.2, ease: "easeIn" }}
      className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6"
      style={{ maxWidth: 500, margin: "0 auto", paddingBlock: "80px", gap: "clamp(14px, 3vh, 24px)" }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, letterSpacing: "2px" }}
        animate={{ opacity: 1, letterSpacing: "10px" }}
        transition={{ duration: 1.6, delay: 0.3 }}
        className="uppercase text-amber-100/25 text-[10px]"
        style={{ ...FONT_BODY, letterSpacing: "10px" }}
      >
        The End · The Beginning
      </motion.p>

      <OrnamentDivider delay={0.6} />

      {/* All stanzas together */}
      <div className="flex flex-col items-center" style={{ gap: "0.28em" }}>
        {STANZAS[0].lines.map((l, i) => <PoemLine key={i} text={l} type="verse" delay={0.05 * i} />)}
      </div>

      <OrnamentDivider delay={0.4} />

      <div className="flex flex-col items-center" style={{ gap: "0.28em" }}>
        {STANZAS[1].lines.map((l, i) => <PoemLine key={i} text={l} type="verse" delay={0.1 + 0.05 * i} />)}
      </div>

      <OrnamentDivider delay={0.5} />

      <div className="flex flex-col items-center" style={{ gap: "0.28em" }}>
        {STANZAS[2].lines.map((l, i) => <PoemLine key={i} text={l} type="verse" delay={0.15 + 0.05 * i} />)}
      </div>

      <OrnamentDivider delay={0.6} />

      <div className="flex flex-col items-center" style={{ gap: "0.28em" }}>
        {STANZAS[3].lines.map((l, i) => <PoemLine key={i} text={l} type="verse" delay={0.2 + 0.05 * i} />)}
      </div>

      {/* Central heart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <PulsingHeart size={46} />
      </motion.div>

      {/* Closing block */}
      <div className="flex flex-col items-center" style={{ gap: "0.12em" }}>
        <PoemLine text={CLOSING.name}  type="name"  delay={1.2} />
        <PoemLine text={CLOSING.verse} type="sub"   delay={1.7} />
        <PoemLine text={CLOSING.sign}  type="sign"  delay={2.2} />
      </div>

      <OrnamentDivider delay={2.6} />

      {/* Buttons Container */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 3.2 }}
        className="flex gap-4 flex-wrap justify-center w-full"
      >
        {/* Read Again button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={onReplay}
          className="relative flex items-center justify-center overflow-hidden cursor-pointer"
          style={{
            width: "clamp(180px, 50vw, 215px)",
            height: "52px",
            borderRadius: "2px",
            border: "1px solid rgba(220,190,130,0.28)",
            background: "linear-gradient(135deg, rgba(60,35,8,0.45), rgba(30,15,3,0.65))",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,200,100,0.06)",
            backdropFilter: "blur(8px)",
          }}
        >
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
          <span
            className="relative text-amber-50/90 uppercase"
            style={{ ...FONT_BODY, fontSize: "10px", letterSpacing: "5px", fontWeight: 600 }}
          >
            Read Again
          </span>
        </motion.button>

        {/* End Journey Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/end")}
          className="relative flex items-center justify-center overflow-hidden cursor-pointer"
          style={{
            width: "clamp(180px, 50vw, 215px)",
            height: "52px",
            borderRadius: "2px",
            border: "1px solid rgba(255,190,100,0.45)",
            background: "linear-gradient(135deg, rgba(140,80,20,0.6), rgba(80,40,10,0.8))",
            boxShadow: "0 0 35px rgba(255,180,80,0.25), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,150,0.25)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            animate={{ x: ["-120%", "220%"] }}
            transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 skew-x-12"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,220,150,0.2), transparent)" }}
          />
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-30">
            <div className="flex-1 h-px bg-amber-200" />
            <span className="text-amber-200 text-[8px]">✦</span>
            <div className="flex-1 h-px bg-amber-200" />
          </div>
          <span
            className="relative text-amber-50/90 uppercase"
            style={{ ...FONT_BODY, fontSize: "10px", letterSpacing: "5px", fontWeight: 600 }}
          >
            End Journey
          </span>
        </motion.button>
      </motion.div>


    </motion.div>
  );
}

/* ─── SECTION ROOT ───────────────────────────────────────────────────── */
function FinalSection() {
  const [phase, setPhase] = useState("opening"); // opening | reveal | final
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const blobX  = useTransform(mouseX, [0, 1], [-14, 14]);
  const blobY  = useTransform(mouseY, [0, 1], [-9,   9]);

  const handleMouseMove = useCallback((e) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  }, [mouseX, mouseY]);

  return (
    <section
      className="relative min-h-screen bg-[#0f0b07] overflow-hidden layer-isolated"
      onMouseMove={handleMouseMove}
    >
      {/* ── Ambient blobs (exact letter section values) ── */}
      <motion.div
        style={{ x: blobX, y: blobY }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.15, 0.07] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-amber-200/10 blur-[160px] rounded-full pointer-events-none glow-stabilized gpu-accelerated"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-orange-300/10 blur-[140px] rounded-full pointer-events-none glow-stabilized gpu-accelerated"
      />

      {/* ── Atmosphere ── */}
      <StarField />
      <BokehOrbs />
      <GoldFlecks />
      <DustParticles />

      {/* ── Hairline borders (exact letter section) ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

      {/* ── Side labels (exact letter section) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="hidden md:flex flex-col items-center gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>written</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>with love</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="hidden md:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>forever</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>yours</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      {/* ── Radial vignette (exact letter section) ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,200,100,0.04),transparent_65%)] pointer-events-none" />

      {/* ── Phase views ── */}
      <AnimatePresence mode="wait">

        {phase === "opening" && (
          <motion.div
            key="opening"
            exit={{ opacity: 0, scale: 0.85, y: -40 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <OpeningCard onBegin={() => setPhase("reveal")} />
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.95, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, filter: "blur(4px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <CinematicReveal onComplete={() => setPhase("final")} />
          </motion.div>
        )}

        {phase === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.95, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <FinalFrame onReplay={() => setPhase("opening")} />
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  );
}

export default FinalSection;