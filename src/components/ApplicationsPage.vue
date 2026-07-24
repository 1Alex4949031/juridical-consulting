<script setup lang="ts">
import logoUrl from '../assets/logo.svg'
import { useApplicationsController } from '../composables/useApplicationsController'
import ApplicationList from './ApplicationList.vue'

const { model } = useApplicationsController()
</script>

<template>
  <main class="applications-page">
    <header class="applications-topbar">
      <RouterLink class="brand" :to="{ name: 'home' }" aria-label="Линия Права — главная">
        <span class="brand-mark"><img :src="logoUrl" alt="" /></span>
        <span>ЛИНИЯ ПРАВА</span>
      </RouterLink>
      <RouterLink class="back-link" :to="{ name: 'home', hash: '#contact' }">
        На основной сайт
      </RouterLink>
    </header>

    <section class="applications-workspace" aria-labelledby="applications-title">
      <div class="workspace-heading">
        <div>
          <p class="mono-label">Внутренний просмотр</p>
          <h1 id="applications-title">Заявки на консультацию</h1>
        </div>
        <button type="button" :disabled="model.isLoading" @click="model.load()">
          {{ model.isLoading ? 'Загрузка...' : 'Обновить' }}
        </button>
      </div>

      <dl class="applications-summary" aria-label="Сводка по заявкам">
        <div>
          <dt>Заявок</dt>
          <dd>{{ model.totalApplications }}</dd>
        </div>
        <div>
          <dt>Клиентов</dt>
          <dd>{{ model.totalClients }}</dd>
        </div>
      </dl>

      <p v-if="model.warning" class="status-message warning-message" role="status">
        {{ model.warning }}
      </p>
      <div v-if="model.error" class="status-message error-message" role="alert">
        <span>{{ model.error }}</span>
        <button type="button" @click="model.load()">Повторить</button>
      </div>
      <p v-else-if="model.isLoading && !model.applications.length" class="loading-message" role="status">
        Загружаем заявки...
      </p>
      <p v-else-if="!model.applications.length" class="loading-message">Заявок пока нет.</p>
      <ApplicationList v-else :applications="model.applications" />
    </section>
  </main>
</template>

<style scoped>
.applications-page {
  min-height: 100vh;
  background: #f4f5f7;
}

.applications-topbar {
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

.applications-workspace {
  max-width: 1440px;
  margin: 0 auto;
  background: var(--surface-primary);
}

.workspace-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-5);
  padding: 48px 40px 36px;
}

.workspace-heading h1 {
  margin: var(--space-4) 0 0;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.05;
  letter-spacing: 0;
}

.workspace-heading button,
.error-message button {
  min-height: 42px;
  border: 1px solid var(--border-primary);
  background: var(--surface-primary);
  color: var(--foreground-primary);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 800;
  padding: 0 20px;
}

.workspace-heading button:disabled {
  cursor: wait;
  opacity: 0.58;
}

.applications-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 220px));
  margin: 0;
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
  padding: 0 40px;
}

.applications-summary div {
  display: grid;
  gap: var(--space-2);
  padding: 24px 28px 24px 0;
  border-right: 1px solid var(--hairline);
}

.applications-summary div + div {
  padding-left: 28px;
}

.applications-summary dt {
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.applications-summary dd {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
}

.status-message,
.loading-message {
  margin: 0;
  border-bottom: 1px solid var(--border-primary);
  padding: 20px 40px;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;
}

.warning-message {
  background: #fff8e6;
  color: #694600;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  background: #fff1f0;
  color: #8f1d15;
}

.loading-message {
  min-height: 180px;
  color: var(--foreground-secondary);
}

@media (max-width: 640px) {
  .applications-topbar {
    min-height: 68px;
    padding: 12px 20px;
  }

  .brand-mark {
    width: 40px;
    height: 40px;
  }

  .workspace-heading {
    align-items: stretch;
    flex-direction: column;
    padding: 36px 24px 28px;
  }

  .workspace-heading button {
    width: 100%;
  }

  .applications-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0 24px;
  }

  .applications-summary div {
    padding: 20px 16px 20px 0;
  }

  .applications-summary div + div {
    padding-left: 16px;
  }

  .status-message,
  .loading-message {
    padding: 18px 24px;
  }

  .error-message {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
