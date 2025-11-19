<script setup>
import { defineProps, defineEmits, watch, onUnmounted, computed } from 'vue'
import DetailRow from '../DetailRow.vue' // Adjust the path as needed

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

// --- DATA MAPPING FOR TRANSACTION DETAILS ---
const transactionFields = computed(() => {
  const fields = [
    { label: 'Transaction Type', key: 'transactionType', alternating: true },
    { label: 'Payment Method', key: 'paymentMethod', alternating: true },
    { label: 'Purpose', key: 'purpose', alternating: true },
    { label: 'Facilities Ref. No.', key: 'facilitiesReferenceNumber', alternating: false },
    { label: 'Accession Number', key: 'accessionNumber', alternating: false },
    { label: 'No. of Hours', key: 'numberOfHours', alternating: false },
    { label: 'No. of Days', key: 'numberOfDays', alternating: false },
    { label: 'No. of Pages', key: 'numberOfPages', alternating: false },
    { label: 'Amount', key: 'amount', isAmount: true, alternating: false },
    { label: 'Reference No / Payment ID', key: 'paymentReferenceNumber', alternating: false },
    { label: 'Transaction Date', key: 'date', alternating: false },
    { label: 'Status', key: 'status', alternating: false },
    { label: 'Processed By', key: 'processedBy', alternating: false },
  ];

  return fields
    .filter(field => field.key === 'transactionType' || field.key === 'paymentMethod' || field.key === 'purpose' || props.details[field.key])
    .map(field => ({
        ...field,
        value: props.details[field.key],
    }));
});

const personalInfoFields = computed(() => {
    const fields = [
        { label: 'Campus ID', key: 'campusId' },
        { label: 'Name', key: 'name', alias: ['studentName'] }, // Use alias for fallback key
        { label: 'Email', key: 'email' },
        { label: 'Course', key: 'course' },
        { label: 'Year Level', key: 'yearLevel' },
        { label: 'School Year', key: 'schoolYear' },
        { label: 'Name on OR', key: 'isNameOnOR', isBoolean: true },
        { label: 'OR Name', key: 'orName' },
    ];
    
    return fields
        .filter(field => {
            // Check if the primary key exists or if it's a specific boolean value
            return props.details[field.key] !== undefined || (field.alias && props.details[field.alias[0]] !== undefined) || field.key === 'isNameOnOR';
        })
        .map(field => {
            let value = props.details[field.key];
            
            if (field.key === 'name' && !value && field.alias) {
                value = props.details[field.alias[0]];
            }
            
            if (field.isBoolean) {
                value = props.details[field.key] ? 'Yes' : 'No';
            }
            
            return {
                label: field.label,
                value: value,
                isAmount: field.isAmount || false,
            };
        });
});
</script>

<template>
  <div
    v-if="show"
    @click.self="emit('close')"
    class="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-2 sm:p-4 transition-all duration-300"
  >
    <div
      class="bg-white rounded-xl shadow-lg w-full max-w-3xl relative border border-[#6a0d1b]/20 overflow-hidden transform transition-all duration-300 scale-100"
    >
      <div class="p-3 sm:p-4 overflow-y-auto max-h-[80vh] relative">
        <button
          @click="emit('close')"
          class="absolute top-2 right-2 text-gray-400 hover:text-[#6a0d1b] rounded-full transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center mb-3 sm:mb-4">
          <h2 class="text-xl sm:text-2xl font-extrabold text-[#6a0d1b] tracking-tight">
            Transaction Details
          </h2>
          <div class="mt-1 h-1 bg-brand-maroon w-12 mx-auto rounded-full"></div>
          <p class="mt-1 text-[11px] text-gray-500">
            Review the transaction and personal information below
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-[11px] sm:text-xs text-gray-800">
          
          <div class="bg-gray-50 rounded-lg p-3 shadow-inner border border-[#6a0d1b]/10">
            <h3 class="text-sm font-semibold text-brand-maroon   border-b border-dashed border-[#6a0d1b]/30 pb-1 mb-2">
              Transaction Details
            </h3>

            <div class="space-y-1">
              <DetailRow
                v-for="field in transactionFields"
                :key="field.key"
                :label="field.label"
                :value="field.value"
                :is-amount="field.isAmount"
                :is-alternating="field.alternating"
              />
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-3 shadow-inner border border-[#6a0d1b]/10">
            <h3 class="text-sm font-semibold text-[#6a0d1b] border-b border-dashed border-[#6a0d1b]/30 pb-1 mb-2">
              Personal Information
            </h3>

            <div class="space-y-1">
              <DetailRow
                v-for="field in personalInfoFields"
                :key="field.label"
                :label="field.label"
                :value="field.value"
              />
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            @click="emit('close')"
            class="px-4 py-1.5 text-xs sm:text-sm font-semibold bg-[#6a0d1b] text-white rounded-md shadow-sm hover:bg-[#510a15] focus:ring-2 focus:ring-[#6a0d1b]/40 transition-all duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>