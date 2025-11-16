<script setup>
import { defineProps, defineEmits, computed, ref, watch, onUnmounted } from 'vue';
import ConfirmationModal from './ConfirmationModal.vue'; // Assuming ConfirmationModal is in the same directory

// NOTE: You will need to create and import a DetailRow.vue component for this to work
// If DetailRow.vue is not available, replace DetailRow component usage in the template
// with a simple key/value div structure like:
// <div class="flex justify-between even:bg-gray-100 even:rounded p-1"><span class="font-medium text-gray-600">{{ item.key }}:</span><span>{{ item.value || 'N/A' }}</span></div>

const props = defineProps({
  show: { type: Boolean, required: true },
  statusDetails: {
    type: Object,
    default: () => ({
      campusId: '',
      studentName: '',
      email: '',
      course: '',
      yearLevel: '',
      schoolYear: '',
      referenceCode: '',
      paymentMethod: '',
      transactionType: '',
      date: '',
      status: '',
      amount: 0,
    }),
  },
});

const emit = defineEmits(['close', 'update-status', 'confirm-update']);

// Status options & colors (using inline styles for DetailRow compatibility)
const statusOptions = ['Pending', 'Floating', 'Posted', 'Cancelled'];
const statusColors = {
  Pending: { bg: '#e5e7eb', text: '#374151' },
  Floating: { bg: '#fef9c3', text: '#854d0e' },
  Posted: { bg: '#bbf7d0', text: '#166534' },
  Cancelled: { bg: '#fecaca', text: '#7f1d1d' },
};

const editableStatus = ref(
  statusOptions.includes(props.statusDetails.status)
    ? props.statusDetails.status
    : 'Pending'
);

const dropdownOpen = ref(false);
const hasBeenUpdated = ref(false); 
const showWarning = ref(false);

// --- Confirmation Modal State ---
const showConfirmationModal = ref(false);

// Dropdown disabled if status is Posted or Cancelled in the details
const isDropdownDisabled = computed(
  () => props.statusDetails.status === 'Posted' || props.statusDetails.status === 'Cancelled'
);

watch(() => props.statusDetails.status, (newStatus) => {
  editableStatus.value = statusOptions.includes(newStatus) ? newStatus : 'Pending';
});

watch(editableStatus, (newStatus) => {
  if (newStatus !== props.statusDetails.status && statusOptions.includes(newStatus)) {
    // The previous implementation was emitting 'update-status' on status change, 
    // but the requirement is to confirm first. Removing this emit here.
    // emit('update-status', {
    //   referenceCode: props.statusDetails.referenceCode,
    //   newStatus,
    // });
    showWarning.value = newStatus === 'Posted';
  } else {
    showWarning.value = false;
  }
});

watch(() => props.show, (val) => {
  document.body.style.overflow = val ? 'hidden' : '';
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

// Format amount (kept simple for template display)
const formatAmount = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '₱0.00';
  return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// --- DATA MAPPING FOR TRANSACTION DETAILS (Similar to ViewDetailsModal) ---
const transactionFields = computed(() => {
    // Only include fields relevant for display/context in this smaller modal
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

// --- DATA MAPPING FOR PERSONAL INFORMATION (Similar to ViewDetailsModal) ---
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

// NEW: Show confirmation modal
const confirmUpdate = () => {
    showConfirmationModal.value = true;
};

// NEW: Handle final confirmation (Yes, Update)
const handleFinalUpdate = () => {
    showConfirmationModal.value = false;
    // Emit the event to the parent component/store to execute the actual update
    emit('confirm-update', { ...props.statusDetails, status: editableStatus.value });

    // Close the StatusUpdateModal only after confirmation
    emit('close'); 
};

// NEW: Handle cancellation (No, Cancel)
const handleCancelConfirmation = () => {
    // Hide the confirmation modal
    showConfirmationModal.value = false;
    // Keep the editableStatus as it was changed by the dropdown, but do NOT emit the update.
    // The requirement "the status must remain the same" refers to the *saved* status, 
    // which is accomplished by not emitting the update.
};

// Computed property for confirmation modal message
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
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
                  class="flex justify-between p-1"
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
                  // Added transition-all and increased duration for smoothness
                  'px-4 py-1.5 text-xs sm:text-sm font-semibold text-white rounded-md shadow-sm **transition-all duration-300 ease-in-out**',
                  statusDetails.status === editableStatus 
                      // Disabled state: Added opacity and cursor
                      ? 'bg-gray-400 **cursor-not-allowed opacity-70**' 
                      // Enabled state: Hover/focus effects with distinct color and shadow
                      : 'bg-[#6a0d1b] hover:bg-[#510a15] focus:ring-2 focus:ring-[#6a0d1b]/40 **hover:shadow-lg**'
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