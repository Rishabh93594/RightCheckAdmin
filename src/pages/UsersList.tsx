import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  ShieldCheck,
  Building,
  Mail,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api';

export const UsersList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users`);
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
       u.name.toLowerCase().includes(search.toLowerCase()) || 
       u.email.toLowerCase().includes(search.toLowerCase()) ||
       u.company?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    contractors: users.filter(u => u.role?.toLowerCase().includes('contractor')).length,
    clients: users.filter(u => u.role?.toLowerCase().includes('client')).length
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
         <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">User Management</h2>
         <p className="text-sm font-bold text-slate-400">Manage and audit HVAC contractors and client accounts across the platform.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Platform Saturation</h4>
            <div className="flex items-end gap-3 mb-6">
               <h3 className="text-4xl font-black text-slate-900 leading-none">{stats.total}</h3>
               <span className="text-sm font-black text-slate-400">Active Users</span>
            </div>
            <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contractors</p>
                  <p className="text-xl font-black text-slate-900">{stats.contractors}</p>
               </div>
               <div className="h-8 w-px bg-slate-100" />
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clients</p>
                  <p className="text-xl font-black text-slate-900">{stats.clients}</p>
               </div>
            </div>
         </div>

         <div className="xl:col-span-2 bg-primary p-8 rounded-[40px] shadow-xl shadow-primary/20 flex flex-col md:flex-row items-center gap-10 group overflow-hidden relative">
            <div className="absolute inset-0 bg-slate-900 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out z-0" />
            <div className="flex-1 space-y-4 relative z-10 text-white">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Health</p>
               <h3 className="text-3xl font-black tracking-tight leading-none">Verification Queue</h3>
               <p className="text-sm font-bold opacity-70">Awaiting document review and T3 security clearance.</p>
               <button className="px-8 py-3.5 bg-white text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-105 transition-all">Review Queue</button>
            </div>
            <div className="w-48 h-48 rounded-full border-8 border-white/10 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
               <ShieldCheck size={64} className="text-white opacity-20" />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 rounded-full border-2 border-dashed border-white/20" 
               />
            </div>
         </div>
      </div>

      {/* User Table Section */}
      <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 border-b border-slate-50 overflow-x-auto scrollbar-none">
            <div className="relative w-full xl:w-96">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search accounts..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-[#f8fafc] border border-slate-200 rounded-3xl py-4 pl-14 pr-6 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/10 transition-all"
               />
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all font-mono"><Filter size={16} /> Filter Accounts</button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-10 py-6">Name</th>
                     <th className="px-10 py-6">Company</th>
                     <th className="px-10 py-6">Email Address</th>
                     <th className="px-10 py-6">Total Requests</th>
                     <th className="px-10 py-6">Status</th>
                     <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan={6} className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Fetching Verified Registry...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No active accounts found</td></tr>
                  ) : filteredUsers.map((user, idx) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                       <td className="px-10 py-7 flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-2xl bg-${user.color || 'blue'}-50 border border-${user.color || 'blue'}-100 flex items-center justify-center font-black text-xs text-${user.color || 'blue'}-600 uppercase shadow-inner`}>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</div>
                          <div>
                             <p className="text-sm font-black text-slate-900 tracking-tight">{user.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                          </div>
                       </td>
                       <td className="px-10 py-7 text-xs font-black text-slate-900 uppercase tracking-widest opacity-60"><Building size={14} className="inline mr-2" /> {user.company || 'Private'}</td>
                       <td className="px-10 py-7 text-xs font-bold text-slate-400 tracking-tight">{user.email}</td>
                       <td className="px-10 py-7">
                          <div className="flex items-center gap-4">
                             <span className="text-xs font-black text-slate-900 w-8">{user.requests || 0}</span>
                             <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${((user.requests || 0)/300)*100}%` }} className="h-full bg-primary rounded-full transition-all" />
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-7">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                             ${user.status === 'Active' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                             {user.status || 'Active'}
                          </span>
                       </td>
                       <td className="px-10 py-7 text-right">
                          <button className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-primary transition-all shadow-sm"><MoreHorizontal size={18} /></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-8 flex items-center justify-between bg-slate-50 border-t border-slate-50">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredUsers.length} of {users.length} accounts</span>
             <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-slate-600 shadow-sm"><ChevronLeft size={18} /></button>
                <button className="w-10 h-10 rounded-xl bg-primary text-white font-black text-xs flex items-center justify-center shadow-lg shadow-primary/20">1</button>
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs flex items-center justify-center hover:bg-slate-50 transition-colors">2</button>
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs flex items-center justify-center hover:bg-slate-50 transition-colors">3</button>
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-slate-600 shadow-sm"><ChevronRight size={18} /></button>
             </div>
         </div>
      </div>

      {/* Promo Row Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-white rounded-[48px] border border-slate-100 overflow-hidden shadow-sm flex flex-col md:flex-row group transition-all hover:shadow-2xl">
            <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
               <img src="https://images.unsplash.com/photo-1541888941255-081d746fd80d?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Tech" />
            </div>
            <div className="p-10 flex-1 space-y-4">
               <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">System Spotlight</h4>
               <h3 className="text-2xl font-black tracking-tight text-slate-900 leading-none">Verification Excellence</h3>
               <p className="text-xs font-bold text-slate-400 leading-relaxed">Our new automated credential checking system has reduced contractor onboarding time while increasing compliance accuracy.</p>
               <button className="text-[10px] font-black text-primary uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform tracking-widest">Review Security Protocols <ChevronRight size={14} /></button>
            </div>
         </div>
         <div className="bg-white rounded-[48px] border border-slate-100 overflow-hidden shadow-sm p-10 space-y-6 group hover:translate-y-[-10px] transition-all duration-500">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Account Retention</h4>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 leading-none">Activity Monitoring</h3>
            <p className="text-xs font-bold text-slate-400">High-volume activity across the platform is monitored to ensure quality and compliance for all HVAC designs.</p>
            <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 overflow-hidden">
                         <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full object-cover" />
                      </div>
                   ))}
                   <div className="w-10 h-10 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-[10px] font-black">+{users.length}</div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-100 pl-6">Active Platform Users</p>
            </div>
         </div>
      </div>
    </div>
  );
};
