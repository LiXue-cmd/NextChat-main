// app/services/api.service.ts
import { AuthService } from './auth.service';

export abstract class ApiService {
  protected async fetch<T>(url: string, options: RequestInit = {}): Promise<T | null> {
    try {
      const token = AuthService.getToken();
      const headers = new Headers(options.headers);
      
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
      }
      
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json() as T;
    } catch (error) {
      console.error('API request failed:', error);
      return null;
    }
  }
}