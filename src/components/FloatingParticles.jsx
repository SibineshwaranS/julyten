import { useMemo } from "react";

function FloatingParticles() {

  const particlesData = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      width: Math.random() * 6 + 2,
      height: Math.random() * 6 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none layer-isolated">

      {particlesData.map((p) => (

        <span
          key={p.id}
          className="absolute rounded-full bg-amber-100/20 animate-float gpu-accelerated"
          style={{
            width: `${p.width}px`,
            height: `${p.height}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: "blur(1px)",
          }}
        ></span>

      ))}

    </div>
  );
}

export default FloatingParticles;