"""
Generate growth mindset alternatives for the 10 selected examples,
then write the filtered examples.json.

Uses: google-genai SDK with gemini-3-flash-preview
Run: python3 scripts/generate_growth_mindset.py
"""

import json
import os
import time
from google import genai
from google.genai import types

# ── Config ────────────────────────────────────────────────────────────────────
MODEL = "gemini-2.5-flash-preview-04-17"       # per user: gemini-3-flash-preview
SELECTED_INDICES = [2, 36, 9, 11, 12, 13, 14, 20, 21, 25]   # 1-indexed
API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

SYSTEM_INSTRUCTION = """You are an expert teacher coach specializing in Mathematical Mindsets and Jo Boaler's research on growth mindset. You will be provided with a transcript where a teacher has "shutdown" a student (abruptly ending their train of thought or correcting them dismissively).

Your task is to rewrite the teacher's final response to foster a Growth Mindset.

Core Principles to Follow:

Normalize Struggle: Treat the incorrect answer as a valuable "data point" or a "natural part of the learning path."

Neutral Curiosity: Avoid evaluative praise (e.g., "Good job but no") and instead use curiosity (e.g., "I'm interested in how you saw that...").

Process over Product: Shift the focus from the "wrong" result to the logic the student used to get there.

Low Floor, High Ceiling: Ensure the response keeps the door open for the student to keep thinking rather than ending the exchange.

Output Format: Provide only the exact words the teacher should say. Do not provide meta-commentary or explanations.

Example Transformation:
Original Shutdown: "No, that's not 72. Someone else?"
Growth Mindset Pivot: "That's an interesting number to land on. Walk us through the steps you took to get to 72—I want to see the path your brain was taking.\""""

# ── Helpers ───────────────────────────────────────────────────────────────────
def format_context(context: list[dict]) -> str:
    """Format context turns into a readable transcript."""
    lines = []
    for turn in context:
        speaker = "Teacher" if turn["speaker"] == "teacher" else "Student"
        marker = " [SHUTDOWN]" if turn.get("isShutdown") else ""
        lines.append(f"{speaker}: {turn['text']}{marker}")
    return "\n".join(lines)


def generate_growth_mindset(client: genai.Client, example: dict) -> str:
    """Call Gemini to generate a growth-mindset alternative for one example."""
    transcript = format_context(example["context"])
    prompt = f"""Here is the classroom transcript:

{transcript}

The teacher's shutdown utterance was: "{example['teacherText']}"
The student's prior utterance was: "{example['studentText']}"

Please rewrite the teacher's shutdown response to foster a Growth Mindset."""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
            temperature=0.7,
        ),
    )
    return response.text.strip()


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    if not API_KEY:
        raise ValueError("Set GEMINI_API_KEY or GOOGLE_API_KEY env var")

    client = genai.Client(api_key=API_KEY)

    # Load full examples
    src = os.path.join(os.path.dirname(__file__), "..", "src", "data", "examples.json")
    with open(src) as f:
        all_examples = json.load(f)

    print(f"Loaded {len(all_examples)} total examples")

    # Select and generate
    selected = []
    for rank, idx in enumerate(SELECTED_INDICES, start=1):
        example = all_examples[idx - 1]   # 1-indexed → 0-indexed
        print(f"\n[{rank}/10] Example {idx}: id={example['id']}")
        print(f"  Teacher: {example['teacherText'][:80]}")
        print(f"  Student: {example['studentText'][:60]}")

        # Generate growth mindset alternative
        for attempt in range(3):
            try:
                gm = generate_growth_mindset(client, example)
                print(f"  → Growth Mindset: {gm[:100]}...")
                break
            except Exception as e:
                print(f"  Attempt {attempt+1} failed: {e}")
                if attempt < 2:
                    time.sleep(5)
                else:
                    raise

        # Add 5th alternative
        enriched = dict(example)
        enriched["alternatives"] = dict(example["alternatives"])
        enriched["alternatives"]["growthMindset"] = gm
        selected.append(enriched)

        time.sleep(1)  # rate limit cushion

    # Write output
    out = os.path.join(os.path.dirname(__file__), "..", "src", "data", "examples.json")
    with open(out, "w") as f:
        json.dump(selected, f, indent=2)

    print(f"\n✓ Wrote {len(selected)} examples to {out}")
    for ex in selected:
        print(f"  {ex['id']}: {list(ex['alternatives'].keys())}")


if __name__ == "__main__":
    main()
