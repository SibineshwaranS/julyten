import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import localGiftImg from "../assets/gift/gift.jpg";
import localPerfectVideo from "../assets/video/video.mp4";
import { getAssetUrl } from "../config/cdn";

const giftImg = getAssetUrl(localGiftImg, "gift/gift.jpg");
const perfectVideo = getAssetUrl(localPerfectVideo, "video/video.mp4");

// ─── Perfect - Ed Sheeran lyrics synced to 0–97s ──────────────────────────────
const lyrics = [
  { time: 2,  text: "I found a love for me" },
  { time: 9,  text: "Darling, just dive right in and follow my lead" },
  { time: 13, text: "Well, I found a girl, beautiful and sweet" },
  { time: 25, text: "Oh, I never knew you were the someone waiting for me" },
  { time: 31, text: "'Cause we were just kids when we fell in love" },
  { time: 36, text: "Not knowing what it was" },
  { time: 39, text: "I will not give you up this time" },
  { time: 47, text: "But darling, just kiss me slow, your heart is all I own" },
  { time: 55, text: "And in your eyes, you're holding mine" },
  { time: 61, text: "Baby, I'm dancing in the dark" },
  { time: 69, text: "With you between my arms" },
  { time: 73, text: "Barefoot on the grass" },
  { time: 77, text: "Listening to our favourite song" },
  { time: 80, text: "When you said you looked a mess" },
  { time: 83, text: "I whispered underneath my breath" },
  { time: 87, text: "But you heard it" },
  { time: 89, text: "Darling, you look perfect tonight" },
];

// ─── Puzzle Data ───────────────────────────────────────────────────────────────
const puzzles = [
  {
    question: "Where did our conversations begin?",
    hint: "Tap the letters in order to spell the answer",
    answer: "SNAPCHAT",
    letters: ["S","N","A","P","C","H","A","T"],
  },
  {
    question: "What's the name I always call your brother by?",
    hint: "Tap the letters in order to spell the answer",
    answer: "MACHI",
    letters: ["M","A","C","H","I"],
  },
  {
    question: "What's my favourite way to spend time with you?",
    hint: "Tap the letters in order to spell the answer",
    answer: "BUSTRAVEL",
    letters: ["B","U","S","T","R","A","V","E","L"],
  },
];

const ShieldHeartIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8a2.5 2.5 0 0 1 2.5 2.5c0 2.5-2.5 4.5-2.5 4.5s-2.5-2-2.5-4.5A2.5 2.5 0 0 1 12 8z" fill="url(#gold-gradient)" fillOpacity="0.2" />
  </svg>
);

const RadiantSunIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" fill="url(#gold-gradient)" fillOpacity="0.2" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const InfinityHeartIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 13c-1.2-1.2-3.1-1.2-4.2 0a3 3 0 0 0 0 4.2c1.2 1.2 3.1 1.2 4.2 0l4-4c1.2-1.2 3.1-1.2 4.2 0a3 3 0 0 1 0 4.2c-1.2 1.2-3.1 1.2-4.2 0l-4-4Z" />
    <path d="M12 6.5C11.5 5 9.5 3.5 7.5 3.5 4.5 3.5 2 6 2 9c0 4.8 5 8 10 11.5 5-3.5 10-6.7 10-11.5 0-3-2.5-5.5-5.5-5.5-2 0-4 1.5-4.5 3" opacity="0.35" />
  </svg>
);

const RoseIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" opacity="0.2" fill="url(#gold-gradient)" fillOpacity="0.1"/>
    <path d="M12 3c-1.5 3-4.5 4-4.5 7.5a4.5 4.5 0 0 0 9 0C16.5 7 13.5 6 12 3Z" />
    <path d="M12 8c-.8 1.5-2.2 2-2.2 3.8a2.2 2.2 0 0 0 4.4 0c0-1.8-1.4-2.3-2.2-3.8Z" />
    <path d="M7.5 12.5a4.5 4.5 0 0 0 1 4M15.5 12.5a4.5 4.5 0 0 1-1 4" opacity="0.5" />
  </svg>
);

const SparkleStarIcon = ({ size = 44 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#gold-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20" opacity="0.3" strokeDasharray="3 3" />
    <path d="M12 3L9 9l-6 3 6 3 3 6 3-6 6-3-6-3-3-6Z" fill="url(#gold-gradient)" fillOpacity="0.2" />
    <path d="M5 5h.01M19 5h.01M19 19h.01M5 19h.01" strokeWidth="2" />
  </svg>
);

const GoldFlourishDivider = () => (
  <svg width="180" height="24" viewBox="0 0 180 24" fill="none" stroke="url(#gold-gradient)" strokeWidth="1.2" className="mt-4 opacity-75">
    <path d="M10 12c15 0 25-6 35-6s20 6 35 6" />
    <path d="M25 12c10 0 18-3 25-3s12 3 20 3" opacity="0.4" />
    <path d="M170 12c-15 0-25-6-35-6s-20 6-35 6" />
    <path d="M155 12c-10 0-18-3-25-3s-12 3-20 3" opacity="0.4" />
    <path d="M90 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="url(#gold-gradient)" />
    <circle cx="78" cy="12" r="2" fill="url(#gold-gradient)" />
    <circle cx="102" cy="12" r="2" fill="url(#gold-gradient)" />
    <circle cx="66" cy="12" r="1.2" fill="url(#gold-gradient)" opacity="0.6" />
    <circle cx="114" cy="12" r="1.2" fill="url(#gold-gradient)" opacity="0.6" />
  </svg>
);

const promises = [
  { icon: (props) => <ShieldHeartIcon {...props} />, text: "I promise to always be there for you, no matter what." },
  { icon: (props) => <RadiantSunIcon {...props} />, text: "I promise to make you smile even on your hardest days." },
  { icon: (props) => <InfinityHeartIcon {...props} />, text: "I promise to never stop choosing you, every single day." },
  { icon: (props) => <RoseIcon {...props} />, text: "I promise to love every version of you, always." },
  { icon: (props) => <SparkleStarIcon {...props} />, text: "I promise that our best memories are still yet to come." },
];

// ─── Fixed grid positions for puzzle letters ───────────────────────────────────
function getGridPositions(count) {
  const cols = Math.ceil(Math.sqrt(count + 1));
  const positions = [];
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 12 + (col / cols) * 76 + (Math.random() * 6 - 3);
    const y = 15 + (row / Math.ceil(count / cols)) * 65 + (Math.random() * 6 - 3);
    positions.push({ x, y });
  }
  return positions.sort(() => Math.random() - 0.5);
}

// ─── Puzzle Component ──────────────────────────────────────────────────────────
function Puzzle({ puzzle, onSolve }) {
  const answer = puzzle.answer.toUpperCase();
  const answerLetters = answer.split("");
  const allLetters = puzzle.letters;

  const [positions] = useState(() => getGridPositions(allLetters.length));
  const [selected, setSelected] = useState([]);
  const [wrong, setWrong] = useState(false);
  const [solved, setSolved] = useState(false);
  const svgRef = useRef(null);
  const dotRefs = useRef({});

  const handleTap = (i) => {
    if (solved || wrong) return;
    if (selected.includes(i)) return;

    const stepIdx = selected.length;
    const needed = answerLetters[stepIdx];

    if (allLetters[i] !== needed) {
      setWrong(true);
      setTimeout(() => { setSelected([]); setWrong(false); }, 700);
      return;
    }

    const next = [...selected, i];
    setSelected(next);

    if (next.length === answerLetters.length) {
      setSolved(true);
      setTimeout(() => onSolve(), 1000);
    }
  };

  const getCenter = (i) => {
    const el = dotRefs.current[i];
    if (!el || !svgRef.current) return null;
    const svgRect = svgRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: elRect.left + elRect.width / 2 - svgRect.left,
      y: elRect.top + elRect.height / 2 - svgRect.top,
    };
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg rounded-[24px] border border-amber-100/10 bg-white/[0.03] px-7 py-6 text-center overflow-hidden"
      >
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
        <p className="text-amber-100/40 text-[10px] tracking-[5px] uppercase mb-3">Solve to unlock</p>
        <h2 className="text-xl sm:text-2xl text-amber-50 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {puzzle.question}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-100/10 bg-white/[0.02]"
      >
        <p className="text-amber-100/45 text-xs">
          Tap letters <span className="text-amber-200/70">in order</span> to spell the answer. Wrong tap resets!
        </p>
      </motion.div>

      <motion.div
        animate={wrong ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-lg h-[240px] md:h-[280px] border border-amber-100/10 rounded-[24px] bg-white/[0.02] overflow-hidden"
      >
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-200/15 to-transparent" />
        <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {selected.map((idx, i) => {
            if (i === 0) return null;
            const from = getCenter(selected[i - 1]);
            const to = getCenter(idx);
            if (!from || !to) return null;
            return (
              <motion.line
                key={`${selected[i-1]}-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={solved ? "rgba(134,239,172,0.6)" : "rgba(255,200,120,0.5)"}
                strokeWidth="2.5" strokeLinecap="round"
              />
            );
          })}
        </svg>

        {allLetters.map((letter, i) => {
          const pos = positions[i];
          const isSelected = selected.includes(i);
          const orderNum = selected.indexOf(i);
          return (
            <motion.button
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              onClick={() => handleTap(i)}
              whileHover={!solved && !isSelected ? { scale: 1.2 } : {}}
              whileTap={!solved ? { scale: 0.85 } : {}}
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
              className={`absolute z-20 w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300 select-none ${
                solved
                  ? "border-green-400/60 bg-green-400/10 text-green-300 shadow-[0_0_16px_rgba(134,239,172,0.3)]"
                  : isSelected
                  ? "border-amber-300/80 bg-amber-200/15 text-amber-100 shadow-[0_0_20px_rgba(255,200,120,0.4)]"
                  : wrong
                  ? "border-red-400/40 bg-red-400/5 text-red-300/70"
                  : "border-amber-100/20 bg-black/30 text-amber-100/80 hover:border-amber-200/50"
              }`}
            >
              {letter}
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-300/90 text-[9px] text-black font-bold flex items-center justify-center"
                >
                  {orderNum + 1}
                </motion.span>
              )}
            </motion.button>
          );
        })}

        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-30 rounded-[24px]"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-16 h-16 rounded-full border border-green-400/30 bg-green-400/10 flex items-center justify-center mb-4"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-green-300">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <p className="text-green-300 text-sm tracking-[4px] uppercase mb-1">Correct!</p>
              <p className="text-amber-100/50 text-xs">Unlocking your gift...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {answerLetters.map((l, i) => (
          <motion.div
            key={i}
            animate={selected.length > i ? { scale: [1, 1.2, 1] } : {}}
            className={`w-8 h-8 rounded-lg border text-xs flex items-center justify-center font-medium transition-all duration-300 ${
              selected.length > i
                ? "border-amber-200/60 bg-amber-200/10 text-amber-100"
                : "border-amber-100/10 text-amber-100/15"
            }`}
          >
            {selected.length > i ? l : "·"}
          </motion.div>
        ))}
      </div>

      {wrong && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="text-red-300/70 text-xs tracking-[3px] uppercase"
        >
          ✗ Wrong — try again!
        </motion.p>
      )}
    </div>
  );
}

// ─── Video Gift (replaces SongGift) ───────────────────────────────────────────
function VideoGift({ onFinished }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(97); // known duration
  const [currentLyric, setCurrentLyric] = useState("");
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimer = useRef(null);

  const VIDEO_DURATION = 97; // seconds

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const update = () => {
      const t = video.currentTime;
      const dur = video.duration || VIDEO_DURATION;
      setProgress((t / dur) * 100);
      setCurrentTime(t);
      // find current lyric (only up to 97s)
      if (t <= VIDEO_DURATION) {
        const active = [...lyrics].reverse().find(l => t >= l.time);
        if (active) setCurrentLyric(active.text);
      }
    };

    const onEnd = () => {
      setPlaying(false);
      setProgress(100);
      setFinished(true);
      onFinished();
    };

    const onLoaded = () => setDuration(video.duration || VIDEO_DURATION);

    video.addEventListener("timeupdate", update);
    video.addEventListener("ended", onEnd);
    video.addEventListener("loadedmetadata", onLoaded);
    return () => {
      video.removeEventListener("timeupdate", update);
      video.removeEventListener("ended", onEnd);
      video.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  const startVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(() => { setPlaying(true); setStarted(true); }).catch(() => {});
  };

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) { video.pause(); setPlaying(false); }
    else { video.play(); setPlaying(true); }
  };

  const seek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * (video.duration || VIDEO_DURATION);
  };

  const handleVideoClick = () => {
    if (!started) return;
    toggle();
    // show controls briefly on tap
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative rounded-[28px] border border-amber-100/15 bg-black overflow-hidden shadow-[0_0_80px_rgba(255,180,80,0.12)]">
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent z-10" />

        {/* ── 16:9 Video container ── */}
        <div
          className="relative w-full"
          style={{ paddingBottom: "56.25%" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => started && playing && setShowControls(false)}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            preload="metadata"
            onClick={handleVideoClick}
            style={{ cursor: started ? "pointer" : "default" }}
          >
            <source src={perfectVideo} type="video/mp4" />
          </video>

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Gift 01 label */}
          <div className="absolute top-4 left-5 z-20">
            <span className="text-amber-100/50 text-[10px] tracking-[5px] uppercase">Gift 01 · A Song For You</span>
          </div>

          {/* Mute toggle */}
          {started && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: showControls ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => { e.stopPropagation(); setMuted(m => !m); if(videoRef.current) videoRef.current.muted = !muted; }}
              className="absolute top-4 right-5 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center"
            >
              {muted ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-100/70">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-100/70">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              )}
            </motion.button>
          )}

          {/* Pre-play overlay */}
          {!started && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/50 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="mb-5 text-center px-6"
              >
                <p className="text-amber-200/60 text-[10px] tracking-[6px] uppercase mb-3">Ed Sheeran · Perfect</p>
                <h3 className="text-white text-2xl md:text-3xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  This song is dedicated to you
                </h3>
                <p className="text-amber-100/40 text-xs">she is so perfect ✦</p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={startVideo}
                className="w-20 h-20 rounded-full border-2 border-amber-200/50 bg-amber-200/10 backdrop-blur-sm flex items-center justify-center shadow-[0_0_50px_rgba(255,200,120,0.3)]"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-amber-100 ml-1.5">
                  <path d="M5 3l14 9-14 9V3z"/>
                </svg>
              </motion.button>
              <p className="text-amber-100/30 text-xs mt-5 tracking-[3px] uppercase">Tap to play</p>
            </motion.div>
          )}

          {/* Play/pause overlay icon (brief flash on toggle) */}
          {started && (
            <AnimatePresence>
              {!playing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }} transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                >
                  <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-white/80 ml-1">
                      <path d="M5 3l14 9-14 9V3z"/>
                    </svg>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Live lyric display */}
          {started && (
            <div className="absolute bottom-14 left-0 right-0 flex justify-center px-6 pointer-events-none z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLyric}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  {currentLyric ? (
                    <p
                      className="text-white/85 text-base md:text-xl italic leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
                      style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7)" }}
                    >
                      {currentLyric}
                    </p>
                  ) : (
                    <p className="text-white/30 text-sm">♪ ♪ ♪</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Progress bar (always visible at bottom of video) */}
          {started && (
            <div className="absolute bottom-0 left-0 right-0 z-20 px-0">
              <div
                onClick={seek}
                className="w-full h-1 bg-white/10 cursor-pointer group"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-300/80 to-amber-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Controls bar below video ── */}
        {started && (
          <div className="flex items-center justify-between px-5 py-3 bg-black/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={toggle}
                className="w-9 h-9 rounded-full border border-amber-200/25 bg-amber-200/8 flex items-center justify-center"
              >
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-200/90">
                    <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-200/90 ml-0.5">
                    <path d="M5 3l14 9-14 9V3z"/>
                  </svg>
                )}
              </motion.button>
              <span className="text-amber-100/40 text-[11px] font-mono">
                {formatTime(currentTime)} / {formatTime(duration || VIDEO_DURATION)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Equalizer when playing */}
              <AnimatePresence>
                {playing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-end gap-0.5 h-5"
                  >
                    {[0.4,0.9,0.5,1,0.6,0.8,0.4].map((h, i) => (
                      <motion.div key={i}
                        animate={{ scaleY: [h, 1, h*0.3, 0.8, h] }}
                        transition={{ duration: 0.5 + i*0.06, repeat: Infinity, delay: i*0.07 }}
                        className="w-0.5 rounded-full bg-amber-300/60"
                        style={{ height: "100%", transformOrigin: "bottom", scaleY: h }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-amber-200/40 text-[10px] tracking-[2px] uppercase hidden sm:block">
                {finished ? "♡ This song is yours" : "Perfect · Ed Sheeran"}
              </p>
            </div>
          </div>
        )}

        {/* Finished message */}
        <AnimatePresence>
          {finished && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden"
            >
              <div className="px-8 py-5 text-center border-t border-amber-200/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-px bg-amber-200/15" />
                  <span className="text-amber-200/50 text-xs">✦</span>
                  <div className="flex-1 h-px bg-amber-200/15" />
                </div>
                <p className="text-amber-100/50 text-sm italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  This song is yours, always ✦
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Promises Gift — cinematic one-by-one reveal ───────────────────────────────
function PromisesGift({ onAllShown, onComplete }) {
  const [current, setCurrent] = useState(0);      // which promise is "active"
  const [revealed, setRevealed] = useState([0]);   // which have been revealed
  const [allDone, setAllDone] = useState(false);
  const [entering, setEntering] = useState(false);

  const showNext = () => {
    if (entering) return;
    const next = current + 1;
    if (next < promises.length) {
      setEntering(true);
      setTimeout(() => {
        setCurrent(next);
        setRevealed(r => [...r, next]);
        setEntering(false);
      }, 300);
    } else {
      setAllDone(true);
      onAllShown?.();
    }
  };

  const isLast = current === promises.length - 1;

  const slideVariants = {
    enter: {
      x: 30,
      opacity: 0,
      scale: 0.98,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      x: -30,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-lg mx-auto"
    >
      {!allDone ? (
        <>
          {/* Header */}
          <div className="text-center mb-10 flex flex-col items-center">
            <span className="text-amber-400 text-[6px] tracking-[0px] mb-2 animate-pulse">✦</span>
            <p 
              className="text-amber-200/40 text-[10px] sm:text-[11px] tracking-[8px] uppercase mb-3 font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Gift 02
            </p>
            <h3 
              className="text-5xl sm:text-6xl mb-2 font-light select-none" 
              style={{ 
                fontFamily: "'Great Vibes', cursive", 
                textShadow: "0 0 30px rgba(255,180,80,0.4)",
                background: "linear-gradient(to bottom, #fff6d6 20%, #facc15 60%, #c27d00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block"
              }}
            >
              5 Promises
            </h3>
            <p 
              className="text-amber-100/55 text-xs sm:text-sm tracking-[5px] uppercase font-light mt-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              From my heart, to you
            </p>
            {/* Luxury gold flourish divider */}
            <GoldFlourishDivider />
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {promises.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  width: i === current ? 24 : 6,
                  opacity: revealed.includes(i) ? 1 : 0.25,
                  backgroundColor: i === current ? "rgba(245,158,11,0.8)" : "rgba(245,158,11,0.3)",
                }}
                transition={{ duration: 0.3 }}
                className="h-1.5 rounded-full"
              />
            ))}
          </div>

          {/* Promise card — large cinematic display */}
          <div className="relative min-h-[320px] flex flex-col items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <div className="relative overflow-hidden p-6 text-center flex flex-col items-center justify-center">
                  {/* Number */}
                  <p className="text-amber-300/60 text-[10px] tracking-[8px] uppercase mb-4 font-mono font-semibold">
                    Promise {String(current + 1).padStart(2, "0")} / 05
                  </p>

                  {/* Icon with glowing halo */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 280 }}
                    className="mb-5 flex justify-center relative drop-shadow-[0_4px_12px_rgba(245,158,11,0.25)]"
                  >
                    <div className="absolute inset-0 bg-amber-400/10 blur-xl rounded-full scale-150 pointer-events-none" />
                    <div className="relative">
                      {typeof promises[current].icon === "function" ? promises[current].icon({ size: 56 }) : promises[current].icon}
                    </div>
                  </motion.div>

                  {/* Divider lines */}
                  <div className="flex items-center justify-center gap-3 w-16 mb-5 opacity-40">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-200" />
                    <span className="text-amber-200 text-[8px]">✦</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-200" />
                  </div>

                  {/* Promise text */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="text-amber-100/95 text-xl sm:text-2xl md:text-3xl leading-relaxed italic max-w-lg mx-auto"
                    style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                  >
                    "{promises[current].text}"
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Previous promises — mini list */}
          {revealed.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2 mb-6"
            >
              {revealed.slice(0, -1).map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 px-4 py-2.5 rounded-[14px] border border-amber-200/10 bg-[#130d08]/40"
                >
                  <span className="flex-shrink-0 mt-0.5">
                    {typeof promises[idx].icon === "function" ? promises[idx].icon({ size: 16 }) : promises[idx].icon}
                  </span>
                  <span className="text-amber-100/70 text-xs leading-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {promises[idx].text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.button
            key="next-promise"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={showNext}
            className="relative w-full h-[52px] border overflow-hidden transition-all duration-300 cursor-pointer"
            style={{
              borderRadius: "2px",
              border: isLast ? "1px solid rgba(255,190,100,0.45)" : "1px solid rgba(220,190,130,0.28)",
              background: isLast 
                ? "linear-gradient(135deg, rgba(140,80,20,0.6), rgba(80,40,10,0.8))"
                : "linear-gradient(135deg, rgba(60,35,8,0.45), rgba(30,15,3,0.65))",
              boxShadow: isLast
                ? "0 0 35px rgba(255,180,80,0.25), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,150,0.25)"
                : "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,200,100,0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100/5 via-transparent to-amber-100/5" />
            <motion.div
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent skew-x-12"
            />
            {/* Ornamental lines inside button */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-30">
              <div className="flex-1 h-px bg-amber-200/60" />
              <span className="text-amber-200 text-[8px]">✦</span>
              <div className="flex-1 h-px bg-amber-200/60" />
            </div>
            <span
              className="relative text-amber-50/90 text-[10px] tracking-[5px] uppercase font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {isLast ? "See All Promises ✦" : "Next Promise ✦"}
            </span>
          </motion.button>
        </>
      ) : (
        <motion.div
          key="summary-view"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center w-full"
        >
          {/* Summary Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <span className="text-amber-400 text-[6px] tracking-[0px] mb-2 animate-pulse">✦</span>
            <p 
              className="text-amber-200/40 text-[10px] sm:text-[11px] tracking-[8px] uppercase mb-3 font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Vows of My Heart
            </p>
            <h3 
              className="text-5xl sm:text-6xl mb-2 font-light select-none text-center" 
              style={{ 
                fontFamily: "'Great Vibes', cursive", 
                textShadow: "0 0 30px rgba(255,180,80,0.4)",
                background: "linear-gradient(to bottom, #fff6d6 20%, #facc15 60%, #c27d00 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block"
              }}
            >
              All My Promises
            </h3>
            <p 
              className="text-amber-100/55 text-xs sm:text-sm tracking-[5px] uppercase font-light mt-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              To love, protect, and cherish you
            </p>
            <GoldFlourishDivider />
          </div>

          {/* Promises Stack in the middle - no box/cart look */}
          <div className="w-full flex flex-col gap-6 mb-10 py-2">
            {promises.map((promise, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 + 0.2, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0 mt-1.5 p-1 rounded-full bg-amber-400/5 border border-amber-300/10">
                  {typeof promise.icon === "function" ? promise.icon({ size: 20 }) : promise.icon}
                </div>
                <div className="flex-1">
                  <p 
                    className="text-amber-100/90 text-base sm:text-lg italic leading-relaxed" 
                    style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                  >
                    "{promise.text}"
                  </p>
                  {idx < promises.length - 1 && (
                    <div className="h-px w-full bg-gradient-to-r from-amber-200/10 via-transparent to-transparent mt-4 opacity-50" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Unlock Gift 03 Button */}
          <motion.button
            key="unlock-gift-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: promises.length * 0.15 + 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onComplete}
            className="relative w-full h-[52px] border overflow-hidden transition-all duration-300 cursor-pointer"
            style={{
              borderRadius: "2px",
              border: "1px solid rgba(255,190,100,0.45)",
              background: "linear-gradient(135deg, rgba(140,80,20,0.6), rgba(80,40,10,0.8))",
              boxShadow: "0 0 35px rgba(255,180,80,0.25), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,150,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100/5 via-transparent to-amber-100/5" />
            <motion.div
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent skew-x-12"
            />
            {/* Ornamental lines inside button */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-30">
              <div className="flex-1 h-px bg-amber-200/60" />
              <span className="text-amber-200 text-[8px]">✦</span>
              <div className="flex-1 h-px bg-amber-200/60" />
            </div>
            <span
              className="relative text-amber-50/90 text-[10px] tracking-[5px] uppercase font-semibold"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Unlock Gift 03 ✦
            </span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Surprise Gift ─────────────────────────────────────────────────────────────
function SurpriseGift() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="relative rounded-[32px] border border-amber-100/15 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
        <div className="relative h-56 md:h-64 overflow-hidden">
          <img src={giftImg} alt="surprise gift" className="w-full h-full object-cover blur-xl scale-110 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0a07]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-20 h-20 rounded-full border border-amber-200/20 bg-amber-200/5 flex items-center justify-center shadow-[0_0_40px_rgba(255,200,120,0.15)]"
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-amber-200/60">
                <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
                <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            </motion.div>
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-amber-200/60 text-xs tracking-[5px] uppercase"
            >
              A surprise is waiting...
            </motion.p>
          </div>
        </div>
        <div className="px-8 py-8 text-center">
          <p className="text-amber-100/35 text-[10px] tracking-[5px] uppercase mb-3">Gift 03</p>
          <h3 className="text-3xl text-amber-50 mb-5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            A Surprise Gift Is There For You
          </h3>
          <p className="text-amber-100/50 text-sm leading-7 mb-6">
            I have something truly special waiting for you in real life. This is just a little peek — the real surprise will be in your hands when we meet.
          </p>
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="flex-1 h-px bg-amber-200/10" />
            <span className="text-amber-200/25">✦</span>
            <div className="flex-1 h-px bg-amber-200/10" />
          </div>
          <p className="text-amber-100/25 text-[10px] tracking-[4px] uppercase">until then, keep smiling ✦</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main GiftSection ──────────────────────────────────────────────────────────
const giftBoxes = [
  { icon: "music", label: "Gift 01", title: "A Song" },
  { icon: "promise", label: "Gift 02", title: "5 Promises" },
  { icon: "gift", label: "Gift 03", title: "A Surprise" },
];

export default function GiftSection() {
  const navigate = useNavigate();
  const [stage, setStage] = useState("intro");
  const [currentGift, setCurrentGift] = useState(0);
  const [showNextChapter, setShowNextChapter] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [promisesAllShown, setPromisesAllShown] = useState(false);

  const startPuzzle = (i) => { setCurrentGift(i); setStage(`puzzle-${i}`); };
  const openGift = (i) => {
    setStage(`gift-${i}`);
    if (i === 2) setTimeout(() => setShowNextChapter(true), 1500);
  };

  const isUnlocked = (i) => {
    const giftNum = parseInt(stage.split("-")[1]);
    return stage === `gift-${i}` || (!isNaN(giftNum) && giftNum > i);
  };

  const giftComponents = [
    <VideoGift onFinished={() => setVideoFinished(true)} />,
    <PromisesGift
      onAllShown={() => setPromisesAllShown(true)}
      onComplete={() => startPuzzle(2)}
    />,
    <SurpriseGift />,
  ];

  // Gift 0 (video): next only after video finished
  // Gift 1 (promises): next only after all promises shown
  const canProceed = (i) => {
    if (i === 0) return videoFinished;
    if (i === 1) return promisesAllShown;
    return true;
  };

  return (
    <section className="relative min-h-screen bg-[#0d0a07] overflow-hidden">

      {/* SVG Gradient definition */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <defs>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glows */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-150px] left-[-100px] w-[600px] h-[600px] bg-amber-200/10 blur-[160px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] bg-orange-300/10 blur-[160px] rounded-full pointer-events-none"
      />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

      {/* Side decorations */}
      <div className="hidden md:flex flex-col items-center gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-10">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl" }}>gifts</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl" }}>for you</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </div>
      <div className="hidden md:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-10">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl" }}>with love</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl" }}>always</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-20 px-6 gap-10 md:px-16">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <p className="tracking-[6px] uppercase text-amber-100/40 text-xs mb-4">Birthday Gifts</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl text-amber-50" style={{ fontFamily: "'Great Vibes', cursive" }}>
            For You, Ammuni
          </h1>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-200/35" />
            <span className="text-amber-200/40">❦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-200/35" />
          </div>
        </motion.div>

        {/* Gift tracker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4"
        >
          {giftBoxes.map((g, i) => {
            const unlocked = isUnlocked(i);
            const active = stage === `puzzle-${i}` || stage === `gift-${i}`;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all duration-500 ${
                    unlocked ? "border-amber-200/60 bg-amber-200/10 shadow-[0_0_20px_rgba(255,200,120,0.25)]" :
                    active ? "border-amber-200/40 bg-amber-200/5 animate-pulse" :
                    "border-amber-100/10 bg-white/[0.02]"
                  }`}>
                    {unlocked ? (
                      g.icon === "music" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-200/80"><path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                      ) : g.icon === "promise" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-200/80"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-200/80"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                      )
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-100/15"><circle cx="12" cy="12" r="10"/><path d="M9 10a3 3 0 1 1 4 2.83V14" strokeLinecap="round"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>
                    )}
                  </div>
                  <span className={`text-[9px] tracking-[2px] uppercase transition-all duration-500 ${unlocked ? "text-amber-200/50" : "text-amber-100/15"}`}>
                    {g.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`w-12 h-px transition-all duration-700 ${unlocked ? "bg-amber-200/40" : "bg-amber-100/10"}`} />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Stage content */}
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">

            {/* Intro */}
            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative rounded-[28px] border border-amber-100/10 bg-white/[0.03] p-8 text-center overflow-hidden max-w-lg w-full">
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber-200/30 to-transparent" />
                  <div className="w-16 h-16 rounded-full border border-amber-200/20 bg-amber-200/5 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,200,120,0.12)]">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-amber-200/70">
                      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
                      <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                    </svg>
                  </div>
                  <p className="text-amber-100/55 text-base leading-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    I have <span className="text-amber-200/80">3 special gifts</span> for you today, Ammuni. But first, you need to solve a little puzzle to unlock each one.
                  </p>
                  <p className="text-amber-100/35 text-sm mt-4">Are you ready?</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => startPuzzle(0)}
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
                  {/* Shimmer sweep */}
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
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", fontWeight: 600 }}
                  >
                    Let's Begin ✦
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Puzzle stages */}
            {[0, 1, 2].map((i) =>
              stage === `puzzle-${i}` ? (
                <motion.div
                  key={`puzzle-${i}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                >
                  <Puzzle puzzle={puzzles[i]} onSolve={() => openGift(i)} />
                </motion.div>
              ) : null
            )}

            {/* Gift stages */}
            {[0, 1, 2].map((i) =>
              stage === `gift-${i}` ? (
                <motion.div
                  key={`gift-${i}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center gap-8"
                >
                  {giftComponents[i]}

                  {/* Next gift button — only shown after condition met */}
                  {i === 0 && (
                    <AnimatePresence>
                      {canProceed(i) ? (
                        <motion.button
                          key="proceed"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => startPuzzle(i + 1)}
                          className="relative flex items-center justify-center overflow-hidden cursor-pointer"
                          style={{
                            width: "clamp(180px, 50vw, 240px)",
                            height: "52px",
                            borderRadius: "2px",
                            border: "1px solid rgba(255,190,100,0.45)",
                            background: "linear-gradient(135deg, rgba(140,80,20,0.6), rgba(80,40,10,0.8))",
                            boxShadow: "0 0 35px rgba(255,180,80,0.25), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,150,0.25)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {/* Shimmer sweep */}
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
                            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", fontWeight: 600 }}
                          >
                            Open Gift {i + 2} ✦
                          </span>
                        </motion.button>
                      ) : (
                        <motion.p
                          key="waiting"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-amber-100/30 text-xs tracking-[3px] uppercase"
                        >
                          "♪ Watch the full video first..."
                        </motion.p>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              ) : null
            )}

          </AnimatePresence>
        </div>

        {/* Next Chapter */}
        <AnimatePresence>
          {showNextChapter && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-200/40" />
                <span className="text-amber-200/60">✦</span>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-200/40" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/letter")}
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
                {/* Shimmer sweep */}
                <motion.div
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
                  className="absolute inset-0 skew-x-12"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,200,100,0.13), transparent)" }}
                />
                {/* Ornamental lines */}
                <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-30">
                  <div className="flex-1 h-px bg-amber-200/60" />
                  <span className="text-amber-200 text-[8px]">✦</span>
                  <div className="flex-1 h-px bg-amber-200/60" />
                </div>
                <span
                  className="relative text-amber-50/90 uppercase"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "10px", letterSpacing: "5px", fontWeight: 600 }}
                >
                  NEXT CHAPTER
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}