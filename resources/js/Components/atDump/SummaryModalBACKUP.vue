<!-- PORTRAIT DESIGN ---> 
 <script setup>
const props = defineProps({
  formData: Object,
});

const emit = defineEmits(['close', 'confirm']);

const confirmPayment = () => emit('confirm');
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    role="dialog"
    aria-modal="true"
  >
    <!-- Modal Container -->
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl transform transition-all"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-brand-maroon text-white rounded-t-2xl">
        <h3 class="text-xl font-bold">Payment Summary & Confirmation</h3>
        <button
          @click="$emit('close')"
          class="text-white hover:text-brand-gold text-lg font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="grid grid-cols-2 gap-6 px-8 py-6 text-gray-800">
        <!-- LEFT: Transaction Details -->
        <div>
          <h4 class="text-lg font-semibold text-brand-maroon border-b border-brand-gold pb-2 mb-4">
            Transaction Details
          </h4>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="font-medium">Transaction Type</dt>
              <dd>{{ formData.transactionType }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Payment Method</dt>
              <dd>{{ formData.paymentMethod }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Purpose</dt>
              <dd>{{ formData.purpose }}</dd>
            </div>
            <div class="flex justify-between text-brand-maroon font-bold text-base border-t pt-2">
              <dt>Amount</dt>
              <dd>
                ₱{{ parseFloat(formData.amount).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) }}
              </dd>
            </div>
            <div v-if="formData.facilitiesReferenceNumber" class="flex justify-between">
              <dt class="font-medium">Facilities Ref. No.</dt>
              <dd>{{ formData.facilitiesReferenceNumber }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Reference No. / Payment ID</dt>
              <dd>{{ formData.referenceNumber || 'N/A' }}</dd>
            </div>
          </dl>
        </div>

        <!-- RIGHT: Personal Information -->
        <div>
          <h4 class="text-lg font-semibold text-brand-maroon border-b border-brand-gold pb-2 mb-4">
            Personal Information
          </h4>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="font-medium">Campus ID</dt>
              <dd>{{ formData.campusId }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Name</dt>
              <dd>{{ formData.name }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Course</dt>
              <dd>{{ formData.course || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Year Level</dt>
              <dd>{{ formData.yearLevel || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">School Year</dt>
              <dd>{{ formData.schoolYear || 'N/A' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Email</dt>
              <dd>{{ formData.email }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Name on OR</dt>
              <dd>{{ formData.isNameOnOR ? 'Yes (Personal Name)' : `No - ${formData.orName}` }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Warning Note -->
      <div class="mx-8 my-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-lg">
        ⚠️ <strong>Important:</strong> Clicking <strong>Confirm Payment</strong> registers this transaction.  
        Ensure payment is already made for non-cash methods.
      </div>

      <!-- Footer -->
      <div class="flex justify-end space-x-3 px-8 py-4 bg-gray-50 border-t rounded-b-2xl">
        <button
          @click="$emit('close')"
          class="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-medium hover:bg-gray-100 transition"
        >
          Cancel / Edit
        </button>
        <button
          @click="confirmPayment"
          class="px-5 py-2 rounded-lg bg-brand-green-dark text-white font-semibold hover:bg-green-700 transition"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Color variables — adjust to match your brand palette */
:root {
  --brand-maroon: #6a1b1a;
  --brand-green-dark: #1e4d2b;
  --brand-gold: #d4af37;
}

.bg-brand-maroon {
  background-color: var(--brand-maroon);
}
.text-brand-maroon {
  color: var(--brand-maroon);
}
.border-brand-gold {
  border-color: var(--brand-gold);
}
.bg-brand-green-dark {
  background-color: var(--brand-green-dark);
}
.hover\:bg-green-700:hover {
  background-color: #166534;
}
</style>
