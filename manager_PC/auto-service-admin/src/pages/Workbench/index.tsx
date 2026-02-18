import React, { useState, useEffect } from 'react';
import { Row, Col, Card, List, Button, Badge, Avatar, Typography, Space, Spin, Empty } from 'antd';
import {
  FileTextOutlined,
  TeamOutlined,
  WarningOutlined,
  BellOutlined,
  RightOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  ShoppingOutlined,
  HistoryOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

const { Title, Text } = Typography;

interface QuickLink {
  key: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

interface TodoItem {
  id: number;
  title: string;
  type: 'purchase' | 'supplier' | 'order';
  status: 'pending' | 'urgent';
  time: string;
}

interface MessageItem {
  id: number;
  title: string;
  content: string;
  type: 'system' | 'business';
  isRead: boolean;
  time: string;
}

const Workbench: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [todoCounts, setTodoCounts] = useState({
    unhandledPurchase: 0,
    pendingAudit: 0,
    abnormalOrder: 0,
  });
  const [messages, setMessages] = useState<MessageItem[]>([]);

  // 快捷链接
  const quickLinks: QuickLink[] = [
    { key: 'purchase', title: '发布采购', icon: <PlusOutlined />, path: '/business/purchase', color: '#475569' },
    { key: 'pending-bid', title: '待应标清单', icon: <UnorderedListOutlined />, path: '/business/purchase?status=pending', color: '#0ea5e9' },
    { key: 'bid-list', title: '应标列表', icon: <FileTextOutlined />, path: '/business/bid', color: '#10b981' },
    { key: 'history', title: '历史采购', icon: <HistoryOutlined />, path: '/business/purchase?status=completed', color: '#f59e0b' },
    { key: 'order', title: '订单管理', icon: <ShoppingOutlined />, path: '/business/order', color: '#8b5cf6' },
    { key: 'supplier', title: '供应商管理', icon: <TeamOutlined />, path: '/system/supplier', color: '#ec4899' },
  ];

  // 待办事项
  const [todoList, setTodoList] = useState<TodoItem[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 模拟数据加载
      await new Promise(resolve => setTimeout(resolve, 600));

      setTodoCounts({
        unhandledPurchase: 12,
        pendingAudit: 5,
        abnormalOrder: 3,
      });

      setTodoList([
        { id: 1, title: '采购单 #PO2024001 待处理', type: 'purchase', status: 'pending', time: '10分钟前' },
        { id: 2, title: '供应商"华信汽配"待审核', type: 'supplier', status: 'pending', time: '30分钟前' },
        { id: 3, title: '订单 #ORD2024015 异常待处理', type: 'order', status: 'urgent', time: '1小时前' },
        { id: 4, title: '采购单 #PO2024005 超时未响应', type: 'purchase', status: 'urgent', time: '2小时前' },
        { id: 5, title: '供应商"德兴配件"资料待补充', type: 'supplier', status: 'pending', time: '3小时前' },
      ]);

      setMessages([
        { id: 1, title: '系统通知', content: '系统将于今晚22:00进行例行维护', type: 'system', isRead: false, time: '2024-01-15 10:00' },
        { id: 2, title: '采购提醒', content: '采购单 #PO2024012 即将截止报价', type: 'business', isRead: false, time: '2024-01-15 09:30' },
        { id: 3, title: '审核通过', content: '供应商"金轮汽配"已通过资质审核', type: 'business', isRead: true, time: '2024-01-14 16:00' },
        { id: 4, title: '订单完成', content: '订单 #ORD2024010 已确认收货', type: 'business', isRead: true, time: '2024-01-14 14:00' },
        { id: 5, title: '账户安全', content: '您的密码已成功修改', type: 'system', isRead: true, time: '2024-01-13 11:00' },
      ]);
    } catch (error) {
      console.error('获取数据失败', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodoIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <FileTextOutlined style={{ color: '#475569' }} />;
      case 'supplier':
        return <TeamOutlined style={{ color: '#0ea5e9' }} />;
      case 'order':
        return <WarningOutlined style={{ color: '#ef4444' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 待办统计 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card
            className={styles.todoCard}
            hoverable
            onClick={() => history.push('/business/purchase?status=pending')}
          >
            <div className={styles.todoContent}>
              <div className={styles.todoIcon} style={{ background: '#47556915' }}>
                <FileTextOutlined style={{ color: '#475569', fontSize: 24 }} />
              </div>
              <div className={styles.todoInfo}>
                <Text type="secondary">未处理采购单</Text>
                <Title level={3} style={{ margin: 0, color: '#475569' }}>
                  {todoCounts.unhandledPurchase}
                </Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            className={styles.todoCard}
            hoverable
            onClick={() => history.push('/system/supplier?status=pending')}
          >
            <div className={styles.todoContent}>
              <div className={styles.todoIcon} style={{ background: '#0ea5e915' }}>
                <TeamOutlined style={{ color: '#0ea5e9', fontSize: 24 }} />
              </div>
              <div className={styles.todoInfo}>
                <Text type="secondary">待审核供应商</Text>
                <Title level={3} style={{ margin: 0, color: '#0ea5e9' }}>
                  {todoCounts.pendingAudit}
                </Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            className={styles.todoCard}
            hoverable
            onClick={() => history.push('/business/order?status=abnormal')}
          >
            <div className={styles.todoContent}>
              <div className={styles.todoIcon} style={{ background: '#ef444415' }}>
                <WarningOutlined style={{ color: '#ef4444', fontSize: 24 }} />
              </div>
              <div className={styles.todoInfo}>
                <Text type="secondary">异常订单</Text>
                <Title level={3} style={{ margin: 0, color: '#ef4444' }}>
                  {todoCounts.abnormalOrder}
                </Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快捷导航和待办事项 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* 快捷导航 */}
        <Col xs={24} lg={12}>
          <Card
            title="快捷导航"
            className={styles.card}
            extra={<Button type="link">自定义</Button>}
          >
            <Row gutter={[16, 16]}>
              {quickLinks.map(link => (
                <Col span={8} key={link.key}>
                  <div
                    className={styles.quickLink}
                    onClick={() => history.push(link.path)}
                  >
                    <div
                      className={styles.quickLinkIcon}
                      style={{ background: `${link.color}15`, color: link.color }}
                    >
                      {link.icon}
                    </div>
                    <Text>{link.title}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 待办事项 */}
        <Col xs={24} lg={12}>
          <Card
            title="待办事项"
            className={styles.card}
            extra={<Button type="link">查看全部</Button>}
          >
            <List
              dataSource={todoList}
              renderItem={item => (
                <List.Item className={styles.todoItem}>
                  <List.Item.Meta
                    avatar={getTodoIcon(item.type)}
                    title={
                      <Space>
                        <Text>{item.title}</Text>
                        {item.status === 'urgent' && (
                          <Badge status="error" text="紧急" />
                        )}
                      </Space>
                    }
                    description={item.time}
                  />
                  <Button type="link" icon={<RightOutlined />}>
                    处理
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 消息中心 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <BellOutlined />
                <span>消息中心</span>
                <Badge count={messages.filter(m => !m.isRead).length} />
              </Space>
            }
            className={styles.card}
            extra={
              <Space>
                <Button type="link">全部已读</Button>
                <Button type="link">清空</Button>
              </Space>
            }
          >
            <List
              dataSource={messages}
              renderItem={item => (
                <List.Item className={styles.messageItem}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          background: item.type === 'system' ? '#475569' : '#0ea5e9',
                        }}
                        icon={item.type === 'system' ? <BellOutlined /> : <FileTextOutlined />}
                      />
                    }
                    title={
                      <Space>
                        <Text strong={!item.isRead}>{item.title}</Text>
                        {!item.isRead && <Badge status="processing" />}
                      </Space>
                    }
                    description={item.content}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.time}
                  </Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Workbench;
