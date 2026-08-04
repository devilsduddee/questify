import React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

export const FadeIn: React.FC<HTMLMotionProps<"div">> = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
)

export const SlideUp: React.FC<HTMLMotionProps<"div">> = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
    {...props}
  >
    {children}
  </motion.div>
)

export const ScaleIn: React.FC<HTMLMotionProps<"div">> = ({ children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.3, type: "spring" }}
    {...props}
  >
    {children}
  </motion.div>
)

export const Shake: React.FC<HTMLMotionProps<"div"> & { trigger: boolean }> = ({ children, trigger, ...props }) => (
  <motion.div
    animate={
      trigger
        ? { x: [0, -10, 10, -10, 10, -5, 5, 0] }
        : { x: 0 }
    }
    transition={{ duration: 0.4 }}
    {...props}
  >
    {children}
  </motion.div>
)
