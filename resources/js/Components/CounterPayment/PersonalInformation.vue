<script setup>
import { computed, watch } from "vue";
import SVG from "../SVG.vue";
// Import Headless UI Listbox components
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
    "University Enrollment Related"
  ];
  return keywords.some((word) =>
    data.value.transactionType.toLowerCase().includes(word.toLowerCase())
  );
});

// Helper for displaying the currently selected course
const selectedCourseDisplay = computed(() => {
    return data.value.course || 'Select a Course'
})

// 💡 ADDED: Helper for displaying the currently selected year level
const selectedYearLevelDisplay = computed(() => {
    return data.value.yearLevel || 'Select Year Level'
})
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-lg">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      Personal Information
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <div >
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Campus ID 
          <span 
          v-if="isUniversityEnrollmentRelated"
          class="text-red-500">*</span>
          <span
            v-if="!isUniversityEnrollmentRelated"
            class="text-gray-400 text-sm font-normal"
          >
            (Optional)
          </span>
         
        </label>
        <input
          v-model="data.campusId"
          type="text"
          placeholder="ex. 202500129"
          class="p-2 border rounded-lg w-full focus:border-red-900 focus:ring-1 focus:ring-red-900"
          :class="validationErrors.campusId ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.campusId" class="text-xs text-red-500 mt-1">
          {{ validationErrors.campusId }}
        </p>
      </div>

      <div class="relative">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Course
          <span 
          v-if="isUniversityEnrollmentRelated"
          class="text-red-500">*</span>
          <span
            v-if="!isUniversityEnrollmentRelated"
            class="text-gray-400 text-sm font-normal"
          >
            (Optional)
          </span>
        </label>

          <Listbox v-model="data.course" as="div" class="relative">
            <ListboxButton 
              class="border p-2 pr-6 rounded-lg w-full text-left relative truncate"
              :class="[
                validationErrors.course ? 'border-red-500' : 'border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900',
                data.course ? 'text-gray-800' : 'text-gray-400'
              ]"
            >
              {{ selectedCourseDisplay }}
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ">
                <SVG icon-name="DropdownMenuArrow" ></SVG>
              </span>
            </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <template v-for="(courses, category) in courseOptions" :key="category">
                <li class="px-3 py-2 text-xs font-bold text-gray-500 uppercase  top-0 bg-white">
                  {{ category }}
                </li>
                <ListboxOption
                  v-for="course in courses"
                  :key="course"
                  :value="course"
                  as="template"
                  v-slot="{ active, selected }"
                >
                  <li
                    :class="[
                      active ? 'bg-[#6a0d1b] text-white' : 'text-gray-900',
                      'cursor-pointer select-none relative py-2 pl-3 pr-10'
                    ]"
                  >
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block']">
                      {{ course }}
                    </span>
                    <span v-if="selected" class=" absolute inset-y-0 right-0 flex  items-center pr-3 text-[#6a0d1b]" :class="{ 'text-white': active }">
                      <SVG icon-name="Check" ></SVG>
                    </span>
                  </li>
                </ListboxOption>
              </template>
            </ListboxOptions>
          </transition>
        </Listbox>
        
        <p v-if="validationErrors.course" class="text-xs text-red-500 mt-1">
          {{ validationErrors.course }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Name: (Lastname, Firstname, MI) <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.name"
          type="text"
          placeholder="ex. Smith, John"
          class="p-2 border rounded-lg w-full focus:border-red-900 focus:ring-1 focus:ring-red-900"
          :class="validationErrors.name ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.name" class="text-xs text-red-500 mt-1">
          {{ validationErrors.name }}
        </p>
      </div>

      <div class="relative">
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Year Level
          <span 
          v-if="isUniversityEnrollmentRelated"
          class="text-red-500">*</span>
          <span
            v-if="!isUniversityEnrollmentRelated"
            class="text-gray-400 text-sm font-normal"
          >
            (Optional)
          </span>
        </label>
        
        <Listbox v-model="data.yearLevel" as="div" class="relative">
          <ListboxButton 
            class="border p-2 rounded-lg w-full text-left relative truncate"
            :class="[
              validationErrors.yearLevel ? 'border-red-500' : 'border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900',
              data.yearLevel ? 'text-gray-800' : 'text-gray-400'
            ]"
          >
            {{ selectedYearLevelDisplay }}
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SVG icon-name="DropdownMenuArrow" ></SVG>
            </span>
          </ListboxButton>

          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption
                v-for="level in yearLevelOptions"
                :key="level"
                :value="level"
                as="template"
                v-slot="{ active, selected }"
              > 
                <li
                  :class="[
                    active ? 'bg-[#6a0d1b] text-white' : 'text-gray-900',
                    'cursor-pointer select-none relative py-2 px-4'
                  ]"
                >
                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block']">
                    {{ level }}
                  </span>
                  <span v-if="selected" class=" absolute inset-y-0 right-0 flex items-center pr-3 text-[#6a0d1b]" :class="{ 'text-white': active }">
                    <SVG icon-name="Check" ></SVG>
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </Listbox>

        <p v-if="validationErrors.yearLevel" class="text-xs text-red-500 mt-1">
          {{ validationErrors.yearLevel }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.email"
          type="email"
          placeholder="johnsmith@example.com"
          class="p-2 border rounded-lg w-full focus:border-red-900 focus:ring-1 focus:ring-red-900"
          :class="validationErrors.email ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.email" class="text-xs text-red-500 mt-1">
          {{ validationErrors.email }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-1">
          School Year
          <span 
          v-if="isUniversityEnrollmentRelated"
          class="text-red-500">*</span>
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
          class="p-2 border rounded-lg w-full focus:border-red-900 focus:ring-1 focus:ring-red-900"
          :class="validationErrors.schoolYear ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="validationErrors.schoolYear" class="text-xs text-red-500 mt-1">
          {{ validationErrors.schoolYear }}
        </p>
      </div>

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

      <div v-if="data.isNameOnOR === false" class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-1 ">
          Name to Appear on OR <span class="text-red-500">*</span>
        </label>
        <input
          v-model="data.orName"
          type="text"
          placeholder="Enter Name of Organization / Company"
          class="p-2 border rounded-lg w-full focus:border-red-900 focus:ring-1 focus:ring-red-900"
          :class="validationErrors.orName ? 'border-red-500' : 'border-gray-300' "
        />
        <p v-if="validationErrors.orName" class="text-xs text-red-500 mt-1">
          {{ validationErrors.orName }}
        </p>
      </div>
    </div>

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