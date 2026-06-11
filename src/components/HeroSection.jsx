import FloatingParticles from "./FloatingParticles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen overflow-hidden bg-[#0d0a07] flex items-center justify-center layer-isolated">

      <FloatingParticles />

      {/* Animated background glows */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-amber-200/10 blur-[160px] rounded-full glow-stabilized gpu-accelerated"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-orange-300/10 blur-[160px] rounded-full glow-stabilized gpu-accelerated"
      />

      {/* Radial center light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,220,150,0.07),transparent_65%)] glow-stabilized" />

      {/* Top shimmer */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/25 to-transparent"
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

      {/* Side decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="hidden md:flex flex-col items-center gap-4 absolute left-8 top-1/2 -translate-y-1/2"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>special day</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>for you</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="hidden md:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>always</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>forever</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">

        {/* Small Intro */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "2px" }}
          animate={{ opacity: 1, letterSpacing: "10px" }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="uppercase text-amber-100/50 text-xs md:text-sm mb-8"
          style={FONT_BODY}
        >
          A Special Day
        </motion.p>

        {/* Main Heading — word by word reveal */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl leading-tight text-amber-50 px-4"
            style={{ ...FONT_SCRIPT, overflow: "visible" }}
          >
            <span style={{ display: "inline-block", paddingLeft: "0.15em", paddingRight: "0.15em" }}>
              Happy Birthday
            </span>
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl leading-tight text-amber-50 px-4"
            style={{ ...FONT_SCRIPT, overflow: "visible" }}
          >
            <span style={{ display: "inline-block", paddingLeft: "0.15em", paddingRight: "0.15em" }}>
              Ammuni
            </span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-8 max-w-xl mx-auto text-base sm:text-lg text-amber-100/55 leading-relaxed px-4"
          style={FONT_BODY}
        >
          Every moment with you feels like a beautiful dream
          written in golden light and timeless memories.
        </motion.p>

        {/* Luxury Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="flex items-center justify-center gap-4 md:gap-6 my-10 px-4"
        >
          <div className="w-16 md:w-28 h-px bg-gradient-to-r from-transparent to-amber-200/40" />
          <motion.span
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-amber-200/50 text-sm"
          >
            ✦
          </motion.span>
          <div className="w-16 md:w-28 h-px bg-gradient-to-l from-transparent to-amber-200/40" />
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/love-quote")}
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
              style={{ ...FONT_BODY, fontSize: "10px", letterSpacing: "5px", fontWeight: 600 }}
            >
              Enter
            </span>
          </motion.button>
        </motion.div>

      </div>

    </section>
  );
}

export default HeroSection;