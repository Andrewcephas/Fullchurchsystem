import { useState, useEffect } from "react";
import apiService from "@/services/api";

export interface SiteSettings {
  phone: string;
  email: string;
  whatsapp: string;
  youtube_url: string;
  facebook_url: string;
  logo_url: string;
  church_name: string;
  tagline: string;
  address: string;
  primary_color: string;
  secondary_color: string;
  services: { title: string; day: string; time: string; description: string }[];
  ministries: { title: string; description: string }[];
}

export const defaults: SiteSettings = {
  phone: "0704129211",
  email: "paulndolo1972@gmail.com",
  whatsapp: "254704129211",
  youtube_url: "https://www.youtube.com/@GLOBALPOWERCHURCH",
  facebook_url: "https://www.facebook.com/groups/1202497280341977",
  logo_url: "/images/gpc-logo.jpg",
  church_name: "Global Power Church",
  tagline: "Empowering Lives Through Faith",
  address: "Nairobi, Kenya",
  primary_color: "300 60% 35%",
  secondary_color: "43 80% 50%",
  services: [
    { title: "Sunday Service", day: "Every Sunday", time: "Main Service", description: "Main Sunday Service" },
    { title: "Thursday Prayers", day: "Every Thursday", time: "4:00–6:00 PM", description: "Prayer Meeting" },
    { title: "Friday Kesha", day: "Every Friday", time: "Night Service", description: "All-Night Prayer" },
    { title: "Saturday Devotion", day: "Every Saturday", time: "6:00–7:00 AM", description: "Morning Devotion" },
  ],
  ministries: [
    { title: "Choir", description: "Worship through music and song" },
    { title: "Praise & Worship", description: "Leading the congregation in praise" },
    { title: "Dancers", description: "Dancing for the glory of God" },
    { title: "Youth Ministry", description: "Empowering the next generation" },
    { title: "Women Ministry", description: "Growing together in faith" },
    { title: "Men Ministry", description: "Building men of God" },
    { title: "Crusades", description: "Evangelism and outreach" },
    { title: "Hospitality", description: "Welcoming and serving guests" },
    { title: "Conferences", description: "Annual conferences and events" },
  ],
};

// Global in-memory store so settings are shared across components without prop drilling
let _cachedSettings: SiteSettings = { ...defaults };
let _listeners: Array<() => void> = [];

function updateCache(partial: Partial<SiteSettings>) {
  _cachedSettings = { ..._cachedSettings, ...partial };
  _listeners.forEach(fn => fn());
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(_cachedSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to cache updates
    const listener = () => setSettings({ ..._cachedSettings });
    _listeners.push(listener);

    const fetchSettings = async () => {
      try {
        const response = await apiService.getSiteSettings();
        if (response.data) {
          const data = response.data as any;
          const merged: Partial<SiteSettings> = {};
          // Handle array format [{key, value}] or flat object
          if (Array.isArray(data)) {
            data.forEach((item: any) => { (merged as any)[item.key] = item.value; });
          } else if (data.results && Array.isArray(data.results)) {
            data.results.forEach((item: any) => { (merged as any)[item.key] = item.value; });
          } else {
            Object.assign(merged, data);
          }
          // Parse JSON strings for arrays
          if (typeof merged.services === "string") {
            try { merged.services = JSON.parse(merged.services); } catch { delete merged.services; }
          }
          if (typeof merged.ministries === "string") {
            try { merged.ministries = JSON.parse(merged.ministries); } catch { delete merged.ministries; }
          }
          updateCache(merged);
        }
      } catch (e) {
        // Silently use defaults on error
      }
      setLoading(false);
    };

    fetchSettings();

    return () => {
      _listeners = _listeners.filter(fn => fn !== listener);
    };
  }, []);

  return { settings, loading };
}

export { defaults as siteSettingsDefaults };
