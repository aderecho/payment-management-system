<script setup>
// MODIFIED IMPORTS: Added onMounted and imported axios
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios'; 

//Transaction Table import
import TransactionDataCell from './TransactionDataCell.vue';
import TransactionStatusCell from './TransactionStatusCell.vue';

import PaymentDetailsModal from './PaymentDetailsModal.vue';
import ReportsModal from './ReportsModal.vue';


// --- DEBOUNCING LOGIC ---
const searchQuery = ref('');
const debouncedSearchQuery = ref(''); 
let searchTimeout = null;

watch(searchQuery, (newQuery) => {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(() => {
        debouncedSearchQuery.value = newQuery;
    }, 500); // 300ms delay
});
// -------------------------


// --- DYNAMIC DATA MANAGEMENT ---
// MODIFIED: Initialize transactions as an empty array
const transactions = ref([]); 
// ADDED: State for API call status
const isLoading = ref(true); 
const fetchError = ref(null); 

// ADDED: Function to fetch data dynamically using Axios
const fetchTransactions = async () => {
    // 🚨 IMPORTANT: Replace this URL with your actual API endpoint
    const API_URL = 'http://your-backend-api.com/transactions'; 

    isLoading.value = true;
    fetchError.value = null;

    try {
        const response = await axios.get(API_URL);
        // Axios wraps the response data in the 'data' property
        transactions.value = response.data; 
    } catch (error) {
        console.error("Failed to fetch transactions:", error);
        fetchError.value = 'Failed to load transactions. Please check the network or API endpoint.';
        transactions.value = [];
    } finally {
        isLoading.value = false;
    }
};

// ADDED: Call the fetch function when the component is mounted
onMounted(() => {
    fetchTransactions();
});
// -------------------------------


// Date - Changed to two reactive variables for the date range
const startDate = ref('');
const endDate = ref('');
//Payment Details Modal
const showDetailsModal = ref(false); // State to control modal visibility
const selectedTransaction = ref({}); // State to hold the data for the modal
//Reports Modal
const showReportsModal = ref(false); // State to control Reports modal visibility
const selectedReportTransaction = ref({}); // State to hold data for Reports modal

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

// Helper function to convert the transaction date format ('MM/DD/YYYY') to a Date object
const toDate = (dateString) => {
    const parts = dateString.split('/');
    // Date constructor expects year, month (0-11), day
    return new Date(parts[2], parts[0] - 1, parts[1]);
};

// =========================================================================
// COMPUTED PROPERTY FOR SORTING
// =========================================================================
const sortedTransactions = computed(() => {
    // Only attempt to sort if data is present
    if (!transactions.value.length) return [];
    
    const list = [...transactions.value]; 
    
    list.sort((a, b) => {
        const dateA = toDate(a.date);
        const dateB = toDate(b.date);
        return dateB.getTime() - dateA.getTime();
    });

    return list;
});

// =========================================================================
// COMPUTED PROPERTY FOR FILTERING
// =========================================================================
const filteredTransactions = computed(() => {
    // MODIFIED: Use the debounced search query
    const query = debouncedSearchQuery.value.toLowerCase().trim();
    const hasDateRangeSelected = startDate.value && endDate.value;
    
    const sourceList = sortedTransactions.value; 

    const startFilterDate = startDate.value ? new Date(startDate.value) : null;
    const endFilterDate = endDate.value ? new Date(endDate.value) : null;
    
    if (endFilterDate) {
        endFilterDate.setHours(23, 59, 59, 999);
    }

    return sourceList.filter(transaction => {
        let matchesQuery = true;
        let matchesDateRange = true;

        // --- Date Range Filter Logic (Only applies if both dates are selected) ---
        if (hasDateRangeSelected) {
            const transactionDate = toDate(transaction.date);

            if (startFilterDate && transactionDate < startFilterDate) {
                matchesDateRange = false;
            }
            
            if (endFilterDate && transactionDate > endFilterDate) {
                matchesDateRange = false;
            }
        }

        // --- Search Query Filter Logic ---
        if (query) {
            matchesQuery = Object.values(transaction).some(val => 
                String(val).toLowerCase().includes(query)
            );
        }

        if (hasDateRangeSelected) {
            return matchesQuery && matchesDateRange;
        } 
        
        return matchesQuery; 
    });
});

// Payment Details Modal
// Function to open the modal with specific transaction details
const openPaymentDetailsModal = (transaction) => {
    selectedTransaction.value = transaction;
    showDetailsModal.value = true;
};

// Function to close the modal
const closePaymentDetailsModal = () => {
    showDetailsModal.value = false;
    selectedTransaction.value = {}; // Clear data on close
};

// Function to handle the print event from the modal
const handleModalPrint = (details) => {
    console.log("Parent received print request for:", details.referenceCode);
    alert(`Initiating print for transaction: ${details.referenceCode}`);
};
//Reports Modal
const openReportsModal = (transaction) => {
    // Map keys if needed, similar to openPaymentDetailsModal
    selectedReportTransaction.value = {
        ...transaction,
        studentName: transaction.studentName, // Assuming the transaction object already has this
        course: transaction.course || 'N/A', // Add fallback for course
    };
    showReportsModal.value = true;
};

const closeReportsModal = () => {
    showReportsModal.value = false;
    selectedReportTransaction.value = {};
};

const handleReportModalPrint = (details) => {
    console.log("Parent received print request for report:", details.referenceCode);
    alert(`Initiating print for report transaction: ${details.referenceCode}`);
};
</script>

<template>
    <div class="bg-white p-5 rounded-lg shadow-xl">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 px-4">
    <h1 class="text-3xl font-extrabold text-gray-900 leading-tight shrink-0">Transaction List</h1> 

    <div class="flex flex-wrap items-end gap-x-4 gap-y-3 flex-grow justify-end min-w-0">
        <div class="flex flex-col items-start min-w-[140px]">
            <label for="start-date" class="text-xs font-semibold text-gray-700 mb-1">From</label>
            <div class="relative w-full">
                <input 
                    type="date" 
                    id="start-date" 
                    v-model="startDate" 
                    class="appearance-none pr-3 pl-3 py-2 border border-gray-300 rounded-md w-full text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 cursor-pointer"
                    aria-label="Start Date"
                >
                <i class="fa-calendar-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
        </div>
        
        <div class="flex flex-col items-start min-w-[140px]">
            <label for="end-date" class="text-xs font-semibold text-gray-700 mb-1">To</label>
            <div class="relative w-full">
                <input 
                    type="date" 
                    id="end-date" 
                    v-model="endDate" 
                    :min="startDate" 
                    class="appearance-none pr-3 pl-3 py-2 border border-gray-300 rounded-md w-full text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 cursor-pointer"
                    aria-label="End Date"
                >
                <i class=" fa-calendar-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
            </div>
        </div>

        <div class="relative flex-grow max-w-[250px] sm:max-w-xs md:max-w-[300px]">
             <label for="search-input" class="sr-only">Search Transactions</label>
            <input 
                type="search" 
                id="search-input"
                v-model="searchQuery" 
                placeholder="Search by ID, Name, Ref Code..." 
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                aria-label="Search transactions"
            >
            <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
    </div>
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
                    <tr v-if="isLoading">
                        <td :colspan="headers.length" class="px-4 py-8 text-center text-gray-500 text-base">
                            Loading transactions...
                        </td>
                    </tr>
                    <tr v-else-if="fetchError">
                        <td :colspan="headers.length" class="px-4 py-8 text-center text-red-500 text-base">
                            {{ fetchError }}
                        </td>
                    </tr>
                    <tr v-else v-for="transaction in filteredTransactions" :key="transaction.referenceCode">
                        <TransactionDataCell :value="transaction.campusId" />
                        <TransactionDataCell :value="transaction.studentName" />
                        <TransactionDataCell :value="transaction.referenceCode" />
                        <TransactionDataCell :value="transaction.paymentMethod" />
                        <TransactionDataCell :value="transaction.transactionType" />
                        <TransactionDataCell :value="transaction.date" />
                        
                        <TransactionStatusCell :status="transaction.status" />
                        
                        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                            
                            <button 
                                    @click="openPaymentDetailsModal(transaction)" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-normal py-1 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md">
                                    
                                    View <i class="fa-solid fa-eye ml-1"></i>
                            </button>

                           <button @click="openReportsModal(transaction)" class="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-normal py-1 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md">
    Report <i class="fa-solid fa-file-invoice ml-1"></i>
</button>

                        </td>
                    </tr>
                    <tr v-if="!isLoading && !fetchError && filteredTransactions.length === 0">
                        <td :colspan="headers.length" class="px-4 py-8 text-center text-gray-500 text-base">
                            No transactions found for the selected filter/date.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
         <PaymentDetailsModal 
        :show="showDetailsModal" 
        :paymentDetails="selectedTransaction" 
        @close="closePaymentDetailsModal"
        @print="handleModalPrint"
    />
    <ReportsModal 
    :show="showReportsModal" 
    :reportDetails="selectedReportTransaction" 
    @close="closeReportsModal"
    @print="handleReportModalPrint"
/>
</template>