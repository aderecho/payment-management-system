<script setup>
import { ref, computed } from 'vue';

//Transaction Table import
import TransactionDataCell from './TransactionDataCell.vue';
import TransactionStatusCell from './TransactionStatusCell.vue';

import PaymentDetailsModal from './PaymentDetailsModal.vue';



const searchQuery = ref('');
// Date - Changed to two reactive variables for the date range
const startDate = ref('');
const endDate = ref('');
//Modal
const showDetailsModal = ref(false); // State to control modal visibility
const selectedTransaction = ref({}); // State to hold the data for the modal


//
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

// NOTE: Added more diverse data for search/filter testing
const transactions = ref([
    { campusId: '202500001', studentName: 'John Doe', referenceCode: 'xyz123AFC', paymentMethod: 'Maya', transactionType: 'Tuition Fee', date: '07/23/2025', status: 'Posted', amount: 27500, yearLevel: 'First Year', schoolYear: '2025', course:"Computer Science"},
    { campusId: '202500002', studentName: 'Jane Smith', referenceCode: 'abc987ZYX', paymentMethod: 'Gcash', transactionType: 'Books', date: '07/23/2025', status: 'Floating', amount: 5000, yearLevel: 'Second Year', schoolYear: '2025' },
    { campusId: '202600010', studentName: 'Chris Johnson', referenceCode: 'DEF456GHI', paymentMethod: 'Bank', transactionType: 'Miscellaneous', date: '07/24/2025', status: 'Posted', amount: 1500, yearLevel: 'Third Year', schoolYear: '2026' },
    { campusId: '202500001', studentName: 'Bronny James', referenceCode: 'JKL012MNO', paymentMethod: 'Maya', transactionType: 'Tuition Fee', date: '07/25/2025', status: 'Floating', amount: 20000, yearLevel: 'First Year', schoolYear: '2025' },
    { campusId: '202500001', studentName: 'Michael Williams', referenceCode: 'JKL012MNO', paymentMethod: 'Cash', transactionType: 'Tuition Fee', date: '09/30/2025', status: 'Floating', amount: 30000, yearLevel: 'Fourth Year', schoolYear: '2025' },
]);

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
    const query = searchQuery.value.toLowerCase().trim();
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

// NOTE: If TransactionStatusCell is correctly set up, this function is redundant and should be removed.
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

</script>

<template>
    <div class="bg-white p-5 rounded-lg shadow-xl">

        <div class="flex  items-center justify-end gap-4 mb-4">
             <h1 class="text-2xl font-bold text-gray-800 shrink-0">Transaction List</h1>
            
            <div class="flex items-center gap-3 flex-grow justify-end min-w-0 ">
                <label for="start-date" class="text-sm font-medium text-gray-600">From:</label>
                <input 
                    type="date" 
                    id="start-date" 
                    v-model="startDate" 
                    class="p-1.5 border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
            </div>
            
            <div class="flex items-center space-x-2">
                <label for="end-date" class="text-sm font-medium text-gray-600">To:</label>
                <input 
                    type="date" 
                    id="end-date" 
                    v-model="endDate" 
                    :min="startDate" class="p-1.5 border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
            </div>

            <div class="relative flex-grow max-w-xs">
                <input type="search" v-model="searchQuery" placeholder="Search Campus ID, Name, Ref Code..." class="p-1.5 pl-3 border border-gray-300 rounded-lg w-full text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500">
                <i class="fa-solid fa-search absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"></i>
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
                    <tr v-for="transaction in filteredTransactions" :key="transaction.referenceCode">
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

                            <button class="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-normal py-1 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md">
                                Report <i class="fa-solid fa-file-invoice ml-1"></i>
                            </button>

                        </td>
                    </tr>
                    <tr v-if="filteredTransactions.length === 0">
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
</template>