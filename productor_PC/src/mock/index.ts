import type { Demand, Quote, User, ApiResponse, PageResult } from '@/types'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 'U001',
    username: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    companyName: '优质汽配供应商有限公司',
    role: 'supplier',
    avatar: ''
  }
]

// 配件分类
const categories = ['发动机配件', '制动系统', '悬挂系统', '电气系统', '车身配件', '滤清器', '变速箱配件']
const brands = ['博世', '电装', '大陆', '采埃孚', '德尔福', '海拉', '法雷奥', '天合', '其他']

// 门店信息
const stores = [
  { name: '北京朝阳汽修店', contact: '张经理', phone: '13900139001', address: '北京市朝阳区xxx路123号' },
  { name: '上海浦东维修中心', contact: '李主管', phone: '13900139002', address: '上海市浦东新区xxx街456号' },
  { name: '广州天河汽修厂', contact: '王总', phone: '13900139003', address: '广州市天河区xxx大道789号' },
  { name: '深圳南山区快修店', contact: '赵店长', phone: '13900139004', address: '深圳市南山区xxx路101号' },
  { name: '杭州西湖维修站', contact: '钱经理', phone: '13900139005', address: '杭州市西湖区xxx巷202号' }
]

// 生成随机日期
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString()
}

// 生成采购需求数据
function generateDemands(): Demand[] {
  const demands: Demand[] = []
  const now = new Date()

  for (let i = 1; i <= 25; i++) {
    const store = stores[Math.floor(Math.random() * stores.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const createdAt = randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now)
    const deadline = new Date(new Date(createdAt).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)

    demands.push({
      id: `D${String(i).padStart(3, '0')}`,
      demandNo: `D${new Date(createdAt).getFullYear()}${String(new Date(createdAt).getMonth() + 1).padStart(2, '0')}${String(new Date(createdAt).getDate()).padStart(2, '0')}${String(i).padStart(3, '0')}`,
      title: `${brand}${category}采购需求`,
      description: `因业务需要，现采购${brand}品牌${category}相关配件，要求原厂正品，质量有保障。请供应商提供详细产品信息及报价方案。`,
      category,
      brand,
      quantity: Math.floor(Math.random() * 10) + 1,
      budgetMin: Math.floor(Math.random() * 500 + 100),
      budgetMax: Math.floor(Math.random() * 500 + 600),
      deadline: deadline.toISOString(),
      status: deadline > now ? 'pending' : 'closed',
      createdAt,
      attachments: [],
      storeInfo: {
        id: `S${stores.indexOf(store) + 1}`,
        ...store
      }
    })
  }

  return demands.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// 生成报价数据
function generateQuotes(demands: Demand[]): Quote[] {
  const quotes: Quote[] = []
  const statuses: ('pending' | 'won' | 'lost')[] = ['pending', 'won', 'lost']
  const deliveryMethods: ('express' | 'pickup' | 'logistics')[] = ['express', 'pickup', 'logistics']

  for (let i = 1; i <= 15; i++) {
    const demand = demands[Math.floor(Math.random() * Math.min(10, demands.length))]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createdAt = randomDate(new Date(demand.createdAt), new Date())

    quotes.push({
      id: `Q${String(i).padStart(3, '0')}`,
      quoteNo: `Q${new Date(createdAt).getFullYear()}${String(new Date(createdAt).getMonth() + 1).padStart(2, '0')}${String(new Date(createdAt).getDate()).padStart(2, '0')}${String(i).padStart(3, '0')}`,
      demandId: demand.id,
      demandNo: demand.demandNo,
      demandTitle: demand.title,
      price: Math.floor(Math.random() * 500 + 300),
      brand: demand.brand,
      productionDate: randomDate(new Date(2024, 0, 1), new Date()).split('T')[0],
      quantity: demand.quantity,
      warrantyPeriod: '12个月',
      deliveryMethod: deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)],
      deliveryDuration: `${Math.floor(Math.random() * 48 + 24)}小时`,
      contactPhone: '13800138000',
      detailContent: '<p>原厂正品配件，质量保证，售后无忧。</p>',
      attachments: [],
      status,
      createdAt,
      isWinner: status === 'won'
    })
  }

  return quotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const mockDemands = generateDemands()
export const mockQuotes = generateQuotes(mockDemands)

// Mock API实现
export const mockApi = {
  // 登录
  async login(username: string, password: string): Promise<ApiResponse<{ token: string; refreshToken: string; userInfo: User }>> {
    await delay(500)

    if (username === 'admin' && password === '123456') {
      return {
        code: 0,
        msg: 'success',
        data: {
          token: 'mock_token_' + Date.now(),
          refreshToken: 'mock_refresh_token_' + Date.now(),
          userInfo: mockUsers[0]
        }
      }
    }

    return {
      code: 401,
      msg: '用户名或密码错误',
      data: null as any
    }
  },

  // 获取需求列表
  async getDemandList(page: number = 1, size: number = 10, filter?: any): Promise<ApiResponse<PageResult<Demand>>> {
    await delay(300)

    let list = [...mockDemands]

    // 应用筛选
    if (filter?.category) {
      list = list.filter(d => d.category === filter.category)
    }
    if (filter?.brand) {
      list = list.filter(d => d.brand === filter.brand)
    }
    if (filter?.status) {
      list = list.filter(d => d.status === filter.status)
    }

    const total = list.length
    const start = (page - 1) * size
    const pageList = list.slice(start, start + size)

    return {
      code: 0,
      msg: 'success',
      data: {
        total,
        list: pageList,
        page,
        size
      }
    }
  },

  // 获取需求详情
  async getDemandDetail(id: string): Promise<ApiResponse<Demand>> {
    await delay(200)

    const demand = mockDemands.find(d => d.id === id)
    if (demand) {
      return { code: 0, msg: 'success', data: demand }
    }
    return { code: 404, msg: '需求不存在', data: null as any }
  },

  // 提交报价
  async submitQuote(params: any): Promise<ApiResponse<Quote>> {
    await delay(500)

    const demand = mockDemands.find(d => d.id === params.demandId)
    if (!demand) {
      return { code: 404, msg: '需求不存在', data: null as any }
    }

    const quote: Quote = {
      id: `Q${String(mockQuotes.length + 1).padStart(3, '0')}`,
      quoteNo: `Q${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(mockQuotes.length + 1).padStart(3, '0')}`,
      demandId: params.demandId,
      demandNo: demand.demandNo,
      demandTitle: demand.title,
      price: params.price,
      brand: params.brand,
      productionDate: params.productionDate,
      quantity: params.quantity,
      warrantyPeriod: params.warrantyPeriod,
      deliveryMethod: params.deliveryMethod,
      deliveryDuration: params.deliveryDuration,
      contactPhone: params.contactPhone,
      detailContent: params.detailContent,
      attachments: [],
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    mockQuotes.unshift(quote)

    return { code: 0, msg: 'success', data: quote }
  },

  // 获取我的报价列表
  async getMyQuoteList(page: number = 1, size: number = 10, status?: string): Promise<ApiResponse<PageResult<Quote>>> {
    await delay(300)

    let list = [...mockQuotes]

    if (status && status !== 'all') {
      list = list.filter(q => q.status === status)
    }

    const total = list.length
    const start = (page - 1) * size
    const pageList = list.slice(start, start + size)

    return {
      code: 0,
      msg: 'success',
      data: {
        total,
        list: pageList,
        page,
        size
      }
    }
  },

  // 提交发货信息
  async submitShipping(params: any): Promise<ApiResponse<any>> {
    await delay(500)

    const quote = mockQuotes.find(q => q.id === params.quoteId)
    if (quote) {
      // 更新报价状态为已发货（这里简化处理）
      return {
        code: 0,
        msg: 'success',
        data: {
          id: `SH${Date.now()}`,
          ...params,
          status: 'shipped',
          createdAt: new Date().toISOString()
        }
      }
    }

    return { code: 404, msg: '报价不存在', data: null as any }
  },

  // 文件上传
  async uploadFile(file: File): Promise<ApiResponse<{ url: string }>> {
    await delay(800)

    // 模拟上传成功，返回一个假的URL
    return {
      code: 0,
      msg: 'success',
      data: {
        url: `https://oss.example.com/uploads/${Date.now()}_${file.name}`
      }
    }
  }
}

// 导出分类和品牌列表
export const categoryOptions = categories
export const brandOptions = brands
