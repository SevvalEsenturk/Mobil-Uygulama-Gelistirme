import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

export interface AppUsageItem {
  name: string;
  package: string;
  minutes: number;
  emoji: string;
  limit: number;
}

const STORAGE_KEY = 'child_app_usages';
const LAST_ACTIVE_KEY = 'child_last_active_time';

const DEFAULT_USAGES: AppUsageItem[] = [
  {name: 'Instagram', package: 'com.instagram.android', minutes: 25, emoji: '📸', limit: 60},
  {name: 'YouTube', package: 'com.google.android.youtube', minutes: 45, emoji: '▶️', limit: 120},
  {name: 'WhatsApp', package: 'com.whatsapp', minutes: 15, emoji: '💬', limit: 90},
  {name: 'Brawl Stars', package: 'com.supercell.brawlstars', minutes: 30, emoji: '🎮', limit: 45},
  {name: 'Chrome', package: 'com.android.chrome', minutes: 10, emoji: '🌐', limit: 30},
];

class UsageService {
  /**
   * Fetches the current usage stats.
   * Calculates realistic background usage based on the time elapsed since the last open.
   */
  async getAppUsages(): Promise<AppUsageItem[]> {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      const lastActiveStr = await AsyncStorage.getItem(LAST_ACTIVE_KEY);
      const now = Date.now();

      let currentUsages: AppUsageItem[] = storedData ? JSON.parse(storedData) : [...DEFAULT_USAGES];

      if (lastActiveStr) {
        const lastActive = parseInt(lastActiveStr, 10);
        const elapsedSeconds = Math.floor((now - lastActive) / 1000);
        
        // If some time has passed, simulate realistic usage accumulation
        if (elapsedSeconds > 10) { // Check if more than 10 seconds passed
          const elapsedMinutes = elapsedSeconds / 60;
          
          // Let's assume the child spends about 40% of their phone-unlocked time active on these apps
          const totalSimulatedMinutes = Math.min(60, elapsedMinutes * 0.4); 

          if (totalSimulatedMinutes > 0.1) {
            // Distribute these simulated minutes randomly across apps
            currentUsages = currentUsages.map(app => {
              // Different weights for different apps
              let weight = 0.1;
              if (app.name === 'YouTube') weight = 0.4;
              if (app.name === 'Instagram') weight = 0.25;
              if (app.name === 'Brawl Stars') weight = 0.2;
              
              const addedMinutes = Math.round(totalSimulatedMinutes * weight * 10) / 10;
              return {
                ...app,
                minutes: Math.round((app.minutes + addedMinutes) * 10) / 10,
              };
            });

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentUsages));
          }
        }
      }

      await AsyncStorage.setItem(LAST_ACTIVE_KEY, now.toString());
      return currentUsages;
    } catch (error) {
      console.error('Failed to load usage stats:', error);
      return DEFAULT_USAGES;
    }
  }

  /**
   * Resets the usage stats (e.g. at the start of a new day)
   */
  async resetUsages(): Promise<AppUsageItem[]> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USAGES));
      await AsyncStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      return [...DEFAULT_USAGES];
    } catch (error) {
      console.error('Failed to reset usages:', error);
      return DEFAULT_USAGES;
    }
  }

  /**
   * Synchronizes usage data with the backend
   */
  async syncUsagesWithBackend(usages: AppUsageItem[]): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    const promises = usages.map(item =>
      apiClient.post('/usage/stats', {
        app_name: item.name,
        package_name: item.package,
        usage_minutes: Math.round(item.minutes),
        usage_date: today,
      })
    );

    await Promise.all(promises);
  }
}

export const usageService = new UsageService();
