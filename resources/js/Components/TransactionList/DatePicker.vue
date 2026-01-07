<script setup>
import { ref, computed } from 'vue';
import { MOCK_TRANSACTION_DATA } from '@/stores/MockData.js'; // Ensure path is correct

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    target: {
        type: String,
        required: true,
    }
});

const emit = defineEmits([
    'update:modelValue',
    'close',
    'clear-all-dates'
]);

// --- DYNAMIC YEAR LOGIC ---
// Extract all years from mock data, find the minimum, or default to current year
const extractedYears = MOCK_TRANSACTION_DATA.map(item => parseInt(item.date.split('/')[2]));
const minYearWithData = Math.min(...extractedYears, new Date().getFullYear());

const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];
const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const currentYear = new Date().getFullYear(); 
const todayDateString = new Date().toISOString().slice(0, 10);

const currentSelectedYear = ref(currentYear);
const currentSelectedMonthIndex = ref(new Date().getMonth());
const currentSelectedDay = ref(null);

const currentView = ref('day'); 

const initializePickerDate = () => {
    if (props.modelValue) {
        const dateParts = props.modelValue.split('-');
        currentSelectedYear.value = parseInt(dateParts[0]);
        currentSelectedMonthIndex.value = parseInt(dateParts[1]) - 1; 
        currentSelectedDay.value = parseInt(dateParts[2]);
    } else {
        const today = new Date();
        currentSelectedYear.value = currentYear;
        currentSelectedMonthIndex.value = today.getMonth();
        currentSelectedDay.value = today.getDate();
    }
    currentView.value = 'day'; 
};

initializePickerDate();

const availableYears = computed(() => {
    const years = [];
    const start = minYearWithData;
    const end = currentYear;

    for (let year = start; year <= end; year++) {
        years.push(year);
    }
    return years; 
});

const daysInMonthGrid = computed(() => {
    const year = currentSelectedYear.value;
    const monthIndex = currentSelectedMonthIndex.value;
    
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayOfMonth = (new Date(year, monthIndex, 1).getDay() + 6) % 7; 

    const grid = [];
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        grid.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, monthIndex, day);
        const isToday = date.toDateString() === new Date().toDateString();
        const isPastMax = date > new Date();
        
        grid.push({
            day: day,
            isDisabled: isPastMax,
            isToday: isToday,
        });
    }

    return grid;
});

const navigateToMonthView = () => { currentView.value = 'month'; };
const navigateToYearView = () => { currentView.value = 'year'; };

const selectYear = (year) => {
    currentSelectedYear.value = year;
    currentView.value = 'month';
};

const selectMonth = (monthIndex) => {
    currentSelectedMonthIndex.value = monthIndex;
    currentSelectedDay.value = null;
    currentView.value = 'day';
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

        const today = new Date();
        const futuredate = new Date(newYear, newMonthIndex);
        
        // Block navigating into the future
        if (futuredate > new Date(today.getFullYear(), today.getMonth())) {
            currentSelectedYear.value = today.getFullYear();
            currentSelectedMonthIndex.value = today.getMonth();
        } 
        // Block navigating before the minimum year data
        else if (newYear < minYearWithData) {
            currentSelectedYear.value = minYearWithData;
            currentSelectedMonthIndex.value = 0;
        }
        else {
            currentSelectedYear.value = newYear;
            currentSelectedMonthIndex.value = newMonthIndex;
        }
    }
};

const selectDay = (day) => {
    if (!day || day.isDisabled) return;
    currentSelectedDay.value = day.day;
    applySelectedDate(true);
};

const applySelectedDate = (shouldClose = false) => {
    const year = currentSelectedYear.value;
    const month = String(currentSelectedMonthIndex.value + 1).padStart(2, '0');
    let day = String(currentSelectedDay.value || 1).padStart(2, '0');
    
    if (props.target === 'end' && !currentSelectedDay.value) {
        const lastDay = new Date(year, currentSelectedMonthIndex.value + 1, 0).getDate();
        day = String(lastDay).padStart(2, '0');
    }

    const newDate = `${year}-${month}-${day}`;
    emit('update:modelValue', newDate);
    
    if (shouldClose) emit('close');
};

const clearDates = () => { emit('clear-all-dates'); }

defineExpose({ initializePickerDate });
</script>

<template>
    <div @click.self="$emit('close')" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-2xl p-6 w-96">
            <div class="flex justify-between items-center mb-4">
                <button 
                    @click="navigateCalendar(-1)" 
                    class="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"
                    :disabled="currentSelectedYear <= minYearWithData && currentSelectedMonthIndex === 0"
                >
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                
                <div class="flex gap-1">
                    <button @click="navigateToMonthView" class="text-xl font-bold hover:bg-gray-100 px-2 py-1 rounded-md">
                        {{ months[currentSelectedMonthIndex] }}
                    </button>
                    <button @click="navigateToYearView" class="text-xl font-bold hover:bg-gray-100 px-2 py-1 rounded-md">
                        {{ currentSelectedYear }}
                    </button>
                </div>

                <button 
                    @click="navigateCalendar(1)" 
                    class="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"
                    :disabled="currentSelectedYear >= currentYear && currentSelectedMonthIndex === new Date().getMonth()"
                >
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>

            <div v-if="currentView === 'month'" class="grid grid-cols-3 gap-2 mt-4">
                <button 
                    v-for="(month, index) in months" :key="month"
                    @click="selectMonth(index)"
                    :class="['py-2 rounded-lg text-sm', currentSelectedMonthIndex === index ? 'bg-brand-maroon text-white' : 'hover:bg-gray-100']"
                >
                    {{ month }}
                </button>
            </div>

            <div v-else-if="currentView === 'year'" class="mt-4 max-h-72 overflow-y-auto grid grid-cols-4 gap-2 border-t pt-2">
                <div 
                    v-for="year in availableYears.slice().reverse()" :key="year"
                    @click="selectYear(year)"
                    :class="['py-2 cursor-pointer text-center rounded-md', year === currentSelectedYear ? 'bg-brand-maroon text-white' : 'hover:bg-gray-100']"
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
                        v-for="(dayItem, index) in daysInMonthGrid" :key="index"
                        :class="[
                            'p-2 rounded-full text-sm flex items-center justify-center h-8 w-8 mx-auto',
                            dayItem && dayItem.isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer',
                            dayItem && currentSelectedDay === dayItem.day ? 'bg-brand-maroon text-white' : 'hover:bg-gray-100'
                        ]"
                        @click="selectDay(dayItem)"
                    >
                        {{ dayItem ? dayItem.day : '' }}
                    </div>
                </div>
            </div>

            <div class="mt-6 pt-4 border-t flex justify-end items-center space-x-4">
                <button @click="clearDates" class="text-sm font-semibold text-brand-maroon">Clear Dates</button>
                <button @click="$emit('close')" class="text-sm text-gray-600">Close</button>
                <button @click="applySelectedDate(true)" class="text-sm font-semibold px-4 py-2 bg-brand-maroon text-white rounded-md">Apply</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg-brand-maroon { background-color: #800000; }
.text-brand-maroon { color: #800000; }
</style>