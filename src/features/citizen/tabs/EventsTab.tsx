import { useState } from 'react';
import { Calendar, MapPin, Users, CheckCircle, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';

const EVENTS = [
  { 
    id: 1, 
    title: "Upper Lake Cleanup", 
    date: "This Sunday • 7:00 AM", 
    location: "Boat Club, Bhopal", 
    attendees: 142, 
    points: 500,
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=600",
    tags: ["Water Bodies", "High Priority"]
  },
  { 
    id: 2, 
    title: "Van Vihar Plog Run", 
    date: "Next Saturday • 6:30 AM", 
    location: "Van Vihar Gate 2", 
    attendees: 89, 
    points: 300,
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600",
    tags: ["Fitness", "Plastic Free"]
  }
];

export const EventsTab = () => {
  const [joined, setJoined] = useState<number[]>([]);

  const handleJoin = (id: number) => {
    setJoined([...joined, id]);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="pb-24 space-y-6">
      
      {/* HEADER */}
      <div className="bg-green-600 text-white p-8 rounded-[32px] border-2 border-green-800 shadow-neo relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
         <div className="relative z-10">
            <h1 className="text-4xl font-black italic uppercase leading-none mb-2">Squad Missions</h1>
            <p className="font-bold text-green-100">Join forces. Clean Bhopal. Earn massive rep.</p>
         </div>
      </div>

      {/* EVENT CARDS */}
      <div className="space-y-6">
        {EVENTS.map(event => {
           const isJoined = joined.includes(event.id);
           
           return (
             <div key={event.id} className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-[32px] overflow-hidden shadow-neo group hover:-translate-y-1 transition-transform">
                {/* Image Header */}
                <div className="h-48 overflow-hidden relative">
                   <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                   <div className="absolute top-4 left-4 flex gap-2">
                      {event.tags.map(tag => (
                         <span key={tag} className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">{tag}</span>
                      ))}
                   </div>
                   <div className="absolute bottom-4 right-4 bg-brand-neon text-black px-4 py-2 rounded-xl border-2 border-black font-black text-sm shadow-[4px_4px_0px_black]">
                      +{event.points} PTS
                   </div>
                </div>

                {/* Content */}
                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h3 className="text-2xl font-black italic uppercase dark:text-white leading-none mb-2">{event.title}</h3>
                         <div className="flex flex-col gap-1 text-sm font-bold text-gray-500">
                            <span className="flex items-center gap-2"><Calendar size={16}/> {event.date}</span>
                            <span className="flex items-center gap-2"><MapPin size={16}/> {event.location}</span>
                         </div>
                      </div>
                      <div className="text-center bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
                         <Users size={20} className="mx-auto mb-1 text-gray-500"/>
                         <span className="font-black text-lg block leading-none dark:text-white">{event.attendees}</span>
                         <span className="text-[10px] uppercase font-bold text-gray-400">Going</span>
                      </div>
                   </div>

                   {isJoined ? (
                      <button disabled className="w-full py-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-800 rounded-xl font-black uppercase flex items-center justify-center gap-2">
                         <Ticket size={20} /> You're Going!
                      </button>
                   ) : (
                      <button onClick={() => handleJoin(event.id)} className="w-full py-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-black uppercase flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                         RSVP Now <CheckCircle size={20} />
                      </button>
                   )}
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};