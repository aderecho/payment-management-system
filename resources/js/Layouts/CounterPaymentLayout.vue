<script setup>
import { ref, computed, onMounted } from 'vue';
import NavHeader from '@/Components/NavHeader.vue';
import Sidebar from '@/Components/Sidebar.vue';
import TransactionDetailsForms from '@/Components/CounterPayment/forms/TransactionDetailsForms.vue';
import PersonalInformation from '@/Components/CounterPayment/PersonalInformation.vue';
import PaymentPreview from '@/Components/CounterPayment/PaymentPreview.vue';
import SummaryModal from '@/Components/CounterPayment/SummaryModal.vue';

// Sidebar setup
const isSidebarOpen = ref(true);
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);
const isMobile = computed(() => window.innerWidth < 1024);

onMounted(() => {
  if (isMobile.value) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
});

const openSidebarOnEnter = () => {
  if (!isMobile.value) {
    isSidebarOpen.value = true;
  }
};

const closeSidebarOnLeave = () => {
  if (!isMobile.value) {
    isSidebarOpen.value = false;
  }
};

// Menu
const menuItems = [
  { name: "Dashboard", icon: "Dashboard", route: "/DashboardPage" },
  { name: "Counter Payment", icon: "Counter Payment", route: "/CounterPaymentPage" },
  { name: "Transaction Log", icon: "Transaction Log", route: "/TransactionLogPage" },
];

// Shared form data
const formData = ref({
  transactionType: '',
  paymentMethod: '',
  purpose: '',
  amount: '',
  name: '',
  course: '',
  yearLevel: '',
  schoolYear: '',
  campusId: '',
  email: '',
  isNameOnOR: true,
  orName: '',
  paymentReferenceNumber: '',
  facilitiesReferenceNumber: '',
  // Fields for Library Fees & Fines
  accessionNumber: '',
  numberOfHours: '',
  numberOfDays: '',
  numberOfPages: '',
});

const validationErrors = ref({});
const showSummaryModal = ref(false);

const handleSubmitForm = () => {
  const errors = {};
  const type = formData.value.transactionType;
  const method = formData.value.paymentMethod;

  // required fields
  if (!type) errors.transactionType = 'Transaction Type is required';
  if (!formData.value.paymentMethod) errors.paymentMethod = 'Payment Method is required';
  if (!formData.value.purpose) errors.purpose = 'Purpose is required';
  if (!formData.value.amount) errors.amount = 'Amount is required';
  if (!formData.value.name) errors.name = 'Name is required';
  if (!formData.value.email) errors.email = 'Email is required';

  if (type === 'University Enrollment Related') {
    if (!formData.value.campusId) errors.campusId = 'Campus ID is required';
    if (!formData.value.course) errors.course = 'Course is required';
    if (!formData.value.yearLevel) errors.yearLevel = 'Year Level is required';
    if (!formData.value.schoolYear) errors.schoolYear = 'School Year is required';
  }

  // Facilities Transaction (Requires Facilities Reference Number)
  if (type === 'UP Cebu Facilities, Other Equipment and Vehicle Registration') {
    if (!formData.value.facilitiesReferenceNumber) errors.facilitiesReferenceNumber = 'Facilities Reference Number is required';
  }

  //  Library Fees & Fines
  if (type === 'University Library-Fees & Fines') {
    const purpose = formData.value.purpose;

    // Overdue Books / Lost Books
    if (purpose === 'Overdue Books' || purpose === 'Lost Books') {
      if (!formData.value.accessionNumber) errors.accessionNumber = 'Accession Number is required';
    }
    // Internet Fee
    else if (purpose === 'Internet Fee') {
      if (!formData.value.numberOfHours) errors.numberOfHours = 'Number of Hours is required';
    }
    // Non-UP (Private)
    else if (purpose === 'Non-UP (Private)') {
      if (!formData.value.numberOfDays) errors.numberOfDays = 'Number of Days is required';
    }
    // Photocopy, Printing, and Scanning
    else if (purpose === 'Photocopy' || purpose === 'Printing' || purpose === 'Scanning') {
      if (!formData.value.numberOfPages) errors.numberOfPages = 'Number of Pages is required';
    }
  }

  // Reference Number / Payment ID is required if chosen is NOT Cash
  if (method && method !== 'Cash' && !formData.value.paymentReferenceNumber) {
      errors.paymentReferenceNumber = 'Reference Number / Payment ID is required';
    }

  // OR Name
  if (!formData.value.isNameOnOR && !formData.value.orName) {
    errors.orName = 'Name to appear on OR is required';
  }

  validationErrors.value = errors;

  if (Object.keys(errors).length === 0) {
    showSummaryModal.value = true;
  }
};

const clearForm = () => {
  Object.keys(formData.value).forEach(k => formData.value[k] = '');
  formData.value.isNameOnOR = true;
  validationErrors.value = {};
};

const closeSummary = () => (showSummaryModal.value = false);
</script>

<template>
  <div class="min-h-screen  bg-gray-100 flex flex-col">
    <NavHeader @toggleSidebar="toggleSidebar" />
    <div class="flex-1 flex">
      <Sidebar
        :menu-items="menuItems"
        :is-sidebar-open="isSidebarOpen"
          @mouseenter="openSidebarOnEnter"
          @mouseleave="closeSidebarOnLeave"
      />
      <main class="flex-1 transition-all duration-300 p-4 min-w-0"
        :class="{ 'lg:ml-[12.5rem]': isSidebarOpen, 'lg:ml-[4.5rem]': !isSidebarOpen }">
    
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 w-full mt-16">
          <div class="lg:col-span-3 space-y-4">
            <TransactionDetailsForms
              v-model="formData"
              :validation-errors="validationErrors"
            />
            <PersonalInformation class=""
              v-model="formData"
              :validation-errors="validationErrors"
              @clear="clearForm"
              @submit="handleSubmitForm"
            />
          </div>

          <div class="lg:col-span-2 w-auto">
            <PaymentPreview :form-data="formData" />
          </div>
        </div>
      </main>
    </div>

    <SummaryModal
      v-if="showSummaryModal"
      :form-data="formData"
      @close="closeSummary"
      @confirm="closeSummary"
    />
  </div>
</template>