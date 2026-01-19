import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Printer } from 'lucide-react';

export const QRGenerator = () => {
  const [binId, setBinId] = useState('101');
  const [location, setLocation] = useState('MP_NAGAR');

  // Format: KS:BIN:{ID}:{LOCATION}
  const qrValue = `KS:BIN:${binId}:${location.toUpperCase().replace(/\s/g, '_')}`;

  const print = () => {
    const printWindow = window.open('', '', 'height=600,width=600');
    if(printWindow) {
        printWindow.document.write('<html><body>');
        printWindow.document.write(document.getElementById('qr-print-area')?.innerHTML || '');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }
  };

  return (
    <div className="bg-white dark:bg-black p-6 rounded-[32px] border-2 border-black dark:border-brand-neon shadow-neo dark:shadow-[0_0_15px_rgba(57,255,20,0.3)]">
      <h3 className="font-black text-xl uppercase italic mb-4 dark:text-white">Sticker Printer</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
           <label className="text-xs font-bold uppercase text-gray-500">Bin ID</label>
           <input 
             value={binId} 
             onChange={(e) => setBinId(e.target.value)}
             className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black rounded-lg px-3 py-2 font-bold dark:text-white"
           />
        </div>
        <div>
           <label className="text-xs font-bold uppercase text-gray-500">Location</label>
           <input 
             value={location} 
             onChange={(e) => setLocation(e.target.value)}
             className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black rounded-lg px-3 py-2 font-bold dark:text-white"
           />
        </div>
      </div>

      {/* PREVIEW AREA */}
      <div id="qr-print-area" className="bg-yellow-400 p-6 rounded-xl border-4 border-black flex flex-col items-center justify-center text-center">
         <div className="bg-black text-white px-4 py-1 rounded-full font-black text-xs uppercase mb-2">
            Kachra Seth • Official Bin
         </div>
         
         <div className="bg-white p-2 border-2 border-black rounded-lg">
             <QRCode value={qrValue} size={120} />
         </div>

         <div className="mt-2 font-black text-black leading-tight">
            ID: {binId}<br/>
            {location.toUpperCase()}
         </div>
      </div>

      <button 
        onClick={print}
        className="w-full mt-6 bg-black text-white dark:bg-brand-neon dark:text-black py-3 rounded-xl font-black uppercase flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
      >
        <Printer size={20} /> Print Sticker
      </button>
    </div>
  );
};