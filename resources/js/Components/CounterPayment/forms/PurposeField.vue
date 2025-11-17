<script setup>
import { computed } from 'vue';
import DropdownField from './DropdownField.vue'; 

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  isDropdown: Boolean,
  options: Array,
  validationError: String,
});

const emit = defineEmits(['update:modelValue']);

const purposeValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <div>
    <DropdownField
      v-if="isDropdown"
      :label="label"
      v-model="purposeValue"
      :options="options"
      :validation-error="validationError"
    />

    <div v-else class="relative">
      <label class="block text-sm font-bold text-gray-700 mb-1">
        {{ label }} <span class="text-red-500">*</span>
      </label>
      <input
        v-model="purposeValue"
        type="text"
        placeholder="Enter purpose"
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
  </div>
</template>