<script setup>
import { computed, watch } from 'vue';
import SVG from '../SVG.vue'; 
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const props = defineProps({
  modelValue: Object,
  validationErrors: Object, 
});

const emit = defineEmits(['update:modelValue']);

const data = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const TRANSACTION_KEY = {
  ENROLLMENT: 'University Enrollment Related',
  LIBRARY: 'University Library-Fees & Fines',
  FACILITIES: 'UP Cebu Facilities, Other Equipment and Vehicle Registration',
};

// Constants for specific purpose keys
const PURPOSE_KEY = {
  OVERDUE_LOST: ['Overdue Books', 'Lost Books'],
  INTERNET: 'Internet Fee',
  NON_UP: 'Non-UP (Private)',
  PHOTOCOPY_ETC: ['Photocopy', 'Printing', 'Scanning'],
};

// Static Options/Arrays
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

// Purpose dropdown options (derived from transactionType)
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
    
    isAmountLabelTotalFine: isOverdueOrLost,
  };
});

// Grouped logic for general form requirements
const formRequirements = computed(() => {
  const paymentMethod = data.value.paymentMethod;
  
  return {
    // Shows Facilities Reference Number field
    isFacilities: data.value.transactionType === TRANSACTION_KEY.FACILITIES,
    isReferenceNumberRequired: !paymentMethod || paymentMethod !== "Cash",
  };
});

const amountLabel = computed(() => {
  if (libraryFeeRequirements.value.isAmountLabelTotalFine) {
    return 'Amount (Total Fine)';
  }
  return 'Amount';
});

// Headless UI Display Helpers
const selectedTransactionTypeDisplay = computed(() => {
    return data.value.transactionType || 'Select';
});

const selectedPaymentMethodDisplay = computed(() => {
    return data.value.paymentMethod || 'Select';
});

const selectedPurposeDisplay = computed(() => {
    return data.value.purpose || 'Select';
});


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
      <div class="md:col-span-2 relative">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Transaction Type <span class="text-red-500">*</span>
        </label>
        <Listbox v-model="data.transactionType" as="div" class="relative">
          <ListboxButton 
            class="border p-2 pr-6 rounded-lg w-full text-left relative truncate"
            :class="[
              validationErrors.transactionType ? 'border-red-500' : 'border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900',
              data.transactionType ? 'text-gray-800' : 'text-gray-400'
            ]"
          >
            {{ selectedTransactionTypeDisplay }}
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ">
              <SVG icon-name="DropdownMenuArrow"></SVG>
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-for="type in transactionTypes"
                :key="type"
                :value="type"
                as="template"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    active ? 'bg-[#6a0d1b] text-white' : 'text-gray-900',
                    'cursor-pointer select-none relative py-2 pl-3 pr-10'
                  ]"
                >
                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                    {{ type }}
                  </span>
                  <span v-if="selected" class=" absolute inset-y-0 right-0 flex items-center pr-3 text-[#6a0d1b]" :class="{ 'text-white': active }">
                    <SVG icon-name="Check"></SVG>
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>
        <p v-if="validationErrors.transactionType" class="text-xs text-red-500 mt-1">
          {{ validationErrors.transactionType }}
        </p>
      </div>


      <div class="relative">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Payment Method <span class="text-red-500">*</span>
        </label>
        <Listbox v-model="data.paymentMethod" as="div" class="relative">
          <ListboxButton 
            class="border p-2 pr-6 rounded-lg w-full text-left relative truncate"
            :class="[
              validationErrors.paymentMethod ? 'border-red-500' : 'border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900',
              data.paymentMethod ? 'text-gray-800' : 'text-gray-400'
            ]"
          >
            {{ selectedPaymentMethodDisplay }}
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ">
              <SVG icon-name="DropdownMenuArrow"></SVG>
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-for="method in paymentMethods"
                :key="method"
                :value="method"
                as="template"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    active ? 'bg-[#6a0d1b] text-white' : 'text-gray-900',
                    'cursor-pointer select-none relative py-2 pl-3 pr-10'
                  ]"
                >
                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                    {{ method }}
                  </span>
                  <span v-if="selected" class=" absolute inset-y-0 right-0 flex items-center pr-3 text-[#6a0d1b]" :class="{ 'text-white': active }">
                    <SVG icon-name="Check"></SVG>
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>
        <p v-if="validationErrors.paymentMethod" class="text-xs text-red-500 ">
          {{ validationErrors.paymentMethod }}
        </p>
      </div>


      <div class="relative">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          {{ purposeLabel }} <span class="text-red-500">*</span>
        </label>
        
        <Listbox
          v-if="isPurposeDropdown"
          v-model="data.purpose"
          as="div"
          class="relative"
        >
          <ListboxButton 
            class="border p-2 pr-6 rounded-lg w-full text-left relative truncate"
            :class="[
              validationErrors.purpose ? 'border-red-500' : 'border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900',
              data.purpose ? 'text-gray-800' : 'text-gray-400'
            ]"
          >
            {{ selectedPurposeDisplay }}
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ">
              <SVG icon-name="DropdownMenuArrow"></SVG>
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-for="p in purposeOptions"
                :key="p"
                :value="p"
                as="template"
                v-slot="{ active, selected }"
              >
                <li
                  :class="[
                    active ? 'bg-[#6a0d1b] text-white' : 'text-gray-900',
                    'cursor-pointer select-none relative py-2 pl-3 pr-10'
                  ]"
                >
                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                    {{ p }}
                  </span>
                  <span v-if="selected" class=" absolute inset-y-0 right-0 flex items-center pr-3 text-[#6a0d1b]" :class="{ 'text-white': active }">
                    <SVG icon-name="Check"></SVG>
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <input
          v-else
          v-model="data.purpose"
          type="text"
          placeholder="Enter purpose"
          :class="[
            validationErrors.purpose ? 'border-red-500' : 'border-gray-300',
            'focus:border-red-900 focus:ring-1 focus:ring-red-900'
          ]"
          class="p-2 border rounded-lg w-full transition-colors"
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
          :class="[
            validationErrors.accessionNumber ? 'border-red-500' : 'border-gray-300',
            'focus:border-red-900 focus:ring-1 focus:ring-red-900'
          ]"
          class="p-2 border rounded-lg w-full transition-colors"
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
          :class="[
            validationErrors.numberOfHours ? 'border-red-500' : 'border-gray-300',
            'focus:border-red-900 focus:ring-1 focus:ring-red-900'
          ]"
          class="p-2 border rounded-lg w-full transition-colors"
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
          :class="[
            validationErrors.numberOfDays ? 'border-red-500' : 'border-gray-300',
            'focus:border-red-900 focus:ring-1 focus:ring-red-900'
          ]"
          class="p-2 border rounded-lg w-full transition-colors"
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
          :class="[
            validationErrors.numberOfPages ? 'border-red-500' : 'border-gray-300',
            'focus:border-red-900 focus:ring-1 focus:ring-red-900'
          ]"
          class="p-2 border rounded-lg w-full transition-colors"
        />
        <p v-if="validationErrors.numberOfPages" class="text-xs text-red-500 mt-1">
          {{ validationErrors.numberOfPages }}
        </p>
      </div>

      <div v-if="formRequirements.isFacilities" class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Facilities Reference Number <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.facilitiesReferenceNumber"
          type="text"
          placeholder="From Approved Reservation Form"
          :class="[
            validationErrors.facilitiesReferenceNumber ? 'border-red-500' : 'border-gray-300',
            'focus:border-red-900 focus:ring-1 focus:ring-red-900'
          ]"
          class="p-2 border rounded-lg w-full transition-colors"
        />
        <p
          v-if="validationErrors.facilitiesReferenceNumber"
          class="text-xs text-red-500 mt-1"
        >
          {{ validationErrors.facilitiesReferenceNumber }}
        </p>
      </div>

      <div
        :class="{
          'md:col-span-1': formRequirements.isReferenceNumberRequired, 
          'md:col-span-2': !formRequirements.isReferenceNumberRequired,
        }"
      >
        <label class="block text-sm font-bold text-gray-700 mb-1">
          {{ amountLabel }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.amount"
          type="number"
          placeholder="Enter amount"
          :class="[
            validationErrors.amount ? 'border-red-500' : 'border-gray-300',
            'focus:border-red-900 focus:ring-1 focus:ring-red-900'
          ]"
          class="p-2 border rounded-lg w-full transition-colors"
        />
        <p v-if="validationErrors.amount" class="text-xs text-red-500 mt-1">
          {{ validationErrors.amount }}
        </p>
      </div>

      <div v-if="formRequirements.isReferenceNumberRequired">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Reference Number / Payment ID <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.paymentReferenceNumber"
          type="text"
          placeholder="Transaction ID / Reference Number"
          required
          :class="[
            validationErrors.paymentReferenceNumber ? 'border-red-500' : 'border-gray-300',
            'focus:border-red-900 focus:ring-1 focus:ring-red-900'
          ]"
          class="p-2 border rounded-lg w-full transition-colors"
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
/* Removes spinner buttons from number input */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>