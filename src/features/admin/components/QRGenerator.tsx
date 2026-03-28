import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Printer } from 'lucide-react';

export const QRGenerator = () => {
  const [binId, setBinId] = useState('BIN-999'); 
  const [location, setLocation] = useState('MP NAGAR');

  // 🧠 UPDATED: SIMPLE TEXT FORMAT
  // Matches the new "Dual-ID" strategy we implemented in the backend.
  // No JSON parsing needed. Scanner just reads the suffix.
  const qrWetData = `${binId}-W`; // e.g., BIN-999-W
  const qrDryData = `${binId}-D`; // e.g., BIN-999-D

  const print = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if(printWindow) {
        printWindow.document.write('<html><head><title>Print Stickers</title></head><body>');
        printWindow.document.write('<style>body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }</style>');
        printWindow.document.write(document.getElementById('qr-print-area')?.innerHTML || '');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }
  };

  return (
    <div className="bg-white dark:bg-black p-6 rounded-[32px] border-2 border-black dark:border-brand-neon shadow-neo dark:shadow-[0_0_15px_rgba(57,255,20,0.3)]">
      <h3 className="font-black text-xl uppercase italic mb-4 dark:text-white">Smart Bin Sticker Printer</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
           <label className="text-xs font-bold uppercase text-gray-500">Bin ID</label>
           <input 
             value={binId} 
             onChange={(e) => setBinId(e.target.value.toUpperCase())}
             placeholder="e.g. BIN-999"
             className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black rounded-lg px-3 py-2 font-bold dark:text-white uppercase"
           />
        </div>
        <div>
           <label className="text-xs font-bold uppercase text-gray-500">Location Label</label>
           <input 
             value={location} 
             onChange={(e) => setLocation(e.target.value)}
             className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black rounded-lg px-3 py-2 font-bold dark:text-white"
           />
        </div>
      </div>

      {/* PREVIEW AREA */}
      <div id="qr-print-area" className="bg-white p-4 border-2 border-dashed border-gray-300 w-full max-w-md mx-auto">
         
         {/* WET STICKER */}
         <div className="border-4 border-green-500 p-4 rounded-xl mb-4 flex items-center gap-4 bg-white text-black">
            <div className="bg-white p-2">
                <QRCode value={qrWetData} size={100} />
            </div>
            <div className="text-left">
               <h3 className="font-black text-3xl text-green-600 leading-none">WET</h3>
               <p className="font-bold text-sm uppercase">Organic / Kitchen</p>
               <div className="mt-2 text-[10px] font-mono border-t border-gray-200 pt-1 text-gray-500">
                 ID: {qrWetData}<br/>
                 {location}
               </div>
            </div>
         </div>

         {/* DRY STICKER */}
         <div className="border-4 border-blue-500 p-4 rounded-xl flex items-center gap-4 bg-white text-black">
            <div className="bg-white p-2">
                <QRCode value={qrDryData} size={100} />
            </div>
            <div className="text-left">
               <h3 className="font-black text-3xl text-blue-600 leading-none">DRY</h3>
               <p className="font-bold text-sm uppercase">Plastic / Paper</p>
               <div className="mt-2 text-[10px] font-mono border-t border-gray-200 pt-1 text-gray-500">
                 ID: {qrDryData}<br/>
                 {location}
               </div>
            </div>
         </div>

      </div>

      <button onClick={print} className="w-full mt-6 bg-black text-white dark:bg-brand-neon dark:text-black py-3 rounded-xl font-black uppercase flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
        <Printer size={20} /> Print Sticker Sheet
      </button>
    </div>
  );
};