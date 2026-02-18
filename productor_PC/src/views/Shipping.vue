<template>
  <div class="shipping-page">
    <div class="page-header">
      <el-button @click="goBack" :icon="ArrowLeft">返回</el-button>
      <h2>发货操作</h2>
    </div>

    <div class="shipping-content" v-loading="loading">
      <!-- 报价摘要 -->
      <div class="quote-summary card">
        <h4>报价信息</h4>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">报价单号:</span>
            <span class="value">{{ quote?.quoteNo }}</span>
          </div>
          <div class="info-item">
            <span class="label">采购需求:</span>
            <span class="value">{{ quote?.demandTitle }}</span>
          </div>
          <div class="info-item">
            <span class="label">中标金额:</span>
            <span class="value price">{{ quote?.price }} 元</span>
          </div>
          <div class="info-item">
            <span class="label">数量:</span>
            <span class="value">{{ quote?.quantity }} 件</span>
          </div>
        </div>
      </div>

      <!-- 发货表单 -->
      <div class="shipping-form-card card">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="shipping-form"
        >
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="发货人" prop="deliveryPerson">
                <el-input v-model="form.deliveryPerson" placeholder="请输入发货人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发货电话" prop="deliveryPhone">
                <el-input v-model="form.deliveryPhone" placeholder="请输入发货电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="发货时间" prop="deliveryTime">
            <el-date-picker
              v-model="form.deliveryTime"
              type="datetime"
              placeholder="选择发货时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 50%"
            />
          </el-form-item>

          <el-divider content-position="left">收货信息</el-divider>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="收货人" prop="consignee">
                <el-input v-model="form.consignee" placeholder="收货人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收货电话" prop="consigneePhone">
                <el-input v-model="form.consigneePhone" placeholder="收货人电话" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left">物流信息</el-divider>

          <el-form-item label="送货单号" prop="trackingNumber">
            <el-input v-model="form.trackingNumber" placeholder="请输入快递/物流单号" />
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="备注信息（选填）"
            />
          </el-form-item>

          <el-form-item label="送货单" prop="deliverySlipUrl" required>
            <FileUpload
              v-model="form.deliverySlipUrls"
              :limit="1"
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <div class="form-tip">请上传送货单照片或电子文档</div>
          </el-form-item>

          <el-form-item class="submit-bar">
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
              确认发货
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
import { getQuoteDetail } from '@/api/quote'
import { createShipping } from '@/api/shipping'
import { createRequiredRule, createPhoneRule } from '@/utils/validator'
import { showToast, notifyShippingSuccess } from '@/utils/notification'
import FileUpload from '@/components/FileUpload.vue'
import type { Quote, ShippingParams } from '@/types'

const route = useRoute()
const router = useRouter()

const formRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)
const submitting = ref(false)
const quote = ref<Quote | null>(null)

const form = reactive({
  deliveryPerson: '',
  deliveryPhone: '',
  deliveryTime: '',
  consignee: '',
  consigneePhone: '',
  trackingNumber: '',
  remark: '',
  deliverySlipUrls: [] as string[]
})

const rules = reactive<FormRules>({
  deliveryPerson: [createRequiredRule('请输入发货人姓名')],
  deliveryPhone: [createRequiredRule('请输入发货电话'), createPhoneRule()],
  deliveryTime: [createRequiredRule('请选择发货时间')],
  consignee: [createRequiredRule('请输入收货人')],
  consigneePhone: [createRequiredRule('请输入收货电话'), createPhoneRule()],
  trackingNumber: [createRequiredRule('请输入送货单号')]
})

function goBack() {
  router.back()
}

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (!valid) return

  if (form.deliverySlipUrls.length === 0) {
    showToast('请上传送货单', 'error')
    return
  }

  submitting.value = true
  try {
    const params: ShippingParams = {
      quoteId: quote.value!.id,
      deliveryPerson: form.deliveryPerson,
      deliveryPhone: form.deliveryPhone,
      deliveryTime: form.deliveryTime,
      consignee: form.consignee,
      consigneePhone: form.consigneePhone,
      trackingNumber: form.trackingNumber,
      remark: form.remark,
      deliverySlipUrl: form.deliverySlipUrls[0]
    }

    const res = await createShipping(params)
    if (res.code === 0) {
      notifyShippingSuccess()
      router.push('/my-quotes')
    } else {
      showToast(res.msg || '发货提交失败', 'error')
    }
  } finally {
    submitting.value = false
  }
}

async function fetchQuote() {
  const quoteId = route.params.quoteId as string
  if (!quoteId) return

  loading.value = true
  try {
    const res = await getQuoteDetail(quoteId)
    if (res.code === 0 && res.data) {
      quote.value = res.data
      // 初始化发货时间
      form.deliveryTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchQuote()
})
</script>

<style lang="scss" scoped>
.shipping-page {
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

  .quote-summary {
    padding: 20px;
    margin-bottom: 20px;

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
      margin: 0 0 16px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;

      .info-item {
        .label {
          font-size: 12px;
          color: $text-secondary;
          display: block;
          margin-bottom: 4px;
        }

        .value {
          font-size: 14px;
          color: $text-primary;
          font-weight: 500;

          &.price {
            color: $primary-color;
          }
        }
      }
    }
  }

  .shipping-form-card {
    padding: 24px;

    .form-tip {
      margin-top: 8px;
      font-size: 12px;
      color: $text-secondary;
    }

    .submit-bar {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid $border-light;
    }
  }
}
</style>
