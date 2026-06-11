import { useState, useRef, useLayoutEffect, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useNavigate } from "react-router-dom";
import localLetterImg from "../assets/letter/letter.jpg";
import { getAssetUrl } from "../config/cdn";

const letterImg = getAssetUrl(localLetterImg, "letter/letter.jpg");

/* ─── FONTS & CONSTANTS ──────────────────────────────────────────────── */
const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

const PAPER_MAX_WIDTH = 470;
const PAGE_HEIGHT     = 760;
const FIRST_PAGE_IMAGE_GUARD = 0.44;   // fraction of page taken by photo area
const EDGE_MARGIN   = "0.55cm";
const PARAGRAPH_INDENT = "2.2em";
const MAX_PAGES = 10;

/* ─── PAGE TURN ANIMATION VARIANTS ────────────────────────────────────── */
const pageVariants = {
  enter: (direction) => {
    if (direction > 0) {
      // Forward: The next page starts flat underneath in the stack
      return {
        opacity: 0.98,
        rotateY: 0,
        scale: 0.96,
        transformOrigin: "left center",
        zIndex: 5,
      };
    } else {
      // Backward: The previous page swings in from the left (on top of stack)
      return {
        opacity: 0,
        rotateY: -180,
        scale: 1.04,
        transformOrigin: "left center",
        zIndex: 20,
      };
    }
  },
  center: {
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transformOrigin: "left center",
    zIndex: 10,
  },
  exit: (direction) => {
    if (direction > 0) {
      // Forward: The current page swings out to the left (on top)
      return {
        opacity: 0,
        rotateY: -180,
        scale: 1.04,
        transformOrigin: "left center",
        zIndex: 20,
      };
    } else {
      // Backward: The current page stays flat underneath and gets covered
      return {
        opacity: 0.98,
        rotateY: 0,
        scale: 0.96,
        transformOrigin: "left center",
        zIndex: 5,
      };
    }
  },
};

const frontShadowVariants = {
  enter: (direction) => ({
    opacity: direction > 0 ? 0.35 : 0.5,
  }),
  center: {
    opacity: 0,
  },
  exit: (direction) => ({
    opacity: direction > 0 ? 0.5 : 0.35,
  }),
};

const backShadowVariants = {
  enter: (direction) => ({
    opacity: direction > 0 ? 0 : 0.15,
  }),
  center: {
    opacity: 0,
  },
  exit: (direction) => ({
    opacity: direction > 0 ? 0.15 : 0,
  }),
};

/* ─── LETTER CONTENT ─────────────────────────────────────────────────── */
const LETTER_BLOCKS = [
  { id: "greeting", type: "greeting", text: "To My Most Favourite Girl in the World," },
  {
    id: "p1a",
    type: "paragraph",
    text: "Happy Birthday to the most beautiful, kind-hearted, caring, and precious girl in my life. You are the reason behind so many of my smiles, my peace, and some of my happiest memories. Your cute smile, soft heart, maturity, and the way you care for everyone make you truly one of a kind."
  },
  {
    id: "p1b",
    type: "paragraph",
    text: "Meeting you was one of the most beautiful things that ever happened to me. Every moment with you feels special, every conversation feels comforting, and every memory with you stays forever in my heart. On your special day, I just want you to know how deeply loved and appreciated you are. You deserve all the happiness, success, love, and beautiful moments in this world because a girl as perfect as you deserves nothing less."
  },
  {
    id: "p2",
    type: "paragraph",
    text: "Sometimes I sit quietly and wonder how someone like you even exists in my life. Among billions of people in this world, I feel like the luckiest person alive simply because I got the chance to know you, admire you, and love you. You are not just beautiful — you carry a rare kind of beauty that lives within the heart. The way you speak, the way you care, and the maturity and intelligence you have make everything about you feel perfect to me."
  },
  {
    id: "p3",
    type: "paragraph",
    text: "Your kindness is soft like moonlight, your smile brings peace, and your eyes are honestly the most beautiful eyes I have ever seen. Whenever I look at them, I forget every sadness around me. Your voice feels like my favourite song — the kind I never get tired of listening to. Even a simple phone call with you becomes the happiest part of my day. Every second spent talking to you turns into a memory my heart quietly keeps forever. Your hands are the most comforting hands I have ever held. Your hair carries a fragrance sweeter than flowers after the rain. Your presence alone calms my restless heart. Slowly, without me even realizing it, you filled every corner of my mind and heart."
  },
  {
    id: "p4",
    type: "paragraph",
    text: "Among all the memories I have, travelling with you will always remain one of the most precious. Sitting beside you, sharing little moments, and watching the roads pass while my heart stayed completely focused on you — those moments felt warmer than home. Time somehow becomes more beautiful when you are near me And the day I held your hand and touched your cheek… I still cannot explain that feeling completely. For a moment, it truly felt like my soul had left my body just to stand beside you and admire how special you are. That memory will stay with me forever like a page safely pressed inside an old vintage book."
  },
  {
    id: "p5",
    type: "paragraph",
    text: "Thank you for coming into my life and turning even the most ordinary days into something meaningful. In just 6 months and 29 days, you unknowingly became one of the most precious parts of my world. These 30 weeks, 210 days, 5,040 hours, 302,400 minutes, and 18,144,000 seconds of knowing you have filled my heart with countless memories that I will cherish forever. Every conversation, every smile, and every little moment we shared became deeply special to me. I truly hope this small effort of mine brings a smile to your face and makes your day even more memorable."
  },
  {
    id: "p6",
    type: "paragraph",
    text: "No matter where life takes us or how distant we become, you will always have a special place in my heart. Every day, a part of me will still wait for your message because no one could ever replace you. In this life, I could never choose anyone over you because, to me, you are and always will be the only one."
  },
  {
    id: "h_love",
    type: "heading",
    text: "I love you endlessly."
  },
  {
    id: "p7",
    type: "paragraph",
    text: "Even though my love is still one-sided today, my feelings for you are pure and true. I never loved you expecting anything in return. I simply loved you because my heart found its home in you. But if one day I get the blessing of having you forever in my life, my soul will finally feel complete. I truly hope that someday, somehow, life keeps us together forever because loving you will always remain one of the most beautiful things my heart has ever done."
  },
  {
    id: "p8",
    type: "paragraph",
    text: "These past few days haven’t felt the same because we are not talking properly, and honestly, I miss you so much. I miss your texts, your voice, your eyes, your presence… I even miss our small fights. No matter how much you scold me, get angry at me, or hurt me sometimes, I still miss you deeply because every little thing about you means so much to me."
  },
  {
    id: "p9",
    type: "paragraph",
    text: "I’m still here, waiting for you, and I think a part of me always will. I just hope that one day soon you’ll text me again like before. Until then, I’ll keep holding onto our memories and the special place you have in my heart."
  },
  {
    id: "closing",
    type: "closing",
    text: "Happy Birthday once again, Ammuni."
  }
];

/* ─── DUST PARTICLES ─────────────────────────────────────────────────── */
function DustParticles() {
  const particles = useMemo(() => 
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      dur: Math.random() * 12 + 8,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.25 + 0.05,
    })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden layer-isolated">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-200 gpu-accelerated"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -60, -20, -80],
            x: [0, 10, -8, 15],
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

/* ─── ROSE SVG DECORATION ────────────────────────────────────────────── */
function RoseCorner({ position = "topLeft", size = 90 }) {
  const isRight = position.includes("Right");
  const isBottom = position.includes("bottom");

  const scaleX = isRight ? -1 : 1;
  const scaleY = isBottom ? -1 : 1;
  const origin = "center";

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        [isRight ? "right" : "left"]: -8,
        [isBottom ? "bottom" : "top"]: -8,
        width: size,
        height: size,
        transform: `scale(${scaleX}, ${scaleY})`,
        transformOrigin: origin,
        opacity: 0.78,
        zIndex: 30,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        {/* Stem */}
        <path
          d="M20 90 Q30 70 35 55 Q38 48 42 42"
          stroke="#3a6b35"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Leaves */}
        <path
          d="M30 72 Q18 60 22 50 Q30 58 30 72"
          fill="#3a6b35"
          opacity="0.85"
        />
        <path
          d="M35 62 Q46 52 50 42 Q42 50 35 62"
          fill="#4a7a44"
          opacity="0.75"
        />
        {/* Rose petals – outer ring */}
        <ellipse cx="50" cy="35" rx="11" ry="14" fill="#c0392b" opacity="0.9" transform="rotate(-20,50,35)" />
        <ellipse cx="60" cy="30" rx="10" ry="13" fill="#c0392b" opacity="0.85" transform="rotate(15,60,30)" />
        <ellipse cx="55" cy="22" rx="9" ry="13" fill="#d44333" opacity="0.85" transform="rotate(-5,55,22)" />
        <ellipse cx="44" cy="22" rx="9" ry="12" fill="#c0392b" opacity="0.85" transform="rotate(10,44,22)" />
        <ellipse cx="38" cy="30" rx="10" ry="12" fill="#b03020" opacity="0.85" transform="rotate(-15,38,30)" />
        {/* Inner petals */}
        <ellipse cx="50" cy="30" rx="7" ry="9" fill="#d44333" opacity="0.9" transform="rotate(5,50,30)" />
        <ellipse cx="56" cy="25" rx="6" ry="8" fill="#e05040" opacity="0.88" transform="rotate(-10,56,25)" />
        <ellipse cx="46" cy="25" rx="6" ry="8" fill="#cc3828" opacity="0.88" transform="rotate(10,46,25)" />
        {/* Center */}
        <circle cx="50" cy="28" r="5" fill="#8b1a10" opacity="0.92" />
        <circle cx="50" cy="28" r="2.5" fill="#6b0f08" opacity="0.95" />
        {/* Light highlight */}
        <ellipse cx="48" cy="26" rx="2" ry="1.5" fill="rgba(255,220,200,0.35)" />
        {/* Petals behind / outer glow */}
        <ellipse cx="50" cy="38" rx="12" ry="10" fill="#a02818" opacity="0.4" transform="rotate(0,50,38)" />
      </svg>
    </div>
  );
}

/* ─── BURNT EDGE OVERLAY ─────────────────────────────────────────────── */
function BurntEdges() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20" style={{ borderRadius: "inherit" }}>
      {/* Top edge */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "38px",
          background:
            "radial-gradient(ellipse 80% 100% at 50% -10%, rgba(10,5,2,0.92) 0%, rgba(30,14,5,0.65) 40%, transparent 100%)",
          borderRadius: "inherit",
        }}
      />
      {/* Irregular top burn */}
      <svg
        className="absolute top-0 left-0 w-full"
        style={{ height: 42, overflow: "visible" }}
        viewBox="0 0 560 42"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,0 Q28,8 55,3 Q80,0 110,5 Q135,9 160,4 Q185,0 220,6 Q255,11 280,5 Q305,0 330,7 Q360,13 390,5 Q415,0 440,4 Q465,8 490,3 Q515,0 540,5 L560,0 L560,20 Q530,28 500,22 Q470,16 440,24 Q410,30 380,22 Q350,15 320,23 Q290,29 260,21 Q230,14 200,22 Q170,28 140,20 Q110,13 80,21 Q50,28 20,20 Q5,16 0,20 Z"
          fill="rgba(15,8,3,0.82)"
        />
        <path
          d="M0,0 Q40,4 70,1 Q100,0 130,3 Q160,6 190,2 Q220,0 250,4 Q280,7 310,2 Q340,0 370,3 Q400,6 430,2 Q460,0 490,3 Q520,6 560,0 L560,12 Q530,18 500,12 Q470,7 440,14 Q410,19 380,13 Q350,8 320,14 Q290,18 260,12 Q230,7 200,13 Q170,18 140,12 Q110,7 80,13 Q50,18 20,12 Z"
          fill="rgba(25,12,4,0.55)"
        />
      </svg>

      {/* Bottom edge */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: 42, overflow: "visible" }}
        viewBox="0 0 560 42"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,42 Q28,34 55,39 Q80,42 110,37 Q135,33 160,38 Q185,42 220,36 Q255,31 280,37 Q305,42 330,35 Q360,29 390,37 Q415,42 440,38 Q465,34 490,39 Q515,42 540,37 L560,42 L560,22 Q530,14 500,20 Q470,26 440,18 Q410,12 380,20 Q350,26 320,18 Q290,13 260,21 Q230,26 200,20 Q170,14 140,22 Q110,28 80,21 Q50,14 20,22 Q5,26 0,22 Z"
          fill="rgba(15,8,3,0.82)"
        />
      </svg>

      {/* Left edge */}
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: "32px",
          background:
            "radial-gradient(ellipse 100% 80% at -10% 50%, rgba(10,5,2,0.88) 0%, rgba(30,14,5,0.5) 45%, transparent 100%)",
        }}
      />
      {/* Right edge */}
      <div
        className="absolute inset-y-0 right-0"
        style={{
          width: "32px",
          background:
            "radial-gradient(ellipse 100% 80% at 110% 50%, rgba(10,5,2,0.88) 0%, rgba(30,14,5,0.5) 45%, transparent 100%)",
        }}
      />

      {/* Corner dark burns */}
      {[
        { top: 0, left: 0, gradient: "radial-gradient(circle at 0% 0%, rgba(8,4,2,0.92) 0%, transparent 55%)" },
        { top: 0, right: 0, gradient: "radial-gradient(circle at 100% 0%, rgba(8,4,2,0.92) 0%, transparent 55%)" },
        { bottom: 0, left: 0, gradient: "radial-gradient(circle at 0% 100%, rgba(8,4,2,0.92) 0%, transparent 55%)" },
        { bottom: 0, right: 0, gradient: "radial-gradient(circle at 100% 100%, rgba(8,4,2,0.92) 0%, transparent 55%)" },
      ].map((corner, i) => (
        <div
          key={i}
          className="absolute w-28 h-28"
          style={{ ...corner, background: corner.gradient }}
        />
      ))}

      {/* Subtle char texture edges */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 60px rgba(10,5,2,0.35), inset 0 0 12px rgba(10,5,2,0.55)",
          borderRadius: "inherit",
        }}
      />
    </div>
  );
}


/* ─── LETTER BLOCK CONTENT ───────────────────────────────────────────── */
function LetterBlockContent({ block }) {
  if (block.type === "greeting") {
    return (
      <div className="mb-[0.75cm] flex items-center justify-center gap-3">
        <div className="w-8 h-px bg-amber-800/40" />
        <h3
          className="text-amber-50 text-2xl md:text-3xl text-center"
          style={{ ...FONT_SCRIPT, textShadow: "0 0 10px rgba(255,200,100,0.3)" }}
        >
          {block.text}
        </h3>
        <div className="w-8 h-px bg-amber-800/40" />
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p
        className="text-amber-50/93 leading-[2.05] tracking-[0.015em] drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]"
        style={{
          ...FONT_BODY,
          fontSize: "clamp(13.5px, 2.6vw, 15.5px)",
          textIndent: PARAGRAPH_INDENT,
          marginBottom: "0.6cm",
        }}
      >
        {block.text}
      </p>
    );
  }

  if (block.type === "heading") {
    return (
      <div className="text-center my-6 flex items-center justify-center gap-3">
        <div className="w-8 h-px bg-amber-800/40" />
        <h3
          className="text-amber-50 text-2xl md:text-3xl"
          style={{ ...FONT_SCRIPT, textShadow: "0 0 10px rgba(255,200,100,0.3)" }}
        >
          {block.text}
        </h3>
        <div className="w-8 h-px bg-amber-800/40" />
      </div>
    );
  }

  // closing
  return (
    <div className="mt-[0.65cm] flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center gap-3 my-4">
        <div className="w-8 h-px bg-amber-800/40" />
        <h3
          className="text-amber-50 text-2xl md:text-3xl text-center"
          style={{ ...FONT_SCRIPT, textShadow: "0 0 10px rgba(255,200,100,0.3)" }}
        >
          {block.text}
        </h3>
        <div className="w-8 h-px bg-amber-800/40" />
      </div>
      <p
        className="text-amber-50 mt-1 drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)] text-center"
        style={{ ...FONT_SCRIPT, fontSize: "clamp(1.3rem,4vw,1.65rem)" }}
      >
        Forever yours, Sibi ♡
      </p>
    </div>
  );
}

/* ─── VINTAGE BUTTON ─────────────────────────────────────────────────── */
function PageButton({ label, onClick, delay = 0, isFinal = false }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        width: "clamp(180px, 50vw, 215px)",
        height: "52px",
        borderRadius: "2px",
        border: isFinal ? "1px solid rgba(180,120,40,0.45)" : "1px solid rgba(220,190,130,0.28)",
        background: isFinal
          ? "linear-gradient(135deg, rgba(100,60,10,0.55), rgba(60,30,5,0.75))"
          : "linear-gradient(135deg, rgba(60,35,8,0.45), rgba(30,15,3,0.65))",
        boxShadow: isFinal
          ? "0 0 24px rgba(180,100,20,0.22), 0 4px 16px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,200,100,0.12)"
          : "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,200,100,0.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Shimmer sweep */}
      <motion.div
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
        className="absolute inset-0 skew-x-12"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,200,100,0.13), transparent)",
        }}
      />
      {/* Ornamental lines */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-30">
        <div className="flex-1 h-px bg-amber-200/60" />
        <span className="text-amber-200 text-[8px]">✦</span>
        <div className="flex-1 h-px bg-amber-200/60" />
      </div>
      <span
        className="relative text-amber-50/90 uppercase"
        style={{ ...FONT_BODY, fontSize: "10px", letterSpacing: "5px", fontWeight: 600 }}
      >
        {label}
      </span>
    </motion.button>
  );
}

/* ─── PAPER PAGE ─────────────────────────────────────────────────────── */
function VintagePaperPage({ pageIndex, totalPages, isFirstPage, blocks, isBackSide = false, shadowVariants }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [2.5, -2.5]);
  const rotateY = useTransform(mouseX, [0, 1], [-3, 3]);

  const handleMouseMove = useCallback((e) => {
    if (isBackSide || pageIndex === -1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY, isBackSide, pageIndex]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  const textZoneTop = isFirstPage ? "6%" : "5%";

  if (pageIndex === -1) {
    return (
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: PAPER_MAX_WIDTH, perspective: "1200px" }}
      >
        <div className="relative w-full overflow-visible">
          <div
            className="relative w-full overflow-hidden flex flex-col items-center justify-center text-center p-8"
            style={{
              height: PAGE_HEIGHT,
              borderRadius: "3px",
              boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(220,190,130,0.1)",
              background: "linear-gradient(145deg, #e3cd9a 0%, #ccb37a 100%)",
            }}
          >
            {/* Base parchment texture */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(160deg, #e8d5a8 0%, #dfc68a 18%, #e6d09e 35%, #d8bc78 52%, #e2cc90 68%, #d5b870 82%, #dfc07a 100%)",
                opacity: 0.95
              }}
            />
            {/* Paper fibers texture */}
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.1]"
              style={{
                backgroundImage: `url("https://www.transparenttextures.com/patterns/old-mathematics.png")`,
              }}
            />
            
            {/* Decorative inner border */}
            <div className="absolute inset-4 border border-amber-900/15 rounded-sm pointer-events-none flex flex-col justify-between p-6 z-10">
              <div className="w-full flex justify-between">
                <span className="text-amber-900/30 text-xs">✦</span>
                <span className="text-amber-900/30 text-xs">✦</span>
              </div>
              <div className="w-full flex justify-between">
                <span className="text-amber-900/30 text-xs">✦</span>
                <span className="text-amber-900/30 text-xs">✦</span>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 mt-4">
              <span className="text-amber-900/40 text-[10px] tracking-[6px] uppercase" style={FONT_BODY}>
                Scrapbook Diary
              </span>
              
              <div className="w-16 h-px bg-amber-900/20" />

              <h2 className="text-amber-950 text-4xl leading-relaxed" style={{ ...FONT_SCRIPT, textShadow: "0 1px 2px rgba(255,255,255,0.5)" }}>
                My Most Favourite Girl
              </h2>

              <div className="w-16 h-px bg-amber-900/20" />

              <p className="text-amber-900/60 text-xs tracking-wider uppercase leading-loose" style={FONT_BODY}>
                A Collection of Memories,<br />
                Conversations & Promises.
              </p>

              <div className="mt-8 border border-amber-900/15 bg-[#fbf5dc]/50 px-6 py-4 rounded-sm shadow-sm flex flex-col items-center gap-2">
                <span className="text-amber-900/40 text-[9px] uppercase tracking-[4px]" style={FONT_BODY}>Letter by</span>
                <span className="text-amber-950 text-base" style={FONT_BODY}>Your Sibi</span>
                <div className="w-full h-px bg-amber-900/10 my-1" />
                <span className="text-amber-900/40 text-[9px] uppercase tracking-[4px]" style={FONT_BODY}>Dedicated To</span>
                <span className="text-amber-950 text-base font-semibold" style={FONT_BODY}>Ammuni</span>
              </div>
            </div>

            {/* Rose corners */}
            <RoseCorner position="topLeft" size={84} />
            <RoseCorner position="topRight" size={84} />
            <RoseCorner position="bottomLeft" size={76} />
            <RoseCorner position="bottomRight" size={76} />

            {/* Burnt edges */}
            <BurntEdges />

            {/* Shadow Overlay */}
            <motion.div
              variants={shadowVariants}
              className="absolute inset-0 z-45 bg-black pointer-events-none"
              initial={{ opacity: 0 }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto w-full"
      style={{ maxWidth: PAPER_MAX_WIDTH, perspective: "1200px" }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX: isBackSide ? 0 : rotateX, 
          rotateY: isBackSide ? 0 : rotateY, 
          transformStyle: "preserve-3d" 
        }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className="relative w-full overflow-visible"
      >
        {/* Main paper body */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: PAGE_HEIGHT,
            borderRadius: "3px",
            boxShadow: isBackSide
              ? "none"
              : "0 40px 100px rgba(0,0,0,0.65), 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(220,190,130,0.1)",
          }}
        >
          {/* ── Base parchment texture ── */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #e8d5a8 0%, #dfc68a 18%, #e6d09e 35%, #d8bc78 52%, #e2cc90 68%, #d5b870 82%, #dfc07a 100%)",
            }}
          />

          {/* ── Faded couple photo background – all pages ── */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              backgroundImage: `url(${letterImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              opacity: 0.22,
              mixBlendMode: "multiply",
              filter: "sepia(0.7) contrast(0.75) saturate(0.5) brightness(0.85)",
            }}
          />
          {/* Photo blend overlay – warm paper tone over photo */}
          <div
            className="absolute inset-0 z-[2]"
            style={{
              background: "rgba(200, 160, 80, 0.28)",
              mixBlendMode: "screen",
            }}
          />

          {/* Paper fibers texture */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
            }}
          />

          {/* Subtle noise grain */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `url("https://www.transparenttextures.com/patterns/old-mathematics.png")`,
            }}
          />

          {/* Warm age stains */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 60% 40% at 20% 30%, rgba(160,100,20,0.12) 0%, transparent 70%),
                radial-gradient(ellipse 50% 45% at 80% 70%, rgba(140,80,10,0.10) 0%, transparent 65%),
                radial-gradient(ellipse 40% 30% at 55% 50%, rgba(180,120,30,0.07) 0%, transparent 60%)
              `,
            }}
          />

          {!isBackSide && (
            <>
              {/* "A Letter For You" header */}
              {isFirstPage && (
                <div
                  className="absolute inset-x-0 flex flex-col items-center pointer-events-none z-10"
                  style={{ top: "8px" }}
                >
                  <p
                    className="uppercase text-amber-900/50 text-[9px] tracking-[8px]"
                    style={FONT_BODY}
                  >
                    A Letter For You
                  </p>
                  {/* Decorative divider */}
                  <div className="flex items-center gap-2 mt-1 opacity-35">
                    <div className="w-12 h-px bg-amber-800" />
                    <span className="text-amber-800 text-[8px]">✦</span>
                    <div className="w-12 h-px bg-amber-800" />
                  </div>
                </div>
              )}

              {/* ── Text zone ── */}
              <div
                className="absolute inset-x-0 bottom-0"
                style={{
                  top: textZoneTop,
                  backgroundImage: `
                    repeating-linear-gradient(
                      transparent,
                      transparent 30px,
                      rgba(140,90,20,0.12) 30px,
                      rgba(140,90,20,0.12) 31px
                    )
                  `,
                }}
              >
                {/* Text area warm wash */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: isFirstPage
                      ? "linear-gradient(to bottom, rgba(210,175,90,0.0) 0%, rgba(195,155,65,0.18) 25%, rgba(185,145,55,0.28) 100%)"
                      : "linear-gradient(to bottom, rgba(195,155,65,0.08) 0%, rgba(185,145,55,0.2) 100%)",
                  }}
                />

                {/* Left margin red line */}
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    left: "38px",
                    width: "1px",
                    background: "rgba(180,60,40,0.22)",
                  }}
                />

                {/* Text content */}
                <div
                  className="relative z-10 h-full overflow-hidden"
                  style={{
                    padding: EDGE_MARGIN,
                    paddingLeft: "calc(" + EDGE_MARGIN + " + 18px)",
                    paddingBottom: "1.4cm",
                  }}
                >
                  {blocks.map((block) => (
                    <LetterBlockContent key={block.id} block={block} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Burnt edges overlay */}
          <BurntEdges />

          {/* Page number */}
          {!isBackSide && totalPages > 1 && (
            <div
              className="absolute z-30"
              style={{ bottom: 10, left: "50%", transform: "translateX(-50%)" }}
            >
              <p
                className="text-amber-900/40 text-[9px] tracking-[4px]"
                style={FONT_BODY}
              >
                — {pageIndex + 1} / {totalPages} —
              </p>
            </div>
          )}

          {/* Shadow Overlay */}
          <motion.div
            variants={shadowVariants}
            className="absolute inset-0 z-40 bg-black pointer-events-none"
            initial={{ opacity: 0 }}
          />
        </div>

        {/* Rose corners (on top of burnt edges) */}
        <RoseCorner position="topLeft" size={84} />
        <RoseCorner position="topRight" size={84} />
        <RoseCorner position="bottomLeft" size={76} />
        <RoseCorner position="bottomRight" size={76} />

        {/* Paper drop shadow */}
        {!isBackSide && (
          <div
            className="absolute -z-10"
            style={{
              bottom: -20,
              left: "5%",
              right: "5%",
              height: 28,
              background: "rgba(0,0,0,0.5)",
              filter: "blur(18px)",
              borderRadius: "50%",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

/* ─── PAGINATION HOOK ────────────────────────────────────────────────── */
function usePaginatedLetter(blocks, paperWidth) {
  const measureRef = useRef(null);
  const [pages, setPages] = useState([blocks]);

  const getPageBudget = useCallback(() => {
    const edgeMarginPx = 22;
    const bottomPadPx  = 50;
    return PAGE_HEIGHT - PAGE_HEIGHT * 0.06 - edgeMarginPx - bottomPadPx - 16;
  }, []);

  useLayoutEffect(() => {
    if (!measureRef.current || !paperWidth) return;

    const measureBlock = (block) => {
      const el = measureRef.current.querySelector(`[data-block-id="${block.id}"]`);
      return el?.getBoundingClientRect().height ?? 0;
    };

    const paginate = () => {
      const result = [];
      let currentPage = [];
      let pageIndex  = 0;
      let usedHeight = 0;
      let budget     = getPageBudget();

for (const block of blocks) {
        const blockHeight = measureBlock(block);
        const spacing     = block.type === "paragraph" ? 0 : 12;

        if (usedHeight + blockHeight + spacing <= budget) {
          currentPage.push(block);
          usedHeight += blockHeight + spacing;
          continue;
        }

        if (currentPage.length > 0) {
          result.push(currentPage);
          pageIndex += 1;
          if (pageIndex >= MAX_PAGES) break;
          currentPage = [];
          usedHeight  = 0;
          budget      = getPageBudget();
        }

        if (blockHeight <= budget) {
          currentPage.push(block);
          usedHeight = blockHeight;
          continue;
        }

        currentPage.push(block);
        result.push(currentPage);
        pageIndex += 1;
        if (pageIndex >= MAX_PAGES) break;
        currentPage = [];
        usedHeight  = 0;
        budget      = getPageBudget();
      }

      if (currentPage.length > 0 && result.length < MAX_PAGES) {
        result.push(currentPage);
      }

      setPages(result.length > 0 ? result : [blocks]);
    };

    paginate();
  }, [blocks, paperWidth, getPageBudget]);

  return { pages, measureRef };
}

/* ─── BINDING RINGS ─────────────────────────────────────────────────── */
function BindingRings({ isMobile }) {
  const positions = [50, 190, 330, 470, 610, 710];
  // On mobile: rings sit at left edge of the single page (notebook spine)
  // On desktop: rings sit at the spine between left/right pages
  const leftPos = isMobile ? "8px" : "484px";
  return (
    <>
      {positions.map((y, i) => (
        <div
          key={i}
          className="absolute w-[12px] h-[32px] rounded-full pointer-events-none"
          style={{
            top: y,
            left: leftPos,
            background: "linear-gradient(135deg, #f3d078 0%, #aa802c 40%, #5c430e 70%, #f3d078 100%)",
            boxShadow: "0 6px 10px rgba(0,0,0,0.65), inset 0 1px 2px rgba(255,255,255,0.45)",
            border: "1px solid rgba(139, 90, 43, 0.4)",
            zIndex: 45,
          }}
        />
      ))}
    </>
  );
}

/* ─── PAGE THICKNESS ─────────────────────────────────────────────────── */
function PageThickness({ Left, thickness }) {
  const sheetCount = Math.ceil(thickness * 3);
  if (sheetCount === 0) return null;
  
  return (
    <>
      {Array.from({ length: sheetCount }).map((_, i) => {
        const offset = (i + 1) * 1.5;
        const borderShadow = Left
          ? "inset -1px 0 0 rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.12)"
          : "inset 1px 0 0 rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.12)";
        
        return (
          <div
            key={i}
            className="absolute rounded-[3px] pointer-events-none"
            style={{
              top: 10 + i * 0.5,
              bottom: 10 + i * 0.5,
              [Left ? "left" : "right"]: 10 - offset,
              width: 470,
              background: "linear-gradient(to bottom, #ebdcb9 0%, #d8bc78 100%)",
              boxShadow: borderShadow,
              zIndex: 8 - i,
              opacity: 0.96,
              border: "1px solid rgba(139, 90, 43, 0.12)",
            }}
          />
        );
      })}
    </>
  );
}

/* ─── LETTER CONTENT (multi-page open-book spread) ───────────────────── */
function LetterContent({ onContinue }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  // Mobile starts at -1 → the book cover page
  const [currentPage, setCurrentPage] = useState(
    () => (typeof window !== 'undefined' && window.innerWidth < 768) ? -1 : 0
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState(1); // 1 = forward, -1 = backward
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const dragDirection = useRef(1); // 1 = forward, -1 = backward
  const dragStartPos = useRef(0);
  const hasStartedTurn = useRef(false);
  const progressMotion = useMotionValue(0);

  // We paginate using a fixed width of 470px
  const { pages, measureRef } = usePaginatedLetter(LETTER_BLOCKS, 470);
  const totalSpreads = Math.max(1, Math.ceil((pages.length + 1) / 2));
  
  const isLastPage = isMobile ? currentPage === pages.length - 1 : Math.max(0, Math.floor((currentPage + 1) / 2)) === totalSpreads - 1;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      if (!parent) return;
      const parentWidth = parent.getBoundingClientRect().width;
      const bookWidth = isMobile ? 490 : 980;
      const padding = isMobile ? 16 : 24;
      if (parentWidth < bookWidth) {
        setScale((parentWidth - padding) / bookWidth);
      } else {
        setScale(1);
      }
    };
    
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(handleResize, 50);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [pages, isMobile]);

  const handleDragStart = (e) => {
    if (isTransitioning) return;
    
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    if (clientX === undefined) return;

    setIsDragging(true);
    dragStartPos.current = clientX;
    hasStartedTurn.current = false;
    progressMotion.set(0);
  };

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    if (clientX === undefined) return;

    const deltaX = clientX - dragStartPos.current;
    
    if (!hasStartedTurn.current) {
      if (Math.abs(deltaX) > 8) {
        if (deltaX < 0) {
          // Swipe Left: turn forward
          const maxPage = pages.length - 1;
          const canTurn = isMobile ? currentPage < maxPage : Math.max(0, Math.floor((currentPage + 1) / 2)) < totalSpreads - 1;
          if (canTurn) {
            dragDirection.current = 1;
            setTransitionDirection(1);
            setIsTransitioning(true);
            hasStartedTurn.current = true;
            dragStartPos.current = clientX; // reset start position
          }
        } else {
          // Swipe Right: turn backward
          const canTurn = isMobile ? currentPage > -1 : Math.max(0, Math.floor((currentPage + 1) / 2)) > 0;
          if (canTurn) {
            dragDirection.current = -1;
            setTransitionDirection(-1);
            setIsTransitioning(true);
            hasStartedTurn.current = true;
            dragStartPos.current = clientX; // reset start position
          }
        }
      }
    } else {
      const currentDeltaX = clientX - dragStartPos.current;
      let progress = 0;
      const turnDistance = 480 * scale;
      
      if (dragDirection.current === 1) {
        progress = Math.max(0, Math.min(1, -currentDeltaX / turnDistance));
      } else {
        progress = Math.max(0, Math.min(1, currentDeltaX / turnDistance));
      }
      
      progressMotion.set(progress);
    }
  }, [isDragging, scale, progressMotion, currentPage, isMobile, pages.length, totalSpreads]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!hasStartedTurn.current) return;

    const currentProgress = progressMotion.get();
    const threshold = 0.35;

    if (currentProgress > threshold) {
      animate(progressMotion, 1, {
        type: "spring",
        stiffness: 55,
        damping: 15,
        mass: 1.1,
        onComplete: () => {
          setCurrentPage((p) => {
            const step = isMobile ? 1 : 2;
            const minPage = isMobile ? -1 : 0;
            return Math.max(minPage, Math.min(pages.length - 1, p + dragDirection.current * step));
          });
          progressMotion.set(0);
          setIsTransitioning(false);
        }
      });
    } else {
      animate(progressMotion, 0, {
        type: "spring",
        stiffness: 40,
        damping: 25,
        mass: 1.0,
        onComplete: () => {
          progressMotion.set(0);
          setIsTransitioning(false);
        }
      });
    }
  }, [isDragging, progressMotion, dragDirection, isMobile, pages.length]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleDragMove(e);
      const handleMouseUp = () => handleDragEnd();
      
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const turnForward = () => {
    if (isTransitioning) return;
    const maxPage = pages.length - 1;
    const canTurn = isMobile ? currentPage < maxPage : Math.max(0, Math.floor((currentPage + 1) / 2)) < totalSpreads - 1;
    if (!canTurn) return;

    dragDirection.current = 1;
    setTransitionDirection(1);
    setIsTransitioning(true);
    progressMotion.set(0);
    animate(progressMotion, 1, {
      type: "spring",
      stiffness: 30,
      damping: 20,
      mass: 1.1,
      onComplete: () => {
        setCurrentPage((p) => {
          const step = isMobile ? 1 : 2;
          return Math.min(pages.length - 1, p + step);
        });
        progressMotion.set(0);
        setIsTransitioning(false);
      }
    });
  };

  const turnBackward = () => {
    if (isTransitioning) return;
    const canTurn = isMobile ? currentPage > -1 : Math.max(0, Math.floor((currentPage + 1) / 2)) > 0;
    if (!canTurn) return;

    dragDirection.current = -1;
    setTransitionDirection(-1);
    setIsTransitioning(true);
    progressMotion.set(0);
    animate(progressMotion, 1, {
      type: "spring",
      stiffness: 30,
      damping: 20,
      mass: 1.1,
      onComplete: () => {
        setCurrentPage((p) => {
          const step = isMobile ? 1 : 2;
          return Math.max(isMobile ? -1 : 0, p - step);
        });
        progressMotion.set(0);
        setIsTransitioning(false);
      }
    });
  };

  const getPageContent = (index) => {
    if (index === -1) {
      return (
        <VintagePaperPage
          pageIndex={-1}
          totalPages={pages.length}
          isFirstPage={false}
          blocks={[]}
          shadowVariants={frontShadowVariants}
        />
      );
    }
    if (index < 0 || index >= pages.length) {
      return (
        <VintagePaperPage
          pageIndex={index}
          totalPages={pages.length}
          isFirstPage={false}
          blocks={[]}
          isBackSide={true}
          shadowVariants={backShadowVariants}
        />
      );
    }
    return (
      <VintagePaperPage
        pageIndex={index}
        totalPages={pages.length}
        isFirstPage={index === 0}
        blocks={pages[index] ?? []}
        shadowVariants={frontShadowVariants}
      />
    );
  };

  // derived values
  const S = Math.max(0, Math.floor((currentPage + 1) / 2));
  const leftThickness = totalSpreads > 1 ? S / (totalSpreads - 1) : 0;
  // Mobile: clamp currentPage+1 to avoid divide-by-zero at cover (-1)
  const mobileProgress = pages.length > 1 ? Math.max(0, currentPage + 1) / pages.length : 1;
  const rightThickness = isMobile
    ? 1 - mobileProgress
    : (totalSpreads > 1 ? 1 - S / (totalSpreads - 1) : 1);

  const rotateY = useTransform(progressMotion, (p) => {
    if (transitionDirection === 1) {
      return -p * 180;
    } else {
      return -180 + p * 180;
    }
  });

  const skewY = useTransform(progressMotion, (p) => {
    const s = -Math.sin(p * Math.PI * 2) * 6;
    return transitionDirection === 1 ? s : -s;
  });

  const scaleX = useTransform(progressMotion, (p) => {
    return 1 - 0.08 * Math.sin(p * Math.PI);
  });

  const translateZ = useTransform(progressMotion, (p) => {
    return Math.sin(p * Math.PI) * 75;
  });

  const leftShadowOpacity = useTransform(progressMotion, (p) => {
    return Math.sin(p * Math.PI) * 0.38;
  });

  const rightShadowOpacity = useTransform(progressMotion, (p) => {
    return Math.sin(p * Math.PI) * 0.38;
  });

  const turningFrontShadowOpacity = useTransform(progressMotion, (p) => {
    if (transitionDirection === 1) {
      return p * 0.45;
    } else {
      return (1 - p) * 0.45;
    }
  });

  const turningBackShadowOpacity = useTransform(progressMotion, (p) => {
    if (transitionDirection === 1) {
      if (p < 0.5) return 0.45;
      return 0.45 - (p - 0.5) * 2 * (0.45 - 0.12);
    } else {
      if (p > 0.5) return 0.45;
      return 0.12 + p * 2 * (0.45 - 0.12);
    }
  });

  // Pages to render
  let leftPageNode = null;
  let rightPageNode = null;
  let turningFrontPageNode = null;
  let turningBackPageNode = null;

  if (!isMobile) {
    // Desktop: Spread-based page mapping
    const leftPageIndex = isTransitioning && transitionDirection === -1 ? S * 2 - 3 : S * 2 - 1;
    leftPageNode = getPageContent(leftPageIndex);

    const rightPageIndex = isTransitioning && transitionDirection === 1 ? S * 2 + 2 : S * 2;
    rightPageNode = getPageContent(rightPageIndex);

    const turningFrontPageIndex = transitionDirection === 1 ? S * 2 : S * 2 - 2;
    turningFrontPageNode = getPageContent(turningFrontPageIndex);

    const turningBackPageIndex = transitionDirection === 1 ? S * 2 + 1 : S * 2 - 1;
    turningBackPageNode = getPageContent(turningBackPageIndex);
  } else {
    // Mobile: Single-page notebook mapping (-1 = cover, 0..N-1 = letter pages)
    const P = currentPage;
    
    if (!isTransitioning) {
      // Static view — show exactly the current page (cover or letter)
      rightPageNode = getPageContent(P);
    } else if (transitionDirection === 1) {
      // Forward turn: current page (P) is turning, next page (P+1) revealed underneath
      rightPageNode = getPageContent(P + 1);
      turningFrontPageNode = getPageContent(P);
    } else {
      // Backward turn: going back to previous page (P-1 folds back), current (P) stays
      rightPageNode = getPageContent(P);
      turningFrontPageNode = getPageContent(P - 1);
    }

    turningBackPageNode = getPageContent(-2); // blank parchment back
  }

  const bookWidth = isMobile ? 490 : 980;
  const bookHeight = 780;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-2 py-8 layer-isolated"
    >
      {/* Hidden measure container (always fixed 470px width) */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none fixed opacity-0 -z-50"
        style={{ width: 470, left: -9999, padding: EDGE_MARGIN }}
      >
        {LETTER_BLOCKS.map((block) => (
          <div key={block.id} data-block-id={block.id}>
            <LetterBlockContent block={block} />
          </div>
        ))}
      </div>

      {/* open book scaled layout */}
      <div 
        ref={containerRef} 
        className="w-full flex justify-center items-center overflow-visible select-none"
        style={{ paddingTop: 12, paddingBottom: 12 }}
      >
        {/* Outer wrapper that accounts for scaled height so the container doesn't collapse */}
        <div
          style={{
            width: bookWidth * scale,
            height: bookHeight * scale,
            position: "relative",
            flexShrink: 0,
          }}
        >
          {/* Inner book at natural size, scaled from top-left then centered */}
          <div 
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: "top left",
              width: bookWidth,
              height: bookHeight,
              position: "absolute",
              top: 0,
              left: 0,
            }}
            className="relative flex justify-center items-center"
          >
            {/* Hardcover Casing */}
            <div 
              className="absolute inset-0 rounded-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #2a1608 0%, #170d04 100%)",
                boxShadow: "0 50px 100px rgba(0,0,0,0.85), inset 0 0 40px rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,200,100,0.15)",
              }}
            >
              {/* Left Cover Casing Gold Border */}
              {!isMobile && (
                <div className="absolute left-3 top-3 bottom-3 right-[495px] border border-amber-600/10 rounded-md pointer-events-none" />
              )}
              {/* Right Cover Casing Gold Border */}
              <div 
                className="absolute top-3 bottom-3 rounded-md pointer-events-none"
                style={{
                  left: isMobile ? "12px" : "495px",
                  right: "12px",
                  border: "1px solid rgba(255,200,100,0.1)",
                }}
              />
            </div>

            {/* Page Stacks (Thickness) */}
            {!isMobile && <PageThickness Left={true} thickness={leftThickness} />}
            <PageThickness Left={false} thickness={rightThickness} />

            {/* Spine Depth shadow under pages */}
            {!isMobile && (
              <div 
                className="absolute top-0 bottom-0 left-[485px] w-[10px]"
                style={{
                  background: "linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)",
                  zIndex: 15,
                }}
              />
            )}

            {/* Left Static Page (desktop only) */}
            {!isMobile && (
              <div 
                className="absolute left-[10px] top-[10px] w-[470px] h-[760px]"
                style={{ zIndex: 10 }}
              >
                {leftPageNode}
                <motion.div 
                  style={{ opacity: leftShadowOpacity }}
                  className="absolute inset-0 bg-black pointer-events-none z-45 rounded-[3px]"
                />
              </div>
            )}

            {/* ── Previous page visible behind current page (mobile "don't hide old page") ── */}
            {isMobile && currentPage >= 0 && !isTransitioning && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  width: 'calc(100% - 20px)',
                  height: '760px',
                  zIndex: 7,
                  transform: 'translateX(-10px) scale(0.985)',
                  transformOrigin: 'right center',
                  pointerEvents: 'none',
                  filter: 'brightness(0.72) saturate(0.8)',
                }}
              >
                {getPageContent(currentPage - 1)}
              </div>
            )}

            {/* Right Static Page – on mobile this is the full-width active page */}
            <div 
              className="absolute top-[10px] h-[760px]"
              style={{ 
                zIndex: 10,
                left: isMobile ? "10px" : undefined,
                right: isMobile ? "10px" : "10px",
                width: isMobile ? "calc(100% - 20px)" : "470px",
              }}
            >
              {rightPageNode}
              <motion.div 
                style={{ opacity: rightShadowOpacity }}
                className="absolute inset-0 bg-black pointer-events-none z-45 rounded-[3px]"
              />
            </div>

            {/* Active Turning Page */}
            {isTransitioning && (
              <motion.div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: isMobile ? "10px" : undefined,
                  right: isMobile ? "10px" : "10px",
                  width: isMobile ? "calc(100% - 20px)" : "470px",
                  height: "760px",
                  transformOrigin: "left center",
                  rotateY,
                  skewY,
                  scaleX,
                  z: translateZ,
                  transformStyle: "preserve-3d",
                  zIndex: 25,
                }}
                className="pointer-events-none page-transform-3d"
              >
                {/* Turning Page - Front Face */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: "translateZ(1px)",
                  }}
                  className="page-transform-3d"
                >
                  {turningFrontPageNode}
                  <motion.div 
                    style={{ opacity: turningFrontShadowOpacity }}
                    className="absolute inset-0 bg-black pointer-events-none z-45 rounded-[3px]"
                  />
                </div>

                {/* Turning Page - Back Face */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: "rotateY(180deg) translateZ(1px)",
                  }}
                  className="page-transform-3d"
                >
                  {turningBackPageNode}
                  <motion.div 
                    style={{ opacity: turningBackShadowOpacity }}
                    className="absolute inset-0 bg-black pointer-events-none z-45 rounded-[3px]"
                  />
                </div>
              </motion.div>
            )}

            {/* Drag Overlay Handle */}
            <div 
              className="absolute inset-[10px] z-30 cursor-grab active:cursor-grabbing"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            />

            {/* Binding Rings */}
            <BindingRings isMobile={isMobile} />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap z-30 px-4">
        {(isMobile ? currentPage > -1 : S > 0) && (
          <PageButton
            label="Previous Page"
            onClick={turnBackward}
            delay={0.1}
          />
        )}
        {isLastPage ? (
          <PageButton
            label="Next Chapter"
            onClick={onContinue}
            delay={0.2}
            isFinal
          />
        ) : (
          <PageButton
            label="Next Page"
            onClick={turnForward}
            delay={0.2}
          />
        )}
      </div>
    </motion.div>
  );
}

/* ─── WAX SEAL ───────────────────────────────────────────────────────── */
function WaxSeal({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.93 }}
      className="relative flex flex-col items-center gap-5 group"
    >
      <div className="flex gap-6">
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-16 bg-gradient-to-b from-amber-200/60 to-amber-200/10"
        />
        <motion.div
          animate={{ rotate: [2, -2, 2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="w-px h-16 bg-gradient-to-b from-amber-200/60 to-amber-200/10"
        />
      </div>

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
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-amber-100/40 text-[10px] tracking-[4px] uppercase whitespace-nowrap"
        >
          tap to open
        </motion.div>
      </div>
    </motion.button>
  );
}

/* ─── ENVELOPE VIEW ──────────────────────────────────────────────────── */
function EnvelopeView({ onOpen }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center justify-center min-h-screen px-6"
    >
      <motion.p
        initial={{ opacity: 0, letterSpacing: "2px" }}
        animate={{ opacity: 1, letterSpacing: "10px" }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="uppercase text-amber-100/40 text-xs mb-16 tracking-[10px]"
      >
        A Letter For You
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative"
        style={{ width: "min(380px, 88vw)" }}
      >
        <div className="relative bg-gradient-to-b from-[#1e160e] to-[#170f08] border border-amber-200/15 rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_60px_rgba(180,120,40,0.08)]">
          <div className="relative w-full overflow-hidden" style={{ paddingBottom: "44%" }}>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 380 168"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="flapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2a1c0f" />
                  <stop offset="100%" stopColor="#1a1008" />
                </linearGradient>
              </defs>
              <polygon points="0,0 380,0 190,168" fill="url(#flapGrad)" />
              <line x1="0" y1="0" x2="190" y2="168" stroke="rgba(255,200,100,0.08)" strokeWidth="0.5" />
              <line x1="380" y1="0" x2="190" y2="168" stroke="rgba(255,200,100,0.08)" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="380" y2="0" stroke="rgba(255,200,100,0.15)" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="px-10 pb-12 pt-4 flex flex-col items-center gap-6 -mt-2">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-amber-200/10" />
              <span className="text-amber-200/20 text-xs">✦</span>
              <div className="flex-1 h-px bg-amber-200/10" />
            </div>
            <div className="text-center">
              <p className="text-amber-100/25 text-[10px] tracking-[5px] uppercase mb-2">To</p>
              <p className="text-amber-50 text-3xl" style={FONT_SCRIPT}>
                My Most Favourite Girl
              </p>
              <p className="text-amber-100/20 text-[10px] tracking-[4px] uppercase mt-2">in the World</p>
            </div>
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-amber-200/10" />
              <span className="text-amber-200/20 text-xs">✦</span>
              <div className="flex-1 h-px bg-amber-200/10" />
            </div>
            <div className="self-end border border-amber-200/15 rounded-sm w-12 h-14 flex items-center justify-center bg-amber-200/3">
              <span className="text-amber-200/30 text-lg">♡</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 left-6 right-6 h-8 bg-black/40 blur-xl rounded-full" />
      </motion.div>

      <div className="mt-16 mb-8">
        <WaxSeal onClick={onOpen} />
      </div>
    </motion.div>
  );
}

/* ─── SECTION ROOT ───────────────────────────────────────────────────── */
function LetterSection() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  return (
    <section className="relative min-h-screen bg-[#0f0b07] overflow-hidden layer-isolated">
      {/* Ambient blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.15, 0.07] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-amber-200/10 blur-[160px] rounded-full pointer-events-none glow-stabilized gpu-accelerated"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-orange-300/10 blur-[140px] rounded-full pointer-events-none glow-stabilized gpu-accelerated"
      />

      {/* Dust particles */}
      <DustParticles />

      {/* Hairline borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

      {/* Side labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="hidden md:flex flex-col items-center gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-10"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl" }}>written</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl" }}>with love</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="hidden md:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-10"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl" }}>forever</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl" }}>yours</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,200,100,0.04),transparent_65%)] pointer-events-none" />

      {/* Views */}
      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.85, y: -40 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <EnvelopeView onOpen={() => setOpened(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, scale: 0.95, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <LetterContent onContinue={() => navigate("/final")} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default LetterSection;