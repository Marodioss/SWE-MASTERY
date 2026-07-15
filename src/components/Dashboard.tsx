'use client';

import React, { useState, useEffect } from 'react';
import { curriculumModules } from '@/data/curriculum';
import { BookOpen, Award, CheckSquare, Zap, ExternalLink, RefreshCw, Code, Database, Layout, ShieldAlert } from 'lucide-react';

interface PrepLink {
  name: string;
  url: string;
  desc: string;
  badge: string;
}

interface LinkCategory {
  title: string;
  icon: any;
  links: PrepLink[];
}

const interviewResourceCategories: LinkCategory[] = [
  {
    title: "Algorithms & Coding Practice (DSA)",
    icon: Code,
    links: [
      { name: "NeetCode", url: "https://neetcode.io/", desc: "Structured visual roadmaps and video guides for standard LeetCode patterns.", badge: "Highly Recommended" },
      { name: "LeetCode", url: "https://leetcode.com/", desc: "The standard global platform for coding challenges and tech interview questions.", badge: "Core Prep" },
      { name: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/", desc: "Quick reference card for all sorting algorithms and data structure time/space complexity graphs.", badge: "Cheat Sheet" },
      { name: "Visualgo", url: "https://visualgo.net/", desc: "Interactive, step-by-step animations of data structures, sorting, and graph queries.", badge: "Visual Study" }
    ]
  },
  {
    title: "System Design & Scaling Architecture",
    icon: ShieldAlert,
    links: [
      { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", desc: "The gold-standard open-source resource on scalability, CDNs, load balancers, and CAP theorem.", badge: "Must Read" },
      { name: "ByteByteGo", url: "https://bytebytego.com/", desc: "Alex Xu's famous database of visual guides simplifying complex distributed systems concepts.", badge: "Architecture" },
      { name: "InfoQ", url: "https://www.infoq.com/", desc: "Deep technical articles showing the actual software stack and architectural decisions of companies like Netflix, Airbnb, and Stripe.", badge: "Real World" }
    ]
  },
  {
    title: "JavaScript & Advanced Frontend (Next.js)",
    icon: Layout,
    links: [
      { name: "JavaScript.info", url: "https://javascript.info/", desc: "Deepest coverage of JS runtime: event loop, prototypes, execution scopes, and memory management.", badge: "JS Bible" },
      { name: "Patterns.dev", url: "https://www.patterns.dev/", desc: "Frictionless modern guide to design, rendering, and loading performance optimization patterns.", badge: "Tuning Patterns" },
      { name: "GreatFrontend", url: "https://www.greatfrontend.com/", desc: "Tailored mock interfaces for UI components, custom utilities, and DOM manipulation questions.", badge: "Frontend Focus" },
      { name: "BFE.dev", url: "https://bfe.dev/", desc: "Big Frontend Exercises. Practice building custom utility libraries, promises, and helper functions.", badge: "Practice Code" }
    ]
  },
  {
    title: "Databases, SQL & AI (RAG) Systems",
    icon: Database,
    links: [
      { name: "SQLBolt", url: "https://sqlbolt.com/", desc: "Interactive in-browser SQL training exercises. Ideal to brush up on SELECT, JOIN, and GROUP queries.", badge: "Interactive" },
      { name: "Use The Index, Luke!", url: "https://use-the-index-luke.com/", desc: "Deep study on SQL indices (B-Trees), table scans, planners, and query speedups.", badge: "DB Performance" },
      { name: "Pinecone Vector Academy", url: "https://www.pinecone.io/learn/", desc: "Best resource on vector metrics, semantic searches, embeddings algorithms, and RAG pipelines.", badge: "AI RAG" },
      { name: "DeepLearning.AI", url: "https://www.deeplearning.ai/", desc: "Andrew Ng's short courses on LLM tool integrations, LangChain orchestrations, and Agent builds.", badge: "AI Agents" }
    ]
  },
  {
    title: "Reputable Free Developer Certifications",
    icon: Award,
    links: [
      { name: "Neo4j Certified Professional", url: "https://graphacademy.neo4j.com/", desc: "100% free official vendor certification on Graph database design, Cypher queries, and model setups.", badge: "Graph DB" },
      { name: "Apollo GraphQL Odyssey Cert", url: "https://odyssey.apollographql.com/", desc: "Free certifications covering GraphQL schemas, resolvers, and client integrations.", badge: "GraphQL" },
      { name: "freeCodeCamp Relational Database", url: "https://www.freecodecamp.org/learn/relational-database/", desc: "Project-based relational database certification focusing on PostgreSQL, SQL, and Bash.", badge: "SQL / Postgres" },
      { name: "MongoDB Skill Badges", url: "https://learn.mongodb.com/", desc: "Free learning paths with official developer validation badges from MongoDB.", badge: "NoSQL / Mongo" }
    ]
  }
];

export default function Dashboard() {
  const [completedSectionsCount, setCompletedSectionsCount] = useState(0);
  const [completedQuizzesCount, setCompletedQuizzesCount] = useState(0);
  const [completedChallengesCount, setCompletedChallengesCount] = useState(0);

  const totalSections = curriculumModules.reduce((acc, m) => acc + m.sections.length, 0);
  const totalQuizzes = curriculumModules.length;
  const totalChallenges = curriculumModules.filter(m => m.challenge !== undefined).length;

  const loadProgress = () => {
    let sections = 0;
    curriculumModules.forEach(m => {
      m.sections.forEach((_, idx) => {
        if (localStorage.getItem(`section_completed_${m.id}_${idx}`) === 'true') {
          sections++;
        }
      });
    });
    setCompletedSectionsCount(sections);

    let quizzes = 0;
    curriculumModules.forEach(m => {
      if (localStorage.getItem(`quiz_completed_${m.id}`) === 'true') {
        quizzes++;
      }
    });
    setCompletedQuizzesCount(quizzes);

    let challenges = 0;
    curriculumModules.forEach(m => {
      if (m.challenge && localStorage.getItem(`challenge_completed_${m.challenge.id}`) === 'true') {
        challenges++;
      }
    });
    setCompletedChallengesCount(challenges);
  };

  useEffect(() => {
    loadProgress();
    window.addEventListener('storage', loadProgress);
    return () => window.removeEventListener('storage', loadProgress);
  }, []);

  const totalPossiblePoints = totalSections + totalQuizzes + totalChallenges;
  const currentPoints = completedSectionsCount + completedQuizzesCount + completedChallengesCount;
  const completionPercentage = totalPossiblePoints > 0 
    ? Math.round((currentPoints / totalPossiblePoints) * 100) 
    : 0;

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all learning progress? This clears checkmarks, quiz scores, and sandbox status.")) {
      localStorage.clear();
      loadProgress();
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-gray-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                God-Tier Prep Mode Active
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-3 tracking-tight">
                Software Engineering Mastery Hub
              </h2>
              <p className="text-gray-400 mt-2 text-sm max-w-xl leading-relaxed">
                Welcome back, Marouane! This environment is custom-tailored to bridge your 3-year gap, aligning you with principal architect standards for Next.js, Supabase, LLM workflows, Jest mock testing, and WebGL graphics.
              </p>
            </div>
            
            <button
              onClick={handleResetProgress}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear Progress
            </button>
          </div>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-850 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Overall Progress</span>
            <div className="text-3xl font-bold text-white mt-1">{completionPercentage}%</div>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-2.5 mt-4 overflow-hidden border border-gray-850">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Sections Complete */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-850 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Lessons Read</span>
            <span className="text-2xl font-bold text-white">{completedSectionsCount}</span>
            <span className="text-xs text-gray-500"> / {totalSections}</span>
          </div>
        </div>

        {/* Quizzes Passed */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-855 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Quizzes Passed</span>
            <span className="text-2xl font-bold text-white">{completedQuizzesCount}</span>
            <span className="text-xs text-gray-500"> / {totalQuizzes}</span>
          </div>
        </div>

        {/* Challenges Completed */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-850 flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Sandboxes Done</span>
            <span className="text-2xl font-bold text-white">{completedChallengesCount}</span>
            <span className="text-xs text-gray-500"> / {totalChallenges}</span>
          </div>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Curated Mastery Roadmap */}
        <div className="lg:col-span-12 glass-panel p-6 rounded-2xl border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" /> CV-Tailored Mastery Roadmap
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-2 border-indigo-500/30 pl-4 py-1">
              <h4 className="text-sm font-semibold text-white">Phase 1: Advanced Runtimes & testing (Week 1)</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Re-master advanced JavaScript event-loops. Study isolation testing using Jest mocks (essential for Capgemini-level requirements). Complete the Custom Debounce sandbox and create a custom mock wrapper logic simulating `jest.fn()`.
              </p>
            </div>
            <div className="border-l-2 border-indigo-500/30 pl-4 py-1">
              <h4 className="text-sm font-semibold text-white">Phase 2: Next.js 15 & Backend BaaS (Week 2)</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Focus on Next.js 15 Server Components and REST status validations. Deep dive into Supabase: Postgres triggers, functions, and Row-Level Security (RLS) policies. Complete the sandbox checking auth user ID validation access.
              </p>
            </div>
            <div className="border-l-2 border-indigo-500/30 pl-4 py-1">
              <h4 className="text-sm font-semibold text-white">Phase 3: AI Workflows & Computer Science (Week 3)</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Connect back to systems architecture (MIAGE/EMSI fundamentals). Study B-Tree vs Hash index structures. Deep dive into AI Agents: tooling structures, scraping architectures (Cypher Ad search), and rate limiting. Complete the parser sandbox.
              </p>
            </div>
            <div className="border-l-2 border-indigo-500/30 pl-4 py-1">
              <h4 className="text-sm font-semibold text-white">Phase 4: Optimization, R3F & Simulator prep (Week 4)</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Master 3D WebGL graphics with React Three Fiber, optimizing render cycles inside canvas useFrame loops. Use the interactive Interview Simulator regularly to practice articulating these architectural details to senior interviewers!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Interview Resources Directory */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-2">The Ultimate Interview Prep Directory</h3>
        <p className="text-xs text-gray-400 mb-6">A hand-picked index of the absolute best platforms, libraries, and tools to prepare you for high-end technical screenings.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviewResourceCategories.map((category, idx) => {
            const IconComponent = category.icon;
            return (
              <div key={idx} className="bg-gray-950/40 p-5 rounded-2xl border border-gray-850/80">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <IconComponent className="w-4 h-4" />
                  </span>
                  {category.title}
                </h4>
                <div className="space-y-3">
                  {category.links.map((link, lIdx) => (
                    <a 
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between p-3 bg-gray-900/25 hover:bg-gray-900 border border-gray-855/60 rounded-xl transition group text-left"
                    >
                      <div className="pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white group-hover:text-indigo-400 transition">
                            {link.name}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 uppercase tracking-wider scale-95 border border-indigo-500/5">
                            {link.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{link.desc}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-655 group-hover:text-indigo-400 shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
