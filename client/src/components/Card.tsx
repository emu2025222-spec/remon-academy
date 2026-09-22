import { ReactNode } from "react";
import { motion } from "framer-motion";

export function Card({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay }}
      className={`card p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
