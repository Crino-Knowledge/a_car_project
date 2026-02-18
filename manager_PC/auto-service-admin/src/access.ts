// 权限定义 - 简化版本，不依赖 umi 插件
export interface AccessKeys {
  isLogin: boolean;
  isAdmin: boolean;
  isOperator: boolean;
  isAnalyst: boolean;
  canManageUser: boolean;
  canManageShop: boolean;
  canManageSupplier: boolean;
  canManageBrand: boolean;
  canManageCategory: boolean;
  canManagePurchase: boolean;
  canManageBid: boolean;
  canManageOrder: boolean;
}

// 获取当前用户的权限
export function getAccess(): AccessKeys {
  const userInfoStr = localStorage.getItem('userInfo');
  let roles: string[] = [];

  if (userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      roles = userInfo.roles || [];
    } catch (e) {
      console.error('解析用户信息失败', e);
    }
  }

  return {
    // 是否已登录
    isLogin: !!userInfoStr,
    // 系统管理员
    isAdmin: roles.includes('admin'),
    // 运营人员
    isOperator: roles.includes('operator') || roles.includes('admin'),
    // 数据分析人员
    isAnalyst: roles.includes('analyst') || roles.includes('admin'),
    // 用户管理权限
    canManageUser: roles.includes('admin'),
    // 店铺管理权限
    canManageShop: roles.includes('admin') || roles.includes('operator'),
    // 供应商管理权限
    canManageSupplier: roles.includes('admin') || roles.includes('operator'),
    // 品牌管理权限
    canManageBrand: roles.includes('admin') || roles.includes('operator'),
    // 分类管理权限
    canManageCategory: roles.includes('admin') || roles.includes('operator'),
    // 采购管理权限
    canManagePurchase: roles.includes('admin') || roles.includes('operator'),
    // 应标管理权限
    canManageBid: roles.includes('admin') || roles.includes('operator'),
    // 订单管理权限
    canManageOrder: roles.includes('admin') || roles.includes('operator'),
  };
}

export default getAccess;
