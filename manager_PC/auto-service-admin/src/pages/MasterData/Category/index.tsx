import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Tree,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Typography,
  Empty,
  Tag,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FileOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';
import styles from './index.less';

const { Option } = Select;
const { Text, Title } = Typography;
const { TreeNode } = Tree;

interface CategoryItem {
  id: number;
  name: string;
  parentId: number | null;
  sort: number;
  attributes?: { name: string; type: string }[];
  children?: CategoryItem[];
}

const CategoryManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<CategoryItem[]>([]);
  const [selectedNode, setSelectedNode] = useState<CategoryItem | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [attrModalVisible, setAttrModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: CategoryItem[] = [
    {
      id: 1,
      name: '发动机配件',
      parentId: null,
      sort: 1,
      children: [
        { id: 11, name: '活塞组件', parentId: 1, sort: 1, attributes: [{ name: '材质', type: 'string' }, { name: '直径', type: 'number' }] },
        { id: 12, name: '曲轴连杆', parentId: 1, sort: 2, attributes: [{ name: '材质', type: 'string' }] },
        { id: 13, name: '气缸套', parentId: 1, sort: 3 },
        { id: 14, name: '进气系统', parentId: 1, sort: 4 },
      ],
    },
    {
      id: 2,
      name: '制动系统',
      parentId: null,
      sort: 2,
      children: [
        { id: 21, name: '刹车片', parentId: 2, sort: 1, attributes: [{ name: '材质', type: 'string' }, { name: '厚度', type: 'number' }] },
        { id: 22, name: '刹车盘', parentId: 2, sort: 2 },
        { id: 23, name: '刹车卡钳', parentId: 2, sort: 3 },
        { id: 24, name: '制动液', parentId: 2, sort: 4 },
      ],
    },
    {
      id: 3,
      name: '悬挂系统',
      parentId: null,
      sort: 3,
      children: [
        { id: 31, name: '减震器', parentId: 3, sort: 1 },
        { id: 32, name: '弹簧', parentId: 3, sort: 2 },
        { id: 33, name: '控制臂', parentId: 3, sort: 3 },
      ],
    },
    {
      id: 4,
      name: '电气系统',
      parentId: null,
      sort: 4,
      children: [
        { id: 41, name: '发电机', parentId: 4, sort: 1 },
        { id: 42, name: '起动机', parentId: 4, sort: 2 },
        { id: 43, name: '火花塞', parentId: 4, sort: 3 },
        { id: 44, name: '传感器', parentId: 4, sort: 4 },
      ],
    },
    {
      id: 5,
      name: '车身配件',
      parentId: null,
      sort: 5,
      children: [
        { id: 51, name: '车门', parentId: 5, sort: 1 },
        { id: 52, name: '保险杠', parentId: 5, sort: 2 },
        { id: 53, name: '后视镜', parentId: 5, sort: 3 },
      ],
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTreeData(mockData);
      setExpandedKeys([1, 2, 3, 4, 5]);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 转换为 Tree 组件需要的格式
  const convertToTreeData = (data: CategoryItem[]): DataNode[] => {
    return data.map(item => ({
      key: item.id,
      title: item.name,
      children: item.children ? convertToTreeData(item.children) : undefined,
    }));
  };

  const handleSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      const node = findNodeById(treeData, selectedKeys[0] as number);
      setSelectedNode(node);
    }
  };

  const findNodeById = (data: CategoryItem[], id: number): CategoryItem | null => {
    for (const item of data) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findNodeById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleAdd = (parent?: CategoryItem) => {
    setEditingCategory(null);
    form.resetFields();
    if (parent) {
      form.setFieldsValue({ parentId: parent.id });
    }
    setModalVisible(true);
  };

  const handleEdit = () => {
    if (!selectedNode) {
      message.warning('请先选择要编辑的分类');
      return;
    }
    setEditingCategory(selectedNode);
    form.setFieldsValue({
      name: selectedNode.name,
      parentId: selectedNode.parentId,
      sort: selectedNode.sort,
    });
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!selectedNode) return;
    try {
      message.success(`已删除分类: ${selectedNode.name}`);
      setSelectedNode(null);
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
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

  const handleAddAttribute = () => {
    if (!selectedNode) {
      message.warning('请先选择分类');
      return;
    }
    setAttrModalVisible(true);
  };

  const handleDrop: TreeProps['onDrop'] = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    message.success('排序已更新');
  };

  return (
    <div className={styles.container}>
      <Row gutter={16}>
        {/* 左侧树形结构 */}
        <Col xs={24} lg={10}>
          <Card
            title="配件分类"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd()}>
                新增根分类
              </Button>
            }
            loading={loading}
          >
            {treeData.length > 0 ? (
              <Tree
                showLine
                showIcon
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
                selectedKeys={selectedNode ? [selectedNode.id] : []}
                onSelect={handleSelect}
                treeData={convertToTreeData(treeData)}
                onDrop={handleDrop}
                draggable
                icon={(props) => props.expanded ? <FolderOutlined /> : <FileOutlined />}
              />
            ) : (
              <Empty description="暂无分类数据" />
            )}
          </Card>
        </Col>

        {/* 右侧详情 */}
        <Col xs={24} lg={14}>
          <Card title="分类详情">
            {selectedNode ? (
              <div className={styles.detailContent}>
                <div className={styles.detailHeader}>
                  <Title level={4}>{selectedNode.name}</Title>
                  <Space>
                    <Button icon={<PlusOutlined />} onClick={() => handleAdd(selectedNode)}>
                      添加子分类
                    </Button>
                    <Button icon={<EditOutlined />} onClick={handleEdit}>
                      编辑
                    </Button>
                    <Popconfirm
                      title="确定删除该分类吗？子分类将一并删除"
                      onConfirm={handleDelete}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>

                <Divider />

                <div className={styles.detailInfo}>
                  <p><Text strong>分类ID：</Text>{selectedNode.id}</p>
                  <p><Text strong>排序：</Text>{selectedNode.sort}</p>
                  <p>
                    <Text strong>父级分类：</Text>
                    {selectedNode.parentId
                      ? findNodeById(treeData, selectedNode.parentId)?.name || '无'
                      : '无（根分类）'}
                  </p>
                </div>

                <Divider />

                <div className={styles.attributesSection}>
                  <div className={styles.sectionHeader}>
                    <Text strong>自定义属性</Text>
                    <Button size="small" icon={<PlusOutlined />} onClick={handleAddAttribute}>
                      添加属性
                    </Button>
                  </div>

                  {selectedNode.attributes && selectedNode.attributes.length > 0 ? (
                    <div className={styles.attributeList}>
                      {selectedNode.attributes.map((attr, index) => (
                        <Tag key={index} color="blue" style={{ marginBottom: 8 }}>
                          {attr.name} ({attr.type})
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <Empty description="暂无自定义属性" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
              </div>
            ) : (
              <Empty description="请在左侧选择分类查看详情" />
            )}
          </Card>
        </Col>
      </Row>

      {/* 新增/编辑分类弹窗 */}
      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={400}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item name="parentId" label="父级分类">
            <Select placeholder="请选择父级分类（不选则为根分类）" allowClear>
              {treeData.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={0}>
            <Input type="number" placeholder="数值越小越靠前" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加属性弹窗 */}
      <Modal
        title="添加自定义属性"
        open={attrModalVisible}
        onOk={() => {
          message.success('属性已添加');
          setAttrModalVisible(false);
        }}
        onCancel={() => setAttrModalVisible(false)}
        width={400}
      >
        <Form layout="vertical">
          <Form.Item label="属性名称" rules={[{ required: true }]}>
            <Input placeholder="例如：材质、规格、电压等" />
          </Form.Item>
          <Form.Item label="数据类型" rules={[{ required: true }]}>
            <Select placeholder="请选择数据类型">
              <Option value="string">文本</Option>
              <Option value="number">数值</Option>
              <Option value="select">单选</Option>
              <Option value="multiSelect">多选</Option>
              <Option value="date">日期</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
