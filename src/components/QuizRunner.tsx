'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/data/curriculum';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface QuizRunnerProps {
  quiz: QuizQuestion[];
  moduleName: string;
  onComplete: () => void;
}

export default function QuizRunner({ quiz, moduleName, onComplete }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz[currentIndex];

  const handleSelectAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswered) return;
    setIsAnswered(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      onComplete();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 text-center">
        <h4 className="text-xl font-bold text-indigo-400 mb-2">Quiz Completed!</h4>
        <p className="text-gray-400 mb-4">{moduleName}</p>
        <div className="text-5xl font-extrabold text-white mb-6">
          {score} <span className="text-lg text-gray-500">/ {quiz.length}</span>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-medium transition"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Question {currentIndex + 1} of {quiz.length}
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
          Score: {score}
        </span>
      </div>

      <h4 className="text-lg font-semibold text-white mb-4 leading-relaxed">
        {currentQuestion.question}
      </h4>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, idx) => {
          let optionStyles = "border border-gray-800 hover:border-gray-700 bg-gray-900/50 hover:bg-gray-900";
          if (selectedAnswer === idx) {
            optionStyles = "border-indigo-500 bg-indigo-500/10 text-white";
          }
          if (isAnswered) {
            if (idx === currentQuestion.correctAnswer) {
              optionStyles = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
            } else if (selectedAnswer === idx) {
              optionStyles = "border-red-500 bg-red-500/10 text-red-400";
            } else {
              optionStyles = "border-gray-850 bg-gray-900/20 text-gray-500 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelectAnswer(idx)}
              className={`w-full flex items-center justify-between p-4 rounded-xl text-left font-medium text-gray-300 transition ${optionStyles}`}
            >
              <span>{option}</span>
              {isAnswered && idx === currentQuestion.correctAnswer && (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              )}
              {isAnswered && selectedAnswer === idx && idx !== currentQuestion.correctAnswer && (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mb-6 p-4 rounded-xl bg-gray-900/80 border border-gray-800 animate-fadeIn">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            Explanation
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className={`px-5 py-2.5 rounded-xl font-semibold transition ${
              selectedAnswer === null
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition"
          >
            {currentIndex + 1 === quiz.length ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
