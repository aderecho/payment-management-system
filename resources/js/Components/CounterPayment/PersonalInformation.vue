<script setup>
import { computed, watch } from "vue";

const props = defineProps({
  modelValue: Object,
  validationErrors: Object,
});

const emit = defineEmits(["update:modelValue", "clear", "submit"]);

const data = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

// COURSE AND YEAR LEVEL DATA ---
const courseOptions = {
  "Arts and Humanities": [
    "Certificate in Fine Arts (Studio Arts)",
    "Certificate in Fine Arts (Product Design)",
    "Bachelor of Fine Arts (Studio Arts)",
    "Bachelor of Fine Arts (Product Design)",
    "Bachelor of Arts (Mass Communication)",
  ],
  "Business Management": [
    "Master of Business Administration",
    "Bachelor of Science in Management",
  ],
  Sciences: [
    "Master of Science in Computer Science",
    "Master of Science in Environmental Studies",
    "Bachelor of Science in Biology",
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Mathematics",
  ],
  "Social Sciences": [
    "Master of Education",
    "Bachelor of Arts in Political Science",
    "Bachelor of Arts in Psychology",
  ],
  Other: ["High School"],
};

const yearLevelOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const handleClear = () => emit("clear");
const handleSubmit = () => emit("submit");

// Automatically clear OR Name when “Yes” is selected
watch(
  () => data.value.isNameOnOR,
  (newValue) => {
    if (newValue === true) data.value.orName = "";
  }
);

// Check if transaction is University Enrollment related
const isUniversityEnrollmentRelated = computed(() => {
  if (!data.value.transactionType) return false;
  const keywords = [
    "University Enrollment",
    "Enrollment",
    "Admission",
    "Registration",
  ];
  return keywords.some((word) =>
    data.value.transactionType.toLowerCase().includes(word.toLowerCase())
  );
});
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-lg">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Personal Information
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <!-- Campus ID -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Campus ID <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.campusId"
          type="text"
          placeholder="ex. 202500129"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.campusId ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.campusId" class="text-xs text-red-500 mt-1">
          {{ validationErrors.campusId }}
        </p>
      </div>

      <!-- Course -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Course
          <span
            v-if="!isUniversityEnrollmentRelated"
            class="text-gray-400 text-sm font-normal"
          >
            (Optional)
          </span>
        </label>
        <select
          v-model="data.course"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.course ? 'border-red-500' : 'border-gray-300'"
        >
          <option disabled value="">Select a Course</option>
          <template v-for="(courses, category) in courseOptions" :key="category">
            <optgroup :label="category">
              <option v-for="course in courses" :key="course" :value="course">
                {{ course }}
              </option>
            </optgroup>
          </template>
        </select>
        <p v-if="validationErrors.course" class="text-xs text-red-500 mt-1">
          {{ validationErrors.course }}
        </p>
      </div>

      <!-- Name -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Name: (Lastname, Firstname, MI) <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.name"
          type="text"
          placeholder="ex. Smith, John"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.name ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.name" class="text-xs text-red-500 mt-1">
          {{ validationErrors.name }}
        </p>
      </div>

      <!-- Year Level -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Year Level
          <span
            v-if="!isUniversityEnrollmentRelated"
            class="text-gray-400 text-sm font-normal"
          >
            (Optional)
          </span>
        </label>
        <select
          v-model="data.yearLevel"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.yearLevel ? 'border-red-500' : 'border-gray-300'"
        >
          <option disabled value="">Select Year Level</option>
          <option v-for="level in yearLevelOptions" :key="level" :value="level">
            {{ level }}
          </option>
        </select>
        <p v-if="validationErrors.yearLevel" class="text-xs text-red-500 mt-1">
          {{ validationErrors.yearLevel }}
        </p>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.email"
          type="email"
          placeholder="johnsmith@example.com"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.email ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.email" class="text-xs text-red-500 mt-1">
          {{ validationErrors.email }}
        </p>
      </div>

      <!-- School Year -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          School Year
          <span
            v-if="!isUniversityEnrollmentRelated"
            class="text-gray-400 text-sm font-normal"
          >
            (Optional)
          </span>
        </label>
        <input
          v-model="data.schoolYear"
          type="text"
          placeholder="ex. 2025-2026 1st Semester"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.schoolYear ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.schoolYear" class="text-xs text-red-500 mt-1">
          {{ validationErrors.schoolYear }}
        </p>
      </div>

      <!-- Name on OR -->
      <div class="md:col-span-2 mt-4 border p-3 rounded-lg bg-gray-50">
        <p class="block text-sm font-bold text-gray-700 mb-2">
          Does the above-mentioned name appear on the Original Receipt (OR)?
        </p>
        <div class="flex flex-col space-y-2">
          <label class="flex items-center">
            <input
              id="name-on-or-yes"
              name="name-on-or"
              type="radio"
              :value="true"
              v-model="data.isNameOnOR"
              class="h-4 w-4 text-brand-maroon border-gray-300 focus:ring-brand-maroon"
            />
            <span class="ml-2 text-sm text-gray-700">Yes</span>
          </label>
          <label class="flex items-start">
            <input
              id="name-on-or-no"
              name="name-on-or"
              type="radio"
              :value="false"
              v-model="data.isNameOnOR"
              class="h-4 w-4 text-brand-maroon border-gray-300 focus:ring-brand-maroon mt-1"
            />
            <span class="ml-2 text-sm text-gray-700">
              No (Kindly indicate the complete name of the organization / company to be printed on the OR)
            </span>
          </label>
        </div>
      </div>

      <!-- OR Name -->
      <div v-if="data.isNameOnOR === false" class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Name to Appear on OR <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.orName"
          type="text"
          placeholder="Enter Name of Organization / Company"
          class="p-2 border rounded-lg w-full"
          :class="validationErrors.orName ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.orName" class="text-xs text-red-500 mt-1">
          {{ validationErrors.orName }}
        </p>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex justify-end gap-3 mt-6">
      <button
        type="button"
        @click="handleClear"
        class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-md"
      >
        Clear
      </button>
      <button
        type="button"
        @click="handleSubmit"
        class="px-4 py-2 bg-brand-maroon text-white rounded-lg hover:bg-brand-maroon-hover shadow-md"
      >
        Submit
      </button>
    </div>
  </div>
</template>
