import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value, suffix = "" }: { icon: LucideIcon; label: string; value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(Math.floor(progress * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card flex flex-col items-center gap-2 p-6 text-center"
    >
      <Icon className="h-8 w-8 text-brand-gold" />
      <span className="font-display text-3xl font-bold text-brand-navy dark:text-white">
        {display}
        {suffix}
      </span>
      <span className="text-sm text-slate-500">{label}</span>
    </motion.div>
  );
}
