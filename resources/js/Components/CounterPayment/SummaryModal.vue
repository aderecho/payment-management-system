<script setup>
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
      class="bg-white rounded-xl shadow-2xl w-full max-w-3xl transform transition-all"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-brand-maroon text-white rounded-t-xl"
      >
        <div class="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-brand-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.418 2 2.83V16m1-9V7m0 9v1m4-8a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 class="text-lg font-semibold text-brand-gold">
            Payment Summary & Confirmation
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:text-brand-gold text-xl font-bold px-2"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="grid grid-cols-2 gap-3 px-4 py-3 text-gray-900 text-sm">
        <!-- LEFT: Transaction Details -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4
            class="flex items-center text-base font-semibold text-brand-maroon border-b border-brand-gold pb-2 mb-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-brand-gold mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-brand-gold mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.121 17.804A8 8 0 1118.878 6.195M12 14l2 2m0-2l-2 2m0 0l-2-2m2 2V9"
              />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Confirm Payment</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-brand-maroon {
  color: #8a1538;
}
.bg-brand-maroon {
  background-color: #8a1538;
}
.bg-brand-green-dark {
  background-color: #00573f;
}
.hover\:bg-brand-green-dark-hover:hover {
  background-color: #00402e;
}
.text-brand-gold {
  color: #ffb81c;
}
.border-brand-gold {
  border-color: #ffb81c;
}
</style>
