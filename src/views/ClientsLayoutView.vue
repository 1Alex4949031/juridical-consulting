<script setup lang="ts">
import logoUrl from '../assets/logo.svg'
</script>

<template>
  <main class="clients-page">
    <header class="clients-topbar">
      <RouterLink class="brand" :to="{ name: 'home' }" aria-label="Линия Права — главная">
        <span class="brand-mark"><img :src="logoUrl" alt="" /></span>
        <span>ЛИНИЯ ПРАВА</span>
      </RouterLink>
      <RouterLink class="back-link" :to="{ name: 'home', hash: '#contact' }">
        На основной сайт
      </RouterLink>
    </header>

    <RouterView v-slot="{ Component, route }">
      <component :is="Component" :key="route.fullPath" />
    </RouterView>
  </main>
</template>

<style scoped>
.clients-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.clients-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 76px;
  padding: 12px max(24px, calc((100vw - 1440px) / 2));
  border-bottom: 1px solid #3f3f3f;
  background: var(--surface-inverse);
  color: var(--foreground-inverse);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: inherit;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  overflow: hidden;
  border: 1px solid #505050;
  border-radius: 50%;
  background: var(--surface-primary);
}

.brand-mark img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.back-link {
  color: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
}

@media (max-width: 640px) {
  .clients-topbar {
    min-height: 68px;
    padding: 12px 20px;
  }

  .brand-mark {
    width: 40px;
    height: 40px;
  }

  .brand > span:last-child {
    display: none;
  }
}
</style>
