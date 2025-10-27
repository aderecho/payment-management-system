<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'; 

// Define the template reference for the printable area
const printContentRef = ref(null);

const props = defineProps({
    // Prop to control visibility, received from the parent
    show: {
        type: Boolean,
        required: true
    },
    // Data to display in the modal, matching the fields in the image
    statusDetails: { // Renamed prop to statusDetails for clarity
        type: Object,
        default: () => ({
            campusId: '',
            studentName: '', 
            email: '',
            course: '',
            yearLevel: '',
            schoolYear: '',
            referenceCode: '',
            paymentMethod: '',
            transactionType: '',
            date: '',
            status: '',
            amount: 0,
        })
    }
});

// Define the event the component will emit to the parent to close itself AND update status
const emit = defineEmits(['close', 'print', 'update-status']); 

// Reactive variable for the status dropdown
const editableStatus = ref(props.statusDetails.status);

// List of available status options
const statusOptions = ['Pending', 'Floating', 'Posted', 'Cancelled'];

// Watch the prop status and update the local editable status when the modal opens/data changes
watch(() => props.statusDetails.status, (newStatus) => {
    editableStatus.value = newStatus;
});

// Watch the local editable status and emit an event to the parent on change
watch(editableStatus, (newStatus) => {
    // Only emit if the status has actually changed from the prop's initial value
    // This assumes the parent component will handle the API call to persist the change
    if (newStatus !== props.statusDetails.status) {
        emit('update-status', { 
            referenceCode: props.statusDetails.referenceCode,
            newStatus: newStatus 
        });
    }
});


// Function to handle the print action (NEW LOGIC)
const handlePrint = () => {
    const divToPrint = printContentRef.value;
    
    if (divToPrint) {
        // 1. Open a new window
        const newwin = window.open("");

        // 2. Write the content of the print area to the new window's document
        // Includes basic styling for better print formatting
        newwin.document.write('<html><head><title>Payment Report</title>');
        newwin.document.write('<style>');
        newwin.document.write(`
            body { font-family: sans-serif; padding: 20px; } 
            .print-area { max-width: 400px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; } 
            h3 { text-align: center; margin-bottom: 20px; } 
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; } 
            .key { font-weight: bold; margin-right: 15px; } 
            .status-badge { 
                display: inline-block; 
                padding: 4px 8px; 
                border-radius: 9999px; 
                font-size: 12px; 
                font-weight: 600; 
                text-align: center;
                min-width: 80px; /* Ensure consistent width for badges */
            } 
            .bg-green-200 { background-color: #d1fae5; color: #065f46; } 
            .bg-yellow-200 { background-color: #fef3c7; color: #92400e; } /* Used for Floating */
            .bg-red-200 { background-color: #fee2e2; color: #991b1b; } 
            .bg-gray-200 { background-color: #e5e7eb; color: #374151; } /* 👈 ADDED GRAY FOR PRINT */
            .amount-value { font-size: 1.25rem; font-weight: bold; } 
            @media print { .no-print { display: none !important; } }
        `);
        newwin.document.write('</style>');
        newwin.document.write('</head><body>');
        newwin.document.write(divToPrint.innerHTML); // Write the inner content
        newwin.document.write('</body></html>');
        newwin.document.close();

        // 3. Print the new window
        newwin.print();
        
    } else {
        console.error("Print area not found.");
    }

    emit('print', props.statusDetails); // Still emit for parent tracking
    console.log("Printing report initiated for:", props.statusDetails.referenceCode);
};

// Helper function to format the amount
const formatAmount = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '₱0.00';
    return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Computed property for the detail items to ensure reactivity
const detailItems = computed(() => [
    { key: 'Campus ID', value: props.statusDetails.campusId },
    { key: 'Name', value: props.statusDetails.studentName },
    { key: 'Email', value: props.statusDetails.email },
    { key: 'Course', value: props.statusDetails.course || 'N/A' }, // Added fallback for missing course data
    { key: 'Year Level', value: props.statusDetails.yearLevel },
    { key: 'School Year', value: props.statusDetails.schoolYear },
    { key: 'Reference Code', value: props.statusDetails.referenceCode },
    { key: 'Payment Method', value: props.statusDetails.paymentMethod },
    { key: 'Transaction Type', value: props.statusDetails.transactionType },
    { key: 'Date', value: props.statusDetails.date },
]);
</script>
<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-1 bg-gray-900 bg-opacity-50">
        
        <div ref="printContentRef" class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6  transform transition-all duration-300 scale-100 opacity-100 md:h-[34rem]">
            
            <div class="flex justify-between items-center mb-1 pb-2 border-b no-print">
                <h3 class="text-xl font-bold text-gray-800">Status</h3> 
                <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fa-solid fa-times text-xl"></i>
                </button>
            </div>

            <h3 class="no-print:hidden text-2xl font-bold text-gray-800 text-center mb-1">Update Status</h3>
            
            <div class="space-y-3 text-sm text-gray-700">
                
                <div v-for="item in detailItems" :key="item.key" class="flex justify-between detail-row">
                    <p class="font-bold mr-4 key">{{ item.key }}:</p>
                    <p class="text-right">{{ item.value || '-' }}</p> 
                </div>
                
                <div class="flex justify-between detail-row">
                    <p class="font-bold mr-4 key">Status:</p>
                    
                    
<p class="text-right no-print">
                        <select
                            v-model="editableStatus"
                            :class="{
                                'bg-green-200 text-green-800': editableStatus === 'Posted',
                                'bg-yellow-200 text-yellow-800': editableStatus === 'Floating', // Only Floating is Yellow
                                'bg-gray-200 text-gray-800': editableStatus === 'Pending', // 👈 Pending is Gray
                                'bg-red-200 text-red-800': editableStatus === 'Cancelled',
                            }"
                            class="appearance-none pr-6 pl-2 py-0.5 rounded-full text-xs font-semibold 
                                    focus:ring-blue-500 focus:border-blue-500 transition duration-150 border-none cursor-pointer"
                        >
                            <option 
                                v-for="option in statusOptions" 
                                :key="option" 
                                :value="option"
                                :class="{
                                    // These classes might not apply visually to actual options in all browsers
                                    'bg-green-100 text-green-800': option === 'Posted',
                                    'bg-yellow-100 text-yellow-800': option === 'Floating', // Only Floating is Yellow
                                    'bg-gray-100 text-gray-800': option === 'Pending', // 👈 Pending is Gray
                                    'bg-red-100 text-red-800': option === 'Cancelled',
                                }"
                            >
                                {{ option }}
                            </option>
                        </select>
                    </p>

                    
<p class="text-right hidden no-print:inline">
                        <span 
                            :class="{
                                'bg-green-200 text-green-800': statusDetails.status === 'Posted',
                                'bg-yellow-200 text-yellow-800': statusDetails.status === 'Floating', // Only Floating is Yellow
                                'bg-gray-200 text-gray-800': statusDetails.status === 'Pending', // 👈 Pending is Gray
                                'bg-red-200 text-red-800': statusDetails.status === 'Cancelled',
                            }"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold status-badge"
                        >
                            {{ statusDetails.status || 'N/A' }}
                        </span>
                    </p>
                </div>

                <div class="flex justify-between pt-2 detail-row">
                    <p class="font-bold mr-4 key">Amount:</p>
                    <p class="font-bold text-lg text-gray-900 amount-value">{{ formatAmount(statusDetails.amount) }}</p>
                </div>

            </div>
            
            <div class="mt-5 flex justify-end">
                <button 
                        @click="$emit('confirm-update', statusDetails)"
                        class="bg-custom-green-dark hover:bg-custom-green-dark-hover text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-150"
                        >
                        Update 
                </button>
            </div>

        </div>
    </div>
</template>