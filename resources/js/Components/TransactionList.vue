<template>
    <div class="bg-white p-5 rounded-lg shadow-xl">
        <h1 class="text-2xl font-bold mb-4 text-gray-800">Transaction List</h1>

        <div class="flex flex-wrap items-center justify-end gap-4 mb-4">
            <div class="flex items-center space-x-2">
                <label for="date-select" class="text-sm font-medium text-gray-600">Select date:</label>
                <!-- <i class="fa-solid fa-calendar-alt text-gray-500"></i> -->
                <input type="date" id="date-select" v-model="selectedDate" class="p-1.5 border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div class="relative flex-grow max-w-xs">
                <input type="search" v-model="searchQuery" placeholder="Search..." class="p-1.5 pl-3 border border-gray-300 rounded-lg w-full text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500">
                <i class="fa-solid fa-search absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></i>
            </div>

            <button @click="searchTransactions" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-lg text-sm transition duration-150">
                Search
            </button>
        </div>

        <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th v-for="header in headers" :key="header" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {{ header }}
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="transaction in transactions" :key="transaction.referenceCode">
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ transaction.campusId }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ transaction.studentName }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ transaction.referenceCode }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ transaction.paymentMethod }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ transaction.transactionType }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ transaction.date }}</td>
                        <td class="px-4 py-3 whitespace-nowrap">
                            <span :class="getStatusClasses(transaction.status)">
                                {{ transaction.status }}
                            </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                            <button class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-normal py-1 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md">
                                View <i class="fa-solid fa-eye ml-1"></i>
                            </button>
                            <button class="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-normal py-1 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md">
                                Report <i class="fa-solid fa-file-invoice ml-1"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const selectedDate = ref('');

const headers = [
    'Campus Id',
    'Student Name',
    'Reference Code',
    'Payment Method',
    'Transaction Type',
    'Date',
    'Status',
    'Action'
];

const transactions = ref([
    { campusId: '202500001', studentName: 'Anthony Derecho', referenceCode: 'xyz123AFC', paymentMethod: 'Maya', transactionType: 'Tuition Fee', date: '07/23/2025', status: 'Posted' },
    { campusId: '202500001', studentName: 'Anthony Derecho', referenceCode: 'xyz123AFC', paymentMethod: 'Maya', transactionType: 'Tuition Fee', date: '07/23/2025', status: 'Floating' },
]);

const getStatusClasses = (status) => {
    switch (status) {
        case 'Posted':
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800';
        case 'Floating':
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800';
        default:
            return 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800';
    }
};

const searchTransactions = () => {
    console.log('Search executed with query:', searchQuery.value, 'and date:', selectedDate.value);
};
</script>