<script setup>
import { defineProps, defineEmits } from 'vue';

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

// Define the event the component will emit to the parent to close itself
const emit = defineEmits(['close', 'print']);

// Function to handle the print action
const handlePrint = () => {
    // You would typically emit an event or perform print logic here
    emit('print', props.paymentDetails); // Emit the transaction data for printing
    console.log("Printing details for:", props.paymentDetails.referenceCode);
    // For a real print, you might trigger window.print() on a specific print area
};

// Helper function to format the amount
const formatAmount = (amount) => {
    if (typeof amount !== 'number') return '₱0';
    return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Array defining the key-value pairs for easy rendering and styling
const detailItems = [
    { key: 'Campus ID', value: props.paymentDetails.campusId },
    { key: 'Name', value: props.paymentDetails.studentName },
    { key: 'Course', value: props.paymentDetails.course },
    { key: 'Year Level', value: props.paymentDetails.yearLevel },
    { key: 'School Year', value: props.paymentDetails.schoolYear },
    { key: 'Reference Code', value: props.paymentDetails.referenceCode },
    { key: 'Payment Method', value: props.paymentDetails.paymentMethod },
    { key: 'Transaction Type', value: props.paymentDetails.transactionType },
    { key: 'Date', value: props.paymentDetails.date },
];
</script>

<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
        
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100 opacity-100">
            
            <div class="flex justify-between items-center mb-6 pb-2 border-b">
                <h3 class="text-xl font-bold text-gray-800">Payment Details</h3>
                <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fa-solid fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="space-y-3 text-sm text-gray-700">
                
                <div v-for="item in detailItems" :key="item.key" class="flex justify-between">
                    <p class="font-bold mr-4">{{ item.key }}:</p>
                    <p class="text-right">{{ item.value }}</p>
                </div>
                
                <div class="flex justify-between">
                    <p class="font-bold mr-4">Status:</p>
                    <p class="text-right">
                        <span 
                            :class="{
                                'bg-green-200 text-green-800': paymentDetails.status === 'Posted',
                                'bg-yellow-200 text-yellow-800': paymentDetails.status === 'Floating',
                                'bg-red-200 text-red-800': paymentDetails.status === 'Cancelled',
                                'bg-gray-200 text-gray-800': !paymentDetails.status
                            }"
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                        >
                            {{ paymentDetails.status || 'N/A' }}
                        </span>
                    </p>
                </div>

                <div class="flex justify-between pt-2">
                    <p class="font-bold mr-4">Amount:</p>
                    <p class="font-bold text-lg text-gray-900">{{ formatAmount(paymentDetails.amount) }}</p>
                </div>

            </div>
            
            <div class="mt-8 flex justify-end">
                <button 
                    @click="handlePrint" 
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-md font-semibold"
                >
                    Print Payment 
                    <i class="fa-solid fa-print ml-2"></i>
                </button>
            </div>

        </div>
    </div>
</template>