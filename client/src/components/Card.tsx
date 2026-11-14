
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Card({
  children,
  className = "",
  delay = 0,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`overflow-hidden rounded-2xl border border-[#eae6dd] bg-white p-5 shadow-[0_4px_20px_rgba(11,31,77,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24b]/40 hover:shadow-[0_12px_30px_rgba(11,31,77,0.08)] sm:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
