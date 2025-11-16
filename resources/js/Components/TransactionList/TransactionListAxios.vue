<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios' // 🔹 [ADDED FOR AXIOS DYNAMISM]

// 🔹 COMPONENT IMPORTS
import TransactionDataCell from '../TransactionList/TransactionDataCell.vue'
import TransactionStatusCell from '../TransactionList/TransactionStatusCell.vue'
import PaymentDetailsModal from './Modals/ReceiptModal.vue'
import StatusUpdateModal from './Modals/StatusUpdateModal.vue'
import ConfirmationModal from './Modals/ConfirmationModal.vue'
import DatePicker from '../TransactionList/DatePicker.vue'
import ViewDetails from './ViewDetailsModal.vue'
import SVG from '../SVG.vue'

// ======================================================
// 🔹 [ADDED FOR AXIOS DYNAMISM] - API CONFIGURATION
// ======================================================
const API_BASE_URL = 'https://api.yourdomain.com/v1'
const TRANSACTION_ENDPOINT = `${API_BASE_URL}/transactions`

// ======================================================
// 🔹 [ADDED FOR AXIOS DYNAMISM] - API STATE MANAGEMENT
// ======================================================
const transactions = ref([])
const isLoading = ref(true)
const fetchError = ref(null)

// 🔹 FETCH DATA FROM API
const fetchTransactions = async () => {
  isLoading.value = true
  fetchError.value = null
  try {
    const response = await axios.get(TRANSACTION_ENDPOINT)
    transactions.value = response.data // Expected to be array
  } catch (error) {
    console.error('API Fetch Error:', error)
    fetchError.value = `Failed to load transactions. ${error.message}`
  } finally {
    setTimeout(() => (isLoading.value = false), 300)
  }
}

onMounted(() => {
  fetchTransactions()
})

// ======================================================
// SEARCH + FILTER
// ======================================================
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
let searchTimeout = null

watch(searchQuery, newQuery => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newQuery
  }, 500)
})

// ======================================================
// DATE PICKER
// ======================================================
const startDate = ref('')
const endDate = ref('')
const showDatePicker = ref(false)
const datePickerTarget = ref(null)
const datePickerRef = ref(null)

const MIN_YEAR_WITH_DATA = computed(() => {
  if (!transactions.value.length) return new Date().getFullYear()
  let oldestYear = new Date().getFullYear()
  transactions.value.forEach(transaction => {
    const parts = transaction.date.split('/')
    if (parts.length === 3) {
      const year = parseInt(parts[2])
      if (year < oldestYear) oldestYear = year
    }
  })
  return oldestYear
})

const openDatePicker = target => {
  datePickerTarget.value = target
  showDatePicker.value = true
  setTimeout(() => {
    if (datePickerRef.value) datePickerRef.value.initializePickerDate()
  }, 0)
}

const handleDateClear = () => {
  startDate.value = ''
  endDate.value = ''
  showDatePicker.value = false
}

const displayDate = dateModel => {
  if (!dateModel) return ''
  const parts = dateModel.split('-')
  if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`
  return dateModel
}

// ======================================================
// TABLE HEADERS
// ======================================================
const headers = [
  'No.',
  'Campus Id',
  'Student Name',
  'Reference Code',
  'Payment Method',
  'Transaction Type',
  'Date',
  'Status',
  'Action'
]

const toDate = dateString => {
  const parts = dateString.split('/')
  return new Date(parts[2], parts[0] - 1, parts[1])
}

// ======================================================
// SORT + FILTER
// ======================================================
const sortedTransactions = computed(() => {
  if (!transactions.value.length) return []
  const list = [...transactions.value]
  list.sort((a, b) => {
    const dateA = toDate(a.date)
    const dateB = toDate(b.date)
    return dateB - dateA
  })
  return list
})

const filteredTransactions = computed(() => {
  const query = debouncedSearchQuery.value.toLowerCase().trim()
  const isStartDateSelected = !!startDate.value
  const isEndDateSelected = !!endDate.value
  let results = sortedTransactions.value

  if (isStartDateSelected && isEndDateSelected) {
    const startFilter = new Date(startDate.value)
    const endFilter = new Date(endDate.value)
    endFilter.setHours(23, 59, 59, 999)
    results = results.filter(transaction => {
      const d = toDate(transaction.date)
      return d >= startFilter && d <= endFilter
    })
  }

  if (query) {
    const isCashSearch = query === 'cash'
    results = results.filter(t => {
      if (isCashSearch) return t.paymentMethod.toLowerCase() === 'cash'
      return Object.values(t).some(val =>
        String(val).toLowerCase().includes(query)
      )
    })
  }

  return results
})

// ======================================================
// MODAL HANDLERS
// ======================================================
const showDetailsModal = ref(false)
const selectedTransaction = ref({})
const showStatusUpdateModal = ref(false)
const selectedStatusTransaction = ref({})
const showConfirmationModal = ref(false)
const confirmationMessage = ref('')
const transactionToUpdate = ref(null)
const showViewDetailsModal = ref(false)
const selectedViewDetails = ref({})

const openPaymentDetailsModal = transaction => {
  selectedTransaction.value = transaction
  showDetailsModal.value = true
}
const closePaymentDetailsModal = () => {
  showDetailsModal.value = false
  selectedTransaction.value = {}
}
const openStatusUpdateModal = transaction => {
  selectedStatusTransaction.value = { ...transaction }
  showStatusUpdateModal.value = true
}
const closeStatusUpdateModal = () => {
  showStatusUpdateModal.value = false
  selectedStatusTransaction.value = {}
}
const openViewDetailsModal = transaction => {
  selectedViewDetails.value = transaction
  showViewDetailsModal.value = true
}
const closeViewDetailsModal = () => {
  showViewDetailsModal.value = false
  selectedViewDetails.value = {}
}

// ======================================================
// 🔹 [ADDED FOR AXIOS DYNAMISM] - API STATUS UPDATE FLOW
// ======================================================
const handleStatusUpdate = details => {
  transactionToUpdate.value = details
  closeStatusUpdateModal()
  confirmationMessage.value = `Confirm update status for ${details.studentName} (Ref: ${details.referenceCode}) to ${details.newStatus}?`
  showConfirmationModal.value = true
}

const confirmUpdate = async () => {
  if (!transactionToUpdate.value) return
  const { referenceCode, newStatus } = transactionToUpdate.value
  showConfirmationModal.value = false
  try {
    await axios.patch(`${TRANSACTION_ENDPOINT}/${referenceCode}/status`, {
      status: newStatus
    })
    const index = transactions.value.findIndex(
      t => t.referenceCode === referenceCode
    )
    if (index !== -1) transactions.value[index].status = newStatus
    else fetchTransactions()
    alert(`Transaction ${referenceCode} updated to ${newStatus}.`)
  } catch (error) {
    console.error('API Update Error:', error)
    alert(`Failed to update status: ${error.message}`)
  } finally {
    transactionToUpdate.value = null
  }
}

const cancelUpdate = () => {
  showConfirmationModal.value = false
  transactionToUpdate.value = null
}
</script>

<template>
  <div class="bg-white p-5 rounded-lg shadow-xl">
    <!-- HEADER + FILTERS -->
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2"
    >
      <h1 class="text-3xl font-extrabold text-gray-900">Transaction List</h1>

      <div class="flex flex-wrap items-end gap-x-4 gap-y-3 justify-end">
        <!-- FROM DATE -->
        <div class="flex flex-col items-start w-[135px]">
          <label class="text-xs font-semibold text-gray-700 mb-1">From</label>
          <div class="relative w-full">
            <input
              type="text"
              :value="displayDate(startDate)"
              @click="openDatePicker('start')"
              readonly
              placeholder="mm/dd/yyyy"
              class="pr-10 pl-3 py-2 border rounded-md w-full text-sm text-gray-700 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            />
            <i
              class="fa-solid fa-calendar-alt absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            ></i>
          </div>
        </div>

        <!-- TO DATE -->
        <div class="flex flex-col items-start w-[135px]">
          <label class="text-xs font-semibold text-gray-700 mb-1">To</label>
          <div class="relative w-full">
            <input
              type="text"
              :value="displayDate(endDate)"
              @click="openDatePicker('end')"
              readonly
              placeholder="mm/dd/yyyy"
              class="pr-10 pl-3 py-2 border rounded-md w-full text-sm text-gray-700 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            />
            <i
              class="fa-solid fa-calendar-alt absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            ></i>
          </div>
        </div>

        <!-- SEARCH -->
        <div class="relative w-[268px] md:max-w-[300px]">
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Search by ID, Name, Ref Code..."
            class="pl-10 pr-4 py-2 border rounded-md w-full text-sm text-gray-700 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <i
            class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>
    </div>

    <!-- DATE PICKER -->
    <DatePicker
      v-if="showDatePicker"
      ref="datePickerRef"
      :model-value="datePickerTarget === 'start' ? startDate : endDate"
      @update:model-value="
        datePickerTarget === 'start' ? (startDate = $event) : (endDate = $event)
      "
      :target="datePickerTarget"
      :min-year-with-data="MIN_YEAR_WITH_DATA"
      @close="showDatePicker = false"
      @clear-all-dates="handleDateClear"
    />

    <!-- TABLE -->
    <div class="overflow-x-auto border border-gray-200 rounded-lg mt-4">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in headers"
              :key="header"
              class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
            >
              {{ header }}
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td
              :colspan="headers.length"
              class="px-4 py-8 text-center text-gray-500"
            >
              Loading transactions...
            </td>
          </tr>

          <tr v-else-if="fetchError">
            <td
              :colspan="headers.length"
              class="px-4 py-8 text-center text-red-500"
            >
              {{ fetchError }}
            </td>
          </tr>

          <tr
            v-else
            v-for="(transaction, index) in filteredTransactions"
            :key="transaction.referenceCode"
          >
            <TransactionDataCell :value="index + 1" />
            <TransactionDataCell :value="transaction.campusId" />
            <TransactionDataCell :value="transaction.studentName" />
            <TransactionDataCell :value="transaction.referenceCode" />
            <TransactionDataCell :value="transaction.paymentMethod" />
            <TransactionDataCell :value="transaction.transactionType" />
            <TransactionDataCell :value="transaction.date" />
            <TransactionStatusCell :status="transaction.status" />

            <td class="px-4 py-3 flex space-x-2">
              <button
                @click="openViewDetailsModal(transaction)"
                class="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3 rounded-lg shadow-md"
              >
                <SVG icon-name="View" container-class="h-2 w-2 mr-2"> View </SVG>  
              </button>

              <button
                @click="openStatusUpdateModal(transaction)"
                class="bg-gray-300 hover:bg-gray-400 text-gray-700 text-xs py-1.5 px-3 rounded-lg shadow-md"
              >
                <i class="fa-solid fa-edit mr-1"></i> Update
              </button>

              <button
                @click="openPaymentDetailsModal(transaction)"
                class="bg-green-900 hover:bg-green-700 text-white text-xs py-1.5 px-3 rounded-lg shadow-md"
              >
                <SVG icon-name="Print" container-class="h-3 w-3 mr-2"></SVG> Receipt
              </button>
            </td>
          </tr>

          <tr
            v-if="!isLoading && !fetchError && filteredTransactions.length === 0"
          >
            <td
              :colspan="headers.length"
              class="px-4 py-8 text-center text-gray-500"
            >
              No transactions found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- FOOTER -->
    <div class="flex justify-end mt-3">
      <button
        class="flex items-center rounded-lg shadow-lg py-2 px-4 bg-brand-maroon hover:bg-brand-maroon-hover text-white text-xs font-semibold"
      >
        <span>Generate Report</span>
        <SVG icon-name="Print" container-class="ml-1 h-4 text-white"></SVG>
      </button>
    </div>
  </div>

  <!-- MODALS -->
  <PaymentDetailsModal
    :show="showDetailsModal"
    :paymentDetails="selectedTransaction"
    @close="closePaymentDetailsModal"
  />

  <ViewDetails
    :show="showViewDetailsModal"
    :details="selectedViewDetails"
    @close="closeViewDetailsModal"
  />

  <StatusUpdateModal
    :show="showStatusUpdateModal"
    :statusDetails="selectedStatusTransaction"
    @close="closeStatusUpdateModal"
    @confirm-update="handleStatusUpdate"
  />

  <ConfirmationModal
    :show="showConfirmationModal"
    :message="confirmationMessage"
    confirm-text="Yes, Update"
    cancel-text="No, Cancel"
    @confirm="confirmUpdate"
    @cancel="cancelUpdate"
  />
</template>
