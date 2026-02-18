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
  Steps,
  Timeline,
  Image,
  Divider,
  Dropdown,
  Menu,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  ShoppingOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const { Option } = Select;
const { Text, Title } = Typography;

interface OrderItem {
  id: string;
  shopId: number;
  shopName: string;
  supplierId: number;
  supplierName: string;
  partName: string;
  quantity: number;
  amount: number;
  status: 'pending_shipment' | 'shipped' | 'completed' | 'abnormal';
  trackingNo?: string;
  createdAt: string;
  shippedAt?: string;
  completedAt?: string;
  abnormalReason?: string;
  photos?: string[];
  evaluation?: { rating: number; content: string };
}

const OrderManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<OrderItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    shopName: '',
    supplierName: '',
    status: '',
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderItem | null>(null);

  // 模拟数据
  const mockData: OrderItem[] = [
    { id: 'ORD2024001', shopId: 1, shopName: '华信汽修中心', supplierId: 1, supplierName: '华信汽配供应商', partName: '博世刹车片（前轮）', quantity: 10, amount: 23000, status: 'completed', trackingNo: 'SF1234567890', createdAt: '2024-01-15 10:00', shippedAt: '2024-01-16 09:00', completedAt: '2024-01-18 15:00', evaluation: { rating: 5, content: '配件质量很好，配送及时' } },
    { id: 'ORD2024002', shopId: 2, shopName: '德兴汽车维修店', supplierId: 2, supplierName: '德兴配件批发', partName: '大陆轮胎 205/55R16', quantity: 4, amount: 8800, status: 'shipped', trackingNo: 'YT9876543210', createdAt: '2024-01-14 14:00', shippedAt: '2024-01-15 11:00' },
    { id: 'ORD2024003', shopId: 3, shopName: '金轮汽配服务部', supplierId: 1, supplierName: '华信汽配供应商', partName: '机油滤清器', quantity: 50, amount: 67500, status: 'pending_shipment', createdAt: '2024-01-15 09:00' },
    { id: 'ORD2024004', shopId: 1, shopName: '华信汽修中心', supplierId: 3, supplierName: '金轮汽车配件', partName: '电装空调压缩机', quantity: 2, amount: 7200, status: 'abnormal', createdAt: '2024-01-13 16:00', abnormalReason: '送货单价格与报价不符，差异超过15%', shippedAt: '2024-01-14 10:00' },
    { id: 'ORD2024005', shopId: 4, shopName: '顺风汽车养护中心', supplierId: 2, supplierName: '德兴配件批发', partName: '采埃孚变速箱油', quantity: 10, amount: 42000, status: 'shipped', trackingNo: 'ZTO1122334455', createdAt: '2024-01-15 11:00', shippedAt: '2024-01-16 08:30' },
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filteredData = [...mockData];

      if (searchParams.keyword) {
        filteredData = filteredData.filter(item =>
          item.id.toLowerCase().includes(searchParams.keyword.toLowerCase())
        );
      }
      if (searchParams.shopName) {
        filteredData = filteredData.filter(item => item.shopName.includes(searchParams.shopName));
      }
      if (searchParams.supplierName) {
        filteredData = filteredData.filter(item => item.supplierName.includes(searchParams.supplierName));
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

  const handleView = (record: OrderItem) => {
    setCurrentOrder(record);
    setDetailVisible(true);
  };

  const handleExport = () => {
    message.info('正在导出订单数据...');
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
      pending_shipment: { color: 'orange', text: '待发货', icon: <ClockCircleOutlined /> },
      shipped: { color: 'blue', text: '已发货', icon: <CarOutlined /> },
      completed: { color: 'green', text: '已完成', icon: <CheckCircleOutlined /> },
      abnormal: { color: 'red', text: '异常', icon: <ExclamationCircleOutlined /> },
    };
    const item = statusMap[status];
    return <Tag color={item?.color} icon={item?.icon}>{item?.text}</Tag>;
  };

  const getStatusStep = (status: string) => {
    const stepMap: Record<string, number> = {
      pending_shipment: 0,
      shipped: 1,
      completed: 2,
      abnormal: 1,
    };
    return stepMap[status] || 0;
  };

  const columns: ColumnsType<OrderItem> = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text code>{id}</Text>,
    },
    {
      title: '门店名称',
      dataIndex: 'shopName',
      key: 'shopName',
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '配件名称',
      dataIndex: 'partName',
      key: 'partName',
      ellipsis: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: '成交金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#ef4444' }}>¥{amount.toLocaleString()}</Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)}>
          详情
        </Button>
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
              placeholder="订单号"
              value={searchParams.keyword}
              onChange={e => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
              style={{ width: 140 }}
              allowClear
            />
            <Input
              placeholder="门店名称"
              value={searchParams.shopName}
              onChange={e => setSearchParams(prev => ({ ...prev, shopName: e.target.value }))}
              style={{ width: 130 }}
              allowClear
            />
            <Input
              placeholder="供应商"
              value={searchParams.supplierName}
              onChange={e => setSearchParams(prev => ({ ...prev, supplierName: e.target.value }))}
              style={{ width: 130 }}
              allowClear
            />
            <Select
              placeholder="状态"
              value={searchParams.status || undefined}
              onChange={value => setSearchParams(prev => ({ ...prev, status: value || '' }))}
              style={{ width: 120 }}
              allowClear
            >
              <Option value="pending_shipment">待发货</Option>
              <Option value="shipped">已发货</Option>
              <Option value="completed">已完成</Option>
              <Option value="abnormal">异常</Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>查询</Button>
          </Space>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
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
            <ShoppingOutlined />
            订单详情
          </Space>
        }
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {currentOrder && (
          <>
            {/* 状态进度 */}
            <Steps
              current={getStatusStep(currentOrder.status)}
              status={currentOrder.status === 'abnormal' ? 'error' : 'process'}
              items={[
                { title: '待发货', icon: <ClockCircleOutlined /> },
                { title: '已发货', icon: <CarOutlined /> },
                { title: '已完成', icon: <CheckCircleOutlined /> },
              ]}
              style={{ marginBottom: 24 }}
            />

            <Descriptions column={2} bordered>
              <Descriptions.Item label="订单号" span={2}>
                <Text code>{currentOrder.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="门店名称">{currentOrder.shopName}</Descriptions.Item>
              <Descriptions.Item label="供应商">{currentOrder.supplierName}</Descriptions.Item>
              <Descriptions.Item label="配件名称" span={2}>{currentOrder.partName}</Descriptions.Item>
              <Descriptions.Item label="数量">{currentOrder.quantity} 件</Descriptions.Item>
              <Descriptions.Item label="成交金额">
                <Text strong style={{ color: '#ef4444' }}>¥{currentOrder.amount.toLocaleString()}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="订单状态">{getStatusTag(currentOrder.status)}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentOrder.createdAt}</Descriptions.Item>
              {currentOrder.trackingNo && (
                <Descriptions.Item label="物流单号" span={2}>
                  <Text copyable>{currentOrder.trackingNo}</Text>
                </Descriptions.Item>
              )}
              {currentOrder.shippedAt && (
                <Descriptions.Item label="发货时间">{currentOrder.shippedAt}</Descriptions.Item>
              )}
              {currentOrder.completedAt && (
                <Descriptions.Item label="完成时间">{currentOrder.completedAt}</Descriptions.Item>
              )}
              {currentOrder.abnormalReason && (
                <Descriptions.Item label="异常原因" span={2}>
                  <Text type="danger">{currentOrder.abnormalReason}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* 评价信息 */}
            {currentOrder.evaluation && (
              <>
                <Divider>用户评价</Divider>
                <div style={{ padding: '0 16px' }}>
                  <Space>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        style={{
                          fontSize: 20,
                          color: star <= currentOrder.evaluation!.rating ? '#f59e0b' : '#d9d9d9',
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <Text type="secondary">{currentOrder.evaluation.content}</Text>
                  </Space>
                </div>
              </>
            )}

            {/* 时间线 */}
            <Divider>操作日志</Divider>
            <Timeline
              items={[
                { color: 'green', children: `订单创建 - ${currentOrder.createdAt}` },
                currentOrder.shippedAt && { color: 'blue', children: `已发货 - ${currentOrder.shippedAt}` },
                currentOrder.completedAt && { color: 'green', children: `已完成 - ${currentOrder.completedAt}` },
                currentOrder.status === 'abnormal' && { color: 'red', children: `标记异常 - ${currentOrder.abnormalReason}` },
              ].filter(Boolean) as any}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;
