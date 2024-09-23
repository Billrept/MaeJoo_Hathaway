import { create } from "zustand";

/* 
  https://github.com/pmndrs/zustand
  Global state-management
*/

const useBearStore = create((set) => ({
  appName: 'MJ Hathaway',
  isDarkMode: false,
  setAppName: (state) => set({ appName: state }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
}));

export default useBearStore;
