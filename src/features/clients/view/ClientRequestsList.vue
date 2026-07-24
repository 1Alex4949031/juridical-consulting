<script setup lang="ts">
import type { ClientRequest } from '../model/Client'

interface Props {
  requests: ClientRequest[]
}

const { requests } = defineProps<Props>()

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function formatDate(value: Date | null): string {
  return value ? dateFormatter.format(value) : 'Дата не указана'
}
</script>

<template>
  <div class="requests-list" role="list">
    <article
      v-for="(request, index) in requests"
      :key="request.id"
      class="request-row"
      role="listitem"
    >
      <header class="request-header">
        <p class="request-number">Заявка {{ String(index + 1).padStart(2, '0') }}</p>
        <h2>{{ request.details[0]?.value ?? 'Обращение клиента' }}</h2>
        <dl class="request-dates">
          <div>
            <dt>Создана</dt>
            <dd>
              <time :datetime="request.createdAt?.toISOString()">
                {{ formatDate(request.createdAt) }}
              </time>
            </dd>
          </div>
          <div>
            <dt>Обновлена</dt>
            <dd>
              <time :datetime="request.updatedAt?.toISOString()">
                {{ formatDate(request.updatedAt) }}
              </time>
            </dd>
          </div>
        </dl>
      </header>

      <section class="request-content" aria-label="Сведения по заявке">
        <dl v-if="request.details.length" class="request-details">
          <div v-for="detail in request.details" :key="detail.key">
            <dt>{{ detail.label }}</dt>
            <dd>{{ detail.value }}</dd>
          </div>
        </dl>
        <p v-else class="empty-request">Дополнительные сведения не переданы.</p>
      </section>
    </article>
  </div>
</template>

<style scoped>
.requests-list {
  border-top: 1px solid var(--border-primary);
}

.request-row {
  display: grid;
  grid-template-columns: minmax(240px, 0.72fr) minmax(0, 1.55fr);
  border-bottom: 1px solid var(--border-primary);
}

.request-header,
.request-content {
  min-width: 0;
  padding: 30px 32px;
}

.request-header {
  border-right: 1px solid var(--hairline);
}

.request-number,
.request-dates dt,
.request-details dt {
  margin: 0;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.request-number {
  color: var(--accent-primary);
}

.request-header h2 {
  margin: var(--space-4) 0 28px;
  font-size: 1.25rem;
  line-height: 1.25;
}

.request-dates,
.request-details {
  display: grid;
  margin: 0;
}

.request-dates {
  gap: var(--space-4);
}

.request-dates div {
  display: grid;
  gap: 6px;
}

.request-dates dd,
.request-details dd,
.empty-request {
  margin: 0;
  color: var(--foreground-secondary);
  font-size: 0.875rem;
  line-height: 1.55;
}

.request-details div {
  display: grid;
  grid-template-columns: minmax(150px, 0.45fr) minmax(0, 1fr);
  gap: var(--space-5);
  padding: 15px 0;
  border-bottom: 1px solid var(--hairline);
}

.request-details div:first-child {
  padding-top: 0;
}

.request-details div:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.request-details dd {
  min-width: 0;
  color: var(--foreground-primary);
  overflow-wrap: anywhere;
}

.empty-request {
  margin: 0;
}

@media (max-width: 780px) {
  .request-row {
    grid-template-columns: 1fr;
  }

  .request-header,
  .request-content {
    padding: 26px 24px;
  }

  .request-header {
    border-right: 0;
    border-bottom: 1px solid var(--hairline);
  }

  .request-header h2 {
    margin-bottom: 22px;
  }

  .request-dates {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .request-dates,
  .request-details div {
    grid-template-columns: 1fr;
  }

  .request-details div {
    gap: 6px;
  }
}
</style>
