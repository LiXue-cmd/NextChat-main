// store/modelStore.js
import Cookies from 'js-cookie';

// 全局模型状态
let modelState = {
  groups: [],         // 存储模型数据
  loading: true,      // 加载状态
  error: null,        // 错误信息
  initialized: false, // 是否已初始化
  subscribers: []     // 订阅者列表
};

// 初始化模型数据（只执行一次）
export const initializeModels = async () => {
  // 如果已经初始化，直接返回
  if (modelState.initialized) return;
  
  // 标记为正在加载
  modelState.loading = true;
  
  try {
    const response = await fetch(
      'http://140.143.208.64:8080/system/model/getUserModelByLogin',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token') || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code === 200 && Array.isArray(data.data)) {
      // 处理并存储模型数据
      modelState.groups = data.data.map(model => ({
        ...model,
        // 格式化数据（根据需要调整）
        displayName: model.name,
        available: model.isEnable === "1",
      }));
      modelState.error = null;
    } else if (data.code === 401) {
      window.location.href = '/login';
    } else {
      throw new Error(data.msg || 'Invalid API response format');
    }
  } catch (err) {
    modelState.error = err instanceof Error ? err.message : 'Something went wrong';
  } finally {
    modelState.loading = false;
    modelState.initialized = true;
    
    // 通知所有订阅者数据已更新
    modelState.subscribers.forEach(subscriber => subscriber());
    modelState.subscribers = []; // 清空订阅者列表
  }
};

// 订阅模型数据变化
export const subscribe = (callback) => {
  // 如果数据已初始化，立即回调
  if (modelState.initialized) {
    callback();
    return () => {}; // 空的取消订阅函数
  }
  
  // 否则添加到订阅者列表
  modelState.subscribers.push(callback);
  
  // 返回取消订阅函数
  return () => {
    modelState.subscribers = modelState.subscribers.filter(
      subscriber => subscriber !== callback
    );
  };
};

// 获取当前模型状态
export const getModelState = () => {
  return modelState;
};