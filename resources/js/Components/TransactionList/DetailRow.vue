<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    default: 'N/A',
  },
  isAmount: {
    type: Boolean,
    default: false,
  },
  isAlternating: {
    type: Boolean,
    default: false,
  },
});

const formattedValue = computed(() => {
    // Check for null/undefined/empty string first, returning 'N/A' if needed
    if (props.value === null || props.value === undefined || props.value === '') {
        return 'N/A';
    }

    // Custom formatting logic for Boolean values (like isNameOnOR)
    if (typeof props.value === 'boolean') {
        return props.value ? 'Yes' : 'No';
    }
    
    // Custom formatting for amount
    if (props.isAmount) {
        // Ensure the value is treated as a number for toFixed
        const numericValue = parseFloat(props.value);
        if (isNaN(numericValue)) return '₱0.00';
        // Use toLocaleString for proper thousand separators (assuming 'en-US' locale)
        return `₱${numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    // Default return for standard strings/numbers
    return props.value;
});
</script>

<template>
  <div class="flex justify-between p-1" :class="{'even:bg-gray-100 even:rounded': isAlternating}">
    <span class="font-medium text-gray-600">{{ label }}:</span>
    <span :class="{'font-bold text-[#6a0d1b]': isAmount}">
      {{ formattedValue }}
    </span>
  </div>
</template>