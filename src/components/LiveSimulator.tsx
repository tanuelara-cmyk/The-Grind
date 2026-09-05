import React, { useState, useEffect } from 'react';
import { 
  Flame, CheckCircle2, Trophy, Zap, Clock, Bell, ChevronRight, 
  ArrowLeft, Plus, Trash2, Send, MessageSquare, Bot, User as UserIcon,
  Settings as SettingsIcon, BarChart3, Calendar, ShieldCheck, Sparkles,
  Pencil, Check, X
} from 'lucide-react';

interface HabitItem {
  id: number;
  name: string;
  category: string;
  icon: string;
  target: string;
  reminderTime: string;
  completed: boolean;
}

export const LiveSimulator: React.FC = () => {
  // Navigation Screens: 'landing' | 'login' | 'register' | 'onboarding' | 'select-habits' | 'reminders' | 'dashboard' | 'habit-details' | 'progress' | 'profile' | 'settings'
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  
  // User State (Default name: Tanu Yadav)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('the_grind_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Tanu Sharma') {
          parsed.name = 'Tanu Yadav';
        }
        if (parsed.email === 'tanu.sharma@example.com') {
          parsed.email = 'tanu.yadav@example.com';
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return {
      name: 'Tanu Yadav',
      email: 'tanu.yadav@example.com',
      currentStreak: 7,
      bestStreak: 14,
      totalCompleted: 42,
      goals: ['Build Consistency', 'Read More', 'Improve Fitness', 'Be Healthier']
    };
  });

  // Sync to local storage for persistence across refreshes
  useEffect(() => {
    try {
      localStorage.setItem('the_grind_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  // Streak Editing Modal & Inline State
  const [isEditingStreak, setIsEditingStreak] = useState(false);
  const [streakInputValue, setStreakInputValue] = useState<number>(user.currentStreak);
  const [streakToast, setStreakToast] = useState<string | null>(null);

  // Profile Editing State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState(user.name);
  const [profileEmailInput, setProfileEmailInput] = useState(user.email);

  const handleOpenStreakEditor = () => {
    setStreakInputValue(user.currentStreak);
    setIsEditingStreak(true);
  };

  const handleSaveStreak = (newVal: number) => {
    const validVal = Math.max(0, Math.floor(isNaN(newVal) ? 0 : newVal));
    setUser(prev => ({
      ...prev,
      currentStreak: validVal,
      bestStreak: Math.max(prev.bestStreak, validVal)
    }));
    setIsEditingStreak(false);
    setStreakToast(`Streak updated to ${validVal} day${validVal === 1 ? '' : 's'}! 🔥`);
    setTimeout(() => setStreakToast(null), 3000);
  };

  // Habit Stack State (Initial 7 Habits)
  const [habits, setHabits] = useState<HabitItem[]>([
    { id: 1, name: 'Drink 2L Water', category: 'Health', icon: '💧', target: '2000 ml', reminderTime: '08:00 AM', completed: true },
    { id: 2, name: '30-min Workout', category: 'Fitness', icon: '🏋️', target: '30 mins', reminderTime: '06:30 AM', completed: true },
    { id: 3, name: 'Read 10 Pages', category: 'Mindset', icon: '📖', target: '10 pages', reminderTime: '09:00 PM', completed: true },
    { id: 4, name: 'Meditate 10 Mins', category: 'Mindfulness', icon: '🧘', target: '10 mins', reminderTime: '07:00 AM', completed: true },
    { id: 5, name: 'Walk 8,000 Steps', category: 'Fitness', icon: '🚶', target: '8000 steps', reminderTime: '07:30 PM', completed: true },
    { id: 6, name: 'Sleep Before 11 PM', category: 'Recovery', icon: '🌙', target: '1 time', reminderTime: '10:30 PM', completed: false },
    { id: 7, name: 'Study DSA (1 Hour)', category: 'Career', icon: '💻', target: '60 mins', reminderTime: '04:00 PM', completed: false },
  ]);

  const [selectedHabitId, setSelectedHabitId] = useState<number>(1);

  // New Habit Modal / Form
  const [customHabitName, setCustomHabitName] = useState('');
  const [customHabitTarget, setCustomHabitTarget] = useState('1');
  const [customHabitUnit, setCustomHabitUnit] = useState('times');

  // Grind Coach Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'coach' | 'user', text: string }>>([
    { sender: 'coach', text: "Hey Tanu! I'm your Grind Coach. How can I help you stay on track today?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Calculations
  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle habit
  const toggleHabit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextState = !h.completed;
        return { ...h, completed: nextState };
      }
      return h;
    }));
  };

  // Add custom habit
  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHabitName.trim()) return;
    const newHabit: HabitItem = {
      id: Date.now(),
      name: customHabitName.trim(),
      category: 'Custom',
      icon: '⚡',
      target: `${customHabitTarget} ${customHabitUnit}`,
      reminderTime: '08:00 PM',
      completed: false
    };
    setHabits(prev => [...prev, newHabit]);
    setCustomHabitName('');
    alert('Habit added successfully to your stack!');
  };

  // Delete habit
  const handleDeleteHabit = (id: number) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setCurrentScreen('dashboard');
  };

  // Send Chat message
  const handleSendMessage = (msgText?: string) => {
    const text = (msgText || chatInput).trim();
    if (!text) return;

    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setChatInput('');

    // Rule-based Grind Coach intent detection mirroring ChatbotService.java
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "Keep showing up every day. Consistency is about showing up even when you don't feel like it!";

      if (lower.includes('missed') || lower.includes('failed') || lower.includes('forgot')) {
        reply = "That's completely fine! Missing one day doesn't erase your progress. Consistency isn't about perfection; it's about not missing twice. Take 5 minutes right now to knock out an easy win!";
      } else if (lower.includes('motivat') || lower.includes('hard') || lower.includes('lazy')) {
        reply = "Remember: Small steps. Big changes. You don't need intense motivation; you just need to start for 2 minutes. Your future self will thank you for showing up!";
      } else if (lower.includes('focus') || lower.includes('today') || lower.includes('next')) {
        const pending = habits.filter(h => !h.completed);
        if (pending.length === 0) {
          reply = `Outstanding work, ${user.name}! You've completed all your habits for today! Celebrate your discipline and prepare for tomorrow.`;
        } else {
          reply = `You have ${pending.length} habits pending: ${pending.map(p => p.name).join(', ')}. I suggest tackling "${pending[0].name}" right now!`;
        }
      } else if (lower.includes('streak') || lower.includes('doing') || lower.includes('progress')) {
        reply = `You've checked off ${completedCount} of ${totalCount} habits today (${completionPercentage}%), and you're currently riding a ${user.currentStreak}-day active streak! Keep the flame burning! 🔥`;
      }

      setChatMessages(prev => [...prev, { sender: 'coach', text: reply }]);
    }, 400);
  };

  const selectedHabit = habits.find(h => h.id === selectedHabitId) || habits[0];

  return (
    <div className="min-h-screen bg-[#F7FAF7] text-[#1A2E1F] font-sans flex flex-col relative pb-16">
      
      {/* Top Application Bar */}
      <header className="bg-white border-b border-[#E2EBE2] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            onClick={() => setCurrentScreen('dashboard')} 
            className="flex items-center gap-2 cursor-pointer font-extrabold text-xl tracking-tight"
          >
            <span className="text-2xl">🌱</span>
            <span>THE GRIND</span>
            <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-2 py-0.5 rounded-full uppercase">Club</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#4F6654]">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className={`hover:text-[#2E7D32] transition-colors ${currentScreen === 'dashboard' ? 'text-[#2E7D32]' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentScreen('progress')}
              className={`hover:text-[#2E7D32] transition-colors ${currentScreen === 'progress' ? 'text-[#2E7D32]' : ''}`}
            >
              Progress
            </button>
            <button 
              onClick={() => setCurrentScreen('select-habits')}
              className={`hover:text-[#2E7D32] transition-colors ${currentScreen === 'select-habits' ? 'text-[#2E7D32]' : ''}`}
            >
              Habit Catalog
            </button>
            <button 
              onClick={() => setCurrentScreen('reminders')}
              className={`hover:text-[#2E7D32] transition-colors ${currentScreen === 'reminders' ? 'text-[#2E7D32]' : ''}`}
            >
              Reminders
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentScreen('reminders')} 
              className="relative p-2 text-[#4F6654] hover:text-[#2E7D32]"
              title="Reminders"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button 
              onClick={() => setCurrentScreen('profile')} 
              className="w-9 h-9 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-bold border-2 border-[#A5D6A7] flex items-center justify-center text-sm"
              title="Profile"
            >
              {user.name.charAt(0)}
            </button>

            <button 
              onClick={() => setCurrentScreen('login')}
              className="text-xs border border-[#E2EBE2] px-3 py-1.5 rounded-full font-medium hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Screen Router */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">

        {/* 1. LANDING PAGE */}
        {currentScreen === 'landing' && (
          <div className="max-w-3xl mx-auto text-center py-12">
            <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] px-4 py-1 rounded-full text-xs font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Built for Daily Consistency
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-[#1A2E1F]">
              Small steps.<br /><span className="text-[#2E7D32]">Big changes.</span>
            </h1>
            <p className="text-lg text-[#4F6654] mb-8 leading-relaxed">
              Welcome to The Grind – a habit challenge club to build daily discipline. Master your daily routines with streak preservation, weekly analytics, and an intelligent Grind Coach.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button 
                onClick={() => setCurrentScreen('onboarding')}
                className="bg-[#2E7D32] text-white px-8 py-3.5 rounded-full font-bold shadow-sm hover:bg-[#256629] transition-all"
              >
                Start Your 30-Day Grind →
              </button>
              <button 
                onClick={() => setCurrentScreen('login')}
                className="border border-[#E2EBE2] px-6 py-3.5 rounded-full font-semibold hover:border-[#2E7D32]"
              >
                Member Sign In
              </button>
            </div>
          </div>
        )}

        {/* 2. LOGIN PAGE */}
        {currentScreen === 'login' && (
          <div className="max-w-md mx-auto py-10">
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm">
              <div className="text-center mb-6">
                <span className="text-3xl mb-2 block">👋</span>
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-sm text-[#4F6654]">Sign in to maintain your streak.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="demo@thegrind.club"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Password</label>
                  <input 
                    type="password" 
                    defaultValue="••••••••"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                  />
                </div>
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="w-full bg-[#2E7D32] text-white py-3 rounded-full font-bold hover:bg-[#256629] transition-all"
                >
                  Sign In to Dashboard →
                </button>
              </div>

              <p className="text-center text-xs text-[#4F6654] mt-6 pt-4 border-t border-[#E2EBE2]">
                New to the club? <button onClick={() => setCurrentScreen('register')} className="text-[#2E7D32] font-bold">Create Account</button>
              </p>
            </div>
          </div>
        )}

        {/* 3. REGISTER PAGE */}
        {currentScreen === 'register' && (
          <div className="max-w-md mx-auto py-10">
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm">
              <div className="text-center mb-6">
                <span className="text-3xl mb-2 block">🚀</span>
                <h2 className="text-2xl font-bold">Join The Grind</h2>
                <p className="text-sm text-[#4F6654]">Build daily habits that last a lifetime.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Tanu Yadav"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="tanu.yadav@example.com"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4F6654] mb-1">Password</label>
                  <input 
                    type="password" 
                    defaultValue="secret123"
                    className="w-full p-3 rounded-xl border border-[#E2EBE2] focus:border-[#2E7D32] outline-none text-sm"
                  />
                </div>
                <button 
                  onClick={() => setCurrentScreen('onboarding')}
                  className="w-full bg-[#2E7D32] text-white py-3 rounded-full font-bold hover:bg-[#256629] transition-all"
                >
                  Continue to Onboarding →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. ONBOARDING (GOALS) */}
        {currentScreen === 'onboarding' && (
          <div className="max-w-xl mx-auto py-6">
            <div className="text-center mb-8">
              <span className="text-4xl mb-2 block">🎯</span>
              <h2 className="text-3xl font-extrabold mb-2">What are your core goals?</h2>
              <p className="text-sm text-[#4F6654]">Step 1 of 3: Select all that apply. We will configure your stack accordingly.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {['Build Consistency', 'Be Healthier', 'Read More', 'Improve Fitness', 'Sleep Better', 'Reduce Screen Time'].map((goal, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center gap-3">
                  <input type="checkbox" defaultChecked={idx < 4} className="w-5 h-5 accent-[#2E7D32]" />
                  <span className="font-semibold text-sm">{goal}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentScreen('dashboard')} className="text-sm text-[#839988] font-semibold">Skip for now</button>
              <button 
                onClick={() => setCurrentScreen('select-habits')}
                className="bg-[#2E7D32] text-white px-8 py-3 rounded-full font-bold hover:bg-[#256629]"
              >
                Next: Choose Habits →
              </button>
            </div>
          </div>
        )}

        {/* 5. SELECT HABITS */}
        {currentScreen === 'select-habits' && (
          <div className="max-w-2xl mx-auto py-6">
            <div className="text-center mb-8">
              <span className="text-4xl mb-2 block">⚡</span>
              <h2 className="text-3xl font-extrabold mb-2">Select Your Daily Habits</h2>
              <p className="text-sm text-[#4F6654]">Step 2 of 3: Pre-configured habits plus custom targets.</p>
            </div>

            <div className="space-y-3 mb-8">
              {habits.map(h => (
                <div key={h.id} className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{h.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm">{h.name}</h4>
                      <p className="text-xs text-[#839988]">{h.category} &bull; Target: {h.target}</p>
                    </div>
                  </div>
                  <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-3 py-1 rounded-full">In Stack</span>
                </div>
              ))}
            </div>

            {/* Add Custom Habit Box */}
            <div className="bg-[#F0F5F0] p-6 rounded-2xl border border-dashed border-[#A5D6A7] mb-8">
              <h3 className="text-sm font-bold text-[#1A2E1F] mb-3">✨ Add Custom Habit</h3>
              <form onSubmit={handleAddCustomHabit} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Habit Name (e.g. Cold Shower, DSA Problem)" 
                  value={customHabitName}
                  onChange={e => setCustomHabitName(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-lg border border-[#E2EBE2] text-sm"
                  required
                />
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={customHabitTarget}
                    onChange={e => setCustomHabitTarget(e.target.value)}
                    className="w-24 p-2 bg-white rounded-lg border border-[#E2EBE2] text-sm"
                    min="1"
                  />
                  <input 
                    type="text" 
                    value={customHabitUnit}
                    onChange={e => setCustomHabitUnit(e.target.value)}
                    placeholder="Unit (mins, pages, times)"
                    className="flex-1 p-2 bg-white rounded-lg border border-[#E2EBE2] text-sm"
                  />
                </div>
                <button type="submit" className="w-full bg-white border border-[#2E7D32] text-[#2E7D32] py-2 rounded-lg text-sm font-bold hover:bg-[#E8F5E9]">
                  + Add to Stack
                </button>
              </form>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentScreen('onboarding')} className="text-sm text-[#839988] font-semibold">← Back</button>
              <button 
                onClick={() => setCurrentScreen('reminders')}
                className="bg-[#2E7D32] text-white px-8 py-3 rounded-full font-bold hover:bg-[#256629]"
              >
                Next: Set Reminders →
              </button>
            </div>
          </div>
        )}

        {/* 6. REMINDERS */}
        {currentScreen === 'reminders' && (
          <div className="max-w-md mx-auto py-8">
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm text-center">
              <span className="text-4xl mb-3 block">⏰</span>
              <h2 className="text-2xl font-bold mb-2">Set Daily Reminders</h2>
              <p className="text-sm text-[#4F6654] mb-6">Step 3 of 3: Background multithreaded notification cue.</p>

              <div className="bg-[#F7FAF7] p-4 rounded-xl border border-[#E2EBE2] flex items-center justify-between mb-6 text-left">
                <div>
                  <div className="font-bold text-sm">Daily Check-in Alert</div>
                  <div className="text-xs text-[#839988]">Background multithreaded scheduler</div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#2E7D32]" />
              </div>

              <div className="mb-6 text-left">
                <label className="block text-xs font-bold text-[#4F6654] mb-1">Preferred Time</label>
                <input 
                  type="text" 
                  defaultValue="08:00 AM" 
                  className="w-full p-3 text-center text-lg font-bold rounded-xl border border-[#E2EBE2]"
                />
              </div>

              <button 
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full bg-[#2E7D32] text-white py-3.5 rounded-full font-bold hover:bg-[#256629]"
              >
                Save & Go to Dashboard →
              </button>
            </div>
          </div>
        )}

        {/* 7. DASHBOARD (MAIN APPLICATION VIEW) */}
        {currentScreen === 'dashboard' && (
          <div>
            {/* Greeting & Date Header */}
            <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-[#1A2E1F]">Good day, {user.name}! 👋</h1>
                <p className="text-sm text-[#4F6654]">
                  Today is <span className="font-semibold text-[#1A2E1F]">Monday, March 3, 2025</span> &bull; Small steps make big changes.
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentScreen('select-habits')}
                  className="bg-[#E8F5E9] text-[#2E7D32] px-4 py-2 rounded-full font-bold text-xs hover:bg-[#DCEDC8] transition-colors"
                >
                  + Add Habit
                </button>
                <button 
                  onClick={() => setCurrentScreen('progress')}
                  className="border border-[#E2EBE2] px-4 py-2 rounded-full font-semibold text-xs hover:border-[#2E7D32] transition-colors"
                >
                  📊 Full Progress
                </button>
              </div>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center justify-between group hover:border-[#2E7D32]/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#FFF3E0] text-[#E65100] flex items-center justify-center text-xl">🔥</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black">{user.currentStreak} Days</span>
                      <button 
                        onClick={handleOpenStreakEditor}
                        className="p-1 rounded-md text-[#839988] hover:text-[#E65100] hover:bg-[#FFF3E0] transition-colors"
                        title="Edit current streak"
                        aria-label="Edit current streak"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-[#839988] font-medium">Current Streak</div>
                  </div>
                </div>
                <button
                  onClick={handleOpenStreakEditor}
                  className="hidden sm:inline-flex text-[11px] text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#DCEDC8] px-2.5 py-1 rounded-lg font-bold transition-colors"
                >
                  Edit
                </button>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-xl">✅</div>
                <div>
                  <div className="text-2xl font-black">{completedCount} / {totalCount}</div>
                  <div className="text-xs text-[#839988] font-medium">Completed Today</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#E8EAF6] text-[#3949AB] flex items-center justify-center text-xl">🏆</div>
                <div>
                  <div className="text-2xl font-black">{user.bestStreak} Days</div>
                  <div className="text-xs text-[#839988] font-medium">Best Streak</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E2EBE2] flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#F3E5F5] text-[#8E24AA] flex items-center justify-center text-xl">⚡</div>
                <div>
                  <div className="text-2xl font-black">{user.totalCompleted}</div>
                  <div className="text-xs text-[#839988] font-medium">All-Time Habits</div>
                </div>
              </div>
            </div>

            {/* 2-Column Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (Habits List) */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-extrabold text-lg">Today's Habit Stack</h2>
                  <span className="text-xs text-[#839988]">Click checkbox to toggle completion</span>
                </div>

                <div className="space-y-3">
                  {habits.map(h => (
                    <div 
                      key={h.id}
                      onClick={() => { setSelectedHabitId(h.id); setCurrentScreen('habit-details'); }}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        h.completed 
                          ? 'bg-[#F0F5F0] border-[rgba(46,125,50,0.2)]' 
                          : 'bg-white border-[#E2EBE2] hover:border-[#A5D6A7]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{h.icon}</span>
                        <div>
                          <h4 className={`font-bold text-sm ${h.completed ? 'line-through text-[#4F6654]' : 'text-[#1A2E1F]'}`}>
                            {h.name}
                          </h4>
                          <p className="text-xs text-[#839988]">
                            {h.category} &bull; Target: {h.target} &bull; ⏰ {h.reminderTime}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleHabit(h.id, e)}
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                          h.completed 
                            ? 'bg-[#2E7D32] border-[#2E7D32] text-white' 
                            : 'border-[#E2EBE2] bg-transparent text-transparent hover:border-[#2E7D32]'
                        }`}
                        title="Toggle Habit Completion"
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column (Progress & Philosophy) */}
              <div className="space-y-6">
                
                {/* Daily Completion Progress Box */}
                <div className="bg-white p-6 rounded-2xl border border-[#E2EBE2] shadow-sm">
                  <h3 className="font-bold text-base mb-2">Today's Consistency Rate</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-extrabold text-[#2E7D32]">{completionPercentage}%</span>
                    <span className="text-xs text-[#839988]">of targets reached</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F0F5F0] rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-[#2E7D32] rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#4F6654] leading-relaxed">
                    {completionPercentage === 100 
                      ? "🎉 Incredible! You've crushed all your habits today. Take pride in your discipline." 
                      : `Keep pushing! You only have ${totalCount - completedCount} habits left to protect your streak.`}
                  </p>
                </div>

                {/* Quote Box */}
                <div className="bg-[#E8F5E9] border border-[#A5D6A7] p-5 rounded-2xl">
                  <div className="text-xs font-bold uppercase text-[#2E7D32] tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Grind Philosophy
                  </div>
                  <p className="text-sm italic text-[#1A2E1F] mb-2">
                    "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                  </p>
                  <p className="text-xs font-bold text-[#4F6654] text-right">— Will Durant</p>
                </div>

                {/* Quick Advice Prompt for Coach */}
                <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2]">
                  <div className="flex items-center gap-3 mb-3">
                    <Bot className="w-6 h-6 text-[#2E7D32]" />
                    <div>
                      <div className="font-bold text-sm">Need a Habit Nudge?</div>
                      <div className="text-xs text-[#839988]">Grind Coach is standing by</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsChatOpen(true); handleSendMessage("What should I focus on today?"); }}
                    className="w-full bg-[#F7FAF7] border border-[#E2EBE2] text-[#2E7D32] py-2 rounded-xl text-xs font-bold hover:bg-[#E8F5E9]"
                  >
                    Ask Coach: "What should I focus on?"
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 8. HABIT DETAILS */}
        {currentScreen === 'habit-details' && (
          <div className="max-w-xl mx-auto py-6">
            <button 
              onClick={() => setCurrentScreen('dashboard')}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#4F6654] mb-6 hover:text-[#2E7D32]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl p-3 bg-[#E8F5E9] rounded-2xl">{selectedHabit.icon}</span>
                <div>
                  <span className="text-xs font-bold uppercase text-[#2E7D32]">{selectedHabit.category}</span>
                  <h1 className="text-2xl font-extrabold">{selectedHabit.name}</h1>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F7FAF7] p-4 rounded-xl">
                  <div className="text-lg font-bold">{selectedHabit.target}</div>
                  <div className="text-xs text-[#839988]">Daily Goal Target</div>
                </div>
                <div className="bg-[#F7FAF7] p-4 rounded-xl">
                  <div className="text-lg font-bold">{selectedHabit.reminderTime}</div>
                  <div className="text-xs text-[#839988]">Daily Scheduled Reminder</div>
                </div>
              </div>

              {/* 7-Day Visual History */}
              <div className="mb-8">
                <h4 className="font-bold text-sm mb-3">7-Day Consistency Record</h4>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={idx}>
                      <div className="text-xs text-[#839988] mb-1">{day}</div>
                      <div className="h-10 rounded-lg bg-[#E8F5E9] text-[#2E7D32] font-bold flex items-center justify-center text-sm">
                        {idx === 6 ? (selectedHabit.completed ? '✓' : '—') : '✓'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-[#E2EBE2]">
                <button 
                  onClick={() => handleDeleteHabit(selectedHabit.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete Habit
                </button>
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="bg-[#2E7D32] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#256629]"
                >
                  Done Viewing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. PROGRESS ANALYTICS */}
        {currentScreen === 'progress' && (
          <div className="py-6">
            <div className="mb-8">
              <span className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-3 py-1 rounded-full uppercase">Analytics</span>
              <h1 className="text-3xl font-extrabold mt-2">Consistency Overview</h1>
              <p className="text-sm text-[#4F6654]">Weekly Monday-Sunday habit completion performance.</p>
            </div>

            {/* Weekly Mon-Sun Bar Chart */}
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-lg">Weekly Performance</h3>
                  <p className="text-xs text-[#839988]">Monday to Sunday completion metrics</p>
                </div>
                <span className="bg-[#E8F5E9] text-[#2E7D32] font-bold px-3 py-1 rounded-full text-xs">
                  Weekly Avg: 78%
                </span>
              </div>

              <div className="grid grid-cols-7 gap-4 items-end h-56 pb-4 border-b border-[#E2EBE2]">
                {[
                  { day: 'Mon', pct: 60 },
                  { day: 'Tue', pct: 80 },
                  { day: 'Wed', pct: 100 },
                  { day: 'Thu', pct: 60 },
                  { day: 'Fri', pct: 80 },
                  { day: 'Sat', pct: 100 },
                  { day: 'Sun', pct: 50 }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-bold text-[#2E7D32]">{item.pct}%</span>
                    <div 
                      className={`w-full max-w-10 rounded-t-lg transition-all ${item.pct >= 80 ? 'bg-[#2E7D32]' : 'bg-[#A5D6A7]'}`}
                      style={{ height: `${item.pct * 1.6}px` }}
                    ></div>
                    <span className="text-xs font-semibold text-[#4F6654]">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2] flex flex-col justify-between group hover:border-[#2E7D32]/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <button
                    onClick={handleOpenStreakEditor}
                    className="text-xs font-bold text-[#2E7D32] bg-[#E8F5E9] hover:bg-[#DCEDC8] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit Streak
                  </button>
                </div>
                <div>
                  <div className="text-2xl font-black">{user.currentStreak} Days</div>
                  <div className="text-xs text-[#839988]">Active Streak</div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2]">
                <Trophy className="w-6 h-6 text-indigo-500 mb-2" />
                <div className="text-2xl font-black">{user.bestStreak} Days</div>
                <div className="text-xs text-[#839988]">Personal Record</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2]">
                <Zap className="w-6 h-6 text-purple-500 mb-2" />
                <div className="text-2xl font-black">{user.totalCompleted}</div>
                <div className="text-xs text-[#839988]">Total Habits Checked</div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-[#E2EBE2]">
                <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
                <div className="text-2xl font-black">{completionPercentage}%</div>
                <div className="text-xs text-[#839988]">Today's Success Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* 10. PROFILE */}
        {currentScreen === 'profile' && (
          <div className="max-w-lg mx-auto py-6">
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] font-black text-2xl flex items-center justify-center border-2 border-[#A5D6A7]">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold">{user.name}</h2>
                    <p className="text-xs text-[#4F6654]">{user.email}</p>
                    <span className="inline-block mt-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Silver Grinder Member
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setProfileNameInput(user.name);
                    setProfileEmailInput(user.email);
                    setIsEditingProfile(!isEditingProfile);
                  }}
                  className="border border-[#E2EBE2] text-[#4F6654] hover:text-[#2E7D32] hover:border-[#2E7D32] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditingProfile && (
                <form 
                  onSubmit={e => {
                    e.preventDefault();
                    if (profileNameInput.trim()) {
                      setUser(prev => ({
                        ...prev,
                        name: profileNameInput.trim(),
                        email: profileEmailInput.trim() || prev.email
                      }));
                      setIsEditingProfile(false);
                      setStreakToast('Profile updated successfully!');
                      setTimeout(() => setStreakToast(null), 3000);
                    }
                  }}
                  className="bg-[#F7FAF7] p-4 rounded-xl border border-[#E2EBE2] mb-6 space-y-3"
                >
                  <h4 className="font-bold text-xs text-[#4F6654]">Edit Member Information</h4>
                  <div>
                    <label className="block text-[11px] font-bold text-[#839988] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileNameInput}
                      onChange={e => setProfileNameInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E2EBE2] bg-white text-xs font-semibold outline-none focus:border-[#2E7D32]"
                      placeholder="e.g. Tanu Yadav"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#839988] mb-1">Email</label>
                    <input
                      type="email"
                      value={profileEmailInput}
                      onChange={e => setProfileEmailInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E2EBE2] bg-white text-xs font-semibold outline-none focus:border-[#2E7D32]"
                      placeholder="e.g. tanu.yadav@example.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 border border-[#E2EBE2] rounded-lg text-xs font-bold text-[#839988]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#2E7D32] text-white rounded-lg text-xs font-bold hover:bg-[#256629]"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              )}

              {/* Streak Stats Card in Profile with direct edit */}
              <div className="bg-[#F7FAF7] p-4 rounded-xl border border-[#E2EBE2] mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFF3E0] text-[#E65100] flex items-center justify-center text-lg">🔥</div>
                  <div>
                    <div className="text-xs text-[#839988] font-medium">Active Habit Streak</div>
                    <div className="text-xl font-black text-[#1A2E1F]">{user.currentStreak} Days</div>
                  </div>
                </div>
                <button
                  onClick={handleOpenStreakEditor}
                  className="bg-white border border-[#E2EBE2] hover:border-[#2E7D32] text-[#2E7D32] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Pencil className="w-3 h-3" /> Edit Streak
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#E2EBE2]">
                <h4 className="font-bold text-sm">Active Focus Goals</h4>
                <div className="flex flex-wrap gap-2">
                  {user.goals.map((g, idx) => (
                    <span key={idx} className="bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold px-3 py-1 rounded-full">
                      🎯 {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2EBE2]">
                <button 
                  onClick={() => setCurrentScreen('settings')}
                  className="w-full bg-[#F7FAF7] border border-[#E2EBE2] py-2.5 rounded-xl font-bold text-xs hover:bg-[#E8F5E9] flex items-center justify-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4" /> App Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 11. SETTINGS */}
        {currentScreen === 'settings' && (
          <div className="max-w-lg mx-auto py-6">
            <div className="bg-white p-8 rounded-2xl border border-[#E2EBE2] shadow-sm space-y-6">
              <h2 className="text-2xl font-extrabold">Settings</h2>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-[#4F6654]">Notification Preferences</h4>
                <div className="bg-[#F7FAF7] p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm">Daily Habit Reminder</div>
                    <div className="text-xs text-[#839988]">08:00 AM Every Day</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#2E7D32]" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2EBE2] space-y-3">
                <h4 className="font-bold text-sm text-[#4F6654]">Security & Session</h4>
                <div className="text-xs text-[#839988]">
                  Passwords secured via SHA-256 with user-salted hashing in MySQL.
                </div>
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="w-full text-red-600 border border-red-200 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50"
                >
                  Sign Out of The Grind
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Grind Coach Chatbot Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#2E7D32] hover:bg-[#256629] text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-50 transition-transform hover:scale-105"
        title="Open Grind Coach"
      >
        💬
      </button>

      {/* Grind Coach Chat Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-2xl border border-[#E2EBE2] shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#2E7D32] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">Grind Coach</h3>
                <p className="text-[11px] opacity-85">Habit Consistency Companion</p>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:opacity-75 text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'coach' 
                    ? 'bg-[#E8F5E9] text-[#1A2E1F] self-start rounded-bl-none' 
                    : 'bg-[#2E7D32] text-white self-end ml-auto rounded-br-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Suggestion Chips */}
          <div className="p-2 bg-[#F7FAF7] border-t border-[#E2EBE2] flex flex-wrap gap-1.5">
            {[
              "What should I focus on today?",
              "I missed my habit today",
              "Give me some motivation",
              "How is my streak?"
            ].map((chip, idx) => (
              <button 
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] bg-white border border-[#E2EBE2] px-2.5 py-1 rounded-full text-[#4F6654] hover:border-[#2E7D32] hover:text-[#2E7D32]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#E2EBE2] flex gap-2">
            <input 
              type="text" 
              placeholder="Ask Grind Coach..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-2 text-xs border border-[#E2EBE2] rounded-xl outline-none focus:border-[#2E7D32]"
            />
            <button 
              onClick={() => handleSendMessage()}
              className="bg-[#2E7D32] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#256629]"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {streakToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1A2E1F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#2E7D32] flex items-center gap-2 text-xs font-semibold">
          <span>🔥</span>
          <span>{streakToast}</span>
        </div>
      )}

      {/* Streak Editor Modal */}
      {isEditingStreak && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E2EBE2] text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EBE2] mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3E0] text-[#E65100] flex items-center justify-center text-base font-black">
                  🔥
                </div>
                <h3 className="font-extrabold text-base text-[#1A2E1F]">Edit Current Streak</h3>
              </div>
              <button 
                onClick={() => setIsEditingStreak(false)}
                className="text-[#839988] hover:text-[#1A2E1F] p-1 rounded-lg"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#4F6654] leading-relaxed mb-4">
              Update your active daily streak count. Personal best streak will automatically sync if your current streak exceeds it!
            </p>

            {/* Stepper with number input */}
            <div className="flex items-center justify-center gap-3 my-5">
              <button
                type="button"
                onClick={() => setStreakInputValue(prev => Math.max(0, prev - 1))}
                className="w-12 h-12 rounded-2xl bg-[#F7FAF7] border border-[#E2EBE2] text-xl font-black hover:bg-[#E8F5E9] text-[#2E7D32] transition-colors"
                title="Decrease by 1"
              >
                -
              </button>
              <div className="text-center">
                <input
                  type="number"
                  min="0"
                  value={streakInputValue}
                  onChange={e => setStreakInputValue(parseInt(e.target.value) || 0)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveStreak(streakInputValue);
                    }
                  }}
                  className="w-28 text-center text-3xl font-black text-[#1A2E1F] border border-[#E2EBE2] rounded-2xl py-2 focus:border-[#2E7D32] outline-none"
                  autoFocus
                />
                <div className="text-[11px] text-[#839988] mt-1 font-medium">Days active</div>
              </div>
              <button
                type="button"
                onClick={() => setStreakInputValue(prev => prev + 1)}
                className="w-12 h-12 rounded-2xl bg-[#F7FAF7] border border-[#E2EBE2] text-xl font-black hover:bg-[#E8F5E9] text-[#2E7D32] transition-colors"
                title="Increase by 1"
              >
                +
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <div className="text-[11px] font-bold text-[#839988] mb-2 uppercase tracking-wider">Quick Presets</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStreakInputValue(prev => prev + 1)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  +1 Day
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(7)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  7 Days (1 Wk)
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(14)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  14 Days
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(21)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  21 Days
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(30)}
                  className="text-xs py-2 px-2 bg-[#F7FAF7] border border-[#E2EBE2] rounded-xl font-semibold hover:bg-[#E8F5E9] text-[#4F6654]"
                >
                  30 Days
                </button>
                <button
                  type="button"
                  onClick={() => setStreakInputValue(0)}
                  className="text-xs py-2 px-2 bg-[#FFF3E0] border border-[#FFE0B2] text-[#E65100] rounded-xl font-semibold hover:bg-[#FFE0B2]"
                >
                  Reset (0)
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditingStreak(false)}
                className="w-1/2 py-2.5 border border-[#E2EBE2] rounded-xl font-bold text-xs text-[#4F6654] hover:bg-[#F7FAF7]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveStreak(streakInputValue)}
                className="w-1/2 py-2.5 bg-[#2E7D32] text-white rounded-xl font-bold text-xs hover:bg-[#256629] flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" /> Save Streak
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
