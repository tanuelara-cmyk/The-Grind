import React from 'react';
import { LiveSimulator } from './components/LiveSimulator';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7FAF7] flex flex-col font-sans">
      <LiveSimulator />
      <footer className="bg-white border-t border-[#E2EBE2] py-4 text-center text-xs text-[#839988]">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>The Grind &copy; 2025 – Habit Challenge Club • Small steps. Big changes.</span>
          <span className="text-[#4F6654] font-medium">
            Daily Habits • Streaks • Grind Coach
          </span>
        </div>
      </footer>
    </div>
  );
}
