<script setup lang="ts">
import type { LegalService } from '../data/legalServices'
import { useConsultationForm } from '../composables/useConsultationForm'

const { services } = defineProps<{
  services: LegalService[]
}>()

const {
  request,
  documentOptions,
  quickPracticeOptions,
  selectedArea,
  selectedDirection,
  selectedSituation,
  selectedGoal,
  phoneError,
  touchPhone,
  updatePhone,
  submit,
} = useConsultationForm(services)

function handlePhoneInput(event: Event) {
  const input = event.currentTarget

  if (input instanceof HTMLInputElement) {
    updatePhone(input.value)
  }
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

      <form
        class="contact-form"
        aria-label="Заявка на консультацию"
        :aria-busy="request.isSubmitting"
        @submit.prevent="submit"
      >
        <div class="form-header">
          <h3>Данные для первичного разбора</h3>
          <p>Укажите контакт, направление и кратко опишите тему запроса.</p>
        </div>

        <div class="request-mode" role="tablist" aria-label="Тип заявки">
          <button
            type="button"
            :class="{ active: request.mode === 'quick' }"
            role="tab"
            :aria-selected="request.mode === 'quick'"
            @click="request.setMode('quick')"
          >
            Быстрая заявка
          </button>
          <button
            type="button"
            :class="{ active: request.mode === 'detail' }"
            role="tab"
            :aria-selected="request.mode === 'detail'"
            @click="request.setMode('detail')"
          >
            Детальная заявка
          </button>
        </div>

        <template v-if="request.mode === 'quick'">
          <div class="field-grid">
            <label>
              <span>ФИО</span>
              <input v-model="request.name" type="text" name="quickName" autocomplete="name" placeholder="Анна Смирнова" />
            </label>
            <label>
              <span>Телефон</span>
              <input
                :value="request.phone"
                type="tel"
                name="quickPhone"
                autocomplete="tel"
                inputmode="tel"
                maxlength="20"
                :aria-invalid="Boolean(phoneError)"
                :aria-describedby="phoneError ? 'phone-error' : undefined"
                placeholder="+7 900 000 00 00"
                @input="handlePhoneInput"
                @blur="touchPhone"
              />
              <small v-if="phoneError" id="phone-error" class="field-error">{{ phoneError }}</small>
            </label>
            <label>
              <span>Электронная почта</span>
              <input
                v-model="request.email"
                type="email"
                name="quickEmail"
                autocomplete="email"
                placeholder="hello@example.ru"
              />
            </label>
          </div>

          <fieldset class="segmented-group">
            <legend>Направление / область права</legend>
            <div class="quick-segments">
              <button
                v-for="practice in quickPracticeOptions"
                :key="practice.id"
                type="button"
                :class="{ active: request.quickPracticeId === practice.id }"
                @click="request.selectQuickPractice(practice.id)"
              >
                {{ practice.title }}
              </button>
            </div>
          </fieldset>

          <label v-if="request.quickPracticeId === 'other'" class="custom-field">
            <span>Свое направление</span>
            <input
              v-model="request.customDirection"
              type="text"
              name="quickCustomDirection"
              placeholder="Опишите направление своими словами"
            />
          </label>

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

          <label class="situation-field">
            <span>Тема запроса</span>
            <textarea
              v-model="request.situation"
              name="quickSituation"
              placeholder="Например: нужно проверить договор, подготовить претензию или оценить судебную перспективу."
            ></textarea>
          </label>

          <div class="form-footer">
            <label class="consent-field">
              <input v-model="request.consent" type="checkbox" name="quickConsent" />
              <span>Согласен на обработку данных. Консультация конфиденциальна.</span>
            </label>
            <button type="submit" :disabled="request.isSubmitting">
              {{ request.isSubmitting ? 'Отправляем...' : 'Получить оценку' }}
            </button>
          </div>
        </template>

        <template v-else>
        <div v-if="request.intakeError" class="intake-state error-state" role="alert">
          <span>{{ request.intakeError }}</span>
          <button type="button" @click="request.reloadCurrentStep()">Повторить</button>
        </div>

        <fieldset class="segmented-group">
          <legend>01. Область права</legend>
          <p v-if="request.intakeLoadingStep === 'areas'" class="intake-state">Загружаем области права...</p>
          <div class="intake-segments area-segments">
            <button
              v-for="area in request.areas"
              :key="area.id"
              type="button"
              :class="{ active: request.legalAreaId === area.id }"
              :disabled="request.isIntakeLoading"
              @click="request.selectArea(area.id)"
            >
              <span>{{ area.title }}</span>
              <small v-if="area.description">{{ area.description }}</small>
            </button>
          </div>
        </fieldset>

        <label v-if="selectedArea?.isOther" class="custom-field">
          <span>Своя область права</span>
          <input
            v-model="request.customArea"
            type="text"
            name="customArea"
            placeholder="Например: миграционный вопрос или медицинский спор"
          />
        </label>

        <fieldset v-if="selectedArea" class="segmented-group">
          <legend>02. Направление</legend>
          <p v-if="request.intakeLoadingStep === 'directions'" class="intake-state">Загружаем направления...</p>
          <div class="intake-segments">
            <button
              v-for="direction in request.directions"
              :key="direction.id"
              type="button"
              :class="{ active: request.directionId === direction.id }"
              :disabled="request.isIntakeLoading"
              @click="request.selectDirection(direction.id)"
            >
              <span>{{ direction.title }}</span>
            </button>
          </div>
        </fieldset>

        <label v-if="selectedDirection?.isOther" class="custom-field">
          <span>Свое направление</span>
          <input
            v-model="request.customDirection"
            type="text"
            name="customDirection"
            placeholder="Опишите направление своими словами"
          />
        </label>

        <fieldset v-if="selectedDirection" class="segmented-group">
          <legend>03. Тип ситуации</legend>
          <p v-if="request.intakeLoadingStep === 'situations'" class="intake-state">Загружаем ситуации...</p>
          <div class="intake-segments">
            <button
              v-for="situationItem in request.situations"
              :key="situationItem.id"
              type="button"
              :class="{ active: request.situationId === situationItem.id }"
              :disabled="request.isIntakeLoading"
              @click="request.selectSituation(situationItem.id)"
            >
              <span>{{ situationItem.title }}</span>
            </button>
          </div>
        </fieldset>

        <label v-if="selectedSituation?.isOther" class="custom-field">
          <span>Своя ситуация</span>
          <input
            v-model="request.customSituation"
            type="text"
            name="customSituation"
            placeholder="Кратко назовите ситуацию"
          />
        </label>

        <fieldset v-if="selectedSituation" class="segmented-group">
          <legend>04. Что нужно получить</legend>
          <p v-if="request.intakeLoadingStep === 'expectedResults'" class="intake-state">Загружаем ожидаемые результаты...</p>
          <div class="intake-segments">
            <button
              v-for="goal in request.expectedResults"
              :key="goal.id"
              type="button"
              :class="{ active: request.goalId === goal.id }"
              :disabled="request.isIntakeLoading"
              @click="request.selectGoal(goal.id)"
            >
              <span>{{ goal.title }}</span>
            </button>
          </div>
        </fieldset>

        <label v-if="selectedGoal?.isOther" class="custom-field">
          <span>Своя задача</span>
          <input
            v-model="request.customGoal"
            type="text"
            name="customGoal"
            placeholder="Например: сопровождение переговоров с конкретной стороной"
          />
        </label>

        <div v-if="selectedGoal" class="field-grid">
          <label>
            <span>ФИО</span>
            <input v-model="request.name" type="text" name="name" autocomplete="name" placeholder="Анна Смирнова" />
          </label>
          <label>
            <span>Телефон</span>
            <input
              :value="request.phone"
              type="tel"
              name="phone"
              autocomplete="tel"
              inputmode="tel"
              maxlength="20"
              :aria-invalid="Boolean(phoneError)"
              :aria-describedby="phoneError ? 'phone-error' : undefined"
              placeholder="+7 900 000 00 00"
              @input="handlePhoneInput"
              @blur="touchPhone"
            />
            <small v-if="phoneError" id="phone-error" class="field-error">{{ phoneError }}</small>
          </label>
          <label>
            <span>Электронная почта</span>
            <input v-model="request.email" type="email" name="email" autocomplete="email" placeholder="hello@example.ru" />
          </label>
        </div>

        <fieldset v-if="selectedGoal" class="segmented-group">
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

        <label v-if="selectedGoal" class="situation-field">
          <span>Тема запроса</span>
          <textarea
            v-model="request.situation"
            name="situation"
            placeholder="Например: нужно проверить договор, подготовить претензию или оценить судебную перспективу."
          ></textarea>
        </label>

        <div v-if="selectedGoal" class="form-footer">
          <label class="consent-field">
            <input v-model="request.consent" type="checkbox" name="consent" />
            <span>Согласен на обработку данных. Консультация конфиденциальна.</span>
          </label>
          <button type="submit" :disabled="request.isSubmitting || request.isIntakeLoading">
            {{ request.isSubmitting ? 'Отправляем...' : 'Получить оценку' }}
          </button>
        </div>
        </template>

        <p v-if="request.submitError" class="submission-message submission-error" role="alert">
          {{ request.submitError }}
        </p>
        <p v-else-if="request.submitSuccess" class="submission-message submission-success" role="status">
          {{ request.submitSuccess }}
        </p>
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
  margin: var(--space-4) 0 0;
  color: var(--foreground-secondary);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.request-mode {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border: 1px solid var(--hairline);
}

.request-mode button {
  min-height: 44px;
  border: 0;
  border-right: 1px solid var(--hairline);
  background: var(--surface-primary);
  color: var(--foreground-primary);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 800;
}

.request-mode button:last-child {
  border-right: 0;
}

.request-mode button.active {
  background: var(--surface-inverse);
  color: var(--foreground-inverse);
}

.field-grid,
.choice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  min-width: 0;
}

.field-grid label:nth-child(3) {
  grid-column: 1 / -1;
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

.field-error {
  color: #b42318;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.35;
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

.segmented-group legend {
  padding: 0;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.2;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.contact-form label > span {
  padding: 0;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.practice-segments,
.quick-segments,
.intake-segments,
.choice-segments {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
}

.practice-segments {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.quick-segments {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.intake-segments {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.area-segments {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.choice-segments {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.practice-segments button,
.quick-segments button,
.intake-segments button,
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

.quick-segments button {
  min-height: 46px;
}

.intake-segments button {
  display: grid;
  gap: 6px;
  min-height: 58px;
  align-content: center;
  padding: var(--space-3);
  text-align: left;
}

.intake-state {
  margin: 0;
  color: var(--foreground-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.4;
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  border: 1px solid var(--hairline);
  padding: var(--space-3);
}

.error-state button {
  min-height: 34px;
  border: 1px solid var(--hairline);
  background: var(--surface-primary);
  color: var(--foreground-primary);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 800;
}

.intake-segments small {
  color: var(--foreground-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.35;
}

.practice-segments button.active {
  border-color: var(--surface-inverse);
  background: var(--surface-inverse);
  color: var(--foreground-inverse);
}

.intake-segments button.active,
.quick-segments button.active,
.choice-segments button.active {
  border-color: var(--accent-primary);
  background: var(--accent-primary);
  color: var(--foreground-inverse);
}

.intake-segments button.active small {
  color: var(--foreground-inverse);
}

.practice-segments button:disabled,
.quick-segments button:disabled,
.intake-segments button:disabled,
.choice-segments button:disabled {
  cursor: wait;
  opacity: 0.62;
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

.form-footer > button:disabled {
  cursor: wait;
  opacity: 0.62;
}

.submission-message {
  margin: 0;
  border: 1px solid var(--hairline);
  padding: var(--space-3);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.45;
}

.submission-error {
  border-color: #b42318;
  color: #b42318;
}

.submission-success {
  border-color: #147d45;
  color: #116638;
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
  .quick-segments,
  .intake-segments,
  .area-segments,
  .choice-segments,
  .request-mode,
  .form-footer {
    grid-template-columns: 1fr;
  }

  .impact-title,
  .impact-cell {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid var(--border-primary);
    padding: 32px 24px;
  }

  .impact-cell:last-child {
    border-bottom: 0;
  }

  .impact-cell {
    gap: var(--space-3);
  }

  .field-grid label:nth-child(3) {
    grid-column: auto;
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
    grid-template-columns: 1fr;
    gap: 0;
    border-top: 1px solid #484848;
    padding-top: 0;
  }

  .contact-promises article:nth-child(3) {
    display: grid;
  }

  .contact-promises article {
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 2px var(--space-3);
    border-bottom: 1px solid #484848;
    padding: 16px 0;
  }

  .contact-promises article:last-child {
    border-bottom: 0;
  }

  .contact-promises strong {
    display: block;
    grid-row: span 2;
  }

  .contact-promises p {
    display: block;
    font-size: 0.8125rem;
  }
}
</style>
