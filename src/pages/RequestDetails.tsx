import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, 
  Share2, 
  Printer, 
  User, 
  Home, 
  ClipboardCheck, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  FileText,
  Thermometer,
  Zap,
  Wind
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api';

export const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState({
    sqFt: true,
    matching: false,
    velocity: false
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await axios.get(`${API_BASE}/leads/${id}`);
        setLead(res.data);
        setNotes(res.data.internalNotes || '');
        if (res.data.verificationChecklist) {
            setChecklist({
                sqFt: res.data.verificationChecklist.sqFtVerified,
                matching: res.data.verificationChecklist.equipmentMatch,
                velocity: res.data.verificationChecklist.ductVelocityCheck
            });
        }
      } catch (err) {
        console.error('Error fetching lead:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await axios.patch(`${API_BASE}/leads/${id}`, { 
          status,
          internalNotes: notes,
          verificationChecklist: {
              sqFtVerified: checklist.sqFt,
              equipmentMatch: checklist.matching,
              ductVelocityCheck: checklist.velocity
          }
      });
      navigate('/requests');
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) return <div className="py-20 text-center text-xs font-black uppercase tracking-widest animate-pulse">Accessing Encrypted Records...</div>;
  if (!lead) return <div className="py-20 text-center text-xs font-black uppercase tracking-widest text-rose-500">Record Not Found</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-2">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Link to="/requests" className="hover:text-primary transition-colors">Requests</Link>
              <ChevronLeft size={12} className="rotate-180" />
              <span className="text-slate-600">REQ-{lead.requestId || lead._id.slice(-6)}</span>
           </div>
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Design Request Details</h2>
           <p className="text-sm font-bold text-slate-400">Submitted on {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} by {lead.name}</p>
        </div>
        <div className="flex items-center gap-4">
           <span className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm
              ${lead.status === 'New' ? 'bg-rose-50 text-rose-500' : 
                lead.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                'bg-slate-100 text-slate-600'}`}>
              {lead.status === 'New' ? 'PENDING REVIEW' : lead.status.toUpperCase()}
           </span>
           <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm">
              <Share2 size={18} />
           </button>
           <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-all shadow-sm">
              <Printer size={18} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Details Area */}
        <div className="xl:col-span-2 space-y-8">
           {/* Contact & Site Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[40px] border-l-4 border-l-primary shadow-sm space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-inner">
                       <User size={24} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Client Contact</h4>
                 </div>
                 <div className="space-y-4">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Primary Owner</p>
                       <p className="text-base font-black text-slate-900">{lead.name}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                       <p className="text-base font-bold text-slate-600">{lead.email}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                       <p className="text-base font-bold text-slate-600">{lead.phone || 'N/A'}</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 shadow-inner">
                       <Home size={24} />
                    </div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Property Site</h4>
                 </div>
                 <div className="space-y-4">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</p>
                       <p className="text-base font-black text-slate-900 leading-tight">{lead.propertySite?.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Type</p>
                          <p className="text-sm font-bold text-slate-600">{lead.propertySite?.propertyType}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Year Built</p>
                          <p className="text-sm font-bold text-slate-600">{lead.propertySite?.yearBuilt}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* System Design Requirements */}
           <div className="bg-slate-50 p-10 rounded-[48px] shadow-inner space-y-10">
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">System Design Requirements</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 <div>
                    <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Load Calculation</h5>
                    <p className="text-4xl font-black text-slate-900 mb-2">{lead.loadCalculation?.sqFt} <span className="text-sm text-slate-400 uppercase">sq. ft.</span></p>
                    <p className="text-xs font-bold text-slate-400">Total conditioned floor area including basement suite.</p>
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Manual J Focus</h5>
                    <p className="text-xl font-black text-slate-900 mb-2">{lead.loadCalculation?.focus}</p>
                    <p className="text-xs font-bold text-slate-400">Significant floor-to-ceiling glass on Western exposure.</p>
                 </div>
                 <div>
                    <h5 className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">Outdoor Design Temp</h5>
                    <p className="text-4xl font-black text-slate-900 mb-2">{lead.loadCalculation?.outdoorTemp}° <span className="text-sm text-slate-400 uppercase">Dry Bulb</span></p>
                    <p className="text-xs font-bold text-slate-400">Based on ASHRAE 1% Summer data for Austin area.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                 <div className="bg-white p-8 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3">
                       <Zap size={20} className="text-primary" />
                       <h6 className="text-[11px] font-black uppercase tracking-widest">Manual S Equipment Selection</h6>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Specified Brand</p>
                          <p className="text-sm font-bold text-slate-900">{lead.equipment?.brand}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Blower Motor</p>
                          <p className="text-sm font-bold text-slate-900">{lead.equipment?.blowerMotor}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stages</p>
                          <p className="text-sm font-bold text-slate-900">{lead.equipment?.stages}</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                       <Wind size={20} />
                       <h6 className="text-[11px] font-black uppercase tracking-widest">Manual D Duct System</h6>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Material Spec</p>
                          <p className="text-sm font-bold text-slate-900">{lead.ductSystem?.material}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Return Location</p>
                          <p className="text-sm font-bold text-slate-900">{lead.ductSystem?.returnLocation}</p>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Static Pressure</p>
                          <p className="text-sm font-bold text-slate-900">{lead.ductSystem?.staticPressure}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Site Image View */}
           <div className="relative rounded-[48px] overflow-hidden group shadow-2xl h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200" 
                alt="Site View" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Site Location View</p>
                 <h4 className="text-xl font-black tracking-tight">{lead.propertySite?.address}</h4>
              </div>
           </div>
        </div>

        {/* Sidebar Review Panel */}
        <div className="space-y-8">
           {/* Payment Status Card */}
           <div className={`p-8 rounded-[40px] border shadow-sm space-y-4 transition-all
              ${lead.paymentStatus === 'Paid' ? 'bg-emerald-50/50 border-emerald-100' : 
                lead.paymentStatus === 'Failed' ? 'bg-rose-50/50 border-rose-100' :
                'bg-amber-50/50 border-amber-100'}`}>
              <div className="flex items-center justify-between">
                 <h4 className={`text-[10px] font-black uppercase tracking-widest
                    ${lead.paymentStatus === 'Paid' ? 'text-emerald-600' : 
                      lead.paymentStatus === 'Failed' ? 'text-rose-600' :
                      'text-amber-600'}`}>Transaction Receipt</h4>
                 <div className={`w-2 h-2 rounded-full animate-pulse
                    ${lead.paymentStatus === 'Paid' ? 'bg-emerald-500' : 
                      lead.paymentStatus === 'Failed' ? 'bg-rose-500' :
                      'bg-amber-500'}`} />
              </div>
              <div className="flex flex-col gap-1">
                 <p className="text-2xl font-black text-slate-900">
                    {lead.amount ? `$${lead.amount.toLocaleString()}` : '$0.00'}
                 </p>
                 <span className={`text-[10px] font-black uppercase tracking-widest
                    ${lead.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {lead.paymentStatus === 'Paid' ? 'Verification Success' : `Status: ${lead.paymentStatus || 'Unpaid'}`}
                 </span>
              </div>
              {lead.stripeSessionId && (
                <div className="pt-4 border-t border-slate-200/50 space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stripe Reference</p>
                  <p className="text-[10px] font-mono text-slate-500 truncate">{lead.stripeSessionId}</p>
                  {lead.paymentStatus !== 'Paid' && (
                    <button 
                      onClick={async () => {
                        try {
                          const res = await axios.get(`${API_BASE}/payments/verify/${lead.stripeSessionId}`);
                          if (res.data.status === 'paid') {
                            setLead({...lead, paymentStatus: 'Paid'});
                            alert('✅ Payment verified successfully!');
                          } else {
                            alert(`Payment status: ${res.data.status}`);
                          }
                        } catch (err) {
                          alert('Could not verify payment.');
                        }
                      }}
                      className="w-full bg-emerald-500 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      ✓ Verify Payment with Stripe
                    </button>
                  )}
                </div>
              )}
              {!lead.stripeSessionId && (
                <div className="pt-4 border-t border-slate-200/50 flex gap-2">
                  <button 
                    onClick={async () => {
                      await axios.patch(`${API_BASE}/payments/${lead._id}/status`, { paymentStatus: 'Paid' });
                      setLead({...lead, paymentStatus: 'Paid'});
                    }}
                    className="flex-1 bg-emerald-50 text-emerald-600 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
                  >
                    Mark Paid
                  </button>
                  <button 
                    onClick={async () => {
                      await axios.patch(`${API_BASE}/payments/${lead._id}/status`, { paymentStatus: 'Failed' });
                      setLead({...lead, paymentStatus: 'Failed'});
                    }}
                    className="flex-1 bg-rose-50 text-rose-600 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
                  >
                    Mark Failed
                  </button>
                </div>
              )}
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm sticky top-24 space-y-8">
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Administrator Review</h4>
              
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Internal Notes & Feedback</p>
                 <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add specific feedback for the technician here..."
                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300 resize-none"
                 />
              </div>

              <div className="space-y-3">
                 <button 
                    onClick={() => updateStatus('Approved')}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                 >
                    <CheckCircle2 size={18} /> Approve Design
                 </button>
                 <button className="w-full bg-white border border-slate-200 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                    <AlertCircle size={18} /> Request Information
                 </button>
                 <button 
                    onClick={() => updateStatus('Rejected')}
                    className="w-full bg-rose-50 text-rose-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-rose-100 transition-all"
                 >
                    <XCircle size={18} /> Reject Request
                 </button>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-6">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Verification Checklist</p>
                 <div className="space-y-4">
                    {[
                       { id: 'sqFt', label: 'Square Footage Verified', desc: 'Cross-checked with tax records.', checked: checklist.sqFt },
                       { id: 'matching', label: 'Equipment Match (Manual S)', desc: 'Validated staging against load.', checked: checklist.matching },
                       { id: 'velocity', label: 'Duct Velocity Check', desc: 'Ensuring quiet operation below 700 FPM.', checked: checklist.velocity },
                    ].map(item => (
                       <label key={item.id} className="flex items-start gap-4 cursor-pointer group">
                          <input 
                             type="checkbox" 
                             checked={item.checked} 
                             onChange={(e) => setChecklist({...checklist, [item.id]: e.target.checked})}
                             className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all"
                          />
                          <div className="flex-1">
                             <p className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors">{item.label}</p>
                             <p className="text-[10px] font-bold text-slate-400">{item.desc}</p>
                          </div>
                       </label>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Persistence Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 py-4 px-10 z-30 flex items-center justify-between">
         <div className="flex gap-8">
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><FileText size={14} /> History Logs</span>
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><ShieldCheck size={14} className="text-emerald-500" /> Encrypted Transmission</span>
            <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest"><FileText size={14} /> HVAC Compliance PDF</span>
         </div>
         <span className="text-[10px] font-bold text-slate-300 tracking-tight">&copy; 2026 RightCheck Systems Inc. Internal Administrative Console.</span>
      </footer>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
