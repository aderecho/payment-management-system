<script setup>
import { computed } from 'vue';

const props = defineProps({
    label: String,
    modelValue: [String, Number],
    error: [String, null],
    type: {
        type: String,
        default: 'text', // Can be 'text', 'email', 'number', 'select'
    },
    required: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Array,
        default: () => [], // Used only when type is 'select'
    },
    placeholder: String,
    inputmode: String,
    pattern: String,
});

const emit = defineEmits(['update:modelValue']);

// Helper to check if the field needs a required indicator *
const showRequiredStar = computed(() => {
    // Only show the star if the label doesn't already contain it (to support manual label text)
    return props.required && !props.label.includes('*');
});

// Tailwind CSS classes for the input field
const inputClasses = computed(() => [
    'p-2 block w-full border rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150',
    props.error ? 'border-red-500' : 'border-gray-300 hover:border-brand-maroon-300 hover:shadow-md',
]);
</script>

<template>
    <div>
        <label :for="label" class="block text-sm font-bold text-gray-700 mb-1">
            {{ label }}
            <span v-if="showRequiredStar" class="text-red-500">*</span>
        </label>
        
        <div class="relative">
            <template v-if="type === 'select'">
                <select 
                    :id="label"
                    :value="modelValue"
                    @change="emit('update:modelValue', $event.target.value)"
                    :required="required"
                    :class="inputClasses"
                    class="pr-10 text-gray-700"
                >
                    <option v-for="opt in options" :key="opt" :value="opt">
                        {{ opt }}
                    </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-maroon-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </template>
            <template v-else>
                <input
                    :type="type"
                    :id="label"
                    :value="modelValue"
                    @input="emit('update:modelValue', $event.target.value)"
                    :required="required"
                    :placeholder="placeholder"
                    :inputmode="inputmode"
                    :pattern="pattern"
                    :class="inputClasses"
                />
            </template>
        </div>

        <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
    </div>
</template>