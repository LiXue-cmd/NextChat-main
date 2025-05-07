// pages/login.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // 组件挂载时检查Cookie
  useEffect(() => {
    const storedUsername = Cookies.get('username');
    const storedPassword = Cookies.get('password');
    const storedRememberMe = Cookies.get('rememberMe') === 'true';
    
    if (storedRememberMe && storedUsername) {
      setUsername(storedUsername);
      setPassword(storedPassword || '');
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    // 原有的登录逻辑...
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      const res = await fetch('http://140.143.208.64:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe }),
      });
      
      if(rememberMe){
        Cookies.set('username', username);
        Cookies.set('password', password);
        Cookies.set('rememberMe', rememberMe);
      }else{
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove('rememberMe');
      }

      const data = await res.json();
      if (data.code == 200) {
        Cookies.set('token', 'Bearer ' + data.token);
        router.push('/');
      } else {
        setError('用户名或密码错误');
      }
    } catch (error) {
      setError('登录失败，请稍后重试');
    }
  };

  return (
    // 原有的JSX结构...
    <div className={styles.login} style={{ width: '100%', height: '100vh', boxSizing: 'border-box' }}>
      <div className={styles.loginForm} style={{ width: '260px', padding: '80px 35px', border: '1px solid #ccc' }}>
        <h1 className="{styles.title}" style={{ textAlign: 'center' }}>系统登录</h1>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', marginTop: '30px' }}>
            <label htmlFor="username" style={{ width: '60px' }}>
              用户名
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ height: '26px', border: '1px solid rgb(29, 147, 171)' }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="fa fa-user" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '20px' }}>
            <label htmlFor="password" style={{ width: '60px' }}>
              密码
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ height: '26px', border: '1px solid rgb(29, 147, 171)' }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="fa fa-lock" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between" style={{ marginTop: '20px', float: 'left' }}>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: '14px', height: '14px' }}
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-600 text-sm" style={{ color: '#292828', fontSize: '14px' }}>
                记住密码
              </label>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
            style={{ marginTop: '20px', width: '250px', height: '35px', backgroundColor: 'rgb(29, 147, 171)', border: 'none', borderRadius: '5px', color: 'white' }}
          >
            <i className="fa fa-sign-in mr-2" /> 登 录
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;