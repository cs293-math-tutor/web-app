import { readFileSync, writeFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// Read CSV files
const alternativesRaw = readFileSync(
  join(rootDir, "data-sources", "generated_alternatives.csv"),
  "utf-8"
);
const confirmedRaw = readFileSync(
  join(rootDir, "data-sources", "confirmed_nope_with_context.csv"),
  "utf-8"
);

const alternatives = parse(alternativesRaw, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
});

const confirmed = parse(confirmedRaw, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
});

console.log(`Loaded ${alternatives.length} alternatives`);
console.log(`Loaded ${confirmed.length} confirmed shutdowns`);

// Build lookup from confirmed_nope by (OBSID, teacher_turn_idx)
const confirmedMap = new Map();
for (const row of confirmed) {
  const key = `${row.OBSID}_${row.teacher_turn_idx}`;
  confirmedMap.set(key, row);
}

// Parse context_window into structured turns
function parseContextWindow(raw) {
  if (!raw) return [];
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);
  const turns = [];

  for (const line of lines) {
    const trimmed = line.trim();
    let speaker = "teacher";
    let text = trimmed;
    let isShutdown = false;

    // Check for shutdown marker
    if (text.includes("<<<")) {
      isShutdown = true;
      text = text.replace(/\s*<<<\s*/g, "").trim();
    }

    // Parse speaker tag
    if (text.startsWith("[student]")) {
      speaker = "student";
      text = text.replace(/^\[student\]\s*/, "").trim();
    } else if (text.startsWith("[teacher]")) {
      speaker = "teacher";
      text = text.replace(/^\[teacher\]\s*/, "").trim();
    }

    if (text.length > 0) {
      turns.push({ speaker, text, isShutdown });
    }

    // Stop after the shutdown turn — no post-shutdown interactions
    if (isShutdown) break;
  }

  return turns;
}

// Strip [teacher] prefix from alternative text
function cleanAlternative(text) {
  if (!text) return null;
  let cleaned = text.trim();
  // Remove leading [teacher] tag
  cleaned = cleaned.replace(/^\[teacher\]\s*/i, "");
  // Remove wrapping double quotes
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned.trim();
}

// Merge and filter
const examples = [];
let nullCount = 0;
let joinMissCount = 0;

for (const alt of alternatives) {
  const key = `${alt.OBSID}_${alt.teacher_turn_idx}`;
  const conf = confirmedMap.get(key);

  if (!conf) {
    joinMissCount++;
    continue;
  }

  // Clean alternatives
  const dialogicTeaching = cleanAlternative(alt.alt_dialogic_teaching);
  const productiveFailure = cleanAlternative(alt.alt_productive_failure);
  const uptake = cleanAlternative(alt.alt_uptake);
  const pressingForReasoning = cleanAlternative(alt.alt_pressing_for_reasoning);

  // Skip if any alternative is null/empty
  if (!dialogicTeaching || !productiveFailure || !uptake || !pressingForReasoning) {
    nullCount++;
    continue;
  }

  const context = parseContextWindow(conf.context_window);

  examples.push({
    id: key,
    obsid: parseInt(alt.OBSID, 10),
    teacherTurnIdx: parseInt(alt.teacher_turn_idx, 10),
    teacherText: alt.teacher_text,
    studentText: alt.student_text,
    context,
    alternatives: {
      dialogicTeaching,
      productiveFailure,
      uptake,
      pressingForReasoning,
    },
  });
}

console.log(`\nJoin misses: ${joinMissCount}`);
console.log(`Filtered (null alternatives): ${nullCount}`);
console.log(`Final examples: ${examples.length}`);

// Verify data quality
let shutdownCount = 0;
let noShutdownCount = 0;
for (const ex of examples) {
  const hasShutdown = ex.context.some((t) => t.isShutdown);
  if (hasShutdown) shutdownCount++;
  else noShutdownCount++;
}
console.log(`\nExamples with shutdown marker: ${shutdownCount}`);
console.log(`Examples without shutdown marker: ${noShutdownCount}`);

// Write output
const outputPath = join(rootDir, "src", "data", "examples.json");
writeFileSync(outputPath, JSON.stringify(examples, null, 2));
console.log(`\nWrote ${outputPath}`);
console.log(`File size: ${(readFileSync(outputPath).length / 1024).toFixed(1)} KB`);
