<script setup>
import { computed } from 'vue'

const props = defineProps({
  formData: Object,
})

const paymentImages = {
  Gcash: '/images/gcashqr.png',
  Maya: '/images/mayaqr.png',
  'Bank Transfer': '/images/bankqr.png',
}

const paymentDisplay = computed(() => {
  if (props.formData.paymentMethod === 'Cash') return null
  return paymentImages[props.formData.paymentMethod] || null
})
</script>

<template>
  <!-- ✅ Fully responsive container -->
  <div
    class="bg-white flex flex-col items-center justify-center  
           border border-gray-200 rounded-xl shadow-lg 
           w-full h-auto min-h-25
           p-6 sm:p-8 md:p-10 
           transition-all duration-300 
            top-1 "
  >
    <!-- Title -->
    <!-- <h2
      class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center leading-tight"
    >
      {{ formData.paymentMethod === 'Cash'
        ? 'Cash Payment Instructions'
        : `Scan QR Code: ${formData.paymentMethod}` }}
    </h2> -->

    <!-- QR or Instructions -->
    <div
      v-if="paymentDisplay"
      class="flex flex-col items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
    >
      <img
        :src="paymentDisplay"
        class="rounded-lg w-full object-contain shadow-md transition-transform duration-300 hover:scale-105"
        alt="QR Code"
      />
      <p class="text-sm sm:text-base text-gray-600 mt-3 text-center">
        <span class="font-semibold text-gray-800">For {{ formData.paymentMethod }}:</span> Please scan this code to proceed with your payment.
      </p>
    </div>

    <!-- Cash payment message -->
    <p
      v-else-if="formData.paymentMethod === 'Cash'"
      class="text-gray-600 text-center text-sm sm:text-base md:text-lg mt-4"
    >
     <span class="text-gray-800 font-semibold">Cash Payment</span><br> Payment will be processed by the counter personnel.
    </p>
  </div>
</template>

<style scoped>
/* Make sure images resize correctly */
img {
  max-width: 100%;
  height: auto;
}

/* Smooth scaling when zooming or resizing */
@media (max-width: 768px) {
  div {
    padding: 1rem !important;
  }
}

@media (min-width: 1024px) {
  div {
    transition: all 0.3s ease-in-out;
  }
}
</style>
