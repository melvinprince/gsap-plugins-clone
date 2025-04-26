"use client";
import React, { useEffect } from "react";
import useSplitText from "@/hooks/useSplitText";
import gsap from "gsap";

/**
 * AnimatedSplitText
 * Splits text and runs a GSAP animation on the chosen target elements.
 *
 * Props:
 * - children: the text content
 * - types: array of 'lines' | 'words' | 'chars'
 * - absolute: boolean to absolute-position lines
 * - className: styling for the wrapper
 * - animation: { target: 'char'|'word'|'line', from: gsap.from params, options: other gsap tween params }
 */
function AnimatedSplitText({
  children,
  types = ["lines", "words", "chars"],
  absolute = false,
  className = "",
  animation = {},
}) {
  const { ref, revert } = useSplitText({ types, absolute });

  useEffect(() => {
    if (!ref.current || !animation.target) return;
    // determine selector for GSAP
    const selector = `.${animation.target}`;
    const elements = ref.current.querySelectorAll(selector);
    // run GSAP from() animation
    gsap.from(elements, { ...animation.from, ...animation.options });
    // cleanup: revert DOM on unmount
    return () => revert();
  }, [animation, ref, revert]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Demo page showcasing different animations
export default function SplitTextPage() {
  return (
    <main className="p-10 space-y-12">
      <h1 className="text-3xl font-bold">Animated SplitText Demo</h1>

      <AnimatedSplitText
        types={["chars"]}
        className="text-4xl"
        animation={{
          target: "char",
          from: { opacity: 0, y: 20 },
          options: { duration: 0.7, ease: "power2.out", stagger: 0.05 },
        }}
      >
        Stagger Characters Demo
      </AnimatedSplitText>

      <AnimatedSplitText
        types={["words"]}
        className="text-4xl"
        animation={{
          target: "word",
          from: { opacity: 0, scale: 0.8 },
          options: { duration: 0.6, ease: "back.out(1.7)", stagger: 0.1 },
        }}
      >
        Stagger Words Demo
      </AnimatedSplitText>

      <AnimatedSplitText
        types={["lines"]}
        absolute
        className="text-4xl leading-tight"
        animation={{
          target: "line",
          from: { opacity: 0, x: -100 },
          options: { duration: 1, ease: "power3.out", stagger: 0.3 },
        }}
      >
        Slide In Lines Demo
      </AnimatedSplitText>
    </main>
  );
}
