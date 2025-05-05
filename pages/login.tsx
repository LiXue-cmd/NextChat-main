// pages/login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';
import Cookies from 'js-cookie';

console.log('styles', styles)
const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // 模拟登录验证
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      // 实际项目中这里应该调用后端 API
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
        Cookies.remove("username")
        Cookies.remove("password")
        Cookies.remove('rememberMe')
      }
      // query:"{\"amis_id\":\"amis_yQp2WQ\",\"amis_tag\":\"local_knowledge\"}"
      // redirect:"/index"
      // token
      // res.setHeader('Set-Cookie', `token=${token}; Path=/; Max-Age=3600*24*7`);
      const data = await res.json();
      if (data.code == 200) {        
        Cookies.set('amis_id',JSON.parse(data.query).amis_id)
        Cookies.set('token', 'Bearer ' + data.token)
        router.push('/'); // 登录成功后跳转到聊天页面
      } else {
        setError('用户名或密码错误');
      }
    } catch (error) {
      setError('登录失败，请稍后重试');
    }
  };

  return (
    <div
      className={styles.login} style={{ width: '100%', height: '100vh', boxSizing: 'border-box' }}>
      <div className="{styles.login-form}" style={{ width: '260px', padding: '50px 30px', border: '1px solid #ccc' }}>
        {/* 顶部 Logo 和标题 */}
        {/* <div className="bg-blue-500 p-6 text-center"> */}
        <h1 className="{styles.title}" style={{ textAlign: 'center' }}>系统登录</h1>
        {/* </div> */}

        {/* 登录表单 */}
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
                style={{ height: '26px', border: '1px solid #306EF3' }}
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
                style={{ height: '26px', border: '1px solid #306EF3' }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <i className="fa fa-lock" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between" style={{ marginTop: '20px' }}>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-600 text-sm">
                记住密码
              </label>
            </div>
            {/* <a href="#" className="text-blue-500 text-sm hover:text-blue-700">
              忘记密码?
            </a> */}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
            style={{ marginTop: '20px', width: '250px', height: '35px', backgroundColor: '#306EF3', border: 'none', borderRadius: '5px', color: 'white' }}
          >
            <i className="fa fa-sign-in mr-2" /> 登 录
          </button>
        </div>

        {/* 底部信息 */}
        {/* <div className="bg-gray-100 p-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} NextChat. 保留所有权利.</p>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;