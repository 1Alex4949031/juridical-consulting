<script setup lang="ts">
import type { ConsultationController } from '../controller/useConsultationController'
import type { AbstractField } from '../model/fields'
import BaseInput from './BaseInput.vue'
import BaseTextarea from './BaseTextarea.vue'
import ContactFieldsView from './ContactFieldsView.vue'
import RequestFooterView from './RequestFooterView.vue'
import SegmentedChoiceGroup from './SegmentedChoiceGroup.vue'

const { controller } = defineProps<{
  controller: ConsultationController
}>()

const { model, documentOptions } = controller
const documentChoices = documentOptions.map((title) => ({ id: title, title }))

type WritableStringField = Pick<AbstractField<string>, 'setValue'>

function updateField(field: WritableStringField, value: string | undefined) {
  field.setValue(value ?? '')
}
</script>

<template>
  <div class="mode-fields">
    <div v-if="model.intake.error" class="intake-state error-state" role="alert">
      <span>{{ model.intake.error }}</span>
      <button type="button" @click="controller.retryIntake">Повторить</button>
    </div>

    <SegmentedChoiceGroup
      legend="01. Область права"
      :options="model.intake.areas"
      :selected-id="model.intake.area.value"
      :loading-text="
        model.intake.loadingStep === 'areas' ? 'Загружаем области права...' : ''
      "
      :error="model.intake.area.error"
      :disabled="model.intake.isLoading"
      @select="controller.selectArea"
    />

    <BaseInput
      v-if="model.intake.selectedArea?.isOther"
      id="custom-area"
      :model-value="model.intake.customArea.value"
      name="customArea"
      :label="model.intake.customArea.label"
      placeholder="Например: миграционный вопрос или медицинский спор"
      :error="model.intake.customArea.error"
      @update:model-value="updateField(model.intake.customArea, $event)"
      @blur="model.intake.customArea.touch()"
    />

    <SegmentedChoiceGroup
      v-if="model.intake.selectedArea"
      legend="02. Направление"
      :options="model.intake.directions"
      :selected-id="model.intake.direction.value"
      :loading-text="
        model.intake.loadingStep === 'directions' ? 'Загружаем направления...' : ''
      "
      :error="model.intake.direction.error"
      :disabled="model.intake.isLoading"
      @select="controller.selectDirection"
    />

    <BaseInput
      v-if="model.intake.selectedDirection?.isOther"
      id="custom-direction"
      :model-value="model.intake.customDirection.value"
      name="customDirection"
      :label="model.intake.customDirection.label"
      placeholder="Опишите направление своими словами"
      :error="model.intake.customDirection.error"
      @update:model-value="updateField(model.intake.customDirection, $event)"
      @blur="model.intake.customDirection.touch()"
    />

    <SegmentedChoiceGroup
      v-if="model.intake.selectedDirection"
      legend="03. Тип ситуации"
      :options="model.intake.situations"
      :selected-id="model.intake.situation.value"
      :loading-text="
        model.intake.loadingStep === 'situations' ? 'Загружаем ситуации...' : ''
      "
      :error="model.intake.situation.error"
      :disabled="model.intake.isLoading"
      @select="controller.selectSituation"
    />

    <BaseInput
      v-if="model.intake.selectedSituation?.isOther"
      id="custom-situation"
      :model-value="model.intake.customSituation.value"
      name="customSituation"
      :label="model.intake.customSituation.label"
      placeholder="Кратко назовите ситуацию"
      :error="model.intake.customSituation.error"
      @update:model-value="updateField(model.intake.customSituation, $event)"
      @blur="model.intake.customSituation.touch()"
    />

    <SegmentedChoiceGroup
      v-if="model.intake.selectedSituation"
      legend="04. Что нужно получить"
      :options="model.intake.expectedResults"
      :selected-id="model.intake.expectedResult.value"
      :loading-text="
        model.intake.loadingStep === 'expectedResults'
          ? 'Загружаем ожидаемые результаты...'
          : ''
      "
      :error="model.intake.expectedResult.error"
      :disabled="model.intake.isLoading"
      @select="controller.selectExpectedResult"
    />

    <BaseInput
      v-if="model.intake.selectedExpectedResult?.isOther"
      id="custom-expected-result"
      :model-value="model.intake.customExpectedResult.value"
      name="customExpectedResult"
      :label="model.intake.customExpectedResult.label"
      placeholder="Например: сопровождение переговоров с конкретной стороной"
      :error="model.intake.customExpectedResult.error"
      @update:model-value="updateField(model.intake.customExpectedResult, $event)"
      @blur="model.intake.customExpectedResult.touch()"
    />

    <template v-if="model.intake.selectedExpectedResult">
      <ContactFieldsView :controller="controller" prefix="detail" />

      <SegmentedChoiceGroup
        legend="Документы"
        :options="documentChoices"
        :selected-id="model.fields.documents.value"
        variant="compact"
        @select="controller.setDocuments"
      />

      <BaseTextarea
        id="detail-request-topic"
        :model-value="model.fields.requestTopic.value"
        name="situation"
        :label="model.fields.requestTopic.label"
        placeholder="Например: нужно проверить договор, подготовить претензию или оценить судебную перспективу."
        :error="model.fields.requestTopic.error"
        @update:model-value="updateField(model.fields.requestTopic, $event)"
        @blur="model.fields.requestTopic.touch()"
      />

      <RequestFooterView
        :controller="controller"
        consent-name="consent"
        :disabled="model.intake.isLoading"
      />
    </template>
  </div>
</template>

<style scoped>
.mode-fields {
  display: contents;
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
</style>
