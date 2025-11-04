
# AI AGENT MASTER PROMPT — BUILD A COMPLETE OFFLINE TYPING WEB APP FOR VIETNAMESE KIDS

You are an expert full-stack engineer. Your task is to create a **production-ready** web application from scratch and deliver a repo that **builds cleanly with no errors** and runs **offline**. The app teaches Vietnamese children to touch-type with 10 fingers.

## Tech Choices (hard requirements)
- **Framework:** Next.js 15+ (App Router, TypeScript)
- **Styling:** TailwindCSS + CSS variables; responsive; prefers pastel, kid-friendly UI
- **State:** Minimal (React state + Context/Zustand — choose one and keep code simple)
- **PWA/Offline:** Web App Manifest + Service Worker (precache lessons/assets; work offline)
- **i18n:** Vietnamese as default UI language (use plain JSON i18n — no heavy libs)
- **Tooling:** ESLint + Prettier + simple GitHub Actions CI (`pnpm` or `npm`) to run build
- **No backend required** (all data local; lessons are static JSON packs + on-client generation)

> IMPORTANT: The app must be culturally/localized for **Vietnamese children**. **All user-facing copy should be in Vietnamese** (short, friendly, easy words). Technical comments can be English.

---

## High-Level Features to Implement

1) **Home (Trang chủ)**
   - Big logo/title “Kids Typing”
   - Primary CTA: “Bắt đầu học” → goes to Lessons page
   - Quick settings: Âm thanh (bật/tắt), Kiểu gõ tiếng Việt (Telex/VNI/Không dấu)
   - Tip line: “Đặt hai ngón trỏ lên phím F và J nhé!”

2) **Lessons (Chọn bài học)**
   - Sectioned by level (Level 1 → 4). Button cards for each lesson.
   - Each card shows name + brief description (keys to practice).
   - Clicking a lesson navigates to the **Play** page with that lesson configured.

3) **Play (Màn luyện gõ)**
   - Top: lesson title (no stats here).
   - Middle: **target text line** with per-character states:
     - **Đã gõ đúng**: primary color (xanh) + optional underline
     - **Đã gõ sai**: đỏ (text-red-500 + bg-red-100), **cursor does not advance**
     - **Ký tự cần gõ**: `bg-yellow-200` + `border-b-2 border-yellow-500`
     - **Chưa gõ**: text-gray-400
   - Bottom: **Virtual keyboard** (full 87-key TKL without Fn row):
     - Rows: number row, QWERTY, ASDF, ZXCV, bottom (Space)
     - Include common punctuations: `- = [ ] ; ' , . /`
     - Each key colored by **finger** (LL/LR/LM/LI/TH/RI/RM/RR/RL) — consistent palette
     - When user presses a physical key: corresponding key **highlights** (lighter bg, stronger border, gentle scale)
     - The **current required key** is also highlighted
   - **Backspace rule by lesson**:
     - Level 1–3: `allowBackspace: false` (no deletion; focus on reflex)
     - Level 4+: `allowBackspace: true` (allow correcting)
   - No WPM/Accuracy display here (for clarity).

4) **Result (Màn kết quả)**
   - Show **WPM** and **Accuracy** for that session + cute sticker (emoji)
   - Actions: “Làm lại” / “Chọn bài khác”
   - Persist session summary locally (localStorage/IndexedDB)

5) **Offline/PWA**
   - `manifest.webmanifest` with icons
   - Service Worker:
     - Precache: app shell, fonts, sounds, **core lessons pack JSON**
     - Runtime: Cache-First for static, Network-First fallback for JSON to allow updates
   - App loads and functions fully offline after first visit

---

## “KẾT QUẢ THIẾT KẾ BÀI GIẢNG” (CURRICULUM SPEC) — IMPLEMENT EXACTLY

> Implement a **lesson engine** separate from UI. Lessons provide target generation; UI just renders.

### Lesson Types
- `sequence`: walk keys in order (ascend/descend/mirror) by rows
- `finger-mix`: keys grouped by specific finger(s), mixed
- `region-random`: random within a region pool with constraints
- `timed`: generate a stream for N seconds from a pool

### JSON Schema (example)
```ts
type LessonBase = {
  id: string;
  title: string;
  type: "sequence" | "finger-mix" | "region-random" | "timed";
  pool: string[];           // keys included in lesson
  goal: { wpm: number; accuracy: number; timeSec?: number };
  allowBackspace?: boolean; // default false for early levels
};

type SequenceLesson = LessonBase & {
  type: "sequence";
  pattern: "ascend" | "descend" | "mirror" | "shuffle";
  chunk: number;  // chars per chunk
  repeat: number; // number of chunks
};

type FingerMixLesson = LessonBase & {
  type: "finger-mix";
  finger?: "LL"|"LR"|"LM"|"LI"|"RI"|"RM"|"RR"|"RL";
  chunk: number;
  repeat: number;
  maxRepeat?: number; // no more than N identical in a row
};

type RegionRandomLesson = LessonBase & {
  type: "region-random";
  minRun?: number;     // at least N distinct in a run
  maxRepeat?: number;  // avoid repeating same key > N
  length: number;      // total characters to produce
};

type TimedLesson = LessonBase & {
  type: "timed";
  timeLimitSec: number;
};
```

### Deterministic Generation (for repeatability)

* Use seeded PRNG:

```ts
function rng(seed: number) {
  return () => (seed = (seed*1664525 + 1013904223) >>> 0) / 4294967296;
}
```

* Ensure `maxRepeat` and `minRun` constraints are respected.
* For `sequence`, build by pattern → split into chunks → repeat.
* For `timed`, generate until elapsed reaches `timeLimitSec`.

### Starter Lesson Pack (`/public/lessons/core-pack.json`)

Include **these 10 starter lessons** (exactly, Vietnamese titles):

```json
[
  { "id":"L1-1","title":"Hàng giữa (trái→phải)","type":"sequence","pool":["a","s","d","f","j","k","l",";"],"pattern":"ascend","chunk":4,"repeat":8,"goal":{"wpm":12,"accuracy":90},"allowBackspace":false},
  { "id":"L1-2","title":"Hàng trên (trái→phải)","type":"sequence","pool":["q","w","e","r","t","y","u","i","o","p"],"pattern":"ascend","chunk":5,"repeat":6,"goal":{"wpm":13,"accuracy":90},"allowBackspace":false},
  { "id":"L1-3","title":"Hàng dưới (trái→phải)","type":"sequence","pool":["z","x","c","v","b","n","m",",",".","/"],"pattern":"ascend","chunk":5,"repeat":6,"goal":{"wpm":14,"accuracy":90},"allowBackspace":false},
  { "id":"L2-1","title":"Ngón trỏ trái (lẫn hàng)","type":"finger-mix","pool":["r","f","v","t","g","b"],"chunk":6,"repeat":6,"goal":{"wpm":16,"accuracy":92},"allowBackspace":false},
  { "id":"L2-2","title":"Ngón trỏ phải (lẫn hàng)","type":"finger-mix","pool":["y","h","n","u","j","m"],"chunk":6,"repeat":6,"goal":{"wpm":16,"accuracy":92},"allowBackspace":false},
  { "id":"L2-3","title":"Ngón giữa hai tay","type":"finger-mix","pool":["e","d","i","k"],"chunk":4,"repeat":10,"goal":{"wpm":17,"accuracy":92},"allowBackspace":false},
  { "id":"L3-1","title":"Vùng trung tâm (random)","type":"region-random","pool":["f","j","d","k","s","l","a",";"],"minRun":2,"maxRepeat":2,"length":120,"goal":{"wpm":18,"accuracy":93},"allowBackspace":false},
  { "id":"L3-2","title":"Hai hàng trên+dưới (random)","type":"region-random","pool":["q","w","e","r","t","y","u","i","o","p","z","x","c","v","b","n","m"],"minRun":2,"maxRepeat":2,"length":140,"goal":{"wpm":19,"accuracy":93},"allowBackspace":false},
  { "id":"L4-1","title":"1 phút chính xác","type":"timed","pool":["a","s","d","f","j","k","l",";"],"timeLimitSec":60,"goal":{"wpm":22,"accuracy":94,"timeSec":60},"allowBackspace":true},
  { "id":"L4-2","title":"Combo 10 phím","type":"region-random","pool":["a","s","d","f","j","k","l",";"],"minRun":1,"maxRepeat":1,"length":100,"goal":{"wpm":22,"accuracy":94},"allowBackspace":true}
]
```

---

## Virtual Keyboard Requirements

### Layout

* **87-key TKL (Windows)** without Fn row:

  * Number row: `` ` 1 2 3 4 5 6 7 8 9 0 - = ``
  * Row 2: `q w e r t y u i o p [ ]`
  * Row 3: `a s d f g h j k l ; '`
  * Row 4: `z x c v b n m , . /`
  * Bottom: **Space** (plus simple modifiers: optional Left/Right Shift if needed for visuals; no need to implement Shift logic now)
* Each key shows visible label; Space shows “Space”.

### Finger Colors

* Map each key to a **finger id** and color:

  * LL, LR, LM, LI (left little/ring/middle/index)
  * TH (thumbs for Space)
  * RI, RM, RR, RL (right index/middle/ring/little)
* Provide a consistent pastel palette. Example:

  * LL `#FCA5A5`, LR `#FBCFE8`, LM `#FDE68A`, LI `#86EFAC`,
  * TH `#E5E7EB`,
  * RI `#93C5FD`, RM `#C7D2FE`, RR `#DDD6FE`, RL `#FBCFE8`

### Interaction

* Listen to `keydown`/`keyup`
* When pressed: lighten background (+ stronger border; subtle scale)
* Also highlight the **current target key**

---

## Data & Metrics

* In Play view, **no metrics shown**.
* On Result view, compute:

  * **WPM** = (correctChars/5) / minutes (ignore paused time >2s)
  * **Accuracy** = correct / total typed
* Store last N sessions summary locally.

---

## File/Folder Structure (proposal)

```
/src
  /app
    /(routes)
      /page.tsx                # Home
      /lessons/page.tsx        # Lesson Select
      /play/[id]/page.tsx      # Play per lesson
      /result/[id]/page.tsx    # Result screen
    /globals.css
    /layout.tsx
  /components
    Keyboard.tsx
    TargetLine.tsx
    Buttons.tsx
    Toggle.tsx
  /lib
    lesson-engine/
      index.ts                 # switch by type
      sequence.ts
      fingerMix.ts
      regionRandom.ts
      timed.ts
      rng.ts
    typing/
      normalizeKey.ts          # maps KeyboardEvent.key to our key labels
      evaluate.ts              # scoring, correctness
      fingerMap.ts             # key -> finger id
  /styles
    theme.css
/public
  /lessons/core-pack.json
  /icons/*                     # PWA icons
  manifest.webmanifest
/service-worker.js
/tailwind.config.ts
/tsconfig.json
/eslint.config.js
/.github/workflows/ci.yml
/package.json
```

---

## Implementation Notes

* **Types**: Strict TS config, no implicit `any`. Provide types for lessons and engine outputs.
* **Keyboard mapping**: ensure `KeyboardEvent.key` normalization (lowercase, convert space to `"space"`, handle `'` and `;`, etc.).
* **TargetLine**:

  * Render an array of spans with role/state classes:

    * `typedCorrect`, `typedWrong`, `current`, `upcoming`
  * If wrong key pressed and `allowBackspace=false`: mark current as wrong and do **not** advance index.
  * If `allowBackspace=true`: support backspace to revert last typed char & state.
* **Accessible focus**: Main Play area should capture focus on mount (so kids can type immediately).
* **Sounds (optional)**: Include local short `ting.wav` (correct) & `oops.wav` (wrong) and a global toggle.
* **No external network dependencies at runtime** (fonts local or system stack).
* **All UI copy** in Vietnamese.

---

## PWA/Offline

* `manifest.webmanifest` with proper `name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color`, `background_color`, icons.
* `service-worker.js`:

  * Precache: app shell, `/public/lessons/core-pack.json`, icons, sounds
  * Runtime: Cache-First for assets; Network-First with Cache fallback for lesson JSON
  * Versioned cache keys to bust old caches on deploy
* Provide install prompt (deferred) and “Ứng dụng đã sẵn sàng hoạt động offline” toast after SW activates.

---

## Scripts & CI

* **package.json** must include:

  * `"dev"`, `"build"`, `"start"`, `"lint"`, `"typecheck"`
* ESLint + Prettier configs included and passing.
* **GitHub Actions** (`.github/workflows/ci.yml`):

  * Node 20+, install deps, run `lint`, `typecheck`, `build`.
  * Build must pass (no TypeScript or ESLint errors).

---

## Acceptance Criteria (do not skip)

1. `pnpm install && pnpm build` (or `npm`) completes with **zero errors**.
2. App runs with `pnpm start` and is accessible at `/`.
3. Home → Lessons → Play → Result flow works.
4. Play shows: **Target line with correct/sai/current/upcoming styles**.
5. Virtual keyboard shows **full 87-key layout** (no Fn row), colored by finger; **press highlight** works.
6. Backspace behavior matches lesson setting (off for early levels).
7. PWA installs; app works **offline** after first load; lessons load from cache.
8. All user-facing text is **Vietnamese** by default.
9. Codebase is clean, typed, and structured per the tree above.

---

## Deliverables

* A complete repo ready to run:

  * All source code, configs, assets (icons, sounds), lessons JSON
  * README (Vietnamese) with: cài đặt, chạy, build, offline usage, cấu trúc thư mục
* Ensure screenshots or short GIFs in README (optional).

---

## START NOW

* Scaffold Next.js (App Router, TS), add Tailwind, ESLint/Prettier, PWA boilerplate.
* Implement pages/components/libs as specified.
* Populate `/public/lessons/core-pack.json` with the 10 lessons above.
* Verify build and offline behavior.
