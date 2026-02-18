<template>
  <el-container class="layout-container">
    <el-header class="layout-header">
      <div class="header-left">
        <h1 class="logo">汽服配件采购报价系统</h1>
        <span class="subtitle">供应商端</span>
      </div>
      <div class="header-right">
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-info">
            <el-avatar :size="32" :src="userStore.userInfo?.avatar">
              {{ userStore.userInfo?.companyName?.charAt(0) || 'S' }}
            </el-avatar>
            <span class="username">{{ userStore.userInfo?.companyName || '供应商' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人信息
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container class="layout-main">
      <el-aside :width="isCollapse ? '64px' : '220px'" class="layout-aside">
        <div class="collapse-btn" @click="isCollapse = !isCollapse">
          <el-icon><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
        </div>
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          class="sidebar-menu"
        >
          <el-menu-item index="/demand">
            <el-icon><Document /></el-icon>
            <template #title>待应标清单</template>
          </el-menu-item>
          <el-menu-item index="/my-quotes">
            <el-icon><Tickets /></el-icon>
            <template #title>我的应标</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuth } from '@/composables/useAuth'
import { Document, Tickets, User, SwitchButton, ArrowDown, Fold, Expand } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { logout } = useAuth()

const isCollapse = ref(false)
const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/demand')) return '/demand'
  if (path.startsWith('/my-quotes')) return '/my-quotes'
  return path
})

function handleCommand(command: string) {
  if (command === 'logout') {
    logout()
  } else if (command === 'profile') {
    // TODO: 个人信息页面
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  background: $bg-page;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: $header-height;
  background: $bg-card;
  box-shadow: $shadow-sm;
  z-index: 100;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo {
      font-size: 18px;
      font-weight: 600;
      color: $primary-color;
      margin: 0;
    }

    .subtitle {
      padding: 2px 8px;
      background: rgba($primary-color, 0.1);
      color: $primary-color;
      border-radius: 4px;
      font-size: 12px;
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 8px;
      transition: background 0.2s;

      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      .username {
        font-size: 14px;
        color: $text-primary;
      }
    }
  }
}

.layout-main {
  height: calc(100vh - #{$header-height});
}

.layout-aside {
  background: $bg-card;
  border-right: 1px solid $border-color;
  transition: width 0.3s;
  position: relative;

  .collapse-btn {
    position: absolute;
    right: -12px;
    top: 20px;
    width: 24px;
    height: 24px;
    background: $bg-card;
    border: 1px solid $border-color;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: $shadow-sm;

    &:hover {
      color: $primary-color;
      border-color: $primary-color;
    }
  }

  .sidebar-menu {
    border-right: none;
    padding-top: 20px;
  }
}

.layout-content {
  padding: 20px;
  overflow-y: auto;
}
</style>
