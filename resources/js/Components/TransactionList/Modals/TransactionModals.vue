<script setup>
import { ref } from 'vue';
import PaymentDetailsModal from './ReceiptModal.vue';
import ViewDetailsModal from './ViewDetailsModal.vue';
import StatusUpdateModal from './StatusUpdateModal.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import { useTransactionStore } from '@/stores/transactionStore.js';

const store = useTransactionStore();

const showReceipt = ref(false);
const showDetails = ref(false);
const showStatus = ref(false);
const showConfirm = ref(false);
const selected = ref({});
const confirmData = ref({});

// Added open method for parent to call
const open = (type, data) => {
  selected.value = data;
  if (type === 'receipt') showReceipt.value = true;
  else if (type === 'view') showDetails.value = true;
  else if (type === 'status') showStatus.value = true;
};

// Allow parent to call open
defineExpose({ open });

const closeAll = () => {
  showReceipt.value = showDetails.value = showStatus.value = showConfirm.value = false;
  selected.value = {};
};

const handleStatus = (details) => {
  confirmData.value = details;
  showStatus.value = false;
  showConfirm.value = true;
};

const confirmUpdate = () => {
  store.updateStatus(confirmData.value.referenceCode, confirmData.value.newStatus);
  showConfirm.value = false;
  alert(`Status updated to ${confirmData.value.newStatus}`);
};
</script>

<template>
  <PaymentDetailsModal :show="showReceipt" :paymentDetails="selected" @close="closeAll" />
  <ViewDetailsModal :show="showDetails" :details="selected" @close="closeAll" />
  <StatusUpdateModal
    :show="showStatus"
    :statusDetails="selected"
    @close="closeAll"
    @confirm-update="handleStatus"
  />
  <ConfirmationModal
    :show="showConfirm"
    message="Confirm update?"
    confirm-text="Yes, Update"
    cancel-text="No, Cancel"
    @confirm="confirmUpdate"
    @cancel="closeAll"
  />
</template>
