import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

import g1 from "../assets/gallery/g1.jpg";
import g2 from "../assets/gallery/g2.jpg";
import g3 from "../assets/gallery/g3.jpg";
import g4 from "../assets/gallery/g4.jpg";
import g5 from "../assets/gallery/g5.jpg";
import g6 from "../assets/gallery/g6.jpg";
import g7 from "../assets/gallery/g7.jpg";
import g8 from "../assets/gallery/g8.jpg";
import g9 from "../assets/gallery/g9.jpg";
import g10 from "../assets/gallery/g10.jpg";
import g11 from "../assets/gallery/g11.jpg";
import g12 from "../assets/gallery/g12.jpg";
import g13 from "../assets/gallery/g13.jpg";
import g14 from "../assets/gallery/g14.jpg";
import g15 from "../assets/gallery/g15.jpg";
import g16 from "../assets/gallery/g16.jpg";
import g17 from "../assets/gallery/g17.jpg";
import g18 from "../assets/gallery/g18.jpg";
import g19 from "../assets/gallery/g19.jpg";
import g20 from "../assets/gallery/g20.jpg";
import { getAssetUrl } from "../config/cdn";

const photos = [g1,g2,g3,g4,g5,g6,g7,g8,g9,g10,g11,g12,g13,g14,g15,g16,g17,g18,g19,g20].map((img, i) => 
  getAssetUrl(img, `gallery/g${i + 1}.jpg`)
);
const TOTAL = photos.length;

const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

// 3D tilt card component
function TiltCard({ src, isActive, onClick }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { stiffness: 300, damping: 30 });
  const brightness = useSpring(useTransform(y, [-100, 100], [1.1, 0.9]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!isActive) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: isActive ? rotateX : 0,
        rotateY: isActive ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="w-full h-full cursor-pointer"
    >
      <motion.div
        style={{ filter: isActive ? useTransform(brightness, b => `brightness(${b})`) : "brightness(0.7)" }}
        className="w-full h-full rounded-[24px] overflow-hidden relative border border-amber-200/20 shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,200,120,0.05)]"
      >
        <img src={src} alt="" className="w-full h-full object-cover" />

        {/* Shimmer top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"></div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* 3D shine layer */}
        {isActive && (
          <motion.div
            style={{
              background: useTransform(
                [x, y],
                ([lx, ly]) =>
                  `radial-gradient(circle at ${50 + lx * 0.1}% ${50 + ly * 0.1}%, rgba(255,220,150,0.12), transparent 60%)`
              ),
            }}
            className="absolute inset-0"
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function GallerySection() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [entered, setEntered] = useState(false);
  const autoRef = useRef(null);
  const touchStartX = useRef(null);

  const prev = (current - 1 + TOTAL) % TOTAL;
  const next = (current + 1) % TOTAL;
  const prevprev = (current - 2 + TOTAL) % TOTAL;
  const nextnext = (current + 2) % TOTAL;

  const go = (idx, dir) => {
    setDirection(dir);
    setCurrent(idx);
    resetAuto();
  };

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(c => (c + 1) % TOTAL);
    }, 5000);
  };

  useEffect(() => {
    setTimeout(() => setEntered(true), 100);
    resetAuto();
    return () => clearInterval(autoRef.current);
  }, []);

  // Touch swipe
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? go(next, 1) : go(prev, -1);
    touchStartX.current = null;
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? "110%" : "-110%",
      opacity: 0,
      scale: 0.8,
      rotateY: dir > 0 ? 25 : -25,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (dir) => ({
      x: dir > 0 ? "-110%" : "110%",
      opacity: 0,
      scale: 0.8,
      rotateY: dir > 0 ? -25 : 25,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative min-h-screen bg-[#0d0a07] overflow-hidden flex flex-col"
    >
      {/* Background Glows */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-amber-200/10 blur-[160px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-orange-300/10 blur-[160px] rounded-full pointer-events-none"
      />

      {/* Left side decoration */}
      <div className="hidden md:flex flex-col items-center gap-4 absolute left-8 top-1/2 -translate-y-1/2 z-20">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/30"></div>
        <span className="text-amber-200/30 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>our photos</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/30"></div>
        <span className="text-amber-200/20 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>captured</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/30 to-transparent"></div>
      </div>

      {/* Right side decoration */}
      <div className="hidden md:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2 z-20">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/30"></div>
        <span className="text-amber-200/30 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>forever</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/30"></div>
        <span className="text-amber-200/20 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>moments</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/30 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center py-14 px-6 flex-1">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <p className="tracking-[6px] uppercase text-amber-100/50 text-xs md:text-sm mb-4" style={FONT_BODY}>
            OUR MOMENTS
          </p>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl text-amber-50"
            style={FONT_SCRIPT}
          >
            Our Gallery
          </h1>
          <p className="mt-4 text-amber-100/40 text-xs tracking-widest">
            every picture holds a thousand feelings
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-200/40"></div>
            <div className="text-amber-200/50">❦</div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-200/40"></div>
          </div>
        </motion.div>

        {/* 3D Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col items-center gap-6"
          style={{ perspective: "1200px" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          {/* Carousel row */}
          <div className="w-full flex items-center justify-center gap-3 md:gap-5" style={{ perspective: "1200px" }}>

            {/* Far left — barely visible */}
            <motion.div
              key={`pp-${prevprev}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden lg:block w-[100px] h-[140px] flex-shrink-0 rounded-[16px] overflow-hidden border border-amber-100/5 opacity-20"
              style={{ transform: "rotateY(40deg) translateZ(-80px) scale(0.75)" }}
            >
              <img src={photos[prevprev]} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Left card */}
            <motion.div
              key={`p-${prev}`}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => go(prev, -1)}
              className="hidden sm:block w-[140px] md:w-[180px] h-[190px] md:h-[240px] flex-shrink-0 cursor-pointer"
              style={{ transform: "rotateY(25deg) translateZ(-60px) scale(0.88)", transformStyle: "preserve-3d" }}
            >
              <div className="w-full h-full rounded-[18px] overflow-hidden border border-amber-100/10 opacity-50 hover:opacity-70 transition-opacity duration-300">
                <img src={photos[prev]} alt="" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Main card */}
            <div className="relative w-full max-w-[300px] md:max-w-[380px] h-[380px] md:h-[460px] flex-shrink-0" style={{ transformStyle: "preserve-3d" }}>

              {/* Glow */}
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-4 rounded-[28px] blur-3xl bg-amber-300/15 -z-10"
              />

              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <TiltCard
                    src={photos[current]}
                    isActive={true}
                    onClick={() => setLightbox(true)}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Left arrow */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => go(prev, -1)}
                className="absolute left-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-amber-200/25 bg-black/50 backdrop-blur-md flex items-center justify-center text-amber-100/70 hover:text-amber-100 hover:border-amber-200/60 transition-all duration-300 text-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >‹</motion.button>

              {/* Right arrow */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => go(next, 1)}
                className="absolute right-[-22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-amber-200/25 bg-black/50 backdrop-blur-md flex items-center justify-center text-amber-100/70 hover:text-amber-100 hover:border-amber-200/60 transition-all duration-300 text-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >›</motion.button>

              {/* Counter on card */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
                <span className="text-amber-100/40 text-[10px] tracking-[4px] uppercase">
                  {String(current + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
                </span>
              </div>

            </div>

            {/* Right card */}
            <motion.div
              key={`n-${next}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => go(next, 1)}
              className="hidden sm:block w-[140px] md:w-[180px] h-[190px] md:h-[240px] flex-shrink-0 cursor-pointer"
              style={{ transform: "rotateY(-25deg) translateZ(-60px) scale(0.88)", transformStyle: "preserve-3d" }}
            >
              <div className="w-full h-full rounded-[18px] overflow-hidden border border-amber-100/10 opacity-50 hover:opacity-70 transition-opacity duration-300">
                <img src={photos[next]} alt="" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Far right */}
            <motion.div
              key={`nn-${nextnext}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden lg:block w-[100px] h-[140px] flex-shrink-0 rounded-[16px] overflow-hidden border border-amber-100/5 opacity-20"
              style={{ transform: "rotateY(-40deg) translateZ(-80px) scale(0.75)" }}
            >
              <img src={photos[nextnext]} alt="" className="w-full h-full object-cover" />
            </motion.div>

          </div>

          {/* Progress bar */}
          <div className="w-full max-w-[300px] md:max-w-[380px] h-px bg-amber-200/10 rounded-full overflow-hidden">
            <motion.div
              key={current}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-gradient-to-r from-amber-200/40 to-amber-400/60 rounded-full"
            />
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {photos.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => go(i, i > current ? 1 : -1)}
                whileHover={{ scale: 1.3 }}
                className="transition-all duration-300"
              >
                <div className={`rounded-full transition-all duration-400 ${
                  i === current
                    ? "w-7 h-1.5 bg-amber-200/80"
                    : "w-1.5 h-1.5 bg-amber-200/20 hover:bg-amber-200/50"
                }`} />
              </motion.button>
            ))}
          </div>

          {/* Thumbnail strip */}
          <div className="w-full max-w-[340px] md:max-w-[460px]">
            <div className="flex gap-2 overflow-x-auto pb-1 px-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {photos.map((src, i) => (
                <motion.button
                  key={i}
                  onClick={() => go(i, i > current ? 1 : -1)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-12 h-12 rounded-[10px] overflow-hidden border transition-all duration-300 ${
                    i === current
                      ? "border-amber-200/70 shadow-[0_0_14px_rgba(255,200,120,0.35)] scale-110"
                      : "border-amber-100/10 opacity-40 hover:opacity-75"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>

        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-14 max-w-sm md:max-w-md text-center px-4"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-amber-200/20"></div>
            <span className="text-amber-200/30 text-[10px] tracking-[4px] uppercase" style={FONT_BODY}>a little note</span>
            <div className="w-12 h-px bg-amber-200/20"></div>
          </div>

          <p
            className="text-amber-100/40 text-sm md:text-base leading-8 italic"
            style={FONT_BODY}
          >
            Note : These are not our real memories, but they are my dream memories — the ones I wish to live with you, someday, together.
          </p>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-200/40"></div>
          <div className="text-amber-200/60">✦</div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-200/40"></div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10 mb-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/gift")}
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
              style={{ ...FONT_BODY, fontSize: "10px", letterSpacing: "5px", fontWeight: 600 }}
            >
              Next Chapter
            </span>
          </motion.button>
        </div>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center px-14"
          >
            <motion.button
              whileHover={{ scale: 1.2 }}
              onClick={(e) => { e.stopPropagation(); go(prev, -1); }}
              className="absolute left-4 md:left-8 w-12 h-12 rounded-full border border-amber-200/20 bg-white/5 backdrop-blur flex items-center justify-center text-amber-100/60 hover:text-amber-100 text-2xl z-10"
            >‹</motion.button>

            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                initial={{ scale: 0.88, opacity: 0, rotateY: 10 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.88, opacity: 0, rotateY: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                src={photos[current]}
                alt="Preview"
                className="max-w-full max-h-[82vh] rounded-[24px] object-contain shadow-[0_0_80px_rgba(255,200,120,0.12)]"
              />
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.2 }}
              onClick={(e) => { e.stopPropagation(); go(next, 1); }}
              className="absolute right-4 md:right-8 w-12 h-12 rounded-full border border-amber-200/20 bg-white/5 backdrop-blur flex items-center justify-center text-amber-100/60 hover:text-amber-100 text-2xl z-10"
            >›</motion.button>

            <div className="absolute bottom-8 text-amber-100/30 text-xs tracking-[4px] uppercase">
              {String(current + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
            </div>

            <button
              onClick={() => setLightbox(false)}
              className="absolute top-6 right-6 text-amber-100/30 hover:text-amber-100/70 text-xs tracking-[4px] uppercase transition-colors"
            >Close</button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.section>
  );
}

export default GallerySection;