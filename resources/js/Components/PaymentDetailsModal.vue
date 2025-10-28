<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'; // 👈 Import 'ref' for template reference
import '@fortawesome/fontawesome-free/css/all.min.css'; 

// Define the template reference for the printable area
const printContentRef = ref(null);

const props = defineProps({
    // Prop to control visibility, received from the parent
    show: {
        type: Boolean,
        required: true
    },
    // Data to display in the modal, matching the fields in the image
    paymentDetails: {
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
            // status: '',
            amount: 0,
        })
    }
});

// Define the event the component will emit to the parent to close itself
const emit = defineEmits(['close', 'print']);

// Function to handle the print action (NEW LOGIC)
const handlePrint = () => {
    const divToPrint = printContentRef.value;
    
    if (divToPrint) {
        // 1. Open a new window
        const newwin = window.open("");

        // 2. Write the content of the print area to the new window's document
        // We include a basic HTML structure and some inline styles to ensure readability
        newwin.document.write('<html><head><title>University of the Philippines Cebu</title>');
        // Optional: Include any necessary CSS for the printed page here
        newwin.document.write('<style>body { font-family: sans-serif; padding: 20px; } .print-area { max-width: 400px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; } h3 { text-align: center; margin-bottom: 20px; } .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; } .key { font-weight: bold; margin-right: 15px; } .status-badge { display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 12px; font-weight: 600; } .bg-green-200 { background-color: #d1fae5; color: #065f46; } .bg-yellow-200 { background-color: #fef3c7; color: #92400e; } .amount-value { font-size: 1.25rem; font-weight: bold; } @media print { .no-print { display: none; } }</style>');
        newwin.document.write('</head><body>');
        newwin.document.write(divToPrint.innerHTML); // Write the inner content
        newwin.document.write('</body></html>');
        newwin.document.close();

        // 3. Print the new window
        newwin.print();

        // 4. Close the new window (usually after the print dialog is closed)
        //  newwin.close(); // You might comment this out to let the user review the print preview
        
    } else {
        console.error("Print area not found.");
    }

    // Still useful for parent component tracking/logging
    emit('print', props.paymentDetails); 
    console.log("Printing details initiated for:", props.paymentDetails.referenceCode);
};

// Helper function to format the amount
const formatAmount = (amount) => {
    if (typeof amount !== 'number') return '₱0';
    return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Array defining the key-value pairs for easy rendering and styling
const detailItems = computed(() => [
    { key: 'Campus ID', value: props.paymentDetails.campusId },
    { key: 'Name', value: props.paymentDetails.studentName },
    { key: 'Email', value: props.paymentDetails.email },
    { key: 'Course', value: props.paymentDetails.course },
    { key: 'Year Level', value: props.paymentDetails.yearLevel },
    { key: 'School Year', value: props.paymentDetails.schoolYear },
    { key: 'Reference Code', value: props.paymentDetails.referenceCode },
    { key: 'Payment Method', value: props.paymentDetails.paymentMethod },
    { key: 'Transaction Type', value: props.paymentDetails.transactionType },
    { key: 'Date', value: props.paymentDetails.date },
]);
</script>

<template>
    <div v-if="show" class=" fixed inset-0 z-50 flex items-center justify-center p-1 bg-gray-900 bg-opacity-50">
        
        <div ref="printContentRef" class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100 opacity-100 my-2 md:h-[32rem]">
            
            <div class="flex justify-between items-center mb-1 pb-2 border-b no-print">
                <h3 class="text-xl font-bold text-gray-800">University of the Philippines Cebu</h3>
                <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fa-solid fa-times text-xl"></i>
                </button>
            </div>

            <h3 class="no-print:hidden text-2xl font-bold text-gray-800 text-center mb-2">Payment Details Receipt</h3>
            
            <div class="space-y-3 text-sm text-gray-700">
                
                <div v-for="item in detailItems" :key="item.key" class="flex justify-between detail-row">
                    <p class="font-bold mr-4 key">{{ item.key }}:</p>
                    <p class="text-right">{{ item.value }}</p>
                </div>
                
                <!-- <div class="flex justify-between detail-row">
                    <p class="font-bold mr-4 key">Status:</p>
                    <p class="text-right">
                        <span 
                            :class="{
                                'bg-green-200 text-green-800': paymentDetails.status === 'Posted',
                                'bg-yellow-200 text-yellow-800': paymentDetails.status === 'Floating',
                                'bg-red-200 text-red-800': paymentDetails.status === 'Cancelled',
                                'bg-gray-200 text-gray-800': paymentDetails.status === 'Pending',
                            }"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold status-badge"
                        >
                            {{ paymentDetails.status || 'N/A' }}
                        </span>
                    </p>
                </div> -->

                <div class="flex justify-between pt-2 detail-row">
                    <p class="font-bold mr-4 key">Amount:</p>
                    <p class="font-bold text-lg text-gray-900 amount-value">{{ formatAmount(paymentDetails.amount) }}</p>
                </div>

            </div>
            
            <div class="mt-1.5 flex justify-end no-print">
                <button 
                    @click="handlePrint" 
                    class="px-3 py-1.5 mb-2 text-sm  bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-md font-semibold"
                >
                    Print Payment 
                    <i class="fa-solid fa-print ml-2"></i>
                </button>
            </div>

        </div>
    </div>
</template>