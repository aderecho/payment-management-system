<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue';

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

const editableStatus = ref(props.statusDetails.status);
const statusOptions = ['Pending', 'Floating', 'Posted', 'Cancelled'];
const dropdownOpen = ref(false);
const warningMessage = ref('');
const isPosted = computed(() => editableStatus.value === 'Posted'); // ✅ Reactive computed

watch(
  () => props.statusDetails.status,
  (newStatus) => {
    editableStatus.value = newStatus;
  }
);

watch(editableStatus, (newStatus) => {
  if (newStatus !== props.statusDetails.status) {
    emit('update-status', {
      referenceCode: props.statusDetails.referenceCode,
      newStatus,
    });
  }
});

const formatAmount = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '₱0.00';
  return `₱${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const detailItems = computed(() => [
  { key: 'Campus ID', value: props.statusDetails.campusId },
  { key: 'Name', value: props.statusDetails.studentName },
  { key: 'Email', value: props.statusDetails.email },
  { key: 'Course', value: props.statusDetails.course || 'N/A' },
  { key: 'Year Level', value: props.statusDetails.yearLevel },
  { key: 'School Year', value: props.statusDetails.schoolYear },
  { key: 'Reference Code', value: props.statusDetails.referenceCode },
  { key: 'Payment Method', value: props.statusDetails.paymentMethod },
  { key: 'Transaction Type', value: props.statusDetails.transactionType },
  { key: 'Date', value: props.statusDetails.date },
]);

const statusColors = {
  Pending: { bg: '#e5e7eb', text: '#374151' },
  Floating: { bg: '#fef9c3', text: '#854d0e' },
  Posted: { bg: '#bbf7d0', text: '#166534' },
  Cancelled: { bg: '#fecaca', text: '#7f1d1d' },
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-2 bg-gray-900 bg-opacity-60 transition-all duration-200"
  >
    <div
      class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 border border-gray-200 transform transition-all duration-300"
    >
      <!-- ❌ Close Button -->
      <button
        @click="emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-[#6a0d1b] transition-colors duration-150"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- 🧾 Header -->
      <div class="text-center mb-4">
        <h2 class="text-2xl font-extrabold text-[#6a0d1b]">Update Status</h2>
      </div>

      <!-- 📋 Details -->
      <div class="space-y-3 text-sm text-gray-700">
        <div
          v-for="item in detailItems"
          :key="item.key"
          class="flex justify-between border-b border-dashed border-gray-200 pb-1"
        >
          <p class="font-bold">{{ item.key }}:</p>
          <p class="text-right ml-2">{{ item.value || '-' }}</p>
        </div>

        <!-- 🟡 Custom Status Dropdown -->
        <div class="flex justify-between items-center pt-2 relative">
          <p class="font-bold">Status:</p>

          <!-- Trigger Button -->
          <div class="relative w-fit">
            <button
              @click="!isPosted && (dropdownOpen = !dropdownOpen)"
              :disabled="isPosted"
              :class="[
                'flex justify-between items-center px-3 py-1 text-xs font-semibold rounded-full border border-gray-300 shadow-sm focus:outline-none transition',
                isPosted ? 'opacity-60 cursor-not-allowed' : '',
              ]"
              :style="{
                backgroundColor: statusColors[editableStatus]?.bg,
                color: statusColors[editableStatus]?.text,
              }"
            >
              {{ editableStatus }}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3 h-3 ml-1 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="dropdownOpen"
              class="absolute right-0 z-50 mt-1 rounded-md border border-gray-300 shadow-lg overflow-hidden"
            >
              <div
                v-for="option in statusOptions"
                :key="option"
                @click="
                  if (isPosted) {
                    warningMessage = '⚠️ Once status is Posted, it can’t be changed.';
                    dropdownOpen = false;
                  } else {
                    editableStatus = option;
                    dropdownOpen = false;
                    warningMessage = '';
                  }
                "
                :style="{
                  backgroundColor: statusColors[option]?.bg,
                  color: statusColors[option]?.text,
                }"
                class="px-3 py-1 text-xs cursor-pointer font-semibold hover:opacity-90"
              >
                {{ option }}
              </div>
            </div>
          </div>
        </div>

        <!-- ⚠️ Warning Message -->
        <p v-if="isPosted" class="text-xs text-red-600 mt-1 text-right">
          ⚠️ Once status is <strong>Posted</strong>, it can’t be changed.
        </p>

        <!-- Amount -->
        <div class="flex justify-between pt-3 border-t border-dashed border-gray-200">
          <p class="font-bold text-gray-800">Amount:</p>
          <p class="font-bold text-lg text-[#6a0d1b]">{{ formatAmount(statusDetails.amount) }}</p>
        </div>
      </div>

      <!-- ✅ Footer -->
      <div class="mt-6 flex justify-end">
        <button
          @click="$emit('confirm-update', statusDetails)"
          class="bg-[#6a0d1b] hover:bg-[#510a15] text-white text-sm font-semibold py-1.5 px-4 rounded-md shadow-sm transition duration-150"
        >
          Update
        </button>
      </div>
    </div>
  </div>
</template>
