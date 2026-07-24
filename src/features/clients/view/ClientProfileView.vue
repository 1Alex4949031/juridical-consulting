<script setup lang="ts">
import type { ClientDetails } from '../model/Client'
import ClientRequestsList from './ClientRequestsList.vue'

interface Props {
  client: ClientDetails | null
  totalRequests: number
  isLoading: boolean
  error: string
}

defineProps<Props>()

const emit = defineEmits<{
  reload: []
}>()
</script>

<template>
  <section class="client-workspace" aria-labelledby="client-title">
    <div class="profile-navigation">
      <RouterLink :to="{ name: 'clients' }">Все клиенты</RouterLink>
      <span aria-hidden="true">/</span>
      <span>{{ client?.fullName ?? 'Профиль клиента' }}</span>
    </div>

    <div v-if="error" class="status-message error-message" role="alert">
      <span>{{ error }}</span>
      <div class="error-actions">
        <RouterLink :to="{ name: 'clients' }">К списку</RouterLink>
        <button type="button" @click="emit('reload')">Повторить</button>
      </div>
    </div>
    <p v-else-if="isLoading && !client" class="status-message" role="status">
      Загружаем данные клиента...
    </p>

    <template v-else-if="client">
      <header class="profile-heading">
        <div>
          <p class="mono-label">Клиент №{{ client.id }}</p>
          <h1 id="client-title">{{ client.fullName }}</h1>
        </div>
        <button type="button" :disabled="isLoading" @click="emit('reload')">
          {{ isLoading ? 'Загрузка...' : 'Обновить' }}
        </button>
      </header>

      <dl class="client-contacts" aria-label="Контактные данные клиента">
        <div>
          <dt>Телефон</dt>
          <dd>
            <a v-if="client.phone" :href="`tel:${client.phone}`">{{ client.phone }}</a>
            <span v-else>Не указан</span>
          </dd>
        </div>
        <div>
          <dt>Электронная почта</dt>
          <dd>
            <a v-if="client.email" :href="`mailto:${client.email}`">{{ client.email }}</a>
            <span v-else>Не указана</span>
          </dd>
        </div>
        <div>
          <dt>Количество заявок</dt>
          <dd>{{ totalRequests }}</dd>
        </div>
      </dl>

      <div class="requests-heading">
        <div>
          <p class="mono-label">История обращений</p>
          <h2>Заявки клиента</h2>
        </div>
        <strong>{{ totalRequests }}</strong>
      </div>

      <p v-if="!client.requests.length" class="status-message">
        У клиента пока нет заявок.
      </p>
      <ClientRequestsList v-else :requests="client.requests" />
    </template>
  </section>
</template>

<style scoped>
.client-workspace {
  max-width: 1440px;
  min-height: calc(100vh - 76px);
  margin: 0 auto;
  background: var(--surface-primary);
}

.profile-navigation {
  display: flex;
  gap: 10px;
  min-height: 48px;
  align-items: center;
  padding: 0 40px;
  border-bottom: 1px solid var(--border-primary);
  color: var(--foreground-secondary);
  font-size: 0.75rem;
  font-weight: 700;
}

.profile-navigation a {
  color: var(--accent-primary);
}

.profile-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-5);
  padding: 48px 40px 38px;
}

.profile-heading h1 {
  margin: var(--space-4) 0 0;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.05;
  letter-spacing: 0;
}

.profile-heading button,
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

.profile-heading button:disabled {
  cursor: wait;
  opacity: 0.58;
}

.client-contacts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 0;
  padding: 0 40px;
  border-top: 1px solid var(--border-primary);
  border-bottom: 1px solid var(--border-primary);
}

.client-contacts div {
  display: grid;
  min-width: 0;
  gap: var(--space-2);
  padding: 24px 28px 24px 0;
  border-right: 1px solid var(--hairline);
}

.client-contacts div + div {
  padding-left: 28px;
}

.client-contacts div:last-child {
  border-right: 0;
}

.client-contacts dt {
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.client-contacts dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 0.9375rem;
  font-weight: 700;
}

.client-contacts a {
  color: var(--foreground-primary);
}

.requests-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-5);
  padding: 38px 40px 28px;
}

.requests-heading h2 {
  margin: var(--space-3) 0 0;
  font-size: 1.75rem;
  line-height: 1.15;
}

.requests-heading strong {
  color: var(--accent-primary);
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 2.25rem;
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
  min-height: auto;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  background: #fff1f0;
  color: #8f1d15;
}

.error-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.error-actions a {
  color: inherit;
  font-size: 0.8125rem;
  font-weight: 800;
}

@media (max-width: 760px) {
  .client-contacts {
    grid-template-columns: 1fr;
    padding: 0 24px;
  }

  .client-contacts div,
  .client-contacts div + div {
    padding: 20px 0;
    border-right: 0;
    border-bottom: 1px solid var(--hairline);
  }

  .client-contacts div:last-child {
    border-bottom: 0;
  }
}

@media (max-width: 640px) {
  .client-workspace {
    min-height: calc(100vh - 68px);
  }

  .profile-navigation {
    padding: 0 24px;
  }

  .profile-heading {
    align-items: stretch;
    flex-direction: column;
    padding: 36px 24px 28px;
  }

  .profile-heading button {
    width: 100%;
  }

  .requests-heading {
    padding: 32px 24px 24px;
  }

  .requests-heading strong {
    font-size: 1.75rem;
  }

  .status-message {
    padding: 20px 24px;
  }

  .error-message,
  .error-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .error-actions button {
    width: 100%;
  }
}
</style>
