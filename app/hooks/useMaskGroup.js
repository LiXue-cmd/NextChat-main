// hooks/useMaskGroup.js
import { useModelStore } from '../context/ModelContext';

export const useMaskGroup = () => {
  const { groups, loading, error } = useModelStore();
  
  return { groups, loading, error };
};