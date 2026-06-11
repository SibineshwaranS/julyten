import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

function PasswordScreen({ onUnlock }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUnlock = () => {
    document.activeElement.blur();
    const correctPassword = "Ammuni";

    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      setSuccess(true);
      localStorage.setItem("unlocked", "true");
      setTimeout(() => {
        navigate("/hero");
        onUnlock(true);
      }, 900);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleUnlock();
  };

  return (
    <section className="relative min-h-screen bg-[#0d0a07] flex items-center justify-center overflow-hidden px-4 sm:px-6">

      {/* Animated glows */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] bg-amber-200/10 blur-[160px] rounded-full"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-orange-300/10 blur-[140px] rounded-full"
      />

      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

      {/* Side decorations */}
      <div className="hidden md:flex flex-col items-center gap-4 absolute left-8 top-1/2 -translate-y-1/2">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/20" />
        <span className="text-amber-200/20 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>private</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/20 to-transparent" />
      </div>
      <div className="hidden md:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/20" />
        <span className="text-amber-200/20 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>access</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/20 to-transparent" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={
          error
            ? { x: [-12, 12, -12, 12, 0], opacity: 1, y: 0, scale: 1 }
            : success
            ? { opacity: 0, scale: 1.05, y: -30 }
            : { opacity: 1, y: 0, scale: 1, x: 0 }
        }
        transition={{ duration: error ? 0.4 : success ? 0.8 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[90vw] sm:max-w-md bg-white/[0.03] border border-amber-100/10 rounded-[24px] p-8 sm:p-12 backdrop-blur-xl text-center overflow-hidden"
      >
        {/* Card top shimmer */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-200/10 to-transparent" />

        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/[0.03] to-transparent rounded-[24px]" />

        {/* Lock icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 w-14 h-14 rounded-full border border-amber-200/15 bg-amber-200/5 flex items-center justify-center mx-auto mb-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-amber-200/50">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 tracking-[6px] uppercase text-amber-100/40 text-xs mb-5"
          style={FONT_BODY}
        >
          Private Access
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-5xl md:text-6xl text-amber-50 mb-3"
          style={FONT_SCRIPT}
        >
          Enter The Password
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="relative z-10 text-amber-100/40 text-sm leading-relaxed mb-10"
          style={FONT_BODY}
        >
          What is your nick name?
        </motion.p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-amber-200/10" />
          <span className="text-amber-200/20 text-xs">✦</span>
          <div className="flex-1 h-px bg-amber-200/10" />
        </div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative z-10"
        >
          <input
            type="password"
            placeholder="••••••"
            value={password}
            autoComplete="off"
            spellCheck="false"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey}
            className="w-full bg-black/30 border border-amber-200/20 px-6 py-4 text-center text-amber-50 tracking-[10px] outline-none placeholder:text-amber-100/15 transition-all duration-300 focus:border-amber-300/40 focus:bg-black/50"
            style={{ borderRadius: "2px", ...FONT_BODY }}
          />
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative z-10 text-red-300/70 text-xs tracking-[3px] uppercase mt-4"
              style={FONT_BODY}
            >
              Wrong password
            </motion.p>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleUnlock}
          className="relative z-10 mt-6 w-full flex items-center justify-center overflow-hidden cursor-pointer"
          style={{
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
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,220,150,0.2), transparent)",
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
            Unlock
          </span>
        </motion.button>

      </motion.div>

    </section>
  );
}

export default PasswordScreen;