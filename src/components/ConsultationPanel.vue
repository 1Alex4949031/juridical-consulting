<script setup lang="ts">
import { reactive } from 'vue'
import type { LegalService } from '../data/legalServices'

const props = defineProps<{
  services: LegalService[]
}>()

const request = reactive({
  name: '',
  phone: '',
  serviceId: props.services[0]?.id ?? '',
  practiceKey: 'business',
  urgency: 'Неделя',
  documents: 'Нет',
  situation: '',
  consent: false,
})

const urgencyOptions = ['Сегодня', 'Неделя', 'Планово']
const documentOptions = ['Есть', 'Нет', 'Нужно подготовить']

const practiceOptions = [
  { key: 'business', id: 'business', label: 'Бизнес' },
  { key: 'court', id: 'court', label: 'Суд' },
  { key: 'labor', id: 'labor', label: 'Трудовое' },
  { key: 'estate', id: 'estate', label: 'Недвижимость' },
  { key: 'family', id: 'family', label: 'Семейное' },
  { key: 'inheritance', id: 'estate', label: 'Наследство' },
]

function selectPractice(service: { key: string; id: string }) {
  request.practiceKey = service.key
  request.serviceId = service.id
}
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
    <div class="contact-frame">
      <div class="contact-context">
        <p class="mono-label">Заявка на консультацию</p>
        <h2 id="contact-title">Первичная оценка ситуации</h2>
        <p>
          Опишите вопрос в свободной форме. Мы вернемся с перечнем документов,
          картой рисков и ближайшим юридическим шагом.
        </p>

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
          <article>
            <strong>03</strong>
            <span>Без лишних звонков</span>
            <p>Сначала уточним только юридически важные факты.</p>
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
              v-for="service in practiceOptions"
              :key="service.key"
              type="button"
              :class="{ active: request.practiceKey === service.key }"
              @click="selectPractice(service)"
            >
              {{ service.label }}
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
          <button type="button">Получить оценку</button>
        </div>
      </form>
    </div>
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
  width: 100%;
  background: var(--surface-inverse);
  color: var(--foreground-inverse);
}

.contact-frame {
  display: grid;
  grid-template-columns: 430px 750px;
  width: min(100%, 1180px);
  min-height: 870px;
  margin: 0 auto;
}

.contact-context {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 56px 48px;
  background: var(--surface-inverse);
}

.contact-context .mono-label {
  color: #b8b8b8;
}

.contact-context h2 {
  margin: 0;
  font-size: clamp(2rem, 3.4vw, 2.75rem);
  line-height: 1.08;
}

.contact-context > p {
  max-width: 34rem;
  margin: 0;
  color: #d6d6d6;
  font-size: 1.0625rem;
  line-height: 1.58;
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
  align-content: start;
  width: 750px;
  max-width: 750px;
  gap: var(--space-5);
  padding: 54px 58px 52px;
  background: var(--surface-primary);
  color: var(--foreground-primary);
}

.form-header h3 {
  margin: 0;
  font-size: clamp(1.375rem, 2.2vw, 1.875rem);
  line-height: 1.14;
}

.form-header p {
  max-width: 39rem;
  margin: var(--space-2) 0 0;
  color: var(--foreground-secondary);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.field-grid,
.choice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  min-width: 0;
}

.contact-form label {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  color: var(--foreground-primary);
  font-size: 0.8125rem;
  font-weight: 700;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  min-width: 0;
  min-height: 46px;
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
  min-width: 0;
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
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.1;
  padding: 0 var(--space-2);
  text-align: center;
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
  grid-template-columns: minmax(0, 1fr) 212px;
  align-items: center;
  gap: 18px;
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

.form-footer > button {
  min-height: 44px;
  border: 0;
  background: var(--accent-primary);
  color: var(--foreground-inverse);
  cursor: pointer;
  font-size: 0.8125rem;
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

  .contact-frame {
    grid-template-columns: 1fr;
    width: 100%;
    min-height: 0;
  }

  .contact-form {
    width: 100%;
    max-width: none;
  }

  .contact-context,
  .contact-form {
    padding: 44px 24px;
  }

  .contact-context {
    gap: 18px;
  }

  .practice-segments {
    grid-template-columns: 1fr;
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
    padding: 30px 24px;
  }

  .contact-context h2 {
    font-size: 2rem;
    line-height: 1.12;
  }

  .contact-context > p {
    font-size: 0.9375rem;
  }

  .contact-promises {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-2);
    border-top: 0;
    padding-top: 0;
  }

  .contact-promises article:nth-child(3) {
    display: none;
  }

  .contact-promises article {
    display: block;
    border: 1px solid #707070;
    padding: var(--space-2);
  }

  .contact-promises strong,
  .contact-promises p {
    display: none;
  }
}
</style>
