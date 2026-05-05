import { motion } from "motion/react";
import { X, MapPin, Calendar, Clock, AlertTriangle, Info, ExternalLink, Share2 } from "lucide-react";
import { WeatherAlert, AlertSeverity } from "../types";

interface AlertModalProps {
  alert: WeatherAlert;
  onClose: () => void;
}

const severityConfig = {
  [AlertSeverity.GREEN]: {
    bg: "bg-emerald-500",
    text: "text-emerald-900",
    badge: "bg-emerald-100 text-emerald-700",
    actionText: "No Alert",
  },
  [AlertSeverity.YELLOW]: {
    bg: "bg-yellow-500",
    text: "text-yellow-900",
    badge: "bg-yellow-100 text-yellow-700",
    actionText: "Be Aware",
  },
  [AlertSeverity.ORANGE]: {
    bg: "bg-orange-500",
    text: "text-orange-900",
    badge: "bg-orange-100 text-orange-700",
    actionText: "Be Prepared",
  },
  [AlertSeverity.RED]: {
    bg: "bg-red-500",
    text: "text-red-900",
    badge: "bg-red-100 text-red-700",
    actionText: "Take Action",
  },
};

export const AlertModal = ({ alert, onClose }: AlertModalProps) => {
  const config = severityConfig[alert.severity];

  const handleShare = async () => {
    const shareData = {
      title: `OpenSauce Weather Alert: ${alert.headline}`,
      text: `${alert.warningLevel ? `[${alert.warningLevel}] ` : ''}${alert.headline} for ${alert.district}, ${alert.province}. Expected Impact: ${alert.impact}.\n\nStay safe!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
        window.alert('Alert details copied to clipboard!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6" style={{ pointerEvents: 'auto' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.95 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
      >
        <div className={`h-3 ${config.bg}`} />
        
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-wrap gap-2 pr-4">
              {alert.warningLevel && (
                <span className={`px-2 py-1 ${config.badge} text-[10px] font-black uppercase rounded tracking-widest border border-current/10`}>
                  {alert.warningLevel} - {config.actionText}
                </span>
              )}
              <span className={`px-2 py-1 ${alert.warningLevel ? 'bg-slate-100 text-slate-600' : config.badge} text-[10px] font-extrabold uppercase rounded tracking-wider whitespace-nowrap`}>
                Impact: {alert.impact}
              </span>
              <span className={`px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase rounded tracking-wider whitespace-nowrap`}>
                Likelihood: {alert.likelihood}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            {alert.headline}
          </h2>

          <p className="text-base text-slate-600 leading-relaxed mb-6 whitespace-pre-line">
            {alert.description}
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <MapPin className="text-slate-400 mt-0.5" size={18} />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Affected Area</p>
                <p className="text-sm font-semibold text-slate-900">{alert.district}, {alert.province}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Calendar className="text-slate-400 mt-0.5" size={18} />
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Valid Period</p>
                <p className="text-sm font-semibold text-slate-900">
                  {new Date(alert.startTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  <br/>
                  {new Date(alert.endTime).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {alert.visualUrl && (
            <div className="mb-6 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <img src={alert.visualUrl} alt="Official Source Image" className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
            </div>
          )}

          {alert.instruction && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
              <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-[10px] font-black uppercase text-amber-800 tracking-widest mb-1">Official Instructions</p>
                <p className="text-sm font-medium text-amber-900 leading-relaxed whitespace-pre-line">{alert.instruction}</p>
              </div>
            </div>
          )}

          {alert.sourceUrl && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 flex flex-col gap-2">
               <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Verified SAWS Data</span>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed">
                  Extracted directly from the real-time South African Weather Service database.
               </p>
               <div className="bg-white p-3 rounded-xl border border-slate-200 mt-1">
                 <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-800 block mb-1">To verify manually:</strong>
                    1. Open the <a href={alert.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">SAWS Warnings Map <ExternalLink size={10} className="inline mb-0.5" /></a><br/>
                    2. Look for the <strong className="text-slate-800">{alert.district}</strong> area.<br/>
                    3. Click the map region to see this exact warning.
                 </p>
               </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 justify-between mt-4 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5">
              <Info size={12} />
              Source Feed: {alert.source}
            </div>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors font-bold uppercase tracking-widest"
            >
              <Share2 size={12} />
              Share Alert
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
