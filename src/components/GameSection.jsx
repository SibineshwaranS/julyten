import { useState, useEffect, useRef, useCallback, useMemo, useId } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════════════════════════
   DESIGN TOKENS & STYLING
   ══════════════════════════════════════════════════════════════ */
const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };
const CUP_COLOR   = "#b8860b";
const CUP_LIGHT   = "#e0aa30";
const CUP_DARK    = "#7a5500";

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ══════════════════════════════════════════════════════════════
   AUDIO SYNTHESIZER (WEB AUDIO API)
   Programmatic woody taps, friction slides, and chimes
   ══════════════════════════════════════════════════════════════ */
let audioCtx = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
};

const playSound = (type) => {
  try {
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "grab") {
      // Short woody tap / cup grab clink
      osc.type = "sine";
      osc.frequency.setValueAtTime(550, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.07);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    } else if (type === "slide") {
      // Soft table friction swoosh
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === "place") {
      // Hollow woody thud on placement
      osc.type = "sine";
      osc.frequency.setValueAtTime(190, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === "wrong") {
      // Double buzz / warning note
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(100, audioCtx.currentTime + 0.12);
      osc2.frequency.linearRampToValueAtTime(70, audioCtx.currentTime + 0.27);
      gain2.gain.setValueAtTime(0.08, audioCtx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.27);
      osc2.start(audioCtx.currentTime + 0.12);
      osc2.stop(audioCtx.currentTime + 0.27);
    } else if (type === "win") {
      // Magical birthday chime arpeggio
      const playChime = (freq, delay, dur) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        g.gain.setValueAtTime(0, audioCtx.currentTime + delay);
        g.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + delay + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + dur);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + delay);
        o.stop(audioCtx.currentTime + delay + dur);
      };
      playChime(523.25, 0, 0.4);      // C5
      playChime(659.25, 0.08, 0.4);   // E5
      playChime(783.99, 0.16, 0.4);   // G5
      playChime(1046.50, 0.24, 0.6);  // C6
    }
  } catch (e) {
    console.warn("AudioContext playback blocked/failed:", e);
  }
};

/* ══════════════════════════════════════════════════════════════
   AMBIENT BACKGROUND EFFECTS
   ══════════════════════════════════════════════════════════════ */
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i, x: (i*37+13)%100, y: (i*53+7)%75,
  sz: i%3===0?2.4:i%3===1?1.5:1,
  dur: 1.6+(i%5)*0.38, del: (i*0.19)%3.2,
}));

function StarField() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {STARS.map(s=>(
        <motion.div key={s.id} className="absolute rounded-full"
          style={{left:`${s.x}%`,top:`${s.y}%`,width:s.sz,height:s.sz,background:"rgba(253,230,138,0.8)"}}
          animate={{opacity:[0.08,0.7,0.08]}}
          transition={{duration:s.dur,repeat:Infinity,delay:s.del,ease:"easeInOut"}}
        />
      ))}
    </div>
  );
}

const SP_CHARS  = ["✦","✧","◆","⋆","★","❋","✺","❂"];
const SP_COLORS = ["#fbbf24","#f59e0b","#fcd34d","#fde68a","#fb923c","#fff7a0","#fca5a5","#fdba74"];

function Sparkles({ active }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!active) return;
    const newSparkles = Array.from({ length: 44 }, (_, i) => ({
      id: Date.now() + i,
      x: 4 + Math.random() * 92,
      y: 4 + Math.random() * 80,
      ch: SP_CHARS[i % SP_CHARS.length],
      col: SP_COLORS[i % SP_COLORS.length],
      sz: 12 + Math.random() * 24,
      del: i * 0.05,
    }));
    const t1 = setTimeout(() => {
      setItems(newSparkles);
    }, 0);
    const t2 = setTimeout(() => setItems([]), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <AnimatePresence>
        {items.map(s=>(
          <motion.span key={s.id}
            initial={{scale:0,opacity:1,x:`${s.x}vw`,y:`${s.y}vh`}}
            animate={{scale:[0,1.9,0],opacity:[1,1,0],rotate:300,y:`${s.y-26}vh`}}
            exit={{opacity:0}}
            transition={{duration:1.15,delay:s.del,ease:"easeOut"}}
            style={{position:"absolute",color:s.col,fontSize:s.sz,lineHeight:1}}
          >{s.ch}</motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({length:8},(_,i)=>({id:i,x:8+i*12,delay:i*0.7,dur:3.2+i*0.45})).map(p=>(
        <motion.div key={p.id}
          style={{position:"absolute",left:`${p.x}%`,bottom:"12%",width:3,height:3,borderRadius:"50%",background:"rgba(251,191,36,0.32)",boxShadow:"0 0 6px rgba(251,191,36,0.5)"}}
          animate={{y:[0,-90,0],opacity:[0,0.8,0],scale:[0.5,1.3,0.5]}}
          transition={{duration:p.dur,delay:p.delay,repeat:Infinity,ease:"easeInOut"}}
        />
      ))}
    </div>
  );
}

function FloatingRosePetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const seed1 = i * 123.45;
      const seed2 = i * 678.90;
      const seed3 = i * 345.67;
      const seed4 = i * 890.12;
      
      const r1 = (Math.sin(seed1) * 10000) % 1;
      const r2 = (Math.sin(seed2) * 10000) % 1;
      const r3 = (Math.sin(seed3) * 10000) % 1;
      const r4 = (Math.sin(seed4) * 10000) % 1;
      
      const val1 = r1 < 0 ? r1 + 1 : r1;
      const val2 = r2 < 0 ? r2 + 1 : r2;
      const val3 = r3 < 0 ? r3 + 1 : r3;
      const val4 = r4 < 0 ? r4 + 1 : r4;

      return {
        id: i,
        x: val1 * 100,
        y: -20,
        size: val2 * 14 + 10,
        dur: val3 * 8 + 8,
        delay: val4 * 6,
        rotateStart: val1 * 360,
        swayX: val2 * 40 + 20,
        swaySign: val3 > 0.5 ? 1 : -1,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-15">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute gpu-accelerated"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, p.swayX * p.swaySign, 0],
            rotate: [p.rotateStart, p.rotateStart + 180, p.rotateStart + 360],
            rotateX: [0, 180, 360],
            rotateY: [0, 360, 720],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 20 20" className="w-full h-full filter drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
            <path
              d="M10,0 C15,-4 20,4 16,12 C13,17 7,17 4,12 C0,4 5,-4 10,0 Z"
              fill="url(#rosePetalGrad)"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PREMIUM HEART SVG
   ══════════════════════════════════════════════════════════════ */
function HeartSVG({ size=36, glow=false, pulse=false }) {
  const uid = useId().replace(/:/g, "_");
  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.15, 0.98, 1.15, 1] } : {}}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <svg
        viewBox="0 0 100 90"
        width={size}
        height={size * 90 / 100}
        style={glow ? {
          filter: `drop-shadow(0 0 12px #ff3366) drop-shadow(0 0 28px rgba(255,51,102,0.65)) drop-shadow(0 0 50px rgba(255,51,102,0.3))`
        } : {}}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`hg1_${uid}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fff0f5" />
            <stop offset="12%" stopColor="#ffb3c6" />
            <stop offset="30%" stopColor="#ff4d6d" />
            <stop offset="65%" stopColor="#c9184a" />
            <stop offset="90%" stopColor="#800f2f" />
            <stop offset="100%" stopColor="#3d000f" />
          </radialGradient>

          <linearGradient id={`hg2_${uid}`} x1="0%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          <radialGradient id={`hg3_${uid}`} cx="60%" cy="80%" r="40%">
            <stop offset="0%" stopColor="rgba(255,182,193,0.35)" />
            <stop offset="100%" stopColor="rgba(255,182,193,0)" />
          </radialGradient>

          <filter id={`hblur_${uid}`}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        <path
          d="M 50 88 C 50 88 5 56 5 28 C 5 12 18 2 32 2 C 41 2 47 7 50 12 C 53 7 59 2 68 2 C 82 2 95 12 95 28 C 95 56 50 88 50 88 Z"
          fill="rgba(0,0,0,0.4)"
          filter={`url(#hblur_${uid})`}
          transform="translate(2, 5) scale(0.96)"
        />

        <path
          d="M 50 88 C 50 88 5 56 5 28 C 5 12 18 2 32 2 C 41 2 47 7 50 12 C 53 7 59 2 68 2 C 82 2 95 12 95 28 C 95 56 50 88 50 88 Z"
          fill={`url(#hg1_${uid})`}
        />

        <path
          d="M 50 88 C 50 88 5 56 5 28 C 5 12 18 2 32 2 C 41 2 47 7 50 12 C 53 7 59 2 68 2 C 82 2 95 12 95 28 C 95 56 50 88 50 88 Z"
          fill={`url(#hg3_${uid})`}
        />

        <path
          d="M 12 28 C 12 18 22 10 32 10 C 36 10 40 12 43 15 C 33 17 22 25 18 38 C 15 37 13 33 12 28 Z"
          fill={`url(#hg2_${uid})`}
        />

        <circle cx="30" cy="22" r="5" fill="rgba(255,255,255,0.4)" />
        <circle cx="28" cy="20" r="2" fill="#ffffff" />
      </svg>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CUP SVG
   ══════════════════════════════════════════════════════════════ */
function CupSVG({ size=96 }) {
  return (
    <svg viewBox="0 0 90 112" width={size} height={size*112/90}
      style={{filter:`drop-shadow(0 14px 28px rgba(0,0,0,0.75)) drop-shadow(0 2px 6px rgba(74,50,0,0.35))`}}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cupbody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={CUP_DARK}/>
          <stop offset="22%"  stopColor={CUP_COLOR}/>
          <stop offset="50%"  stopColor={CUP_LIGHT}/>
          <stop offset="78%"  stopColor={CUP_COLOR}/>
          <stop offset="100%" stopColor={CUP_DARK}/>
        </linearGradient>
        <linearGradient id="cuprim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={CUP_LIGHT}/>
          <stop offset="50%"  stopColor={CUP_COLOR}/>
          <stop offset="100%" stopColor={CUP_DARK}/>
        </linearGradient>
        <linearGradient id="cupbase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={CUP_COLOR}/>
          <stop offset="100%" stopColor={CUP_DARK}/>
        </linearGradient>
      </defs>
      <ellipse cx="45" cy="104" rx="28" ry="6" fill="url(#cupbase)"/>
      <ellipse cx="45" cy="102" rx="28" ry="5" fill={CUP_LIGHT} opacity="0.15"/>
      <rect x="39" y="84" width="12" height="20" rx="4" fill="url(#cupbody)"/>
      <ellipse cx="45" cy="87" rx="10" ry="5" fill="url(#cuprim)"/>
      <path d="M14,18 L8,80 Q8,85 14,85 L76,85 Q82,85 82,80 L76,18 Z" fill="url(#cupbody)"/>
      <path d="M22,20 L17,78 L26,78 L31,20Z" fill="rgba(255,255,255,0.11)"/>
      <path d="M58,20 L62,78 L56,78 L52,24Z" fill="rgba(255,255,255,0.05)"/>
      <rect x="9" y="9" width="72" height="14" rx="7" fill="url(#cuprim)"/>
      <ellipse cx="45" cy="16" rx="28" ry="4" fill="rgba(0,0,0,0.22)"/>
      <rect x="14" y="10" width="62" height="5" rx="3" fill="rgba(255,255,255,0.30)"/>
      <ellipse cx="45" cy="83" rx="24" ry="3" fill="rgba(255,255,255,0.07)"/>
      <path d="M37,48 L45,38 L53,48 L45,58Z" stroke="rgba(255,220,100,0.22)" strokeWidth="1" fill="rgba(255,220,100,0.06)"/>
      <line x1="20" y1="65" x2="70" y2="65" stroke="rgba(255,220,100,0.15)" strokeWidth="0.8"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   LIT FLICKERING CANDLE COMPONENTS
   ══════════════════════════════════════════════════════════════ */
function CandleFlame({ index }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ bottom: "100%", left: "50%", translateX: "-50%", transformOrigin: "bottom center" }}
    >
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
    </div>
  );
}

function Candle({ className }) {
  const c1 = "#faf6ec";
  const c2 = "#ebd7ab";
  return (
    <div className={`relative flex flex-col items-center ${className}`} style={{ width: 18 }}>
      <div className="relative" style={{ height: 24 }}>
        <CandleFlame index={0} />
      </div>
      <div
        style={{
          width: 2,
          height: 7,
          background: "#4a3820",
          borderRadius: "1px 1px 0 0",
          zIndex: 2,
          position: "relative",
        }}
      />
      <div
        style={{
          width: 14,
          height: 48,
          background: `linear-gradient(to right, ${c2} 0%, ${c1} 40%, rgba(255,255,255,0.3) 55%, ${c1} 70%, ${c2} 100%)`,
          borderRadius: "3px 3px 2px 2px",
          position: "relative",
          boxShadow: `0 0 8px ${c1}88, 0 0 20px ${c1}44, inset 1px 0 0 rgba(255,255,255,0.2)`,
        }}
      >
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

/* ══════════════════════════════════════════════════════════════
   CUP SHADOW & CUP ITEM COMPONENTS (COMPLY WITH RULES OF HOOKS)
   ══════════════════════════════════════════════════════════════ */
function CupShadow({ cupY, cupX }) {
  const shadowScale = useTransform(cupY, [0, 96], [1, 1.4]);
  const shadowOpacity = useTransform(cupY, [0, 96], [0.55, 0.12]);
  const shadowBlur = useTransform(cupY, [0, 96], ["blur(1.5px)", "blur(6px)"]);
  return (
    <motion.div
      style={{
        position: "absolute",
        bottom: 112,
        left: "50%",
        marginLeft: -35,
        x: cupX,
        scale: shadowScale,
        opacity: shadowOpacity,
        filter: shadowBlur,
        width: 70,
        height: 12,
        background: "rgba(0,0,0,0.65)",
        borderRadius: "50%",
        zIndex: 4,
      }}
    />
  );
}

function NextChapterButton({ onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        padding: "12px 40px",
        borderRadius: "3px",
        border: "1px solid rgba(255,190,100,0.45)",
        background: "linear-gradient(135deg, rgba(140,80,20,0.72), rgba(80,40,10,0.9))",
        boxShadow: "0 0 35px rgba(255,180,80,0.25), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,150,0.25)",
        backdropFilter: "blur(8px)",
        cursor: "pointer",
      }}
    >
      <motion.div
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
        className="absolute inset-0 skew-x-12"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,220,150,0.2), transparent)" }}
      />
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-amber-200/28" style={{ width: 12 }} />
        <span
          style={{
            ...FONT_BODY,
            color: "rgba(253,230,138,0.92)",
            fontSize: 10,
            letterSpacing: "6px",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Next Chapter
        </span>
        <div className="flex-1 h-px bg-amber-200/28" style={{ width: 12 }} />
      </div>
    </motion.button>
  );
}

function CupItem({
  cupX,
  cupY,
  cupRotate,
  cupScale,
  cupZ,
  phase,
  onChoose
}) {
  const yTranslate = useTransform(cupY, y => -y);
  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 94,
        height: 112,
        x: cupX,
        y: yTranslate,
        rotate: cupRotate,
        scale: cupScale,
        zIndex: cupZ,
        cursor: phase === "choosing" ? "pointer" : "default",
        userSelect: "none",
      }}
      onClick={phase === "choosing" ? onChoose : undefined}
    >
      {phase === "choosing" && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            border: "2px solid rgba(251,191,36,0.6)",
            pointerEvents: "none"
          }}
        />
      )}
      <CupSVG size={94} />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   HIGH-REALISM TEDDY BEAR HOST (WITH BEZIER KINEMATICS)
   ══════════════════════════════════════════════════════════════ */
function TeddyBear({ 
  leftPawX, 
  leftPawY, 
  rightPawX, 
  rightPawY, 
  headX, 
  headRotate, 
  mouthType, 
  isBlinking, 
  bodyBob=false, 
  excited=false, 
  love=false 
}) {
  const eyeScale = isBlinking ? 0.15 : 1;

  // Left arm Bezier path
  const leftArmD = useTransform(
    [leftPawX, leftPawY],
    ([px, py]) => {
      const sx = 68; // Left shoulder X
      const sy = 168; // Left shoulder Y
      const cx = Math.min(sx, px) - 40; // control point (bends elbow outward)
      const cy = (sy + py) / 2 + 10;
      return `M ${sx} ${sy} Q ${cx} ${cy} ${px} ${py}`;
    }
  );

  // Right arm Bezier path
  const rightArmD = useTransform(
    [rightPawX, rightPawY],
    ([px, py]) => {
      const sx = 202; // Right shoulder X
      const sy = 168; // Right shoulder Y
      const cx = Math.max(sx, px) + 40; // control point (bends elbow outward)
      const cy = (sy + py) / 2 + 10;
      return `M ${sx} ${sy} Q ${cx} ${cy} ${px} ${py}`;
    }
  );

  // Body bob offsets
  const bodyYVal = excited 
    ? [0, -12, 0] 
    : love 
    ? [0, -7, 0] 
    : bodyBob 
    ? [0, -7, 0, -4, 0] 
    : [0, -3, 0];

  const bodyTransition = excited
    ? { duration: 0.44, repeat: Infinity, ease: "easeInOut" }
    : love
    ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
    : bodyBob
    ? { duration: 0.44, repeat: Infinity, ease: "easeInOut" }
    : { duration: 3.5, repeat: Infinity, ease: "easeInOut" };

  return (
    <motion.div
      animate={{ y: bodyYVal }}
      transition={bodyTransition}
      style={{ position: "relative", width: 270, height: 320 }}
    >
      <svg viewBox="0 0 270 320" width="270" height="320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="fur_b" cx="38%" cy="32%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.22)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.32)"/>
          </radialGradient>
          <radialGradient id="fur_h" cx="40%" cy="28%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.25)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0.28)"/>
          </radialGradient>
          <radialGradient id="belly_g" cx="50%" cy="40%">
            <stop offset="0%"   stopColor="#f0b870"/>
            <stop offset="100%" stopColor="#cc8840"/>
          </radialGradient>
          <radialGradient id="nose_g" cx="40%" cy="30%">
            <stop offset="0%"   stopColor="#3a1a22"/>
            <stop offset="100%" stopColor="#0a0408"/>
          </radialGradient>
          <radialGradient id="cheek_g" cx="50%" cy="50%">
            <stop offset="0%"   stopColor="rgba(230,100,100,0.45)"/>
            <stop offset="100%" stopColor="rgba(230,100,100,0)"/>
          </radialGradient>
        </defs>

        {/* ── BODY ── */}
        <ellipse cx="135" cy="218" rx="78" ry="90" fill="#c4834a"/>
        <ellipse cx="135" cy="218" rx="78" ry="90" fill="url(#fur_b)" opacity="0.42"/>
        <ellipse cx="135" cy="230" rx="50" ry="54" fill="url(#belly_g)"/>
        <circle  cx="135" cy="258" r="5" fill="rgba(0,0,0,0.14)"/>

        {/* ── LEGS ── */}
        <ellipse cx="96"  cy="292" rx="28" ry="18" fill="#b07038"/>
        <ellipse cx="88"  cy="304" rx="24" ry="13" fill="#c4834a"/>
        <ellipse cx="82"  cy="308" rx="12" ry="6"  fill="#a06030"/>
        <ellipse cx="95"  cy="312" rx="12" ry="6"  fill="#a06030"/>
        <ellipse cx="108" cy="310" rx="10" ry="5"  fill="#a06030"/>
        <ellipse cx="174" cy="292" rx="28" ry="18" fill="#b07038"/>
        <ellipse cx="182" cy="304" rx="24" ry="13" fill="#c4834a"/>
        <ellipse cx="188" cy="308" rx="12" ry="6"  fill="#a06030"/>
        <ellipse cx="175" cy="312" rx="12" ry="6"  fill="#a06030"/>
        <ellipse cx="162" cy="310" rx="10" ry="5"  fill="#a06030"/>

        {/* ── NECK ── */}
        <ellipse cx="135" cy="146" rx="37" ry="17" fill="#c4834a"/>

        {/* ── HEAD GROUP (HeadX and HeadRotate) ── */}
        <motion.g style={{ x: headX, rotate: headRotate, transformOrigin: "135px 146px" }}>
          {/* Ears */}
          <circle cx="72"  cy="52" r="29" fill="#b07038"/>
          <circle cx="72"  cy="52" r="19" fill="#d49060"/>
          <circle cx="72"  cy="52" r="10" fill="#c07848" opacity="0.55"/>
          <circle cx="198" cy="52" r="29" fill="#b07038"/>
          <circle cx="198" cy="52" r="19" fill="#d49060"/>
          <circle cx="198" cy="52" r="10" fill="#c07848" opacity="0.55"/>

          {/* Head Base */}
          <circle cx="135" cy="108" r="72" fill="#c4834a"/>
          <circle cx="135" cy="108" r="72" fill="url(#fur_h)" opacity="0.36"/>

          {/* Rosy Cheeks */}
          <ellipse cx="92"  cy="118" rx="19" ry="15" fill="url(#cheek_g)"/>
          <ellipse cx="178" cy="118" rx="19" ry="15" fill="url(#cheek_g)"/>

          {/* Muzzle */}
          <ellipse cx="135" cy="124" rx="42" ry="31" fill="#d49060" opacity="0.7"/>

          {/* Eyes (Blinking scale) */}
          <g transform="translate(108, 94)">
            <motion.g style={{ scaleY: eyeScale, transformOrigin: "0px 0px" }}>
              <circle cx="0" cy="0" r="13" fill="#120808"/>
              <circle cx="0" cy="0" r="9"  fill="#1e0c14"/>
              <circle cx="4" cy="-4" r="4.5" fill="#fff" opacity="0.9"/>
              <circle cx="-2" cy="5" r="2.2" fill="#fff" opacity="0.38"/>
            </motion.g>
          </g>
          <g transform="translate(162, 94)">
            <motion.g style={{ scaleY: eyeScale, transformOrigin: "0px 0px" }}>
              <circle cx="0" cy="0" r="13" fill="#120808"/>
              <circle cx="0" cy="0" r="9"  fill="#1e0c14"/>
              <circle cx="4" cy="-4" r="4.5" fill="#fff" opacity="0.9"/>
              <circle cx="-2" cy="5" r="2.2" fill="#fff" opacity="0.38"/>
            </motion.g>
          </g>

          {/* Nose */}
          <ellipse cx="135" cy="118" rx="13" ry="9" fill="url(#nose_g)"/>
          <ellipse cx="133" cy="116" rx="5"  ry="3.2" fill="#4d2a3a" opacity="0.55"/>

          {/* Mischievous Smile Morphing */}
          <path 
            d={
              mouthType === "excited"
                ? "M120 128 Q135 144 150 128"
                : mouthType === "smirk"
                ? "M118 126 Q122 134 134 122" // playful smirk
                : "M122 128 Q135 138 148 128" // default happy smile
            }
            stroke="#120808" 
            strokeWidth="2.8" 
            fill="none" 
            strokeLinecap="round"
          />
          <path d="M135 128 L135 135" stroke="#120808" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </motion.g>

        {/* Bow tie */}
        <polygon points="108,155 124,162 108,169" fill="#b8294a"/>
        <polygon points="162,155 146,162 162,169" fill="#b8294a"/>
        <circle  cx="135" cy="162" r="11" fill="#e03060"/>
        <circle  cx="133" cy="160" r="4.5" fill="rgba(255,180,200,0.36)"/>

        {/* ── LEFT DYNAMIC BEZIER ARM ── */}
        <motion.path
          d={leftArmD}
          fill="none"
          stroke="#b87340"
          strokeWidth="32"
          strokeLinecap="round"
        />
        <motion.path
          d={leftArmD}
          fill="none"
          stroke="url(#fur_b)"
          strokeWidth="32"
          strokeLinecap="round"
          opacity="0.4"
        />
        <motion.g style={{ x: leftPawX, y: leftPawY }}>
          {/* Paw Pad & Claw highlights */}
          <circle cx="0" cy="0" r="18" fill="#b87340" />
          <circle cx="0" cy="0" r="18" fill="url(#fur_b)" opacity="0.4" />
          <ellipse cx="-1.5" cy="3" rx="11" ry="8" fill="#c4834a" />
          <circle cx="-9" cy="-6" r="3.2" fill="#a06030" />
          <circle cx="-1.5" cy="-9.5" r="3.2" fill="#a06030" />
          <circle cx="6" cy="-8" r="3.2" fill="#a06030" />
        </motion.g>

        {/* ── RIGHT DYNAMIC BEZIER ARM ── */}
        <motion.path
          d={rightArmD}
          fill="none"
          stroke="#b87340"
          strokeWidth="32"
          strokeLinecap="round"
        />
        <motion.path
          d={rightArmD}
          fill="none"
          stroke="url(#fur_b)"
          strokeWidth="32"
          strokeLinecap="round"
          opacity="0.4"
        />
        <motion.g style={{ x: rightPawX, y: rightPawY }}>
          {/* Paw Pad & Claw highlights */}
          <circle cx="0" cy="0" r="18" fill="#b87340" />
          <circle cx="0" cy="0" r="18" fill="url(#fur_b)" opacity="0.4" />
          <ellipse cx="1.5" cy="3" rx="11" ry="8" fill="#c4834a" />
          <circle cx="9" cy="-6" r="3.2" fill="#a06030" />
          <circle cx="1.5" cy="-9.5" r="3.2" fill="#a06030" />
          <circle cx="-6" cy="-8" r="3.2" fill="#a06030" />
        </motion.g>

        {/* ── PLUSH HEART HUG (excited win phase) ── */}
        {love && (
          <g transform="translate(108, 175) scale(2.2)" filter="drop-shadow(0 4px 10px rgba(220,20,50,0.6))">
            <path
              d="M12,21.5 C12,21.5 2,14 2,7.2 C2,3 5,0.8 8.5,0.8 C10.5,0.8 11.5,1.8 12,2.5 C12.5,1.8 13.5,0.8 15.5,0.8 C19,0.8 22,3 22,7.2 C22,14 12,21.5 12,21.5 Z"
              fill="#900a18"
            />
            <path
              d="M12,21 C12,21 2.5,13.6 2.5,7.2 C2.5,3.4 5.2,1.2 8.5,1.2 C10.3,1.2 11.4,2.2 12,2.9 C12.6,2.2 13.7,1.2 15.5,1.2 C18.8,1.2 21.5,3.4 21.5,7.2 C21.5,13.6 12,21 12,21 Z"
              fill="#e62e43"
            />
            <path
              d="M5.5,4.5 C4.5,6.5 4.5,9.5 7,11.5"
              stroke="rgba(255,220,220,0.65)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="8" cy="4" r="1.2" fill="#fff" opacity="0.8" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TABLE
   ══════════════════════════════════════════════════════════════ */
function Table() {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pointer-events-none">
      <div style={{
        width:"min(600px,96vw)",height:30,
        background:"linear-gradient(to bottom,#6b3a2a,#4a2219 55%,#3a1810)",
        borderRadius:7,
        boxShadow:"0 10px 36px rgba(0,0,0,0.75),inset 0 1px 0 rgba(255,200,130,0.1)",
        position:"relative",zIndex:2,
        overflow:"hidden",
      }}>
        {[18,42,70,110,150,200,270,360].map(x=>(
          <div key={x} style={{position:"absolute",left:x,top:0,bottom:0,width:1,background:"rgba(0,0,0,0.11)"}}/>
        ))}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(255,220,150,0.08) 0%,transparent 40%)"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",width:"min(500px,83vw)"}}>
        {[0,1].map(i=>(
          <div key={i} style={{width:22,height:72,background:"linear-gradient(to right,#3a1810,#5a2e20,#3a1810)",borderRadius:"0 0 6px 6px",boxShadow:"3px 0 12px rgba(0,0,0,0.5)"}}/>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   VINTAGE BUTTON
   ══════════════════════════════════════════════════════════════ */
function VintageBtn({ children, onClick, accent=false, large=false }) {
  return (
    <motion.button onClick={onClick}
      whileHover={{scale:1.05,y:-2}} whileTap={{scale:0.96}}
      className="relative overflow-hidden"
      style={{
        padding:large?"15px 54px":"12px 40px", borderRadius:3,
        border:accent?"1px solid rgba(251,191,36,0.52)":"1px solid rgba(251,191,36,0.22)",
        background:accent?"linear-gradient(135deg,rgba(130,88,12,0.72),rgba(72,44,5,0.9))":"linear-gradient(135deg,rgba(80,50,8,0.48),rgba(44,24,3,0.68))",
        boxShadow:accent?"0 0 32px rgba(251,191,36,0.22),0 8px 28px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,220,100,0.16)":"0 4px 22px rgba(0,0,0,0.48),inset 0 1px 0 rgba(255,220,100,0.06)",
        backdropFilter:"blur(10px)", cursor:"pointer",
      }}
    >
      <motion.div
        animate={{x:["-130%","230%"]}}
        transition={{duration:3.2,repeat:Infinity,repeatDelay:2.5,ease:"easeInOut"}}
        style={{position:"absolute",inset:0,transform:"skewX(12deg)",background:"linear-gradient(90deg,transparent,rgba(255,220,100,0.17),transparent)"}}
      />
      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-amber-200/28"/>
        <span style={{...FONT_BODY,color:"rgba(253,230,138,0.92)",fontSize:large?12:10,letterSpacing:"6px",textTransform:"uppercase",fontWeight:600}}>
          {children}
        </span>
        <div className="flex-1 h-px bg-amber-200/28"/>
      </div>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════════════
   PHASE PILL
   ══════════════════════════════════════════════════════════════ */
function PhasePill({ text }) {
  return (
    <motion.div
      initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
      style={{padding:"9px 26px",border:"1px solid rgba(251,191,36,0.2)",borderRadius:40,background:"rgba(251,191,36,0.06)",backdropFilter:"blur(10px)",...FONT_BODY,color:"rgba(253,230,138,0.75)",fontSize:13,letterSpacing:"1px"}}
    >{text}</motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   I ♡ U FINAL SCREEN
   ══════════════════════════════════════════════════════════════ */
function ILUReveal({ onReplay, onNext }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.9}}
      className="flex flex-col items-center gap-7 px-4">
      <motion.p
        initial={{opacity:0,letterSpacing:"2px"}} animate={{opacity:1,letterSpacing:"12px"}}
        transition={{duration:1.5,delay:0.2}}
        style={{...FONT_BODY,color:"rgba(253,230,138,0.38)",fontSize:10,textTransform:"uppercase"}}
      >A message for You</motion.p>

      <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:1,delay:0.4}}
        style={{width:160,height:1,background:"linear-gradient(to right,transparent,rgba(251,191,36,0.35),transparent)"}}/>

      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6}}
        style={{...FONT_SCRIPT,color:"rgba(253,230,138,0.85)",fontSize:32,fontStyle:"italic",textAlign:"center",lineHeight:1.4,maxWidth:480}}>
        "You found my heart because you already own it ❤️"
      </motion.p>

      <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:1,delay:0.8}}
        style={{width:160,height:1,background:"linear-gradient(to right,transparent,rgba(251,191,36,0.35),transparent)"}}/>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.0}}
        className="flex items-center gap-4 flex-wrap justify-center"
        style={{marginTop:10}}
      >
        <VintageBtn onClick={onReplay}>Play Again ✦</VintageBtn>
        <NextChapterButton onClick={onNext} />
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN GAME SHUFFLE TIMINGS & VALUES
   ══════════════════════════════════════════════════════════════ */
const CUP_GAP = 130; // Spacing in px

// 6 swaps sequence that lands slots back to [0,1,2] at the end
const SHUFFLE_SEQ = [
  { a: 0, b: 1, dur: 650 }, // Left & Center
  { a: 1, b: 2, dur: 520 }, // Center & Right
  { a: 0, b: 2, dur: 440 }, // Left & Right
  { a: 0, b: 1, dur: 550 }, // Left & Center
  { a: 1, b: 2, dur: 380 }, // Center & Right
  { a: 0, b: 2, dur: 480 }, // Left & Right
];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function GameSection() {
  const navigate = useNavigate();
  const [slots,    setSlots]    = useState([0,1,2]); // slots[visualSlot] = logicalIndex (0=I, 1=Heart, 2=U)
  const [phase,    setPhase]    = useState("intro");
  const [hearts,   setHearts]   = useState([false,false,false]);
  const [letters,  setLetters]  = useState([null,null,null]);
  const [sparkle,  setSparkle]  = useState(false);

  // Mischievous smirk or neutral expressions
  const [mouthType, setMouthType] = useState("smirk");
  const [isBlinking, setIsBlinking] = useState(false);

  // Teddy animation state
  const [bodyBob,  setBodyBob]  = useState(false);
  const [excited,  setExcited]  = useState(false);
  const [love,     setLove]     = useState(false);

  const abortRef   = useRef(false);
  const slotsRef   = useRef([0,1,2]);

  // Motion Values for paws
  const leftPawX = useMotionValue(48);
  const leftPawY = useMotionValue(240);
  const rightPawX = useMotionValue(222);
  const rightPawY = useMotionValue(240);

  // Motion Values for Head tracking
  const headX = useMotionValue(0);
  const headRotate = useMotionValue(0);

  // Motion Values for absolute Cup slots
  const cupX0 = useMotionValue(-CUP_GAP);
  const cupY0 = useMotionValue(0);
  const cupScale0 = useMotionValue(1);
  const cupRotate0 = useMotionValue(0);
  const cupZ0 = useMotionValue(10);

  const cupX1 = useMotionValue(0);
  const cupY1 = useMotionValue(0);
  const cupScale1 = useMotionValue(1);
  const cupRotate1 = useMotionValue(0);
  const cupZ1 = useMotionValue(10);

  const cupX2 = useMotionValue(CUP_GAP);
  const cupY2 = useMotionValue(0);
  const cupScale2 = useMotionValue(1);
  const cupRotate2 = useMotionValue(0);
  const cupZ2 = useMotionValue(10);

  const cupXs = [cupX0, cupX1, cupX2];
  const cupYs = [cupY0, cupY1, cupY2];
  const cupScales = [cupScale0, cupScale1, cupScale2];
  const cupRotates = [cupRotate0, cupRotate1, cupRotate2];
  const cupZs = [cupZ0, cupZ1, cupZ2];

  useEffect(()=>{ slotsRef.current=slots; },[slots]);

  // Blinking loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 3200 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const resetAll = useCallback(()=>{
    abortRef.current=true;
    setTimeout(()=>{
      abortRef.current=false;
      setSlots([0,1,2]); 
      setPhase("intro");
      setHearts([false,false,false]); 
      setLetters([null,null,null]);
      setSparkle(false);
      setMouthType("smirk");
      setBodyBob(false); 
      setExcited(false); 
      setLove(false);

      // Reset motion values
      leftPawX.set(48);
      leftPawY.set(240);
      rightPawX.set(222);
      rightPawY.set(240);
      headX.set(0);
      headRotate.set(0);

      cupX0.set(-CUP_GAP); cupY0.set(0); cupScale0.set(1); cupRotate0.set(0); cupZ0.set(10);
      cupX1.set(0);        cupY1.set(0); cupScale1.set(1); cupRotate1.set(0); cupZ1.set(10);
      cupX2.set(CUP_GAP);  cupY2.set(0); cupScale2.set(1); cupRotate2.set(0); cupZ2.set(10);
    }, 80);
  }, []); // eslint-disable-line

  /* ─── SHUFFLE: 100% hand-driven grabs, slides, curves, tilts, and thuds ─── */
  const runShuffle = useCallback(async()=>{
    for(let i=0; i<SHUFFLE_SEQ.length; i++) {
      if(abortRef.current) return;

      const { a, b, dur } = SHUFFLE_SEQ[i];

      // visual X coords of slots:
      const xA_svg = 135 + (a - 1) * CUP_GAP;
      const xB_svg = 135 + (b - 1) * CUP_GAP;

      // Head tilts toward the center of the swap
      const midX_svg = (xA_svg + xB_svg) / 2;
      const lookAngle = a === 0 && b === 2 ? 0 : a === 0 ? -6 : 6;
      const lookX = (midX_svg - 135) * 0.15;

      // 1. Hands reach and grab cups
      playSound("grab");
      const reachL_X = animate(leftPawX, xA_svg, { duration: 0.22, ease: "easeOut" });
      const reachL_Y = animate(leftPawY, 200, { duration: 0.22, ease: "easeOut" });
      const reachR_X = animate(rightPawX, xB_svg, { duration: 0.22, ease: "easeOut" });
      const reachR_Y = animate(rightPawY, 200, { duration: 0.22, ease: "easeOut" });
      const headMoveX = animate(headX, lookX, { duration: 0.22, ease: "easeOut" });
      const headMoveR = animate(headRotate, lookAngle, { duration: 0.22, ease: "easeOut" });

      await Promise.all([reachL_X, reachL_Y, reachR_X, reachR_Y, headMoveX, headMoveR]);
      if(abortRef.current) return;

      // 2. Slide/swap along physical 3D arcs
      playSound("slide");
      const xA_end = (b - 1) * CUP_GAP;
      const xB_end = (a - 1) * CUP_GAP;

      const leftPawX_end = xB_svg;
      const rightPawX_end = xA_svg;

      // Swap arcs: left hand arches forward (larger scale, Y goes up/negative)
      // right hand pushes backward (smaller scale, Y goes down/positive)
      const arcHeight = 26;
      const rotateL = [0, 8, -4, 0];
      const rotateR = [0, -8, 4, 0];

      // z-index adjustment (A forward, B backward)
      cupZs[a].set(15);
      cupZs[b].set(5);

      // Cup A crossover
      const cupA_X = animate(cupXs[a], xA_end, { duration: dur/1000, ease: "easeInOut" });
      const cupA_Y = animate(cupYs[a], [0, arcHeight, 0], { duration: dur/1000, ease: "easeInOut" });
      const cupA_R = animate(cupRotates[a], rotateL, { duration: dur/1000, ease: "easeInOut" });
      const cupA_S = animate(cupScales[a], [1, 1.08, 1], { duration: dur/1000, ease: "easeInOut" });
      const handL_X = animate(leftPawX, leftPawX_end, { duration: dur/1000, ease: "easeInOut" });
      const handL_Y = animate(leftPawY, [200, 200 - arcHeight, 200], { duration: dur/1000, ease: "easeInOut" });

      // Cup B crossover
      const cupB_X = animate(cupXs[b], xB_end, { duration: dur/1000, ease: "easeInOut" });
      const cupB_Y = animate(cupYs[b], [0, -arcHeight/2, 0], { duration: dur/1000, ease: "easeInOut" });
      const cupB_R = animate(cupRotates[b], rotateR, { duration: dur/1000, ease: "easeInOut" });
      const cupB_S = animate(cupScales[b], [1, 0.92, 1], { duration: dur/1000, ease: "easeInOut" });
      const handR_X = animate(rightPawX, rightPawX_end, { duration: dur/1000, ease: "easeInOut" });
      const handR_Y = animate(rightPawY, [200, 200 + arcHeight/2, 200], { duration: dur/1000, ease: "easeInOut" });

      // Head sways
      const headSway = animate(headX, [-lookX, lookX], { duration: dur/1000, ease: "easeInOut" });

      await Promise.all([
        cupA_X, cupA_Y, cupA_R, cupA_S, handL_X, handL_Y,
        cupB_X, cupB_Y, cupB_R, cupB_S, handR_X, handR_Y,
        headSway
      ]);
      if(abortRef.current) return;

      playSound("place");

      // Commit swap state
      setSlots(prev => {
        const n = [...prev];
        [n[a], n[b]] = [n[b], n[a]];
        return n;
      });

      // Synchronously reset relative coordinates (domestic slot coordinates update in state)
      cupXs[a].set((a - 1) * CUP_GAP);
      cupXs[b].set((b - 1) * CUP_GAP);

      // 3. Hands release and retract
      const retractL_X = animate(leftPawX, 48, { duration: 0.18, ease: "easeIn" });
      const retractL_Y = animate(leftPawY, 240, { duration: 0.18, ease: "easeIn" });
      const retractR_X = animate(rightPawX, 222, { duration: 0.18, ease: "easeIn" });
      const retractR_Y = animate(rightPawY, 240, { duration: 0.18, ease: "easeIn" });
      const retractHX = animate(headX, 0, { duration: 0.18, ease: "easeIn" });
      const retractHR = animate(headRotate, 0, { duration: 0.18, ease: "easeIn" });

      await Promise.all([retractL_X, retractL_Y, retractR_X, retractR_Y, retractHX, retractHR]);
    }

    await sleep(300);
    if(abortRef.current) return;

    // Smirk mischievously at player
    setMouthType("smirk");
    animate(headRotate, -5, { duration: 0.4 });
    setPhase("choosing");
  }, []); // eslint-disable-line

  /* ─── PLACING: teddy grabs center cup, lifts it to show heart, lowers it ─── */
  const startPlacing = useCallback(async()=>{
    initAudio();
    abortRef.current=false;
    setPhase("placing");
    setMouthType("smile");

    // Right hand reaches center cup (visual slot 1)
    playSound("grab");
    const reachX = animate(rightPawX, 135, { duration: 0.28, ease: "easeOut" });
    const reachY = animate(rightPawY, 200, { duration: 0.28, ease: "easeOut" });
    await Promise.all([reachX, reachY]);
    if(abortRef.current) return;

    // Cup rises, hand stays locked on rim
    const liftCup = animate(cupY1, 96, { duration: 0.55, ease: "easeOut" });
    const liftHand = animate(rightPawY, 200 - 96, { duration: 0.55, ease: "easeOut" });
    await Promise.all([liftCup, liftHand]);
    if(abortRef.current) return;

    // Show heart
    setHearts([false,true,false]);
    await sleep(1200);
    if(abortRef.current) return;

    // Lower cup and hand
    setHearts([false,false,false]);
    const lowerCup = animate(cupY1, 0, { duration: 0.45, ease: "easeIn" });
    const lowerHand = animate(rightPawY, 200, { duration: 0.45, ease: "easeIn" });
    await Promise.all([lowerCup, lowerHand]);
    if(abortRef.current) return;

    playSound("place");

    // Retract hand
    const retractX = animate(rightPawX, 222, { duration: 0.22, ease: "easeIn" });
    const retractY = animate(rightPawY, 240, { duration: 0.22, ease: "easeIn" });
    await Promise.all([retractX, retractY]);
    if(abortRef.current) return;

    // Start shuffling
    setPhase("shuffling");
    setBodyBob(true);
    await runShuffle();
    setBodyBob(false);
  },[runShuffle]); // eslint-disable-line

  /* ─── REVEAL logic: middle cup always lifts, then side cups lift to show I ❤️ U ─── */
  const onChoose = useCallback(async (clickedSlot) => {
    if (phase !== "choosing") return;

    // A. If wrong cup is selected, shake head "no", play warning tone, and do not lift or reveal
    if (clickedSlot !== 1) {
      setMouthType("smirk");
      playSound("wrong");
      await animate(headRotate, [0, -12, 12, -12, 12, 0], { duration: 0.65, ease: "easeInOut" });
      return;
    }

    // B. If correct cup is selected, execute victory lift and reveal
    setPhase("reveal_heart");
    setExcited(true);
    setMouthType("excited");

    // Head looks center with joy
    animate(headX, 0, { duration: 0.3 });
    animate(headRotate, 0, { duration: 0.3 });

    // 1. Lift the clicked middle cup (slot 1) using closest hand
    const handXToUse = leftPawX.get() < rightPawX.get() ? leftPawX : rightPawX;
    const handYToUse = leftPawY.get() < rightPawY.get() ? leftPawY : rightPawY;

    // Grab center cup
    playSound("grab");
    animate(handXToUse, 135, { duration: 0.25 });
    animate(handYToUse, 200, { duration: 0.25 });
    await sleep(250);
    if (abortRef.current) return;

    // Lift center cup
    animate(cupYs[1], 96, { duration: 0.75, ease: "easeOut" });
    animate(handYToUse, 200 - 96, { duration: 0.75, ease: "easeOut" });
    await sleep(750);
    if (abortRef.current) return;

    playSound("win");
    setHearts(prev => {
      const n = [...prev];
      n[1] = true;
      return n;
    });

    await sleep(1500);
    if (abortRef.current) return;

    // 2. Lift remaining cups automatically
    setPhase("reveal_letters");
    const leftHandSlot = 0;
    const rightHandSlot = 2;

    // Grab remaining cups on the table first
    playSound("grab");
    animate(leftPawX, (leftHandSlot - 1) * CUP_GAP + 135, { duration: 0.25 });
    animate(leftPawY, 200, { duration: 0.25 });
    animate(rightPawX, (rightHandSlot - 1) * CUP_GAP + 135, { duration: 0.25 });
    animate(rightPawY, 200, { duration: 0.25 });

    await sleep(250);
    if (abortRef.current) return;

    // Lift left and right cups synchronously with hands
    animate(cupYs[leftHandSlot], 90, { duration: 0.75, ease: "easeOut" });
    animate(leftPawY, 200 - 90, { duration: 0.75, ease: "easeOut" });
    animate(cupYs[rightHandSlot], 90, { duration: 0.75, ease: "easeOut" });
    animate(rightPawY, 200 - 90, { duration: 0.75, ease: "easeOut" });

    await sleep(750);
    if (abortRef.current) return;

    // Reveal letters ONLY after cups are fully open
    setLetters(prev => {
      const n = [...prev];
      n[0] = "I";
      n[2] = "U";
      return n;
    });

    await sleep(2600);
    if (abortRef.current) return;

    // Final love state: Teddy hugs plush heart pillow
    setPhase("ilu");
    setExcited(false);
    setLove(true);
    setSparkle(true);
    setMouthType("smile");

    // Paws fold inward hugging heart pillow
    animate(leftPawX, 105, { duration: 0.4 });
    animate(leftPawY, 210, { duration: 0.4 });
    animate(rightPawX, 165, { duration: 0.4 });
    animate(rightPawY, 210, { duration: 0.4 });

    // Explicitly guarantee that the cups remain lifted (open)
    cupYs[0].set(90);
    cupYs[1].set(96);
    cupYs[2].set(90);

    setTimeout(() => setSparkle(false), 3200);
  }, [phase]); // eslint-disable-line

  // Scene remains permanently active to show open cups and teddy pillow hug

  return (
    <section className="relative min-h-screen bg-[#0f0b07] overflow-hidden flex flex-col items-center">
      <svg className="absolute w-0 h-0">
        <defs>
          <radialGradient id="rosePetalGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="70%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>
        </defs>
      </svg>

      {/* Ambient background glows */}
      <motion.div animate={{scale:[1,1.22,1],opacity:[0.07,0.16,0.07]}} transition={{duration:8,repeat:Infinity,ease:"easeInOut"}}
        className="absolute top-[-180px] left-[-120px] w-[540px] h-[540px] rounded-full pointer-events-none"
        style={{background:"rgba(251,191,36,0.08)",filter:"blur(160px)"}}/>
      <motion.div animate={{scale:[1.22,1,1.22],opacity:[0.05,0.13,0.05]}} transition={{duration:11,repeat:Infinity,ease:"easeInOut",delay:3.5}}
        className="absolute bottom-[-180px] right-[-120px] w-[540px] h-[540px] rounded-full pointer-events-none"
        style={{background:"rgba(251,150,36,0.08)",filter:"blur(140px)"}}/>
      <div className="absolute inset-0 pointer-events-none"
        style={{background:"radial-gradient(ellipse 70% 55% at 50% 60%,rgba(255,200,100,0.05),transparent)"}}/>

      <StarField/>
      <FloatingParticles/>
      <FloatingRosePetals/>
      <Sparkles active={sparkle}/>

      {/* Gold corner filigree frames */}
      <div className="hidden md:block absolute top-8 left-8 w-24 h-24 pointer-events-none opacity-25 z-20">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-amber-200/50 stroke-[1.5]">
          <path d="M 10,90 L 10,10 L 90,10 M 10,30 C 15,25 25,15 30,10 M 10,50 C 20,40 40,20 50,10 M 20,20 A 10,10 0 1,1 40,40" />
        </svg>
      </div>
      <div className="hidden md:block absolute top-8 right-8 w-24 h-24 pointer-events-none opacity-25 rotate-90 z-20">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-amber-200/50 stroke-[1.5]">
          <path d="M 10,90 L 10,10 L 90,10 M 10,30 C 15,25 25,15 30,10 M 10,50 C 20,40 40,20 50,10 M 20,20 A 10,10 0 1,1 40,40" />
        </svg>
      </div>

      {/* Gold hairlines */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{background:"linear-gradient(to right,transparent,rgba(251,191,36,0.22),transparent)"}}/>
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{background:"linear-gradient(to right,transparent,rgba(251,191,36,0.1),transparent)"}}/>

      {/* Side labels */}
      {["left","right"].map((side,idx)=>(
        <motion.div key={side} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1.6,delay:1.2}}
          className="hidden md:flex flex-col items-center gap-4 absolute top-1/2 -translate-y-1/2 z-10"
          style={{[side]:"28px"}}>
          <div style={{width:1,height:88,background:"linear-gradient(to bottom,transparent,rgba(251,191,36,0.22))"}}/>
          <span style={{...FONT_BODY,color:"rgba(251,191,36,0.22)",fontSize:9,letterSpacing:"7px",textTransform:"uppercase",writingMode:"vertical-rl"}}>
            {idx===0?"find the heart":"a secret awaits"}
          </span>
          <div style={{width:6,height:6,borderRadius:"50%",background:"rgba(251,191,36,0.22)"}}/>
          <div style={{width:1,height:88,background:"linear-gradient(to bottom,rgba(251,191,36,0.22),transparent)"}}/>
        </motion.div>
      ))}

      {/* ═══ PHASE HEADER ═══ */}
      <div className="relative z-20 w-full flex flex-col items-center pt-10 pb-4" style={{minHeight:148}}>
        <AnimatePresence mode="wait">
          {phase==="intro" && (
            <motion.div key="intro" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
              className="flex flex-col items-center gap-4">
              <p style={{...FONT_BODY,color:"rgba(253,230,138,0.35)",fontSize:10,letterSpacing:"7px",textTransform:"uppercase"}}>An interactive surprise</p>
              <h2 style={{...FONT_SCRIPT,color:"#fde68a",fontSize:"clamp(1.9rem,4.5vw,2.5rem)",textShadow:"0 0 30px rgba(251,191,36,0.38)"}}>A Little Game ♡</h2>
              <PhasePill text="The teddy bear has a secret for you…"/>
              <div style={{marginTop:10}}><VintageBtn onClick={startPlacing} accent large>Begin ✦</VintageBtn></div>
            </motion.div>
          )}
          {phase==="placing" && (
            <motion.div key="placing" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
              className="flex flex-col items-center gap-4">
              <p style={{...FONT_BODY,color:"rgba(253,230,138,0.35)",fontSize:10,letterSpacing:"7px",textTransform:"uppercase"}}>Pay close attention</p>
              <h2 style={{...FONT_SCRIPT,color:"#fde68a",fontSize:"clamp(1.7rem,4vw,2.2rem)",textShadow:"0 0 24px rgba(251,191,36,0.35)"}}>Watch the Heart ♡</h2>
              <PhasePill text="The teddy is hiding it under a cup…"/>
            </motion.div>
          )}
          {phase==="shuffling" && (
            <motion.div key="shuffling" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
              className="flex flex-col items-center gap-4">
              <p style={{...FONT_BODY,color:"rgba(253,230,138,0.35)",fontSize:10,letterSpacing:"7px",textTransform:"uppercase"}}>Can you keep track?</p>
              <h2 style={{...FONT_SCRIPT,color:"#fde68a",fontSize:"clamp(1.7rem,4vw,2.2rem)",textShadow:"0 0 24px rgba(251,191,36,0.35)"}}>Shuffling…</h2>
              <PhasePill text="The teddy is mixing the cups fast!"/>
            </motion.div>
          )}
          {phase==="choosing" && (
            <motion.div key="choosing" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
              className="flex flex-col items-center gap-4">
              <p style={{...FONT_BODY,color:"rgba(253,230,138,0.35)",fontSize:10,letterSpacing:"7px",textTransform:"uppercase"}}>Trust your heart</p>
              <h2 style={{...FONT_SCRIPT,color:"#fde68a",fontSize:"clamp(1.7rem,4vw,2.2rem)",textShadow:"0 0 24px rgba(251,191,36,0.35)"}}>Where is the Heart? ♡</h2>
              <PhasePill text="Tap a cup to reveal…"/>
            </motion.div>
          )}
          {phase==="reveal_heart" && (
            <motion.div key="rh" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
              className="flex flex-col items-center gap-4">
              <p style={{...FONT_BODY,color:"rgba(253,230,138,0.35)",fontSize:10,letterSpacing:"7px",textTransform:"uppercase"}}>The secret</p>
              <h2 style={{...FONT_SCRIPT,color:"#fde68a",fontSize:"clamp(1.7rem,4vw,2.2rem)",textShadow:"0 0 24px rgba(251,191,36,0.35)"}}>Let's see… ♡</h2>
              <PhasePill text="Now watch what the other cups say…"/>
            </motion.div>
          )}
          {phase==="reveal_letters" && (
            <motion.div key="rl" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
              className="flex flex-col items-center gap-4">
              <p style={{...FONT_BODY,color:"rgba(253,230,138,0.35)",fontSize:10,letterSpacing:"7px",textTransform:"uppercase"}}>Read it together</p>
              <h2 style={{...FONT_BODY,color:"#fde68a",fontSize:"clamp(1.7rem,4vw,2.2rem)",textShadow:"0 0 24px rgba(251,191,36,0.35)",fontWeight:500}}>I ♡ U</h2>
              <PhasePill text="The teddy wanted you to know…"/>
            </motion.div>
          )}
          {phase==="ilu" && <ILUReveal key="ilu" onReplay={resetAll} onNext={() => navigate("/memories")}/>}
        </AnimatePresence>
      </div>

      {/* ═══ SCENE ═══ */}
      {true && (
        <div className="relative w-full flex-1 flex items-end justify-center"
          style={{minHeight:420,maxWidth:720,paddingBottom:106}}>

          {/* Lit Flickering Candles */}
          <Candle className="absolute left-[calc(50%-230px)] bottom-[100px] z-10 scale-90" />
          <Candle className="absolute right-[calc(50%-230px)] bottom-[100px] z-10 scale-90" />

          {/* TEDDY — behind cups */}
          <div style={{position:"absolute",bottom:92,left:"50%",transform:"translateX(-50%)",zIndex:1}}>
            <TeddyBear
              leftPawX={leftPawX}
              leftPawY={leftPawY}
              rightPawX={rightPawX}
              rightPawY={rightPawY}
              headX={headX}
              headRotate={headRotate}
              mouthType={mouthType}
              isBlinking={isBlinking}
              bodyBob={bodyBob}
              excited={excited}
              love={love}
            />
          </div>

          {/* Cup Shadows */}
          {[0,1,2].map(vs => (
            <CupShadow key={vs} cupY={cupYs[vs]} cupX={cupXs[vs]} />
          ))}

          {/* Static Table Symbols (Letters & Hearts) sitting under the cups */}
          <div style={{
            position: "absolute", bottom: 112, left: "50%", transform: "translateX(-50%)",
            width: 94, height: 112, zIndex: 5,
            pointerEvents: "none",
          }}>
            {[0, 1, 2].map(vs => {
              const xOffset = (vs - 1) * CUP_GAP;
              return (
                <div
                  key={vs}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 94,
                    height: 112,
                    transform: `translateX(${xOffset}px)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: 16,
                  }}
                >
                  <AnimatePresence>
                    {hearts[vs] && (
                      <motion.div
                        key="h"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 16 }}
                        style={{ position: "absolute", bottom: 16 }}
                      >
                        <HeartSVG size={40} glow pulse />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {letters[vs] && (
                      <motion.div
                        key="l"
                        initial={{ scale: 0, opacity: 0, y: 14 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                        style={{
                          position: "absolute",
                          bottom: 4,
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 64,
                          fontWeight: 600,
                          color: "#fbbf24",
                          textShadow: "0 0 32px rgba(251,191,36,1), 0 0 70px rgba(251,191,36,0.4)",
                          lineHeight: 1,
                        }}
                      >
                        {letters[vs]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* CUPS — in front of teddy */}
          <div style={{
            position:"absolute", bottom:112, left:"50%", transform:"translateX(-50%)",
            width:94, height:112, zIndex:10,
          }}>
            {[0,1,2].map(vs => (
              <CupItem
                key={vs}
                cupX={cupXs[vs]}
                cupY={cupYs[vs]}
                cupRotate={cupRotates[vs]}
                cupScale={cupScales[vs]}
                cupZ={cupZs[vs]}
                phase={phase}
                onChoose={() => onChoose(vs)}
              />
            ))}
          </div>

          {/* TABLE */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:5}}>
            <Table/>
          </div>
        </div>
      )}
    </section>
  );
}