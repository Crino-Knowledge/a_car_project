import { request } from './request';

// ==================== 类型定义 ====================
export interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
  remember?: boolean;
}

export interface UserItem {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ShopItem {
  id: number;
  name: string;
  manager: string;
  phone: string;
  address: string;
  businessHours: string;
  contractStatus: 'active' | 'inactive' | 'expired';
  userId?: number;
  createdAt: string;
}

export interface SupplierItem {
  id: number;
  name: string;
  region: string;
  address: string;
  manager: string;
  phone: string;
  email: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  userId?: number;
  createdAt: string;
}

export interface BrandItem {
  id: number;
  name: string;
  logo: string;
  description: string;
  referenceCount: number;
  createdAt: string;
}

export interface CategoryItem {
  id: number;
  name: string;
  parentId: number | null;
  children?: CategoryItem[];
  attributes?: { name: string; type: string }[];
  sort: number;
  createdAt: string;
}

export interface PurchaseItem {
  id: number;
  shopId: number;
  shopName: string;
  partName: string;
  quantity: number;
  budget: number;
  status: 'pending' | 'quoted' | 'ordered' | 'completed';
  deadline: string;
  createdAt: string;
}

export interface BidItem {
  id: number;
  purchaseId: number;
  supplierId: number;
  supplierName: string;
  price: number;
  status: 'pending' | 'won' | 'lost';
  bidTime: string;
  isAbnormal: boolean;
}

export interface OrderItem {
  id: string;
  shopId: number;
  shopName: string;
  supplierId: number;
  supplierName: string;
  amount: number;
  status: 'pending_shipment' | 'shipped' | 'completed' | 'abnormal';
  createdAt: string;
  completedAt?: string;
}

// ==================== 认证相关 ====================
export async function login(params: LoginParams) {
  return request.post<{ token: string; user: API.CurrentUser }>('/auth/login', params);
}

export async function logout() {
  return request.post('/auth/logout');
}

export async function getCurrentUser() {
  return request.get<{ data: API.CurrentUser }>('/auth/current');
}

export async function refreshToken() {
  return request.post<{ token: string }>('/auth/refresh');
}

// ==================== 统计相关 ====================
export async function getStatisticsOverview() {
  return request.get('/statistics/overview');
}

export async function getPartsProportion(params?: { startDate?: string; endDate?: string }) {
  return request.get('/statistics/parts-proportion', params);
}

export async function getDealTrend(params?: { startDate?: string; endDate?: string; type?: 'day' | 'month' | 'quarter' }) {
  return request.get('/statistics/deal-trend', params);
}

export async function getPriceComparison(params?: { startDate?: string; endDate?: string }) {
  return request.get('/statistics/price-comparison', params);
}

// ==================== 待办相关 ====================
export async function getUnhandledPurchaseCount() {
  return request.get('/todo/unhandled-purchase');
}

export async function getPendingAuditCount() {
  return request.get('/vendor/pending-audit');
}

export async function getAbnormalOrderCount() {
  return request.get('/order/abnormal-count');
}

export async function getMessageList(params?: API.PageParams) {
  return request.get('/message/list', params);
}

// ==================== 用户管理 ====================
export async function getUserList(params?: { current?: number; pageSize?: number; username?: string; phone?: string; status?: string }) {
  return request.get<API.PageResult<UserItem>>('/user/list', params);
}

export async function createUser(data: Partial<UserItem>) {
  return request.post('/user/create', data);
}

export async function updateUser(id: number, data: Partial<UserItem>) {
  return request.put(`/user/update`, { id, ...data });
}

export async function toggleUserStatus(id: number) {
  return request.post(`/user/toggle-status/${id}`);
}

export async function resetUserPassword(id: number) {
  return request.post(`/user/reset-password/${id}`);
}

// ==================== 店铺管理 ====================
export async function getShopList(params?: { current?: number; pageSize?: number; name?: string; status?: string }) {
  return request.get<API.PageResult<ShopItem>>('/shop/list', params);
}

export async function createShop(data: Partial<ShopItem>) {
  return request.post('/shop/create', data);
}

export async function updateShop(id: number, data: Partial<ShopItem>) {
  return request.put(`/shop/update`, { id, ...data });
}

export async function deleteShop(id: number) {
  return request.delete(`/shop/delete/${id}`);
}

export async function bindShopUser(shopId: number, userId: number) {
  return request.post('/shop/bind-user', { shopId, userId });
}

export async function importShops(file: File) {
  return request.upload('/shop/import', file);
}

export async function exportShops(params?: any) {
  return request.download('/shop/export', params, '门店列表.xlsx');
}

// ==================== 供应商管理 ====================
export async function getSupplierList(params?: { current?: number; pageSize?: number; name?: string; region?: string; status?: string }) {
  return request.get<API.PageResult<SupplierItem>>('/supplier/list', params);
}

export async function createSupplier(data: Partial<SupplierItem>) {
  return request.post('/supplier/create', data);
}

export async function updateSupplier(id: number, data: Partial<SupplierItem>) {
  return request.put(`/supplier/update`, { id, ...data });
}

export async function deleteSupplier(id: number) {
  return request.delete(`/supplier/delete/${id}`);
}

export async function auditSupplier(id: number, status: 'approved' | 'rejected', reason?: string) {
  return request.post(`/supplier/audit/${id}`, { status, reason });
}

// ==================== 品牌管理 ====================
export async function getBrandList(params?: { current?: number; pageSize?: number; name?: string }) {
  return request.get<API.PageResult<BrandItem>>('/brand/list', params);
}

export async function createBrand(data: Partial<BrandItem>) {
  return request.post('/brand/create', data);
}

export async function updateBrand(id: number, data: Partial<BrandItem>) {
  return request.put(`/brand/update`, { id, ...data });
}

export async function deleteBrand(id: number) {
  return request.delete(`/brand/delete`, { id });
}

// ==================== 配件分类管理 ====================
export async function getCategoryTree() {
  return request.get<CategoryItem[]>('/category/tree');
}

export async function createCategory(data: Partial<CategoryItem>) {
  return request.post('/category/create', data);
}

export async function updateCategory(id: number, data: Partial<CategoryItem>) {
  return request.put(`/category/update`, { id, ...data });
}

export async function deleteCategory(id: number) {
  return request.delete(`/category/delete/${id}`);
}

export async function sortCategory(data: { id: number; parentId?: number; sort: number }[]) {
  return request.post('/category/sort', data);
}

export async function updateCategoryAttributes(id: number, attributes: { name: string; type: string }[]) {
  return request.put('/category/attributes', { id, attributes });
}

// ==================== 采购管理 ====================
export async function getPurchaseList(params?: { current?: number; pageSize?: number; shopId?: number; partName?: string; status?: string }) {
  return request.get<API.PageResult<PurchaseItem>>('/purchase/list', params);
}

export async function getPurchaseDetail(id: number) {
  return request.get(`/purchase/detail`, { id });
}

export async function remindSupplier(purchaseId: number) {
  return request.post('/notification/remind-supplier', { purchaseId });
}

// ==================== 应标管理 ====================
export async function getBidList(params?: { current?: number; pageSize?: number; purchaseId?: number; supplierId?: number; status?: string }) {
  return request.get<API.PageResult<BidItem>>('/bid/list', params);
}

export async function getBidStats(params?: { startDate?: string; endDate?: string }) {
  return request.get('/bid/stats', params);
}

export async function markBidAbnormal(id: number, reason: string) {
  return request.post(`/bid/mark-abnormal/${id}`, { reason });
}

// ==================== 订单管理 ====================
export async function getOrderList(params?: { current?: number; pageSize?: number; shopId?: number; supplierId?: number; status?: string; keyword?: string }) {
  return request.get<API.PageResult<OrderItem>>('/order/list', params);
}

export async function getOrderDetail(id: string) {
  return request.get(`/order/detail`, { id });
}

export async function exportOrders(params?: any) {
  return request.download('/order/export', params, '订单列表.xlsx');
}

// ==================== 文件上传 ====================
export async function uploadFile(file: File, onProgress?: (progress: number) => void) {
  return request.upload<{ url: string; filename: string }>('/file/upload', file, onProgress);
}
