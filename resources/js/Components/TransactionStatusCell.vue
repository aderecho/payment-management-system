<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

// Logic to determine the CSS classes based on the status
const statusClasses = computed(() => {
    switch (props.status) {
        case 'Posted':
            // Green badge
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800';
        case 'Floating':
            // Orange badge
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800';
        default:
            // Default/Gray badge
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
    }
});
</script>

<template>
  <td class="px-4 py-3 whitespace-nowrap">
    <span :class="statusClasses">
      {{ status }}
    </span>
  </td>
</template>
