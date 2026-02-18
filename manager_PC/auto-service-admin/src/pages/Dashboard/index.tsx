import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, DatePicker, Select, Space, Spin, Empty, Typography } from 'antd';
import {
  ShoppingOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Title } = Typography;

interface OverviewData {
  totalPurchasePlans: number;
  totalOrders: number;
  totalShops: number;
  totalSuppliers: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface TrendData {
  date: string;
  count: number;
  amount: number;
}

interface PriceData {
  date: string;
  quotePrice: number;
  actualPrice: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [partsData, setPartsData] = useState<ChartData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [periodType, setPeriodType] = useState<'day' | 'month' | 'quarter'>('month');

  useEffect(() => {
    fetchAllData();
  }, [dateRange, periodType]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 模拟数据加载
      await new Promise(resolve => setTimeout(resolve, 800));

      // 模拟概览数据
      setOverviewData({
        totalPurchasePlans: 1256,
        totalOrders: 892,
        totalShops: 156,
        totalSuppliers: 89,
      });

      // 模拟配件占比数据
      setPartsData([
        { name: '发动机配件', value: 35 },
        { name: '制动系统', value: 25 },
        { name: '悬挂系统', value: 18 },
        { name: '电气系统', value: 12 },
        { name: '车身配件', value: 10 },
      ]);

      // 模拟成交趋势数据
      setTrendData([
        { date: '1月', count: 45, amount: 125000 },
        { date: '2月', count: 52, amount: 148000 },
        { date: '3月', count: 61, amount: 182000 },
        { date: '4月', count: 58, amount: 165000 },
        { date: '5月', count: 72, amount: 198000 },
        { date: '6月', count: 85, amount: 235000 },
        { date: '7月', count: 78, amount: 215000 },
        { date: '8月', count: 92, amount: 268000 },
        { date: '9月', count: 88, amount: 245000 },
        { date: '10月', count: 95, amount: 278000 },
        { date: '11月', count: 102, amount: 295000 },
        { date: '12月', count: 110, amount: 320000 },
      ]);

      // 模拟价格对比数据
      setPriceData([
        { date: '1月', quotePrice: 125000, actualPrice: 123000 },
        { date: '2月', quotePrice: 148000, actualPrice: 146500 },
        { date: '3月', quotePrice: 182000, actualPrice: 180000 },
        { date: '4月', quotePrice: 165000, actualPrice: 168000 },
        { date: '5月', quotePrice: 198000, actualPrice: 195000 },
        { date: '6月', quotePrice: 235000, actualPrice: 230000 },
        { date: '7月', quotePrice: 215000, actualPrice: 220000 },
        { date: '8月', quotePrice: 268000, actualPrice: 265000 },
        { date: '9月', quotePrice: 245000, actualPrice: 248000 },
        { date: '10月', quotePrice: 278000, actualPrice: 275000 },
        { date: '11月', quotePrice: 295000, actualPrice: 290000 },
        { date: '12月', quotePrice: 320000, actualPrice: 315000 },
      ]);
    } catch (error) {
      console.error('获取数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  // 配件占比饼图配置
  const getPieOption = () => ({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
    },
    series: [
      {
        name: '配件采购占比',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: partsData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: ['#475569', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'][index % 5],
          },
        })),
      },
    ],
  });

  // 成交趋势柱状图配置
  const getBarOption = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['成交订单数', '成交金额(万)'],
      top: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: trendData.map(item => item.date),
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数',
        position: 'left',
      },
      {
        type: 'value',
        name: '金额(万)',
        position: 'right',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '成交订单数',
        type: 'bar',
        data: trendData.map(item => item.count),
        itemStyle: {
          color: '#475569',
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: '成交金额(万)',
        type: 'line',
        yAxisIndex: 1,
        data: trendData.map(item => Math.round(item.amount / 10000)),
        smooth: true,
        itemStyle: {
          color: '#0ea5e9',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(14, 165, 233, 0.3)' },
              { offset: 1, color: 'rgba(14, 165, 233, 0.05)' },
            ],
          },
        },
      },
    ],
  });

  // 价格对比折线图配置
  const getLineOption = () => ({
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['报价金额', '实际成交金额'],
      top: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: priceData.map(item => item.date),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}万',
      },
    },
    series: [
      {
        name: '报价金额',
        type: 'line',
        data: priceData.map(item => Math.round(item.quotePrice / 10000)),
        smooth: true,
        itemStyle: {
          color: '#475569',
        },
      },
      {
        name: '实际成交金额',
        type: 'line',
        data: priceData.map(item => Math.round(item.actualPrice / 10000)),
        smooth: true,
        itemStyle: {
          color: '#10b981',
        },
      },
    ],
  });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 页面标题和筛选器 */}
      <div className={styles.header}>
        <Title level={4} style={{ margin: 0 }}>数据概览</Title>
        <Space size="middle">
          <Select
            value={periodType}
            onChange={setPeriodType}
            style={{ width: 120 }}
            options={[
              { label: '按日', value: 'day' },
              { label: '按月', value: 'month' },
              { label: '按季度', value: 'quarter' },
            ]}
          />
          <RangePicker
            onChange={(_, dateStrings) => setDateRange(dateStrings as [string, string])}
          />
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="历史采购计划数"
              value={overviewData?.totalPurchasePlans || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#475569' }}
            />
            <div className={styles.statTrend}>
              <span className={styles.up}><ArrowUpOutlined /> 12%</span>
              <span className={styles.label}>较上月</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="成交订单数"
              value={overviewData?.totalOrders || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#10b981' }}
            />
            <div className={styles.statTrend}>
              <span className={styles.up}><ArrowUpOutlined /> 8%</span>
              <span className={styles.label}>较上月</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="门店数量"
              value={overviewData?.totalShops || 0}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#0ea5e9' }}
            />
            <div className={styles.statTrend}>
              <span className={styles.up}><ArrowUpOutlined /> 5%</span>
              <span className={styles.label}>较上月</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="供应商数量"
              value={overviewData?.totalSuppliers || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#f59e0b' }}
            />
            <div className={styles.statTrend}>
              <span className={styles.down}><ArrowDownOutlined /> 2%</span>
              <span className={styles.label}>较上月</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={8}>
          <Card title="各配件采购占比" className={styles.chartCard}>
            {partsData.length > 0 ? (
              <ReactECharts option={getPieOption()} style={{ height: 300 }} />
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card title="成交情况趋势" className={styles.chartCard}>
            {trendData.length > 0 ? (
              <ReactECharts option={getBarOption()} style={{ height: 300 }} />
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="报价与送货单价格对比" className={styles.chartCard}>
            {priceData.length > 0 ? (
              <ReactECharts option={getLineOption()} style={{ height: 300 }} />
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
