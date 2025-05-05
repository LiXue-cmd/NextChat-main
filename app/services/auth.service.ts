// app/services/auth.service.ts
import Cookies from 'js-cookie';

export const TOKEN_KEY = 'nextchat_token';

export const AuthService = {
  setToken(token: string) {
    Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true });
  },
  
  getToken() {
    return Cookies.get(TOKEN_KEY);
  },
  
  removeToken() {
    Cookies.remove(TOKEN_KEY);
  },
  
  isAuthenticated() {
    return !!Cookies.get(TOKEN_KEY);
  }
};