import React from "react";
import { motion } from "motion/react";
import { AlertCircle, Wind, CloudLightning, Waves, Info, MapPin, Calendar, ArrowRight, ExternalLink, Image as ImageIcon } from "lucide-react";
import { WeatherAlert, AlertSeverity } from "../types";

interface AlertCardProps {
  alert: WeatherAlert;
  onClick?: () => void;
}

const severityConfig = {

  [AlertSeverity.GREEN]: {
    bg: "bg-white",
    border: "border-slate-200",
    sideBorder: "border-l-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
    text: "text-slate-900",
    iconColor: "text-emerald-500",
    actionText: "No Alert"
  },
  [AlertSeverity.YELLOW]: {
    bg: "bg-white",
    border: "border-slate-200",
    sideBorder: "border-l-yellow-500",
    badge: "bg-yellow-100 text-yellow-700",
    text: "text-slate-900",
    iconColor: "text-yellow-600",
    actionText: "Be Aware"
  },
  [AlertSeverity.ORANGE]: {
    bg: "bg-white",
    border: "border-slate-200",
    sideBorder: "border-l-orange-500",
    badge: "bg-orange-100 text-orange-700",
    text: "text-slate-900",
    iconColor: "text-orange-600",
    actionText: "Be Prepared"
  },
  [AlertSeverity.RED]: {
    bg: "bg-white",
    border: "border-slate-200",
    sideBorder: "border-l-red-500",
    badge: "bg-red-100 text-red-700",
    text: "text-slate-900",
    iconColor: "text-red-600",
    actionText: "Take Action"
  },
};

const getPhenomenaIcon = (phenomena: string) => {
  const p = phenomena.toLowerCase();
  if (p.includes("wind")) return <Wind className="w-5 h-5" />;
  if (p.includes("thunder") || p.includes("rain")) return <CloudLightning className="w-5 h-5" />;
  if (p.includes("wave") || p.includes("swell")) return <Waves className="w-5 h-5" />;
  return <AlertCircle className="w-5 h-5" />;
};

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onClick }) => {
  // @ts-ignore
  const config = severityConfig[alert.severity];
  const isExpired = new Date(alert.endTime).getTime() < Date.now();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border ${config.border} border-l-8 ${config.sideBorder} bg-white p-6 shadow-sm mb-4 ${isExpired ? 'opacity-70 grayscale-[0.5]' : ''} ${onClick ? 'cursor-pointer hover:shadow-md hover:opacity-100 transition-all' : ''}`}
    >
      {isExpired && (
        <div className="absolute top-0 right-0 bg-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-lg">
          Expired
        </div>
      )}
      <div className="flex items-start flex-wrap gap-2 mb-4 mt-1">
        {alert.warningLevel && (
          <span className={`px-2 py-1 ${config.badge} text-[10px] font-black uppercase rounded tracking-widest border border-current/10`}>
            {alert.warningLevel} - {config.actionText}
          </span>
        )}
        <span className={`px-2 py-1 ${alert.warningLevel ? 'bg-slate-100 text-slate-500' : config.badge} text-[10px] font-extrabold uppercase rounded tracking-wider`}>
          Impact: {alert.impact}
        </span>
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center ml-auto pt-1">
          {alert.district} / {alert.province.split(' ').map(w => w[0]).join('')}
        </div>
      </div>

      <h3 className={`text-xl font-bold ${config.text} leading-tight mb-3 tracking-tight`}>
        {alert.headline}
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-6 whitespace-pre-line">
        {alert.description}
      </p>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest flex items-center gap-1">
            Valid Period
            {(alert.sourceUrl || alert.visualUrl) && (
              <span className="flex gap-0.5 text-slate-300 ml-1">
                {alert.sourceUrl && <ExternalLink size={9} />}
                {alert.visualUrl && <ImageIcon size={9} />}
              </span>
            )}
          </span>
          <span className="text-xs font-semibold text-slate-700">
            {new Date(alert.startTime).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} - 
            <br />
            {new Date(alert.endTime).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">
          Details <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};
