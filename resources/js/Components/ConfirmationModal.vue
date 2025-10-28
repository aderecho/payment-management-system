<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    /**
     * Controls the visibility of the modal.
     * @type {boolean}
     */
    show: {
        type: Boolean,
        default: false,
    },
    /**
     * The main message/question displayed in the modal body.
     * @type {string}
     */
    message: {
        type: String,
        required: true,
    },
    /**
     * Text for the confirmation (primary) button.
     * @type {string}
     */
    confirmText: {
        type: String,
        default: 'Confirm',
    },
    /**
     * Text for the cancellation (secondary) button.
     * @type {string}
     */
    cancelText: {
        type: String,
        default: 'Cancel',
    },
    /**
     * Title text for the modal header.
     * @type {string}
     */
    title: {
        type: String,
        default: 'Confirmation Required',
    },
});

const emit = defineEmits(['confirm', 'cancel']);

/**
 * Handles the confirmation button click and emits the 'confirm' event.
 */
const handleConfirm = () => {
    emit('confirm');
};

/**
 * Handles the cancel button click or backdrop click (if enabled) and emits the 'cancel' event.
 */
const handleCancel = () => {
    emit('cancel');
};
</script>

<template>
    <Transition name="modal">
        <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
            <div 
                class="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" 
                @click="handleCancel"
            ></div>
            
            <div class="flex items-center justify-center min-h-screen p-4">
                <div 
                    class="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all sm:max-w-lg sm:w-full w-full mx-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                <i class="fa-solid fa-question text-blue-600 text-lg"></i>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    {{ title }}
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">
                                        <span v-html="message"></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button 
                            type="button" 
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out"
                            @click="handleConfirm"
                        >
                            {{ confirmText }}
                        </button>
                        <button 
                            type="button" 
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition duration-150 ease-in-out"
                            @click="handleCancel"
                        >
                            {{ cancelText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
/* Modal transition styles for smooth entry/exit */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
}

.modal-enter-to,
.modal-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
}
</style> 

