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
    <ContactFieldsView :controller="controller" prefix="quick" />

    <SegmentedChoiceGroup
      legend="Направление / область права"
      :options="model.quickPracticeOptions"
      :selected-id="model.fields.quickPractice.value"
      variant="quick"
      :error="model.fields.quickPractice.error"
      @select="controller.selectQuickPractice"
    />

    <BaseInput
      v-if="model.fields.quickPractice.value === 'other'"
      id="quick-custom-direction"
      :model-value="model.intake.customDirection.value"
      name="quickCustomDirection"
      :label="model.intake.customDirection.label"
      placeholder="Опишите направление своими словами"
      :error="model.intake.customDirection.error"
      @update:model-value="updateField(model.intake.customDirection, $event)"
      @blur="model.intake.customDirection.touch()"
    />

    <SegmentedChoiceGroup
      legend="Документы"
      :options="documentChoices"
      :selected-id="model.fields.documents.value"
      variant="compact"
      @select="controller.setDocuments"
    />

    <BaseTextarea
      id="quick-request-topic"
      :model-value="model.fields.requestTopic.value"
      name="quickSituation"
      :label="model.fields.requestTopic.label"
      placeholder="Например: нужно проверить договор, подготовить претензию или оценить судебную перспективу."
      :error="model.fields.requestTopic.error"
      @update:model-value="updateField(model.fields.requestTopic, $event)"
      @blur="model.fields.requestTopic.touch()"
    />

    <RequestFooterView :controller="controller" consent-name="quickConsent" />
  </div>
</template>

<style scoped>
.mode-fields {
  display: contents;
}
</style>
