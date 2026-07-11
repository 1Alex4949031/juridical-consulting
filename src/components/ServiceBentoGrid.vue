<script setup lang="ts">
import type { LegalService } from '../data/legalServices'

defineProps<{
  services: LegalService[]
}>()
</script>

<template>
  <section id="services" class="services" aria-labelledby="services-title">
    <div class="services-inner">
      <div class="services-intro">
        <p class="mono-label">Практики</p>
        <h2 id="services-title">Деловой подход без визуального шума</h2>
        <p>
          Каждая задача раскладывается на юридическую позицию, набор документов, сроки и следующий управленческий шаг.
        </p>
      </div>

      <div class="practice-list" role="list">
        <article v-for="service in services.slice(0, 4)" :key="service.id" class="practice-row" role="listitem">
          <h3>{{ service.title }}</h3>
          <p>{{ service.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  background: var(--surface-primary);
}

.services-inner {
  display: grid;
  grid-template-columns: minmax(320px, 430px) minmax(0, 1fr);
  max-width: 1440px;
  min-height: 520px;
  margin: 0 auto;
  padding: clamp(56px, 6vw, 88px);
  gap: clamp(36px, 4vw, 56px);
}

.services-intro {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  min-width: 0;
}

.services-intro .mono-label {
  color: var(--foreground-secondary);
}

.services-intro h2 {
  max-width: 430px;
  margin: 0;
  color: var(--foreground-primary);
  font-size: clamp(2rem, 3.4vw, 2.625rem);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: 0;
}

.services-intro p:not(.mono-label) {
  margin: 0;
  color: var(--foreground-secondary);
  font-size: 1.0625rem;
  line-height: 1.5;
}

.practice-list {
  border-top: 1px solid var(--border-primary);
}

.practice-row {
  display: grid;
  grid-template-columns: minmax(190px, 260px) minmax(0, 1fr);
  gap: var(--space-5);
  min-width: 0;
  padding: 22px 0;
  border-bottom: 1px solid var(--border-primary);
}

.practice-row h3 {
  margin: 0;
  color: var(--foreground-primary);
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.15;
}

.practice-row p {
  min-width: 0;
  margin: 0;
  color: var(--foreground-secondary);
  font-size: 1rem;
  line-height: 1.45;
}

@media (max-width: 1100px) {
  .services-inner {
    grid-template-columns: 1fr;
    padding: 64px 28px;
    gap: 40px;
  }

  .practice-row {
    grid-template-columns: minmax(190px, 260px) minmax(0, 1fr);
  }
}

@media (max-width: 640px) {
  .services-inner {
    padding: 48px 24px;
  }

  .practice-row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
}
</style>
