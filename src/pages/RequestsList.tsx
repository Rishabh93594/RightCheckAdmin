import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowUpRight,
  ChevronLeft,
  ChevronRightIcon,
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api';

export const RequestsList = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(`${API_BASE}/leads`);
        setLeads(res.data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(l => {
    const matchesStatus = 
       activeFilter === 'All' || 
       (activeFilter === 'Pending' && (l.status === 'New' || l.status === 'Pending')) ||
       l.status === activeFilter;
    const matchesSearch = 
       l.requestId?.toLowerCase().includes(search.toLowerCase()) || 
       l.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: leads.length,
    pending: leads.filter(l => l.status === 'New' || l.status === 'Pending').length,
    avgTime: leads.length > 0 ? "..." : "0" // Will calculate when timestamps exist
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Service Requests</h2>
           <p className="text-sm font-bold text-slate-400">Monitor and manage HVAC design calculation requests across the network.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
           <button className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 transition-all">Active</button>
           <button className="px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Archived</button>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between border-l-4 border-l-primary">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Volume</h4>
            <div className="flex items-end gap-3">
               <h3 className="text-4xl font-black text-slate-900 leading-none">{stats.total}</h3>
               <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1.5 flex items-center gap-1"><ArrowUpRight size={14} /> Tracking in Real-Time</span>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending</h4>
            <h3 className="text-4xl font-black text-rose-500 leading-none">{stats.pending}</h3>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg. Completion</h4>
            <h3 className="text-4xl font-black text-slate-900 leading-none">{stats.avgTime} <span className="text-lg font-black opacity-30">hrs</span></h3>
         </div>
      </div>

      {/* Filters & Table Section */}
      <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/50 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl overflow-x-auto scrollbar-none">
               {['All Requests', 'Pending', 'Approved', 'Rejected'].map(filter => (
                  <button 
                    key={filter} 
                    onClick={() => setActiveFilter(filter === 'All Requests' ? 'All' : filter)}
                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                       ${(activeFilter === 'All' && filter === 'All Requests') || activeFilter === filter 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'text-slate-500 hover:text-slate-900 hover:underline'}`}
                  >
                     {filter}
                  </button>
               ))}
            </div>
            <div className="relative w-full xl:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search Request ID or Client..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/10 transition-all"
               />
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                     <th className="px-8 py-6">Request ID</th>
                     <th className="px-8 py-6">Client Name</th>
                     <th className="px-8 py-6">Service Type</th>
                     <th className="px-8 py-6">Date Submitted</th>
                     <th className="px-8 py-6">Status</th>
                     <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                     <tr><td colSpan={6} className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Services Engine...</td></tr>
                  ) : filteredLeads.length === 0 ? (
                     <tr><td colSpan={6} className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No matching requests found</td></tr>
                  ) : filteredLeads.map((lead, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={lead._id || idx} 
                      className="hover:bg-slate-50 transition-colors group"
                    >
                       <td className="px-8 py-7">
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest font-mono">#{lead.requestId || `HV-${1000+idx}`}</span>
                       </td>
                       <td className="px-8 py-7 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-primary text-[10px] uppercase">{lead.name.charAt(0)}{lead.name.split(' ')[1]?.charAt(0)}</div>
                          <span className="text-sm font-black text-slate-900">{lead.name}</span>
                       </td>
                       <td className="px-8 py-7">
                          <div className="bg-slate-50 px-3 py-1.5 border border-slate-100 rounded-xl inline-block">
                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{lead.service || lead.projectType}</p>
                          </div>
                       </td>
                       <td className="px-8 py-7 text-xs font-bold text-slate-400 tracking-tight">
                          {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </td>
                       <td className="px-8 py-7 flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                ${lead.status === 'New' ? 'bg-rose-50 text-rose-600' : 
                                  lead.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                                  'bg-slate-100 text-slate-600'}`}>
                                {lead.status === 'New' ? 'Pending' : lead.status}
                             </span>
                             {lead.paymentStatus === 'Paid' && (
                               <div className="p-1 bg-emerald-500 text-white rounded shadow-sm">
                                  <CheckCircle2 size={10} strokeWidth={3} />
                               </div>
                             )}
                          </div>
                          {lead.paymentStatus === 'Paid' && (
                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none pl-1">Paid ${lead.amount}</p>
                          )}
                       </td>
                       <td className="px-8 py-7 text-right">
                          <Link to={`/requests/${lead._id}`} className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform ml-auto justify-end">View Details <ChevronRightIcon size={14} /></Link>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="p-8 flex items-center justify-between bg-slate-50 border-t border-slate-100">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing {filteredLeads.length} of {leads.length} requests</span>
             <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-slate-600 shadow-sm"><ChevronLeft size={18} /></button>
                <button className="w-10 h-10 rounded-xl bg-primary text-white font-black text-xs flex items-center justify-center shadow-lg shadow-primary/20">1</button>
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs flex items-center justify-center hover:bg-slate-50 transition-colors">2</button>
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs flex items-center justify-center hover:bg-slate-50 transition-colors">3</button>
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-slate-600 shadow-sm"><ChevronRightIcon size={18} /></button>
             </div>
         </div>
      </div>

      {/* Bottom Promo Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
         <div className="bg-[#f0f9ff] rounded-[48px] p-10 flex flex-col md:flex-row items-center gap-10 group overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-600 translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out z-0" />
            <div className="flex-1 space-y-6 relative z-10 group-hover:text-white transition-colors">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Request Distribution</h4>
               <div className="space-y-4">
                  {[
                     { label: 'Manual J', value: 65, color: 'blue-600' },
                     { label: 'Manual D', value: 20, color: 'blue-500' },
                     { label: 'Manual S', value: 15, color: 'rose-500' },
                  ].map(item => (
                     <div key={item.label} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                         </div>
                         <div className="h-2 w-full bg-slate-900/10 rounded-full group-hover:bg-white/20">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} className={`h-full bg-primary rounded-full group-hover:bg-white`} />
                         </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 transition-transform duration-500 overflow-hidden border-8 border-slate-50 group-hover:border-white/10">
                <FileText size={48} className="text-primary group-hover:scale-125 transition-transform" />
            </div>
         </div>

         <div className="bg-slate-100 rounded-[48px] p-10 flex flex-col md:flex-row items-center gap-10 group overflow-hidden relative">
            <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out z-0" />
            <div className="flex-1 space-y-4 relative z-10 group-hover:text-white transition-colors">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Spotlight</h4>
               <h3 className="text-3xl font-black tracking-tight leading-none group-hover:scale-105 transition-transform">System Performance Hub</h3>
               <p className="text-xs font-bold text-slate-400 group-hover:text-slate-300">Access advanced diagnostics and technical documentation for all project calculations.</p>
               <button className="px-8 py-3.5 bg-white text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:scale-105 transition-all group-hover:bg-primary group-hover:text-white">Launch Diagnostics</button>
            </div>
            <div className="w-48 h-48 bg-white/40 rounded-full backdrop-blur-xl relative z-10 border border-white/50 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
               <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-50 group-hover:border-primary">
                  <LayoutDashboard size={40} className="text-slate-200 group-hover:text-primary transition-colors" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
