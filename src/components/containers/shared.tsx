import React from 'react'
import { motion } from 'framer-motion'

export const MotionDiv = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof motion.div> & { className?: string }
>((props, ref) => <motion.div ref={ref} {...props} />)
