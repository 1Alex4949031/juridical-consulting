<script setup lang="ts">
import type { ConsultationController } from '../controller/useConsultationController'
import DetailedRequestView from './DetailedRequestView.vue'
import QuickRequestView from './QuickRequestView.vue'

const { controller } = defineProps<{
  controller: ConsultationController
}>()

const { model } = controller
</script>

<template>
  <form
    class="contact-form"
    aria-label="Заявка на консультацию"
    :aria-busy="model.isSubmitting"
    @submit.prevent="controller.submit"
  >
    <div class="form-header">
      <h3>Данные для первичного разбора</h3>
      <p>Укажите контакт, направление и кратко опишите тему запроса.</p>
    </div>

    <div class="request-mode" role="tablist" aria-label="Тип заявки">
      <button
        type="button"
        :class="{ active: model.mode === 'quick' }"
        role="tab"
        :aria-selected="model.mode === 'quick'"
        @click="controller.setMode('quick')"
      >
        Быстрая заявка
      </button>
      <button
        type="button"
        :class="{ active: model.mode === 'detail' }"
        role="tab"
        :aria-selected="model.mode === 'detail'"
        @click="controller.setMode('detail')"
      >
        Детальная заявка
      </button>
    </div>

    <QuickRequestView v-if="model.mode === 'quick'" :controller="controller" />
    <DetailedRequestView v-else :controller="controller" />

    <p v-if="model.submitError" class="submission-message submission-error" role="alert">
      {{ model.submitError }}
    </p>
    <p v-else-if="model.submitSuccess" class="submission-message submission-success" role="status">
      {{ model.submitSuccess }}
    </p>
  </form>
</template>

<style scoped>
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
  .contact-form {
    width: 100%;
    max-width: none;
    padding: 44px 24px;
  }
}

@media (max-width: 560px) {
  .request-mode {
    grid-template-columns: 1fr;
  }

  .request-mode button {
    border-right: 0;
    border-bottom: 1px solid var(--hairline);
  }

  .request-mode button:last-child {
    border-bottom: 0;
  }

  .contact-form {
    padding: 30px 24px;
  }
}
</style>
