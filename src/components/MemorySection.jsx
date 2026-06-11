import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import localMemory1 from "../assets/memories/memory1.jpg";
import localMemory2 from "../assets/memories/memory2.jpg";
import localMemory3 from "../assets/memories/memory3.jpg";
import localMemory4 from "../assets/memories/memory4.jpg";
import { getAssetUrl } from "../config/cdn";

const memory1 = getAssetUrl(localMemory1, "memories/memory1.jpg");
const memory2 = getAssetUrl(localMemory2, "memories/memory2.jpg");
const memory3 = getAssetUrl(localMemory3, "memories/memory3.jpg");
const memory4 = getAssetUrl(localMemory4, "memories/memory4.jpg");

const FONT_BODY   = { fontFamily: "'Cormorant Garamond', serif" };
const FONT_SCRIPT = { fontFamily: "'Great Vibes', cursive" };

function MemorySection() {
  const navigate = useNavigate();

  const memories = [
    {
      number: "01",
      title: "Stolen Miles",
      text: "Bus rides with you were my favorite part of the day. Sitting together, shoulders close, having our little conversations — somehow those small moments felt like the whole world.",
      image: memory1,
    },
    {
      number: "02",
      title: "A Full Day",
      text: "One day you had a retest, but we ended up spending the whole day together — 12 hours that felt like the best gift. Just us, no plans, no rush — and somehow that unplanned day became one of my most favorite memories with you.",
      image: memory2,
    },
    {
      number: "03",
      title: "Little Surprises",
      text: "Sometimes out of nowhere, a voice message or a photo or a little video from you would pop up — and just like that, my whole mood would change. Those small things you sent meant more to me than you'll ever know.",
      image: memory3,
    },
    {
      number: "04",
      title: "Krivas Night",
      text: "On Krivas night, for the first time, you called me yourself to come with you — and that moment meant everything. You didn't have to, but you did, and that one call made that day the most special day I had with you.",
      image: memory4,
    },
  ];

  return (
    <section className="relative min-h-screen bg-[#120d08] overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-200px] left-[-120px] w-[400px] h-[400px] bg-amber-200/10 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-[-200px] right-[-120px] w-[400px] h-[400px] bg-orange-300/10 blur-[140px] rounded-full"></div>

      {/* Left side decoration */}
      <div className="hidden md:flex flex-col items-center gap-4 absolute left-10 top-1/2 -translate-y-1/2 z-20">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/30"></div>
        <span className="text-amber-200/30 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>memories</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/30"></div>
        <span className="text-amber-200/20 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>moments</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/30 to-transparent"></div>
      </div>

      {/* Right side decoration */}
      <div className="hidden md:flex flex-col items-center gap-4 absolute right-10 top-1/2 -translate-y-1/2 z-20">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-amber-200/30"></div>
        <span className="text-amber-200/30 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>forever</span>
        <div className="w-1.5 h-1.5 rounded-full bg-amber-200/30"></div>
        <span className="text-amber-200/20 text-[10px] tracking-[6px] uppercase" style={{ writingMode: "vertical-rl", ...FONT_BODY }}>always</span>
        <div className="w-px h-24 bg-gradient-to-b from-amber-200/30 to-transparent"></div>
      </div>

      {/* Main Container — strictly centered, narrow width */}
      <div className="relative z-10 w-full flex flex-col items-center py-20 px-6">

        {/* Heading */}
        <div className="text-center mb-20 w-full">

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="tracking-[6px] uppercase text-amber-100/50 text-xs md:text-sm mb-5"
            style={FONT_BODY}
          >
            OUR JOURNEY
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-5xl sm:text-6xl md:text-7xl text-amber-50"
            style={FONT_SCRIPT}
          >
            Beautiful Memories
          </motion.h1>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-amber-200/40"></div>
            <div className="text-amber-200/50 text-xs">✦</div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-amber-200/40"></div>
          </div>

        </div>

        {/* Cards — fixed width, perfectly centered */}
        <div className="w-full" style={{ maxWidth: "480px" }}>

          {/* Vertical Line — centered inside the fixed width block */}
          <div className="relative">
            <div className="absolute left-[24px] top-0 bottom-0 w-px bg-gradient-to-b from-amber-200/0 via-amber-200/30 to-amber-200/0"></div>

            <div className="space-y-16">

              {memories.map((memory, index) => (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.3,
                  }}
                  className="relative pl-16"
                >

                  {/* Circle */}
                  <div className="absolute left-0 top-2 w-12 h-12 rounded-full border border-amber-200/20 bg-[#1a140f] backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,200,120,0.08)]">
                    <span className="text-amber-100 text-sm tracking-[2px]" style={FONT_BODY}>
                      {memory.number}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="relative rounded-[32px] border border-amber-100/10 overflow-hidden min-h-[280px] px-8 py-10 text-center flex flex-col items-center justify-center">

                    <img
                      src={memory.image}
                      alt={memory.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="absolute inset-0 bg-amber-950/30"></div>

                    <div className="relative z-10">

                      <h2 className="text-2xl text-amber-50 leading-snug mb-4 max-w-[90%] mx-auto" style={FONT_BODY}>
                        {memory.title}
                      </h2>

                      <div className="flex items-center justify-center gap-3 mb-5">
                        <div className="w-10 h-px bg-amber-200/30"></div>
                        <div className="w-1 h-1 rounded-full bg-amber-200/40"></div>
                        <div className="w-10 h-px bg-amber-200/30"></div>
                      </div>

                      <p className="text-amber-100/80 text-base leading-9 max-w-[95%] mx-auto" style={FONT_BODY}>
                        {memory.text}
                      </p>

                    </div>

                  </div>

                  {index < memories.length - 1 && (
                    <div className="flex items-center gap-3 mt-8 pl-2">
                      <div className="w-6 h-px bg-amber-200/20"></div>
                      <div className="w-1 h-1 rounded-full bg-amber-200/20"></div>
                      <div className="w-6 h-px bg-amber-200/20"></div>
                    </div>
                  )}

                </motion.div>

              ))}

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mt-24">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-200/40"></div>
          <div className="text-amber-200/60">✦</div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-200/40"></div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-14">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/gallery")}
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

    </section>
  );
}

export default MemorySection;