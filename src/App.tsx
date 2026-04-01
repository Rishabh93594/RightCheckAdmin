import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Lock, 
  User, 
} from 'lucide-react';
import { motion } from 'framer-motion';

// Layout & Pages
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { RequestsList } from './pages/RequestsList';
import { RequestDetails } from './pages/RequestDetails';
import { UsersList } from './pages/UsersList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Login credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-2xl">
            {/* Header / Logo Section */}
            <div className="p-10 pb-6 text-center border-b border-slate-50">
              <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-white font-bold text-2xl">RC</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">RightCheck Admin</h1>
              <p className="text-sm text-slate-500">Log in to manage your system</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="p-10 pt-8 space-y-6">
              {loginError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm py-3 px-4 rounded-xl flex items-center justify-center font-medium">
                  {loginError}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Enter username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 pl-12 pr-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" />
                  <input 
                    type="password" 
                    placeholder="Enter password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 pl-12 pr-4 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-white h-12 rounded-xl font-bold text-sm hover:translate-y-[-1px] transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 mt-4"
              >
                Sign In
              </button>

              <div className="pt-2 text-center">
                <button type="button" className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">Forgot Password?</button>
              </div>
            </form>
          </div>
          <p className="mt-8 text-center text-xs text-slate-400 font-medium">Authorized Personnel Only &copy; 2026</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout onLogout={() => setIsLoggedIn(false)} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requests" element={<RequestsList />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/settings" element={<div className="p-10 text-xl font-black text-slate-300 uppercase tracking-widest">Management Core v1.0.4</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
