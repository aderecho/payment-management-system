<script setup>
import { computed, watch } from 'vue';

const props = defineProps({
  modelValue: Object,
  validationErrors: Object, // receives validation errors from parent
});

const emit = defineEmits(['update:modelValue']);

const transactionTypes = [
  'University Enrollment Related',
  'University Library-Fees & Fines',
  'UP Cebu Facilities, Other Equipment and Vehicle Registration',
];
const paymentMethods = ['Cash', 'Gcash', 'Maya', 'Bank Transfer'];
const enrollmentOptions = ['Tuition Fee', 'Residency', 'Leave of Absence (LOA)'];
const libraryOptions = [
  'Overdue Books',
  'Lost Books',
  'Internet Fee',
  'Alumni and Researchers Fee',
  'Non-UP (Private)',
  'Photocopy',
  'Printing',
  'Scanning',
];

const data = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

// Label for Purpose
const purposeLabel = computed(() => {
  if (data.value.transactionType === 'University Library-Fees & Fines') {
    return 'Choose Library Fees and Fines';
  } else if (
    data.value.transactionType ===
    'UP Cebu Facilities, Other Equipment and Vehicle Registration'
  ) {
    return 'Name of the Activity';
  }
  return 'Purpose';
});

// Conditional field logic
const fieldRequirements = computed(() => ({
  isFacilities:
    data.value.transactionType ===
    'UP Cebu Facilities, Other Equipment and Vehicle Registration',
  isNotCashPayment: data.value.paymentMethod !== 'Cash',
}));

// Purpose dropdown logic
const purposeOptions = computed(() => {
  if (data.value.transactionType === 'University Enrollment Related')
    return enrollmentOptions;
  if (data.value.transactionType === 'University Library-Fees & Fines')
    return libraryOptions;
  return [];
});
const isPurposeDropdown = computed(() => purposeOptions.value.length > 0);

// Reset fields on change
watch(
  () => data.value.transactionType,
  () => {
    data.value.purpose = '';
    data.value.facilitiesReferenceNumber = '';
  }
);

// Reset payment reference when Cash
watch(
  () => data.value.paymentMethod,
  (newMethod) => {
    if (newMethod === 'Cash') {
      data.value.paymentReferenceNumber = '';
    }
  }
);
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-lg">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Transaction Details
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <!-- Transaction Type -->
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Transaction Type <span class="text-red-500">*</span>
        </label>
        <select
          v-model="data.transactionType"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.transactionType ? 'border-red-500' : 'border-gray-300'"
        >
          <option disabled value="">Select</option>
          <option v-for="type in transactionTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
        <p v-if="validationErrors.transactionType" class="text-xs text-red-500 mt-1">
          {{ validationErrors.transactionType }}
        </p>
      </div>

      <!-- Payment Method -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Payment Method <span class="text-red-500">*</span>
        </label>
        <select
          v-model="data.paymentMethod"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'"
        >
          <option disabled value="">Select</option>
          <option v-for="method in paymentMethods" :key="method" :value="method">
            {{ method }}
          </option>
        </select>
        <p v-if="validationErrors.paymentMethod" class="text-xs text-red-500 mt-1">
          {{ validationErrors.paymentMethod }}
        </p>
      </div>

      <!-- Purpose -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          {{ purposeLabel }} <span class="text-red-500">*</span>
        </label>

        <select
          v-if="isPurposeDropdown"
          v-model="data.purpose"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.purpose ? 'border-red-500' : 'border-gray-300'"
        >
          <option disabled value="">Select</option>
          <option v-for="p in purposeOptions" :key="p" :value="p">{{ p }}</option>
        </select>

        <input
          v-else
          v-model="data.purpose"
          type="text"
          placeholder="Enter purpose"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.purpose ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.purpose" class="text-xs text-red-500 mt-1">
          {{ validationErrors.purpose }}
        </p>
      </div>

      <!-- Facilities Reference Number -->
      <div v-if="fieldRequirements.isFacilities" class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Facilities Reference Number <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.facilitiesReferenceNumber"
          type="text"
          placeholder="From Approved Reservation Form"
          class="p-2 border rounded-lg w-full"
          :class="
            validationErrors.facilitiesReferenceNumber
              ? 'border-red-500'
              : 'border-gray-300'
          "
        />
        <p
          v-if="validationErrors.facilitiesReferenceNumber"
          class="text-xs text-red-500 mt-1"
        >
          {{ validationErrors.facilitiesReferenceNumber }}
        </p>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Amount <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.amount"
          type="number"
          placeholder="Enter amount"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.amount ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.amount" class="text-xs text-red-500 mt-1">
          {{ validationErrors.amount }}
        </p>
      </div>

      <!-- Reference Number (for non-cash) -->
      <div v-if="fieldRequirements.isNotCashPayment">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Reference Number / Payment ID <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.paymentReferenceNumber"
          type="text"
          placeholder="Transaction ID / Reference Number"
          required
          class="p-2 border rounded-lg w-full"
          :class="
            validationErrors.paymentReferenceNumber
              ? 'border-red-500'
              : 'border-gray-300'
          "
        />
        <p
          v-if="validationErrors.paymentReferenceNumber"
          class="text-xs text-red-500 mt-1"
        >
          {{ validationErrors.paymentReferenceNumber }}
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
