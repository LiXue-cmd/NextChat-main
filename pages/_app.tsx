// pages/_app.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserProvider } from '../src/contexts/user';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAuthenticated = false; // 从 localStorage 或 cookie 获取登录状态

  useEffect(() => {
    // 未登录用户重定向到登录页
    if (!isAuthenticated && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;