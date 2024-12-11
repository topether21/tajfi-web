import { motion } from "framer-motion";
import React from "react";

export const MotionDiv = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<typeof motion.div> & { className?: string }
>((props, ref) => <motion.div ref={ref} {...props} />);

MotionDiv.displayName = "MotionDiv";
