<script setup lang="ts">
import type { ClientListItem } from '../model/Client'
import ClientList from './ClientList.vue'

interface Props {
  clients: ClientListItem[]
  totalClients: number
  isLoading: boolean
  error: string
}

defineProps<Props>()

const emit = defineEmits<{
  reload: []
}>()
</script>

<template>
  <section class="clients-workspace" aria-labelledby="clients-title">
    <div class="workspace-heading">
      <div>
        <p class="mono-label">Клиентская база</p>
        <h1 id="clients-title">Клиенты</h1>
        <p class="workspace-description">
          Контактные данные и история обращений юридической клиники.
        </p>
      </div>
      <button type="button" :disabled="isLoading" @click="emit('reload')">
        {{ isLoading ? 'Загрузка...' : 'Обновить' }}
      </button>
    </div>

    <dl class="clients-summary" aria-label="Сводка по клиентам">
      <div>
        <dt>Всего клиентов</dt>
        <dd>{{ totalClients }}</dd>
      </div>
      <div>
        <dt>Статус</dt>
        <dd class="summary-status">{{ isLoading ? 'Обновление' : 'Актуально' }}</dd>
      </div>
    </dl>

    <div v-if="error" class="status-message error-message" role="alert">
      <span>{{ error }}</span>
      <button type="button" @click="emit('reload')">Повторить</button>
    </div>
    <p v-else-if="isLoading && !clients.length" class="status-message" role="status">
      Загружаем список клиентов...
    </p>
    <p v-else-if="!clients.length" class="status-message">
      Клиентов пока нет.
    </p>
    <ClientList v-else :clients="clients" />
  </section>
</template>

<style scoped>
.clients-workspace {
  max-width: 1440px;
  min-height: calc(100vh - 76px);
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

.workspace-description {
  max-width: 620px;
  margin: var(--space-4) 0 0;
  color: var(--foreground-secondary);
  font-size: 0.9375rem;
  line-height: 1.55;
}

.workspace-heading button,
.error-message button {
  min-height: 42px;
  padding: 0 20px;
  border: 1px solid var(--border-primary);
  background: var(--surface-primary);
  color: var(--foreground-primary);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 800;
}

.workspace-heading button:disabled {
  cursor: wait;
  opacity: 0.58;
}

.clients-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 240px));
  margin: 0;
  padding: 0 40px;
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
}

.clients-summary div {
  display: grid;
  gap: var(--space-2);
  padding: 24px 28px 24px 0;
  border-right: 1px solid var(--hairline);
}

.clients-summary div + div {
  padding-left: 28px;
}

.clients-summary dt {
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.clients-summary dd {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
}

.clients-summary .summary-status {
  font-size: 1rem;
  line-height: 2.4;
}

.status-message {
  min-height: 160px;
  margin: 0;
  padding: 24px 40px;
  border-bottom: 1px solid var(--border-primary);
  color: var(--foreground-secondary);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.5;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: auto;
  background: #fff1f0;
  color: #8f1d15;
}

@media (max-width: 640px) {
  .clients-workspace {
    min-height: calc(100vh - 68px);
  }

  .workspace-heading {
    align-items: stretch;
    flex-direction: column;
    padding: 36px 24px 28px;
  }

  .workspace-heading button {
    width: 100%;
  }

  .clients-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0 24px;
  }

  .clients-summary div {
    padding: 20px 16px 20px 0;
  }

  .clients-summary div + div {
    padding-left: 16px;
  }

  .clients-summary dd {
    font-size: 1.5rem;
  }

  .clients-summary .summary-status {
    font-size: 0.875rem;
    line-height: 1.8;
  }

  .status-message {
    padding: 20px 24px;
  }

  .error-message {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
