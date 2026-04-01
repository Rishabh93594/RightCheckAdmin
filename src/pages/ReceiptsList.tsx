import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Receipt,
  ArrowUpRight,
  ChevronRightIcon,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api';

export const ReceiptsList = () => {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/payments/receipts`);
        setReceipts(res.data);
      } catch (err) {
        console.error('Error fetching receipts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  const filteredReceipts = receipts.filter(r => {
    return r.name.toLowerCase().includes(search.toLowerCase()) || 
           (r.stripeSessionId && r.stripeSessionId.toLowerCase().includes(search.toLowerCase())) ||
           (r.requestId && r.requestId.toLowerCase().includes(search.toLowerCase()));
  });

  const totalRevenue = receipts.reduce((sum, r) => r.paymentStatus === 'Paid' ? sum + (r.amount || 0) : sum, 0);
  const paidCount = receipts.filter(r => r.paymentStatus === 'Paid').length;

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Payment Receipts</h2>
           <p className="text-sm font-bold text-slate-400">View and manage all transaction receipts from Stripe.</p>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Verified Revenue</h4>
            <div className="flex items-end gap-3">
               <h3 className="text-4xl font-black text-emerald-600 leading-none">${totalRevenue.toLocaleString()}</h3>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Successful Transactions</h4>
            <h3 className="text-4xl font-black text-slate-900 leading-none">{paidCount}</h3>
         </div>
      </div>

      {/* Filters & Table Section */}
      <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-white/50 border-b border-slate-100">
            <div className="relative w-full xl:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Search Reference, Request ID or Client..." 
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
                     <th className="px-8 py-6">Transaction / Request ID</th>
                     <th className="px-8 py-6">Client Info</th>
                     <th className="px-8 py-6">Service Type</th>
                     <th className="px-8 py-6">Date</th>
                     <th className="px-8 py-6">Amount</th>
                     <th className="px-8 py-6">Status</th>
                     <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                     <tr><td colSpan={7} className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Receipts...</td></tr>
                  ) : filteredReceipts.length === 0 ? (
                     <tr><td colSpan={7} className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No matching receipts found</td></tr>
                  ) : filteredReceipts.map((receipt, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      key={receipt._id || idx} 
                      className="hover:bg-slate-50 transition-colors group"
                    >
                       <td className="px-8 py-7">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">{receipt.stripeSessionId}</span>
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest font-mono">#{receipt.requestId}</span>
                          </div>
                       </td>
                       <td className="px-8 py-7 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-primary text-[10px] uppercase">{receipt.name.charAt(0)}{receipt.name.split(' ')[1]?.charAt(0) || ''}</div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900">{receipt.name}</span>
                            <span className="text-[10px] font-bold text-slate-500">{receipt.email}</span>
                          </div>
                       </td>
                       <td className="px-8 py-7">
                          <div className="bg-slate-50 px-3 py-1.5 border border-slate-100 rounded-xl inline-block">
                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{receipt.service}</p>
                          </div>
                       </td>
                       <td className="px-8 py-7 text-xs font-bold text-slate-400 tracking-tight">
                          {new Date(receipt.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </td>
                       <td className="px-8 py-7">
                          <span className="text-sm font-black text-slate-900">${receipt.amount}</span>
                       </td>
                       <td className="px-8 py-7">
                          <div className="flex items-center gap-2">
                            {receipt.paymentStatus === 'Paid' ? (
                               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                  <CheckCircle2 size={12} /> Paid
                               </div>
                            ) : receipt.paymentStatus === 'Failed' ? (
                               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                  <XCircle size={12} /> Failed
                               </div>
                            ) : (
                               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                  Pending
                               </div>
                            )}
                          </div>
                       </td>
                       <td className="px-8 py-7 text-right">
                          <Link to={`/requests/${receipt._id}`} className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform ml-auto justify-end">View Request <ChevronRightIcon size={14} /></Link>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
