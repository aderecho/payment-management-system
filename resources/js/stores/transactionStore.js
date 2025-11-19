import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { MOCK_TRANSACTION_DATA } from './MockData.js';

export const useTransactionStore = defineStore('transactionStore', () => {
  // --- STATE ---
  const transactions = ref([]);
  const isLoading = ref(true);
  const fetchError = ref(null);
  const searchQuery = ref('');
  const debouncedSearchQuery = ref('');
  const startDate = ref('');
  const endDate = ref('');

  // --- LOAD MOCK OR SAVED DATA ---
  const loadTransactions = () => {
    try {
      const savedData = localStorage.getItem('mockTransactions');
      transactions.value = savedData ? JSON.parse(savedData) : MOCK_TRANSACTION_DATA;
    } catch {
      fetchError.value = 'Failed to load transactions.';
    } finally {
      // Simulate loading state delay
      setTimeout(() => (isLoading.value = false), 500);
    }
  };

  // --- DEBOUNCE SEARCH QUERY ---
  let debounceTimeout = null;
  watch(searchQuery, (newQuery) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      debouncedSearchQuery.value = newQuery;
    }, 400);
  });

  // --- HELPER FUNCTION ---
  const toDate = (dateString) => {
    if (!dateString) return new Date(0);
    const [month, day, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  // --- SORT TRANSACTIONS BY DATE ---
  const sortedTransactions = computed(() =>
    [...transactions.value].sort(
      (a, b) => toDate(b.date) - toDate(a.date)
    )
  );

  // --- FILTERED TRANSACTIONS (DATE RANGE + SEARCH) ---
  const filteredTransactions = computed(() => {
    const query = debouncedSearchQuery.value.toLowerCase();
    let filteredList = [...sortedTransactions.value];

    // Filter by date range
    if (startDate.value && endDate.value) {
      const start = new Date(startDate.value);
      const end = new Date(endDate.value);
      end.setHours(23, 59, 59);

      filteredList = filteredList.filter((transaction) => {
        const transactionDate = toDate(transaction.date);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    // Filter by search query
    if (query) {
      const isCashQuery = query === 'cash';
      filteredList = filteredList.filter((transaction) =>
        isCashQuery
          ? transaction.paymentMethod.toLowerCase() === 'cash'
          : Object.values(transaction).some((value) =>
              String(value).toLowerCase().includes(query)
            )
      );
    }

    return filteredList;
  });

  // --- UPDATE TRANSACTION STATUS ---
  const updateStatus = (referenceCode, newStatus) => {
    const targetTransaction = transactions.value.find(
      (transaction) => transaction.referenceCode === referenceCode
    );

    if (targetTransaction) {
      targetTransaction.status = newStatus;
      localStorage.setItem(
        'mockTransactions',
        JSON.stringify(transactions.value)
      );
    }
  };

  // --- RETURN STORE PROPERTIES & ACTIONS ---
  return {
    transactions,
    isLoading,
    fetchError,
    searchQuery,
    startDate,
    endDate,
    filteredTransactions,
    loadTransactions,
    updateStatus,
  };
});
  