import { useState, useEffect, useMemo } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import localG19 from "../assets/gallery/g19.jpg";
import { getAssetUrl } from "../config/cdn";

const g19 = getAssetUrl(localG19, "gallery/g19.jpg");

const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

/* ─── SAND PARTICLES EFFECT ────────────────────────────────────────── */
function SandParticles() {
  const particles = useMemo(() => {
    // Generate 100 tiny sand particles deterministically to satisfy React purity rules
    return Array.from({ length: 100 }, (_, i) => {
      const seed = i + 1;
      const rand1 = Math.abs((Math.sin(seed * 12.9898) * 43758.5453) % 1);
      const rand2 = Math.abs((Math.sin(seed * 78.233) * 43758.5453) % 1);
      const rand3 = Math.abs((Math.sin(seed * 45.164) * 43758.5453) % 1);
      const rand4 = Math.abs((Math.sin(seed * 92.128) * 43758.5453) % 1);
      
      // Determine a sand color palette (mix of yellow, gold, brown, orange-brown sand)
      const colors = [
        "radial-gradient(circle, #fef08a 0%, #ca8a04 70%, transparent 100%)", // bright yellow sand
        "radial-gradient(circle, #f59e0b 0%, #b45309 70%, transparent 100%)", // amber sand
        "radial-gradient(circle, #ca8a04 0%, #78350f 70%, transparent 100%)", // dark gold sand
        "radial-gradient(circle, #d97706 0%, #451a03 70%, transparent 100%)", // reddish brown sand
      ];
      const color = colors[i % 4];

      return {
        id: `sand_${i}`,
        left: rand1 * 90 + 5, // spread across width
        top: rand2 * 55 + 5,  // concentrate in top/mid areas
        size: rand3 * 3.8 + 1.2, // fine sand grains
        dur: rand4 * 1.1 + 0.6, // fall speed
        xDrift: (rand1 - 0.5) * 90, // wind drift
        yDrift: rand2 * 280 + 220, // fall DOWNWARDS (positive Y)
        color,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute gpu-accelerated"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: "50%",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.95, 0.95, 0],
            scale: [0.3, 1.4, 0.3],
            x: p.xDrift,
            y: p.yDrift,
          }}
          transition={{
            duration: p.dur,
            ease: "easeIn", // gravity acceleration feel
          }}
        />
      ))}
    </div>
  );
}

export default function EndSection() {
  const [showEndingMsg, setShowEndingMsg] = useState(false);
  const [vaporizeActive, setVaporizeActive] = useState(false);

  const dissolveY = useMotionValue(-25);
  const displaceScale = useMotionValue(0);
  const alphaIntercept = useMotionValue(1.0);
  const maskImage = useTransform(dissolveY, y => `linear-gradient(to bottom, transparent ${y}%, rgba(0,0,0,1) ${y + 25}%)`);

  useEffect(() => {
    // Start sand countdown (particle fall and filter/mask animation) after 2.4 seconds
    const timer = setTimeout(() => {
      setVaporizeActive(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (vaporizeActive) {
      const controls1 = animate(dissolveY, 105, {
        duration: 1.6,
        ease: "easeOut",
      });
      const controls2 = animate(displaceScale, 240, {
        duration: 1.6,
        ease: "easeOut",
      });
      const controls3 = animate(alphaIntercept, -2.0, {
        duration: 1.6,
        ease: "easeInOut",
      });
      return () => {
        controls1.stop();
        controls2.stop();
        controls3.stop();
      };
    }
  }, [vaporizeActive, dissolveY, displaceScale, alphaIntercept]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4"
    >
      {!showEndingMsg ? (
        <div className="relative flex items-center justify-center">
          {/* SVG Displacement & Dust Threshold Filter */}
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <filter id="vaporize-displace" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="4" result="noise" />
              <motion.feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={displaceScale}
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              <feComponentTransfer in="noise" result="thresholdNoise">
                <motion.feFuncA type="linear" slope="2.5" intercept={alphaIntercept} />
              </feComponentTransfer>
              <feComposite operator="in" in="displaced" in2="thresholdNoise" />
            </filter>
          </svg>

          <motion.div
            style={{
              filter: vaporizeActive ? "url(#vaporize-displace)" : "none",
              maskImage: maskImage,
              WebkitMaskImage: maskImage,
            }}
            className="relative flex items-center justify-center"
          >
            <motion.img
              src={g19}
              alt="Final Memory"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(0px) brightness(100%)" }}
              animate={{
                opacity: [0, 1, 1, 0.02], // stay high, let mask/threshold handle the dissolve!
                scale: [0.95, 1, 1, 1.18],
                filter: [
                  "blur(0px) brightness(100%)",
                  "blur(0px) brightness(100%)",
                  "blur(0px) brightness(100%)",
                  "blur(16px) brightness(300%)"
                ]
              }}
              transition={{
                duration: 4.0,
                times: [0, 0.15, 0.6, 1],
                ease: "easeInOut",
              }}
              onAnimationComplete={() => setShowEndingMsg(true)}
              className="max-w-[90vw] max-h-[80vh] rounded-2xl object-contain border border-amber-200/10 shadow-[0_0_60px_rgba(255,200,120,0.12)]"
            />
          </motion.div>
          {vaporizeActive && <SandParticles />}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15, filter: "blur(8px)" }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.95, 1, 1, 1.02],
            filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(6px)"],
          }}
          transition={{
            duration: 5.5,
            times: [0, 0.15, 0.85, 1],
            ease: "easeInOut",
          }}
          onAnimationComplete={() => {
            localStorage.clear();
            window.location.replace("https://www.google.com");
          }}
          className="text-center px-6 flex flex-col items-center gap-6 relative"
        >
          {/* Subtle background glow */}
          <div
            className="absolute pointer-events-none -z-10"
            style={{
              width: 300,
              height: 300,
              background: "radial-gradient(circle, rgba(255,180,80,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Main Message */}
          <h2
            className="text-2xl sm:text-4xl text-amber-50 font-light tracking-wide leading-relaxed italic"
            style={{
              ...FONT_BODY,
              textShadow: "0 0 20px rgba(255,200,100,0.35)",
            }}
          >
            Waiting for your message...
          </h2>

          {/* Elegant gold spark divider */}
          <div className="flex items-center gap-3 justify-center opacity-70">
            <span className="text-amber-300 text-xs">✦</span>
            <span className="text-amber-400 text-sm">♡</span>
            <span className="text-amber-300 text-xs">✦</span>
          </div>

          {/* Sub message in beautiful cursive script */}
          <p
            className="text-3xl sm:text-5xl text-amber-300 font-medium leading-normal"
            style={{
              ...FONT_SCRIPT,
              textShadow: "0 0 15px rgba(255,180,70,0.4)",
            }}
          >
            miss you lot uhmma...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
