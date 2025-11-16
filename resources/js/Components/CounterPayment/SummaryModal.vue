<script setup>
import SVG from '../SVG.vue';
const props = defineProps({
  formData: Object,
});

const emit = defineEmits(["close", "confirm"]);

const confirmPayment = () => emit("confirm");
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
    role="dialog"
    aria-modal="true"
  >
    <!-- Modal Container -->
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all overflow-y-auto"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-brand-maroon text-white rounded-t-xl"
      >
        <div class="flex items-center space-x-2">
          <SVG iconName="PaymentSummary" containerClass="h-5 w-5 text-brand-gold"></SVG>
          <h3 class="text-lg font-semibold text-brand-gold">
            Payment Summary & Confirmation
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:text-brand-gold text-xl font-bold px-2"
          aria-label="Close"
        >
        <SVG iconName="Close" containerClass="h-5 w-5"></SVG>
        
        </button>
      </div>

      <!-- Body -->
      <div class="grid grid-cols-2 gap-3 px-4 py-3 text-gray-900 text-sm">
        <!-- LEFT: Transaction Details -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4
            class="flex items-center text-base font-semibold text-brand-maroon border-b border-brand-gold pb-2 mb-3"
          >
            <SVG iconName="TransactionDetails" containerClass="h-5 w-5 text-brand-gold"></SVG>
            Transaction Details
          </h4>
          <dl class="space-y-2 text-[0.9rem] leading-relaxed">
            <div class="flex justify-between">
              <dt class="font-medium">Type</dt>
              <dd>{{ formData.transactionType }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Payment</dt>
              <dd>{{ formData.paymentMethod }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Purpose</dt>
              <dd>{{ formData.purpose }}</dd>
            </div>
            <div
              class="flex justify-between text-brand-maroon font-bold text-base border-t border-gray-300 pt-1.5"
            >
              <dt>Amount</dt>
              <dd>
                ₱{{
                  parseFloat(formData.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                }}
              </dd>
            </div>
            <div
              v-if="formData.facilitiesReferenceNumber"
              class="flex justify-between"
            >
              <dt class="font-medium">Facilities Ref. No.</dt>
              <dd>{{ formData.facilitiesReferenceNumber }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Ref / Payment ID</dt>
              <dd>{{ formData.paymentReferenceNumber || "N/A" }}</dd>
            </div>
          </dl>
        </div>

        <!-- RIGHT: Personal Information -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4
            class="flex items-center text-base font-semibold text-brand-maroon border-b border-brand-gold pb-2 mb-3"
          >
            <SVG iconName="PersonalInfo" containerClass="h-5 w-5 text-brand-gold"></SVG>
            Personal Information
          </h4>
          <dl class="space-y-2 text-[0.9rem] leading-relaxed">
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
              <dd>{{ formData.course || "N/A" }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Year Level</dt>
              <dd>{{ formData.yearLevel || "N/A" }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">School Year</dt>
              <dd>{{ formData.schoolYear || "N/A" }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Email</dt>
              <dd>{{ formData.email }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="font-medium">Name on OR</dt>
              <dd>
                {{
                  formData.isNameOnOR
                    ? "Yes (Personal Name)"
                    : formData.orName || "N/A"
                }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Warning Note -->
      <div
        class="mx-6 my-3 p-3 bg-brand-gold/10 border-l-4 border-brand-gold text-brand-maroon text-sm rounded-md"
      >
        ⚠️ <strong>Note:</strong> Click
        <strong>Confirm Payment</strong> to register this transaction.
        Ensure your payment is made for non-cash methods.
      </div>
      <!-- Footer -->
      <div
        class="flex justify-end space-x-3 px-6 py-4 bg-gray-100 border-t rounded-b-xl"
      >
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 text-sm font-medium hover:bg-gray-200 transition"
        >
          Cancel / Edit
        </button>
        <button
          @click="confirmPayment"
          class="px-4 py-2 rounded-md bg-brand-green-dark text-white text-sm font-semibold hover:bg-brand-green-dark-hover transition"
        >
          <div class="flex items-center justify-center space-x-1.5">
             <SVG iconName="ConfirmPayment" containerClass="h-4 w-4"></SVG>
            <span>Confirm Payment</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>


