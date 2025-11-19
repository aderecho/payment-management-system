import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import axios from 'axios';

const API_BASE_URL = 'http://api.yourdomain.com/v1/transactions';

export const useTransactionStore = defineStore('transactionStore', () => {

  const transactions = ref([]);
  const isLoading = ref(false);
  const fetchError = ref(null);
  const searchQuery = ref('');
  const debouncedSearchQuery = ref('');
  const startDate = ref('');
  const endDate = ref('');

  // --- ACTIONS (API Communication) ---

  /**
   * Fetches the list of transactions from the server via Axios GET.
   */
  const loadTransactions = async () => {
    isLoading.value = true;
    fetchError.value = null;

    try {
      const response = await axios.get(API_BASE_URL);
      transactions.value = response.data; 
    } catch (error) {
      console.error('Fetch error:', error.message);
      fetchError.value = `Failed to fetch transactions. Server response: ${error.message}`;
    } finally {
      isLoading.value = false;
    }
  };

  const updateStatus = async (referenceCode, newStatus) => {
    fetchError.value = null;
    
    const targetTransaction = transactions.value.find(
      (transaction) => transaction.referenceCode === referenceCode
    );

    if (!targetTransaction) return;

    // Optimistic Update: Update the UI state immediately
    const oldStatus = targetTransaction.status;
    targetTransaction.status = newStatus;
    
    try {
      await axios.patch(`${API_BASE_URL}/${referenceCode}/status`, { 
        status: newStatus 
      });
    } catch (error) {
      console.error('Update error:', error);
      // Rollback: Revert the UI state if the server call fails
      targetTransaction.status = oldStatus;
      fetchError.value = 'Failed to update status. Please check connection.';
      throw error;
    }
  };

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

  // --- COMPUTED PROPERTIES ---

  const sortedTransactions = computed(() =>
    [...transactions.value].sort(
      (a, b) => toDate(b.date) - toDate(a.date)
    )
  );

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