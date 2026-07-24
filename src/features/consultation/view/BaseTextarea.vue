<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  name: string
  label: string
  placeholder?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: undefined,
  error: '',
})

const model = defineModel<string>({ required: true })
const emit = defineEmits<{
  blur: []
}>()

const errorId = computed(() => `${props.id}-error`)
</script>

<template>
  <label class="base-field" :for="id">
    <span class="base-field-label">{{ label }}</span>
    <textarea
      :id="id"
      v-model="model"
      class="base-field-control"
      :name="name"
      :placeholder="placeholder"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? errorId : undefined"
      @blur="emit('blur')"
    ></textarea>
    <small v-if="error" :id="errorId" class="base-field-error">{{ error }}</small>
  </label>
</template>

<style scoped>
.base-field {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  color: var(--foreground-primary);
  font-size: 0.8125rem;
  font-weight: 700;
}

.base-field-label {
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.base-field-control {
  width: 100%;
  min-width: 0;
  min-height: 118px;
  resize: vertical;
  border: 1px solid var(--hairline);
  background: var(--surface-primary);
  color: var(--foreground-primary);
  padding: var(--space-3);
  line-height: 1.45;
}

.base-field-control:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

.base-field-control[aria-invalid="true"] {
  border-color: #b42318;
}

.base-field-error {
  color: #b42318;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.35;
}
</style>
