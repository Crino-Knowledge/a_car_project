<template>
  <div class="quote-submit-page">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
      <h2>应标报价</h2>
    </div>

    <div class="quote-content" v-loading="loading">
      <!-- 需求摘要 -->
      <div class="demand-summary card">
        <div class="summary-header">
          <span class="demand-no">{{ demand?.demandNo }}</span>
          <span class="title">{{ demand?.title }}</span>
        </div>
        <div class="summary-info">
          <span>需求数量: <strong>{{ demand?.quantity }}</strong> 件</span>
          <span>预算范围: <strong>{{ demand?.budgetMin }} - {{ demand?.budgetMax }}</strong> 元</span>
          <span>截止时间: <strong>{{ formatDate(demand?.deadline) }}</strong></span>
        </div>
      </div>

      <!-- 报价表单 -->
      <div class="quote-form-card card">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
          class="quote-form"
        >
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="报价金额" prop="price">
                <el-input-number
                  v-model="form.price"
                  :min="0"
                  :precision="2"
                  :step="10"
                  placeholder="请输入报价金额"
                  style="width: 100%"
                />
                <span class="unit">元</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品牌" prop="brand">
                <el-select v-model="form.brand" placeholder="请选择品牌" style="width: 100%">
                  <el-option
                    v-for="item in brandOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="生产日期" prop="productionDate">
                <el-date-picker
                  v-model="form.productionDate"
                  type="date"
                  placeholder="选择生产日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供货数量" prop="quantity">
                <el-input-number
                  v-model="form.quantity"
                  :min="1"
                  :max="demand?.quantity || 100"
                  style="width: 100%"
                />
                <span class="unit">件</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="质保期限" prop="warrantyPeriod">
                <el-select v-model="form.warrantyPeriod" placeholder="请选择质保期限" style="width: 100%">
                  <el-option label="6个月" value="6个月" />
                  <el-option label="12个月" value="12个月" />
                  <el-option label="18个月" value="18个月" />
                  <el-option label="24个月" value="24个月" />
                  <el-option label="36个月" value="36个月" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="送货方式" prop="deliveryMethod">
                <el-radio-group v-model="form.deliveryMethod">
                  <el-radio value="express">快递</el-radio>
                  <el-radio value="pickup">自提</el-radio>
                  <el-radio value="logistics">物流</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="送货时长" prop="deliveryDuration">
                <el-input v-model="form.deliveryDuration" placeholder="如: 24小时">
                  <template #append>小时</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="contactPhone">
                <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="商品详情" prop="detailContent">
            <RichTextEditor v-model="form.detailContent" />
          </el-form-item>

          <el-form-item label="附件上传">
            <FileUpload
              v-model="form.attachmentUrls"
              :limit="3"
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </el-form-item>

          <el-form-item class="submit-bar">
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
              提交报价
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElForm, FormRules } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getDemandDetail } from '@/api/demand'
import { useQuoteStore } from '@/stores/quote'
import { brandOptions } from '@/mock'
import { createRequiredRule, createPhoneRule, createPriceRule } from '@/utils/validator'
import { showToast } from '@/utils/notification'
import RichTextEditor from '@/components/RichTextEditor.vue'
import FileUpload from '@/components/FileUpload.vue'
import type { Demand, QuoteSubmitParams } from '@/types'

const route = useRoute()
const router = useRouter()
const quoteStore = useQuoteStore()

const formRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)
const submitting = ref(false)
const demand = ref<Demand | null>(null)

const form = reactive({
  price: undefined as number | undefined,
  brand: '',
  productionDate: '',
  quantity: 1,
  warrantyPeriod: '',
  deliveryMethod: 'express' as 'express' | 'pickup' | 'logistics',
  deliveryDuration: '',
  contactPhone: '',
  detailContent: '',
  attachmentUrls: [] as string[]
})

const rules = reactive<FormRules>({
  price: [
    createRequiredRule('请输入报价金额'),
    { validator: (rule, value, callback) => {
      if (!value || value <= 0) {
        callback(new Error('报价金额必须大于0'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  brand: [createRequiredRule('请选择品牌')],
  productionDate: [createRequiredRule('请选择生产日期')],
  quantity: [createRequiredRule('请输入供货数量')],
  warrantyPeriod: [createRequiredRule('请选择质保期限')],
  deliveryMethod: [createRequiredRule('请选择送货方式')],
  deliveryDuration: [createRequiredRule('请输入送货时长')],
  contactPhone: [createRequiredRule('请输入联系电话'), createPhoneRule()],
  detailContent: [createRequiredRule('请填写商品详情')]
})

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

function goBack() {
  router.back()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitting.value = true
  try {
    const params: QuoteSubmitParams = {
      demandId: demand.value!.id,
      price: form.price!,
      brand: form.brand,
      productionDate: form.productionDate,
      quantity: form.quantity,
      warrantyPeriod: form.warrantyPeriod,
      deliveryMethod: form.deliveryMethod,
      deliveryDuration: form.deliveryDuration,
      contactPhone: form.contactPhone,
      detailContent: form.detailContent,
      attachmentUrls: form.attachmentUrls
    }

    const result = await quoteStore.submitQuote(params)
    if (result.success) {
      showToast('报价提交成功', 'success')
      router.push('/my-quotes')
    } else {
      showToast(result.message || '报价提交失败', 'error')
    }
  } finally {
    submitting.value = false
  }
}

async function fetchDemand() {
  const demandId = route.params.demandId as string
  if (!demandId) return

  loading.value = true
  try {
    const res = await getDemandDetail(demandId)
    if (res.code === 0 && res.data) {
      demand.value = res.data
      form.quantity = res.data.quantity
      form.brand = res.data.brand
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDemand()
})
</script>

<style lang="scss" scoped>
.quote-submit-page {
  .page-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;

    h2 {
      font-size: 18px;
      font-weight: 600;
      color: $text-primary;
      margin: 0;
    }
  }

  .demand-summary {
    padding: 16px 20px;
    margin-bottom: 20px;

    .summary-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .demand-no {
        font-size: 12px;
        color: $text-secondary;
        padding: 2px 8px;
        background: $bg-page;
        border-radius: 4px;
      }

      .title {
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .summary-info {
      display: flex;
      gap: 24px;
      font-size: 13px;
      color: $text-secondary;

      strong {
        color: $primary-color;
      }
    }
  }

  .quote-form-card {
    padding: 24px;

    .quote-form {
      .unit {
        margin-left: 8px;
        color: $text-secondary;
      }

      .submit-bar {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid $border-light;
      }
    }
  }
}
</style>
