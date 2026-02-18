import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

interface LoginFormValues {
  username: string;
  password: string;
  captcha?: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);

  // 检查登录失败次数
  useEffect(() => {
    const attempts = localStorage.getItem('loginAttempts');
    if (attempts && parseInt(attempts) >= 5) {
      setShowCaptcha(true);
      refreshCaptcha();
    }
  }, []);

  // 刷新验证码
  const refreshCaptcha = () => {
    setCaptchaUrl(`/api/auth/captcha?t=${Date.now()}`);
  };

  // 处理登录
  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      // 模拟登录请求
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        localStorage.removeItem('loginAttempts');
        setLoginAttempts(0);
        message.success('登录成功');
        history.push('/');
      } else {
        const error = await response.json();
        // 登录失败，增加计数
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());

        if (newAttempts >= 5) {
          setShowCaptcha(true);
          refreshCaptcha();
        }
        message.error(error.message || '账号或密码错误');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 演示模式：直接登录
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      // 模拟登录成功
      const mockUser = {
        id: 1,
        username: 'admin',
        nickname: '系统管理员',
        phone: '13800138000',
        email: 'admin@example.com',
        roles: ['admin'],
        permissions: ['*'],
      };
      const mockToken = 'mock_token_' + Date.now();

      localStorage.setItem('token', mockToken);
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      message.success('登录成功');
      history.push('/');
    } catch (error) {
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.bgPattern} />
      </div>
      <div className={styles.content}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>A</span>
            </div>
            <h1 className={styles.title}>汽服报价系统</h1>
            <p className={styles.subtitle}>后台管理端</p>
          </div>

          <Spin spinning={loading}>
            <Form
              form={form}
              onFinish={handleSubmit}
              initialValues={{ remember: true }}
              size="large"
              className={styles.form}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="请输入账号"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                />
              </Form.Item>

              {showCaptcha && (
                <Form.Item
                  name="captcha"
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <div className={styles.captchaWrapper}>
                    <Input
                      prefix={<SafetyOutlined className={styles.inputIcon} />}
                      placeholder="请输入验证码"
                      maxLength={4}
                    />
                    <img
                      src={captchaUrl}
                      alt="验证码"
                      className={styles.captchaImg}
                      onClick={refreshCaptcha}
                      title="点击刷新验证码"
                    />
                  </div>
                </Form.Item>
              )}

              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className={styles.submitBtn}
                >
                  登录
                </Button>
              </Form.Item>

              <div className={styles.demoHint}>
                <span>演示环境：</span>
                <Button type="link" onClick={handleDemoLogin} disabled={loading}>
                  一键登录
                </Button>
              </div>
            </Form>
          </Spin>

          <div className={styles.footer}>
            <p>Copyright 2024 汽服报价系统</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
