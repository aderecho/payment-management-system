<script setup>
import InputField from './InputField.vue';

const props = defineProps({
  modelValue: [String, Number],
  validationError: String,
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <InputField
    label="Reference Number / Payment ID"
    type="text"
    placeholder="Transaction ID / Reference Number"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :validation-error="validationError"
  />
</template>