<script setup lang="ts">
import type { LegalService } from '../data/legalServices'
import { useConsultationController } from '../features/consultation/controller/useConsultationController'
import ConsultationFormView from '../features/consultation/view/ConsultationFormView.vue'

const { services } = defineProps<{
  services: LegalService[]
}>()

const controller = useConsultationController(services)
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

      <ConsultationFormView :controller="controller" />
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

  .contact-context {
    gap: 18px;
    padding: 44px 24px;
  }
}

@media (max-width: 560px) {
  .impact-grid {
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

  .contact-context {
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
