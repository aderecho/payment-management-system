<script setup>
import { defineProps, defineEmits, watch, onUnmounted } from 'vue'

const props = defineProps({
  show: Boolean,
  details: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close'])

// Disable background scroll when modal is open
watch(
  () => props.show,
  (newVal) => {
    document.body.style.overflow = newVal ? 'hidden' : ''
  }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-4 transition-all duration-300"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-5xl relative border border-[#6a0d1b]/20 overflow-hidden transform transition-all duration-300 scale-100"
    >
      <div class="p-6 overflow-y-auto max-h-[88vh] relative">
        <button
          @click="emit('close')"
          class="absolute top-3 right-3 text-gray-400 hover:text-[#6a0d1b] focus:ring-2 focus:ring-[#6a0d1b]/30 focus:outline-none rounded-full transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center mb-6">
          <h2 class="text-2xl font-extrabold text-[#6a0d1b] tracking-tight">
            Transaction Details
          </h2>
          <div class="mt-2 h-1 bg-[#6a0d1b] w-16 mx-auto rounded-full"></div>
          <p class="mt-1 text-xs text-gray-500">
            Review the transaction and personal information below
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-gray-800">
          <div class="bg-gray-50 rounded-xl p-4 shadow-inner border border-[#6a0d1b]/10">
            <h3 class="text-base font-semibold text-[#6a0d1b] border-b border-dashed border-[#6a0d1b]/30 pb-2 mb-4">
              Transaction Details
            </h3>

            <div class="space-y-2">
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">Transaction Type:</span><span>{{ details.transactionType || 'N/A' }}</span></div>
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">Payment Method:</span><span>{{ details.paymentMethod || 'N/A' }}</span></div>
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">Purpose:</span><span>{{ details.purpose || 'N/A' }}</span></div>

              <div v-if="details.facilitiesReferenceNumber" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">Facilities Ref. No.:</span>
                <span>{{ details.facilitiesReferenceNumber }}</span>
              </div>
              <div v-if="details.accessionNumber" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">Accession Number:</span>
                <span>{{ details.accessionNumber }}</span>
              </div>
              <div v-if="details.numberOfHours" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">No. of Hours:</span>
                <span>{{ details.numberOfHours }}</span>
              </div>
              <div v-if="details.numberOfDays" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">No. of Days:</span>
                <span>{{ details.numberOfDays }}</span>
              </div>
              <div v-if="details.numberOfPages" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">No. of Pages:</span>
                <span>{{ details.numberOfPages }}</span>
              </div>

              <div class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">Amount:</span>
                <span class="font-bold text-[#6a0d1b]">₱{{ details.amount || '0.00' }}</span>
              </div>

              <div v-if="details.paymentReferenceNumber" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">Reference No / Payment ID:</span>
                <span>{{ details.paymentReferenceNumber }}</span>
              </div>

              <div v-if="details.date" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">Transaction Date:</span>
                <span>{{ details.date }}</span>
              </div>
              <div v-if="details.status" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">Status:</span>
                <span>{{ details.status }}</span>
              </div>
              <div v-if="details.processedBy" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">Processed By:</span>
                <span>{{ details.processedBy }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-4 shadow-inner border border-[#6a0d1b]/10">
            <h3 class="text-base font-semibold text-[#6a0d1b] border-b border-dashed border-[#6a0d1b]/30 pb-2 mb-4">
              Personal Information
            </h3>

            <div class="space-y-2">
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">Campus ID:</span><span>{{ details.campusId || 'N/A' }}</span></div>
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">Name:</span><span>{{ details.studentName || details.name || 'N/A' }}</span></div>
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">Email:</span><span>{{ details.email || 'N/A' }}</span></div>
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">Course:</span><span>{{ details.course || 'N/A' }}</span></div>
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">Year Level:</span><span>{{ details.yearLevel || 'N/A' }}</span></div>
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">School Year:</span><span>{{ details.schoolYear || 'N/A' }}</span></div>
              
              <div class="flex justify-between even:bg-gray-100 even:rounded p-1" v-if="details.isNameOnOR !== undefined">
                <span class="font-medium text-gray-600">Name on OR:</span>
                <span>{{ details.isNameOnOR ? 'Yes' : 'No' }}</span>
              </div>
              <div v-if="details.orName" class="flex justify-between even:bg-gray-100 even:rounded p-1">
                <span class="font-medium text-gray-600">OR Name:</span>
                <span>{{ details.orName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button
            @click="emit('close')"
            class="px-5 py-2 text-xs sm:text-sm font-semibold bg-[#6a0d1b] text-white rounded-lg shadow-sm hover:bg-[#510a15] focus:ring-2 focus:ring-[#6a0d1b]/40 transition-all duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
