import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import YouTube, { type YouTubePlayer, type YouTubeEvent } from "react-youtube";
import { parseVideoId, formatTime } from "@/lib/utils";
import {
  fetchTranscript,
  cambridgeLookup,
  type TranscriptLine,
  type CambridgeResult,
} from "@/lib/api";
import { VOCAB_SET, findVocabMatches } from "@/lib/vocabulary";
import { SubtitleOverlay } from "@/components/SubtitleOverlay";
import { DictionaryCard } from "@/components/DictionaryCard";
import { FallbackInput } from "@/components/FallbackInput";

// ── Helper ──────────────────────────────────────────────────────────────────

function findCurrentLine(
  transcript: TranscriptLine[],
  time: number
): TranscriptLine | null {
  if (!transcript.length) return null;
  // Walk from the end to find the last line whose offset <= time
  let found: TranscriptLine | null = null;
  for (const line of transcript) {
    if (line.offset <= time) found = line;
    else break;
  }
  // Also check the found line hasn't ended yet (with a 1s grace)
  if (found && time > found.offset + found.duration + 1) return null;
  return found;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [currentLine, setCurrentLine] = useState<TranscriptLine | null>(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [vocabMatches, setVocabMatches] = useState<string[]>([]);
  const [dictResult, setDictResult] = useState<CambridgeResult | null>(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playerRef = useRef<YouTubePlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sort transcript by offset once
  const sortedTranscript = useMemo(
    () => [...transcript].sort((a, b) => a.offset - b.offset),
    [transcript]
  );

  // Build vocab set for this specific transcript
  const transcriptVocabSet = useMemo(() => VOCAB_SET, []);

  // Poll current time and update subtitle
  const startPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const t: number = playerRef.current.getCurrentTime();
        setCurrentLine(findCurrentLine(sortedTranscript, t));
      } catch {
        /* ignore */
      }
    }, 200);
  }, [sortedTranscript]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Restart polling when transcript changes
  useEffect(() => {
    if (isPlaying) startPolling();
  }, [sortedTranscript, isPlaying, startPolling]);

  // ── Load video & transcript ────────────────────────────────────────────────
  async function handleLoad() {
    const id = parseVideoId(urlInput.trim());
    if (!id) {
      setError("Please paste a valid YouTube URL.");
      return;
    }
    setError(null);
    setVideoId(id);
    setTranscript([]);
    setCurrentLine(null);
    setVocabMatches([]);
    setFallbackMode(false);
    setDictResult(null);
    setSelectedWord(null);
    setPlayerReady(false);
    setIsPlaying(false);
    setLoadingTranscript(true);

    try {
      const result = await fetchTranscript(id);
      if (result.success && result.lines && result.lines.length > 0) {
        setTranscript(result.lines);
        const fullText = result.lines.map((l) => l.text).join(" ");
        setVocabMatches(findVocabMatches(fullText));
      } else {
        setFallbackMode(true);
      }
    } catch {
      setFallbackMode(true);
    } finally {
      setLoadingTranscript(false);
    }
  }

  function handleFallbackReady(lines: TranscriptLine[]) {
    setTranscript(lines);
    setFallbackMode(false);
    const fullText = lines.map((l) => l.text).join(" ");
    setVocabMatches(findVocabMatches(fullText));
  }

  // ── Word click → Cambridge lookup ─────────────────────────────────────────
  async function handleWordClick(word: string) {
    if (dictLoading) return;
    const clean = word.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
    if (!clean) return;
    setSelectedWord(clean);
    setDictLoading(true);
    setDictResult(null);
    try {
      const result = await cambridgeLookup(clean);
      setDictResult(result);
    } catch {
      const slug = clean.replace(/\s+/g, "-");
      setDictResult({
        word: clean,
        partOfSpeech: null,
        ukPhonetic: null,
        usPhonetic: null,
        chineseDefinition: null,
        englishDefinition: null,
        examples: [],
        cambridgeUrl: `https://dictionary.cambridge.org/zht/dictionary/english-chinese-traditional/${encodeURIComponent(slug)}`,
        found: false,
      });
    } finally {
      setDictLoading(false);
    }
  }

  // ── YouTube player callbacks ───────────────────────────────────────────────
  function onPlayerReady(e: YouTubeEvent) {
    playerRef.current = e.target;
    setPlayerReady(true);
  }

  function onPlayerStateChange(e: YouTubeEvent) {
    if (e.data === 1) {
      // Playing
      setIsPlaying(true);
      startPolling();
    } else {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Snap subtitle to current time
      if (playerRef.current) {
        try {
          const t: number = playerRef.current.getCurrentTime();
          setCurrentLine(findCurrentLine(sortedTranscript, t));
        } catch {
          /* ignore */
        }
      }
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <header className="bg-white border-b border-border shadow-xs sticky top-0 z-20 shrink-0">
        <div className="max-w-screen-2xl mx-auto px-4 py-2.5 flex gap-3 items-center">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
              </svg>
            </div>
            <span className="font-bold text-base text-primary tracking-tight whitespace-nowrap">YT English</span>
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoad()}
              placeholder="Paste a YouTube URL and press Enter..."
              className="flex-1 rounded-lg border border-input bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
            <button
              onClick={handleLoad}
              className="px-5 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-sm whitespace-nowrap"
            >
              Load
            </button>
          </div>
        </div>
        {error && (
          <div className="max-w-screen-2xl mx-auto px-4 pb-2">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}
      </header>

      {/* ── Landing ── */}
      {!videoId ? (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="w-8 h-8 text-primary">
              <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.361a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
            </svg>
          </div>
          <div className="max-w-md">
            <h1 className="text-2xl font-bold text-foreground mb-2">Learn English with YouTube</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Paste any YouTube URL above. Subtitles appear <strong>inside the video</strong> with
              every word clickable. B1–C2 vocabulary is highlighted in yellow.
              Click any word to look it up in the Cambridge Dictionary.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg w-full mt-2">
            {[
              { label: "In-Video Subtitles", desc: "Overlaid like Netflix" },
              { label: "Every Word Clickable", desc: "Tap any word to look up" },
              { label: "B1–C2 Highlighted", desc: "Yellow vocab detection" },
              { label: "Cambridge Dict", desc: "Definitions & examples" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card p-3 text-left">
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </main>
      ) : (
        /* ── Main Layout: Video | Dictionary ── */
        <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden" style={{ maxHeight: "calc(100vh - 52px)" }}>
          {/* ── Left: Video + Fallback ── */}
          <div className="flex-1 flex flex-col bg-black overflow-hidden">
            {/* Video container with overlay */}
            <div className="relative w-full" style={{ aspectRatio: "16/9", maxHeight: "70vh" }}>
              <YouTube
                videoId={videoId}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: { autoplay: 1, modestbranding: 1, rel: 0 },
                }}
                className="absolute inset-0 w-full h-full"
                iframeClassName="w-full h-full"
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
              />
              {/* Subtitle overlay — pointer-events: none on container, auto on words */}
              <SubtitleOverlay
                text={currentLine?.text ?? null}
                vocabSet={transcriptVocabSet}
                onWordClick={handleWordClick}
                show={!loadingTranscript && transcript.length > 0}
              />
            </div>

            {/* Transcript state messages */}
            <div className="bg-card border-t border-border px-4 py-3 overflow-y-auto flex-1">
              {loadingTranscript && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                  Fetching transcript…
                </div>
              )}

              {!loadingTranscript && fallbackMode && (
                <FallbackInput onTranscriptReady={handleFallbackReady} />
              )}

              {!loadingTranscript && !fallbackMode && transcript.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Transcript · {transcript.length} lines
                    {vocabMatches.length > 0 && (
                      <span className="ml-2 font-normal normal-case">
                        · {vocabMatches.length} vocab words detected
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {vocabMatches.slice(0, 30).map((w) => (
                      <button
                        key={w}
                        onClick={() => handleWordClick(w)}
                        className={`vocab-chip text-[11px] hover:bg-yellow-300/60 transition ${selectedWord === w ? "ring-1 ring-yellow-400" : ""}`}
                      >
                        {w}
                      </button>
                    ))}
                    {vocabMatches.length > 30 && (
                      <span className="text-[11px] text-muted-foreground self-center">
                        +{vocabMatches.length - 30} more
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Play the video — subtitles appear inside the player. Click any word in the subtitle to look it up.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Dictionary Panel ── */}
          <div
            className="flex flex-col border-l border-border bg-card shrink-0 overflow-hidden"
            style={{ width: "clamp(300px, 32%, 420px)", minWidth: "280px" }}
          >
            <div className="px-4 py-2.5 border-b border-border bg-white shrink-0 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Cambridge Dictionary</h2>
              {selectedWord && (
                <span className="text-xs text-muted-foreground">
                  {selectedWord}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <DictionaryCard result={dictResult} loading={dictLoading} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
