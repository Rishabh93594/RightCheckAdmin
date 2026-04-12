import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../assets/RightCheck.png";

const sidebarLinks = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/" },
  { icon: <FileText size={20} />, label: "Requests", href: "/requests" },
  { icon: <Users size={20} />, label: "Users", href: "/users" },
  { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
];

interface DashboardLayoutProps {
  onLogout: () => void;
}

export const DashboardLayout = ({ onLogout }: DashboardLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen z-30">
        <div className="p-4 border-b border-slate-100 mb-2">
          <Link to="/" className="flex items-center h-12 overflow-hidden -ml-2">
            <img src={Logo} alt="RightCheck Logo" className="w-56 max-w-none h-auto object-contain" />
          </Link>
          <div className="mt-4 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HVAC Control Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.icon}
                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-4">
          <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:bg-primary/90 transition-all">
            <Plus size={18} /> New Report
          </button>
          <div className="flex flex-col gap-2 pt-2">
            <button className="flex items-center gap-3 text-sm text-slate-400 hover:text-slate-600 transition-colors px-4">
              <HelpCircle size={18} /> Support
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 text-sm text-slate-400 hover:text-rose-600 transition-colors px-4"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>
          <div className="pt-4 px-4 border-t border-slate-50">
             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                Designed & Developed by<br/>
                <a href="https://kyptronix.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Kyptronix LLP</a>
             </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-500"><Menu size={24} /></button>
            <div className="h-8 overflow-hidden flex items-center">
               <img src={Logo} alt="RightCheck Logo" className="w-32 max-w-none h-auto object-contain" />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
             <div className="h-10 w-px bg-slate-100" />
             <div className="flex gap-6 overflow-hidden">
                {sidebarLinks.map(link => (
                   <Link 
                    key={link.label} 
                    to={link.href}
                    className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === link.href ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                      {link.label}
                   </Link>
                ))}
             </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="p-2 text-slate-400 hover:text-primary transition-colors"><HelpCircle size={20} /></button>
            <div className="h-8 w-px bg-slate-100" />
            <div 
              onClick={onLogout}
              className="flex items-center gap-3 hover:bg-rose-50 p-1 rounded-lg cursor-pointer transition-colors group"
            >
               <span className="text-xs font-black text-slate-900 hidden sm:block whitespace-nowrap group-hover:text-rose-600 transition-colors">Sign Out</span>
               <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center bg-slate-100 group-hover:border-rose-100">
                  <LogOut size={16} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
               </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto w-full">
           <div className="p-6 lg:p-10 max-w-7xl mx-auto">
              <Outlet />
           </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsMobileMenuOpen(false)}
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
               initial={{ x: "-100%" }}
               animate={{ x: 0 }}
               exit={{ x: "-100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden shadow-2xl flex flex-col pt-6"
            >
               <div className="flex items-center justify-between px-6 mb-8">
                  <div className="h-10 overflow-hidden flex items-center -ml-2">
                     <img src={Logo} alt="RightCheck Logo" className="w-40 max-w-none h-auto object-contain" />
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
               </div>
               <nav className="flex-1 px-4 space-y-1">
                  {sidebarLinks.map((link) => {
                    const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.label}
                        to={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                          isActive 
                            ? "bg-primary text-white shadow-lg" 
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {link.icon}
                        <span className="text-[15px] font-semibold">{link.label}</span>
                      </Link>
                    );
                  })}
               </nav>
               <div className="p-6 border-t border-slate-100 flex flex-col gap-4">
                  <button 
                    onClick={onLogout}
                    className="flex items-center gap-3 text-rose-500 text-sm font-black uppercase tracking-widest hover:opacity-80 transition-all"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
