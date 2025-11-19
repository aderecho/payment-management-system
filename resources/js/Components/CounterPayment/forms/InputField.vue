<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: {
    type: String,
    default: 'Enter Amount',
  },
  type: {
    type: String,
    default: 'text',
  },
  validationError: String,
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <div class="relative">
    <label class="block text-sm font-bold text-gray-700 mb-1">
      {{ label }} <span class="text-red-500">*</span>
    </label>
    <input
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :class="[
        validationError ? 'border-red-500' : 'border-gray-300',
        'focus:border-red-900 focus:ring-1 focus:ring-red-900'
      ]"
      class="p-2 border rounded-lg w-full transition-colors"
    />
    <p v-if="validationError" class="text-xs text-red-500 mt-1">
      {{ validationError }}
    </p>
  </div>
</template>
<style scoped>
/* Retain original scoped styles for inputs */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>