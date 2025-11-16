<script setup>
import { ref, onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore.js';
import TransactionFilters from './TransactionFilters.vue';
import TransactionTable from './TransactionTable.vue';
import TransactionModals from './Modals/TransactionModals.vue';

const store = useTransactionStore();
const modals = ref(null); // Added ref for modals

onMounted(() => store.loadTransactions());
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <TransactionFilters class="mb-4" />

    <!-- Table emits events handled by modals -->
    <TransactionTable
      @view="(transaction) => modals.open('view', transaction)"
      @update="(transaction) => modals.open('status', transaction)"
      @receipt="(transaction) => modals.open('receipt', transaction)"
    />

    <!-- Modal wrapper -->
    <TransactionModals ref="modals" />
  </div>
</template>
