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
  Descriptions,
  message,
  Typography,
  Badge,
  Tooltip,
  Progress,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  BellOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const { Option } = Select;
const { Text, Title } = Typography;

interface PurchaseItem {
  id: number;
  shopId: number;
  shopName: string;
  partName: string;
  quantity: number;
  budget: number;
  status: 'pending' | 'quoted' | 'ordered' | 'completed';
  deadline: string;
  createdAt: string;
  description?: string;
  contact?: string;
  attachments?: string[];
}

const PurchaseManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<PurchaseItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState({ shopName: '', partName: '', status: '' });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<PurchaseItem | null>(null);

  // 模拟数据
  const mockData: PurchaseItem[] = [
    { id: 1, shopId: 1, shopName: '华信汽修中心', partName: '博世刹车片（前轮）', quantity: 10, budget: 2500, status: 'pending', deadline: '2024-01-20 18:00', createdAt: '2024-01-15 10:00', description: '适用于大众帕萨特 B8', contact: '张经理 13800138001' },
    { id: 2, shopId: 2, shopName: '德兴汽车维修店', partName: '德尔福火花塞套装', quantity: 20, budget: 1800, status: 'quoted', deadline: '2024-01-19 12:00', createdAt: '2024-01-14 09:30', description: '型号：DF-1008' },
    { id: 3, shopId: 3, shopName: '金轮汽配服务部', partName: '大陆轮胎 205/55R16', quantity: 4, budget: 2400, status: 'ordered', deadline: '2024-01-18 10:00', createdAt: '2024-01-13 14:00' },
    { id: 4, shopId: 1, shopName: '华信汽修中心', partName: '机油滤清器', quantity: 50, budget: 1500, status: 'completed', deadline: '2024-01-17 18:00', createdAt: '2024-01-12 11:00' },
    { id: 5, shopId: 4, shopName: '顺风汽车养护中心', partName: '电装空调压缩机', quantity: 2, budget: 3600, status: 'pending', deadline: '2024-01-21 16:00', createdAt: '2024-01-15 08:00', description: '丰田卡罗拉专用' },
    { id: 6, shopId: 5, shopName: '恒通汽修厂', partName: '采埃孚变速箱油', quantity: 10, budget: 4500, status: 'pending', deadline: '2024-01-22 12:00', createdAt: '2024-01-15 09:00' },
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredData = [...mockData];

      if (searchParams.shopName) {
        filteredData = filteredData.filter(item => item.shopName.includes(searchParams.shopName));
      }
      if (searchParams.partName) {
        filteredData = filteredData.filter(item => item.partName.includes(searchParams.partName));
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

  const handleView = (record: PurchaseItem) => {
    setCurrentPurchase(record);
    setDetailVisible(true);
  };

  const handleRemind = (record: PurchaseItem) => {
    message.success(`已向相关供应商发送提醒通知`);
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'orange', text: '待应标' },
      quoted: { color: 'blue', text: '已报价' },
      ordered: { color: 'cyan', text: '已下单' },
      completed: { color: 'green', text: '已完成' },
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const getDeadlineProgress = (deadline: string) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const totalHours = 72; // 假设采购周期为72小时
    const remaining = Math.max(0, deadlineTime - now);
    const progress = Math.round((remaining / (totalHours * 60 * 60 * 1000)) * 100);
    return Math.min(100, Math.max(0, progress));
  };

  const columns: ColumnsType<PurchaseItem> = [
    {
      title: '采购单号',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <Text code>PO{String(id).padStart(6, '0')}</Text>,
    },
    {
      title: '门店名称',
      dataIndex: 'shopName',
      key: 'shopName',
    },
    {
      title: '配件名称',
      dataIndex: 'partName',
      key: 'partName',
      ellipsis: true,
    },
    {
      title: '需求数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (qty: number) => <Tag color="blue">{qty} 件</Tag>,
    },
    {
      title: '预算金额',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (budget: number) => <Text strong style={{ color: '#ef4444' }}>¥{budget.toLocaleString()}</Text>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '报价截止',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline: string, record) => (
        <Space direction="vertical" size={0}>
          <Text>{deadline}</Text>
          {record.status === 'pending' && (
            <Progress
              percent={getDeadlineProgress(deadline)}
              size="small"
              showInfo={false}
              strokeColor={getDeadlineProgress(deadline) < 30 ? '#ef4444' : '#10b981'}
            />
          )}
        </Space>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          {record.status === 'pending' && (
            <Tooltip title="提醒供应商报价">
              <Button type="link" size="small" icon={<BellOutlined />} onClick={() => handleRemind(record)}>
                提醒
              </Button>
            </Tooltip>
          )}
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
              placeholder="门店名称"
              value={searchParams.shopName}
              onChange={e => setSearchParams(prev => ({ ...prev, shopName: e.target.value }))}
              style={{ width: 150 }}
              allowClear
            />
            <Input
              placeholder="配件名称"
              value={searchParams.partName}
              onChange={e => setSearchParams(prev => ({ ...prev, partName: e.target.value }))}
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
              <Option value="pending">待应标</Option>
              <Option value="quoted">已报价</Option>
              <Option value="ordered">已下单</Option>
              <Option value="completed">已完成</Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>查询</Button>
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

      {/* 详情弹窗 */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            采购单详情
          </Space>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {currentPurchase && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="采购单号" span={2}>
              <Text code>PO{String(currentPurchase.id).padStart(6, '0')}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="门店名称">{currentPurchase.shopName}</Descriptions.Item>
            <Descriptions.Item label="状态">{getStatusTag(currentPurchase.status)}</Descriptions.Item>
            <Descriptions.Item label="配件名称" span={2}>{currentPurchase.partName}</Descriptions.Item>
            <Descriptions.Item label="需求数量">{currentPurchase.quantity} 件</Descriptions.Item>
            <Descriptions.Item label="预算金额">
              <Text strong style={{ color: '#ef4444' }}>¥{currentPurchase.budget.toLocaleString()}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="报价截止">{currentPurchase.deadline}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{currentPurchase.createdAt}</Descriptions.Item>
            {currentPurchase.description && (
              <Descriptions.Item label="需求描述" span={2}>{currentPurchase.description}</Descriptions.Item>
            )}
            {currentPurchase.contact && (
              <Descriptions.Item label="联系方式" span={2}>{currentPurchase.contact}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PurchaseManagement;
