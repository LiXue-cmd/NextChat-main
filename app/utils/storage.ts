// utils/storage.ts
export const safeStorage = {
    getItem(key: string) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('Failed to get item from storage:', e);
        return null;
      }
    },
    
    setItem(key: string, value: string) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('Failed to set item in storage:', e);
      }
    },
    
    removeItem(key: string) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('Failed to remove item from storage:', e);
      }
    },
  };