# 汽服配件采购报价系统 - 门店端微信小程序

## 项目开发对话记录

### 项目概述

开发"汽服配件采购报价系统"的门店端微信小程序，实现门店发布采购需求、接收多家供应商匿名报价、在线比价并确认成交的全流程线上化管理。

### 技术栈

| 技术项 | 选型 |
|--------|------|
| 开发框架 | Taro 3.x |
| 开发语言 | TypeScript |
| UI组件库 | @tarojs/components + 自定义组件 |
| 状态管理 | Redux Toolkit |
| 样式方案 | Sass/SCSS |
| 网络请求 | Taro.request 封装 |
| 构建工具 | Taro CLI + Webpack |

---

## 开发过程记录

### 第一阶段：需求分析与项目规划

用户提供了完整的HTML规格文档，描述了门店端微信小程序的功能需求：

1. **用户认证模块**：微信授权登录、手机号绑定
2. **采购发布模块**：配件信息录入、时间选择、附件上传
3. **报价查看模块**：匿名供应商展示、多维度排序
4. **订单管理模块**：状态追踪、收货确认、评价反馈

### 第二阶段：项目初始化

#### 创建的配置文件

- `package.json` - 项目依赖配置
- `project.config.json` - 微信小程序配置（AppID: touristappid）
- `tsconfig.json` - TypeScript 配置
- `config/index.ts` - Taro 构建主配置
- `config/dev.ts` - 开发环境配置
- `config/prod.ts` - 生产环境配置
- `babel.config.js` - Babel 配置

#### 项目结构

```
src/
├── app.tsx                 # 应用入口
├── app.config.ts           # 全局配置
├── app.scss                # 全局样式
├── pages/                  # 页面目录
│   ├── index/              # 首页
│   ├── login/              # 登录
│   ├── purchase/           # 采购模块
│   │   ├── create/         # 发布采购
│   │   ├── list/           # 采购列表
│   │   └── detail/         # 采购详情
│   ├── quote/              # 报价模块
│   │   ├── list/           # 报价列表
│   │   └── detail/         # 报价详情
│   └── order/              # 订单模块
│       ├── detail/         # 订单详情
│       └── receive/        # 收货确认
├── components/             # 公共组件
├── services/               # API 服务
├── store/                  # Redux 状态管理
├── types/                  # TypeScript 类型
├── utils/                  # 工具函数
└── assets/                 # 静态资源
```

### 第三阶段：核心功能开发

#### 1. 类型定义 (`src/types/`)

- `api.ts` - API 响应类型
- `purchase.ts` - 采购单类型
- `quote.ts` - 报价类型
- `order.ts` - 订单类型

#### 2. 工具函数 (`src/utils/`)

- `constants.ts` - 状态常量定义
- `storage.ts` - 本地存储封装
- `validator.ts` - 表单验证规则
- `format.ts` - 格式化工具

#### 3. 网络请求层 (`src/services/`)

- `request.ts` - 请求封装，支持：
  - 请求/响应拦截器
  - 自动重试机制（最多3次）
  - Token 自动注入
  - 错误统一处理

#### 4. Mock 数据服务 (`src/services/mock/`)

- `auth.ts` - 用户认证模拟
- `purchase.ts` - 采购数据模拟
- `quote.ts` - 报价数据模拟
- `order.ts` - 订单数据模拟

#### 5. Redux 状态管理 (`src/store/`)

- `slices/user.ts` - 用户状态
- `slices/purchase.ts` - 采购状态
- `slices/order.ts` - 订单状态

#### 6. 公共组件 (`src/components/`)

- `StatusTag` - 状态标签
- `EmptyState` - 空状态
- `Loading` - 加载状态
- `Modal` - 模态框
- `OrderTimeline` - 订单时间线
- `UploadFile` - 文件上传

#### 7. 页面实现

| 页面 | 功能 |
|------|------|
| `pages/index` | 首页统计、最近采购 |
| `pages/login` | 微信授权、手机号绑定 |
| `pages/purchase/create` | 采购发布表单 |
| `pages/purchase/list` | 采购单列表 |
| `pages/purchase/detail` | 采购详情、报价对比 |
| `pages/quote/list` | 报价列表 |
| `pages/quote/detail` | 报价详情 |
| `pages/order/detail` | 订单状态时间线 |
| `pages/order/receive` | 收货确认、评价 |

### 第四阶段：问题排查与修复

#### 问题1：JSX 语法不支持

**错误信息**：
```
Support for the experimental syntax 'jsx' isn't currently enabled
```

**解决方案**：
创建 `babel.config.js` 配置文件：
```javascript
module.exports = {
  presets: [
    ['taro', {
      framework: 'react',
      ts: true
    }]
  ]
}
```

#### 问题2：TypeScript 类型文件无法解析

**错误信息**：
```
resolve '@/types/purchase' - doesn't exist
```

**解决方案**：
将 `.d.ts` 文件重命名为 `.ts` 文件，因为 Webpack 无法直接将 `.d.ts` 文件作为模块解析。

### 第五阶段：构建与验证

#### 构建命令

```bash
npm run dev:weapp
```

#### 构建结果

- 编译成功，耗时约 4.84 秒
- 构建产物大小：约 2.4MB
- 主包大小符合微信小程序限制（< 2MB）

---

## API 接口清单

| 接口名称 | 方法 | 路径 | 说明 |
|----------|------|------|------|
| 微信登录授权 | POST | /api/auth/wechat-login | 获取用户标识并绑定手机号 |
| 采购发布 | POST | /api/purchase/create | 提交新的采购需求单 |
| 历史订单查询 | GET | /api/purchase/list | 分页获取采购记录 |
| 采购详情 | GET | /api/purchase/detail | 获取采购单详情 |
| 报价列表获取 | GET | /api/quote/list | 查询某采购单下的供应商报价 |
| 成交操作 | POST | /api/order/confirm-supplier | 确认中标供应商 |
| 订单状态查询 | GET | /api/order/status | 实时获取订单当前履约阶段 |
| 收货确认 | POST | /api/order/receive | 完成收货流程并提交单号 |
| 评价提交 | POST | /api/feedback/submit | 提交供应商评价 |

---

## 使用说明

### 开发环境

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev:weapp
```

3. 使用微信开发者工具导入 `dist` 目录

### 生产构建

```bash
npm run build:weapp
```

---

## 注意事项

1. 所有文件上传使用 `Taro.uploadFile` 单独调用专用接口
2. 关键操作需前端弹窗二次确认
3. 网络异常时接口具备自动重试机制（最多3次）
4. 匿名投标机制在前端进行供应商ID映射处理（供应商A/B/C）

---

## 文件清单

### 配置文件
- `package.json` - 项目依赖
- `tsconfig.json` - TypeScript 配置
- `project.config.json` - 微信小程序配置
- `babel.config.js` - Babel 配置
- `config/index.ts` - Taro 主配置
- `config/dev.ts` - 开发环境配置
- `config/prod.ts` - 生产环境配置

### 源代码
- `src/app.tsx` - 应用入口
- `src/app.config.ts` - 路由配置
- `src/app.scss` - 全局样式
- `src/types/*.ts` - 类型定义
- `src/utils/*.ts` - 工具函数
- `src/services/*.ts` - API 服务
- `src/services/mock/*.ts` - Mock 数据
- `src/store/*.ts` - Redux 配置
- `src/store/slices/*.ts` - 状态切片
- `src/components/**/*.tsx` - 公共组件
- `src/pages/**/*.tsx` - 页面组件

---

## 开发完成时间

2026年2月18日

## GitHub 仓库

https://github.com/Crino-Knowledge/a_car_project
