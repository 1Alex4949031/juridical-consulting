<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { LegalService } from '../data/legalServices'

const props = defineProps<{
  services: LegalService[]
}>()

const request = reactive({
  name: '',
  phone: '',
  serviceId: props.services[0]?.id ?? '',
  urgency: 'Неделя',
})

const selectedService = computed(() =>
  props.services.find((service) => service.id === request.serviceId),
)

const outputItems = computed(() => [
  selectedService.value?.title ?? 'Карта рисков',
  'пакет документов',
  request.urgency === 'Сегодня' ? 'срочный план' : 'план после созвона',
])
</script>

<template>
  <section id="process" class="impact" aria-labelledby="impact-title">
    <div class="impact-grid">
      <div class="impact-title">
        <p class="mono-label">Структура работы</p>
        <h2 id="impact-title">Что клиент получает на выходе</h2>
      </div>

      <article class="impact-cell">
        <strong>01</strong>
        <span>карта рисков</span>
      </article>
      <article class="impact-cell">
        <strong>02</strong>
        <span>пакет документов</span>
      </article>
      <article class="impact-cell">
        <strong>03</strong>
        <span>позиция для переговоров</span>
      </article>
      <article class="impact-cell">
        <strong>04</strong>
        <span>план суда</span>
      </article>
    </div>
  </section>

  <section id="contact" class="contact" aria-labelledby="contact-title">
    <div class="contact-copy">
      <h2 id="contact-title">Опишите ситуацию. Мы вернемся с первичной оценкой и списком документов.</h2>
      <ul>
        <li v-for="item in outputItems" :key="item">{{ item }}</li>
      </ul>
    </div>

    <form class="contact-form" aria-label="Заявка на консультацию">
      <label>
        <span>Имя</span>
        <input v-model="request.name" type="text" name="name" autocomplete="name" placeholder="Анна Смирнова" />
      </label>
      <label>
        <span>Телефон или Telegram</span>
        <input v-model="request.phone" type="text" name="phone" autocomplete="tel" placeholder="+7 900 000-00-00" />
      </label>
      <label>
        <span>Практика</span>
        <select v-model="request.serviceId" name="service">
          <option v-for="service in services" :key="service.id" :value="service.id">
            {{ service.title }}
          </option>
        </select>
      </label>
      <div class="radio-row" role="radiogroup" aria-label="Срок">
        <label>
          <input v-model="request.urgency" type="radio" name="urgency" value="Сегодня" />
          <span>Сегодня</span>
        </label>
        <label>
          <input v-model="request.urgency" type="radio" name="urgency" value="Неделя" />
          <span>На неделе</span>
        </label>
      </div>
      <button type="button">Связаться</button>
    </form>
  </section>
</template>

<style scoped>
.impact {
  background: var(--accent-primary);
}

.impact-grid {
  display: grid;
  grid-template-columns: 420px repeat(4, minmax(0, 1fr));
  max-width: 1440px;
  min-height: 360px;
  margin: 0 auto;
}

.impact-title,
.impact-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 360px;
  padding: 56px 48px;
  border-right: 1px solid var(--border-primary);
  color: var(--foreground-inverse);
}

.impact-cell {
  gap: 28px;
  padding: 56px 32px;
}

.impact-title h2 {
  max-width: 320px;
  margin: var(--space-5) 0 0;
  font-size: clamp(2rem, 3.2vw, 2.5rem);
  line-height: 1.05;
  letter-spacing: 0;
}

.impact-cell strong {
  font-family: "Geist Mono", Consolas, monospace;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  line-height: 1;
}

.impact-cell span {
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.1;
}

.contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  max-width: 1440px;
  margin: 0 auto;
  padding: 64px 88px;
  gap: 64px;
  background: var(--surface-inverse);
  color: var(--foreground-inverse);
}

.contact-copy h2 {
  max-width: 720px;
  margin: 0;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  line-height: 1.12;
}

.contact-copy ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin: var(--space-5) 0 0;
  padding: 0;
  list-style: none;
}

.contact-copy li {
  border: 1px solid #707070;
  padding: var(--space-2) var(--space-3);
  color: #d6d6d6;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
}

.contact-form {
  display: grid;
  gap: var(--space-3);
}

.contact-form label {
  display: grid;
  gap: var(--space-2);
  color: #d6d6d6;
  font-size: 0.875rem;
  font-weight: 700;
}

.contact-form input,
.contact-form select {
  min-height: 44px;
  border: 1px solid #707070;
  background: #111111;
  color: var(--foreground-inverse);
  padding: 0 var(--space-3);
}

.radio-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.radio-row label {
  display: flex;
  align-items: center;
  min-height: 44px;
  border: 1px solid #707070;
  padding: 0 var(--space-3);
}

.contact-form button {
  min-height: 46px;
  border: 0;
  background: var(--accent-primary);
  color: var(--foreground-inverse);
  cursor: pointer;
  font-weight: 800;
}

@media (max-width: 980px) {
  .impact-grid {
    grid-template-columns: 1fr 1fr;
  }

  .impact-title,
  .impact-cell {
    min-height: 240px;
  }

  .contact {
    grid-template-columns: 1fr;
    padding: 56px 28px;
  }
}

@media (max-width: 560px) {
  .impact-grid,
  .radio-row {
    grid-template-columns: 1fr;
  }
}
</style>
