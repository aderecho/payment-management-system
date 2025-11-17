<script setup>
import { defineProps, defineEmits, computed, ref, watch, onUnmounted } from 'vue';
import ConfirmationModal from './ConfirmationModal.vue'; 
import SVG from '@/Components/SVG.vue';
import { useTransactionStore } from '@/stores/transactionStore.js';

const store = useTransactionStore();

const props = defineProps({
  show: { type: Boolean, required: true },
  statusDetails: {
    type: Object,
    default: () => ({ }),
  },
});

const emit = defineEmits(['close', 'update-status', 'confirm-update']);

// Status options and corresponding colors for display
const statusOptions = ['Pending', 'Floating', 'Posted', 'Cancelled'];
const statusColors = {
  Pending: { bg: '#e5e7eb', text: '#374151' },
  Floating: { bg: '#fef9c3', text: '#854d0e' },
  Posted: { bg: '#bbf7d0', text: '#166534' },
  Cancelled: { bg: '#fecaca', text: '#7f1d1d' },
};

// Local state for status selection in the dropdown
const editableStatus = ref(
  statusOptions.includes(props.statusDetails.status)
    ? props.statusDetails.status
    : 'Pending'
);

const dropdownOpen = ref(false);
const hasBeenUpdated = ref(false); 
const showWarning = ref(false);
const showConfirmationModal = ref(false);

// editable for Pending/Floating, disabled for Posted/Cancelled.
const isDropdownDisabled = computed(
  () => props.statusDetails.status === 'Posted' || props.statusDetails.status === 'Cancelled'
);

// Syncs the local editable status when the prop changes
watch(() => props.statusDetails.status, (newStatus) => {
  editableStatus.value = statusOptions.includes(newStatus) ? newStatus : 'Pending';
}, { immediate: true });

watch(editableStatus, (newStatus) => {
  if (newStatus !== props.statusDetails.status && statusOptions.includes(newStatus)) {
    showWarning.value = newStatus === 'Posted';
  } else {
    showWarning.value = false;
  }
});

// Controls body scroll when modal is open
watch(() => props.show, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

// Formats amount with currency symbol
const formatAmount = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '₱0.00';
  return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Maps transaction data fields for display
const transactionFields = computed(() => {
    const fields = [
      { label: 'Reference Code', key: 'referenceCode', alternating: true },
      { label: 'Transaction Type', key: 'transactionType', alternating: true },
      { label: 'Payment Method', key: 'paymentMethod', alternating: true },
      { label: 'Transaction Date', key: 'date', alternating: false },
    ];
    
    return fields.map(field => ({
      ...field,
      value: props.statusDetails[field.key] || 'N/A',
    }));
});

const personalInfoFields = computed(() => {
    const fields = [
      { label: 'Campus ID', key: 'campusId' },
      { label: 'Name', key: 'studentName' },
      { label: 'Email', key: 'email' },
      { label: 'Course', key: 'course' },
      { label: 'Year Level', key: 'yearLevel' },
      { label: 'School Year', key: 'schoolYear' },
    ];
    
    return fields.map(field => ({
      label: field.label,
      value: props.statusDetails[field.key] || 'N/A',
    }));
});

const confirmUpdate = () => {
    showConfirmationModal.value = true;
};

const handleFinalUpdate = () => {
    showConfirmationModal.value = false;

    // Direct call to the Pinia action to update the status
    store.updateStatus(props.statusDetails.referenceCode, editableStatus.value);

    // Close the StatusUpdateModal only after the final confirmation is sent
    emit('close'); 
};

const handleCancelConfirmation = () => {
    showConfirmationModal.value = false;
};

// Computed property for confirmation modal message, including a warning for 'Posted'
const confirmationMessage = computed(() => {
    let base = `Are you sure you want to change the status of "${props.statusDetails.studentName}" from "${props.statusDetails.status}" to "${editableStatus.value}"?`;
    if (editableStatus.value === 'Posted') {
        base += '<br><br><strong class="text-red-600">⚠️ IMPORTANT: Once set to Posted, this status cannot be changed again.</strong>';
    }
    return base;
});
</script>

<template>
  <div>
    <div
      v-if="show"
      @click.self="emit('close')"
      class="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50 p-2 sm:p-4 transition-all duration-300"
    >
      <div
        class="bg-white rounded-xl shadow-lg w-full max-w-3xl relative border border-[#6a0d1b]/20 overflow-hidden transform transition-all duration-300 scale-100"
      >
        <div class="p-3 sm:p-4 overflow-y-auto h-full relative">
          <button
            @click="emit('close')"
            class="absolute top-2 right-2 text-gray-400 hover:text-[#6a0d1b] rounded-full transition-all duration-200"
          >
            <SVG icon-name="Close"></SVG>
          </button>

          <div class="text-center mb-3 sm:mb-4">
            <h2 class="text-xl sm:text-2xl font-extrabold text-[#6a0d1b] tracking-tight">
              Update Transaction Status
            </h2>
            <div class="mt-1 h-1 bg-[#6a0d1b] w-12 mx-auto rounded-full"></div>
            <p class="mt-1 text-[11px] text-gray-500">
              Review the details and set the new transaction status below.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-[11px] sm:text-xs text-gray-800">
            
            <div class="bg-gray-50 rounded-lg p-3 shadow-inner border border-[#6a0d1b]/10">
              <h3 class="text-sm font-semibold text-[#6a0d1b] border-b border-dashed border-[#6a0d1b]/30 pb-1 mb-2">
                Transaction & Status
              </h3>

              <div class="space-y-1">
                <div
                  v-for="field in transactionFields"
                  :key="field.key"
                  class="flex justify-between even:bg-gray-100 even:rounded p-1"
                >
                  <span class="font-medium text-gray-600">{{ field.label }}:</span>
                  <span>{{ field.value }}</span>
                </div>
                
                <div class="flex justify-between pt-2 border-t border-dashed border-gray-300">
                  <p class="font-bold text-gray-800">Amount:</p>
                  <p class="font-extrabold text-sm text-[#6a0d1b]">{{ formatAmount(statusDetails.amount) }}</p>
                </div>

                <div class="flex justify-between items-center pt-2 relative">
                  <p class="font-bold text-sm">Status Update:</p>
                  <div class="relative w-fit flex flex-col-reverse">
                    <button
                      @click="!isDropdownDisabled && (dropdownOpen = !dropdownOpen)"
                      @blur="() => { setTimeout(() => dropdownOpen = false, 150) }"
                      :disabled="isDropdownDisabled"
                      :class="[
                        'flex items-center px-3 py-1 text-xs font-semibold rounded-full border border-gray-300 shadow-sm focus:outline-none transition',
                        isDropdownDisabled ? 'opacity-60 cursor-not-allowed' : ''
                      ]"
                      :style="{
                        backgroundColor: statusColors[editableStatus]?.bg || '#e5e7eb',
                        color: statusColors[editableStatus]?.text || '#374151'
                      }"
                    >
                      {{ editableStatus }}
                      <svg v-if="!isDropdownDisabled" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 ml-1 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div 
                      v-if="dropdownOpen" 
                      class="absolute right-0 bottom-full z-50 mb-1 rounded-md border border-gray-300 shadow-lg overflow-hidden bg-white"
                      style="min-width: 100%;"
                    >
                      <div
                        v-for="option in statusOptions"
                        :key="option"
                        @mousedown.prevent="editableStatus = option; dropdownOpen = false"
                        :style="{ backgroundColor: statusColors[option]?.bg, color: statusColors[option]?.text }"
                        class="px-3 py-1 text-xs cursor-pointer font-semibold hover:opacity-90 text-center"
                      >
                        {{ option }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p v-if="showWarning" class="text-[10px] text-red-600 pt-1 text-right ">
                  ⚠️ Once <strong>Posted</strong> is confirmed, status cannot be changed.
                </p>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-3 shadow-inner border border-[#6a0d1b]/10">
              <h3 class="text-sm font-semibold text-[#6a0d1b] border-b border-dashed border-[#6a0d1b]/30 pb-1 mb-2">
                Personal Information
              </h3>

              <div class="space-y-1">
                <div
                  v-for="field in personalInfoFields"
                  :key="field.label"
                  class="flex justify-between p-1 even:bg-gray-100 even:rounded"
                >
                  <span class="font-medium text-gray-600">{{ field.label }}:</span>
                  <span>{{ field.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button
              @click="confirmUpdate"
              :disabled="statusDetails.status === editableStatus"
              :class="[
                'px-4 py-1.5 text-xs sm:text-sm font-semibold text-white rounded-md shadow-sm transition-all duration-300 ease-in-out',
                statusDetails.status === editableStatus 
                    ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                    : 'bg-[#6a0d1b] hover:bg-[#510a15] focus:ring-2 focus:ring-[#6a0d1b]/40 hover:shadow-lg'
              ]"
            >
              Confirm Status Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <ConfirmationModal
        :show="showConfirmationModal"
        :title="editableStatus === 'Posted' ? 'Final Status Confirmation' : 'Confirm Status Change'"
        :message="confirmationMessage"
        confirm-text="Yes, Update"
        cancel-text="No, Cancel"
        @confirm="handleFinalUpdate"
        @cancel="handleCancelConfirmation"
    />
  </div>
</template>