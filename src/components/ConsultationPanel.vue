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
  documents: 'Есть',
  situation: '',
  consent: false,
})

const selectedService = computed(() =>
  props.services.find((service) => service.id === request.serviceId),
)

const outputItems = computed(() => [
  selectedService.value?.title ?? 'Карта рисков',
  request.documents === 'Есть' ? 'разбор документов' : 'список документов',
  request.urgency === 'Сегодня' ? 'срочный план' : 'ответ до 24 часов',
])

const urgencyOptions = ['Сегодня', 'Неделя', 'Планово']
const documentOptions = ['Есть', 'Нет', 'Нужно подготовить']
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
    <div class="contact-context">
      <p class="mono-label">Заявка на консультацию</p>
      <h2 id="contact-title">Первичная оценка ситуации</h2>
      <p>
        Опишите вопрос в свободной форме. Мы вернемся с перечнем документов,
        картой рисков и ближайшим юридическим шагом.
      </p>

      <ul class="contact-tags" aria-label="Что будет после заявки">
        <li v-for="item in outputItems" :key="item">{{ item }}</li>
      </ul>

      <div class="contact-promises" aria-label="Условия первичного разбора">
        <article>
          <strong>01</strong>
          <span>Конфиденциально</span>
          <p>Информация остается внутри первичного разбора.</p>
        </article>
        <article>
          <strong>02</strong>
          <span>Ответ до 24 часов</span>
          <p>Первичный план после заявки без лишних звонков.</p>
        </article>
      </div>
    </div>

    <form class="contact-form" aria-label="Заявка на консультацию">
      <div class="form-header">
        <h3>Данные для первичного разбора</h3>
        <p>Поля сгруппированы так, как юрист будет разбирать задачу.</p>
      </div>

      <div class="field-grid">
        <label>
          <span>Имя</span>
          <input v-model="request.name" type="text" name="name" autocomplete="name" placeholder="Анна Смирнова" />
        </label>
        <label>
          <span>Телефон или Telegram</span>
          <input v-model="request.phone" type="text" name="phone" autocomplete="tel" placeholder="+7 900 000-00-00" />
        </label>
      </div>

      <fieldset class="segmented-group">
        <legend>Практика</legend>
        <div class="practice-segments">
          <button
            v-for="service in services"
            :key="service.id"
            type="button"
            :class="{ active: request.serviceId === service.id }"
            @click="request.serviceId = service.id"
          >
            {{ service.title }}
          </button>
        </div>
      </fieldset>

      <div class="choice-grid">
        <fieldset class="segmented-group">
          <legend>Срочность</legend>
          <div class="choice-segments">
            <button
              v-for="option in urgencyOptions"
              :key="option"
              type="button"
              :class="{ active: request.urgency === option }"
              @click="request.urgency = option"
            >
              {{ option === 'Неделя' ? 'На неделе' : option }}
            </button>
          </div>
        </fieldset>

        <fieldset class="segmented-group">
          <legend>Документы</legend>
          <div class="choice-segments">
            <button
              v-for="option in documentOptions"
              :key="option"
              type="button"
              :class="{ active: request.documents === option }"
              @click="request.documents = option"
            >
              {{ option }}
            </button>
          </div>
        </fieldset>
      </div>

      <label class="situation-field">
        <span>Кратко опишите ситуацию</span>
        <textarea
          v-model="request.situation"
          name="situation"
          placeholder="Например: контрагент не исполняет договор, нужна претензия и понимание судебной перспективы."
        ></textarea>
      </label>

      <div class="form-footer">
        <label class="consent-field">
          <input v-model="request.consent" type="checkbox" name="consent" />
          <span>Согласен на обработку данных. Консультация конфиденциальна.</span>
        </label>
        <button type="button">Получить первичную оценку</button>
      </div>
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
  grid-template-columns: minmax(320px, 430px) minmax(0, 1fr);
  width: 100%;
  background: var(--surface-inverse);
  color: var(--foreground-inverse);
}

.contact-context {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 64px 48px;
  background: var(--surface-inverse);
}

.contact-context .mono-label {
  color: #b8b8b8;
}

.contact-context h2 {
  margin: 0;
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  line-height: 1.08;
}

.contact-context > p {
  max-width: 34rem;
  margin: 0;
  color: #d6d6d6;
  font-size: 1.0625rem;
  line-height: 1.58;
}

.contact-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.contact-tags li {
  border: 1px solid #707070;
  padding: var(--space-2) var(--space-3);
  color: #d6d6d6;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
}

.contact-promises {
  display: grid;
  gap: var(--space-5);
  border-top: 1px solid #484848;
  padding-top: var(--space-5);
}

.contact-promises article {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 4px 18px;
}

.contact-promises strong {
  grid-row: span 2;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 1rem;
}

.contact-promises span {
  font-weight: 800;
}

.contact-promises p {
  margin: 0;
  color: #b8b8b8;
  font-size: 0.875rem;
  line-height: 1.45;
}

.contact-form {
  display: grid;
  gap: var(--space-5);
  padding: 64px 88px;
  background: var(--surface-primary);
  color: var(--foreground-primary);
}

.form-header h3 {
  margin: 0;
  font-size: clamp(1.5rem, 2.4vw, 1.875rem);
  line-height: 1.14;
}

.form-header p {
  max-width: 42rem;
  margin: var(--space-2) 0 0;
  color: var(--foreground-secondary);
  line-height: 1.5;
}

.field-grid,
.choice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.contact-form label {
  display: grid;
  gap: var(--space-2);
  color: var(--foreground-primary);
  font-size: 0.875rem;
  font-weight: 700;
}

.contact-form input,
.contact-form textarea {
  min-height: 44px;
  border: 1px solid var(--hairline);
  background: var(--surface-primary);
  color: var(--foreground-primary);
  padding: 0 var(--space-3);
}

.contact-form textarea {
  min-height: 118px;
  resize: vertical;
  padding: var(--space-3);
  line-height: 1.45;
}

.segmented-group {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.segmented-group legend,
.contact-form label > span {
  padding: 0;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.practice-segments,
.choice-segments {
  display: grid;
  gap: var(--space-2);
}

.practice-segments {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.choice-segments {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.practice-segments button,
.choice-segments button {
  min-height: 40px;
  border: 1px solid var(--hairline);
  background: var(--surface-primary);
  color: var(--foreground-primary);
  cursor: pointer;
  font-weight: 700;
}

.practice-segments button.active {
  border-color: var(--surface-inverse);
  background: var(--surface-inverse);
  color: var(--foreground-inverse);
}

.choice-segments button.active {
  border-color: var(--accent-primary);
  background: var(--accent-primary);
  color: var(--foreground-inverse);
}

.form-footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  align-items: center;
  gap: var(--space-5);
}

.consent-field {
  display: flex !important;
  align-items: flex-start;
  gap: var(--space-2);
  color: var(--foreground-secondary) !important;
  font-size: 0.8125rem !important;
  line-height: 1.4;
}

.consent-field input {
  min-height: auto;
  width: 18px;
  height: 18px;
  margin: 0;
  padding: 0;
  accent-color: var(--accent-primary);
}

.contact-form button {
  min-height: 50px;
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
  }

  .contact-context,
  .contact-form {
    padding: 56px 28px;
  }

  .practice-segments {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .impact-grid,
  .field-grid,
  .choice-grid,
  .practice-segments,
  .choice-segments,
  .form-footer {
    grid-template-columns: 1fr;
  }

  .contact-context,
  .contact-form {
    padding: 44px 24px;
  }
}
</style>
