<!-- RECEIPT MODAL -->
<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
import SVG from '../SVG.vue';

const printContentRef = ref(null)

const props = defineProps({
  show: { type: Boolean, required: true },
  paymentDetails: {
    type: Object,
    default: () => ({
      receiptNo: '',
      campusId: '',
      studentName: '',
      course: '',
      yearLevel: '',
      schoolYear: '',
      referenceCode: '',
      paymentMethod: '',
      transactionType: '',
      date: '',
      amount: 0,
      cashReceived: 0,
      change: 0,
      cashierName: 'Cashier 1',
    }),
  },
})

const emit = defineEmits(['close', 'print'])

const formatAmount = (amount) => {
  const num = parseFloat(amount)
  if (isNaN(num)) return '₱0.00'
  return `₱${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

// 🖨 Handle print popup
const handlePrint = () => {
  const printArea = printContentRef.value
  if (!printArea) return

  const printContent = printArea.querySelector('.receipt-content').innerHTML
  const newTab = window.open('', '_blank')
  newTab.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>Cash Receipt</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: #fff;
      color: #000;
      margin: 0;
      padding: 10px;
      font-size: 12px;
    }
    .receipt {
      width: 58mm;
      margin: 0 auto;
      text-align: left;
    }
    .center { text-align: center; }
    .bold { font-weight: bold; }
    .line {
      border-top: 1px dashed #6a0d1b;
      margin: 6px 0;
    }
    .section {
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 13px;
      margin-top: 6px;
      color: #6a0d1b;
    }
    .thank {
      text-align: center;
      font-size: 11px;
      margin-top: 10px;
      font-weight: bold;
      color: #6a0d1b;
    }
    @media print {
      body {
        width: 58mm;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="receipt">
    ${printContent}
  </div>
  <script>
    window.onload = function() { window.print(); };
  <\/script>
</body>
</html>
`)
  newTab.document.close()
  emit('print', props.paymentDetails)
}

const descriptionItems = computed(() => [
  { name: 'Campus ID', price: props.paymentDetails.campusId },
  { name: 'Student Name', price: props.paymentDetails.studentName },
  { name: 'Course', price: props.paymentDetails.course },
  { name: 'Year Level', price: props.paymentDetails.yearLevel },
  { name: 'School Year', price: props.paymentDetails.schoolYear },
  { name: 'Transaction', price: props.paymentDetails.transactionType },
  { name: 'Payment Method', price: props.paymentDetails.paymentMethod },
  { name: 'Reference', price: props.paymentDetails.referenceCode },
  { name: 'Date', price: props.paymentDetails.date },
])
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 p-2"
  >
    <div
      ref="printContentRef"
      class="relative bg-white rounded-lg shadow-2xl w-full max-w-xs p-5 border border-gray-200"
    >
      <!-- Close Button -->
      <button
        @click="emit('close')"
        class="absolute top-2 right-2 text-gray-500 hover:text-[#6a0d1b] transition"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Receipt Preview -->
      <div class="receipt-content font-mono ">
        <!-- Header -->
        <div class="center">
          <h2 class="text-sm font-bold text-[#6a0d1b]">UNIVERSITY OF THE PHILIPPINES CEBU</h2>
          <p class="text-[11px] text-gray-600">Gorordo Ave, Cebu City, 6000 Cebu</p>
          <p class="text-[11px] text-gray-600">Tel. No: +63 2 8981-8500</p>
        </div>

        <div class="line"></div>
        <div class="center font-bold text-[#6a0d1b]">CASH RECEIPT</div>
        <div class="line"></div>

        <!-- Items -->
        <div class="section">
          <div class="flex justify-between row font-bold border-b border-dashed border-gray-300 pb-1">
            <span>Description</span>
            <span>Details</span>
          </div>
          <div v-for="item in descriptionItems" :key="item.name" class="flex justify-between row text-sm">
            <span>{{ item.name }}</span>
            <span>{{ item.price || '-' }}</span>
          </div>
        </div>

        <div class="line"></div>

        <!-- Totals -->
        <div class="section ">
          <div class="flex justify-between total-row">
            <span>Total</span>
            <span>{{ formatAmount(paymentDetails.amount) }}</span>
          </div>
          <div class="flex justify-between row">
            <span>Cash</span>
            <span>{{ formatAmount(paymentDetails.cashReceived) }}</span>
          </div>
          <div class="flex justify-between row">
            <span>Change</span>
            <span>{{ formatAmount(paymentDetails.change) }}</span>
          </div>
        </div>

        <div class="line"></div>

        <!-- Approval + Cashier -->
        <div class="section text-sm">
          <div class="flex justify-between row">
            <span>Receipt No</span>
            <span>#{{ paymentDetails.receiptNo || '00012345' }}</span>
          </div>
          <div class="flex justify-between row">
            <span>Cashier</span>
            <span>{{ paymentDetails.cashierName }}</span>
          </div>
        </div>

        <div class="line"></div>

        <div class="flex justify-center thank">THANK YOU!</div>
      </div>

      <!-- Buttons -->
      <div class="mt-4 flex justify-end gap-2">
        <button
          @click="handlePrint"
          class="px-3 py-1.5 text-sm bg-[#6a0d1b] text-white rounded-md hover:bg-[#510a15] transition-colors flex items-center gap-1"
        >
          <span>Print</span>
               <SVG icon-name="Print" container-class="ml-1 mb-2 h-4 text-white flex items-center"> </SVG>
        </button>
      </div>
    </div>
  </div>
</template>
