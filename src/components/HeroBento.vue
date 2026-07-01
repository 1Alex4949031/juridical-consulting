<script setup lang="ts">
interface StatItem {
  value: string
  label: string
}

defineProps<{
  stats: StatItem[]
}>()
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-inner">
      <div class="hero-copy">
        <nav class="nav" aria-label="Основная навигация">
          <a class="brand" href="#">Линия Права</a>
          <a href="#services">Практики</a>
          <a href="#process">Процесс</a>
          <a href="#contact">Контакты</a>
        </nav>

        <div class="hero-message">
          <p class="mono-label">Юридическое сопровождение</p>
          <h1 id="hero-title">Правовая позиция для сделок, споров и частных вопросов</h1>
          <p>
            Сначала фиксируем факты, риски и экономику решения. Затем готовим документы, ведем переговоры или защищаем позицию в суде.
          </p>
          <div class="hero-actions">
            <a class="primary-action" href="#contact">Запросить консультацию</a>
            <a class="secondary-action" href="#services">Смотреть практики</a>
          </div>
        </div>
      </div>

      <figure class="hero-photo" aria-label="Юридические документы">
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=85"
          alt="Документы, деловые бумаги и ручка на рабочем столе"
        />
      </figure>
    </div>

    <div class="proof-strip" aria-label="Показатели практики">
      <article v-for="stat in stats" :key="stat.label" class="proof-cell">
        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>
      </article>
      <article class="proof-cell">
        <strong>B2B / private</strong>
        <span>формат работы</span>
      </article>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: var(--surface-inverse);
}

.hero-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(420px, 1fr);
  min-height: 720px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 88px 72px;
  gap: 56px;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 132px;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
}

.nav a {
  color: #c8c8c8;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.nav .brand {
  color: var(--foreground-inverse);
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.hero-message {
  max-width: 560px;
}

.hero-message .mono-label {
  color: #b8b8b8;
}

.hero-message h1 {
  margin: var(--space-5) 0 0;
  color: var(--foreground-inverse);
  font-size: clamp(2.6rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: 0;
}

.hero-message p:not(.mono-label) {
  max-width: 500px;
  margin: var(--space-5) 0 0;
  color: #d6d6d6;
  font-size: 1.0625rem;
  line-height: 1.45;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.primary-action,
.secondary-action {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  padding: 0 22px;
  border: 1px solid transparent;
  color: var(--foreground-inverse);
  font-weight: 700;
  text-decoration: none;
}

.primary-action {
  background: var(--accent-primary);
}

.secondary-action {
  border-color: #707070;
}

.hero-photo {
  min-height: 608px;
  margin: 0;
  overflow: hidden;
  background: #303030;
}

.hero-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.15) contrast(1.05) brightness(0.82);
}

.proof-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  max-width: 1440px;
  margin: 0 auto;
  border-bottom: 1px solid var(--border-primary);
  background: var(--surface-primary);
}

.proof-cell {
  display: grid;
  gap: var(--space-2);
  min-height: 132px;
  padding: 28px 36px;
  border-right: 1px solid var(--border-primary);
}

.proof-cell:last-child {
  border-right: 0;
}

.proof-cell strong {
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 1.875rem;
  line-height: 1;
}

.proof-cell span {
  color: var(--foreground-secondary);
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
}

@media (max-width: 920px) {
  .hero-inner {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 32px 28px 48px;
  }

  .hero-copy {
    gap: 88px;
  }

  .hero-photo {
    min-height: 360px;
  }

  .proof-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .hero-message h1 {
    font-size: 2.5rem;
  }

  .proof-strip {
    grid-template-columns: 1fr;
  }
}
</style>
