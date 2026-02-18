# 项目归档说明

## 文件列表

- `supplier-portal.part_aa` - 项目分卷压缩包(第一卷)

## 解压方法

将所有分卷文件下载到同一目录后，执行以下命令合并并解压：

```bash
# 合并分卷
cat supplier-portal.part_* > supplier-portal.tar

# 解压
tar -xvf supplier-portal.tar

# 安装依赖
cd supplier-portal
npm install

# 启动开发服务器
npm run dev
```

## 项目信息

- **项目名称**: 汽服配件采购报价系统 - 供应商端PC网页
- **技术栈**: Vue 3 + Vite + TypeScript + Element Plus + Pinia
- **创建时间**: 2026-02-18

## 测试账号

- 用户名: `admin`
- 密码: `123456`
