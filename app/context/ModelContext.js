// context/ModelContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { getModelState, subscribe, initializeModels } from '../store/modelStore';

// 创建模型上下文
const ModelContext = createContext();

// 模型提供者组件
export const ModelProvider = ({ children }) => {
  const [state, setState] = useState(getModelState());
  
  // 初始化模型数据并订阅变化
  useEffect(() => {
    // 订阅数据变化
    const unsubscribe = subscribe(() => {
      setState(getModelState());
    });
    
    // 初始化数据
    initializeModels();
    
    // 清理订阅
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <ModelContext.Provider value={state}>
      {children}
    </ModelContext.Provider>
  );
};

// 自定义 Hook 用于获取模型数据
export const useModelStore = () => {
  return useContext(ModelContext);
};  