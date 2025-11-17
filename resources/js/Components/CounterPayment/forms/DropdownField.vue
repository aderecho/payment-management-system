<script setup>
import { computed } from 'vue';
// NOTE: Make sure the path to SVG.vue is correct for your project structure
import SVG from '../../SVG.vue'; 
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  options: {
    type: Array,
    required: true,
  },
  validationError: String,
});

const emit = defineEmits(['update:modelValue']);

const selectedValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const displayValue = computed(() => selectedValue.value || 'Select');
</script>

<template>
  <div class="relative">
    <label class="block text-sm font-bold text-gray-700 mb-1">
      {{ label }} <span class="text-red-500">*</span>
    </label>
    <Listbox v-model="selectedValue" as="div" class="relative">
      <ListboxButton 
        class="border p-2 pr-6 rounded-lg w-full text-left relative truncate"
        :class="[
          validationError ? 'border-red-500' : 'border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900',
          selectedValue ? 'text-gray-800' : 'text-gray-400'
        ]"
      >
        {{ displayValue }}
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
            v-for="option in options"
            :key="option"
            :value="option"
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
                {{ option }}
              </span>
              <span v-if="selected" class=" absolute inset-y-0 right-0 flex items-center pr-3 text-[#6a0d1b]" :class="{ 'text-white': active }">
                <SVG icon-name="Check"></SVG>
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
    <p v-if="validationError" class="text-xs text-red-500 mt-1">
      {{ validationError }}
    </p>
  </div>
</template>