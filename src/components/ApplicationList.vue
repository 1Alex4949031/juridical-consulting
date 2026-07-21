<script setup lang="ts">
import type { ApplicationRecord } from '../models/Application'

interface Props {
  applications: ApplicationRecord[]
}

const { applications } = defineProps<Props>()

function formatDate(value: Date | null) {
  if (!value) {
    return 'Дата не указана'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value)
}

function phoneHref(phone: string) {
  return phone === 'Не указан' ? undefined : `tel:${phone}`
}
</script>

<template>
  <div class="applications-list" role="list">
    <article
      v-for="application in applications"
      :key="application.id"
      class="application-row"
      role="listitem"
    >
      <header class="application-header">
        <div>
          <p class="application-number">Клиент №{{ application.clientId }}</p>
          <h2>{{ application.fullName }}</h2>
        </div>
        <time :datetime="application.createdAt?.toISOString()">
          {{ formatDate(application.createdAt) }}
        </time>
      </header>

      <dl class="client-data">
        <div>
          <dt>Телефон</dt>
          <dd>
            <a v-if="phoneHref(application.phone)" :href="phoneHref(application.phone)">
              {{ application.phone }}
            </a>
            <span v-else>{{ application.phone }}</span>
          </dd>
        </div>
        <div>
          <dt>Электронная почта</dt>
          <dd>
            <a v-if="application.email" :href="`mailto:${application.email}`">{{ application.email }}</a>
            <span v-else>Не указана</span>
          </dd>
        </div>
        <div>
          <dt>Обновлена</dt>
          <dd>{{ formatDate(application.updatedAt) }}</dd>
        </div>
      </dl>

      <section class="payload-section" aria-label="Данные заявки">
        <h3>Данные заявки</h3>
        <dl v-if="application.details.length" class="payload-data">
          <div v-for="item in application.details" :key="item.key">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
        <p v-else class="empty-payload">Дополнительные данные не переданы.</p>
      </section>
    </article>
  </div>
</template>

<style scoped>
.applications-list {
  border-top: 1px solid var(--border-primary);
}

.application-row {
  display: grid;
  grid-template-columns: minmax(240px, 0.8fr) minmax(280px, 1fr) minmax(360px, 1.4fr);
  border-bottom: 1px solid var(--border-primary);
  background: var(--surface-primary);
}

.application-header,
.client-data,
.payload-section {
  min-width: 0;
  padding: 28px 32px;
}

.application-header,
.client-data {
  border-right: 1px solid var(--hairline);
}

.application-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-5);
}

.application-number,
.payload-section h3,
.client-data dt,
.payload-data dt {
  margin: 0;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.application-number {
  color: var(--accent-primary);
}

.application-header h2 {
  margin: var(--space-3) 0 0;
  font-size: 1.375rem;
  line-height: 1.2;
}

.application-header time,
.client-data dd,
.payload-data dd,
.empty-payload {
  color: var(--foreground-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.client-data,
.payload-data {
  display: grid;
  gap: var(--space-4);
  margin: 0;
}

.client-data div,
.payload-data div {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.client-data dd,
.payload-data dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
}

.client-data a {
  color: var(--foreground-primary);
}

.payload-section h3 {
  margin-bottom: var(--space-4);
}

.payload-data div {
  grid-template-columns: minmax(130px, 0.55fr) minmax(0, 1fr);
  gap: var(--space-4);
  border-top: 1px solid var(--hairline);
  padding-top: var(--space-3);
}

.empty-payload {
  margin: 0;
}

@media (max-width: 1040px) {
  .application-row {
    grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.2fr);
  }

  .payload-section {
    grid-column: 1 / -1;
    border-top: 1px solid var(--hairline);
  }

  .client-data {
    border-right: 0;
  }
}

@media (max-width: 640px) {
  .application-row {
    grid-template-columns: 1fr;
  }

  .application-header,
  .client-data,
  .payload-section {
    padding: 24px;
    border-right: 0;
  }

  .client-data,
  .payload-section {
    border-top: 1px solid var(--hairline);
  }

  .payload-section {
    grid-column: auto;
  }

  .payload-data div {
    grid-template-columns: 1fr;
    gap: 6px;
  }
}
</style>
