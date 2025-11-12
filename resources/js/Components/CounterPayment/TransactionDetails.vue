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
  isLibraryFee: data.value.transactionType === 'University Library-Fees & Fines',
  isLibraryAmountHidden:
    data.value.transactionType === 'University Library-Fees & Fines',
}));

// Conditional field logic for Library Fees & Fines
const libraryFeeRequirements = computed(() => {
  if (data.value.transactionType !== 'University Library-Fees & Fines') {
    return {};
  }
  const purpose = data.value.purpose;
  return {
    isOverdueOrLost: purpose === 'Overdue Books' || purpose === 'Lost Books',
    isInternetFee: purpose === 'Internet Fee',
    isAlumniResearchersFee: purpose === 'Alumni and Researchers Fee',
    isNonUPPrivate: purpose === 'Non-UP (Private)',
    isPhotocopyPrintingScanning:
      purpose === 'Photocopy' || purpose === 'Printing' || purpose === 'Scanning',
    // Conditional Label for Amount field
    isAmountLabelTotalFine: purpose === 'Overdue Books' || purpose === 'Lost Books',
  };
});

// Dynamic label for the main Amount field
const amountLabel = computed(() => {
  if (libraryFeeRequirements.value.isAmountLabelTotalFine) {
    return 'Amount (Total Fine)';
  }
  return 'Amount';
});


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
    // Reset Library-specific fields
    data.value.accessionNumber = '';
    data.value.numberOfHours = '';
    data.value.numberOfDays = '';
    data.value.numberOfPages = '';
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

// Reset additional fields on purpose change (only for library fees)
watch(
  () => data.value.purpose,
  (newPurpose, oldPurpose) => {
    if (data.value.transactionType === 'University Library-Fees & Fines' && newPurpose !== oldPurpose) {
      // Reset all library specific fields when purpose changes
      data.value.accessionNumber = '';
      data.value.numberOfHours = '';
      data.value.numberOfDays = '';
      data.value.numberOfPages = '';
    }
  }
);
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-lg w-full">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Transaction Details
    </h2>


    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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

      <div v-if="libraryFeeRequirements.isOverdueOrLost">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Accession Number <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.accessionNumber"
          type="text"
          placeholder="Enter Accession Number"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.accessionNumber ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.accessionNumber" class="text-xs text-red-500 mt-1">
          {{ validationErrors.accessionNumber }}
        </p>
      </div>
      <div v-if="libraryFeeRequirements.isOverdueOrLost">
        </div>

      <div v-else-if="libraryFeeRequirements.isInternetFee">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Number of Hours <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.numberOfHours"
          type="number"
          placeholder="Enter Number of Hours"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.numberOfHours ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.numberOfHours" class="text-xs text-red-500 mt-1">
          {{ validationErrors.numberOfHours }}
        </p>
      </div>

      <div v-else-if="libraryFeeRequirements.isNonUPPrivate">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Number of Days <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.numberOfDays"
          type="number"
          placeholder="Enter Number of Days"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.numberOfDays ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.numberOfDays" class="text-xs text-red-500 mt-1">
          {{ validationErrors.numberOfDays }}
        </p>
      </div>
      
      <div v-else-if="libraryFeeRequirements.isPhotocopyPrintingScanning">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Number of Pages <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.numberOfPages"
          type="number"
          placeholder="Enter Number of Pages"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.numberOfPages ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.numberOfPages" class="text-xs text-red-500 mt-1">
          {{ validationErrors.numberOfPages }}
        </p>
      </div>
      
      <div 
        v-if="libraryFeeRequirements.isAlumniResearchersFee"
        :class="{
          'md:col-span-2': !fieldRequirements.isNotCashPayment, // Span 2 if Cash
          'md:col-span-2': fieldRequirements.isNotCashPayment // Span 1 if not Cash (to make space for Reference ID)
        }"
      >
        <label class="block text-sm font-bold text-gray-700 mb-1">
          {{ amountLabel }} <span class="text-red-500">*</span>
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

      <div 
        v-if="libraryFeeRequirements.isAlumniResearchersFee && fieldRequirements.isNotCashPayment"
      >
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

      <div v-if="!libraryFeeRequirements.isAlumniResearchersFee">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          {{ amountLabel }} <span class="text-red-500">*</span>
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

      <div v-if="fieldRequirements.isNotCashPayment && !libraryFeeRequirements.isAlumniResearchersFee">
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

