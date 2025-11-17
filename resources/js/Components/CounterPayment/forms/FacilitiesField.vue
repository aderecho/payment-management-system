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
    label="Facilities Reference Number"
    type="text"
    placeholder="From Approved Reservation Form"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :validation-error="validationError"
  />
</template>