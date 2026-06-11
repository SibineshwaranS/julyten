import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

function LoveQuote() {
  const navigate = useNavigate();

  const words = ["In every lifetime,", "I would still find you,", "and choose you all over again."];

  return (
    <section className="relative min-h-screen bg-[#0f0b08] flex items-center justify-center overflow-hidden px-6 layer-isolated">

      {/* Animated glows */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-amber-200/10 blur-[160px] rounded-full glow-stabilized gpu-accelerated"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.06, 0.13, 0.06] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-orange-200/10 blur-[140px] rounded-full glow-stabilized gpu-accelerated"
      />

      {/* Top / bottom shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

      {/* Side decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="hidden md:flex flex-col items-center gap-4 absolute left-8 top-1/2 -translate-y-1/2"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>for you</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>always</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="hidden md:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2"
      >
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/25" />
        <span className="text-amber-200/25 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>chosen</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/25" />
        <span className="text-amber-200/15 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>forever</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/25 to-transparent" />
      </motion.div>

      {/* Quote container */}
      <div className="relative z-10 text-center max-w-4xl w-full">

        {/* Small label */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "2px" }}
          animate={{ opacity: 1, letterSpacing: "8px" }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="uppercase text-amber-100/35 text-xs md:text-sm mb-12"
          style={FONT_BODY}
        >
          For You
        </motion.p>

        {/* Opening quote mark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-amber-200/15 text-8xl md:text-9xl leading-none mb-4"
          style={FONT_BODY}
        >
          "
        </motion.div>

        {/* Quote lines — staggered reveal */}
        <div className="space-y-2 px-4">
          {words.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, delay: 0.6 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl leading-[1.4] text-amber-50"
                style={FONT_BODY}
              >
                {line}
              </motion.h1>
            </div>
          ))}
        </div>

        {/* Closing quote mark */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-amber-200/15 text-8xl md:text-9xl leading-none mt-2"
          style={FONT_BODY}
        >
          "
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.6 }}
          className="flex items-center justify-center gap-5 mt-10"
        >
          <div className="w-20 md:w-32 h-px bg-gradient-to-r from-transparent to-amber-200/35" />
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-amber-200/50 text-lg"
          >
            ❦
          </motion.span>
          <div className="w-20 md:w-32 h-px bg-gradient-to-l from-transparent to-amber-200/35" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-8 text-amber-100/30 text-xs tracking-[4px] uppercase"
          style={FONT_BODY}
        >
          — written with love
        </motion.p>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="flex justify-center mt-14"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/cake")}
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
              Continue
            </span>
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
}

export default LoveQuote;