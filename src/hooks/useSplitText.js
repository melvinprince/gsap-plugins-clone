import { useEffect, useRef } from "react";

export default function useSplitText({
  types = ["lines", "words", "chars"],
  absolute = false,
  lineClass = "line",
  wordClass = "word",
  charClass = "char",
} = {}) {
  const ref = useRef(null);
  const originalHTML = useRef("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Store original content for revert()
    originalHTML.current = el.innerHTML;
    el.style.whiteSpace = "pre-line";

    // Arrays to track created spans
    const wordSpans = [];
    const charSpans = [];

    // 1. Replace all text nodes with word -> char spans
    const processTextNode = (node) => {
      const text = node.textContent || "";
      // Split on whitespace but keep it (`(\s+)`)
      const chunks = text.split(/(\s+)/);

      chunks.forEach((chunk) => {
        if (!chunk) return;

        if (/^\s+$/.test(chunk)) {
          // just whitespace: re-insert as text
          el.insertBefore(document.createTextNode(chunk), node);
        } else {
          // word span
          const wSpan = document.createElement("span");
          wSpan.classList.add(wordClass, `${wordClass}${wordSpans.length + 1}`);
          wSpan.style.display = "inline-block";
          wordSpans.push(wSpan);

          // split into characters
          chunk.split("").forEach((ch) => {
            const cSpan = document.createElement("span");
            cSpan.classList.add(
              charClass,
              `${charClass}${charSpans.length + 1}`
            );
            cSpan.style.display = "inline-block";
            cSpan.textContent = ch;
            wSpan.appendChild(cSpan);
            charSpans.push(cSpan);
          });

          el.insertBefore(wSpan, node);
        }
      });

      el.removeChild(node);
    };

    // Gather all text nodes under el
    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(processTextNode);

    // 2. Wrap lines if requested
    if (types.includes("lines")) {
      const lines = [];
      const wordElems = Array.from(el.querySelectorAll(`.${wordClass}`));
      let currentLine = [];
      let lastTop = null;

      const wrapLine = (items) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add(lineClass, `${lineClass}${lines.length + 1}`);
        wrapper.style.display = absolute ? "block" : "inline-block";
        wrapper.style.position = absolute ? "absolute" : "relative";
        el.insertBefore(wrapper, items[0]);
        items.forEach((it) => wrapper.appendChild(it));
        lines.push(wrapper);
      };

      wordElems.forEach((w) => {
        const top = w.getBoundingClientRect().top;
        if (lastTop === null || Math.abs(top - lastTop) < 2) {
          currentLine.push(w);
        } else {
          wrapLine(currentLine);
          currentLine = [w];
        }
        lastTop = top;
      });
      if (currentLine.length) wrapLine(currentLine);
    }

    // 3. Position lines absolutely if needed
    if (absolute) {
      const lineElems = Array.from(el.querySelectorAll(`.${lineClass}`));
      const parentRect = el.getBoundingClientRect();
      lineElems.forEach((ln) => {
        const rect = ln.getBoundingClientRect();
        ln.style.left = `${rect.left - parentRect.left}px`;
        ln.style.top = `${rect.top - parentRect.top}px`;
        ln.style.width = `${rect.width}px`;
        ln.style.height = `${rect.height}px`;
      });
    }
  }, [types, absolute, lineClass, wordClass, charClass]);

  // revert() restores the original HTML
  const revert = () => {
    if (ref.current) ref.current.innerHTML = originalHTML.current;
  };

  return { ref, revert };
}
