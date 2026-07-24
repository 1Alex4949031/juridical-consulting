<script setup lang="ts">
import type { ConsultationController } from '../controller/useConsultationController'
import type { AbstractField } from '../model/fields'
import BaseInput from './BaseInput.vue'

const { controller, prefix } = defineProps<{
  controller: ConsultationController
  prefix: 'quick' | 'detail'
}>()

const { model } = controller

type WritableStringField = Pick<AbstractField<string>, 'setValue'>

function updateField(field: WritableStringField, value: string | undefined) {
  field.setValue(value ?? '')
}
</script>

<template>
  <div class="field-grid">
    <BaseInput
      :id="`${prefix}-name`"
      :model-value="model.fields.name.value"
      :name="`${prefix}Name`"
      :label="model.fields.name.label"
      autocomplete="name"
      placeholder="Анна Смирнова"
      :error="model.fields.name.error"
      @update:model-value="updateField(model.fields.name, $event)"
      @blur="model.fields.name.touch()"
    />
    <BaseInput
      :id="`${prefix}-phone`"
      :model-value="model.fields.phone.value"
      :name="`${prefix}Phone`"
      :label="model.fields.phone.label"
      type="tel"
      autocomplete="tel"
      inputmode="tel"
      :maxlength="16"
      mask="+7 ### ### ## ##"
      placeholder="+7 900 000 00 00"
      :error="model.fields.phone.error"
      @update:model-value="updateField(model.fields.phone, $event)"
      @blur="model.fields.phone.touch()"
    />
    <BaseInput
      :id="`${prefix}-email`"
      class="email-field"
      :model-value="model.fields.email.value"
      :name="`${prefix}Email`"
      :label="model.fields.email.label"
      type="email"
      autocomplete="email"
      inputmode="email"
      placeholder="hello@example.ru"
      :error="model.fields.email.error"
      @update:model-value="updateField(model.fields.email, $event)"
      @blur="model.fields.email.touch()"
    />
  </div>
</template>

<style scoped>
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  min-width: 0;
}

.email-field {
  grid-column: 1 / -1;
}

@media (max-width: 560px) {
  .field-grid {
    grid-template-columns: 1fr;
  }

  .email-field {
    grid-column: auto;
  }
}
</style>
