"use client";
import React from "react";
import useSplitText from "@/hooks/useSplitText";

export default function SplitText({
  children,
  types = ["lines", "words", "chars"],
  absolute = false,
  lineClass = "line",
  wordClass = "word",
  charClass = "char",
  as: Tag = "div",
  ...rest
}) {
  const { ref } = useSplitText({
    types,
    absolute,
    lineClass,
    wordClass,
    charClass,
  });
  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
