<script setup>
import { useTransactionStore } from '@/stores/transactionStore.js';
import TransactionDataCell from './TransactionDataCell.vue';
import TransactionStatusCell from './TransactionStatusCell.vue';
import SVG from '../SVG.vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['view', 'update', 'receipt']);
const store = useTransactionStore();

const headers = [
  '#',
  'Campus Id',
  'Student Name',
  'Reference Code',
  'Payment Method',
  'Transaction Type',
  'Date',
  'Status',
  'Action',
];
</script>

<template>
  <div class="overflow-x-auto border rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="tableHeader in headers"
            :key="tableHeader"
            class="px-4 py-2 text-xs text-left font-medium text-gray-500 uppercase "
          >
            {{ tableHeader }}
          </th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="store.isLoading">
          <td colspan="9" class="text-center py-8 text-gray-500">
            Loading transactions...
          </td>
        </tr>

        <tr v-else-if="store.fetchError">
          <td colspan="9" class="text-center py-8 text-red-500">
            {{ store.fetchError }}
          </td>
        </tr>

        <tr
          v-else
          v-for="(transaction, index) in store.filteredTransactions"
          :key="transaction.referenceCode"
          class="hover:bg-gray-50"
        >
          <TransactionDataCell :value="index + 1" />
          <TransactionDataCell :value="transaction.campusId" />
          <TransactionDataCell :value="transaction.studentName" />
          <TransactionDataCell :value="transaction.referenceCode" />
          <TransactionDataCell :value="transaction.paymentMethod" />
          <TransactionDataCell :value="transaction.transactionType" />
          <TransactionDataCell :value="transaction.date" />
          <TransactionStatusCell :status="transaction.status" />

          <td class="flex space-x-2 px-2 py-1.5">
            <!-- View Button -->
            <button
              @click="emit('view', transaction)"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-normal py-1.5 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md"
            >
              <SVG icon-name="View" container-class="h-3 w-3 mr-2"></SVG>
              View
            </button>

            <!-- Update Button -->
            <button
              @click="emit('update', transaction)"
              class="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs font-normal py-1.5 px-3 rounded-lg flex items-center justify-center transition duration-150 shadow-md"
            >
              <i class="fa-solid fa-edit mr-2"></i>
              Update
            </button>

            <!-- Receipt Button -->
            <button
              @click="emit('receipt', transaction)"
              class="bg-green-900 hover:bg-green-700 text-white text-xs font-normal py-1.5 px-3 rounded-lg flex items-center justify-center transition duration-750 ease-in-out shadow-md"
            >
              <SVG icon-name="Print" container-class="h-3 w-3 mr-4 -mt-1.5"></SVG>
              Receipt
            </button>
          </td>
        </tr>

        <tr v-if="!store.isLoading && !store.fetchError && !store.filteredTransactions.length">
          <td colspan="9" class="text-center py-8 text-gray-500">
            No transactions found.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="flex justify-end mt-3">
    <button
      class="flex items-center rounded-lg shadow-lg py-2 px-4 bg-brand-maroon hover:bg-brand-maroon-hover text-white text-xs font-semibold"
    >
      <span>Generate Report</span>
      <SVG icon-name="Print" container-class="ml-1 h-4 text-white"></SVG>
    </button>
  </div>
</template>
