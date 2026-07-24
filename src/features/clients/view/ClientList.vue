<script setup lang="ts">
import type { ClientListItem } from '../model/Client'

interface Props {
  clients: ClientListItem[]
}

const { clients } = defineProps<Props>()
</script>

<template>
  <div class="client-list">
    <div class="client-list-head" aria-hidden="true">
      <span>Номер</span>
      <span>Клиент</span>
      <span>Телефон</span>
      <span>Электронная почта</span>
      <span></span>
    </div>

    <ul class="client-list-body">
      <li v-for="client in clients" :key="client.id" class="client-list-item">
        <RouterLink
          class="client-row"
          :to="{ name: 'client-details', params: { clientId: client.id } }"
          :aria-label="`Открыть профиль клиента ${client.fullName}`"
        >
          <span class="client-cell client-number">
            <span class="cell-label">Номер</span>
            №{{ client.id }}
          </span>
          <strong class="client-cell client-name">
            <span class="cell-label">Клиент</span>
            {{ client.fullName }}
          </strong>
          <span class="client-cell">
            <span class="cell-label">Телефон</span>
            {{ client.phone ?? 'Не указан' }}
          </span>
          <span class="client-cell">
            <span class="cell-label">Электронная почта</span>
            {{ client.email ?? 'Не указана' }}
          </span>
          <span class="client-action">Открыть профиль</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.client-list {
  border-top: 1px solid var(--border-primary);
}

.client-list-body {
  margin: 0;
  padding: 0;
  list-style: none;
}

.client-list-item {
  margin: 0;
}

.client-list-head,
.client-row {
  display: grid;
  grid-template-columns:
    100px
    minmax(220px, 1.15fr)
    minmax(180px, 0.85fr)
    minmax(240px, 1fr)
    150px;
  align-items: center;
}

.client-list-head {
  min-height: 46px;
  padding: 0 32px;
  border-bottom: 1px solid var(--border-primary);
  background: #f4f5f7;
  color: var(--foreground-secondary);
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.client-row {
  min-height: 88px;
  padding: 0 32px;
  border-bottom: 1px solid var(--border-primary);
  color: var(--foreground-primary);
  text-decoration: none;
  transition: background-color 150ms ease, box-shadow 150ms ease;
}

.client-row:hover {
  background: #f1f6ff;
  box-shadow: inset 4px 0 0 var(--accent-primary);
}

.client-cell {
  min-width: 0;
  padding: 20px 24px 20px 0;
  overflow-wrap: anywhere;
  font-size: 0.875rem;
  line-height: 1.45;
}

.client-number {
  color: var(--accent-primary);
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
}

.client-name {
  font-size: 1rem;
}

.client-action {
  justify-self: end;
  color: var(--accent-primary);
  font-size: 0.75rem;
  font-weight: 800;
}

.cell-label {
  display: none;
}

@media (max-width: 980px) {
  .client-list-head {
    display: none;
  }

  .client-row {
    grid-template-columns: 100px minmax(0, 1fr) minmax(150px, 0.7fr);
    align-items: start;
    min-height: 0;
    padding: 24px 28px;
  }

  .client-name {
    grid-column: 2;
    grid-row: 1;
  }

  .client-number {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .client-cell:nth-child(3) {
    grid-column: 2;
    grid-row: 2;
  }

  .client-cell:nth-child(4) {
    grid-column: 3;
    grid-row: 1 / span 2;
  }

  .client-action {
    display: none;
  }

  .cell-label {
    display: block;
    margin-bottom: 5px;
    color: var(--foreground-secondary);
    font-family: "Geist Mono", Consolas, monospace;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
  }
}

@media (max-width: 640px) {
  .client-row {
    grid-template-columns: 72px minmax(0, 1fr);
    padding: 22px 24px;
  }

  .client-cell {
    padding: 0;
  }

  .client-name {
    padding-bottom: 18px;
  }

  .client-cell:nth-child(3),
  .client-cell:nth-child(4) {
    grid-column: 2;
    grid-row: auto;
    padding-top: 14px;
    border-top: 1px solid var(--hairline);
  }
}
</style>
