'use client';

import React, { useState, useEffect } from 'react';
import { curriculumModules, Module } from '@/data/curriculum';
import QuizRunner from '@/components/QuizRunner';
import * as Icons from 'lucide-react';
import { Check, CheckCircle2, ChevronDown, ChevronUp, BookOpen, HelpCircle } from 'lucide-react';

export default function ModuleList() {
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(1);
  const [completedSections, setCompletedSections] = useState<{ [key: string]: boolean }>({});
  const [completedQuizzes, setCompletedQuizzes] = useState<{ [key: number]: boolean }>({});

  const loadCompletionData = () => {
    const sections: { [key: string]: boolean } = {};
    const quizzes: { [key: number]: boolean } = {};

    curriculumModules.forEach(m => {
      m.sections.forEach((_, idx) => {
        const key = `section_completed_${m.id}_${idx}`;
        if (localStorage.getItem(key) === 'true') {
          sections[key] = true;
        }
      });

      const quizKey = `quiz_completed_${m.id}`;
      if (localStorage.getItem(quizKey) === 'true') {
        quizzes[m.id] = true;
      }
    });

    setCompletedSections(sections);
    setCompletedQuizzes(quizzes);
  };

  useEffect(() => {
    loadCompletionData();
    window.addEventListener('storage', loadCompletionData);
    return () => window.removeEventListener('storage', loadCompletionData);
  }, []);

  const toggleSection = (moduleId: number, sectionIdx: number) => {
    const key = `section_completed_${moduleId}_${sectionIdx}`;
    const newVal = !completedSections[key];
    
    if (newVal) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
    
    setCompletedSections(prev => ({ ...prev, [key]: newVal }));
    // Notify dashboard of update
    window.dispatchEvent(new Event('storage'));
  };

  const handleQuizComplete = (moduleId: number) => {
    const key = `quiz_completed_${moduleId}`;
    localStorage.setItem(key, 'true');
    setCompletedQuizzes(prev => ({ ...prev, [moduleId]: true }));
    window.dispatchEvent(new Event('storage'));
  };

  const getIcon = (iconName: string) => {
    // Return typed lucide component
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
    }
    return <Icons.BookOpen className="w-5 h-5" />;
  };

  return (
    <div className="flex flex-col gap-6">
      {curriculumModules.map((module) => {
        const isExpanded = expandedModuleId === module.id;
        
        // Calculate progress in this module
        const moduleSectionKeys = module.sections.map((_, idx) => `section_completed_${module.id}_${idx}`);
        const completedCount = moduleSectionKeys.filter(k => completedSections[k]).length;
        const totalCount = module.sections.length;
        const quizCompleted = completedQuizzes[module.id];
        
        return (
          <div 
            key={module.id} 
            className={`glass-panel rounded-3xl border transition duration-300 ${
              isExpanded 
                ? 'border-indigo-500/50 bg-gray-900/40 shadow-lg shadow-indigo-500/5' 
                : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            {/* Header tab */}
            <div 
              onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
              className="flex justify-between items-center p-6 cursor-pointer select-none"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${
                  isExpanded ? 'bg-indigo-500/10 text-indigo-400' : 'bg-gray-850 text-gray-400'
                }`}>
                  {getIcon(module.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      {module.category}
                    </span>
                    <span className="text-[10px] text-gray-500">• {module.timeToComplete}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                    {module.title}
                    {quizCompleted && (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Progress dot details */}
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs text-gray-400">
                    {completedCount} / {totalCount} Lessons Complete
                  </span>
                  <div className="w-24 bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-850 mt-1">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    />
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Expandable study area */}
            {isExpanded && (
              <div className="px-6 pb-6 border-t border-gray-850/50 pt-6 space-y-6">
                {/* Summary */}
                <p className="text-sm text-gray-300 leading-relaxed font-medium max-w-3xl">
                  {module.summary}
                </p>

                {/* Subtopic Sections */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Course Subtopics
                  </h4>
                  
                  <div className="space-y-3">
                    {module.sections.map((section, idx) => {
                      const isSecCompleted = completedSections[`section_completed_${module.id}_${idx}`];
                      return (
                        <div 
                          key={idx}
                          className="bg-gray-950/40 p-4 rounded-2xl border border-gray-850 hover:border-gray-800 transition"
                        >
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <h5 className="text-sm font-semibold text-white">{section.title}</h5>
                            <button
                              onClick={() => toggleSection(module.id, idx)}
                              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-semibold transition ${
                                isSecCompleted 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                  : 'bg-gray-900 hover:bg-gray-850 border-gray-800 text-gray-400 hover:text-gray-200'
                              }`}
                            >
                              {isSecCompleted ? (
                                <>
                                  <Check className="w-3 h-3" /> Read
                                </>
                              ) : (
                                "Mark Read"
                              )}
                            </button>
                          </div>
                          
                          <p className="text-xs text-gray-350 leading-relaxed whitespace-pre-wrap">
                            {section.content}
                          </p>

                          {section.codeSnippet && (
                            <pre className="bg-black/60 p-3 rounded-lg border border-gray-900/60 font-mono text-[11px] text-indigo-200 mt-3 overflow-x-auto">
                              <code>{section.codeSnippet}</code>
                            </pre>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Free Resource References */}
                <div className="space-y-3 border-t border-gray-850/50 pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Recommended Study Resources
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {module.resources.map((res, idx) => (
                      <a 
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-between items-start p-3 bg-gray-900/30 hover:bg-gray-900/80 border border-gray-850/80 rounded-xl transition group text-left"
                      >
                        <div>
                          <span className="text-xs font-medium text-white group-hover:text-indigo-400 transition">
                            {res.name}
                          </span>
                          <p className="text-[10px] text-gray-500 mt-0.5">{res.description}</p>
                        </div>
                        <Icons.ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-indigo-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Module Quiz */}
                <div className="space-y-3 border-t border-gray-850/50 pt-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-3">
                    <HelpCircle className="w-4 h-4" /> Assess Your Learning
                  </h4>
                  
                  <QuizRunner 
                    quiz={module.quiz} 
                    moduleName={module.title}
                    onComplete={() => handleQuizComplete(module.id)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
