import React, { useState } from "react";
import { motion } from "motion/react";
import { X, BellRing, AlertTriangle, ShieldCheck } from "lucide-react";

interface Props {
  onClose: () => void;
  defaultRegion?: string;
}

export function PushNotificationModal({ onClose, defaultRegion }: Props) {
  const [region, setRegion] = useState(defaultRegion || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    try {
      if (!("Notification" in window)) {
        throw new Error("This browser does not support system notifications.");
      }
      
      // Check if inside an iframe, which often blocks notification permissions
      if (window.self !== window.top) {
        throw new Error("Notifications cannot be enabled inside this preview window. Please use the top-right menu to open the app in a new tab, then try again.");
      }

      const permission = await Notification.requestPermission();
      
      if (permission === "granted") {
        // Show a test notification immediately
        new Notification("Weather Alerts Enabled", {
          body: `You will now receive alerts for ${region}.`,
          icon: "/favicon.ico"
        });
        
        setSuccess(true);
        setTimeout(onClose, 2500);
      } else {
        throw new Error("Notification permission was denied. You may need to update your browser settings or add this app to your Home Screen.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to enable notifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <BellRing size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-tight">System Alerts</h3>
                <p className="text-[10px] font-black tracking-wider uppercase text-indigo-600">Free Push Notifications</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-500 mx-auto flex items-center justify-center mb-4">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Notifications Enabled!</h4>
              <p className="text-sm font-medium text-slate-500 max-w-[250px] mx-auto">
                You will now receive system notifications for severe weather warnings in your region.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/50 flex items-start gap-3">
                <AlertTriangle size={16} className="text-indigo-600 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Opt-in to receive free device push notifications when severe weather warnings are issued for your selected area.
                </p>
              </div>
              
              {errorMsg && (
                <div className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-lg border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider pl-1">Alert Region</label>
                 <select 
                  required
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors appearance-none"
                >
                  <option value="" disabled>Select your province...</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="North West">North West</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="Western Cape">Western Cape</option>
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={loading || !region}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl transition-colors relative overflow-hidden group shadow-lg shadow-indigo-600/20"
                >
                  <span className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                    <BellRing size={18} />
                    Enable Notifications
                  </span>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
