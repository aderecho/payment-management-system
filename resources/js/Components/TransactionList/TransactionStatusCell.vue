<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  status: {
    default: 'Pending',
    type: String,

    
  }
});

// Logic to determine the CSS classes based on the status
const statusClasses = computed(() => {
    switch (props.status) {
        case 'Posted':
            // Green badge
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-200 text-green-800';
        case 'Floating':
            // Orange badge
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800';
        case 'Cancelled':
            // Red  badge
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-200 text-red-800';
        
         default:
            // Default/Gray badge
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800';
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
