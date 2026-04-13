export interface ParsedLine {
  start: number; // seconds
  text: string;
}

/**
 * Parse various transcript formats into a unified structure.
 *
 * Format 1 (inline timestamp):
 *   00:15 This is a test
 *   1:23:45 Another line
 *
 * Format 2 (YouTube transcript copy-paste):
 *   15:23
 *   commercial spaces.
 *
 *   15:26
 *   And so far, it's been quite successful.
 *
 * Format 3 (SRT-like):
 *   1
 *   00:00:15,000 --> 00:00:18,000
 *   This is a test
 */
export function parseTranscript(raw: string): ParsedLine[] {
  const lines = raw.split("\n").map((l) => l.trim());
  const result: ParsedLine[] = [];

  // Detect format
  if (looksLikeYouTubeFormat(lines)) {
    return parseYouTubeFormat(lines);
  }
  if (looksLikeSRT(lines)) {
    return parseSRT(lines);
  }
  return parseInlineFormat(lines);
}

function timeToSeconds(time: string): number {
  const parts = time.replace(",", ".").split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

function looksLikeYouTubeFormat(lines: string[]): boolean {
  // YouTube format: timestamp line followed by text line(s)
  // Timestamps look like "15:23" or "1:23:45" alone on a line
  let timestampLines = 0;
  for (const line of lines) {
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(line)) timestampLines++;
  }
  return timestampLines >= 2;
}

function looksLikeSRT(lines: string[]): boolean {
  return lines.some((l) => /\d{2}:\d{2}:\d{2}[,\.]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}/.test(l));
}

function parseYouTubeFormat(lines: string[]): ParsedLine[] {
  const result: ParsedLine[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(line)) {
      const start = timeToSeconds(line);
      const textLines: string[] = [];
      i++;
      while (i < lines.length && !/^\d{1,2}:\d{2}(:\d{2})?$/.test(lines[i])) {
        if (lines[i]) textLines.push(lines[i]);
        i++;
      }
      const text = textLines.join(" ").trim();
      if (text) result.push({ start, text });
    } else {
      i++;
    }
  }
  return result;
}

function parseSRT(lines: string[]): ParsedLine[] {
  const result: ParsedLine[] = [];
  let i = 0;
  while (i < lines.length) {
    // Skip sequence number
    if (/^\d+$/.test(lines[i])) i++;
    // Look for timestamp line
    const tsMatch = lines[i]?.match(/(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2})/);
    if (tsMatch) {
      const start = timeToSeconds(tsMatch[1]);
      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i] !== "" && !/^\d+$/.test(lines[i])) {
        textLines.push(lines[i]);
        i++;
      }
      const text = textLines.join(" ").trim();
      if (text) result.push({ start, text });
    } else {
      i++;
    }
  }
  return result;
}

function parseInlineFormat(lines: string[]): ParsedLine[] {
  const result: ParsedLine[] = [];
  for (const line of lines) {
    if (!line) continue;
    // Match "00:15 text" or "1:23:45 text"
    const match = line.match(/^(\d{1,2}:\d{2}(:\d{2})?)\s+(.+)$/);
    if (match) {
      result.push({ start: timeToSeconds(match[1]), text: match[3].trim() });
    }
  }
  return result;
}
