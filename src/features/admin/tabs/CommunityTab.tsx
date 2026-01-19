import { useState } from 'react';
import { Users, Ticket, CheckCircle, AlertOctagon, MapPin, Calendar, X } from 'lucide-react';
import confetti from 'canvas-confetti';

// 🎟️ MOCK EVENTS
const EVENTS = [
  { id: 1, title: "Upper Lake Cleanup", date: "This Sunday", attendees: 142, capacity: 200 },
  { id: 2, title: "Van Vihar Plog Run", date: "Next Saturday", attendees: 89, capacity: 100 }
];

// 🎫 MOCK COMPLAINT TICKETS
const TICKETS = [
  { id: 'T-401', user: 'Rohan K.', type: 'Missed Pickup', location: 'E-7 Arera Colony', time: '10:30 AM', status: 'open' },
  { id: 'T-402', user: 'Priya S.', type: 'Bin Damaged', location: '10 No. Market', time: '09:15 AM', status: 'open' },
];

export const CommunityTab = () => {
  const [tickets, setTickets] = useState(TICKETS);

  const resolveTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24">
      
      {/* 🎉 LEFT: EVENT ANALYTICS */}
      <div className="space-y-6">
         <h3 className="font-black text-2xl uppercase italic dark:text-white flex items-center gap-2">
            <Users className="text-brand-neon" /> Community Events
         </h3>
         
         {EVENTS.map(event => (
            <div key={event.id} className="bg-white dark:bg-black border-2 border-black dark:border-gray-700 p-6 rounded-[32px] shadow-neo dark:shadow-none relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Ticket size={100} />
               </div>
               
               <div className="flex justify-between items-start relative z-10">
                  <div>
                     <h4 className="text-2xl font-black italic uppercase dark:text-white">{event.title}</h4>
                     <p className="text-sm font-bold text-gray-500 flex items-center gap-2 mt-1">
                        <Calendar size={14} /> {event.date}
                     </p>
                  </div>
                  <div className="text-right">
                     <span className="text-4xl font-black text-brand-neon">{event.attendees}</span>
                     <p className="text-[10px] font-bold uppercase text-gray-400">Registered</p>
                  </div>
               </div>

               {/* Progress Bar */}
               <div className="mt-6">
                  <div className="flex justify-between text-xs font-bold mb-1 dark:text-gray-400">
                     <span>Capacity</span>
                     <span>{Math.round((event.attendees / event.capacity) * 100)}% Full</span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-black/10">
                     <div 
                        className="h-full bg-brand-neon" 
                        style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                     ></div>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* ⚠️ RIGHT: COMPLAINT TICKETS */}
      <div className="space-y-6">
         <h3 className="font-black text-2xl uppercase italic dark:text-white flex items-center gap-2">
            <AlertOctagon className="text-red-500" /> Live Tickets
         </h3>

         <div className="space-y-4">
            {tickets.length === 0 ? (
               <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-[32px] text-gray-400 font-bold uppercase">
                  No Active Complaints 🎉
               </div>
            ) : (
               tickets.map(ticket => (
                  <div key={ticket.id} className="bg-white dark:bg-black border-2 border-red-500/50 p-6 rounded-[24px] shadow-sm flex flex-col gap-4 animate-in slide-in-from-right">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-black">!</div>
                           <div>
                              <h4 className="font-black text-lg dark:text-white uppercase leading-none">{ticket.type}</h4>
                              <p className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-1">
                                 <MapPin size={10} /> {ticket.location} • {ticket.time}
                              </p>
                           </div>
                        </div>
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-black uppercase border border-red-200">
                           {ticket.status}
                        </span>
                     </div>
                     
                     <div className="flex gap-2">
                        <button className="flex-1 py-3 bg-gray-100 dark:bg-gray-900 rounded-xl text-xs font-black uppercase hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                           Assign Truck
                        </button>
                        <button 
                           onClick={() => resolveTicket(ticket.id)}
                           className="flex-1 py-3 bg-green-500 text-white rounded-xl text-xs font-black uppercase hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-1"
                        >
                           <CheckCircle size={14} /> Resolve
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>

    </div>
  );
};