import React from "react";

interface WordHighlighterProps {
  text: string;
  vocabWords: string[];
  onWordClick: (word: string) => void;
  hoveredWord?: string | null;
  onWordHover?: (word: string | null) => void;
}

export function WordHighlighter({
  text,
  vocabWords,
  onWordClick,
  hoveredWord,
  onWordHover,
}: WordHighlighterProps) {
  if (vocabWords.length === 0) return <span>{text}</span>;

  // Sort longest first to avoid partial matches
  const sorted = [...vocabWords].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    `\\b(${sorted.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi"
  );

  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const lp = part.toLowerCase();
        const isMatch = sorted.some((w) => w.toLowerCase() === lp);
        if (isMatch) {
          const isHovered = hoveredWord === lp;
          return (
            <span
              key={i}
              className={`vocab-word ${isHovered ? "vocab-hovered" : ""}`}
              onClick={(e) => { e.stopPropagation(); onWordClick(lp); }}
              onMouseEnter={() => onWordHover?.(lp)}
              onMouseLeave={() => onWordHover?.(null)}
              title={`Click to look up "${part}"`}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
