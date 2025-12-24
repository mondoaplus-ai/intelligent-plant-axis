import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SystemSettings, defaultSettings } from '@/types/settings';

interface SettingsState {
  settings: SystemSettings;
  updateSettings: (section: keyof SystemSettings, data: Partial<SystemSettings[keyof SystemSettings]>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (section, data) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [section]: {
              ...state.settings[section],
              ...data,
            },
          },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
