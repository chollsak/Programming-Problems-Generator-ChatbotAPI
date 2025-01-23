'use client';

import { useState, FormEvent } from 'react';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'th'>('en');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const topics = [
    'Introduction',
    'Variables Expression Statement',
    'Conditional Execution',
    'While Loop',
    'Definite Loop',
    'List',
    'String',
    'Function',
    'Dictionary',
    'Files',
  ];

  const handleCheckboxChange = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const fetchProblem = async (isAnotherProblem = false) => {
    setLoading(true);

    try {
      const res = await fetch('/api/generateProblem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          difficulty,
          topics: selectedTopics,
          isAnotherProblem, // Pass this flag to the backend
        }),
      });

      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
      } else {
        setResponse('No response received. Please try again.');
      }
    } catch (err) {
      setResponse('An error occurred while fetching the problem.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProblem = async (e: FormEvent) => {
    e.preventDefault();
    fetchProblem();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-4xl font-extralight text-center mb-8 text-black">
        Programming Problem Generator
      </h1>

      <form onSubmit={handleGenerateProblem} className="bg-white shadow-lg rounded-xl p-8 space-y-6">
        {/* Language Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Select Language:</h3>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                language === 'en'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('th')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                language === 'th'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Thai
            </button>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Select Difficulty:</h3>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setDifficulty('easy')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                difficulty === 'easy'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Easy
            </button>
            <button
              type="button"
              onClick={() => setDifficulty('medium')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                difficulty === 'medium'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setDifficulty('hard')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                difficulty === 'hard'
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Hard
            </button>
          </div>
        </div>

        {/* Topic Selection */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Select Topics:</h3>
          <div className="grid grid-cols-2 gap-4">
            {topics.map((topic) => (
              <label key={topic} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={topic}
                checked={selectedTopics.includes(topic)}
                onChange={() => handleCheckboxChange(topic)}
                className="h-4 w-4 accent-black text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-gray-700">{topic}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-black transition ${
              selectedTopics.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={selectedTopics.length === 0}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <span className="animate-spin h-5 w-5 border-4 border-t-transparent border-white rounded-full"></span>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate Problem'
            )}
          </button>
        </div>
      </form>

      {/* Response Section */}
      {!loading && response && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-semibold mb-4">Generated Problem:</h3>
          <pre className="bg-white p-4 border-2 rounded-md shadow-inner text-sm overflow-auto">{response}</pre>
          <button
            onClick={() => fetchProblem(true)} // Fetch another problem
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-black transition"
          >
            Generate Another Problem
          </button>
        </div>
      )}
    </div>
  );
}
