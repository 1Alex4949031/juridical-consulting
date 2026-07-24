<script setup lang="ts">
import type { ConsultationController } from '../controller/useConsultationController'

const { controller } = defineProps<{
  controller: ConsultationController
  consentName: string
  disabled?: boolean
}>()

const { model } = controller

function updateConsent(event: Event) {
  if (event.currentTarget instanceof HTMLInputElement) {
    model.fields.consent.setValue(event.currentTarget.checked)
  }
}
</script>

<template>
  <div class="form-footer">
    <div class="consent-wrap">
      <label class="consent-field">
        <input
          :checked="model.fields.consent.value"
          type="checkbox"
          :name="consentName"
          @change="updateConsent"
          @blur="model.fields.consent.touch()"
        />
        <span>Согласен на обработку данных. Консультация конфиденциальна.</span>
      </label>
      <small v-if="model.fields.consent.error" class="group-error">
        {{ model.fields.consent.error }}
      </small>
    </div>
    <button type="submit" :disabled="model.isSubmitting || disabled">
      {{ model.isSubmitting ? 'Отправляем...' : 'Получить оценку' }}
    </button>
  </div>
</template>

<style scoped>
.form-footer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 212px;
  align-items: center;
  gap: 18px;
}

.consent-wrap {
  display: grid;
  gap: var(--space-2);
}

.consent-field {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  color: var(--foreground-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.4;
}

.consent-field input {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  margin: 0;
  padding: 0;
  accent-color: var(--accent-primary);
}

.group-error {
  color: #b42318;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.35;
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

@media (max-width: 560px) {
  .form-footer {
    grid-template-columns: 1fr;
  }
}
</style>
