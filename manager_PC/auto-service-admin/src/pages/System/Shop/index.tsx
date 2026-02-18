import React, { useState, useEffect } from 'react';
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
  Upload,
  Dropdown,
  Typography,
  Badge,
  Descriptions,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  EyeOutlined,
  ShopOutlined,
  LinkOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import styles from './index.less';

const { Option } = Select;
const { Text, Title } = Typography;

interface ShopItem {
  id: number;
  name: string;
  manager: string;
  phone: string;
  address: string;
  businessHours: string;
  contractStatus: 'active' | 'inactive' | 'expired';
  userId?: number;
  username?: string;
  createdAt: string;
}

const ShopManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ShopItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState({ name: '', contractStatus: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingShop, setEditingShop] = useState<ShopItem | null>(null);
  const [currentShop, setCurrentShop] = useState<ShopItem | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: ShopItem[] = [
    { id: 1, name: '华信汽修中心', manager: '张经理', phone: '13800138001', address: '北京市朝阳区建国路88号', businessHours: '08:00-20:00', contractStatus: 'active', userId: 5, username: 'shop1', createdAt: '2024-01-01' },
    { id: 2, name: '德兴汽车维修店', manager: '李经理', phone: '13800138002', address: '上海市浦东新区陆家嘴环路100号', businessHours: '09:00-18:00', contractStatus: 'active', userId: 6, username: 'shop2', createdAt: '2024-01-02' },
    { id: 3, name: '金轮汽配服务部', manager: '王经理', phone: '13800138003', address: '广州市天河区天河路385号', businessHours: '08:30-19:00', contractStatus: 'expired', createdAt: '2024-01-03' },
    { id: 4, name: '顺风汽车养护中心', manager: '赵经理', phone: '13800138004', address: '深圳市南山区科技园南路18号', businessHours: '08:00-21:00', contractStatus: 'active', createdAt: '2024-01-04' },
    { id: 5, name: '恒通汽修厂', manager: '陈经理', phone: '13800138005', address: '成都市武侯区人民南路四段1号', businessHours: '09:00-18:00', contractStatus: 'inactive', createdAt: '2024-01-05' },
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredData = [...mockData];

      if (searchParams.name) {
        filteredData = filteredData.filter(item =>
          item.name.includes(searchParams.name) || item.manager.includes(searchParams.name)
        );
      }
      if (searchParams.contractStatus) {
        filteredData = filteredData.filter(item => item.contractStatus === searchParams.contractStatus);
      }

      setDataSource(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleAdd = () => {
    setEditingShop(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: ShopItem) => {
    setEditingShop(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: ShopItem) => {
    setCurrentShop(record);
    setDetailVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingShop) {
        message.success('修改成功');
      } else {
        message.success('新增成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleExport = () => {
    message.info('正在导出数据...');
    // 实际项目中调用导出接口
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.xlsx,.xls',
    showUploadList: false,
    beforeUpload: (file) => {
      message.info(`正在导入文件: ${file.name}`);
      return false;
    },
  };

  const getContractStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      active: { color: 'green', text: '有效' },
      inactive: { color: 'default', text: '未生效' },
      expired: { color: 'red', text: '已过期' },
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const columns: ColumnsType<ShopItem> = [
    {
      title: '门店名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <ShopOutlined style={{ color: '#475569' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '营业时间',
      dataIndex: 'businessHours',
      key: 'businessHours',
    },
    {
      title: '合同状态',
      dataIndex: 'contractStatus',
      key: 'contractStatus',
      render: (status: string) => getContractStatusTag(status),
    },
    {
      title: '关联账号',
      dataIndex: 'username',
      key: 'username',
      render: (username?: string) => username ? (
        <Tag icon={<LinkOutlined />} color="blue">{username}</Tag>
      ) : (
        <Text type="secondary">未关联</Text>
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
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该门店吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
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
              placeholder="门店名称/负责人"
              value={searchParams.name}
              onChange={e => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
              style={{ width: 180 }}
              prefix={<SearchOutlined />}
              allowClear
            />
            <Select
              placeholder="合同状态"
              value={searchParams.contractStatus || undefined}
              onChange={value => setSearchParams(prev => ({ ...prev, contractStatus: value || '' }))}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="active">有效</Option>
              <Option value="inactive">未生效</Option>
              <Option value="expired">已过期</Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>查询</Button>
          </Space>
          <Space>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>导入</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增门店</Button>
          </Space>
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
            showTotal: total => `共 ${total} 条记录`,
          }}
          onChange={(pag) => setPagination(prev => ({ ...prev, current: pag.current || 1, pageSize: pag.pageSize || 10 }))}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingShop ? '编辑门店' : '新增门店'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="门店名称" rules={[{ required: true, message: '请输入门店名称' }]}>
            <Input placeholder="请输入门店名称" />
          </Form.Item>
          <Form.Item name="manager" label="负责人" rules={[{ required: true, message: '请输入负责人姓名' }]}>
            <Input placeholder="请输入负责人姓名" />
          </Form.Item>
          <Form.Item name="phone" label="联系方式" rules={[{ required: true, message: '请输入联系方式' }]}>
            <Input placeholder="请输入联系方式" />
          </Form.Item>
          <Form.Item name="address" label="地址" rules={[{ required: true, message: '请输入地址' }]}>
            <Input.TextArea placeholder="请输入详细地址" rows={2} />
          </Form.Item>
          <Form.Item name="businessHours" label="营业时间" rules={[{ required: true, message: '请输入营业时间' }]}>
            <Input placeholder="例如: 08:00-20:00" />
          </Form.Item>
          <Form.Item name="contractStatus" label="合同状态" rules={[{ required: true, message: '请选择合同状态' }]}>
            <Select placeholder="请选择合同状态">
              <Option value="active">有效</Option>
              <Option value="inactive">未生效</Option>
              <Option value="expired">已过期</Option>
            </Select>
          </Form.Item>
          {editingShop && (
            <Form.Item name="userId" label="关联用户账号">
              <Select placeholder="选择要关联的用户账号" allowClear showSearch>
                <Option value={5}>shop1 - 门店A店长</Option>
                <Option value={6}>shop2 - 门店B店长</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="门店详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {currentShop && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="门店名称" span={2}>{currentShop.name}</Descriptions.Item>
            <Descriptions.Item label="负责人">{currentShop.manager}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{currentShop.phone}</Descriptions.Item>
            <Descriptions.Item label="地址" span={2}>{currentShop.address}</Descriptions.Item>
            <Descriptions.Item label="营业时间">{currentShop.businessHours}</Descriptions.Item>
            <Descriptions.Item label="合同状态">{getContractStatusTag(currentShop.contractStatus)}</Descriptions.Item>
            <Descriptions.Item label="关联账号">{currentShop.username || '未关联'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentShop.createdAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ShopManagement;
