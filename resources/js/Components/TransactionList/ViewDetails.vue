<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: Boolean,
  details: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-1"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative border border-[#6a0d1b]/30"
    >
      <!-- ❌ Close Button -->
      <button
        @click="emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-[#6a0d1b] transition-colors duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- 🧾 Header -->
      <div class="text-center mb-5">
        <h2 class="text-2xl font-extrabold text-[#6a0d1b] tracking-tight">
          Transaction Details
        </h2>
        <div class="mt-1 h-0.5 bg-[#6a0d1b] w-16 mx-auto rounded-full"></div>
      </div>

      <!-- 📋 Transaction Information -->
      <div class="space-y-2 text-sm text-gray-800">
        <h3 class="font-bold text-[#6a0d1b] border-b border-dashed border-[#6a0d1b]/40 pb-1 mb-2">
          Transaction Details
        </h3>

        <div class="flex justify-between">
          <span class="font-semibold">Transaction Type:</span>
          <span>{{ details.transactionType || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Payment Method:</span>
          <span>{{ details.paymentMethod || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Purpose:</span>
          <span>{{ details.purpose || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Facilities Ref No.:</span>
          <span>{{ details.facilitiesRefNo || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Amount:</span>
          <span class="font-bold text-[#6a0d1b]">₱{{ details.amount || '0.00' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Reference No / Payment ID:</span>
          <span>{{ details.referenceCode || 'N/A' }}</span>
        </div>
      </div>

      <!-- 👤 Personal Information -->
      <div class="mt-4 pt-3 border-t border-dashed border-[#6a0d1b]/30 space-y-2 text-sm text-gray-800">
        <h3 class="font-bold text-[#6a0d1b] border-b border-dashed border-[#6a0d1b]/40 pb-1 mb-2">
          Personal Information
        </h3>

        <div class="flex justify-between">
          <span class="font-semibold">Campus ID:</span>
          <span>{{ details.campusId || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Name:</span>
          <span>{{ details.studentName || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Email:</span>
          <span>{{ details.email || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Course:</span>
          <span>{{ details.course || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Year Level:</span>
          <span>{{ details.yearLevel || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">School Year:</span>
          <span>{{ details.schoolYear || 'N/A' }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">OR Name:</span>
          <span>{{ details.ORName || 'N/A' }}</span>
        </div>
      </div>

      <!-- ✅ Footer -->
      <div class="mt-6 flex justify-end">
        <button
          @click="emit('close')"
          class="px-4 py-1.5 text-sm font-semibold bg-[#6a0d1b] text-white rounded-md shadow-sm hover:bg-[#510a15] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
