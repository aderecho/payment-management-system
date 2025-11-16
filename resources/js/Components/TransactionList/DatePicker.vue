<script setup>
import { ref, computed } from 'vue';

// Define the component's props
const props = defineProps({
    // The model to bind the selected date to (e.g., startDate or endDate)
    modelValue: {
        type: String, // (MM-DD-YYYY) format
        default: '',
    },
    // Used to determine if the picker is for the start or end date
    target: {
        type: String, // 'start' or 'end'
        required: true,
    },
    // The year of the oldest transaction data
    minYearWithData: {
        type: Number,
        required: true,
    },
});

// Define the events the component can emit
const emit = defineEmits([
    'update:modelValue', 
    'close', 
    'clear-all-dates' // Custom event for clearing both dates
]);

// --- CONSTANTS ---
const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];
const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const currentYear = new Date().getFullYear(); 
const todayDateString = new Date().toISOString().slice(0, 10);

// --- COMPONENT LOCAL STATES ---
const currentSelectedYear = ref(currentYear);
const currentSelectedMonthIndex = ref(new Date().getMonth()); // 0-indexed
const currentSelectedDay = ref(null); // State for selected day

// State for current view in the picker: 'day', 'month', 'year'
const currentView = ref('day'); 


// Initialize picker to the date passed in via modelValue
const initializePickerDate = () => {
    if (props.modelValue) {
        // Parse current value (MM-DD-YYYY)
        const dateParts = props.modelValue.split('-');
        currentSelectedYear.value = parseInt(dateParts[0]);
        currentSelectedMonthIndex.value = parseInt(dateParts[1]) - 1; 
        currentSelectedDay.value = parseInt(dateParts[2]);
    } else {
        // Default to current date/month/year
        const today = new Date();
        currentSelectedYear.value = currentYear;
        currentSelectedMonthIndex.value = today.getMonth();
        currentSelectedDay.value = today.getDate(); // Default to today's day
    }
    // Always start with day view when opened/initialized
    currentView.value = 'day'; 
};

// Call initialization when component mounts or a value changes (if necessary for external changes, 
// but since it's a modal, initialization can be manual right before display)
// NOTE: TransactionMockData.vue calls this manually via openYearPicker 
// which is now the responsibility of the parent to manage the modal state and initial values.
// We'll call it once initially for a safe default state.
initializePickerDate();


// --- COMPUTED PROPERTIES ---
/**
 * Computed property for the year list, ordered MIN_YEAR (top) to CURRENT_YEAR (bottom).
 */
const availableYears = computed(() => {
    const years = [];
    const minYear = props.minYearWithData; 
    for (let year = minYear; year <= currentYear; year++) {
        years.push(year);
    }
    return years; 
});

// Computed property to generate the day grid
const daysInMonthGrid = computed(() => {
    const year = currentSelectedYear.value;
    const monthIndex = currentSelectedMonthIndex.value; // 0-indexed month
    
    // Get the last day of the current month (day 0 of the next month)
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    // Get the day of the week for the first day of the month (0=Sunday, 6=Saturday)
    // Adjust to make Monday=0, Sunday=6
    const firstDayOfMonth = (new Date(year, monthIndex, 1).getDay() + 6) % 7; 

    const grid = [];
    
    // Add placeholders for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
        grid.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, monthIndex, day);
        const isToday = date.toDateString() === new Date().toDateString();
        const isPastMax = date > new Date(); // Disable future dates
        
        grid.push({
            day: day,
            isDisabled: isPastMax,
            isToday: isToday,
        });
    }

    return grid;
});

// --- NAVIGATION FUNCTIONS ---

// Navigates to month view
const navigateToMonthView = () => {
    currentView.value = 'month';
};

// Navigates to year view
const navigateToYearView = () => {
    currentView.value = 'year';
};

// Select year from year list
const selectYear = (year) => {
    currentSelectedYear.value = year;
    currentView.value = 'month'; // After selecting year, go to month view
};

// Select month from month grid
const selectMonth = (monthIndex) => {
    currentSelectedMonthIndex.value = monthIndex;
    currentSelectedDay.value = null; // Reset day selection on month/year change
    currentView.value = 'day'; // After selecting month, go to day view
};

const navigateCalendar = (direction) => {
    if (currentView.value === 'day') {
        let newMonthIndex = currentSelectedMonthIndex.value + direction;
        let newYear = currentSelectedYear.value;

        if (newMonthIndex > 11) {
            newMonthIndex = 0;
            newYear++;
        } else if (newMonthIndex < 0) {
            newMonthIndex = 11;
            newYear--;
        }

        // Prevent navigating past the current year/month
        const today = new Date();
        const futuredate = new Date(newYear, newMonthIndex);
        if (futuredate > new Date(today.getFullYear(), today.getMonth())) {
            currentSelectedYear.value = today.getFullYear();
            currentSelectedMonthIndex.value = today.getMonth();
        } else if (newYear < props.minYearWithData) {
            currentSelectedYear.value = props.minYearWithData;
            currentSelectedMonthIndex.value = 0; // Jan of min year
        }
        else {
            currentSelectedYear.value = newYear;
            currentSelectedMonthIndex.value = newMonthIndex;
        }
        currentSelectedDay.value = null; // Reset day selection when navigating month/year
    } else if (currentView.value === 'year') {
        // For year view, navigate by a block of years (e.g., 12 years)
        const yearBlockSize = 12; // Or adjust as needed
        const currentYearIndex = availableYears.value.findIndex(y => y === currentSelectedYear.value);
        let newYearIndex;
        
        if (direction > 0) {
              // Move to the year that would start the next block
            newYearIndex = Math.min(availableYears.value.length - 1, currentYearIndex + yearBlockSize);
        } else {
            // Move to the year that would start the previous block
            newYearIndex = Math.max(0, currentYearIndex - yearBlockSize);
        }

        currentSelectedYear.value = availableYears.value[newYearIndex];
    }
};

// Function to select a specific day
const selectDay = (day) => {
    if (!day || day.isDisabled) return;
    currentSelectedDay.value = day.day;
    applySelectedDate(true); // Apply and close instantly
};

// Function to apply the selected date and update the model
const applySelectedDate = (shouldClose = false) => {
    const year = currentSelectedYear.value;
    const month = String(currentSelectedMonthIndex.value + 1).padStart(2, '0');
    
    let day = String(currentSelectedDay.value || 1).padStart(2, '0'); // Use selected day or default to 01
    
    // If the target is 'end' and no day is explicitly selected, set to the last day of the month
    if (props.target === 'end' && !currentSelectedDay.value) {
        const lastDay = new Date(year, currentSelectedMonthIndex.value + 1, 0).getDate();
        day = String(lastDay).padStart(2, '0');
    }

    const newDate = `${year}-${month}-${day}`;

    // Prevent setting a date beyond today
    if (new Date(newDate) <= new Date(todayDateString)) {
        emit('update:modelValue', newDate);
    } else {
        emit('update:modelValue', todayDateString);
    }
    
    if (shouldClose) {
        emit('close');
    }
};

const clearDates = () => {
    emit('clear-all-dates');
}


// Expose the initialize function for the parent to call when the picker is opened
defineExpose({
    initializePickerDate
});
</script>

<template>
    <div 
        @click.self="$emit('close')"
        class="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
        <div class="bg-white rounded-lg shadow-2xl p-6 transform transition-all w-96">
            <div class="flex justify-between items-center mb-4">
                <button 
                    @click="navigateCalendar(-1)" 
                    class="p-2 rounded-full hover:bg-gray-100 transition duration-150 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous"
                    :disabled="currentView === 'day' && currentSelectedYear <= minYearWithData && currentSelectedMonthIndex === 0"
                >
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                
                <div class="flex gap-1">
                    <button 
                        @click="navigateToMonthView" 
                        class="text-xl font-bold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition duration-150"
                    >
                        {{ months[currentSelectedMonthIndex] }}
                    </button>
                    <button 
                        @click="navigateToYearView" 
                        class="text-xl font-bold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition duration-150"
                    >
                        {{ currentSelectedYear }}
                    </button>
                </div>

                <button 
                    @click="navigateCalendar(1)" 
                    class="p-2 rounded-full hover:bg-gray-100 transition duration-150 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next"
                    :disabled="currentView === 'day' && currentSelectedYear >= currentYear && currentSelectedMonthIndex === new Date().getMonth()"
                >
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            <div v-if="currentView === 'month'" class="grid grid-cols-3 gap-2 mt-4">
                <button 
                    v-for="(month, index) in months" 
                    :key="month"
                    @click="selectMonth(index)"
                    :class="[
                        'py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                        currentSelectedMonthIndex === index 
                            ? 'bg-brand-maroon text-white shadow-md' // CHANGED FROM bg-red-600
                            : 'text-gray-700 hover:bg-brand-maroon hover:text-white' // CHANGED FROM hover:bg-red-500
                    ]"
                >
                    {{ month }}
                </button>
            </div>

            <div v-else-if="currentView === 'year'" class="mt-4 max-h-72 overflow-y-auto custom-scrollbar border-t pt-2 border-gray-200 grid grid-cols-4 gap-2">
                <div 
                    v-for="year in availableYears.slice().reverse()" 
                    :key="year"
                    @click="selectYear(year)"
                    :class="[
                        'py-2 px-3 text-base transition-colors duration-150 cursor-pointer text-center rounded-md',
                        year === currentSelectedYear
                            ? 'bg-brand-maroon text-white font-semibold' // CHANGED FROM bg-red-600
                            : 'text-gray-700 hover:bg-gray-100'
                    ]"
                >
                    {{ year }}
                </div>
            </div>

            <div v-else-if="currentView === 'day'">
                <div class="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
                    <span v-for="dayName in weekdays" :key="dayName">{{ dayName }}</span>
                </div>
                <div class="grid grid-cols-7 gap-1">
                    <div 
                        v-for="(dayItem, index) in daysInMonthGrid" 
                        :key="index"
                        :class="[
                            'p-2 rounded-full text-sm font-medium transition-colors duration-150 flex items-center justify-center h-8 w-8 mx-auto',
                            dayItem === null ? 'pointer-events-none' : '',
                            dayItem && dayItem.isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer',
                            dayItem && !dayItem.isDisabled && currentSelectedDay === dayItem.day
                                ? 'bg-brand-maroon text-white shadow-md' // CHANGED FROM bg-red-900
                                : dayItem && !dayItem.isDisabled && dayItem.isToday
                                    ? 'bg-gray-100 text-brand-maroon border border-brand-maroon' // CHANGED FROM text-red-600 border-red-600
                                    : dayItem && !dayItem.isDisabled
                                        ? 'text-gray-700 hover:bg-gray-100'
                                        : ''
                        ]"
                        @click="selectDay(dayItem)"
                    >
                        {{ dayItem ? dayItem.day : '' }}
                    </div>
                </div>
            </div>

            <div class="mt-6 pt-4 border-t border-gray-200 flex justify-end items-center space-x-4">
                <button @click="clearDates" class="text-sm font-semibold text-brand-maroon hover:text-brand-maroon-hover">Clear Dates</button> <button @click="$emit('close')" class="text-sm text-gray-600 hover:text-gray-800">Close</button>
                <button @click="applySelectedDate(true)" class="text-sm font-semibold px-4 py-2 bg-brand-maroon text-white rounded-md hover:bg-brand-maroon-hover">Apply</button> </div>
        </div>
    </div>
</template>

<style scoped>
/* Custom scrollbar for year view */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #999;
}
</style>