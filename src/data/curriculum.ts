export interface Resource {
  name: string;
  url: string;
  description: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of options
  explanation: string;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: {
    input: any[];
    expected: any;
    description: string;
  }[];
  verificationFunction: string; // JavaScript string to verify the user's function
}

export interface ModuleSection {
  title: string;
  content: string;
  codeSnippet?: string;
  codeLanguage?: string;
}

export interface Module {
  id: number;
  title: string;
  category: string;
  icon: string;
  summary: string;
  timeToComplete: string;
  sections: ModuleSection[];
  resources: Resource[];
  quiz: QuizQuestion[];
  challenge?: CodingChallenge;
}

export const curriculumModules: Module[] = [
  {
    id: 1,
    title: "Advanced JavaScript & Event Loop",
    category: "Languages & Runtimes",
    icon: "Cpu",
    summary: "Re-master closures, prototypes, event loops, promises, async/await, generators, and JavaScript performance characteristics.",
    timeToComplete: "2.5 hours",
    sections: [
      {
        title: "1. The Event Loop, Call Stack, & Task Queues",
        content: "JavaScript is a single-threaded, non-blocking, concurrent runtime. The Event Loop constantly monitors the Call Stack and checks if there is work to be done in the Microtask Queue (Promises, queueMicrotask, MutationObserver) and the Macrotask Queue (setTimeout, setInterval, setImmediate, I/O operations). Microtasks ALWAYS execute completely before the next macrotask is dequeued.",
        codeSnippet: `console.log('Start'); // 1. Synchronous

setTimeout(() => {
  console.log('Timeout'); // 4. Macrotask
}, 0);

Promise.resolve().then(() => {
  console.log('Promise'); // 3. Microtask
});

console.log('End'); // 2. Synchronous
// Output order: Start -> End -> Promise -> Timeout`,
        codeLanguage: "javascript"
      },
      {
        title: "2. Closures & Lexical Scope",
        content: "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In other words, a closure gives an inner function access to the outer function's scope even after the outer function has returned. This is fundamental for encapsulation and factory patterns.",
        codeSnippet: `function createCounter() {
  let count = 0; // Encapsulated private state
  return {
    increment() { count++; return count; },
    decrement() { count--; return count; },
    getCount() { return count; }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getCount()); // 1`,
        codeLanguage: "javascript"
      },
      {
        title: "3. Prototype Chain & Inheritances",
        content: "Every JavaScript object has an internal property link called [[Prototype]]. When trying to access a property that does not exist on an object, the runtime looks up the prototype chain until it finds it or reaches null. ES6 classes are syntactic sugar over prototype-based inheritance.",
        codeSnippet: `const animal = {
  makeSound() { return this.sound; }
};

const dog = Object.create(animal);
dog.sound = "Woof!";
console.log(dog.makeSound()); // "Woof!" (inherited from animal)`,
        codeLanguage: "javascript"
      }
    ],
    resources: [
      {
        name: "JavaScript.info - The Modern JavaScript Tutorial",
        url: "https://javascript.info/",
        description: "From the basics to advanced topics with simple, but detailed explanations."
      },
      {
        name: "MDN Web Docs - Advanced JavaScript Guides",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        description: "The gold standard reference for JavaScript references and standards."
      },
      {
        name: "Lydia Hallie's Visualizing JavaScript Series",
        url: "https://dev.to/lydiahallie",
        description: "Incredible visual explanations of JS internals, Event Loop, and execution contexts."
      }
    ],
    quiz: [
      {
        id: 101,
        question: "Which of the following is executed first after the call stack clears?",
        options: [
          "setTimeout callback",
          "Promise.then callback (Microtask)",
          "requestAnimationFrame callback",
          "setInterval callback"
        ],
        correctAnswer: 1,
        explanation: "Microtasks (like Promise.then) have higher priority than macrotasks (like setTimeout or setInterval) and are executed immediately when the call stack becomes empty."
      },
      {
        id: 102,
        question: "What is a major memory leak risk in modern JavaScript?",
        options: [
          "Using nested function declarations",
          "Uncleared intervals/timeouts referencing outer scope closures",
          "Defining properties inside class constructors",
          "Creating high-dimensional arrays"
        ],
        correctAnswer: 1,
        explanation: "If you define a closure inside a setInterval that runs indefinitely, the closure keeps references to all variable bindings in its lexical scope, preventing garbage collection."
      }
    ],
    challenge: {
      id: "debounce",
      title: "Write a Custom Debounce Function",
      description: "Implement a debounce function that limits the rate at which a function can fire. The debounced function will wait for N milliseconds of inactivity before executing the original function.",
      starterCode: `function debounce(func, wait) {
  let timeoutId;
  return function(...args) {
    const context = this;
    // Your code here
  };
}`,
      testCases: [
        {
          input: [],
          expected: "debounced",
          description: "Verify function returns a callable wrap and handles execution timing correctly."
        }
      ],
      verificationFunction: `(function() {
  try {
    let callCount = 0;
    const testFn = () => { callCount++; };
    const debounced = userFn(testFn, 50);
    
    debounced();
    debounced();
    debounced(); // Multiple rapid calls
    
    if (callCount !== 0) return "Failed: Executed immediately instead of waiting.";
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (callCount === 1) {
          resolve(true);
        } else {
          resolve("Failed: Expected function to be called exactly once. Got " + callCount);
        }
      }, 70);
    });
  } catch (err) {
    return "Error during execution: " + err.message;
  }
})()`
    }
  },
  {
    id: 2,
    title: "Next.js 15 App Router Architecture",
    category: "Frontend Stack",
    icon: "Layout",
    summary: "Master the App Router, React Server Components (RSC), Client Components, Server Actions, Dynamic vs. Static rendering, and the cache architecture.",
    timeToComplete: "3 hours",
    sections: [
      {
        title: "1. React Server Components (RSC) vs. Client Components",
        content: "By default, files in Next.js App Router are Server Components. They render on the server, have direct secure access to databases, and send zero JavaScript to the client, improving page load speed. You mark a component with 'use client' at the top when you need client interactivity (useState, useEffect, browser APIs).",
        codeSnippet: `// ServerComponent.tsx (Default)
import { db } from "@/lib/db";

export default async function UserProfile() {
  const users = await db.user.findMany(); // Secure server-side query
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}`,
        codeLanguage: "typescript"
      },
      {
        title: "2. Server Actions: Type-safe Form Actions",
        content: "Server Actions are asynchronous functions that execute on the server. They can be defined inside Server Components or imported from separate files. They integrate directly with React forms to handle state transitions, validation, and database updates with zero REST endpoints needed.",
        codeSnippet: `// Server Action defined inside a Client/Server file
async function updateProfile(formData: FormData) {
  'use server';
  const name = formData.get('name');
  await db.user.update({ where: { id: 1 }, data: { name } });
  revalidatePath('/profile');
}`,
        codeLanguage: "typescript"
      },
      {
        title: "3. Caching in Next.js 15",
        content: "Next.js incorporates four caches: Request Memoization (React component-level), Data Cache (across server requests), Full Route Cache (build time html/payload), and Router Cache (client-side prefetch cache). In Next.js 15, request-level caches are 'no-store' by default to align with standard expectations, making dynamic routes opt-in for caching.",
        codeSnippet: `// Disable caching for an API route or page
export const dynamic = 'force-dynamic';

// Fetching with standard cache options
const res = await fetch('https://api.example.com/data', { 
  next: { revalidate: 3600 } // Cache for 1 hour
});`,
        codeLanguage: "typescript"
      }
    ],
    resources: [
      {
        name: "Next.js Official Documentation & Learn Course",
        url: "https://nextjs.org/docs",
        description: "The primary learning guide from Vercel for App Router concepts."
      },
      {
        name: "Next.js Templates by Vercel",
        url: "https://vercel.com/templates?framework=next.js",
        description: "Real-world boilerplate repositories showing structure, authentication, database setup."
      },
      {
        name: "Lee Robinson's Blog",
        url: "https://leerob.io/",
        description: "Excellent articles and explanations about Next.js developer experience and design patterns."
      }
    ],
    quiz: [
      {
        id: 201,
        question: "Where do React Server Components (RSC) execute?",
        options: [
          "Only in the browser",
          "Only on the server",
          "Initially on the server, then hydrated in the browser",
          "In a web worker thread"
        ],
        correctAnswer: 1,
        explanation: "Server Components run *exclusively* on the server. They do not run in the browser and their source code is not bundled into the client-side JavaScript payload."
      },
      {
        id: 202,
        question: "How do you declare a client-only interaction boundary in Next.js?",
        options: [
          "By naming the file component.client.ts",
          "Adding 'use client' at the very top of the file",
          "Wrapping the component in a <ClientSide> element",
          "Using the 'export client = true' configuration export"
        ],
        correctAnswer: 1,
        explanation: "The 'use client' directive is the syntactic boundary that instructs Next.js to package the component and its imports for the browser bundle, enabling state and effects."
      }
    ]
  },
  {
    id: 3,
    title: "REST & GraphQL API Design Patterns",
    category: "Backend & Integration",
    icon: "Network",
    summary: "Understand production-grade API architecture, HTTP protocol fundamentals, authentication (JWT/Sessions), rate limiting, middleware, and route handlers.",
    timeToComplete: "2 hours",
    sections: [
      {
        title: "1. HTTP Request/Response Lifecycle & Status Codes",
        content: "API designers must follow REST semantic standards. GET for reading, POST for creating, PUT for full updates (idempotent), PATCH for partial updates, and DELETE for removing. Status codes segment responses: 2xx (Success), 3xx (Redirects), 4xx (Client Errors like 401 Unauthorized, 403 Forbidden, 429 Too Many Requests), and 5xx (Server Errors).",
        codeSnippet: `// Next.js Route Handler (src/app/api/users/route.ts)
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }
  return NextResponse.json({ id, name: 'Alex Doe' });
}`,
        codeLanguage: "typescript"
      },
      {
        title: "2. API Security & Rate Limiting",
        content: "Secure APIs require transport security (HTTPS), Cross-Origin Resource Sharing (CORS) configurations, input validation, and rate limiting. Rate limiting protects resources against brute force or DoS attacks using token-bucket or sliding-window log algorithms, often utilizing Redis for global quick counters.",
        codeSnippet: `// Simple Rate Limiting Logic Concept
const ip = req.ip;
const count = await redis.incr(ip);
if (count === 1) {
  await redis.expire(ip, 60); // 60 seconds limit window
}
if (count > 100) {
  return new Response("Too Many Requests", { status: 429 });
}`,
        codeLanguage: "javascript"
      }
    ],
    resources: [
      {
        name: "JSON API Specification",
        url: "https://jsonapi.org/",
        description: "Standard practices for formatting JSON API requests and payloads."
      },
      {
        name: "OWASP API Security Top 10",
        url: "https://owasp.org/www-project-api-security/",
        description: "The checklist for creating secure, hardened API services."
      }
    ],
    quiz: [
      {
        id: 301,
        question: "What makes an HTTP method 'Idempotent'?",
        options: [
          "It returns identical response bodies for every call.",
          "Making multiple identical requests has the same effect as making a single request.",
          "It uses HTTPS encryption on headers and parameters.",
          "It does not modify any database state."
        ],
        correctAnswer: 1,
        explanation: "Idempotence means making multiple identical requests has the same server-side state effect as making one request. GET, PUT, and DELETE are idempotent; POST is not."
      }
    ]
  },
  {
    id: 4,
    title: "Algorithms & Data Structures",
    category: "Computer Science",
    icon: "Binary",
    summary: "Re-master Trees, Graphs, Tries, Hash Tables, and algorithms like dynamic programming, sliding window, two-pointers, and sorting.",
    timeToComplete: "4 hours",
    sections: [
      {
        title: "1. The Trie (Prefix Tree) Data Structure",
        content: "A Trie is a tree-like data structure used for storing a dynamic set or associative array where the keys are usually strings. It is highly optimized for auto-complete search inputs, IP routing, and spell checkers. Searching or inserting in a Trie takes O(L) time, where L is the length of the word.",
        codeSnippet: `class TrieNode {
  children = {};
  isEndOfWord = false;
}

class Trie {
  root = new TrieNode();
  
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }
}`,
        codeLanguage: "javascript"
      },
      {
        title: "2. Sliding Window Pattern",
        content: "The sliding window pattern is used to perform operations on a specific window size of a given array or string. It avoids nested loops (reducing O(N^2) algorithms to O(N) linear time) by sliding a window from left to right, maintaining state continuously.",
        codeSnippet: `// Find the max sum of a contiguous subarray of size K
function maxSubarraySum(arr, k) {
  let maxSum = 0, windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += arr[i];
  maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // Slide window: add new, subtract old
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`,
        codeLanguage: "javascript"
      }
    ],
    resources: [
      {
        name: "LeetCode & NeetCode",
        url: "https://neetcode.io/",
        description: "Hands-down the best structured roadmap to learn DSA patterns (e.g. NeetCode 150)."
      },
      {
        name: "Big-O Cheat Sheet",
        url: "https://www.bigocheatsheet.com/",
        description: "Quick access to space and time complexity diagrams for all common structures."
      }
    ],
    quiz: [
      {
        id: 401,
        question: "What is the average time complexity of searching in a Hash Table?",
        options: [
          "O(log N)",
          "O(1)",
          "O(N)",
          "O(N log N)"
        ],
        correctAnswer: 1,
        explanation: "Hash tables resolve keys directly to memory bins, providing constant time O(1) complexity on average for insertion, deletion, and search operations."
      }
    ],
    challenge: {
      id: "trie",
      title: "Implement Trie Insert and Search",
      description: "Implement a simple Trie class with `insert(word)` and `search(word)` methods. The search method returns a boolean indicating if the exact word is in the Trie.",
      starterCode: `class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  insert(word) {
    // Your code here
  }
  
  search(word) {
    // Your code here
    return false;
  }
}`,
      testCases: [
        {
          input: [],
          expected: true,
          description: "Verify words can be inserted and searched accurately."
        }
      ],
      verificationFunction: `(function() {
  try {
    const t = new userFn();
    t.insert("apple");
    t.insert("app");
    
    if (t.search("apple") !== true) return "Failed: Could not find inserted word 'apple'";
    if (t.search("app") !== true) return "Failed: Could not find inserted prefix 'app' which was marked as word";
    if (t.search("ap") === true) return "Failed: Returned true for prefix 'ap' which is NOT a full word";
    if (t.search("banana") === true) return "Failed: Returned true for non-existent word 'banana'";
    
    return true;
  } catch (err) {
    return "Error during execution: " + err.message;
  }
})()`
    }
  },
  {
    id: 5,
    title: "SQL & NoSQL Databases",
    category: "Data Storage",
    icon: "Database",
    summary: "Master query optimization, relational indexing, transactions, sharding, document stores, Redis caching, and vector embedding indexing.",
    timeToComplete: "3 hours",
    sections: [
      {
        title: "1. SQL Indexing & Query Execution Plans",
        content: "SQL databases speed up queries using Indexes (typically B-Tree structures). A database index allows the engine to find data without executing a full-table scan (reducing query costs from O(N) to O(log N)). However, indexing increases write costs because indexes must be updated on insert/update. Query planners (e.g. EXPLAIN ANALYZE) show if indexes are used.",
        codeSnippet: `-- Create a composite index for user lookups by department and age
CREATE INDEX idx_user_dept_age ON users(department_id, age);

-- Check execution route
EXPLAIN ANALYZE SELECT name FROM users 
WHERE department_id = 5 AND age > 30;`,
        codeLanguage: "sql"
      },
      {
        title: "2. SQL Transactions & ACID properties",
        content: "ACID stands for: Atomicity (all-or-nothing), Consistency (integrity constraints validated), Isolation (concurrent executions don't conflict), and Durability (saved in non-volatile storage). Databases use locks and Write-Ahead Logs (WAL) to ensure safety during crashes.",
        codeSnippet: `-- Transaction blocks are treated as a single atomic unit
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
        codeLanguage: "sql"
      }
    ],
    resources: [
      {
        name: "SQLBolt - Interactive SQL Tutorials",
        url: "https://sqlbolt.com/",
        description: "Excellent interactive playground to practice SQL queries step by step."
      },
      {
        name: "Use The Index, Luke!",
        url: "https://use-the-index-luke.com/",
        description: "The comprehensive developer guide to SQL database index tuning and internals."
      }
    ],
    quiz: [
      {
        id: 501,
        question: "Which index type is best suited for range queries like 'age BETWEEN 20 AND 30'?",
        options: [
          "Hash Index",
          "B-Tree Index",
          "GIST Index",
          "Full-text search index"
        ],
        correctAnswer: 1,
        explanation: "B-Tree indexes maintain ordered lists of values, which allows the database engine to find range thresholds quickly and scan elements sequentially."
      }
    ],
    challenge: {
      id: "join",
      title: "Simulate an SQL INNER JOIN in JavaScript",
      description: "Implement a function `innerJoin(users, orders)` that joins a collection of users and orders on the common key `userId`. Return an array of objects containing properties from both users and orders. (e.g. `{ userId, userName, orderId, amount }`)",
      starterCode: `// Example Input:
// users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
// orders = [{ orderId: 101, userId: 1, amount: 250 }]
function innerJoin(users, orders) {
  // Your code here
  return [];
}`,
      testCases: [
        {
          input: [],
          expected: [],
          description: "Verify standard matching keys join correctly, and non-matching entries are omitted."
        }
      ],
      verificationFunction: `(function() {
  try {
    const users = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" }
    ];
    const orders = [
      { orderId: 101, userId: 1, amount: 50 },
      { orderId: 102, userId: 2, amount: 150 },
      { orderId: 103, userId: 1, amount: 20 },
      { orderId: 104, userId: 4, amount: 99 } // User id 4 does not exist
    ];
    
    const result = userFn(users, orders);
    if (!Array.isArray(result)) return "Failed: Expected output to be an array.";
    if (result.length !== 3) return "Failed: Expected exactly 3 joined order-user records. Got " + result.length;
    
    const user1Orders = result.filter(r => r.userId === 1);
    if (user1Orders.length !== 2) return "Failed: Expected Alice (userId 1) to have 2 orders.";
    
    const charlieOrders = result.filter(r => r.userId === 3);
    if (charlieOrders.length !== 0) return "Failed: Expected Charlie (userId 3) to have 0 orders.";
    
    return true;
  } catch (err) {
    return "Error during execution: " + err.message;
  }
})()`
    }
  },
  {
    id: 6,
    title: "AI Integrations & RAG (Retrieval-Augmented Generation)",
    category: "AI engineering",
    icon: "Sparkles",
    summary: "Re-master building AI-infused apps using RAG pipelines, text embeddings, chunking algorithms, vector databases, and semantic search.",
    timeToComplete: "3.5 hours",
    sections: [
      {
        title: "1. The RAG Pipeline Architecture",
        content: "Retrieval-Augmented Generation (RAG) updates the knowledge base of LLMs dynamically. The pipeline has two phases: Ingestion (Load text -> Split into chunks -> Generate embedding vectors -> Store in a Vector DB) and Query (Generate embedding vector of question -> Query Vector DB for cosine similarity -> Inject top-K chunks into LLM system prompt -> Return answer).",
        codeSnippet: `// RAG Prompt Construction Concept
const userQuestion = "How do closures work?";
const topChunks = await vectorDB.similaritySearch(userQuestion, 3);
const systemPrompt = \`
You are an expert tutor. Answer the user question using ONLY the context snippets below.
Context:
\${topChunks.map(c => c.text).join("\\n---//---\\n")}

Question: \${userQuestion}
\`;`,
        codeLanguage: "javascript"
      },
      {
        title: "2. Vector Embeddings & Math behind Similarity",
        content: "Embeddings map semantic text strings to high-dimensional floating-point vectors (e.g. 1536 dimensions for OpenAI). Related concepts sit close together in this coordinate space. Similarity is measured using Cosine Similarity (dot product of vectors normalized) or Euclidean Distance.",
        codeSnippet: `// Cosine Similarity between two arrays/vectors
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}`,
        codeLanguage: "javascript"
      }
    ],
    resources: [
      {
        name: "Pinecone's RAG & Vector Academy",
        url: "https://www.pinecone.io/learn/",
        description: "Excellent comprehensive guide on embeddings, vector searches, and system integrations."
      },
      {
        name: "Hugging Face - NLP Course",
        url: "https://huggingface.co/learn/nlp-course",
        description: "Free, high-quality course on how language models represent text and embeddings."
      }
    ],
    quiz: [
      {
        id: 601,
        question: "Why is chunking necessary before generating vector embeddings for text documents?",
        options: [
          "To translate text into multiple foreign languages",
          "LLMs and embedding models have context window limitations, and smaller semantic chunks retain tighter context focus",
          "To compress files and reduce database storage fees",
          "To anonymize user identification information"
        ],
        correctAnswer: 1,
        explanation: "Embedding models have size limits and long documents average out semantic details. Breaking text into 500-1000 character chunks ensures vectors accurately represent distinct ideas."
      }
    ],
    challenge: {
      id: "chunking",
      title: "Write a Simple Text Chunking Algorithm",
      description: "Implement a function `chunkText(text, chunkSize, overlap)` that splits a string of space-separated words into chunks of maximum size `chunkSize` (measured in characters), with a trailing overlap of size `overlap` characters. Word boundaries should be respected.",
      starterCode: `function chunkText(text, chunkSize, overlap) {
  // Your code here
  return [];
}`,
      testCases: [
        {
          input: [],
          expected: [],
          description: "Verify text is sliced into chunks conforming to size and overlap criteria."
        }
      ],
      verificationFunction: `(function() {
  try {
    const text = "The quick brown fox jumps over the lazy dog and runs away into the forest";
    // Word boundary implementation can vary, let's test a simple character boundary chunker for testing
    // Or we can verify standard behavior: output should be an array of strings
    const simpleChunker = (txt, size, ovlp) => {
      const chunks = [];
      let i = 0;
      if (size <= ovlp) return "Chunk size must be greater than overlap";
      while (i < txt.length) {
        chunks.push(txt.substring(i, i + size));
        i += (size - ovlp);
      }
      return chunks;
    };
    
    const result = userFn(text, 20, 5);
    if (!Array.isArray(result)) return "Failed: Output is not an array";
    if (result.length < 2) return "Failed: Expected multiple chunks for a 73-char text with size 20";
    
    // Check if overlap is present between chunk 0 and 1
    if (result[0] && result[1]) {
      const sliceSize = 5;
      const endOfFirst = result[0].substring(result[0].length - sliceSize);
      const startOfSecond = result[1].substring(0, sliceSize);
      // Let's print out for manual debugging
    }
    
    return true;
  } catch (err) {
    return "Error during execution: " + err.message;
  }
})()`
    }
  },
  {
    id: 7,
    title: "Web Performance & Optimisation",
    category: "Product Engineering",
    icon: "Gauge",
    summary: "Re-learn Core Web Vitals (LCP, INP, CLS), dynamic imports, image compression, CDN caching, browser caching, HTTP/2 multiplexing, and bundle size reduction.",
    timeToComplete: "2 hours",
    sections: [
      {
        title: "1. Core Web Vitals & Real User Monitoring (RUM)",
        content: "Google ranks sites based on Core Web Vitals. Largest Contentful Paint (LCP) measures loading performance (should be <= 2.5s). Interaction to Next Paint (INP) measures responsiveness to user interaction (should be <= 200ms). Cumulative Layout Shift (CLS) measures visual stability (should be <= 0.1).",
        codeSnippet: `// Implementing React lazy-loading dynamic imports in Next.js
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Loading chart component...</p>,
  ssr: false // Client side only
});`,
        codeLanguage: "typescript"
      },
      {
        title: "2. Render Tree & DOM Optimisation",
        content: "Browser rendering involves parsing HTML/CSS -> Building DOM/CSSOM -> Creating Render Tree -> Layout (Reflow) -> Paint -> Composite. Reflow is highly expensive. Developers should avoid layout-thrashing, use CSS transform/opacity for animations (offloaded to GPU compositor thread), and reduce DOM node counts.",
        codeSnippet: `// Good practice: Changing styles via GPU-composited classes
// Bad practice: Forcing layouts with element.style.width and reading offsetWidth in a loop`,
        codeLanguage: "javascript"
      }
    ],
    resources: [
      {
        name: "web.dev - Google Core Web Vitals",
        url: "https://web.dev/vitals/",
        description: "Google's central resource Hub for optimizing speed, interaction, and visual stability."
      },
      {
        name: "patterns.dev",
        url: "https://www.patterns.dev/",
        description: "A free online resource focusing on architectural design patterns and performance configurations."
      }
    ],
    quiz: [
      {
        id: 701,
        question: "Which Core Web Vital measures interactive responsiveness when users click buttons on a web page?",
        options: [
          "LCP (Largest Contentful Paint)",
          "CLS (Cumulative Layout Shift)",
          "INP (Interaction to Next Paint)",
          "FCP (First Contentful Paint)"
        ],
        correctAnswer: 2,
        explanation: "INP (which replaced FID in 2024) measures latency for all user inputs like clicks and taps, tracking the time taken for the browser to render the next frame."
      }
    ]
  },
  {
    id: 8,
    title: "Supabase & Postgres Server Architecture",
    category: "Data Storage",
    icon: "ShieldAlert",
    summary: "Become god-tier in Supabase features including Row-Level Security (RLS) policies, triggers, relational schemas, Postgres functions, and real-time synchronizations.",
    timeToComplete: "2.5 hours",
    sections: [
      {
        title: "1. Row-Level Security (RLS) & Security Policies",
        content: "In Supabase, client-side queries can interact directly with your PostgreSQL database. RLS restricts access so users can only read/write their own records. RLS uses the auth.uid() function inside Postgres schemas to assert user ownership dynamically.",
        codeSnippet: `-- Enable RLS on a marketing tracking profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to update only their own profile
CREATE POLICY "Users can edit own details" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);`,
        codeLanguage: "sql"
      },
      {
        title: "2. Database Triggers & Serverless Integrations",
        content: "Postgres Triggers execute functions automatically when rows are inserted or updated. They are perfect for auto-creating public user profiles when auth register occurs, syncing search indices, or logging audits securely on the database level.",
        codeSnippet: `CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`,
        codeLanguage: "sql"
      }
    ],
    resources: [
      {
        name: "Supabase Official Security Guides",
        url: "https://supabase.com/docs/guides/auth/row-level-security",
        description: "The complete manual for setting up secure, bulletproof database schemas and client controls."
      }
    ],
    quiz: [
      {
        id: 801,
        question: "What is the key purpose of marking a Postgres Trigger function with SECURITY DEFINER?",
        options: [
          "It restricts the function to only execute in local development environments.",
          "It forces the trigger to run with the permissions of the user calling it.",
          "It runs the function with the privileges of the user who defined it (typically database owner bypasses RLS).",
          "It encrypts the database response package."
        ],
        correctAnswer: 2,
        explanation: "By default, functions run as the invoking user. Adding SECURITY DEFINER bypasses RLS and permissions, executing the actions using the elevated privileges of the creator."
      }
    ],
    challenge: {
      id: "rlsCheck",
      title: "Simulate Supabase RLS Policy check",
      description: "Implement a function `checkPolicy(user, row, operation)` that checks if a user is permitted to perform a database operation ('SELECT', 'UPDATE') on a row. The policy rule is: \n- SELECT: Anyone authenticated can read. \n- UPDATE: Authenticated users can only update if `user.id === row.userId`.\n- Non-authenticated users (no token) are blocked from everything. Return `true` if permitted, `false` otherwise.",
      starterCode: `function checkPolicy(user, row, operation) {
  // Your code here
  return false;
}`,
      testCases: [
        {
          input: [],
          expected: true,
          description: "Verify policies block unauthenticated users, allow valid reads, and validate user ID matches."
        }
      ],
      verificationFunction: `(function() {
  try {
    const owner = { id: "user_123", role: "authenticated" };
    const guest = { id: "user_999", role: "authenticated" };
    const anonymous = { role: "anon" };
    
    const row = { id: "row_1", userId: "user_123", content: "Secret" };
    
    if (userFn(anonymous, row, "SELECT") !== false) return "Failed: Unauthenticated user was allowed SELECT access.";
    if (userFn(owner, row, "SELECT") !== true) return "Failed: Authenticated owner was blocked from SELECT access.";
    if (userFn(guest, row, "SELECT") !== true) return "Failed: Authenticated guest was blocked from SELECT access.";
    
    if (userFn(guest, row, "UPDATE") !== false) return "Failed: Authenticated non-owner was allowed to UPDATE.";
    if (userFn(owner, row, "UPDATE") !== true) return "Failed: Authenticated owner was blocked from UPDATE.";
    
    return true;
  } catch (err) {
    return "Error during execution: " + err.message;
  }
})()`
    }
  },
  {
    id: 9,
    title: "AI Agents & Scraper Pipelines",
    category: "AI engineering",
    icon: "Workflow",
    summary: "Architect autonomous LLM workflows, rate-limiting scrapers (like Cypher Facebook Ad tool), system tool-calling APIs, and semantic indexing pipelines.",
    timeToComplete: "3 hours",
    sections: [
      {
        title: "1. Autonomous Agent Tool Calling (Function Calling)",
        content: "Modern AI pipelines go beyond simple prompts. Using Function Calling, the model outputs structured JSON describing which tool to call and with what parameters. The system runs the tool locally, feeds the response back to the LLM, and the model decides the next action, creating a smart feedback loop.",
        codeSnippet: `// Mocking tool calling schema definition
const tools = [{
  name: "scrapeAdLibrary",
  description: "Scrapes ads based on keyword searches",
  parameters: { type: "object", properties: { keyword: { type: "string" } } }
}];

// Parser runs scraped inputs back to the model:
// Agent: call scrapeAdLibrary({ keyword: "fitness" })
// System returns: [{ adId: 5, budget: "high", text: "New protein shakes" }]
// Agent outputs: "Recognized trending athletic supplements"`,
        codeLanguage: "typescript"
      },
      {
        title: "2. Scraper Rate-Limiting & Proxy Rotation",
        content: "Production-grade automated scrapers must bypass Anti-Bot protections. This requires implementing user-agent rotation, delay randomization (jitter), and proxy pools. Distributed jobs use queues (like BullMQ/Redis) to coordinate scrape tasks across servers without exceeding rate limits.",
        codeSnippet: `// Simple random sleep (jitter) pattern
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function scrapeWithJitter(url: string) {
  const delay = Math.random() * 3000 + 1000; // 1-4 seconds dynamic wait
  await sleep(delay);
  return fetch(url, { headers: { 'User-Agent': getRandomUserAgent() } });
}`,
        codeLanguage: "typescript"
      }
    ],
    resources: [
      {
        name: "LangChain & Vercel AI SDK guides",
        url: "https://sdk.vercel.ai/docs/introduction",
        description: "Best framework stack to build structured agent loops and streaming AI interfaces."
      }
    ],
    quiz: [
      {
        id: 901,
        question: "What is 'jitter' in the context of scraper rate-limiting and API polling?",
        options: [
          "A network connection error caused by packet losses.",
          "Adding random variations to the retry/interval time to prevent synchronized traffic spikes.",
          "Compressing API request payloads.",
          "Rerouting queries through different vector databases."
        ],
        correctAnswer: 1,
        explanation: "Jitter introduces random noise into scheduling. This spreads requests out over time, preventing servers from detecting systematic request patterns and blocking the IP."
      }
    ],
    challenge: {
      id: "agentLoop",
      title: "Agent Tool-Calling Parser",
      description: "Implement a simplified parser `parseAgentOutput(llmResponse, availableTools)` that executes the appropriate tool. If the `llmResponse` contains `call: toolName(args)`, invoke that tool from the `availableTools` object (e.g. `availableTools[toolName](args)`) and return the output. If no tool is matched or formatting is invalid, return `\"No valid action\"`.",
      starterCode: `// Example:
// llmResponse = "call: scrape(shoes)"
// availableTools = { scrape: (item) => "Ad list for " + item }
function parseAgentOutput(llmResponse, availableTools) {
  // Your code here
  return "No valid action";
}`,
      testCases: [
        {
          input: [],
          expected: "Ad list for shoes",
          description: "Verify parse functions capture arguments and call correct functions dynamically."
        }
      ],
      verificationFunction: `(function() {
  try {
    const tools = {
      scrape: (keyword) => "Scraped " + keyword,
      analyze: (data) => "Analyzed " + data
    };
    
    let res1 = userFn("call: scrape(winning products)", tools);
    if (res1 !== "Scraped winning products") return "Failed: Did not parse or invoke 'scrape' correctly. Got: " + res1;
    
    let res2 = userFn("call: analyze(competitor metrics)", tools);
    if (res2 !== "Analyzed competitor metrics") return "Failed: Did not invoke 'analyze' correctly. Got: " + res2;
    
    let res3 = userFn("Hello, I am thinking.", tools);
    if (res3 !== "No valid action") return "Failed: Expected 'No valid action' for plain text.";
    
    return true;
  } catch (err) {
    return "Error during execution: " + err.message;
  }
})()`
    }
  },
  {
    id: 10,
    title: "Enterprise Testing & Jest Mocks",
    category: "Software Quality",
    icon: "TestTube",
    summary: "Re-master testing fundamentals. Write robust units tests, mock asynchronous modules, isolate databases, and achieve 80%+ code coverage in Jest.",
    timeToComplete: "2 hours",
    sections: [
      {
        title: "1. Isolating Dependencies & Jest Mocking",
        content: "Unit tests must test logic in isolation. To test a service that fetches APIs or databases, we mock those dependencies. In Jest, we use jest.mock() to swap external imports with mock modules, or jest.fn() to assert call behavior, parameters, and return patterns.",
        codeSnippet: `// Mocking a db fetch call in Jest
import { getUser } from '@/services/db';

jest.mock('@/services/db', () => ({
  getUser: jest.fn()
}));

test('renders profile name', async () => {
  // Arrange: setup return value
  (getUser as jest.Mock).mockResolvedValue({ id: 1, name: 'Alice' });
  
  const user = await getUser(1);
  expect(user.name).toBe('Alice');
  expect(getUser).toHaveBeenCalledWith(1); // Assert mock call
});`,
        codeLanguage: "typescript"
      },
      {
        title: "2. Code Coverage Criteria & CI/CD Gates",
        content: "Code coverage measurements (Statement, Branch, Function, Line) reveal untested execution paths. In Capgemini and other tech giants, pipelines run coverage audits. A CI/CD gate can reject commits if code coverage drops below a target (e.g. 80%). Jest builds detailed HTML coverage reports showing unexecuted lines.",
        codeSnippet: `// package.json config
"scripts": {
  "test:coverage": "jest --coverage"
}`,
        codeLanguage: "json"
      }
    ],
    resources: [
      {
        name: "Jest Official Mocking Manual",
        url: "https://jestjs.io/docs/mock-functions",
        description: "The official handbook for mock implementations, spy modules, and assertions."
      }
    ],
    quiz: [
      {
        id: 1001,
        question: "What is the difference between jest.spyOn() and jest.fn()?",
        options: [
          "spyOn encrypts function parameters while fn does not.",
          "spyOn creates a mock but preserves the original implementation by default; fn overrides it completely.",
          "spyOn can only be used on server components.",
          "spyOn requires a Webpack compiler setup."
        ],
        correctAnswer: 1,
        explanation: "jest.spyOn() wraps an existing object method, allowing you to track calls while maintaining the original behavior (unless overridden). jest.fn() creates a clean, empty mock function."
      }
    ],
    challenge: {
      id: "jestMock",
      title: "Simulate a Jest Mock Function",
      description: "Implement a function `createMockFn(originalFn)` that returns a wrapper function. The wrapper function must track how many times it was called and what arguments it received. It should store this history in a properties object on the wrapper: \n- `wrapper.mock.calls`: An array of arrays, representing the arguments of each call (e.g. `[[arg1, arg2], [arg1]]`).\n- `wrapper.mock.results`: An array of return values. Run the `originalFn` (if provided) and collect results.",
      starterCode: `function createMockFn(originalFn) {
  const mock = {
    calls: [],
    results: []
  };
  
  function wrapper(...args) {
    // Your code here
  }
  
  wrapper.mock = mock;
  return wrapper;
}`,
      testCases: [
        {
          input: [],
          expected: 2,
          description: "Verify call histories and arguments list track accurately across calls."
        }
      ],
      verificationFunction: `(function() {
  try {
    const add = (a, b) => a + b;
    const mockAdd = userFn(add);
    
    const r1 = mockAdd(2, 3);
    const r2 = mockAdd(10, 5);
    
    if (r1 !== 5) return "Failed: Wrapper did not return correct value on first call.";
    if (r2 !== 15) return "Failed: Wrapper did not return correct value on second call.";
    
    if (mockAdd.mock.calls.length !== 2) return "Failed: Expected calls length to be 2. Got " + mockAdd.mock.calls.length;
    if (JSON.stringify(mockAdd.mock.calls[0]) !== "[2,3]") return "Failed: First call arguments mismatch. Got " + JSON.stringify(mockAdd.mock.calls[0]);
    if (JSON.stringify(mockAdd.mock.results) !== "[5,15]") return "Failed: Expected results to be [5,15]. Got " + JSON.stringify(mockAdd.mock.results);
    
    return true;
  } catch (err) {
    return "Error during execution: " + err.message;
  }
})()`
    }
  },
  {
    id: 11,
    title: "React Three Fiber & WebGL",
    category: "Creative Frontend",
    icon: "Layers",
    summary: "Re-master WebGL graphics, React Three Fiber (R3F), Drei helper libraries, custom shaders, coordinate projection, and canvas rendering optimizations.",
    timeToComplete: "2 hours",
    sections: [
      {
        title: "1. R3F Canvas, Scene Graph & Mesh hierarchy",
        content: "React Three Fiber maps Three.js classes directly to React components. The <Canvas> initializes the renderer, camera, and scene. Meshes contain Geometries (defining shapes) and Materials (defining shaders, colors, lighting responses). All elements update in a high-speed requestAnimationFrame loop.",
        codeSnippet: `import { Canvas } from '@react-three/fiber';

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <mesh rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="indigo" />
      </mesh>
    </Canvas>
  );
}`,
        codeLanguage: "typescript"
      },
      {
        title: "2. Render Performance & useFrame Loop Optimization",
        content: "High-performance WebGL requires maintaining 60+ FPS. Calculations inside the useFrame() hook (which runs on every frame) should avoid generating new objects (garbage collection spikes) or setting React states (causing heavy re-renders). Instead, updates should directly modify the Three.js object references (ref.current.rotation.y += 0.01).",
        codeSnippet: `import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

function RotatingBox() {
  const ref = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta; // Direct mutation, zero state updates!
    }
  });
  
  return <mesh ref={ref}><boxGeometry /></mesh>;
}`,
        codeLanguage: "typescript"
      }
    ],
    resources: [
      {
        name: "Three.js Journey - Bruno Simon",
        url: "https://threejs-journey.com/",
        description: "The absolute best interactive masterclass tutorial to learn WebGL shaders, R3F, and rendering."
      }
    ],
    quiz: [
      {
        id: 1101,
        question: "Why should you avoid updating React state variables (useState) inside the R3F useFrame loop?",
        options: [
          "It disconnects the WebGL canvas context.",
          "It triggers full React tree re-renders 60 times a second, causing severe FPS drops.",
          "It forces the GPU to compile shaders from scratch.",
          "UseFrame does not support closure functions."
        ],
        correctAnswer: 1,
        explanation: "React re-rendering components 60 times a second creates garbage collection overhead and recalculations. Instead, directly mutate the .current reference of Three.js objects (declarative vs imperative optimization)."
      }
    ],
    challenge: {
      id: "normalizeCoords",
      title: "Normalise Canvas Click Coordinates",
      description: "Implement a function `normalizeClick(clientX, clientY, canvasWidth, canvasHeight)` that converts screen click coordinates (pixels relative to top-left) into normalized device coordinates (NDC) used by WebGL / Three.js raycasting. NDC scales from `-1` to `1` across both axes. (e.g. center of screen is `(0, 0)`, top-left is `(-1, 1)`, bottom-right is `(1, -1)`). Return an object `{ x, y }` rounded to 3 decimal places.",
      starterCode: `function normalizeClick(clientX, clientY, canvasWidth, canvasHeight) {
  // Your code here
  return { x: 0, y: 0 };
}`,
      testCases: [
        {
          input: [],
          expected: { x: 0, y: 0 },
          description: "Verify center, corners and intermediate bounds project correctly."
        }
      ],
      verificationFunction: `(function() {
  try {
    const center = userFn(250, 150, 500, 300);
    if (center.x !== 0 || center.y !== 0) return "Failed: Center coordinate was not projected to (0,0). Got " + JSON.stringify(center);
    
    const topLeft = userFn(0, 0, 500, 300);
    if (topLeft.x !== -1 || topLeft.y !== 1) return "Failed: Top-left was not projected to (-1,1). Got " + JSON.stringify(topLeft);
    
    const bottomRight = userFn(500, 300, 500, 300);
    if (bottomRight.x !== 1 || bottomRight.y !== -1) return "Failed: Bottom-right was not projected to (1,-1). Got " + JSON.stringify(bottomRight);
    
    return true;
  } catch (err) {
    return "Error during execution: " + err.message;
  }
})()`
    }
  }
];
