import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  message,
  Popconfirm,
  Upload,
  Avatar,
  Image,
  Typography,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import styles from './index.less';

const { Text } = Typography;
const { TextArea } = Input;

interface BrandItem {
  id: number;
  name: string;
  logo: string;
  description: string;
  referenceCount: number;
  createdAt: string;
}

const BrandManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<BrandItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: BrandItem[] = [
    { id: 1, name: '博世 (BOSCH)', logo: 'https://via.placeholder.com/100x100?text=BOSCH', description: '德国博世集团，全球领先的汽车技术供应商', referenceCount: 156, createdAt: '2024-01-01' },
    { id: 2, name: '电装 (DENSO)', logo: 'https://via.placeholder.com/100x100?text=DENSO', description: '日本电装公司，丰田集团旗下零部件供应商', referenceCount: 128, createdAt: '2024-01-02' },
    { id: 3, name: '大陆 (Continental)', logo: 'https://via.placeholder.com/100x100?text=CONTI', description: '德国大陆集团，全球知名汽车零部件供应商', referenceCount: 98, createdAt: '2024-01-03' },
    { id: 4, name: '德尔福 (Delphi)', logo: 'https://via.placeholder.com/100x100?text=DELPHI', description: '美国德尔福，全球汽车电子技术领导者', referenceCount: 85, createdAt: '2024-01-04' },
    { id: 5, name: '采埃孚 (ZF)', logo: 'https://via.placeholder.com/100x100?text=ZF', description: '德国采埃孚集团，全球领先的传动与底盘技术供应商', referenceCount: 72, createdAt: '2024-01-05' },
    { id: 6, name: '法雷奥 (Valeo)', logo: 'https://via.placeholder.com/100x100?text=VALEO', description: '法国法雷奥集团，全球顶级汽车零部件供应商', referenceCount: 65, createdAt: '2024-01-06' },
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, searchKeyword]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredData = [...mockData];

      if (searchKeyword) {
        filteredData = filteredData.filter(item =>
          item.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
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
    setEditingBrand(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: BrandItem) => {
    setEditingBrand(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number, name: string) => {
    try {
      message.success(`已删除品牌: ${name}`);
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingBrand) {
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

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.jpg,.jpeg,.png',
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB');
        return false;
      }
      message.info(`正在上传: ${file.name}`);
      return false;
    },
  };

  const columns: ColumnsType<BrandItem> = [
    {
      title: '品牌Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 100,
      render: (logo: string, record) => (
        <Avatar
          shape="square"
          size={56}
          src={logo}
          icon={<TagOutlined />}
          style={{ background: '#f0f0f0' }}
        />
      ),
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <TagOutlined style={{ color: '#475569' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: '品牌描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '引用次数',
      dataIndex: 'referenceCount',
      key: 'referenceCount',
      width: 100,
      render: (count: number) => (
        <Tag color={count > 100 ? 'green' : count > 50 ? 'blue' : 'default'}>
          {count} 次
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title={
              record.referenceCount > 0
                ? `该品牌正被 ${record.referenceCount} 个采购单引用，删除后采购单将失去品牌关联，确定删除吗？`
                : '确定删除该品牌吗？'
            }
            onConfirm={() => handleDelete(record.id, record.name)}
          >
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
          <Space>
            <Input
              placeholder="搜索品牌名称"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
              allowClear
            />
            <Button type="primary" onClick={handleSearch}>查询</Button>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增品牌</Button>
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
            showTotal: total => `共 ${total} 个品牌`,
          }}
          onChange={(pag) => setPagination(prev => ({ ...prev, current: pag.current || 1, pageSize: pag.pageSize || 10 }))}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingBrand ? '编辑品牌' : '新增品牌'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="品牌名称" rules={[{ required: true, message: '请输入品牌名称' }]}>
            <Input placeholder="请输入品牌名称" maxLength={50} />
          </Form.Item>
          <Form.Item label="品牌Logo">
            <Space direction="vertical">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>上传Logo</Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: 12 }}>
                建议尺寸: 100x100 像素，支持 JPG、PNG 格式，大小不超过 2MB
              </Text>
              {editingBrand?.logo && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">当前Logo:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Avatar
                      shape="square"
                      size={64}
                      src={editingBrand.logo}
                      icon={<TagOutlined />}
                    />
                  </div>
                </div>
              )}
            </Space>
          </Form.Item>
          <Form.Item name="description" label="品牌描述">
            <TextArea
              placeholder="请输入品牌描述"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandManagement;
