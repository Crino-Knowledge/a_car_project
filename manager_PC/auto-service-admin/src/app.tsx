import React from 'react';
import { history } from 'umi';
import './global.less';

// 简单的应用入口
export function onRouteChange({ location }: any) {
  // 简单的路由守卫
  const token = localStorage.getItem('token');
  if (!token && location.pathname !== '/login') {
    history.push('/login');
  }
}
