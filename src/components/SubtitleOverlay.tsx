import React, { useMemo } from "react";

interface Token {
  type: "word" | "space" | "punct";
  text: string;
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  // Split while keeping delimiters
  const parts = text.split(/(\s+|[^\w''-]+)/);
  for (const part of parts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      tokens.push({ type: "space", text: part });
    } else if (/^[\w'']+$/.test(part)) {
      // Treat pure-apostrophe tokens as punctuation
      if (/^['']$/.test(part)) {
        tokens.push({ type: "punct", text: part });
      } else {
        tokens.push({ type: "word", text: part });
      }
    } else {
      tokens.push({ type: "punct", text: part });
    }
  }
  return tokens;
}

interface SubtitleOverlayProps {
  text: string | null;
  vocabSet: Set<string>;
  onWordClick: (word: string) => void;
  show: boolean;
}

export function SubtitleOverlay({ text, vocabSet, onWordClick, show }: SubtitleOverlayProps) {
  const tokens = useMemo(() => (text ? tokenize(text) : []), [text]);

  if (!show || !text) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingBottom: "48px", // above YouTube control bar
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0",
          background: "rgba(0,0,0,0.72)",
          borderRadius: "6px",
          padding: "6px 12px",
          maxWidth: "90%",
          lineHeight: "1.5",
          pointerEvents: "none",
        }}
      >
        {tokens.map((token, i) => {
          if (token.type === "word") {
            const lower = token.text.toLowerCase();
            const isVocab = vocabSet.has(lower);
            return (
              <span
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onWordClick(lower);
                }}
                style={{
                  display: "inline",
                  fontSize: "18px",
                  fontWeight: 500,
                  cursor: "pointer",
                  pointerEvents: "auto",
                  background: isVocab ? "#fde047" : "transparent",
                  color: isVocab ? "#713f12" : "#fff",
                  borderRadius: isVocab ? "2px" : undefined,
                  padding: isVocab ? "0 1px" : undefined,
                  textShadow: isVocab ? "none" : "0 1px 3px rgba(0,0,0,0.8)",
                  transition: "background 0.1s",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLSpanElement).style.opacity = "1";
                }}
              >
                {token.text}
              </span>
            );
          }
          // space or punct — not clickable
          return (
            <span
              key={i}
              style={{
                display: "inline",
                color: "#fff",
                fontSize: "18px",
                fontWeight: 500,
                pointerEvents: "none",
                textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                whiteSpace: "pre",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
