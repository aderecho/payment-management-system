<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'; 

// Template reference for the modal content
const modalContentRef = ref(null);

const props = defineProps({
    // Controls modal visibility
    show: {
        type: Boolean,
        required: true
    },
    // Data object for status details
    statusDetails: { 
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

// Define the events the component will emit to the parent
const emit = defineEmits(['close', 'update-status', 'confirm-update']); 

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
    if (newStatus !== props.statusDetails.status) {
        emit('update-status', { 
            referenceCode: props.statusDetails.referenceCode,
            newStatus: newStatus 
        });
    }
});

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
    { key: 'Course', value: props.statusDetails.course || 'N/A' }, 
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
        
        <div ref="modalContentRef" class="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100 opacity-100 md:h-[34rem]">
            
            <div class="flex justify-between items-center mb-1 pb-2 border-b">
                <h3 class="text-xl font-bold text-gray-800">Status Details</h3> 
                <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 transition">
                    <i class="fa-solid fa-times text-xl"></i>
                </button>
            </div>

            <h3 class="text-2xl font-bold text-gray-800 text-center mb-1">Update Status</h3>
            
            <div class="space-y-3 text-sm text-gray-700">
                
                <div v-for="item in detailItems" :key="item.key" class="flex justify-between detail-row">
                    <p class="font-bold mr-4 key">{{ item.key }}:</p>
                    <p class="text-right">{{ item.value || '-' }}</p> 
                </div>
                
                <div class="flex justify-between detail-row">
                    <p class="font-bold mr-4 key">Status:</p>
                    
                    <p class="text-right">
                        <select
                            v-model="editableStatus"
                            :class="{
                                'bg-green-200 text-green-800': editableStatus === 'Posted',
                                'bg-yellow-200 text-yellow-800': editableStatus === 'Floating',
                                'bg-gray-200 text-gray-800': editableStatus === 'Pending',
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
                                    'bg-green-100 text-green-800': option === 'Posted',
                                    'bg-yellow-100 text-yellow-800': option === 'Floating',
                                    'bg-gray-100 text-gray-800': option === 'Pending',
                                    'bg-red-100 text-red-800': option === 'Cancelled',
                                }"
                            >
                                {{ option }}
                            </option>
                        </select>
                    </p>

                    </div>

                <div class="flex justify-between pt-2 detail-row">
                    <p class="font-bold mr-4 key">Amount:</p>
                    <p class="font-bold text-lg text-gray-900 amount-value">{{ formatAmount(statusDetails.amount) }}</p>
                </div>

            </div>
            
            <div class="mt-2 flex justify-end">
                <button 
                        @click="$emit('confirm-update', statusDetails)"
                        class="bg-brand-green-dark hover:bg-brand-green-dark-hover text-white text-xs font-semibold py-1 px-4 rounded-md flex items-center justify-center transition duration-150"
                        >
                        Update 
                </button>
            </div>

        </div>
    </div>
</template>