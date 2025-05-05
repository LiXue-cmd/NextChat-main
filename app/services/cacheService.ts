// NextChat/app/services/cacheService.ts
import Cookies from 'js-cookie';
const CACHE_KEY = 'nextchat-cache-data';
const CACHE_EXPIRATION_TIME = 60 * 1000; // 1分钟

export async function fetchCacheData(forceRefresh = false) {
    try {
        // 检查本地缓存
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTimestamp = localStorage.getItem(`${CACHE_KEY}-timestamp`);
        
        const isCacheValid = 
            cachedData && 
            cacheTimestamp && 
            Date.now() - parseInt(cacheTimestamp) < CACHE_EXPIRATION_TIME;
            
        if (!forceRefresh && isCacheValid) {
            console.log('Using cached data');
            return JSON.parse(cachedData);
        }
        
        // 从服务器获取数据
        const response = await fetch('http://140.143.208.64:8080/system/aiLog/getLog',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Cookies.get('token')
            },
            body: JSON.stringify({ messageId: Cookies.get('amis_id') }),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch cache data');
        }
        
        const data = await response.json();
        
        // 缓存数据到本地存储
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(`${CACHE_KEY}-timestamp`, Date.now().toString());
        
        return data;
    } catch (error) {
        console.error('Error fetching cache data:', error);
        throw error;
    }
}