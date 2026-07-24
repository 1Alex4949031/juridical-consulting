<script setup lang="ts">
export interface ChoiceOption {
  id: string
  title: string
  description?: string
}

interface Props {
  legend: string
  options: readonly ChoiceOption[]
  selectedId: string
  variant?: 'quick' | 'intake' | 'compact'
  loadingText?: string
  error?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'intake',
  loadingText: '',
  error: '',
  disabled: false,
})

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <fieldset class="segmented-group">
    <legend>{{ legend }}</legend>
    <p v-if="loadingText" class="intake-state">{{ loadingText }}</p>
    <div class="segment-grid" :class="`segment-grid-${variant}`">
      <button
        v-for="option in options"
        :key="option.id"
        type="button"
        :class="{ active: selectedId === option.id }"
        :disabled="disabled"
        :aria-pressed="selectedId === option.id"
        @click="emit('select', option.id)"
      >
        <span>{{ option.title }}</span>
        <small v-if="option.description">{{ option.description }}</small>
      </button>
    </div>
    <small v-if="error" class="group-error">{{ error }}</small>
  </fieldset>
</template>

<style scoped>
.segmented-group {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.segmented-group legend {
  margin-bottom: var(--space-3);
  padding: 0;
  font-family: "Geist Mono", Consolas, monospace;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.2;
  text-transform: uppercase;
}

.segment-grid {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
}

.segment-grid-quick,
.segment-grid-intake {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.segment-grid-compact {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.segment-grid button {
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

.segment-grid-quick button {
  min-height: 46px;
}

.segment-grid-intake button {
  display: grid;
  gap: 6px;
  min-height: 58px;
  align-content: center;
  padding: var(--space-3);
  text-align: left;
}

.segment-grid button.active {
  border-color: var(--accent-primary);
  background: var(--accent-primary);
  color: var(--foreground-inverse);
}

.segment-grid button.active small {
  color: var(--foreground-inverse);
}

.segment-grid button:disabled {
  cursor: wait;
  opacity: 0.62;
}

.segment-grid small {
  color: var(--foreground-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.35;
}

.intake-state {
  margin: 0;
  color: var(--foreground-secondary);
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.4;
}

.group-error {
  color: #b42318;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.35;
}

@media (max-width: 560px) {
  .segment-grid {
    grid-template-columns: 1fr;
  }
}
</style>
