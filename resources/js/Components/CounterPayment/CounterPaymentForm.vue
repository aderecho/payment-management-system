<!-- resources/js/Layouts/CounterPaymentForm.vue -->
<script setup>
import { ref, computed, watch } from "vue";
import { studentDataForAutofill } from "@/MockData.js";

const emit = defineEmits(["open-summary"]);

const studentMockData = studentDataForAutofill;

const transactionTypes = [
  "University Enrollment Related",
  "University Library-Fees & Fines",
  "UP Cebu Facilities, Other Equipment and Vehicle Registration",
];
const paymentMethods = ["Cash", "Gcash", "Maya", "Bank Transfer"];

const enrollmentOptions = ["Tuition Fee", "Residency", "Leave of Absence (LOA)"];
const libraryOptions = [
  "Overdue Books",
  "Lost Books",
  "Internet Fee",
  "Alumni and Researchers Fee",
  "Non-UP (Private)",
  "Photocopy",
  "Printing",
  "Scanning",
];

// --- FORM STATE ---
const name = ref("");
const course = ref("");
const yearLevel = ref("");
const schoolYear = ref("");
const campusId = ref("");
const email = ref("");
const transactionType = ref(transactionTypes[0]);
const paymentMethod = ref(paymentMethods[0]);
const amount = ref("");
const purpose = ref("");
const isNameOnOR = ref(true);
const organizationNameOR = ref("");
const facilitiesReferenceNumber = ref("");
const referenceNumber = ref("");

// --- VALIDATION STATE ---
const validationErrors = ref({});

// --- COMPUTED FIELD REQUIREMENTS ---
const fieldRequirements = computed(() => {
  const type = transactionType.value;
  const isEnrollment = type === "University Enrollment Related";
  const isLibrary = type === "University Library-Fees & Fines";
  const isFacilities =
    type === "UP Cebu Facilities, Other Equipment and Vehicle Registration";

  return {
    isEnrollment,
    isLibrary,
    isFacilities,
    campusId: { required: isEnrollment },
    email: { required: true },
  };
});

// Reset fields when type changes
watch(transactionType, () => {
  purpose.value = "";
  facilitiesReferenceNumber.value = "";
});

// --- PURPOSE OPTIONS ---
const purposeOptions = computed(() => {
  if (transactionType.value === "University Enrollment Related") return enrollmentOptions;
  if (transactionType.value === "University Library-Fees & Fines") return libraryOptions;
  return [];
});
const isPurposeDropdown = computed(() => purposeOptions.value.length > 0);

// --- AUTOFILL ---
watch(campusId, (newId) => {
  const student = studentMockData.find(
    (s) => s.campusId.toUpperCase() === newId.toUpperCase()
  );
  if (student) {
    name.value = student.name;
    course.value = student.course;
    yearLevel.value = student.yearLevel;
    schoolYear.value = student.schoolYear;
    email.value = student.email;
  } else {
    name.value = "";
    course.value = "";
    yearLevel.value = "";
    schoolYear.value = "";
    email.value = "";
  }
});

// --- VALIDATION ---
const validateForm = () => {
  validationErrors.value = {};
  let isValid = true;

  const addError = (key, msg) => {
    validationErrors.value[key] = msg;
    isValid = false;
  };

  if (!transactionType.value) addError("transactionType", "Required");
  if (!purpose.value) addError("purpose", "Required");
  if (!amount.value || parseFloat(amount.value) <= 0)
    addError("amount", "Enter valid amount");

  if (fieldRequirements.value.campusId.required && !campusId.value)
    addError("campusId", "Required");
  if (!email.value) addError("email", "Required");

  if (!name.value) addError("name", "Required");
  if (fieldRequirements.value.isFacilities && !facilitiesReferenceNumber.value)
    addError("facilitiesReferenceNumber", "Required");

  if (!isNameOnOR.value && !organizationNameOR.value)
    addError("organizationNameOR", "Required");
  if (paymentMethod.value !== "Cash" && !referenceNumber.value)
    addError("referenceNumber", "Required");

  return isValid;
};

const submitForm = () => {
  if (!validateForm()) return;

  const data = {
    transactionType: transactionType.value,
    paymentMethod: paymentMethod.value,
    purpose: purpose.value,
    amount: amount.value,
    campusId: campusId.value,
    name: name.value,
    course: course.value,
    yearLevel: yearLevel.value,
    schoolYear: schoolYear.value,
    email: email.value,
    facilitiesReferenceNumber: facilitiesReferenceNumber.value,
    isNameOnOR: isNameOnOR.value,
    organizationNameOR: organizationNameOR.value,
    referenceNumber: referenceNumber.value,
  };

  emit("open-summary", data);
};
</script>

<template>
  <div class="bg-white shadow-md rounded-xl p-6 space-y-4">
    <h2 class="text-xl font-bold text-gray-800 border-b pb-2">
      Transaction Details
    </h2>

    <!-- Transaction Type -->
    <div>
      <label class="font-semibold text-sm">Transaction Type</label>
      <select v-model="transactionType" class="w-full border rounded-lg p-2">
        <option v-for="t in transactionTypes" :key="t">{{ t }}</option>
      </select>
      <p v-if="validationErrors.transactionType" class="text-red-500 text-xs">
        {{ validationErrors.transactionType }}
      </p>
    </div>

    <!-- Purpose -->
    <div>
      <label class="font-semibold text-sm">Purpose</label>
      <select
        v-if="isPurposeDropdown"
        v-model="purpose"
        class="w-full border rounded-lg p-2"
      >
        <option v-for="p in purposeOptions" :key="p">{{ p }}</option>
      </select>
      <input
        v-else
        v-model="purpose"
        placeholder="Enter purpose"
        class="w-full border rounded-lg p-2"
      />
      <p v-if="validationErrors.purpose" class="text-red-500 text-xs">
        {{ validationErrors.purpose }}
      </p>
    </div>

    <!-- Amount -->
    <div>
      <label class="font-semibold text-sm">Amount (₱)</label>
      <input v-model="amount" type="number" class="w-full border rounded-lg p-2" />
      <p v-if="validationErrors.amount" class="text-red-500 text-xs">
        {{ validationErrors.amount }}
      </p>
    </div>

    <!-- Payment Method -->
    <div>
      <label class="font-semibold text-sm">Payment Method</label>
      <select v-model="paymentMethod" class="w-full border rounded-lg p-2">
        <option v-for="m in paymentMethods" :key="m">{{ m }}</option>
      </select>
    </div>

    <!-- Campus ID -->
    <div>
      <label class="font-semibold text-sm">Campus ID</label>
      <input v-model="campusId" class="w-full border rounded-lg p-2" />
      <p v-if="validationErrors.campusId" class="text-red-500 text-xs">
        {{ validationErrors.campusId }}
      </p>
    </div>

    <!-- Name -->
    <div>
      <label class="font-semibold text-sm">Name</label>
      <input v-model="name" class="w-full border rounded-lg p-2" />
      <p v-if="validationErrors.name" class="text-red-500 text-xs">
        {{ validationErrors.name }}
      </p>
    </div>

    <!-- Course Info -->
    <div class="grid grid-cols-3 gap-2">
      <input v-model="course" placeholder="Course" class="border rounded-lg p-2" />
      <input v-model="yearLevel" placeholder="Year" class="border rounded-lg p-2" />
      <input
        v-model="schoolYear"
        placeholder="School Year"
        class="border rounded-lg p-2"
      />
    </div>

    <!-- Email -->
    <div>
      <label class="font-semibold text-sm">Email</label>
      <input v-model="email" type="email" class="w-full border rounded-lg p-2" />
      <p v-if="validationErrors.email" class="text-red-500 text-xs">
        {{ validationErrors.email }}
      </p>
    </div>

    <!-- Facilities Ref -->
    <div v-if="fieldRequirements.isFacilities">
      <label class="font-semibold text-sm">Facilities Reference Number</label>
      <input
        v-model="facilitiesReferenceNumber"
        class="w-full border rounded-lg p-2"
      />
    </div>

    <!-- OR Name -->
    <div>
      <label class="font-semibold text-sm">Name on OR</label>
      <div class="flex items-center gap-3">
        <label><input type="radio" v-model="isNameOnOR" :value="true" /> Same as payer</label>
        <label><input type="radio" v-model="isNameOnOR" :value="false" /> Organization</label>
      </div>

      <input
        v-if="!isNameOnOR"
        v-model="organizationNameOR"
        placeholder="Organization/Company Name"
        class="w-full border rounded-lg p-2 mt-2"
      />
    </div>

    <!-- Reference Number -->
    <div v-if="paymentMethod !== 'Cash'">
      <label class="font-semibold text-sm">Payment Reference Number</label>
      <input v-model="referenceNumber" class="w-full border rounded-lg p-2" />
    </div>

    <!-- Submit -->
    <div class="text-right pt-3">
      <button
        @click="submitForm"
        class="bg-brand-maroon hover:bg-brand-maroon/90 text-white px-4 py-2 rounded-lg font-semibold"
      >
        Review Payment
      </button>
    </div>
  </div>
</template>
