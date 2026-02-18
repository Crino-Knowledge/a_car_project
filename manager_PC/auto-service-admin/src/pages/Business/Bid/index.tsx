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
  Row,
  Col,
  Statistic,
  DatePicker,
  Alert,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  WarningOutlined,
  TrophyOutlined,
  TeamOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Title } = Typography;

interface BidItem {
  id: number;
  purchaseId: number;
  supplierId: number;
  supplierName: string;
  partName: string;
  price: number;
  quantity: number;
  status: 'pending' | 'won' | 'lost';
  bidTime: string;
  isAbnormal: boolean;
  abnormalReason?: string;
}

interface BidStats {
  totalBids: number;
  avgResponseTime: string;
  highestPrice: number;
  lowestPrice: number;
}

const BidManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<BidItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState({
    purchaseId: '',
    supplierName: '',
    status: '',
  });
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentBid, setCurrentBid] = useState<BidItem | null>(null);
  const [stats, setStats] = useState<BidStats>({
    totalBids: 0,
    avgResponseTime: '0',
    highestPrice: 0,
    lowestPrice: 0,
  });

  // 模拟数据
  const mockData: BidItem[] = [
    { id: 1, purchaseId: 1, supplierId: 1, supplierName: '华信汽配供应商', partName: '博世刹车片（前轮）', price: 2300, quantity: 10, status: 'won', bidTime: '2024-01-15 14:30', isAbnormal: false },
    { id: 2, purchaseId: 1, supplierId: 2, supplierName: '德兴配件批发', partName: '博世刹车片（前轮）', price: 2450, quantity: 10, status: 'lost', bidTime: '2024-01-15 15:00', isAbnormal: false },
    { id: 3, purchaseId: 2, supplierId: 1, supplierName: '华信汽配供应商', partName: '德尔福火花塞套装', price: 1650, quantity: 20, status: 'pending', bidTime: '2024-01-14 16:00', isAbnormal: false },
    { id: 4, purchaseId: 2, supplierId: 3, supplierName: '金轮汽车配件', partName: '德尔福火花塞套装', price: 800, quantity: 20, status: 'pending', bidTime: '2024-01-14 16:30', isAbnormal: true, abnormalReason: '报价异常偏低，低于市场价50%' },
    { id: 5, purchaseId: 3, supplierId: 2, supplierName: '德兴配件批发', partName: '大陆轮胎 205/55R16', price: 2200, quantity: 4, status: 'won', bidTime: '2024-01-13 11:00', isAbnormal: false },
    { id: 6, purchaseId: 4, supplierId: 1, supplierName: '华信汽配供应商', partName: '机油滤清器', price: 1350, quantity: 50, status: 'won', bidTime: '2024-01-12 14:00', isAbnormal: false },
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredData = [...mockData];

      if (searchParams.purchaseId) {
        filteredData = filteredData.filter(item =>
          String(item.purchaseId).includes(searchParams.purchaseId)
        );
      }
      if (searchParams.supplierName) {
        filteredData = filteredData.filter(item =>
          item.supplierName.includes(searchParams.supplierName)
        );
      }
      if (searchParams.status) {
        filteredData = filteredData.filter(item => item.status === searchParams.status);
      }

      setDataSource(filteredData);
      setPagination(prev => ({ ...prev, total: filteredData.length }));

      // 计算统计数据
      const prices = filteredData.map(item => item.price);
      setStats({
        totalBids: filteredData.length,
        avgResponseTime: '2.5小时',
        highestPrice: Math.max(...prices) || 0,
        lowestPrice: Math.min(...prices) || 0,
      });
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

  const handleView = (record: BidItem) => {
    setCurrentBid(record);
    setDetailVisible(true);
  };

  const handleMarkAbnormal = (record: BidItem) => {
    message.success(`已标记投标 #${record.id} 为异常`);
    fetchData();
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'processing', text: '待定' },
      won: { color: 'success', text: '已中标' },
      lost: { color: 'default', text: '未中标' },
    };
    return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
  };

  const columns: ColumnsType<BidItem> = [
    {
      title: '采购单号',
      dataIndex: 'purchaseId',
      key: 'purchaseId',
      render: (id: number) => <Text code>PO{String(id).padStart(6, '0')}</Text>,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      render: (text: string) => (
        <Space>
          <TeamOutlined style={{ color: '#475569' }} />
          {text}
        </Space>
      ),
    },
    {
      title: '配件名称',
      dataIndex: 'partName',
      key: 'partName',
      ellipsis: true,
    },
    {
      title: '报价金额',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record) => (
        <Text
          strong
          style={{
            color: record.isAbnormal ? '#ef4444' : '#10b981',
          }}
        >
          ¥{price.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => `${qty} 件`,
    },
    {
      title: '中标状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '投标时间',
      dataIndex: 'bidTime',
      key: 'bidTime',
    },
    {
      title: '异常标记',
      dataIndex: 'isAbnormal',
      key: 'isAbnormal',
      render: (isAbnormal: boolean, record) =>
        isAbnormal ? (
          <Tooltip title={record.abnormalReason}>
            <Tag icon={<WarningOutlined />} color="error">异常</Tag>
          </Tooltip>
        ) : (
          <Tag>正常</Tag>
        ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            详情
          </Button>
          {!record.isAbnormal && record.status === 'pending' && (
            <Button type="link" size="small" danger onClick={() => handleMarkAbnormal(record)}>
              标记异常
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总投标次数"
              value={stats.totalBids}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均响应时长"
              value={stats.avgResponseTime}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="最高报价"
              value={stats.highestPrice}
              prefix="¥"
              valueStyle={{ color: '#ef4444' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="最低报价"
              value={stats.lowestPrice}
              prefix="¥"
              valueStyle={{ color: '#10b981' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* 搜索区域 */}
        <div className={styles.searchBar}>
          <Space wrap>
            <Input
              placeholder="采购单号"
              value={searchParams.purchaseId}
              onChange={e => setSearchParams(prev => ({ ...prev, purchaseId: e.target.value }))}
              style={{ width: 130 }}
              allowClear
            />
            <Input
              placeholder="供应商名称"
              value={searchParams.supplierName}
              onChange={e => setSearchParams(prev => ({ ...prev, supplierName: e.target.value }))}
              style={{ width: 150 }}
              allowClear
            />
            <Select
              placeholder="中标状态"
              value={searchParams.status || undefined}
              onChange={value => setSearchParams(prev => ({ ...prev, status: value || '' }))}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="pending">待定</Option>
              <Option value="won">已中标</Option>
              <Option value="lost">未中标</Option>
            </Select>
            <RangePicker onChange={(_, dateStrings) => setDateRange(dateStrings as [string, string])} />
            <Button type="primary" onClick={handleSearch}>查询</Button>
          </Space>
        </div>

        {/* 异常监控提示 */}
        {dataSource.filter(item => item.isAbnormal).length > 0 && (
          <Alert
            message={`发现 ${dataSource.filter(item => item.isAbnormal).length} 条异常投标记录，请及时处理`}
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

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
        title="投标详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {currentBid && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="投标ID">{currentBid.id}</Descriptions.Item>
            <Descriptions.Item label="采购单号">
              <Text code>PO{String(currentBid.purchaseId).padStart(6, '0')}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="供应商">{currentBid.supplierName}</Descriptions.Item>
            <Descriptions.Item label="中标状态">{getStatusTag(currentBid.status)}</Descriptions.Item>
            <Descriptions.Item label="配件名称" span={2}>{currentBid.partName}</Descriptions.Item>
            <Descriptions.Item label="报价金额">
              <Text strong style={{ color: currentBid.isAbnormal ? '#ef4444' : '#10b981' }}>
                ¥{currentBid.price.toLocaleString()}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="数量">{currentBid.quantity} 件</Descriptions.Item>
            <Descriptions.Item label="单价">
              ¥{(currentBid.price / currentBid.quantity).toFixed(2)}/件
            </Descriptions.Item>
            <Descriptions.Item label="投标时间">{currentBid.bidTime}</Descriptions.Item>
            {currentBid.isAbnormal && (
              <Descriptions.Item label="异常原因" span={2}>
                <Text type="danger">{currentBid.abnormalReason}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default BidManagement;
