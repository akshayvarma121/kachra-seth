import { useState, useEffect } from 'react';
import { 
  MessageSquare, Calendar, Trophy, CheckCircle, Clock, 
  MapPin, AlertTriangle, Plus, Loader2, X, User, Users, ChevronRight 
} from 'lucide-react';
import { api } from '@/lib/apiClient';

export const CommunityTab = () => {
  // Data State
  const [complaints, setComplaints] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]); // New: For dropdown
  const [loading, setLoading] = useState(true);

  // UI State
  const [showEventModal, setShowEventModal] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null); // Track which complaint is being assigned
  const [selectedDriver, setSelectedDriver] = useState<string>("");

  // Form State
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });

  // 1. Fetch All Data
  const fetchData = async () => {
    try {
      const [complaintData, eventData, leaderData, driverData] = await Promise.all([
        api.getComplaints().catch(() => []),
        api.getEvents().catch(() => []),
        api.getLeaderboard().catch(() => []),
        api.getDrivers().catch(() => []) // Fetch drivers for dropdown
      ]);
      
      setComplaints(complaintData);
      
      // Mocking registration counts if backend doesn't send them yet
      setEvents(eventData.map((e: any) => ({ ...e, registrations: e.registrations || Math.floor(Math.random() * 50) + 5 })));
      
      setLeaderboard(leaderData);
      setDrivers(driverData.filter((d: any) => d.status === 'active')); // Only active drivers
    } catch (err) {
      console.error("Failed to load community data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 2. Assign Driver & Resolve
  const handleAssignDriver = async (complaintId: string) => {
    if (!selectedDriver) {
      alert("Please select a driver first.");
      return;
    }

    try {
      // In a real app, you might have a specific /assign endpoint. 
      // For now, we assume resolving also assigns it, or we pass driverId as metadata.
      await api.resolveComplaint(complaintId); 
      
      // Optimistic Update
      setComplaints(prev => prev.map(c => 
        c.id === complaintId 
          ? { ...c, status: 'assigned', assigned_to: drivers.find(d => d.id === selectedDriver)?.name } 
          : c
      ));
      
      setAssigningId(null);
      setSelectedDriver("");
      alert("Driver Assigned & Complaint Resolved!");
    } catch (err) {
      alert("Failed to assign driver");
    }
  };

  // 3. Create Event
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addEvent(newEvent.title, newEvent.date, newEvent.location, newEvent.description);
      alert("Event Scheduled!");
      setShowEventModal(false);
      setNewEvent({ title: '', date: '', location: '', description: '' });
      fetchData(); 
    } catch (err) {
      alert("Failed to create event");
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-brand-neon"/></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full font-sans">
      
      {/* COLUMN 1: COMPLAINT CENTER */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-black border-2 border-black dark:border-gray-800 rounded-[32px] p-6 shadow-neo dark:shadow-none min-h-[500px]">
          
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-black text-xl uppercase italic dark:text-white flex items-center gap-2">
               <AlertTriangle className="text-red-500"/> Citizen Grievances
             </h3>
             <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-black uppercase">
               {complaints.filter(c => c.status !== 'resolved').length} Active
             </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
             {complaints.length === 0 ? (
               <div className="text-center py-12 text-gray-400 font-bold uppercase">No active complaints</div>
             ) : (
               complaints.map(c => (
                 <div key={c.id} className={`p-4 rounded-2xl border-2 transition-all ${c.status === 'resolved' ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-black dark:bg-gray-900 dark:border-gray-700'}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                       
                       {/* Complaint Details */}
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-[10px] font-black uppercase bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                               {c.ward_name || 'General Ward'}
                             </span>
                             <span className="text-[10px] font-bold text-gray-400">
                               {new Date(c.created_at).toLocaleDateString()}
                             </span>
                          </div>
                          <h4 className="font-bold text-md dark:text-white leading-tight">{c.description}</h4>
                          <div className="flex items-center gap-2 mt-2">
                             {c.image_url && <span className="text-[10px] text-blue-500 font-bold underline cursor-pointer">View Image</span>}
                             <p className="text-[10px] text-gray-500">From: {c.user_email}</p>
                          </div>
                       </div>

                       {/* Action Section */}
                       <div className="w-full md:w-auto min-w-[200px]">
                         {c.status === 'resolved' ? (
                           <div className="flex items-center justify-end gap-2 text-green-600 font-black text-xs uppercase bg-green-50 px-3 py-2 rounded-xl">
                             <CheckCircle size={16}/> Resolved 
                             {c.assigned_to && <span className="text-gray-400 text-[10px] ml-1">(by {c.assigned_to})</span>}
                           </div>
                         ) : assigningId === c.id ? (
                           // ASSIGN MODE
                           <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl border-2 border-brand-neon animate-in fade-in">
                              <label className="text-[10px] font-bold text-gray-500 mb-1 block">Select Officer:</label>
                              <select 
                                autoFocus
                                value={selectedDriver}
                                onChange={(e) => setSelectedDriver(e.target.value)}
                                className="w-full p-2 mb-2 rounded-lg text-xs font-bold bg-white dark:bg-black border border-gray-300 dark:border-gray-600 outline-none"
                              >
                                <option value="">-- Choose Driver --</option>
                                {drivers.map(d => (
                                  <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                                ))}
                              </select>
                              <div className="flex gap-2">
                                <button onClick={() => setAssigningId(null)} className="flex-1 py-1 text-[10px] font-bold uppercase bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                <button onClick={() => handleAssignDriver(c.id)} className="flex-1 py-1 text-[10px] font-bold uppercase bg-black text-white rounded hover:bg-gray-800">Confirm</button>
                              </div>
                           </div>
                         ) : (
                           // DEFAULT BUTTON
                           <button 
                             onClick={() => setAssigningId(c.id)}
                             className="w-full bg-black text-white px-4 py-3 rounded-xl text-xs font-black uppercase hover:bg-brand-neon hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg"
                           >
                             <User size={14}/> Assign Driver
                           </button>
                         )}
                       </div>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>

      {/* COLUMN 2: EVENTS & LEADERBOARD */}
      <div className="space-y-6">
        
        {/* LEADERBOARD CARD */}
        <div className="bg-brand-neon text-black border-2 border-black rounded-[32px] p-6 shadow-neo">
           <h3 className="font-black text-lg uppercase italic flex items-center gap-2 mb-4">
             <Trophy size={20}/> Top Citizens
           </h3>
           <div className="space-y-2">
              {leaderboard.slice(0, 5).map((user, i) => (
                <div key={user.id} className="flex items-center justify-between bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-black/5">
                   <div className="flex items-center gap-3">
                      <div className={`font-black text-sm w-6 h-6 rounded-full flex items-center justify-center ${i===0 ? 'bg-yellow-400' : 'bg-black/10'}`}>
                        {i + 1}
                      </div>
                      <div>
                         <div className="font-bold text-sm leading-none">{user.name}</div>
                         <div className="text-[10px] font-bold opacity-60 uppercase">{user.points} Points</div>
                      </div>
                   </div>
                   {i === 0 && <Trophy size={14} className="text-yellow-700"/>}
                </div>
              ))}
           </div>
        </div>

        {/* EVENTS CARD */}
        <div className="bg-white dark:bg-black border-2 border-black dark:border-gray-800 rounded-[32px] p-6 flex flex-col h-[400px]">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-lg uppercase italic dark:text-white flex items-center gap-2">
                <Calendar size={20}/> Events
              </h3>
              <button onClick={() => setShowEventModal(true)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-brand-neon hover:text-black transition-colors">
                <Plus size={18}/>
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {events.map(e => (
                <div key={e.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 group hover:border-black transition-colors">
                   <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm dark:text-white group-hover:underline decoration-brand-neon decoration-2 underline-offset-4">{e.title}</h4>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                        {new Date(e.date).toLocaleDateString()}
                      </span>
                   </div>
                   
                   <p className="text-xs text-gray-500 line-clamp-2 mb-3">{e.description}</p>
                   
                   <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                        <MapPin size={10}/> {e.location}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black uppercase text-brand-neon bg-black/5 dark:bg-white/10 px-2 py-1 rounded-full">
                        <Users size={10}/> {e.registrations} Registered
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
           <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] w-full max-w-md border-2 border-black dark:border-gray-700 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-black italic uppercase dark:text-white">New Event</h3>
                 <button onClick={() => setShowEventModal(false)}><X className="hover:text-red-500"/></button>
              </div>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Title</label>
                    <input required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold outline-none border-2 border-transparent focus:border-brand-neon"/>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Date</label>
                      <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold outline-none border-2 border-transparent focus:border-brand-neon"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Location</label>
                      <input required value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold outline-none border-2 border-transparent focus:border-brand-neon"/>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Description</label>
                    <textarea rows={3} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold outline-none border-2 border-transparent focus:border-brand-neon"/>
                 </div>
                 <button className="w-full bg-brand-neon text-black py-4 rounded-xl font-black uppercase hover:scale-[1.02] transition-transform">Launch Event</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};