<script setup>
import { defineProps } from 'vue';

defineProps({
  value: {
    // Accepts any data type, as it will be converted to a string in the template
    type: [String, Number, Boolean], 
    required: true
  }
});
</script>

<template>
  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
    {{ value }}
  </td>
</template>