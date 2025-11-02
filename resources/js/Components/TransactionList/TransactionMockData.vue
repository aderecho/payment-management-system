<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios'; 
//Transaction Table import
import TransactionDataCell from './TransactionDataCell.vue';
import TransactionStatusCell from './TransactionStatusCell.vue';
//Modals
import PaymentDetailsModal from '../Modals/PaymentDetailsModal.vue';
import StatusUpdateModal from '../Modals/StatusUpdateModal.vue';
import ConfirmationModal from '../Modals/ConfirmationModal.vue'; 
//DatePicker Component
import DatePicker from './DatePicker.vue'; 
import SVG from '../SVG.vue';
//Mock Data
import { MOCK_TRANSACTION_DATA } from '@/MockData.js'; 


//receipt
import ViewDetails from './ViewDetails.vue' // View Details modal import

const showViewDetailsModal = ref(false)
const selectedViewDetails = ref({})

const openViewDetailsModal = (transaction) => {
  selectedViewDetails.value = transaction
  showViewDetailsModal.value = true
}

const closeViewDetailsModal = () => {
  showViewDetailsModal.value = false
  selectedViewDetails.value = {}
}


// ---------------------------------
const mockTransactions = MOCK_TRANSACTION_DATA;

// --- DYNAMIC DATA MANAGEMENT (Mock Data Loading) ---
const transactions = ref([]); 
const isLoading = ref(true); 
const fetchError = ref(null); 

const loadMockTransactions = () => {
    // 💡 Tip: To simulate persistence for development, check and load from localStorage here.
    const savedData = localStorage.getItem('mockTransactions');
    if (savedData) {
        transactions.value = JSON.parse(savedData);
    } else {
        transactions.value = MOCK_TRANSACTION_DATA; 
    }
    
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
};

onMounted(() => {
    loadMockTransactions();
});
// -------------------------------


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
    }, 500);
});
// -------------------------


// --- DATE PICKER LOGIC (REFACTORED) ---
const startDate = ref(''); // Stores YYYY-MM-DD
const endDate = ref('');   // Stores YYYY-MM-DD
const showDatePicker = ref(false); 
const datePickerTarget = ref(null); // 'start' or 'end'
const datePickerRef = ref(null); // Reference to the DatePicker component

const MIN_YEAR_WITH_DATA = computed(() => {
    if (!transactions.value.length) return new Date().getFullYear(); 

    let oldestYear = new Date().getFullYear();

    transactions.value.forEach(transaction => {
        const parts = transaction.date.split('/'); // Assuming MM/DD/YYYY
        if (parts.length === 3) {
            const year = parseInt(parts[2]);
            if (year < oldestYear) {
                oldestYear = year;
            }
        }
    });
    return oldestYear;
});


const openDatePicker = (target) => {
    datePickerTarget.value = target;
    showDatePicker.value = true;

    // Wait for the modal to render, then initialize the date state inside DatePicker
    // The initializePickerDate method is exposed via defineExpose in DatePicker.vue
    setTimeout(() => {
        if (datePickerRef.value) {
            datePickerRef.value.initializePickerDate();
        }
    }, 0);
};

const handleDateClear = () => {
    startDate.value = '';
    endDate.value = '';
    showDatePicker.value = false;
};

const displayDate = (dateModel) => {
    if (!dateModel) return '';
    const parts = dateModel.split('-'); // YYYY-MM-DD
    if (parts.length === 3) {
        return `${parts[1]}/${parts[2]}/${parts[0]}`; // MM/DD/YYYY
    }
    return dateModel;
};
// ------------------------------------


// Modal States
const showDetailsModal = ref(false); 
const selectedTransaction = ref({}); 
const showStatusUpdateModal = ref(false); 
const selectedStatusTransaction = ref({}); 

// NEW: State for Confirmation/Toast
const showConfirmationModal = ref(false);
const confirmationMessage = ref('');
const transactionToUpdate = ref(null); // Stores the transaction details before the final update

const headers = [
    'OR No.',
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
    // Month is 0-indexed in Date constructor (parts[0] is MM, so -1)
    return new Date(parts[2], parts[0] - 1, parts[1]); 
};

// =========================================================================
// COMPUTED PROPERTY FOR SORTING AND FILTERING (FIXED LOGIC HERE)
// =========================================================================
const sortedTransactions = computed(() => {
    if (!transactions.value.length) return [];
    
    const list = [...transactions.value]; 
    
    list.sort((a, b) => {
        const dateA = toDate(a.date);
        const dateB = toDate(b.date);
        return dateB.getTime() - dateA.getTime(); 
    });

    return list;
});

const filteredTransactions = computed(() => {
    const query = debouncedSearchQuery.value.toLowerCase().trim();
    const isStartDateSelected = !!startDate.value;
    const isEndDateSelected = !!endDate.value;
    
    const sourceList = sortedTransactions.value; 
    let results = sourceList;

    const isDateRangeFilterActive = isStartDateSelected && isEndDateSelected;

    if (isDateRangeFilterActive) {
        const startFilterDate = new Date(startDate.value);
        let endFilterDate = new Date(endDate.value);
        
        endFilterDate.setHours(23, 59, 59, 999);

        results = results.filter(transaction => {
            const transactionDate = toDate(transaction.date);
            
            return transactionDate >= startFilterDate && transactionDate <= endFilterDate;
        });
    }

    if (query) {
        // -----------------------------------------------------------
        // FIX: Enforce whole-word match for "cash" 
        const isCashSearch = query === 'cash';

        results = results.filter(transaction => {
            
            // 1. Specific handling for the EXACT query 'cash'
            if (isCashSearch) {
                // Return TRUE only if the paymentMethod is EXACTLY 'Cash' (case-insensitive)
                return transaction.paymentMethod.toLowerCase() === 'cash';
            }
            
            // 2. General search logic (for all other fields/queries)
            return Object.values(transaction).some(val => {
                // Standard includes check for all other fields/queries
                return String(val).toLowerCase().includes(query);
            });
        });
        // -----------------------------------------------------------
    }

    return results;
});

// =========================================================================
// MODAL AND UPDATE LOGIC
// =========================================================================

// Modal Functions (Keep existing)
const openPaymentDetailsModal = (transaction) => {
    selectedTransaction.value = transaction;
    showDetailsModal.value = true;
};

const closePaymentDetailsModal = () => {
    showDetailsModal.value = false;
    selectedTransaction.value = {}; 
};

const handleModalPrint = (details) => {
    console.log("Parent received print request for:", details.referenceCode);
    alert(`Initiating print for transaction: ${details.referenceCode}`);
};

const openStatusUpdateModal = (transaction) => {
    selectedStatusTransaction.value = {
        ...transaction,
        studentName: transaction.studentName,
        course: transaction.course || 'N/A', 
    };
    showStatusUpdateModal.value = true;
};

const closeStatusUpdateModal = () => {
    showStatusUpdateModal.value = false;
    selectedStatusTransaction.value = {};
    transactionToUpdate.value = null; // Clear update data
};

// --- NEW STATUS UPDATE LOGIC ---
const handleStatusUpdate = (details) => {
    // 1. Store the details from the modal and close the modal
    transactionToUpdate.value = details;
    closeStatusUpdateModal();

    // Confirmation Modal
    // NOTE: The modal should pass the newStatus, assuming StatusUpdateModal was also updated
    confirmationMessage.value = `Confirm update status for ${details.studentName} (Ref: ${details.referenceCode}) to ${details.newStatus}?`;
    showConfirmationModal.value = true;
};

const confirmUpdate = () => {
    if (!transactionToUpdate.value) return;

    // Use 'newStatus' from the emitted payload
    const { referenceCode, newStatus } = transactionToUpdate.value; 

    // 1. Find the index of the transaction to update
    const index = transactions.value.findIndex(t => t.referenceCode === referenceCode);

    if (index !== -1) {
        // 2. Update the status on the local reactive array
        // NOTE: This uses the direct index to ensure reactivity.
        transactions.value[index].status = newStatus;
        
        // 3. Save the updated mock data to local storage for persistence (optional mock-persistence)
        localStorage.setItem('mockTransactions', JSON.stringify(transactions.value));

        console.log(`Status of ${referenceCode} updated to ${newStatus}`);

        // 4. Optionally provide user feedback (e.g., a simple alert or a toast)
        alert(`SUCCESS: Transaction ${referenceCode} is now ${newStatus}.`);

    } else {
        alert(`ERROR: Could not find transaction with reference code ${referenceCode}.`);
    }

    // 5. Close confirmation and reset state
    showConfirmationModal.value = true;
    transactionToUpdate.value = null;
};

const cancelUpdate = () => {
    showConfirmationModal.value = false;
    transactionToUpdate.value = null;
    // alert('Status update cancelled.');
};




</script>

<template>
    <div class="bg-white p-5 rounded-lg shadow-xl">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2  mt-0.1">
            <h1 class="text-3xl font-extrabold text-gray-900 leading-tight shrink-0">Transaction List</h1> 

            <div class="flex flex-wrap items-end gap-x-4 gap-y-3 flex-grow justify-end min-w-0">
                
                <div class="flex flex-col items-start w-[135px]">
                    <label for="start-date" class="text-xs font-semibold text-gray-700 mb-1">From</label>
                    <div class="relative w-full">
                        <input 
                            type="text" 
                            id="start-date" 
                            :value="displayDate(startDate)" 
                            @click="openDatePicker('start')" 
                            placeholder="mm/dd/yyyy"
                            readonly
                            class="appearance-none pr-10 pl-3 py-2 border border-gray-300 rounded-md w-full text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 cursor-pointer"
                            aria-label="Start Date"
                        >
                        <i class="fa-solid fa-calendar-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>
                
                <div class="flex flex-col items-start w-[135px]">
                    <label for="end-date" class="text-xs font-semibold text-gray-700 mb-1">To</label>
                    <div class="relative w-full">
                        <input 
                            type="text" 
                            id="end-date" 
                            :value="displayDate(endDate)"
                            @click="openDatePicker('end')" 
                            placeholder="mm/dd/yyyy"
                            readonly
                            class="appearance-none pr-10 pl-3 py-2 border border-gray-300 rounded-md w-full text-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 cursor-pointer"
                            aria-label="End Date"
                        >
                        <i class="fa-solid fa-calendar-alt absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                </div>

                <div class="relative w-[268px] sm:max-w-xs md:max-w-[300px]">
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

        <DatePicker 
            v-if="showDatePicker"
            ref="datePickerRef"
            :model-value="datePickerTarget === 'start' ? startDate : endDate"
            @update:model-value="datePickerTarget === 'start' ? (startDate = $event) : (endDate = $event)"
            :target="datePickerTarget"
            :min-year-with-data="MIN_YEAR_WITH_DATA"
            @close="showDatePicker = false"
            @clear-all-dates="handleDateClear"
        />
        
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
                    <tr v-else v-for="(transaction, index) in filteredTransactions" :key="transaction.referenceCode">
                        <TransactionDataCell :value="index + 1" />
                        <TransactionDataCell :value="transaction.campusId" />
                        <TransactionDataCell :value="transaction.studentName" />
                        <TransactionDataCell :value="transaction.referenceCode" />
                        <TransactionDataCell :value="transaction.paymentMethod" />
                        <TransactionDataCell :value="transaction.transactionType" />
                        <TransactionDataCell :value="transaction.date" />
                        
                        <TransactionStatusCell :status="transaction.status" />
                        
                        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium flex space-x-2">
                            

                            <!-- 👁 VIEW DETAILS (Opens New Modal) -->
                            <button
                                @click="openViewDetailsModal(transaction)"
                                class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-normal py-1.5 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 12 19.5 1.5 12 1.5 12z" />
                                <circle cx="12" cy="12" r="3" />
                                </svg>
                                View
                            </button>

                            <!-- ⚙️ UPDATE STATUS -->
                            <button
                                @click="openStatusUpdateModal(transaction)"
                                class="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-normal py-1.5 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md"
                            >
                                <i class="fa-solid fa-edit mr-1"></i>
                                Update
                            </button>
                            <!-- 🧾 RECEIPT (Print Icon) -->
                            <button
                                @click="openPaymentDetailsModal(transaction)"
                                class="bg-green-900 hover:bg-green-700 text-white text-xs font-normal py-1.5 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7M6 18h12M6 14h12m-6 8v-4" />
                                </svg>
                                Receipt
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
        
            <div class="flex justify-end mt-3.5">
                <button class="flex items-center rounded-lg shadow-lg py-1 px-3 bg-brand-maroon hover:bg-brand-maroon-hover text-white text-xs font-semibold transition duration-150">
                   <span>Generate Report</span>
                     <SVG icon-name="Print" container-class="ml-1 mb-2 h-4 text-white flex items-center"> </SVG>
                </button>
             </div>
         </div>
           
    <PaymentDetailsModal 
        :show="showDetailsModal" 
        :paymentDetails="selectedTransaction" 
        @close="closePaymentDetailsModal"
        @print="handleModalPrint"
    />
    <ViewDetails
  :show="showViewDetailsModal"
  :details="selectedViewDetails"
  @close="closeViewDetailsModal"
/>

    <StatusUpdateModal 
        :show="showStatusUpdateModal" 
        :statusDetails="selectedStatusTransaction" 
        @close="closeStatusUpdateModal"
        @confirm-update="handleStatusUpdate"/>
        <!-- @print="handleReportModalPrint"  -->

    <ConfirmationModal
        :show="showConfirmationModal"
        :message="confirmationMessage"
        confirm-text="Yes, Update"
        cancel-text="No, Cancel"
        @confirm="confirmUpdate"
        @cancel="cancelUpdate"
    />
</template>