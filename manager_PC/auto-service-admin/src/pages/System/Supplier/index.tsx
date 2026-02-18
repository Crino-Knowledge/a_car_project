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
  Typography,
  Badge,
  Descriptions,
  Steps,
  Result,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import styles from './index.less';

const { Option } = Select;
const { Text, Title } = Typography;
const { TextArea } = Input;

interface SupplierItem {
  id: number;
  name: string;
  region: string;
  address: string;
  manager: string;
  phone: string;
  email: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  userId?: number;
  username?: string;
  licenseUrl?: string;
  rejectReason?: string;
  createdAt: string;
}

const SupplierManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<SupplierItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState({ name: '', region: '', status: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierItem | null>(null);
  const [currentSupplier, setCurrentSupplier] = useState<SupplierItem | null>(null);
  const [auditForm] = Form.useForm();
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: SupplierItem[] = [
    { id: 1, name: '华信汽配供应商', region: '华北', address: '北京市朝阳区建国路88号', manager: '张总', phone: '13900139001', email: 'huaxin@supplier.com', status: 'approved', userId: 10, username: 'supplier1', createdAt: '2024-01-01' },
    { id: 2, name: '德兴配件批发', region: '华东', address: '上海市浦东新区陆家嘴环路100号', manager: '李总', phone: '13900139002', email: 'dexing@supplier.com', status: 'approved', userId: 11, username: 'supplier2', createdAt: '2024-01-02' },
    { id: 3, name: '金轮汽车配件', region: '华南', address: '广州市天河区天河路385号', manager: '王总', phone: '13900139003', email: 'jinlun@supplier.com', status: 'reviewing', createdAt: '2024-01-03' },
    { id: 4, name: '顺风汽配服务', region: '华南', address: '深圳市南山区科技园南路18号', manager: '赵总', phone: '13900139004', email: 'shunfeng@supplier.com', status: 'pending', createdAt: '2024-01-04' },
    { id: 5, name: '恒通配件供应商', region: '西南', address: '成都市武侯区人民南路四段1号', manager: '陈总', phone: '13900139005', email: 'hengtong@supplier.com', status: 'rejected', rejectReason: '营业执照过期', createdAt: '2024-01-05' },
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
      if (searchParams.region) {
        filteredData = filteredData.filter(item => item.region === searchParams.region);
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

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData();
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: SupplierItem) => {
    setEditingSupplier(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleView = (record: SupplierItem) => {
    setCurrentSupplier(record);
    setDetailVisible(true);
  };

  const handleAudit = (record: SupplierItem) => {
    setCurrentSupplier(record);
    auditForm.resetFields();
    setAuditVisible(true);
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
      if (editingSupplier) {
        message.success('修改成功');
      } else {
        message.success('新增成功，请等待审核');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleAuditSubmit = async () => {
    try {
      const values = await auditForm.validateFields();
      message.success(`已${values.status === 'approved' ? '通过' : '拒绝'}审核`);
      setAuditVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.jpg,.jpeg,.png,.pdf',
    showUploadList: false,
    beforeUpload: (file) => {
      message.info(`正在上传文件: ${file.name}`);
      return false;
    },
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'default', text: '待提交' },
      reviewing: { color: 'processing', text: '审核中' },
      approved: { color: 'success', text: '已通过' },
      rejected: { color: 'error', text: '已拒绝' },
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const columns: ColumnsType<SupplierItem> = [
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <TeamOutlined style={{ color: '#475569' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '所属地区',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '负责人',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '关联账号',
      dataIndex: 'username',
      key: 'username',
      render: (username?: string) => username ? <Tag color="blue">{username}</Tag> : <Text type="secondary">未关联</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          {record.status === 'reviewing' && (
            <Button type="link" size="small" icon={<CheckCircleOutlined />} onClick={() => handleAudit(record)}>
              审核
            </Button>
          )}
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除该供应商吗？" onConfirm={() => handleDelete(record.id)}>
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
              placeholder="供应商名称/负责人"
              value={searchParams.name}
              onChange={e => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
              style={{ width: 180 }}
              prefix={<SearchOutlined />}
              allowClear
            />
            <Select
              placeholder="所属地区"
              value={searchParams.region || undefined}
              onChange={value => setSearchParams(prev => ({ ...prev, region: value || '' }))}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="华北">华北</Option>
              <Option value="华东">华东</Option>
              <Option value="华南">华南</Option>
              <Option value="西南">西南</Option>
              <Option value="西北">西北</Option>
            </Select>
            <Select
              placeholder="审核状态"
              value={searchParams.status || undefined}
              onChange={value => setSearchParams(prev => ({ ...prev, status: value || '' }))}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="pending">待提交</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已拒绝</Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>查询</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增供应商</Button>
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
        title={editingSupplier ? '编辑供应商' : '新增供应商'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="供应商名称" rules={[{ required: true, message: '请输入供应商名称' }]}>
            <Input placeholder="请输入供应商名称" />
          </Form.Item>
          <Form.Item name="region" label="所属地区" rules={[{ required: true, message: '请选择所属地区' }]}>
            <Select placeholder="请选择所属地区">
              <Option value="华北">华北</Option>
              <Option value="华东">华东</Option>
              <Option value="华南">华南</Option>
              <Option value="西南">西南</Option>
              <Option value="西北">西北</Option>
            </Select>
          </Form.Item>
          <Form.Item name="address" label="详细地址" rules={[{ required: true, message: '请输入详细地址' }]}>
            <Input.TextArea placeholder="请输入详细地址" rows={2} />
          </Form.Item>
          <Form.Item name="manager" label="负责人" rules={[{ required: true, message: '请输入负责人姓名' }]}>
            <Input placeholder="请输入负责人姓名" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}>
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email', message: '请输入正确的邮箱' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="资质文件">
            <Upload {...uploadProps}>
              <Button icon={<FileTextOutlined />}>上传营业执照</Button>
            </Upload>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>支持 JPG、PNG、PDF 格式</Text>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="供应商详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {currentSupplier && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="供应商名称" span={2}>{currentSupplier.name}</Descriptions.Item>
            <Descriptions.Item label="所属地区">{currentSupplier.region}</Descriptions.Item>
            <Descriptions.Item label="审核状态">{getStatusTag(currentSupplier.status)}</Descriptions.Item>
            <Descriptions.Item label="详细地址" span={2}>{currentSupplier.address}</Descriptions.Item>
            <Descriptions.Item label="负责人">{currentSupplier.manager}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{currentSupplier.phone}</Descriptions.Item>
            <Descriptions.Item label="邮箱" span={2}>{currentSupplier.email}</Descriptions.Item>
            <Descriptions.Item label="关联账号">{currentSupplier.username || '未关联'}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{currentSupplier.createdAt}</Descriptions.Item>
            {currentSupplier.rejectReason && (
              <Descriptions.Item label="拒绝原因" span={2}>
                <Text type="danger">{currentSupplier.rejectReason}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* 审核弹窗 */}
      <Modal
        title="资质审核"
        open={auditVisible}
        onOk={handleAuditSubmit}
        onCancel={() => setAuditVisible(false)}
        width={500}
      >
        {currentSupplier && (
          <>
            <Descriptions column={1} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="供应商名称">{currentSupplier.name}</Descriptions.Item>
              <Descriptions.Item label="负责人">{currentSupplier.manager}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentSupplier.phone}</Descriptions.Item>
            </Descriptions>
            <Form form={auditForm} layout="vertical">
              <Form.Item name="status" label="审核结果" rules={[{ required: true, message: '请选择审核结果' }]}>
                <Select placeholder="请选择审核结果">
                  <Option value="approved">通过</Option>
                  <Option value="rejected">拒绝</Option>
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
              >
                {({ getFieldValue }) =>
                  getFieldValue('status') === 'rejected' ? (
                    <Form.Item name="reason" label="拒绝原因" rules={[{ required: true, message: '请输入拒绝原因' }]}>
                      <TextArea placeholder="请输入拒绝原因" rows={3} />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SupplierManagement;
