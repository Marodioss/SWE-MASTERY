# ⚡ SWE Mastery Hub (From Rusty to God-Tier Developer)

An interactive, premium, and self-documenting technical interview preparation dashboard custom-tailored for (Software Engineer & Autonomous Systems Architect). 

Designed to rapidly bridge a 3-year skill gap and align skills to a **God-Tier Principal Architect** standard across Next.js 15+, advanced JS runtimes, database indexing, custom testing implementations, and AI/RAG system design.

---

## 🚀 Key Features

### 1. 🎓 COLLAPSIBLE STUDY CURRICULUM
A structured roadmap segmented into 11 specialized modules with checklist progress state trackers (saved in LocalStorage) and recommended study reference links (SQLBolt, JavaScript.info, patterns.dev, etc.).
- **Advanced JavaScript & Event Loop** (Closures, prototypes, call-stack states)
- **Next.js 15 App Router Architecture** (RSC vs. Client boundaries, Server Actions, Caching)
- **REST & GraphQL API Design Patterns** (Idempotency, HTTP status codes, security, rate limiting)
- **Algorithms & Data Structures** (Tries, sliding-window patterns, complex sorting)
- **SQL & NoSQL Databases** (B-Tree indices, transactions, ACID properties)
- **AI Integrations & RAG Pipeline Architecture** (Embeddings, semantic searches)
- **Web Performance & Optimisation** (Core Web Vitals, browser reflows, dynamic split loading)
- **Supabase & Postgres Server Architecture** (Row-Level Security RLS, trigger schemas)
- **AI Agents & Scraper Pipelines** (Structured function calling, proxy pools, random jitter)
- **Enterprise Testing & Jest Mocks** (Dependency mocking, spies, test coverage gates)
- **React Three Fiber & WebGL** (Scene graphs, render loop optimization)

### 2. 🎭 MOCK TECHNICAL INTERVIEW SIMULATOR
Access the **Mock Interview Prep** tab to be interviewed by a simulated Principal Engineer. The simulator includes three tracks:
- **Founder & AI Architect** (Throttling scrapers, vector DB indices, cost controls)
- **Enterprise Full-Stack Developer** (Web vitals, bundle sizes, mocking APIs)
- **Core CS & Systems Design** (UML model relations, database indexing selectivity)
- **Evaluation Engine**: Grades your responses from **Rusty** to **God-Tier** based on matching keywords and concepts, offering a detailed performance summary and the model answer to study.

### 3. 🛡️ CLIENT-SIDE ISOLATED CODING SANDBOX
Solve algorithm challenges (e.g. implementing custom `debounce`, writing `Trie` node inserts, executing SQL joins in JS, or normalizing mouse clicks to WebGL NDC coordinates) with a secure sandbox engine:
- **Strict Iframe Sandbox**: Execution runs in a hidden `<iframe>` using `sandbox="allow-scripts"`, preventing custom user inputs from accessing parent page local storage or cookies.
- **IPC messaging via postMessage**: Communicates compiled states and captures console outputs seamlessly.

### 4. 📊 INTERACTIVE SYSTEM VISUALIZERS
- **Event Loop**: Animates the Call Stack, Microtask queue (Promises), and Macrotask queue (timeouts).
- **RAG Workflow Pipeline**: Visually represents text chunking, query embeddings vector distance search, vector storage retrieval, and LLM system prompt synthesis.
- **Big-O Complexity Curves**: Graphical plot of sorting and operations efficiency curves ($O(1)$, $O(\log N)$, $O(N)$, etc.).

---

## 🛠️ Tech Stack
- **Core Framework**: [Next.js 16 (beta/rc)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Visuals**: [Lucide React](https://lucide.dev/)
- **Layout & Aesthetics**: Premium dark theme with custom glassmorphism panels, glowing cards, and micro-animations.

---

## 📦 Project Structure
```text
dev-mastery-hub/
├── src/
│   ├── app/
│   │   ├── globals.css         # Custom theme configuration & visual utility classes
│   │   ├── layout.tsx          # Root HTML structure and fonts settings
│   │   └── page.tsx            # Main router workspace tab navigator
│   ├── components/
│   │   ├── Dashboard.tsx       # Overall statistics & Ultimate Interview Prep Directory
│   │   ├── ModuleList.tsx      # Curriculums, checkpoints, and resources
│   │   ├── QuizRunner.tsx      # Automated module quiz engine
│   │   ├── CodingPlayground.tsx# Secure iframe sandbox coding workspace
│   │   ├── Visualizers.tsx     # Event loop, RAG pipeline, and Big-O SVG plots
│   │   └── InterviewSimulator.tsx # Mock interview grading panels
│   └── data/
│       └── curriculum.ts       # Central database for curriculum contents & challenges
```

---

## 🚀 Setup & Installation

### Prerequisites
Make sure you have [Node.js (v18+)](https://nodejs.org/) installed.

### Setup Steps
1. Navigate to the project directory:
   ```bash
   cd dev-mastery-hub
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

---

## 💾 Local Storage Schema
The app saves your study progress entirely local to your machine. The local keys are:
- `section_completed_{moduleId}_{sectionIndex}`: Tracks lesson checklist items.
- `quiz_completed_{moduleId}`: Marks quiz completion state.
- `challenge_completed_{challengeId}`: Triggers challenge complete status badges.
- `playground_challenge_{challengeId}`: Preserves active editor code values.
