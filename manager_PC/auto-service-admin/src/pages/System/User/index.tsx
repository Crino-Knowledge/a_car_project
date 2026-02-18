import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Avatar,
  Badge,
  Tooltip,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  KeyOutlined,
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import styles from './index.less';

const { Option } = Select;
const { Text } = Typography;

interface UserItem {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive';
  roles: string[];
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({
    username: '',
    phone: '',
    status: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: UserItem[] = [
    { id: 1, username: 'admin', nickname: '系统管理员', phone: '13800138000', email: 'admin@example.com', status: 'active', roles: ['admin'], createdAt: '2024-01-01' },
    { id: 2, username: 'operator1', nickname: '运营张三', phone: '13800138001', email: 'zhangsan@example.com', status: 'active', roles: ['operator'], createdAt: '2024-01-02' },
    { id: 3, username: 'operator2', nickname: '运营李四', phone: '13800138002', email: 'lisi@example.com', status: 'active', roles: ['operator'], createdAt: '2024-01-03' },
    { id: 4, username: 'analyst1', nickname: '分析员王五', phone: '13800138003', email: 'wangwu@example.com', status: 'inactive', roles: ['analyst'], createdAt: '2024-01-04' },
    { id: 5, username: 'shop1', nickname: '门店A店长', phone: '13800138004', email: 'shopA@example.com', status: 'active', roles: ['shop'], createdAt: '2024-01-05' },
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟数据加载
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredData = [...mockData];

      if (searchParams.username) {
        filteredData = filteredData.filter(item =>
          item.username.includes(searchParams.username) || item.nickname.includes(searchParams.username)
        );
      }
      if (searchParams.phone) {
        filteredData = filteredData.filter(item => item.phone.includes(searchParams.phone));
      }
      if (searchParams.status) {
        filteredData = filteredData.filter(item => item.status === searchParams.status);
      }

      setDataSource(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<UserItem> | SorterResult<UserItem>[]
  ) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleReset = () => {
    setSearchParams({ username: '', phone: '', status: '' });
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: UserItem) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleToggleStatus = async (record: UserItem) => {
    try {
      message.success(`已${record.status === 'active' ? '禁用' : '启用'}用户 ${record.nickname}`);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleResetPassword = async (record: UserItem) => {
    try {
      message.success(`已重置用户 ${record.nickname} 的密码，新密码已发送至其手机`);
    } catch (error) {
      message.error('重置密码失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        message.success('修改成功');
      } else {
        message.success('新增成功，初始密码已发送至用户手机');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<UserItem> = [
    {
      title: '用户信息',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record) => (
        <Space>
          <Avatar
            src={record.avatar}
            icon={<UserOutlined />}
            style={{ background: '#475569' }}
          />
          <div>
            <Text strong>{record.nickname}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space>
          {roles.map(role => (
            <Tag key={role} color={role === 'admin' ? 'red' : role === 'operator' ? 'blue' : 'green'}>
              {role === 'admin' ? '管理员' : role === 'operator' ? '运营' : role === 'analyst' ? '分析员' : '门店'}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={status === 'active' ? '启用' : '禁用'}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定${record.status === 'active' ? '禁用' : '启用'}该用户吗？`}
            onConfirm={() => handleToggleStatus(record)}
          >
            <Button type="link" size="small" danger={record.status === 'active'}>
              {record.status === 'active' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
          <Tooltip title="重置密码">
            <Button
              type="link"
              size="small"
              icon={<KeyOutlined />}
              onClick={() => handleResetPassword(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card>
        {/* 搜索区域 */}
        <div className={styles.searchBar}>
          <Space wrap>
            <Input
              placeholder="账号/昵称"
              value={searchParams.username}
              onChange={e => setSearchParams(prev => ({ ...prev, username: e.target.value }))}
              style={{ width: 150 }}
              prefix={<SearchOutlined />}
              allowClear
            />
            <Input
              placeholder="手机号"
              value={searchParams.phone}
              onChange={e => setSearchParams(prev => ({ ...prev, phone: e.target.value }))}
              style={{ width: 150 }}
              allowClear
            />
            <Select
              placeholder="状态"
              value={searchParams.status || undefined}
              onChange={value => setSearchParams(prev => ({ ...prev, status: value || '' }))}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增用户
          </Button>
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="账号"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input placeholder="请输入账号" disabled={!!editingUser} />
          </Form.Item>
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="roles"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select mode="multiple" placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="operator">运营</Option>
              <Option value="analyst">分析员</Option>
              <Option value="shop">门店</Option>
            </Select>
          </Form.Item>
          {!editingUser && (
            <Form.Item>
              <Text type="secondary">
                <LockOutlined /> 新增用户后将自动生成初始密码并发送至用户手机
              </Text>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
