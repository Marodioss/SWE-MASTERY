'use client';

import React, { useState, useEffect, useRef } from 'react';
import { curriculumModules, CodingChallenge } from '@/data/curriculum';
import { Play, RotateCcw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const iframeSrcDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sandbox Environment</title>
</head>
<body>
  <script>
    window.addEventListener('message', async (event) => {
      const { code, verifier, challengeId } = event.data;
      const logs = [];
      
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        originalLog(...args);
      };
      
      try {
        // Compile user code in isolated context
        const userFn = new Function(\`
          \${code}
          return \${challengeId};
        \`)();
        
        // Compile verifier script
        const evalVerifier = new Function('userFn', \`
          return \${verifier};
        \`);
        
        const result = await evalVerifier(userFn);
        
        window.parent.postMessage({
          status: result === true ? 'success' : 'failed',
          message: typeof result === 'string' ? result : 'All test cases passed! Spectacular job!',
          logs
        }, '*');
      } catch (err) {
        window.parent.postMessage({
          status: 'error',
          message: err.message,
          logs
        }, '*');
      } finally {
        console.log = originalLog;
      }
    });
  </script>
</body>
</html>
`;

export default function CodingPlayground() {
  const challenges = curriculumModules
    .filter(m => m.challenge !== undefined)
    .map(m => m.challenge as CodingChallenge);

  const [activeChallengeId, setActiveChallengeId] = useState<string>(challenges[0]?.id || '');
  const [userCode, setUserCode] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'failed' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const activeChallenge = challenges.find(c => c.id === activeChallengeId);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (activeChallenge) {
      const saved = localStorage.getItem(`playground_challenge_${activeChallenge.id}`);
      setUserCode(saved || activeChallenge.starterCode);
      setConsoleLogs([]);
      setTestResult({ status: 'idle', message: '' });
    }
  }, [activeChallengeId]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate the data has the correct properties
      if (event.data && typeof event.data === 'object' && 'status' in event.data) {
        const { status, message, logs } = event.data;
        setTestResult({
          status,
          message
        });
        setConsoleLogs(logs || []);
        if (status === 'success' && activeChallenge) {
          localStorage.setItem(`challenge_completed_${activeChallenge.id}`, 'true');
          window.dispatchEvent(new Event('storage'));
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeChallenge]);

  const handleResetCode = () => {
    if (!activeChallenge) return;
    setUserCode(activeChallenge.starterCode);
    localStorage.removeItem(`playground_challenge_${activeChallenge.id}`);
    setConsoleLogs([]);
    setTestResult({ status: 'idle', message: '' });
  };

  const handleRunCode = () => {
    if (!activeChallenge) return;
    setConsoleLogs([]);
    setTestResult({ status: 'idle', message: 'Running test cases in isolated sandbox...' });

    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        code: userCode,
        verifier: activeChallenge.verificationFunction,
        challengeId: activeChallenge.id
      }, '*');
    }
  };

  if (!activeChallenge) {
    return <div className="text-gray-400">No challenges available at this moment.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[600px]">
      {/* Hidden sandboxed iframe */}
      <iframe
        ref={iframeRef}
        srcDoc={iframeSrcDoc}
        sandbox="allow-scripts"
        className="hidden"
      />

      {/* Left panel: Challenge selector & description */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            Select Sandbox Challenge
          </label>
          <select
            value={activeChallengeId}
            onChange={(e) => setActiveChallengeId(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500"
          >
            {challenges.map(c => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">{activeChallenge.title}</h3>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
              JavaScript
            </span>
            {localStorage.getItem(`challenge_completed_${activeChallenge.id}`) === 'true' && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                Completed
              </span>
            )}
          </div>

          <p className="text-sm text-gray-300 leading-relaxed mb-6 whitespace-pre-line flex-1">
            {activeChallenge.description}
          </p>

          <div className="border-t border-gray-800 pt-4 mt-auto">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              Learning Sandbox Guidance
            </h4>
            <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
              <li>Write your solution in the code editor on the right.</li>
              <li>Ensure the main function matches the expected name.</li>
              <li>You can log variables using <code>console.log()</code> to inspect states.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel: Editor and console output */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Editor */}
        <div className="glass-panel rounded-2xl border border-gray-800 flex flex-col flex-1 overflow-hidden">
          <div className="flex justify-between items-center bg-gray-950 px-4 py-2 border-b border-gray-850">
            <span className="text-xs font-mono text-gray-400">Solution.js</span>
            <div className="flex gap-2">
              <button
                onClick={handleResetCode}
                className="flex items-center gap-1 text-xs font-medium bg-gray-850 hover:bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg transition"
                title="Reset to default code"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                onClick={handleRunCode}
                className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition shadow-md shadow-indigo-600/10"
              >
                <Play className="w-3.5 h-3.5" /> Execute Tests
              </button>
            </div>
          </div>
          
          <textarea
            value={userCode}
            onChange={(e) => {
              setUserCode(e.target.value);
              localStorage.setItem(`playground_challenge_${activeChallenge.id}`, e.target.value);
            }}
            className="flex-1 w-full bg-gray-900/40 p-4 font-mono text-sm text-indigo-100 border-0 resize-none h-[320px] focus:ring-0 focus:outline-none"
            spellCheck="false"
          />
        </div>

        {/* Output logs & test results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[220px]">
          {/* Console */}
          <div className="glass-panel p-4 rounded-xl border border-gray-800 flex flex-col overflow-hidden">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Console Log Outputs
            </h4>
            <div className="bg-black/45 p-3 rounded-lg flex-1 overflow-y-auto font-mono text-xs text-gray-300">
              {consoleLogs.length === 0 ? (
                <span className="text-gray-600 italic">No output logs standard out.</span>
              ) : (
                consoleLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-gray-950/20 py-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Test verification */}
          <div className="glass-panel p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Test Verification
            </h4>
            <div className="flex-1 flex flex-col justify-center items-center p-3 text-center">
              {testResult.status === 'idle' && (
                <div className="text-gray-500 text-sm">
                  Click <strong className="text-indigo-400">Execute Tests</strong> to verify your solution.
                </div>
              )}
              {testResult.status === 'success' && (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
                  <span className="text-sm font-semibold text-emerald-400">Pass</span>
                  <span className="text-xs text-gray-300">{testResult.message}</span>
                </div>
              )}
              {testResult.status === 'failed' && (
                <div className="flex flex-col items-center gap-2">
                  <XCircle className="w-10 h-10 text-red-500" />
                  <span className="text-sm font-semibold text-red-400">Failed</span>
                  <span className="text-xs text-gray-300">{testResult.message}</span>
                </div>
              )}
              {testResult.status === 'error' && (
                <div className="flex flex-col items-center gap-2">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                  <span className="text-sm font-semibold text-amber-400">Syntax / Runtime Error</span>
                  <span className="text-xs text-gray-350">{testResult.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
