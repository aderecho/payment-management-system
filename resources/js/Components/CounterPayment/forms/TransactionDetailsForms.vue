<script setup>
import { computed, watch } from 'vue';
// Import child components
import DropdownField from './DropdownField.vue';
import InputField from './InputField.vue';
import PurposeField from './PurposeField.vue';
import LibraryFeeFields from './LibraryFeeFields.vue';
import PaymentReferenceField from './PaymentReferenceField.vue';
import FacilitiesField from './FacilitiesField.vue';


const props = defineProps({
  // modelValue contains the entire form data object
  modelValue: Object,
  validationErrors: Object, 
});

const emit = defineEmits(['update:modelValue']);

// Data model synchronization (v-model)
const data = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

// --- Constants (Keep in Main Component as Business Logic) ---
const TRANSACTION_KEY = {
  ENROLLMENT: 'University Enrollment Related',
  LIBRARY: 'University Library-Fees & Fines',
  FACILITIES: 'UP Cebu Facilities, Other Equipment and Vehicle Registration',
};

const PURPOSE_KEY = {
  OVERDUE_LOST: ['Overdue Books', 'Lost Books'],
  INTERNET: 'Internet Fee',
  NON_UP: 'Non-UP (Private)',
  PHOTOCOPY_ETC: ['Photocopy', 'Printing', 'Scanning'],
};

// --- Static Options/Arrays ---
const transactionTypes = [
  TRANSACTION_KEY.ENROLLMENT,
  TRANSACTION_KEY.LIBRARY,
  TRANSACTION_KEY.FACILITIES,
];
const paymentMethods = ['Cash', 'Gcash', 'Maya', 'Bank Transfer'];
const enrollmentOptions = ['Tuition Fee', 'Residency', 'Leave of Absence (LOA)'];
const libraryOptions = [
  ...PURPOSE_KEY.OVERDUE_LOST,
  PURPOSE_KEY.INTERNET,
  'Alumni and Researchers Fee',
  PURPOSE_KEY.NON_UP,
  ...PURPOSE_KEY.PHOTOCOPY_ETC,
];

const purposeOptions = computed(() => {
  if (data.value.transactionType === TRANSACTION_KEY.ENROLLMENT)
    return enrollmentOptions;
  if (data.value.transactionType === TRANSACTION_KEY.LIBRARY)
    return libraryOptions;
  return [];
});
const isPurposeDropdown = computed(() => purposeOptions.value.length > 0);

const purposeLabel = computed(() => {
  const type = data.value.transactionType;
  if (type === TRANSACTION_KEY.LIBRARY) {
    return 'Choose Library Fees and Fines';
  } else if (type === TRANSACTION_KEY.FACILITIES) {
    return 'Name of the Activity';
  }
  return 'Purpose';
});

// Grouped logic for Library Fees (relies on purpose)
const libraryFeeRequirements = computed(() => {
  const type = data.value.transactionType;
  const purpose = data.value.purpose;
  
  // Return empty object if not a Library Transaction
  if (type !== TRANSACTION_KEY.LIBRARY) return {};

  const isOverdueOrLost = PURPOSE_KEY.OVERDUE_LOST.includes(purpose);
  const isPhotocopyPrintingScanning = PURPOSE_KEY.PHOTOCOPY_ETC.includes(purpose);

  return {
    isOverdueOrLost,
    isInternetFee: purpose === PURPOSE_KEY.INTERNET,
    isNonUPPrivate: purpose === PURPOSE_KEY.NON_UP,
    isPhotocopyPrintingScanning,
    
    // UI Label logic
    isAmountLabelTotalFine: isOverdueOrLost,
  };
});

// Grouped logic for general form requirements
const formRequirements = computed(() => {
  const paymentMethod = data.value.paymentMethod;
  
  return {
    // Shows Facilities Reference Number field
    isFacilities: data.value.transactionType === TRANSACTION_KEY.FACILITIES,
    
    // Determines if Payment Reference Number field is shown/required
    isReferenceNumberRequired: !paymentMethod || paymentMethod !== "Cash",
  };
});

// Dynamic label for the main Amount field
const amountLabel = computed(() => {
  if (libraryFeeRequirements.value.isAmountLabelTotalFine) {
    return 'Amount (Total Fine)';
  }
  return 'Amount';
});


// --- Watchers (Keep in Main Component to control state resets) ---

// Watcher to reset dependent fields when Transaction Type changes
watch(
  () => data.value.transactionType,
  () => {
    data.value.purpose = '';
    data.value.facilitiesReferenceNumber = '';
    // Reset all library-specific fields
    data.value.accessionNumber = '';
    data.value.numberOfHours = '';
    data.value.numberOfDays = '';
    data.value.numberOfPages = '';
  }
);

// Watcher to reset payment reference when Payment Method changes to Cash
watch(
  () => data.value.paymentMethod,
  (newMethod) => {
    if (newMethod === 'Cash') {
      data.value.paymentReferenceNumber = '';
    }
  }
);

// Watcher to reset library fields when Library Purpose changes
watch(
  () => data.value.purpose,
  (newPurpose, oldPurpose) => {
    if (data.value.transactionType === TRANSACTION_KEY.LIBRARY && newPurpose !== oldPurpose) {
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
      
      <DropdownField
        class="md:col-span-2"
        label="Transaction Type"
        v-model="data.transactionType"
        :options="transactionTypes"
        :validation-error="validationErrors.transactionType"
      />

      <DropdownField
        label="Payment Method"
        v-model="data.paymentMethod"
        :options="paymentMethods"
        :validation-error="validationErrors.paymentMethod"
      />

      <PurposeField
        v-model="data.purpose"
        :label="purposeLabel"
        :is-dropdown="isPurposeDropdown"
        :options="purposeOptions"
        :validation-error="validationErrors.purpose"
      />

      <LibraryFeeFields
        v-model:accession-number="data.accessionNumber"
        v-model:number-of-hours="data.numberOfHours"
        v-model:number-of-days="data.numberOfDays"
        v-model:number-of-pages="data.numberOfPages"
        :requirements="libraryFeeRequirements"
        :validation-errors="validationErrors"
      />
      
      <FacilitiesField
        v-if="formRequirements.isFacilities"
        class="md:col-span-2"
        v-model="data.facilitiesReferenceNumber"
        :validation-error="validationErrors.facilitiesReferenceNumber"
      />

      <InputField
        :class="{
          'md:col-span-1': formRequirements.isReferenceNumberRequired,
          'md:col-span-2': !formRequirements.isReferenceNumberRequired,
        }"
        type="number"
        :label="amountLabel"
        v-model="data.amount"
        :validation-error="validationErrors.amount"
      />

      <PaymentReferenceField
        v-if="formRequirements.isReferenceNumberRequired"
        v-model="data.paymentReferenceNumber"
        :validation-error="validationErrors.paymentReferenceNumber"
      />

    </div>
  </div>
</template>

