<script setup>
import { useTransactionStore } from '@/stores/transactionStore.js';
import DatePicker from './DatePicker.vue';
import { ref } from 'vue';

const store = useTransactionStore();

const showDatePicker = ref(false);
const target = ref(null);
const refPicker = ref(null);

// Open DatePicker for "start" or "end"
const openPicker = (t) => {
  target.value = t;
  showDatePicker.value = true;
  setTimeout(() => refPicker.value?.initializePickerDate(), 0);
};

// Clear both dates
const clearDates = () => {
  store.startDate = '';
  store.endDate = '';
  showDatePicker.value = false;
};

// Display date in MM/DD/YYYY
const format = (d) => {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${m}/${day}/${y}`;
};
</script>

<template>
  <div
    class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2"
  >
    <h1 class="text-3xl font-extrabold text-gray-900 truncate">Transaction List</h1>

    <div class="flex flex-wrap items-end gap-x-4 gap-y-3 justify-end">
      <!-- FROM DATE -->
      <div class="flex flex-col items-start w-[135px]">
        <label class="text-xs font-semibold text-gray-700 mb-1">From</label>
        <div class="relative w-full">
          <input
            type="text"
            :value="format(store.startDate)"
            @click="openPicker('start')"
            readonly
            placeholder="mm/dd/yyyy"
            class="pr-10 pl-3 py-2 border rounded-md w-full text-sm text-gray-700 border-gray-300 shadow-sm focus:ring-red-900 focus:border-red-900 cursor-pointer"
          />
          <i
            class="fa-solid fa-calendar-alt absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
             @click="openPicker('start')"
          ></i>
        </div>
      </div>

      <!-- TO DATE -->
      <div class="flex flex-col items-start w-[135px]">
        <label class="text-xs font-semibold text-gray-700 mb-1">To</label>
        <div class="relative w-full">
          <input
            type="text"
            :value="format(store.endDate)"
            @click="openPicker('end')"
            readonly
            placeholder="mm/dd/yyyy"
            class="pr-10 pl-3 py-2 border rounded-md w-full text-sm text-gray-700 border-gray-300 shadow-sm focus:ring-red-900 focus:border-red-900 cursor-pointer"
          />
          <i
            class="fa-solid fa-calendar-alt absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
             @click="openPicker('end')"
          ></i>
        </div>
      </div>

      <!-- SEARCH -->
      <div class="relative w-[268px] md:max-w-[300px]">
        <input
          type="search"
          v-model="store.searchQuery"
          placeholder="Search by ID, Name, Ref Code..."
          class="pl-10 pr-4 py-2 border rounded-md w-full text-sm text-gray-700 border-gray-300 shadow-sm focus:ring-red-900 focus:border-red-900"
        />
        <i
          class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        ></i>
      </div>  
    </div>

    <!-- DatePicker Component -->
    <DatePicker
      v-if="showDatePicker"
      ref="refPicker"
      :model-value="target === 'start' ? store.startDate : store.endDate"
      @update:model-value="
        target === 'start' ? (store.startDate = $event) : (store.endDate = $event)
      "
      @close="showDatePicker = false"
      @clear-all-dates="clearDates"
    />
  </div>
</template>
