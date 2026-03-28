import { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient'; // ✅ Use the secure client
import { Clock, MapPin, User, AlertCircle, Loader2 } from 'lucide-react';

export const LiveReportsFeed = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      // ✅ SECURE CALL: Uses the token stored in localStorage
      const data = await api.get('/admin/reports/latest');
      if (Array.isArray(data)) {
          setReports(data);
      }
    } catch (e) {
      console.error("Feed error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Poll every 5 seconds to show new reports instantly
    const interval = setInterval(fetchReports, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-black p-6 rounded-[32px] border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black uppercase italic dark:text-white flex items-center gap-2">
          <AlertCircle className="text-red-500 animate-pulse" /> LIVE LITTER REPORTS
        </h3>
        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full uppercase flex items-center gap-1">
          {loading ? <Loader2 size={8} className="animate-spin"/> : <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
          Real-Time
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {reports.length === 0 ? (
          <div className="text-center py-8 opacity-50">
             <div className="bg-gray-100 dark:bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertCircle size={20} />
             </div>
             <p className="text-xs font-bold uppercase">No reports yet</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="flex gap-4 p-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors animate-in slide-in-from-left">
              
              {/* IMAGE THUMBNAIL */}
              <div className="w-16 h-16 shrink-0 bg-gray-200 rounded-lg overflow-hidden border border-black/10 relative group">
                {report.image_url ? (
                  <img src={report.image_url} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-bold">No IMG</div>
                )}
              </div>

              {/* DETAILS */}
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">
                  {report.landmark || "Unknown Location"}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">
                  {report.description || "No description provided."}
                </p>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                      <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        <User size={8} /> {report.user_name || "Citizen"}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                       {new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};