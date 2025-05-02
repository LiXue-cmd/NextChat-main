// components/LogoutButton.tsx
import React from 'react';
import { useRouter } from 'next/router';

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = () => {
    // 清除 token
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // 重定向到登录页
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className="text-gray-700 hover:text-primary">
      <i className="fa fa-sign-out mr-1" /> 退出登录
    </button>
  );
};

export default LogoutButton;