import React, { useState } from "react";
import { parseTranscript } from "@/lib/transcriptParser";
import type { TranscriptLine } from "@/lib/api";

interface FallbackInputProps {
  onTranscriptReady: (lines: TranscriptLine[]) => void;
}

const DEMO_TRANSCRIPT = `15:23
commercial spaces.

15:26
And so far, it's been quite successful.

15:29
We need to figure out the best approach.

15:32
It was a piece of cake to implement.

15:35
You need to practice every day to improve.

15:38
The team came up with a substantial plan.

15:41
We had to overcome several obstacles.`;

export function FallbackInput({ onTranscriptReady }: FallbackInputProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleLoadDemo() {
    const parsed = parseTranscript(DEMO_TRANSCRIPT);
    const lines: TranscriptLine[] = parsed.map((l) => ({
      text: l.text,
      offset: l.start,
      duration: 3,
    }));
    onTranscriptReady(lines);
  }

  function handleApply() {
    setError(null);
    const raw = text.trim();
    if (!raw) { setError("Please paste some transcript text."); return; }

    const parsed = parseTranscript(raw);
    if (parsed.length === 0) {
      // Fallback: treat each line as 3s interval
      const lines = raw.split("\n").filter(Boolean).map((line, i): TranscriptLine => ({
        text: line.trim(),
        offset: i * 3,
        duration: 3,
      }));
      onTranscriptReady(lines);
      return;
    }

    const lines: TranscriptLine[] = parsed.map((l, i) => ({
      text: l.text,
      offset: l.start,
      duration: (parsed[i + 1]?.start ?? l.start + 5) - l.start,
    }));
    onTranscriptReady(lines);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed">
        Could not fetch transcript automatically. Paste the transcript below, or use the demo data.
        <br />
        <span className="font-medium">Supported formats:</span> YouTube copy-paste, inline timestamps (00:15 text), SRT.
      </div>

      <textarea
        className="w-full min-h-[180px] rounded-lg border border-input bg-background px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        placeholder={"15:23\ncommercial spaces.\n\n15:26\nAnd so far, it's been quite successful."}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={handleLoadDemo}
          className="flex-1 py-2 rounded-lg border border-border bg-background text-foreground text-xs font-medium hover:bg-muted transition"
        >
          Use Demo Data
        </button>
        <button
          onClick={handleApply}
          disabled={!text.trim()}
          className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Load Transcript
        </button>
      </div>
    </div>
  );
}
