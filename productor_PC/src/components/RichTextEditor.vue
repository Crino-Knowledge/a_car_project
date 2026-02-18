<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <el-button-group>
        <el-button size="small" @click="execCommand('bold')" title="加粗">
          <el-icon><EditPen /></el-icon>
        </el-button>
        <el-button size="small" @click="execCommand('italic')" title="斜体">
          <el-icon><Edit /></el-icon>
        </el-button>
        <el-button size="small" @click="execCommand('underline')" title="下划线">
          <el-icon><Underlined /></el-icon>
        </el-button>
      </el-button-group>
      <el-button-group class="ml-2">
        <el-button size="small" @click="execCommand('insertUnorderedList')" title="无序列表">
          <el-icon><List /></el-icon>
        </el-button>
        <el-button size="small" @click="execCommand('insertOrderedList')" title="有序列表">
          <el-icon><Finished /></el-icon>
        </el-button>
      </el-button-group>
      <el-button size="small" class="ml-2" @click="triggerImageUpload" title="插入图片">
        <el-icon><Picture /></el-icon>
      </el-button>
    </div>
    <div
      ref="editorRef"
      class="editor-content"
      contenteditable="true"
      @input="handleInput"
      @paste="handlePaste"
    ></div>
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleImageSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { EditPen, Edit, Underlined, List, Finished, Picture } from '@element-plus/icons-vue'
import { uploadFile } from '@/api/upload'
import { showToast } from '@/utils/notification'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLDivElement>()
const fileInputRef = ref<HTMLInputElement>()

function execCommand(command: string, value: string = '') {
  document.execCommand(command, false, value)
  editorRef.value?.focus()
}

function handleInput() {
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML)
  }
}

function handlePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      e.preventDefault()
      const file = items[i].getAsFile()
      if (file) {
        uploadImage(file)
      }
      break
    }
  }
}

function triggerImageUpload() {
  fileInputRef.value?.click()
}

async function handleImageSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    await uploadImage(file)
  }
  target.value = ''
}

async function uploadImage(file: File) {
  try {
    showToast('正在上传图片...', 'info')
    const res = await uploadFile(file)
    if (res.code === 0 && res.data) {
      const img = `<img src="${res.data.url}" style="max-width: 100%;" />`
      document.execCommand('insertHTML', false, img)
      handleInput()
      showToast('图片上传成功', 'success')
    }
  } catch (error) {
    showToast('图片上传失败', 'error')
  }
}

onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = props.modelValue
  }
})

onUnmounted(() => {
  // 清理
})
</script>

<style lang="scss" scoped>
.rich-text-editor {
  border: 1px solid $border-color;
  border-radius: $radius-md;
  overflow: hidden;

  .editor-toolbar {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: $bg-page;
    border-bottom: 1px solid $border-color;

    .ml-2 {
      margin-left: 8px;
    }
  }

  .editor-content {
    min-height: 200px;
    padding: 12px;
    outline: none;

    &:empty::before {
      content: '请输入商品详情描述...';
      color: $text-placeholder;
    }

    img {
      max-width: 100%;
    }
  }
}
</style>
