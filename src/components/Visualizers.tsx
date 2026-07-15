'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowRight, Database, Search, Cpu, FileText, Send, Sparkles } from 'lucide-react';

export default function Visualizers() {
  const [activeVisualizer, setActiveVisualizer] = useState<'event-loop' | 'rag' | 'big-o'>('event-loop');

  return (
    <div className="flex flex-col gap-6">
      {/* Selector Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveVisualizer('event-loop')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeVisualizer === 'event-loop'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Event Loop Internals
        </button>
        <button
          onClick={() => setActiveVisualizer('rag')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeVisualizer === 'rag'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          RAG Pipeline Workflow
        </button>
        <button
          onClick={() => setActiveVisualizer('big-o')}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeVisualizer === 'big-o'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          Big-O Complexity Chart
        </button>
      </div>

      {/* Render selected visualizer */}
      <div className="min-h-[500px]">
        {activeVisualizer === 'event-loop' && <EventLoopVisualizer />}
        {activeVisualizer === 'rag' && <RagVisualizer />}
        {activeVisualizer === 'big-o' && <BigOVisualizer />}
      </div>
    </div>
  );
}

// ==========================================
// 1. EVENT LOOP VISUALIZER
// ==========================================
function EventLoopVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [callStack, setCallStack] = useState<string[]>([]);
  const [microtasks, setMicrotasks] = useState<string[]>([]);
  const [macrotasks, setMacrotasks] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const steps = [
    {
      desc: "Script runs: console.log('Sync 1') pushed to Call Stack & executes immediately.",
      action: () => {
        setCallStack(["console.log('Sync 1')"]);
        setConsoleOutput(prev => [...prev, "Sync 1"]);
      }
    },
    {
      desc: "Call Stack clears. Runtime sees setTimeout(..., 0) and delegates it to Web APIs timer thread.",
      action: () => {
        setCallStack(["setTimeout(fn, 0)"]);
      }
    },
    {
      desc: "Timer expires immediately. setTimeout callback pushed to Macrotask Queue. Call Stack clears.",
      action: () => {
        setCallStack([]);
        setMacrotasks(["cb (setTimeout)"]);
      }
    },
    {
      desc: "Runtime registers Promise.resolve().then(cb). Promise callback pushed to Microtask Queue.",
      action: () => {
        setCallStack(["Promise.then(...)"]);
        setMicrotasks(["cb (Promise)"]);
      }
    },
    {
      desc: "Call Stack clears. console.log('Sync 2') pushed to Call Stack & executes immediately.",
      action: () => {
        setCallStack(["console.log('Sync 2')"]);
        setConsoleOutput(prev => [...prev, "Sync 2"]);
      }
    },
    {
      desc: "Call Stack is empty. Event Loop checks Microtask Queue first and processes Promise callback.",
      action: () => {
        setCallStack(["cb (Promise)"]);
        setMicrotasks([]);
      }
    },
    {
      desc: "Promise callback executes console.log('Promise'). Call Stack clears. Microtask Queue is now empty.",
      action: () => {
        setCallStack(["console.log('Promise')"]);
        setConsoleOutput(prev => [...prev, "Promise"]);
      }
    },
    {
      desc: "Microtasks cleared. Event Loop checks Macrotask Queue and dequeues setTimeout callback.",
      action: () => {
        setCallStack(["cb (setTimeout)"]);
        setMacrotasks([]);
      }
    },
    {
      desc: "setTimeout callback runs console.log('Timeout'). Event Loop finishes execution cycle.",
      action: () => {
        setCallStack(["console.log('Timeout')"]);
        setConsoleOutput(prev => [...prev, "Timeout"]);
      }
    },
    {
      desc: "All queues cleared! Execution complete.",
      action: () => {
        setCallStack([]);
      }
    }
  ];

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(t => clearTimeout(t));
    timeoutRefs.current = [];
  };

  const handleStartAnimation = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setCurrentStep(0);
    setCallStack([]);
    setMicrotasks([]);
    setMacrotasks([]);
    setConsoleOutput([]);
    clearAllTimeouts();

    let delay = 0;
    steps.forEach((step, idx) => {
      const t = setTimeout(() => {
        setCurrentStep(idx);
        step.action();
        if (idx === steps.length - 1) {
          setIsPlaying(false);
        }
      }, delay);
      timeoutRefs.current.push(t);
      delay += 3000; // 3 seconds per transition step
    });
  };

  const handleReset = () => {
    clearAllTimeouts();
    setIsPlaying(false);
    setCurrentStep(-1);
    setCallStack([]);
    setMicrotasks([]);
    setMacrotasks([]);
    setConsoleOutput([]);
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Code panel & control */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            Interactive Event Loop Sandbox
          </h4>
          <pre className="bg-gray-950 p-4 rounded-xl font-mono text-xs text-indigo-200 overflow-x-auto">
{`console.log('Sync 1');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('Sync 2');`}
          </pre>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleStartAnimation}
              disabled={isPlaying}
              className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition ${
                isPlaying
                  ? 'bg-gray-850 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10'
              }`}
            >
              <Play className="w-3.5 h-3.5" /> Start Simulation
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800 flex-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Status Explainer
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed font-sans min-h-[80px]">
            {currentStep === -1
              ? "Click 'Start Simulation' to animate how the JavaScript runtime processes synchronous code, microtasks, and macrotasks step-by-step."
              : steps[currentStep]?.desc}
          </p>
        </div>
      </div>

      {/* Visual representation */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Call Stack & Console */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-xl border border-gray-800 h-[220px] flex flex-col">
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Call Stack (LIFO)
            </h5>
            <div className="flex-1 flex flex-col justify-end gap-1.5 border border-indigo-950 bg-black/30 p-4 rounded-lg overflow-y-auto">
              {callStack.length === 0 ? (
                <div className="text-center text-xs text-gray-600 italic py-4">Stack is Empty</div>
              ) : (
                callStack.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-indigo-600/90 border border-indigo-400/30 text-white font-mono text-xs py-2 px-3 rounded-lg text-center shadow-lg shadow-indigo-600/10 animate-scaleIn"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-gray-800 h-[220px] flex flex-col">
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Standard Output (Console)
            </h5>
            <div className="flex-1 bg-black/45 p-4 rounded-lg font-mono text-xs text-emerald-400 overflow-y-auto space-y-1">
              {consoleOutput.length === 0 ? (
                <span className="text-gray-600 italic">No output rendered.</span>
              ) : (
                consoleOutput.map((out, idx) => (
                  <div key={idx} className="border-b border-gray-950/20 py-0.5">
                    &gt; {out}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Queues */}
        <div className="flex flex-col gap-4">
          {/* Microtask Queue */}
          <div className="glass-panel p-4 rounded-xl border border-gray-800 h-[220px] flex flex-col">
            <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Microtask Queue (FIFO) - High Priority
            </h5>
            <div className="flex-1 flex items-center justify-start gap-2 border border-emerald-950 bg-black/30 p-4 rounded-lg overflow-x-auto">
              {microtasks.length === 0 ? (
                <div className="w-full text-center text-xs text-gray-600 italic">Queue is Empty</div>
              ) : (
                microtasks.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-600/90 border border-emerald-400/30 text-white font-mono text-xs py-2 px-3 rounded-lg text-center shadow-lg shadow-emerald-600/10 shrink-0"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Macrotask Queue */}
          <div className="glass-panel p-4 rounded-xl border border-gray-800 h-[220px] flex flex-col">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Macrotask Queue (FIFO) - Low Priority
            </h5>
            <div className="flex-1 flex items-center justify-start gap-2 border border-amber-950 bg-black/30 p-4 rounded-lg overflow-x-auto">
              {macrotasks.length === 0 ? (
                <div className="w-full text-center text-xs text-gray-600 italic">Queue is Empty</div>
              ) : (
                macrotasks.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-600/90 border border-amber-400/30 text-white font-mono text-xs py-2 px-3 rounded-lg text-center shadow-lg shadow-amber-600/10 shrink-0"
                  >
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. RAG PIPELINE VISUALIZER
// ==========================================
interface ChunkNode {
  id: number;
  text: string;
  score?: number;
}

function RagVisualizer() {
  const [query, setQuery] = useState('');
  const [pipelineState, setPipelineState] = useState<'idle' | 'chunking' | 'embedding' | 'searching' | 'llm' | 'complete'>('idle');
  const [retrievedChunks, setRetrievedChunks] = useState<ChunkNode[]>([]);
  const [generatedAnswer, setGeneratedAnswer] = useState('');

  const docChunks: ChunkNode[] = [
    { id: 1, text: "A closure is created when an inner function references variables from its outer scope. This binds the function to its lexical scope context." },
    { id: 2, text: "The event loop in JavaScript checks if the call stack is empty. If it is, it executes queued microtasks, and then processes macrotasks next." },
    { id: 3, text: "Vector databases index embeddings using distance metrics like cosine similarity, enabling semantic search of documents in constant time." },
    { id: 4, text: "Next.js App Router relies on React Server Components (RSC) to render UI on the server, sending zero client bundle sizes for pure components." }
  ];

  const handleSimulateRAG = () => {
    if (!query.trim()) return;
    setPipelineState('chunking');
    setRetrievedChunks([]);
    setGeneratedAnswer('');

    // Step 1: Chunking & Indexing simulation
    setTimeout(() => {
      setPipelineState('embedding');
      
      // Step 2: Query Embedding & Cosine Similarity search
      setTimeout(() => {
        setPipelineState('searching');
        
        // Find best match based on keywords for mock search
        const lowerQ = query.toLowerCase();
        let scores = docChunks.map(c => {
          let score = 0.05;
          if (lowerQ.includes('closure') && c.id === 1) score = 0.95;
          else if (lowerQ.includes('event') || lowerQ.includes('loop') || lowerQ.includes('settimeout') ? c.id === 2 : false) score = 0.92;
          else if (lowerQ.includes('vector') || lowerQ.includes('search') || lowerQ.includes('index') ? c.id === 3 : false) score = 0.88;
          else if (lowerQ.includes('next') || lowerQ.includes('react') || lowerQ.includes('server') ? c.id === 4 : false) score = 0.91;
          
          return { ...c, score: parseFloat(score.toFixed(2)) };
        });

        // Sort by score
        scores.sort((a, b) => (b.score || 0) - (a.score || 0));
        setRetrievedChunks(scores.slice(0, 2));

        // Step 3: LLM generation
        setTimeout(() => {
          setPipelineState('llm');
          
          setTimeout(() => {
            setPipelineState('complete');
            // Mock answer generation
            const bestMatch = scores[0];
            if (bestMatch && (bestMatch.score || 0) > 0.5) {
              if (bestMatch.id === 1) {
                setGeneratedAnswer("Closures work by preserving the lexical scope references. When the outer function finishes, the garbage collector preserves variables referenced by the returned inner function closure.");
              } else if (bestMatch.id === 2) {
                setGeneratedAnswer("The event loop behaves by checking the call stack. Once clear, it drains the Microtask queue (like Promises) entirely, then processes one Macrotask (like setTimeout).");
              } else if (bestMatch.id === 3) {
                setGeneratedAnswer("Vector search computes cosine similarity distance between your query embedding vector and stored document vectors, pulling coordinates with the highest similarity indexes.");
              } else if (bestMatch.id === 4) {
                setGeneratedAnswer("Next.js Server Components render fully on the server and export static static-site rendering structures or stream components via Suspense without hydrating Javascript to the browser.");
              }
            } else {
              setGeneratedAnswer("Based on the retrieval index, I could not find a highly similar context snippet. Broadly speaking, your query relates to modern software engineering concepts.");
            }
          }, 2500);
        }, 2000);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Search Input panel */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-gray-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            RAG Query Interface
          </h4>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask: 'How do closures work?'..."
              disabled={pipelineState !== 'idle' && pipelineState !== 'complete'}
              className="flex-1 bg-gray-900 border border-gray-850 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSimulateRAG}
              disabled={!query.trim() || (pipelineState !== 'idle' && pipelineState !== 'complete')}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-850 disabled:text-gray-500 text-white p-2.5 rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-xs text-gray-400">
            <p className="mb-2 font-semibold text-gray-300">Try these sample queries:</p>
            <div className="flex flex-wrap gap-2">
              {["How closures work", "What is the event loop", "Explain vector DBs", "RSC in NextJS"].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(q)}
                  disabled={pipelineState !== 'idle' && pipelineState !== 'complete'}
                  className="bg-gray-900/60 hover:bg-gray-800 border border-gray-850 rounded-lg px-2.5 py-1 text-gray-300 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800 flex-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Status Logs
          </h4>
          <div className="space-y-2 text-xs font-mono text-indigo-200">
            {pipelineState === 'idle' && <div className="text-gray-500 italic">Waiting for query input...</div>}
            {pipelineState !== 'idle' && (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Query submitted: &quot;{query}&quot;
              </div>
            )}
            {(pipelineState === 'chunking' || pipelineState === 'embedding' || pipelineState === 'searching' || pipelineState === 'llm' || pipelineState === 'complete') && (
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Parsed prompt. Generating query vectors...
              </div>
            )}
            {(pipelineState === 'searching' || pipelineState === 'llm' || pipelineState === 'complete') && (
              <div className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                Searching Vector Index (Cosine Similarity). Top chunks returned.
              </div>
            )}
            {(pipelineState === 'llm' || pipelineState === 'complete') && (
              <div className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Assembling system prompt. Prompting LLM generation API...
              </div>
            )}
            {pipelineState === 'complete' && (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Answer generated successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Canvas Pipeline */}
      <div className="lg:col-span-8 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col justify-between overflow-x-auto min-w-[500px]">
        {/* Stages map */}
        <div className="flex items-center justify-between gap-2 border-b border-gray-850 pb-6 mb-6">
          <div className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${pipelineState === 'chunking' ? 'bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20' : 'text-gray-500'}`}>
            <FileText className="w-6 h-6" />
            <span className="text-[10px]">1. Ingestion</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-700" />
          
          <div className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${pipelineState === 'embedding' ? 'bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20' : 'text-gray-500'}`}>
            <Cpu className="w-6 h-6" />
            <span className="text-[10px]">2. Embeddings</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-700" />

          <div className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${pipelineState === 'searching' ? 'bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20' : 'text-gray-500'}`}>
            <Database className="w-6 h-6" />
            <span className="text-[10px]">3. Vector Index</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-700" />

          <div className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center ${pipelineState === 'llm' ? 'bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20' : 'text-gray-500'}`}>
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px]">4. LLM synthesis</span>
          </div>
        </div>

        {/* Dynamic graphics */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          {/* Retrieved Context Cards */}
          {(pipelineState === 'searching' || pipelineState === 'llm' || pipelineState === 'complete') && (
            <div>
              <h5 className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                Retrieved Context (Similarity Score Threshold &gt; 0.5)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {retrievedChunks.map((chunk, idx) => (
                  <div key={idx} className="bg-gray-950 p-3 rounded-lg border border-gray-850 animate-scaleIn">
                    <div className="flex justify-between items-center mb-1.5 border-b border-gray-900 pb-1">
                      <span className="text-[10px] font-bold text-gray-400">Doc Chunk #{chunk.id}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        Score: {chunk.score}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 italic">{chunk.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt construction & answer */}
          {pipelineState === 'llm' && (
            <div className="bg-indigo-950/20 border border-indigo-500/20 p-4 rounded-xl animate-pulse">
              <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Synthesizing Prompt...</span>
              <p className="text-xs text-gray-400 italic">Constructing contextual instructions for the generative engine...</p>
            </div>
          )}

          {pipelineState === 'complete' && (
            <div className="bg-emerald-950/10 border border-emerald-500/20 p-4 rounded-xl animate-scaleIn">
              <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> LLM Generation response
              </span>
              <p className="text-xs text-gray-100 leading-relaxed font-sans font-medium">
                {generatedAnswer}
              </p>
            </div>
          )}

          {pipelineState === 'idle' && (
            <div className="text-center py-10 text-gray-600 text-xs italic">
              Input a query to witness the semantic retrieval flow.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. BIG-O COMPLEXITY CHART
// ==========================================
function BigOVisualizer() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Legend & explanations */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
            Complexity Tiers (Big-O notation)
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <div className="text-xs">
                <span className="font-semibold text-white">O(1) - Constant</span>: Instant. Array index lookup, Hash Map searches.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-teal-500" />
              <div className="text-xs">
                <span className="font-semibold text-white">O(log N) - Logarithmic</span>: Great. Binary Search, Balanced tree lookups.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <div className="text-xs">
                <span className="font-semibold text-white">O(N) - Linear</span>: Fair. Single loops, linear array scans.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="text-xs">
                <span className="font-semibold text-white">O(N log N) - Pseudo-Linear</span>: Medium. QuickSort, MergeSort.
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <div className="text-xs">
                <span className="font-semibold text-white">O(N²) - Quadratic</span>: Poor. Nested loops, bubble sorting.
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800 flex-1">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Big-O Study Sheet Guidelines
          </h4>
          <table className="w-full text-[11px] text-gray-400 border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-left text-gray-300">
                <th className="py-2">Data Structure</th>
                <th className="py-2">Average Lookup</th>
                <th className="py-2">Worst Insertion</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-850">
                <td className="py-1.5 font-mono text-white">Hash Table</td>
                <td className="py-1.5 text-emerald-400 font-mono">O(1)</td>
                <td className="py-1.5 text-indigo-400 font-mono">O(N)</td>
              </tr>
              <tr className="border-b border-gray-850">
                <td className="py-1.5 font-mono text-white">Binary Search Tree</td>
                <td className="py-1.5 text-teal-400 font-mono">O(log N)</td>
                <td className="py-1.5 text-indigo-400 font-mono">O(N)</td>
              </tr>
              <tr className="border-b border-gray-850">
                <td className="py-1.5 font-mono text-white">Trie (Length L)</td>
                <td className="py-1.5 text-emerald-400 font-mono">O(L)</td>
                <td className="py-1.5 text-emerald-400 font-mono">O(L)</td>
              </tr>
              <tr>
                <td className="py-1.5 font-mono text-white">Linked List</td>
                <td className="py-1.5 text-indigo-400 font-mono">O(N)</td>
                <td className="py-1.5 text-emerald-400 font-mono">O(1)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SVG Canvas Plot */}
      <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 align-self-start">
          Operations Count (y) vs Elements Size (x)
        </h4>
        <svg viewBox="0 0 400 300" className="w-full max-w-[450px] overflow-visible bg-black/20 p-2 border border-gray-850 rounded-xl">
          {/* Axis */}
          <line x1="40" y1="260" x2="380" y2="260" stroke="#4b5563" strokeWidth="2" />
          <line x1="40" y1="20" x2="40" y2="260" stroke="#4b5563" strokeWidth="2" />
          
          <text x="375" y="275" fill="#9ca3af" fontSize="10" textAnchor="end">Elements (N)</text>
          <text x="25" y="30" fill="#9ca3af" fontSize="10" transform="rotate(-90 25 30)" textAnchor="end">Operations</text>

          {/* O(1) Constant - Horizontal line */}
          <line x1="40" y1="240" x2="360" y2="240" stroke="#10b981" strokeWidth="2" />
          <text x="365" y="243" fill="#10b981" fontSize="10" fontWeight="bold">O(1)</text>

          {/* O(log N) - Slight logarithmic curve */}
          <path d="M 40 260 Q 150 215 360 210" fill="none" stroke="#14b8a6" strokeWidth="2" />
          <text x="365" y="213" fill="#14b8a6" fontSize="10" fontWeight="bold">O(log N)</text>

          {/* O(N) Linear - Diagonal line */}
          <line x1="40" y1="260" x2="300" y2="80" stroke="#6366f1" strokeWidth="2" />
          <text x="305" y="75" fill="#6366f1" fontSize="10" fontWeight="bold">O(N)</text>

          {/* O(N log N) - Steeper curve */}
          <path d="M 40 260 Q 180 120 230 40" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <text x="235" y="35" fill="#f59e0b" fontSize="10" fontWeight="bold">O(N log N)</text>

          {/* O(N^2) Quadratic - Parabolic curve */}
          <path d="M 40 260 Q 90 140 100 20" fill="none" stroke="#ef4444" strokeWidth="2" />
          <text x="105" y="25" fill="#ef4444" fontSize="10" fontWeight="bold">O(N²)</text>
        </svg>
      </div>
    </div>
  );
}
