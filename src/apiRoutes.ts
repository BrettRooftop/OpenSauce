import { Router } from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";
import { WeatherAlert, AlertSeverity, AlertImpact, AlertLikelihood } from "./types.js";

const apiRouter = Router();

async function fetchLiveWarningsText(): Promise<string | null> {
  try {
    const agent = new https.Agent({  
      rejectUnauthorized: false
    });
    const { data } = await axios.get("https://www.weathersa.co.za/home/warnings", {
      httpsAgent: agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    // Extract text using cheerio
    const $ = cheerio.load(data);
    // Remove scripts and styles
    $('script, style').remove();
    const websiteText = $('body').text().replace(/\s+/g, ' ').trim();
    
    if (websiteText.length > 50) {
      return websiteText;
    }
    return null;
  } catch (error) {
    console.error("Error fetching SAWS live data:", error);
    return null;
  }
}

const mockAlerts: WeatherAlert[] = [
  {
    id: "4",
    headline: "Yellow Level 2 Warning: Damaging Waves",
    description: "Difficulty in navigation at sea for small vessels and localized disruption to beachfront activities is expected between Plettenberg Bay and Port Alfred.",
    instruction: "Small vessels are advised to seek shelter in harbour. Beachgoers should heed warnings from lifeguards.",
    severity: AlertSeverity.YELLOW,
    impact: AlertImpact.MINOR,
    likelihood: AlertLikelihood.HIGH,
    province: "Eastern Cape",
    district: "Nelson Mandela Bay, Kouga, Ndlambe",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 86400000).toISOString(),
    phenomena: "Damaging Waves",
    source: "SAWS",
    sourceUrl: "https://www.weathersa.co.za/home/warnings"
  },
  {
    id: "1",
    headline: "Yellow Level 2 Warning: Severe Thunderstorms",
    description: "Severe thunderstorms expected over the interior of the Eastern Cape today.",
    instruction: "Seek shelter indoors. Avoid open fields and trees.",
    severity: AlertSeverity.YELLOW,
    impact: AlertImpact.MINOR,
    likelihood: AlertLikelihood.MEDIUM,
    province: "Eastern Cape",
    district: "Chris Hani",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 86400000).toISOString(),
    phenomena: "Severe Thunderstorms",
    source: "SAWS",
    sourceUrl: "https://www.weathersa.co.za/home/warnings"
  },
  {
    id: "2",
    headline: "Orange Level 6 Warning: Coastal Winds",
    description: "Strong winds and high waves expected between Port Edward and Kosi Bay.",
    instruction: "Small vessels should stay in port. Be aware of flying debris.",
    severity: AlertSeverity.ORANGE,
    impact: AlertImpact.SIGNIFICANT,
    likelihood: AlertLikelihood.HIGH,
    province: "KwaZulu-Natal",
    district: "eThekwini",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 172800000).toISOString(),
    phenomena: "Strong Winds",
    source: "SAWS",
    sourceUrl: "https://www.weathersa.co.za/home/warnings"
  }
];

const mockPastAlerts: WeatherAlert[] = [
  {
    id: "past-1",
    headline: "Orange Level 5 Warning: Disruptive Rain",
    description: "Disruptive rain leading to localized flooding of roads and settlements.",
    instruction: "Do not cross flooded roads.",
    severity: AlertSeverity.ORANGE,
    impact: AlertImpact.SIGNIFICANT,
    likelihood: AlertLikelihood.HIGH,
    province: "Eastern Cape",
    district: "Nelson Mandela Bay",
    startTime: new Date(Date.now() - 3 * 86400000).toISOString(),
    endTime: new Date(Date.now() - 1 * 86400000).toISOString(),
    phenomena: "Disruptive Rain",
    source: "SAWS",
    sourceUrl: "https://www.weathersa.co.za/home/warnings"
  },
  {
    id: "past-2",
    headline: "Yellow Level 2 Warning: Damaging Winds",
    description: "Strong winds leading to localized damage to informal settlements.",
    instruction: "Stay indoors if possible.",
    severity: AlertSeverity.YELLOW,
    impact: AlertImpact.MINOR,
    likelihood: AlertLikelihood.HIGH,
    province: "Western Cape",
    district: "City of Cape Town",
    startTime: new Date(Date.now() - 4 * 86400000).toISOString(),
    endTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    phenomena: "Damaging Winds",
    source: "SAWS",
    sourceUrl: "https://www.weathersa.co.za/home/warnings"
  }
];

apiRouter.get("/saws-text", async (req, res) => {
  const text = await fetchLiveWarningsText();
  res.json({ text, mockPastAlerts, mockAlerts });
});

apiRouter.get("/saws-alerts", async (req, res) => {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const { data } = await axios.get('https://www.weathersa.co.za/home/warnings', { 
      httpsAgent: agent,
      timeout: 10000 
    });
    
    const alerts: any[] = [];
    const seen = new Set();
    
    // Match each .setHTML block and extract properties individually
    const blockRegex = /\.setHTML\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g;
    
    const matches = [...data.matchAll(blockRegex)];
    
    for (const match of matches) {
      const block = match[1];
      if (!block || !block.includes("<b>Headline:</b>")) continue;

      const extractValue = (key: string, str: string) => {
        const re = new RegExp(`<b>\\s*${key}\\s*:?\\s*<\\/b>[^"]*"\\s*\\+\\s*"(.*?)"`, 'i');
        const m = str.match(re);
        if (m) return m[1].trim();
        return "";
      };

      // Area is usually in the first <b> tag which isn't a key
      const areaMatch = block.match(/"<b>"\s*\+\s*"(.*?)"\s*\+\s*"<\/b>"/);
      const area = areaMatch ? areaMatch[1].trim() : "";
      
      const headline = extractValue("Headline", block);
      let level = extractValue("Warning Level", block);
      
      // Sometimes level might just be in the headline text like "Level 8 Warning" 
      if (!level && headline.includes("Level")) {
         const levelMatch = headline.match(/Level (\d+)/i);
         if (levelMatch) level = `Level ${levelMatch[1]}`;
      }

      const startTime = extractValue(" Start Time", block);
      const endTime = extractValue(" End Time", block);
      const impact = extractValue("Impact", block);
      const instruction = extractValue("Instruction", block).replace(/&#xD;&#xA;/g, '\n').replace(/<br\s?\/?>/g, '\n');
      
      const key = `${area}|${headline}|${level}|${startTime}|${endTime}`;
      if (!seen.has(key)) {
        seen.add(key);
        alerts.push({
          area,
          headline,
          level,
          startTime,
          endTime,
          impact: impact || "No specific impact specified.",
          instruction: instruction || "Stay safe and monitor SAWS updates."
        });
      }
    }
    
    res.json({ alerts, count: alerts.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from SAWS", details: err.message });
  }
});

export default apiRouter;
