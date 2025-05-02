// pages/api/auth/login.ts
export default function handler(req, res) {
    const { username, password, rememberMe } = req.body;
  
    // 模拟验证逻辑
    if (username === 'admin' && password === '123456') {
      // 生成 token（实际项目中应该使用 JWT）
      const token = 'mock_token_123456';
      
      // 设置 cookie（如果选择记住我）
      if (rememberMe) {
        res.setHeader('Set-Cookie', `token=${token}; Path=/; Max-Age=3600*24*7`);
      }
      
      res.status(200).json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
  }