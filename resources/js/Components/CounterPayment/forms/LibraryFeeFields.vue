<script setup>
import InputField from './InputField.vue';

const props = defineProps({
  // Library specific model values
  accessionNumber: [String, Number],
  numberOfHours: [String, Number],
  numberOfDays: [String, Number],
  numberOfPages: [String, Number],
  
  // Logic object passed from parent
  requirements: {
    type: Object,
    required: true,
  },
  // Validation errors object passed from parent
  validationErrors: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'update:accessionNumber',
  'update:numberOfHours',
  'update:numberOfDays',
  'update:numberOfPages',
]);
</script>

<template>
  <InputField
    v-if="requirements.isOverdueOrLost"
    label="Accession Number"
    type="text"
    placeholder="Enter Accession Number"
    :model-value="accessionNumber"
    @update:model-value="emit('update:accessionNumber', $event)"
    :validation-error="validationErrors.accessionNumber"
  />
  <div v-if="requirements.isOverdueOrLost">
    </div>

  <InputField
    v-else-if="requirements.isInternetFee"
    label="Number of Hours"
    type="number"
    placeholder="Enter Number of Hours"
    :model-value="numberOfHours"
    @update:model-value="emit('update:numberOfHours', $event)"
    :validation-error="validationErrors.numberOfHours"
  />

  <InputField
    v-else-if="requirements.isNonUPPrivate"
    label="Number of Days"
    type="number"
    placeholder="Enter Number of Days"
    :model-value="numberOfDays"
    @update:model-value="emit('update:numberOfDays', $event)"
    :validation-error="validationErrors.numberOfDays"
  />

  <InputField
    v-else-if="requirements.isPhotocopyPrintingScanning"
    label="Number of Pages"
    type="number"
    placeholder="Enter Number of Pages"
    :model-value="numberOfPages"
    @update:model-value="emit('update:numberOfPages', $event)"
    :validation-error="validationErrors.numberOfPages"
  />
</template>