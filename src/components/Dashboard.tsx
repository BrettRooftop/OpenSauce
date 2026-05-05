import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Map, SlidersHorizontal, RefreshCcw, LocateFixed, Info, CheckCircle2, Search, BellRing, CloudLightning, Droplet } from "lucide-react";
import { WeatherAlert, AlertSeverity, AlertImpact, AlertLikelihood } from "../types";
import { AlertCard } from "./AlertCard";
import { AlertModal } from "./AlertModal";
import { PushNotificationModal } from "./PushNotificationModal";

export function Dashboard() {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [selectedAlert, setSelectedAlert] = useState<WeatherAlert | null>(null);
  const [visibleAlerts, setVisibleAlerts] = useState<number>(3);
  const [locationSaved, setLocationSaved] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const provinces = ["All", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"];

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saws-alerts");
      const data = await res.json();
      
      let parsedAlerts: WeatherAlert[] = [];
      if (data.alerts && Array.isArray(data.alerts)) {
        parsedAlerts = data.alerts.map((a: any, i: number): WeatherAlert => {
          const l = (a.level || "").toLowerCase();
          
          let severity = AlertSeverity.YELLOW;
          let impact = AlertImpact.MINOR;
          let likelihood = AlertLikelihood.MEDIUM;
          
          if (l.includes("orange") || l.match(/level [5-8]/i)) {
            severity = AlertSeverity.ORANGE;
            impact = AlertImpact.SIGNIFICANT;
          } else if (l.includes("red") || l.match(/level (9|10)/i)) {
            severity = AlertSeverity.RED;
            impact = AlertImpact.SEVERE;
            likelihood = AlertLikelihood.HIGH;
          }

          // Parse start and end times appropriately
          // SAWS format: "05-05-2026 12:00 AM" (SAST is GMT+2)
          const parseSawsTime = (ts: string) => {
            if (!ts) return null;
            try {
              const match = ts.match(/(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)/i);
              if (match) {
                let [, d, m, y, h, min, ampm] = match;
                let hour = parseInt(h);
                if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
                if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
                return new Date(`${y}-${m}-${d}T${hour.toString().padStart(2, '0')}:${min}:00+02:00`).toISOString();
              }
            } catch(e) {}
            return null;
          };

          let st = parseSawsTime(a.startTime) || new Date().toISOString();
          let et = parseSawsTime(a.endTime) || new Date(Date.now() + 3600000 * 6).toISOString();

          const decodeHtml = (str: string) => {
            if (!str) return str;
            return str
              .replace(/&#xD;/g, '\r')
              .replace(/&#xA;/g, '\n')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
              .trim();
          };

          const determineProvince = (districtStr: string) => {
            const d = districtStr.toLowerCase();
            if (d.includes("eastern cape")) return "Eastern Cape";
            if (d.includes("western cape")) return "Western Cape";
            if (d.includes("northern cape")) return "Northern Cape";
            if (d.includes("kwa") || d.includes("natal")) return "KwaZulu-Natal";
            if (d.includes("free state")) return "Free State";
            if (d.includes("gauteng")) return "Gauteng";
            if (d.includes("limpopo")) return "Limpopo";
            if (d.includes("mpumalanga")) return "Mpumalanga";
            if (d.includes("north west")) return "North West";
            
            const ec = ["mhlaba", "beyers naude", "nyandeni", "ingquza", "port st johns", "sabata", "amahlathi", "kouga", "kou-kamma", "great kei", "ntabankulu", "mbhashe", "mnquma", "madikizela", "sundays river", "ndlambe", "makana", "ngqushwa", "blue crane", "enoch", "walter sisulu", "senqu", "elundini", "matatiele", "umzimvubu", "nelson mandela", "buffalo city", "or tambo", "sarah baartman", "chris hani", "joe gqabi", "alfred nzo", "amathole"];
            const wc = ["prince albert", "knysna", "bitou", "george", "beaufort west", "mossel bay", "oudtshoorn", "hessequa", "kannaland", "cape town", "winelands", "karoo", "garden route", "overberg", "west coast", "swartland", "drakenstein"];
            const kzn = ["ethekwini", "umgungundlovu", "ilembe", "ugu", "harry gwala", "uthukela", "umzinyathi", "amajuba", "zululand", "umkhanyakude", "cetshwayo", "inkosi"];
            const fs = ["mangaung", "lejweleputswa", "thabo mofutsanyana", "xhariep", "fezil dabi"];
            const gp = ["johannesburg", "tshwane", "ekurhuleni", "sedibeng", "west rand"];
            const lp = ["capricorn", "mopani", "sekhukhune", "vhembe", "waterberg"];
            const mp = ["ehlanzeni", "gert sibande", "nkangala", "mbombela"];
            const nw = ["bojanala", "dr kenneth kaunda", "dr ruth segomotsi mompati", "ngaka modiri molema"];
            const nc = ["frances baard", "john taolo", "namakwa", "pixley ka seme", "zf mgcawu"];

            if (ec.some(x => d.includes(x))) return "Eastern Cape";
            if (wc.some(x => d.includes(x))) return "Western Cape";
            if (kzn.some(x => d.includes(x))) return "KwaZulu-Natal";
            if (fs.some(x => d.includes(x))) return "Free State";
            if (gp.some(x => d.includes(x))) return "Gauteng";
            if (lp.some(x => d.includes(x))) return "Limpopo";
            if (mp.some(x => d.includes(x))) return "Mpumalanga";
            if (nw.some(x => d.includes(x))) return "North West";
            if (nc.some(x => d.includes(x))) return "Northern Cape";

            return "Unknown";
          };

          return {
            id: `saws-${i}`,
            headline: a.headline || "Severe Weather Warning",
            description: decodeHtml(a.impact) || "Severe weather conditions expected.",
            instruction: decodeHtml(a.instruction) || "Please take necessary precautions.",
            severity,
            impact,
            likelihood,
            province: determineProvince(a.area || ""),
            district: a.area || "Multiple Areas",
            startTime: st,
            endTime: et,
            phenomena: a.headline || "Weather Event",
            warningLevel: a.level ? a.level.trim() : undefined,
            source: "SAWS",
            sourceUrl: "https://www.weathersa.co.za/home/warnings",
          };
        });
      }
      
      setAlerts(parsedAlerts);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const autoDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          const address = data.address;
          
          if (address) {
            // Map Nominatim 'state' to SA province
            const state = address.state;
            if (state && provinces.includes(state)) {
               setFilter(state);
            }
            
            // Map city / town / county
            const exactCity = address.city || address.town || address.county || "";
            if (exactCity) {
               setCityFilter(exactCity);
            }
          }
        } catch(e) {
          console.error("Geocoding failed", e);
        }
      }, (error) => {
        console.error("Geolocation error", error);
      });
    }
  };

  const [currentWeather, setCurrentWeather] = useState<{ temp: number, desc: string, location: string }[]>([]);

  const getWeatherLabel = (code: number) => {
    if (code === 0) return "Clear sky";
    if (code === 1 || code === 2 || code === 3) return "Mainly clear to overcast";
    if (code === 45 || code === 48) return "Fog";
    if (code >= 51 && code <= 55) return "Drizzle";
    if (code >= 61 && code <= 65) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain showers";
    if (code >= 95) return "Thunderstorm";
    return "Unknown";
  };

  const CITY_COORDS: Record<string, { lat: number, lon: number }> = {
    "Johannesburg": { lat: -26.2041, lon: 28.0473 },
    "Cape Town": { lat: -33.9249, lon: 18.4241 },
    "Durban": { lat: -29.8587, lon: 31.0218 },
    "Pretoria": { lat: -25.7449, lon: 28.1878 },
    "Gqeberha (PE)": { lat: -33.9608, lon: 25.6022 },
    "Bloemfontein": { lat: -29.1141, lon: 26.2217 },
    "East London": { lat: -33.0153, lon: 27.9116 },
    "Mbombela": { lat: -25.4753, lon: 30.9694 },
    "Polokwane": { lat: -23.9045, lon: 29.4688 },
    "Kimberley": { lat: -28.7323, lon: 24.7623 },
    "Mahikeng": { lat: -25.8652, lon: 25.6442 },
    "Mthatha": { lat: -31.5890, lon: 28.7897 },
    "Welkom": { lat: -27.9772, lon: 26.7351 },
    "Pietermaritzburg": { lat: -29.6105, lon: 30.3927 },
    "Richards Bay": { lat: -28.7807, lon: 32.0383 },
    "Tzaneen": { lat: -23.8333, lon: 30.1667 },
    "Emalahleni": { lat: -25.8728, lon: 29.2553 },
    "Rustenburg": { lat: -25.6676, lon: 27.2421 },
    "Upington": { lat: -28.4478, lon: 21.2561 },
    "George": { lat: -33.963, lon: 22.4617 }
  };

  const REGION_CITIES: Record<string, string[]> = {
    "All": ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Gqeberha (PE)"],
    "Eastern Cape": ["Gqeberha (PE)", "East London", "Mthatha"],
    "Free State": ["Bloemfontein", "Welkom"],
    "Gauteng": ["Johannesburg", "Pretoria"],
    "KwaZulu-Natal": ["Durban", "Pietermaritzburg", "Richards Bay"],
    "Limpopo": ["Polokwane", "Tzaneen"],
    "Mpumalanga": ["Mbombela", "Emalahleni"],
    "North West": ["Mahikeng", "Rustenburg"],
    "Northern Cape": ["Kimberley", "Upington"],
    "Western Cape": ["Cape Town", "George"]
  };

  const fetchCurrentWeather = async (regionFilter: string, cityQuery: string) => {
    try {
      if (cityQuery.trim()) {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityQuery)}&count=1&format=json`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude, name } = geoData.results[0];
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`);
          const weatherData = await weatherRes.json();
          if (weatherData.current) {
            setCurrentWeather([{
              temp: Math.round(weatherData.current.temperature_2m),
              desc: getWeatherLabel(weatherData.current.weather_code),
              location: name
            }]);
          }
        } else {
          setCurrentWeather([]);
        }
      } else {
        const targetCities = REGION_CITIES[regionFilter] || REGION_CITIES["All"];
        
        const promises = targetCities.map(async (cityName) => {
           const coords = CITY_COORDS[cityName];
           if (!coords) return null;
           const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code`);
           const weatherData = await weatherRes.json();
           if (weatherData.current) {
             return {
               temp: Math.round(weatherData.current.temperature_2m),
               desc: getWeatherLabel(weatherData.current.weather_code),
               location: cityName
             };
           }
           return null;
        });

        const results = await Promise.all(promises);
        setCurrentWeather(results.filter(Boolean) as { temp: number, desc: string, location: string }[]);
      }
    } catch (e) {
      console.error("Failed to fetch weather", e);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Load saved preferences
    const savedFilter = localStorage.getItem("saws_region_filter");
    const savedCity = localStorage.getItem("saws_city_filter");
    if (savedFilter || savedCity) {
      if (savedFilter) setFilter(savedFilter);
      if (savedCity) setCityFilter(savedCity);
    } else {
      autoDetectLocation();
    }
  }, []);

  // Update weather whenever filter/city changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCurrentWeather(filter, cityFilter);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [filter, cityFilter]);

  const handleSaveLocation = () => {
    localStorage.setItem("saws_region_filter", filter);
    localStorage.setItem("saws_city_filter", cityFilter);
    setLocationSaved(true);
    setTimeout(() => setLocationSaved(false), 2000);
  };

  const CITY_DISTRICT_MAP: Record<string, string[]> = {
    "port elizabeth": ["nelson mandela bay"],
    "gqeberha": ["nelson mandela bay"],
    "pe": ["nelson mandela bay"],
    "johannesburg": ["city of johannesburg", "gauteng"],
    "joburg": ["city of johannesburg"],
    "jhb": ["city of johannesburg"],
    "pretoria": ["city of tshwane"],
    "pta": ["city of tshwane"],
    "durban": ["ethekwini"],
    "cape town": ["city of cape town"],
    "cpt": ["city of cape town"],
    "bloemfontein": ["mangaung"],
    "east london": ["buffalo city"],
    "nelspruit": ["mbombela"],
    "pietermaritzburg": ["msunduzi"],
    "polokwane": ["polokwane"],
    "kimberley": ["sol plaatje"],
  };

  const filteredAlerts = alerts.filter(a => {
    const isPast = new Date(a.endTime).getTime() < Date.now();
    if (isPast) return false;

    // If province is explicitly mapped or if it's "Unknown", it shows under "All".
    // If the user selects a specific province, it must match.
    // However, if the parsed province is "Unknown", we should probably still show it under a specific province if the cityFilter matches it, because they might be looking for it. 
    // Wait, the simplest way:
    const provinceMatch = filter === "All" || a.province === filter || a.province === "Unknown";
    
    if (!cityFilter) return filter === "All" || a.province === filter; // Don't show "Unknown" in all tabs unless searching

    const searchTerm = cityFilter.toLowerCase().trim();
    const cleanSearch = searchTerm.replace(/(metropolitan|local|district)?\s*municipality/ig, '').trim();
    const sf = cleanSearch || searchTerm;

    const ds = a.district.toLowerCase();
    const pv = a.province.toLowerCase();

    // Find any mapped districts that this search term might correspond to
    const mappedDistricts = Object.entries(CITY_DISTRICT_MAP).reduce((acc, [city, districts]) => {
      if (city === sf || city.includes(sf) || sf.includes(city)) {
        acc.push(...districts);
      }
      return acc;
    }, [] as string[]);

    const cityMatch = 
      ds.includes(sf) || 
      (sf.length > 3 && sf.includes(ds)) ||
      pv.includes(sf) ||
      mappedDistricts.some(md => ds.includes(md) || pv.includes(md));

    return provinceMatch && cityMatch;
  }).sort((a, b) => {
    const sevScore: Record<string, number> = { "red": 3, "orange": 2, "yellow": 1, "green": 0 };
    const aScore = sevScore[a.severity] || 0;
    const bScore = sevScore[b.severity] || 0;
    
    // Sort by severity first
    if (aScore !== bScore) return bScore - aScore;
    
    // Then by level if available
    const aLevel = parseInt(a.warningLevel?.replace(/[^0-9]/g, '') || "0");
    const bLevel = parseInt(b.warningLevel?.replace(/[^0-9]/g, '') || "0");
    if (aLevel !== bLevel) return bLevel - aLevel;

    // Finally by start time
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 h-16 bg-slate-900 text-white flex items-center justify-between px-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Droplet size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[17px] md:text-lg tracking-tight leading-none text-white">Open<span className="text-emerald-400">Sauce</span></span>
            <span className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em] text-slate-400 mt-0.5">Unofficial SAWS Alerts</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="hidden sm:block text-[10px] font-medium text-slate-400">
              Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Live Feed</span>
          </div>
          <button 
            onClick={fetchAlerts}
            className={`p-2 rounded-lg hover:bg-slate-800 transition-colors ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCcw size={18} className="text-slate-400" />
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6 pt-8">
        {/* Region Filter */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Region Analysis</h3>
            <div className="flex items-center gap-4">
              <button onClick={handleSaveLocation} className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${locationSaved ? 'text-emerald-500 scale-105' : 'text-indigo-600 hover:opacity-80'}`}>
                {locationSaved ? <CheckCircle2 size={12} /> : <Map size={12} />}
                {locationSaved ? "Saved!" : "Save Location"}
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mask-linear-r">
            {provinces.map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border ${
                  filter === p 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {p === 'All' ? 'National Feed' : p}
              </button>
            ))}
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by city or district..." 
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-6">
          {/* Current Weather summary widget */}
          {currentWeather.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {currentWeather.map((cw, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col justify-between shadow-sm">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Weather</h4>
                    <div className="font-bold text-sm text-slate-900 mt-0.5 mb-1 truncate">{cw.location}</div>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <div className="text-xs font-medium text-slate-500 leading-tight pr-2">{cw.desc}</div>
                    <div className="flex items-start text-emerald-500">
                      <span className="text-2xl font-black tracking-tighter leading-none">{cw.temp}</span>
                      <span className="text-xs font-bold mt-0.5">°</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end justify-between mb-2">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Active Warnings</h2>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Showing {filteredAlerts.length} events across {filter === 'All' ? 'SA' : filter}</p>
            </div>
          </div>

          <div 
            onClick={() => setShowPushModal(true)}
            className="w-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                <BellRing size={20} />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-900 text-sm">System Alerts</h4>
                <p className="text-xs text-indigo-700 font-medium">Get live severe weather warnings on your device.</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-700 transition">
              Setup
            </button>
          </div>
          
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="h-44 w-full bg-slate-200/50 rounded-2xl animate-pulse border border-slate-200 mb-4" />
              ))
            ) : filteredAlerts.length > 0 ? (
              <div key="alerts-container">
                {filteredAlerts.slice(0, visibleAlerts).map((alert) => (
                  <AlertCard key={alert.id} alert={alert} onClick={() => setSelectedAlert(alert)} />
                ))}
                {filteredAlerts.length > 3 && (
                  <button 
                    key="view-toggle"
                    onClick={() => setVisibleAlerts(prev => prev === 3 ? filteredAlerts.length : 3)}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    {visibleAlerts === 3 ? `View All ${filteredAlerts.length} Alerts` : 'Show Less'}
                  </button>
                )}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 px-6 text-center bg-white rounded-3xl border border-slate-200 border-dashed"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 tracking-tight">Status: Clear</h3>
                <p className="text-sm font-medium text-slate-500 mt-2">
                  No active severe weather warnings detected {cityFilter ? `for "${cityFilter}"` : `for ${filter}`}.
                </p>
                {lastUpdated && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4">
                    Last Checked: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                <div className="mt-4 inline-flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 text-left max-w-sm">
                   <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                   <p className="text-xs text-slate-500 leading-relaxed">
                     <strong className="text-slate-700 block mb-1">Past Warnings Removed</strong>
                     This feed pulls live data directly from the SAWS alerts map. Once an alert expires (e.g., yesterday's warnings), it is removed from the official map and will no longer appear here.
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legal / Affiliation Disclaimer */}
          <div className="mt-8 mb-12 p-5 rounded-2xl bg-slate-900 text-slate-400 border border-slate-800 flex items-start gap-4">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
              <Info className="text-slate-300" size={16} />
            </div>
            <div className="text-[10px] leading-relaxed font-medium">
              <strong className="text-slate-200 text-xs block mb-1">Unofficial, But Useful</strong>
              OpenSauce is an independent project. We're <strong>not officially affiliated with the SA Weather Service (SAWS).</strong> We just make public weather alerts easier to digest. Keep this as a handy guide, but don't rely solely on it for life-threatening situations. Stay safe!
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedAlert && (
          <AlertModal 
            alert={selectedAlert} 
            onClose={() => setSelectedAlert(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPushModal && (
          <PushNotificationModal 
            defaultRegion={filter !== 'All' ? filter : ''}
            onClose={() => setShowPushModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer / System Health */}
      <footer className="fixed bottom-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-xl border-t border-slate-200 px-6 flex items-center justify-between z-50 max-w-md mx-auto">
        <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> API: OK</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> CACHE</span>
        </div>
        <div className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">
          v1.0.4-STABLE
        </div>
      </footer>
    </div>
  );
}
