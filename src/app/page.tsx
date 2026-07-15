'use client';

import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import ModuleList from '@/components/ModuleList';
import Visualizers from '@/components/Visualizers';
import CodingPlayground from '@/components/CodingPlayground';
import InterviewSimulator from '@/components/InterviewSimulator';
import { LayoutDashboard, BookOpen, Eye, Code, Flame, Sparkles, Award } from 'lucide-react';
import { curriculumModules } from '@/data/curriculum';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'modules' | 'visualizers' | 'sandbox' | 'interview'>('dashboard');
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const calculateProgress = () => {
    let completedPoints = 0;
    let totalPoints = 0;

    curriculumModules.forEach(m => {
      // Sections
      m.sections.forEach((_, idx) => {
        totalPoints++;
        if (localStorage.getItem(`section_completed_${m.id}_${idx}`) === 'true') {
          completedPoints++;
        }
      });
      // Quizzes
      totalPoints++;
      if (localStorage.getItem(`quiz_completed_${m.id}`) === 'true') {
        completedPoints++;
      }
      // Challenges
      if (m.challenge) {
        totalPoints++;
        if (localStorage.getItem(`challenge_completed_${m.challenge.id}`) === 'true') {
          completedPoints++;
        }
      }
    });

    const percent = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
    setCompletionPercentage(percent);
  };

  useEffect(() => {
    calculateProgress();
    window.addEventListener('storage', calculateProgress);
    return () => window.removeEventListener('storage', calculateProgress);
  }, []);

  const getStatusBadge = () => {
    if (completionPercentage === 0) return { label: 'Rusty (Level 0)', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    if (completionPercentage < 30) return { label: 'Apprentice (Level 1)', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    if (completionPercentage < 70) return { label: 'Practitioner (Level 2)', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
    if (completionPercentage < 100) return { label: 'Advanced Dev (Level 3)', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    return { label: 'Sharp Architect (Max)', color: 'bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 text-white border-indigo-500/30' };
  };

  const badge = getStatusBadge();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-850 bg-[#080b11]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-emerald-500 rounded-xl shadow-lg shadow-indigo-600/25">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-md font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SWE MASTERY <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold">HUB</span>
              </h1>
              <p className="text-[10px] text-gray-500">From Rusty to Production Ready</p>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${badge.color}`}>
              Status: {badge.label}
            </span>
            <div className="hidden sm:flex items-center gap-2 bg-gray-900 border border-gray-850 px-3 py-1 rounded-full">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-[11px] font-semibold text-gray-300">Progress: {completionPercentage}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar Panel */}
        <aside className="md:col-span-3 glass-panel p-4 rounded-2xl border border-gray-800 space-y-2 md:sticky md:top-24">
          <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Workspace Navigation</span>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('modules')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition ${
              activeTab === 'modules'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Study Curriculum</span>
          </button>

          <button
            onClick={() => setActiveTab('visualizers')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition ${
              activeTab === 'visualizers'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
            }`}
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>Interactive Visualizers</span>
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition ${
              activeTab === 'sandbox'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
            }`}
          >
            <Code className="w-4 h-4 shrink-0" />
            <span>Coding Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition ${
              activeTab === 'interview'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
            }`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>Mock Interview Prep</span>
          </button>

          <div className="border-t border-gray-850 mt-4 pt-4 px-3">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full-Stack Next.js Project</span>
            </div>
          </div>
        </aside>

        {/* Content body */}
        <section className="md:col-span-9 flex flex-col gap-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'modules' && <ModuleList />}
          {activeTab === 'visualizers' && <Visualizers />}
          {activeTab === 'sandbox' && <CodingPlayground />}
          {activeTab === 'interview' && <InterviewSimulator />}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-850 py-6 mt-12 bg-black/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Software Engineering Mastery Hub. Designed for rapid skill acceleration.</p>
        </div>
      </footer>
    </div>
  );
}
