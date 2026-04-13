import React from "react";
import type { CambridgeResult } from "@/lib/api";

interface DictionaryCardProps {
  result: CambridgeResult | null;
  loading: boolean;
}

function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className="w-7 h-7 text-primary">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
      <path fillRule="evenodd" d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
      {children}
    </p>
  );
}

export function DictionaryCard({ result, loading }: DictionaryCardProps) {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Looking up in Cambridge Dictionary…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-2">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BookIcon />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Cambridge Dictionary</p>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-[220px]">
            Click any word in the subtitle overlay to look it up instantly
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-[260px]">
          {["phrasal verbs", "B1–C2 vocab", "idioms"].map((tag) => (
            <span key={tag} className="text-xs bg-primary/10 text-primary rounded-full px-2.5 py-0.5 font-medium">{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (!result.found) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <div className="inline-block bg-yellow-100 text-yellow-800 border border-yellow-300 rounded px-2 py-0.5 font-bold text-base">
            {result.word}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          No dictionary entry found for this word.
        </p>
        <a
          href={result.cambridgeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition font-medium w-fit"
        >
          Open in Cambridge Dictionary
          <ExternalLinkIcon />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Word header ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="inline-block bg-yellow-100 text-yellow-800 border border-yellow-300 rounded px-2 py-0.5 font-bold text-xl break-words">
            {result.word}
          </div>
          {result.partOfSpeech && (
            <span className="text-xs text-muted-foreground italic font-medium">{result.partOfSpeech}</span>
          )}
          {/* Phonetics */}
          {(result.ukPhonetic || result.usPhonetic) && (
            <div className="flex flex-wrap gap-3 mt-0.5">
              {result.ukPhonetic && (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded px-1">UK</span>
                  <span className="text-xs font-mono text-foreground/80">{result.ukPhonetic}</span>
                </div>
              )}
              {result.usPhonetic && (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded px-1">US</span>
                  <span className="text-xs font-mono text-foreground/80">{result.usPhonetic}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <a
          href={result.cambridgeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-[11px] text-primary hover:underline flex items-center gap-1 mt-1"
          title="Open full entry on Cambridge Dictionary"
        >
          Cambridge
          <ExternalLinkIcon />
        </a>
      </div>

      {/* ── Chinese meaning ── */}
      {result.chineseDefinition && (
        <div>
          <SectionLabel>中文意思</SectionLabel>
          <p className="text-2xl font-bold text-foreground tracking-wide">{result.chineseDefinition}</p>
        </div>
      )}

      {/* ── English definition ── */}
      {result.englishDefinition && (
        <div>
          <SectionLabel>English Definition</SectionLabel>
          <p className="text-sm text-foreground leading-relaxed">{result.englishDefinition}</p>
        </div>
      )}

      {/* ── Usage note ── */}
      {result.partOfSpeech && (
        <div>
          <SectionLabel>Usage</SectionLabel>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Used as a <strong>{result.partOfSpeech}</strong>.
            {result.chineseDefinition && (
              <> Chinese equivalent: <strong>{result.chineseDefinition}</strong>.</>
            )}
          </p>
        </div>
      )}

      {/* ── Example sentences ── */}
      {result.examples.length > 0 && (
        <div>
          <SectionLabel>Example Sentences</SectionLabel>
          <div className="flex flex-col gap-2">
            {result.examples.map((ex, i) => (
              <div
                key={i}
                className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2"
              >
                <p className="text-sm text-foreground leading-relaxed italic">
                  &ldquo;{ex}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
