import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ArrowUpRight,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1284 },
];

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api';

export const Dashboard = () => {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get(`${API_BASE}/leads`);
        setLeads(res.data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        // Fetch complete
      }
    };
    fetchLeads();
  }, []);

  const stats = [
    { label: 'Total Volume', value: leads.length, change: 'Tracking in Real-Time', icon: <Users size={20} />, color: 'blue' },
    { label: 'Pending Approval', value: leads.filter(l => l.status === 'New').length, change: 'Action Required', icon: <Clock size={20} />, color: 'rose' },
    { label: 'Approved Requests', value: leads.filter(l => l.status === 'Approved').length, change: 'Avg. Completion', icon: <CheckCircle2 size={20} />, color: 'emerald' },
    { label: 'Critical Requests', value: leads.filter(l => l.status === 'New').length > 5 ? 'High' : leads.filter(l => l.status === 'New').length, change: 'Immediate Attention', icon: <AlertCircle size={20} />, color: 'amber' },
  ];

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-[28px] font-black text-slate-900 tracking-tight mb-2">System Overview</h2>
           <p className="text-sm font-bold text-slate-400">Real-time performance and request metrics for RightCheck HVAC network.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-black text-slate-900 uppercase">Operational</span>
              </div>
           </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={s.label}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${s.color}-50/50 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700`} />
            <div className="flex items-center gap-4 mb-4 relative z-10">
               <div className={`w-12 h-12 rounded-2xl bg-${s.color === 'emerald' ? 'emerald' : s.color === 'rose' ? 'rose' : s.color === 'amber' ? 'amber' : 'blue'}-50 flex items-center justify-center text-${s.color === 'emerald' ? 'emerald' : s.color === 'rose' ? 'rose' : s.color === 'amber' ? 'amber' : 'blue'}-600 group-hover:scale-110 transition-transform duration-500`}>
                  {s.icon}
               </div>
               <div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-0.5">{s.label}</h4>
                  <p className="text-sm font-bold text-slate-400">{s.change}</p>
               </div>
            </div>
            <div className="flex items-end justify-between relative z-10">
               <h3 className="text-4xl font-black text-slate-900 tracking-tight">{s.value}</h3>
               <ArrowUpRight size={20} className="text-slate-200 group-hover:text-primary transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="xl:col-span-2 bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8 px-2">
              <div>
                 <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">Request Volume Trends</h4>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly performance delta</p>
              </div>
              <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                 <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white shadow-sm text-slate-900 transition-all">Monthly</button>
                 <button className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Quarterly</button>
              </div>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data}>
                    <defs>
                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(221 83% 53%)" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="hsl(221 83% 53%)" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} 
                       dy={10}
                    />
                    <YAxis 
                       hide 
                    />
                    <Tooltip 
                       contentStyle={{ 
                          backgroundColor: '#fff', 
                          borderRadius: '16px', 
                          border: '1px solid #f1f5f9', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold'
                       }} 
                    />
                    <Area 
                       type="monotone" 
                       dataKey="value" 
                       stroke="hsl(221 83% 53%)" 
                       strokeWidth={4}
                       fillOpacity={1} 
                       fill="url(#colorValue)" 
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Pulse Card */}
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm flex flex-col justify-between group overflow-hidden relative">
           <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
           <div className="relative z-10 transition-colors duration-500 group-hover:text-white">
              <h4 className="text-xl font-black tracking-tight mb-6">Efficiency Pulse</h4>
              <div className="space-y-6">
                 {[
                    { label: 'Auto-Approval Rate', value: 82, color: 'primary' },
                    { label: 'Manual Review Latency', value: 14, color: 'emerald' },
                    { label: 'Network Saturation', value: 65, color: 'amber' },
                 ].map(m => (
                    <div key={m.label} className="space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{m.label}</span>
                          <span className="text-sm font-black tracking-widest">{m.value}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${m.value}%` }}
                             transition={{ duration: 1, delay: 0.5 }}
                             className={`h-full bg-${m.color === 'primary' ? 'primary' : m.color === 'emerald' ? 'emerald-500' : 'amber-500'}`} 
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           <div className="relative z-10 mt-10 p-6 bg-slate-50 rounded-3xl group-hover:bg-slate-800 transition-colors group-hover:border group-hover:border-white/10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-inner group-hover:bg-slate-700">
                    <Zap size={24} className="text-primary" />
                 </div>
                 <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-1">Performance Hub</p>
                    <button className="text-[11px] font-black text-primary group-hover:text-white uppercase flex items-center gap-2">Launch Diagnostics <ArrowUpRight size={14} /></button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
               <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">Recent Service Requests</h4>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active queue from RightCheck network</p>
            </div>
            <Link to="/requests" className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">View All Requests <ChevronRight size={18} /></Link>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                     <th className="px-8 py-5">ID</th>
                     <th className="px-8 py-5">Client / Facility</th>
                     <th className="px-8 py-5">Service Level</th>
                     <th className="px-8 py-5 text-center">Lifecycle</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {leads.slice(0, 5).map((lead, idx) => (
                    <tr key={lead._id || idx} className="hover:bg-slate-50 transition-colors group">
                       <td className="px-8 py-6">
                          <span className="text-[11px] font-black text-primary uppercase tracking-widest">{lead.requestId || `#${idx+1000}`}</span>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-sm font-black text-slate-900 mb-1">{lead.name}</p>
                          <p className="text-xs font-bold text-slate-400 tracking-tight">{lead.propertySite?.address || 'Site data pending'}</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className="bg-slate-50 px-3 py-1.5 border border-slate-100 rounded-xl inline-block">
                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{lead.service || lead.projectType}</p>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                             ${lead.status === 'New' ? 'bg-rose-50 text-rose-600' : 
                               lead.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                               'bg-slate-100 text-slate-600'}`}>
                             {lead.status === 'New' ? 'Pending' : lead.status}
                          </span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <Link to={`/requests/${lead._id}`} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-primary transition-all shadow-sm hover:shadow-md inline-block"><ChevronRight size={18} /></Link>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
