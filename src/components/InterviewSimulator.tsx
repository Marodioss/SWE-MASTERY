'use client';

import React, { useState } from 'react';
import { Send, ArrowRight, ShieldAlert, Award, AlertCircle, RefreshCw, Cpu, Brain, Flame } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  expectedKeywords: string[];
  suggestedSolution: string;
}

interface InterviewTrack {
  id: string;
  name: string;
  role: string;
  icon: string;
  questions: Question[];
}

const interviewTracks: InterviewTrack[] = [
  {
    id: "founder-architect",
    name: "Founder & AI Architect (Eminence Digital / Cypher)",
    role: "AI-Powered Systems Designer",
    icon: "Brain",
    questions: [
      {
        id: 1,
        question: "How would you design a scalable, rate-limiting, and robust scraper for the Facebook Ad Library to feed your AI market research database in Supabase, preventing IP blocking and database request flooding?",
        expectedKeywords: ["proxy", "user-agent", "jitter", "queue", "redis", "bullmq", "rls", "batch", "upsert"],
        suggestedSolution: "A robust solution requires an ingestion queue (e.g. BullMQ or Redis) to throttle scrapers. Scrapers must use rotating proxies, rotating user-agents, and randomized delays (jitter) to mimic real users. For storage in Supabase, client updates should batch writes (upsert) to minimize transaction locks, and apply database Row-Level Security (RLS) policies targeting specific service roles."
      },
      {
        id: 2,
        question: "When building autonomous LLM-driven agent loops (like Cypher product discovery), how do you implement tool-calling boundaries to prevent the agent from executing loops infinitely and running up extreme OpenAI API costs?",
        expectedKeywords: ["max iterations", "budget", "token limit", "timeout", "circuit breaker", "system prompt", "structured output", "zod"],
        suggestedSolution: "To prevent agent loop runaways, enforce strict boundaries: (1) Set a strict maximum iteration counter (e.g., max 5 loops per run). (2) Implement a circuit breaker that stops if cumulative token cost/tokens exceed a certain budget threshold. (3) Force structured tool responses using schemas (OpenAI function calling or Zod models) so the agent outputs clean parameters instead of generating loose text, and (4) Optimize context sizes by pruning old history."
      }
    ]
  },
  {
    id: "enterprise-fullstack",
    name: "Enterprise Full-Stack Developer (Capgemini focus)",
    role: "Senior Product Developer",
    icon: "Flame",
    questions: [
      {
        id: 1,
        question: "In your Capgemini project, you optimized modules to reduce load times by 30%. Technically, what web performance optimizations (specifically in React, Next.js, and network levels) did you deploy to achieve this result?",
        expectedKeywords: ["dynamic", "lazy", "server components", "bundle", "code splitting", "caching", "cdn", "image", "cls", "lighthouse"],
        suggestedSolution: "We achieved the 30% speedup by: (1) Moving components to React Server Components (RSC) to remove javascript payload sizes from client bundles. (2) Splitting remaining client components using dynamic imports (next/dynamic / React.lazy). (3) Implementing edge caching (CDN) for database content and dynamic queries. (4) Optimizing layout shifts (CLS) using Next.js Image component sizing properties, and (5) Analysing asset sizes using Next Bundle Analyzer."
      },
      {
        id: 2,
        question: "How do you mock asynchronous database functions and external APIs in Jest to maintain a coverage threshold above 80% without doing real network or database calls?",
        expectedKeywords: ["jest.mock", "jest.fn", "mockresolvedvalue", "mockrejectedvalue", "spyOn", "coverage", "isolate", "spies"],
        suggestedSolution: "We isolate tests using Jest mocks. Use jest.mock('@/lib/db') to replace the database driver module. Then, import the database service and stub target functions with mock implementations: db.user.findMany.mockResolvedValue([{ id: 1 }]). This tests all branch pathways (including error states via mockRejectedValue) without network hits, which boosts coverage percentages reliably."
      }
    ]
  },
  {
    id: "general-systems",
    name: "Core CS & MIAGE Systems Design (Master's / EMSI)",
    role: "Principal Systems Engineer",
    icon: "Cpu",
    questions: [
      {
        id: 1,
        question: "Describe how database B-Tree index structures differ from Hash indices, and how you decide which column to index to optimize query speeds.",
        expectedKeywords: ["b-tree", "hash", "range query", "equality", "selectivity", "explain analyze", "scans", "cardinality"],
        suggestedSolution: "B-Tree indexes store sorted nodes, making them optimal for equality (=) and range (<, >, BETWEEN) queries. Hash indexes resolve elements in O(1) time but only support exact matches, not range queries. You should index columns with high selectivity (cardinality), columns used in JOIN conditions, and verify index usage using EXPLAIN ANALYZE."
      },
      {
        id: 2,
        question: "Explain the difference between class diagram relations (Association, Aggregation, and Composition) in UML modeling, and how composition translates into OOP code.",
        expectedKeywords: ["lifecycle", "aggregation", "composition", "association", "ownership", "new", "private", "delete"],
        suggestedSolution: "Association is a general connection between classes. Aggregation represents a 'has-a' relationship where the child can exist independently of the parent. Composition is a strong ownership 'has-a' relationship where the child lifecycle is fully controlled by the parent; if the parent is deleted, the child is deleted. In OOP, composition translates to instantiating the child class directly inside the parent constructor (new ChildClass()) so it cannot be accessed outside."
      }
    ]
  }
];

export default function InterviewSimulator() {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    grade: 'Rusty' | 'Intermediate' | 'Senior Architect' | 'God-Tier Developer';
    matchedKeywords: string[];
    missingKeywords: string[];
    feedback: string;
  } | null>(null);
  const [chatHistory, setChatHistory] = useState<{ role: 'interviewer' | 'candidate'; text: string }[]>([]);

  const activeTrack = interviewTracks.find(t => t.id === selectedTrackId);
  const currentQuestion = activeTrack?.questions[currentQuestionIdx];

  const handleStartTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    setCurrentQuestionIdx(0);
    setUserAnswer('');
    setEvaluation(null);
    const track = interviewTracks.find(t => t.id === trackId)!;
    setChatHistory([
      { role: 'interviewer', text: `Welcome to the ${track.role} panel. I see on your resume that you have experience in these fields. Let's start. \n\n${track.questions[0].question}` }
    ]);
  };

  const handleResetTrack = () => {
    setSelectedTrackId(null);
    setCurrentQuestionIdx(0);
    setUserAnswer('');
    setEvaluation(null);
    setChatHistory([]);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    setIsSubmitting(true);

    setTimeout(() => {
      // Evaluate answer based on keywords
      const lowercaseAns = userAnswer.toLowerCase();
      const matched: string[] = [];
      const missing: string[] = [];

      currentQuestion.expectedKeywords.forEach(kw => {
        if (lowercaseAns.includes(kw)) {
          matched.push(kw);
        } else {
          missing.push(kw);
        }
      });

      const keywordRatio = matched.length / currentQuestion.expectedKeywords.length;
      let score = Math.round(keywordRatio * 100);
      
      // Determine grade
      let grade: 'Rusty' | 'Intermediate' | 'Senior Architect' | 'God-Tier Developer' = 'Rusty';
      if (score >= 80) grade = 'God-Tier Developer';
      else if (score >= 50) grade = 'Senior Architect';
      else if (score >= 25) grade = 'Intermediate';

      // Assemble feedback
      let feedback = "";
      if (grade === 'God-Tier Developer') {
        feedback = "Incredible response! You hit almost all essential technical nodes. You demonstrated clear architectural grasp, naming crucial scalability patterns.";
      } else if (grade === 'Senior Architect') {
        feedback = "Strong answer. You hit key architecture elements, but a principal reviewer would expect more detail on some technical components.";
      } else if (grade === 'Intermediate') {
        feedback = "Decent start, but a bit too generic. You need to dive deeper into practical details and use specific software vocabulary.";
      } else {
        feedback = "Your answer is currently too brief or misses critical technical keywords. Review the model answer and focus on the implementation mechanics.";
      }

      setEvaluation({
        score,
        grade,
        matchedKeywords: matched,
        missingKeywords: missing,
        feedback
      });

      setChatHistory(prev => [
        ...prev,
        { role: 'candidate', text: userAnswer },
      ]);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (!activeTrack) return;
    
    setUserAnswer('');
    setEvaluation(null);
    const nextIdx = currentQuestionIdx + 1;
    
    if (nextIdx < activeTrack.questions.length) {
      setCurrentQuestionIdx(nextIdx);
      setChatHistory(prev => [
        ...prev,
        { role: 'interviewer', text: activeTrack.questions[nextIdx].question }
      ]);
    } else {
      setChatHistory(prev => [
        ...prev,
        { role: 'interviewer', text: "Thank you for completing this technical track! You can reset to try other CV interview pipelines." }
      ]);
    }
  };

  const getGradeColor = (g: string) => {
    switch (g) {
      case 'God-Tier Developer': return 'text-emerald-400 border-emerald-500/25 bg-emerald-500/10';
      case 'Senior Architect': return 'text-indigo-400 border-indigo-500/25 bg-indigo-500/10';
      case 'Intermediate': return 'text-amber-400 border-amber-500/25 bg-amber-500/10';
      default: return 'text-red-400 border-red-500/25 bg-red-500/10';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {!selectedTrackId ? (
        // Selection State
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" /> CV-Tailored Interview Simulator
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Prepare for senior technical interviews based on your precise curriculum. Select a track below to be interviewed by a simulated Principal Engineer who will grade your structural architecture knowledge from **Rusty** to **God-Tier**.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewTracks.map((track) => {
              const IconComp = track.id === 'founder-architect' ? Brain : track.id === 'enterprise-fullstack' ? Flame : Cpu;
              return (
                <button
                  key={track.id}
                  onClick={() => handleStartTrack(track.id)}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl border border-gray-800 text-left flex flex-col justify-between h-[200px] transition"
                >
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-md font-bold text-white leading-snug mt-4">{track.name}</h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mt-1">
                      {track.role}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // Active Interview State
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chat Pane */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="glass-panel rounded-2xl border border-gray-800 flex flex-col overflow-hidden h-[450px]">
              <div className="bg-gray-950 px-4 py-3 border-b border-gray-850 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-300">Track: {activeTrack?.name}</span>
                <button
                  onClick={handleResetTrack}
                  className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg transition"
                >
                  <RefreshCw className="w-3 h-3" /> Leave Track
                </button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900/10">
                {chatHistory.map((chat, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[85%] ${chat.role === 'interviewer' ? 'mr-auto' : 'ml-auto items-end'}`}
                  >
                    <span className="text-[9px] uppercase font-bold text-gray-500 mb-1">
                      {chat.role === 'interviewer' ? 'Simulated Principal Interviewer' : 'Candidate (You)'}
                    </span>
                    <div 
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        chat.role === 'interviewer' 
                          ? 'bg-gray-850 text-gray-150 border border-gray-800' 
                          : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/5'
                      }`}
                    >
                      {chat.text}
                    </div>
                  </div>
                ))}
                {isSubmitting && (
                  <div className="text-[10px] text-gray-500 animate-pulse">Interviewer is evaluating your response...</div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-850 p-3 bg-gray-950/40">
                {currentQuestionIdx < (activeTrack?.questions.length || 0) && !evaluation ? (
                  <div className="flex gap-2">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your structured technical explanation here... (include terms like proxies, queues, RLS, code splitting, etc.)"
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 h-[80px] resize-none"
                    />
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!userAnswer.trim() || isSubmitting}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-850 disabled:text-gray-500 text-white px-4 rounded-xl flex items-center justify-center transition shrink-0 self-end h-[40px]"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Response Graded. Proceed to next step.</span>
                    {currentQuestionIdx + 1 < (activeTrack?.questions.length || 0) ? (
                      <button
                        onClick={handleNextQuestion}
                        className="flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/10"
                      >
                        Next Question <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleResetTrack}
                        className="flex items-center gap-1.5 text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition"
                      >
                        Select Another Track
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grading Pane */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {evaluation ? (
              <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4 animate-scaleIn">
                <div className="flex justify-between items-center border-b border-gray-850 pb-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Evaluation Verdict</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getGradeColor(evaluation.grade)}`}>
                    {evaluation.grade}
                  </span>
                </div>

                <div className="text-center bg-black/35 py-4 rounded-xl">
                  <span className="text-4xl font-extrabold text-white">{evaluation.score}</span>
                  <span className="text-xs text-gray-500"> / 100 API Score</span>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Matched Keywords</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.matchedKeywords.length === 0 ? (
                      <span className="text-xs text-gray-650 italic">None</span>
                    ) : (
                      evaluation.matchedKeywords.map((kw, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {kw}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1.5">Missing Core Concepts</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.missingKeywords.length === 0 ? (
                      <span className="text-xs text-emerald-400 italic">Excellent coverage!</span>
                    ) : (
                      evaluation.missingKeywords.map((kw, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded">
                          {kw}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-850">
                  <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest mb-1">Feedback</p>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">{evaluation.feedback}</p>
                </div>

                <div className="p-3 bg-indigo-950/10 border border-indigo-500/10 rounded-xl">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Architect Model Answer
                  </p>
                  <p className="text-[11px] text-indigo-200 leading-relaxed font-sans italic">
                    &quot;{currentQuestion?.suggestedSolution}&quot;
                  </p>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-6 rounded-2xl border border-gray-850 text-center py-12">
                <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-gray-400 mb-1">Waiting for Response</h4>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[220px] mx-auto">
                  Submit your technical explanation inside the chat. The grading engine will display keyword matches and feedback here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
