<script setup>
import { computed } from 'vue';

const props = defineProps({
  formData: Object,
});

const paymentImages = {
  'Gcash': 'https://via.placeholder.com/300x300?text=Gcash+QR+Code',
  'Maya': 'https://via.placeholder.com/300x300?text=Maya+QR+Code',
  'Bank Transfer': 'https://via.placeholder.com/300x300?text=Bank+Transfer+Details',
};

const paymentDisplay = computed(() => {
  if (props.formData.paymentMethod === 'Cash') return null;
  return paymentImages[props.formData.paymentMethod] || null;
});
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-lg flex flex-col items-center justify-center border border-gray-100 h-screen w-full sticky top-0">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
      {{ formData.paymentMethod === 'Cash' ? 'Cash Payment Instructions' : `Scan QR Code: ${formData.paymentMethod}` }}
    </h2>

    <div v-if="paymentDisplay" class="w-full max-w-xs">
      <img :src="paymentDisplay" class="rounded-lg w-full object-contain" />
    </div>
    <p v-else-if="formData.paymentMethod === 'Cash'" class="text-gray-600 text-center">
      Payment will be processed by the counter personnel.
    </p>
  </div>
</template>
