<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios'; 

//Transaction Table import
import TransactionDataCell from './TransactionDataCell.vue';
import TransactionStatusCell from './TransactionStatusCell.vue';

//Modals
import PaymentDetailsModal from './PaymentDetailsModal.vue';
import StatusUpdateModal from './StatusUpdateModal.vue';
// Create confirmation Modal before updating the STATUS
import ConfirmationModal from './ConfirmationModal.vue'; 

//DatePicker Component
import DatePicker from './DatePicker.vue'; 


// --- MOCK USER/TRANSACTION DATA ---
const MOCK_TRANSACTION_DATA = [
    {
        campusId: 'C1001',
        studentName: 'Alice Johnson',
        referenceCode: 'REF-001234',
        paymentMethod: 'Bank',
        transactionType: 'Tuition Fee',
        amount: 25000.00,
        date: '10/05/2025', // MM/DD/YYYY format
        status: 'Posted',
        course: 'BS Computer Science',
        yearLevel: '4th Year', 
        schoolYear: '2025-2026', 
        details: 'Full tuition payment for Fall 2025 semester.',
        processedBy: 'Admin User 1'
    },
    {
        campusId: 'C1005',
        studentName: 'Bob Smith',
        referenceCode: 'REF-001235',
        paymentMethod: 'Cash', // Matches "Cash"
        transactionType: 'Miscellanous Fee',
        amount: 550.50,
        date: '10/04/2025',
        status: 'Floating',
        course: 'BA English Literature',
        yearLevel: '2nd Year', 
        schoolYear: '2025-2026', 
        details: 'Payment for library late return fees.',
        processedBy: 'Admin User 2'
    },
    {
        campusId: 'C1010',
        studentName: 'Charlie Brown',
        referenceCode: 'REF-001236',
        paymentMethod: 'Bank',
        transactionType: 'Tuition Fee',
        amount: 15000.00,
        date: '10/03/2025',
        status: 'Cancelled',
        course: 'BSc Biology',
        yearLevel: '3rd Year', 
        schoolYear: '2024-2025', 
        details: 'Partial tuition fee payment.',
        processedBy: 'Admin User 3'
    },
    
    {
        campusId: 'C1022',
        studentName: 'Dana Scully',
        referenceCode: 'REF-001237',
        paymentMethod: 'Maya',
        transactionType: 'Books',
        amount: 1200.75,
        date: '09/30/2025',
        status: 'Pending',
        course: 'MS Physics',
        yearLevel: '1st Year Grad', 
        schoolYear: '2025-2026', 
        details: 'Purchase of required textbooks.',
        processedBy: 'Admin User 1'
    },
    {
        campusId: 'C1033',
        studentName: 'Fox Mulder',
        referenceCode: 'REF-001238',
        paymentMethod: 'Gcash', // Should NOT match "Cash"
        transactionType: 'Tuition Fee',
        amount: 8000.00,
        date: '09/28/2025',
        status: 'Posted',
        course: 'PhD Paranormal Studies',
        yearLevel: '2nd Year Grad', 
        schoolYear: '2025-2026', 
        details: 'Installment payment.',
        processedBy: 'Admin User 4'
    },
    {
        campusId: 'C1044',
        studentName: 'Eliza Thorne',
        referenceCode: 'REF-001239',
        paymentMethod: 'Bank',
        transactionType: 'Tuition Fee',
        amount: 32000.00,
        date: '08/15/2025', // August 2025
        status: 'Pending',
        course: 'BFA Digital Arts',
        yearLevel: '1st Year', 
        schoolYear: '2025-2026', 
        details: 'Full tuition for the academic year.',
        processedBy: 'Admin User 5'
    },
    {
        campusId: 'C1055',
        studentName: 'Gary Oldman',
        referenceCode: 'REF-001240',
        paymentMethod: 'Cash',
        transactionType: 'ID Replacement',
        amount: 350.00,
        date: '10/20/2025', // Latest Date
        status: 'Floating',
        course: 'BS Chemistry',
        yearLevel: '3rd Year', 
        schoolYear: '2025-2026', 
        details: 'Fee for new student ID card.',
        processedBy: 'Admin User 2'
    },
    
    {
        campusId: 'C1077',
        studentName: 'Ian Malcolm',
        referenceCode: 'REF-001242',
        paymentMethod: 'Gcash',
        transactionType: 'Dormitory Fee',
        amount: 9500.00,
        date: '07/10/2025',
        status: 'Cancelled',
        course: 'PhD Mathematics',
        yearLevel: '3rd Year Grad', 
        schoolYear: '2025-2026', 
        details: 'Monthly dormitory payment (later cancelled).',
        processedBy: 'Admin User 1'
    },
    {
        campusId: 'C1088',
        studentName: 'Jane Foster',
        referenceCode: 'REF-001243',
        paymentMethod: 'Maya',
        transactionType: 'Tuition Fee',
        amount: 18000.00,
        date: '09/01/2025',
        status: 'Cancelled',
        course: 'MS Astrophysics',
        yearLevel: '1st Year Grad', 
        schoolYear: '2025-2026', 
        details: 'Second tuition installment.',
        processedBy: 'Admin User 4'
    },

];
// ---------------------------------


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
const showReportsModal = ref(false); 
const selectedReportTransaction = ref({}); 

// NEW: State for Confirmation/Toast
const showConfirmationModal = ref(false);
const confirmationMessage = ref('');
const transactionToUpdate = ref(null); // Stores the transaction details before the final update

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
            // Special case for "cash"
            if (isCashSearch) {
                // Only match if paymentMethod is EXACTLY 'Cash'
                if (transaction.paymentMethod.toLowerCase() === 'cash') {
                    return true;
                }
            }
            
            // General search logic (for all other fields/queries)
            return Object.values(transaction).some(val => {
                // If it's the cash search, skip checking paymentMethod here
                if (isCashSearch && String(val).toLowerCase() === 'cash') {
                    return false; // Already handled, or prevent re-checking
                }
                
                // Standard includes check for all other fields/queries
                return String(val).toLowerCase().includes(query);
            });
        });
        // -----------------------------------------------------------
    }

    return results;
});

// --- NEW COMPUTED PROPERTY: Total Amount of Filtered Transactions ---
const totalFilteredAmount = computed(() => {
    // Only sum transactions that are *not* 'Cancelled' 
    // This assumes only 'Posted', 'Floating', 'Pending' contribute to the "total" revenue.
    return filteredTransactions.value.reduce((sum, transaction) => {
        if (transaction.status !== 'Cancelled') {
            return sum + transaction.amount;
        }
        return sum;
    }, 0);
});

// --- NEW UTILITY FUNCTION: Currency Formatting ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD', // Use your local currency code (e.g., 'PHP')
        minimumFractionDigits: 2
    }).format(amount);
};


// =========================================================================
// MODAL AND UPDATE LOGIC (Already correct from previous step)
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

const openReportsModal = (transaction) => {
    selectedReportTransaction.value = {
        ...transaction,
        studentName: transaction.studentName,
        course: transaction.course || 'N/A', 
    };
    showReportsModal.value = true;
};

const closeReportsModal = () => {
    showReportsModal.value = false;
    selectedReportTransaction.value = {};
    transactionToUpdate.value = null; // Clear update data
};

// --- NEW STATUS UPDATE LOGIC ---
const handleStatusUpdate = (details) => {
    // 1. Store the details from the modal and close the modal
    transactionToUpdate.value = details;
    closeReportsModal();

    // Confirmation Modal
    confirmationMessage.value = `Confirm update status for ${details.studentName} (Ref: ${details.referenceCode}) to **${details.editableStatus}**?`;
    showConfirmationModal.value = true;
};

const confirmUpdate = () => {
    if (!transactionToUpdate.value) return;

    const { referenceCode, editableStatus } = transactionToUpdate.value;

    // 1. Find the index of the transaction to update
    const index = transactions.value.findIndex(t => t.referenceCode === referenceCode);

    if (index !== -1) {
        // 2. Update the status on the local reactive array
        // NOTE: This uses the direct index to ensure reactivity.
        transactions.value[index].status = editableStatus;
        
        // 3. Save the updated mock data to local storage for persistence (optional mock-persistence)
        localStorage.setItem('mockTransactions', JSON.stringify(transactions.value));

        console.log(`Status of ${referenceCode} updated to ${editableStatus}`);

        // 4. Optionally provide user feedback (e.g., a simple alert or a toast)
        alert(`SUCCESS: Transaction ${referenceCode} is now ${editableStatus}.`);

    } else {
        alert(`ERROR: Could not find transaction with reference code ${referenceCode}.`);
    }

    // 5. Close confirmation and reset state
    showConfirmationModal.value = false;
    transactionToUpdate.value = null;
};

const cancelUpdate = () => {
    showConfirmationModal.value = false;
    transactionToUpdate.value = null;
    alert('Status update cancelled.');
};

// --- Keep existing print handler for the Report Modal (from StatusUpdateModal) ---
const handleReportModalPrint = (details) => {
    console.log("Parent received print request for report:", details.referenceCode);
    // The actual printing logic is handled inside StatusUpdateModal via handlePrint
};


</script>

<template>
    <div class="bg-white p-5 rounded-lg shadow-xl">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 px-4">
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
                                @click="openPaymentDetailsModal(transaction)" 
                                class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-normal py-1 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md">
                                
                                View <i class="fa-solid fa-eye ml-1"></i>
                            </button>

                            <button 
                                @click="openReportsModal(transaction)" 
                                class="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-normal py-1 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md">
                                Update <i class="fa-solid fas fa-edit ml-1"></i>
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

    <StatusUpdateModal 
        :show="showReportsModal" 
        :reportDetails="selectedReportTransaction" 
        @close="closeReportsModal"
        @confirm-update="handleStatusUpdate"
        @print="handleReportModalPrint" />

    <ConfirmationModal
        :show="showConfirmationModal"
        :message="confirmationMessage"
        confirm-text="Yes, Update"
        cancel-text="No, Cancel"
        @confirm="confirmUpdate"
        @cancel="cancelUpdate"
    />
</template>