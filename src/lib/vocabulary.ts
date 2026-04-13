/**
 * CEFR B1–C2 vocabulary word list for highlighting.
 * Sources: Cambridge, ESL Lounge, Oxford.
 * All words lowercase. Phrases handled separately.
 */

// ── Phrasal verbs & idioms (multi-word) ────────────────────────────────────
export const PHRASAL_VERBS: string[] = [
  "figure out", "give up", "give in", "look into", "look up", "look out",
  "look forward to", "carry out", "carry on", "put off", "put up with",
  "put on", "put down", "bring up", "bring about", "bring out", "bring back",
  "come up with", "come across", "come up", "come out", "come over",
  "get rid of", "get along", "get through", "get over", "get away",
  "turn out", "turn up", "turn down", "turn off", "turn on",
  "set up", "set out", "set back", "set aside",
  "take off", "take up", "take over", "take on", "take out",
  "run out of", "run into", "run out", "run away",
  "find out", "fill in", "fill out", "fill up",
  "go through", "go over", "go ahead", "go on", "go off",
  "work out", "work on", "work through",
  "break down", "break out", "break through", "break up", "break in",
  "make up", "make out", "make do", "make sense of",
  "hold on", "hold up", "hold off", "hold back",
  "think over", "think through",
  "try out", "try on", "check in", "check out", "check up on",
  "end up", "show up", "show off", "slow down", "speed up",
  "deal with", "live up to", "stand out", "stand up for",
  "count on", "rely on", "depend on", "focus on",
  "point out", "rule out", "sort out", "start out", "start off",
  "pay off", "pay back", "hand in", "hand out", "hand over",
  "give out", "give away", "pick up", "pick out",
  "call off", "call on", "call out", "call back",
  "fall apart", "fall behind", "fall through", "fall for",
  "move on", "move forward", "move out",
  "keep up", "keep on", "keep up with", "keep away from",
  "a piece of cake", "back to square one", "bite the bullet",
  "break the ice", "burn the midnight oil", "cost an arm and a leg",
  "cutting edge", "hit the nail on the head", "in the long run",
  "keep an eye on", "once in a blue moon", "on the same page",
  "see eye to eye", "think outside the box", "under the weather",
  "up in the air", "the bottom line",
];

// ── Single-word B1–C2 vocabulary ──────────────────────────────────────────
export const VOCAB_WORDS_B1_C2: string[] = [
  // B1
  "achieve", "active", "advertise", "afford", "agree", "allow", "argue",
  "arrange", "attention", "attitude", "authority", "available", "avoid",
  "aware", "behaviour", "benefit", "careful", "cause", "challenge",
  "change", "characteristic", "choice", "citizen", "comfortable", "commit",
  "communicate", "community", "compare", "complain", "complete", "concern",
  "condition", "connect", "consider", "contain", "continue", "control",
  "convenient", "correct", "culture", "decide", "decision", "degree",
  "demand", "describe", "design", "develop", "difference", "difficult",
  "direction", "discover", "discuss", "distance", "doubt", "economy",
  "education", "effect", "effort", "encourage", "environment", "escape",
  "event", "evidence", "example", "exercise", "expect", "explain",
  "experience", "express", "fail", "feature", "freedom", "function",
  "future", "gather", "general", "government", "growth", "health",
  "helpful", "honest", "identify", "imagine", "important", "improve",
  "include", "increase", "individual", "influence", "information",
  "interest", "involve", "issue", "knowledge", "language", "limit",
  "manage", "material", "measure", "method", "modern", "necessary",
  "normal", "notice", "offer", "opinion", "opportunity", "organize",
  "particular", "perfect", "perform", "personal", "physical", "popular",
  "position", "possible", "predict", "prepare", "present", "prevent",
  "previous", "probably", "process", "produce", "protect", "provide",
  "public", "purpose", "quality", "realize", "reason", "receive",
  "recommend", "reduce", "relate", "remember", "report", "research",
  "result", "return", "review", "serious", "situation", "society",
  "solve", "success", "suggest", "support", "technology", "traditional",
  "trouble", "trust", "understand", "useful", "various", "value",
  "volunteer", "waste", "welcome",
  // B2
  "abandon", "abstract", "accurate", "acknowledge", "acquire", "adapt",
  "adequate", "adjust", "advocate", "affect", "afford", "analysis",
  "analyze", "annual", "anticipate", "apparent", "approach", "appropriate",
  "approximately", "arise", "aspect", "assess", "assumption", "capability",
  "category", "classify", "collaborate", "commit", "complex", "comprehensive",
  "conclude", "conflict", "consequence", "considerable", "consistently",
  "constitute", "constraint", "contribute", "controversial", "coordinate",
  "correlation", "critical", "crucial", "demonstrate", "determine",
  "differentiate", "distribute", "dominant", "dynamic", "emphasize",
  "encounter", "enhance", "ensure", "establish", "evaluate", "exceed",
  "expand", "facilitate", "flexible", "fluctuate", "generate", "global",
  "guarantee", "hypothesis", "identify", "impact", "implement", "implication",
  "indicate", "innovative", "insist", "insufficient", "integrate", "interpret",
  "investigate", "justify", "maintain", "minimize", "modify", "monitor",
  "negotiate", "objective", "obstacle", "obtain", "outcome", "perspective",
  "phenomenon", "potential", "precisely", "primary", "prominent", "pursue",
  "recognize", "relevant", "replace", "represent", "require", "resolve",
  "respond", "restrict", "reveal", "significant", "stable", "strategy",
  "structure", "sufficient", "summarize", "sustainable", "transformation",
  "typically", "undermine", "utilize", "whereas",
  // C1–C2
  "abolish", "accelerate", "accommodate", "accumulate", "acute", "adhere",
  "aggregate", "alienate", "allege", "alleviate", "ambiguous", "ambivalent",
  "ameliorate", "anonymous", "apprehend", "arbitrary", "articulate",
  "aspire", "assertion", "attain", "autonomous", "coherent", "coincide",
  "coerce", "collateral", "commence", "compensate", "compile", "conceive",
  "confer", "conformity", "controversial", "criteria", "critique", "deduce",
  "defer", "deliberate", "depict", "derive", "deviate", "diagnose",
  "diminish", "discriminate", "displace", "disposition", "elaborate",
  "eloquent", "empirical", "endorse", "enforce", "exaggerate", "explicit",
  "fabricate", "formulate", "fundamental", "ideology", "inevitable",
  "inherent", "initiative", "innate", "innovation", "integrity", "intrinsic",
  "manifest", "mechanism", "mitigate", "mutual", "narrative", "norm",
  "obscure", "obsolete", "paradox", "parameter", "perceive", "preliminary",
  "presume", "proficient", "rational", "reinforce", "reluctant", "resilient",
  "rhetoric", "rigorous", "scrutinize", "substantial", "superficial",
  "susceptible", "synthesize", "theoretical", "transgress", "transparent",
  "unanimous", "unprecedented", "validate", "versatile", "viable",
  "vulnerability", "widespread",
  // Additional useful words
  "absolutely", "accordingly", "achieve", "aggressive", "alert", "ambitious",
  "analytical", "assertion", "authentic", "beneficial", "cautious",
  "compelling", "competent", "confident", "conscious", "creative",
  "curiosity", "dedicated", "demanding", "dependable", "determined",
  "distinct", "effective", "enthusiastic", "exceptional", "exhausted",
  "genuine", "humble", "logical", "misconception", "momentum",
  "motivation", "optimistic", "passionate", "pessimistic", "practical",
  "precise", "productive", "profound", "realistic", "rational",
  "reasonable", "reliable", "remarkable", "responsible", "sophisticated",
  "specific", "straightforward", "strict", "subtle", "thorough",
  "thorough", "unique", "visible",
];

// Build a fast Set of single words (lowercase)
export const VOCAB_SET: Set<string> = new Set(
  VOCAB_WORDS_B1_C2.map((w) => w.toLowerCase())
);

// All phrases+words for the vocab strip, sorted longest first
export const ALL_VOCAB: string[] = [
  ...new Set([...PHRASAL_VERBS, ...VOCAB_WORDS_B1_C2]),
].sort((a, b) => b.length - a.length);

/**
 * Find all vocabulary matches (phrases + words) in a text.
 * Used for the vocab chip strip only.
 */
export function findVocabMatches(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  const usedRanges: Array<[number, number]> = [];

  for (const word of ALL_VOCAB) {
    let idx = 0;
    while (true) {
      const pos = lower.indexOf(word, idx);
      if (pos === -1) break;
      const before = pos === 0 ? " " : lower[pos - 1];
      const after = pos + word.length >= lower.length ? " " : lower[pos + word.length];
      const isWordBoundary =
        /[^a-z0-9']/.test(before) && /[^a-z0-9']/.test(after);
      if (isWordBoundary) {
        const overlaps = usedRanges.some(
          ([s, e]) => pos < e && pos + word.length > s
        );
        if (!overlaps) {
          found.push(word);
          usedRanges.push([pos, pos + word.length]);
          break;
        }
      }
      idx = pos + 1;
    }
  }

  return [...new Set(found)].sort((a, b) => b.length - a.length);
}
