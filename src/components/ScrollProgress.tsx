import { motion, MotionProps, useScroll } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  ref?: React.Ref<HTMLDivElement>
}

export function ScrollProgress({
  className,
  ref,
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()

  return (
    <div className="fixed inset-x-0 top-[56px] sm:top-[64px] z-[100] h-[1px] pointer-events-none">
      <motion.div
        ref={ref}
        className={cn(
          "h-full w-full origin-left bg-gradient-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92] shadow-lg",
          className
        )}
        style={{
          scaleX: scrollYProgress,
          transformOrigin: "left",
        }}
        {...props}
      />
    </div>
  )
}

