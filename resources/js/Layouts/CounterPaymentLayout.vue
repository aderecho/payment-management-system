<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios'; // 👈 ADDED: Import Axios
// import QRCode from 'qrcode'; 
import NavHeader from '@/Components/NavHeader.vue';
import Sidebar from '@/Components/Sidebar.vue';

// Menu items for the sidebar
const menuItems = [
    { name: "Dashboard", icon: "fa-solid fa-table-cells-large", route: "/DashboardPage" },
    { name: "Counter Payment", icon: "fa-solid fa-boxes-packing", route: "/CounterPaymentPage" },
    { name: "Transaction Log", icon: "fa-solid fa-file-export", route: "/TransactionLogPage" },
];

const isSidebarOpen = ref(true); 
const isMobile = computed(() => window.innerWidth < 1024); 

onMounted(() => { 
    if (isMobile.value) {
        isSidebarOpen.value = false;
    } else {
        isSidebarOpen.value = true;
    }
});

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

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

// Reactive variables for form inputs
const name = ref('');
const course = ref('');
const yearLevel = ref('');
const schoolYear = ref('');
const campusId = ref('');
const transactionType = ref('');
const paymentMethod = ref('');
const amount = ref('');

// Reactive variables for QR code output
const qrCodeUrl = ref('');
const referenceCode = ref('');

// ADDED: State for API call status/messages
const postLoading = ref(false);
const postSuccess = ref(false);
const postError = ref(null);

// Function to generate a random reference code
const generateReferenceCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// MODIFIED: Function to generate the QR code AND send data to API
const generateQR = async () => {
    // 1. Clear previous states and set loading
    postSuccess.value = false;
    postError.value = null;
    postLoading.value = true;

    // 2. Generate data structure
    referenceCode.value = generateReferenceCode();

    const data = {
        name: name.value,
        course: course.value,
        yearLevel: yearLevel.value,
        schoolYear: schoolYear.value,
        campusId: campusId.value,
        transactionType: transactionType.value,
        paymentMethod: paymentMethod.value,
        amount: amount.value,
        referenceCode: referenceCode.value,
        // Match expected fields in TransactionList
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        status: 'Floating', 
    };
    
    const qrData = JSON.stringify(data);
    
    // NOTE: QRCode.toDataURL requires the 'qrcode' library to be installed and available
    // Placeholder logic for QR generation
    if (typeof QRCode !== 'undefined' && QRCode.toDataURL) {
        try {
            qrCodeUrl.value = await QRCode.toDataURL(qrData);
        } catch (err) {
            console.error("Error generating QR code:", err);
            qrCodeUrl.value = '';
        }
    } else {
        console.warn("QRCode library not found. QR generation skipped.");
        // Placeholder for missing library
        qrCodeUrl.value = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; 
    }
    
    // 3. AXIOS POST: Send the payment data to the API
    try {
        const API_URL = 'http://your-backend-api.com/transactions'; 
        
        await axios.post(API_URL, data);

        postSuccess.value = true;
        
    } catch (err) {
        console.error("Error posting transaction:", err);
        postError.value = 'Failed to submit transaction to the server.';
        postSuccess.value = false;
    } finally {
        postLoading.value = false;
    }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <NavHeader @toggleSidebar="toggleSidebar" />
    
    <div class="flex-1 flex">
        <Sidebar 
        :menu-items="menuItems" 
        :is-sidebar-open="isSidebarOpen"
          @mouseenter="openSidebarOnEnter"
          @mouseleave="closeSidebarOnLeave"
      />
        
      <main 
        class="flex-1 transition-all duration-300 p-5 min-w-0 "
          :class="{
              'ml-[12.5rem]': isSidebarOpen,
              'ml-[4.5rem]': !isSidebarOpen, 
          }">
    

        <h1 class="text-2xl font-semibold text-gray-800 mb-6 ml-2">Over the counter payment</h1>
    <div class="flex flex-col md:flex-row gap-6 max-w-5xl ml-5">
      <div class="flex-1 p-8 bg-white rounded-lg shadow-xl">
        
        <div class="md:col-span-2 mt-2 mb-4">
            <div v-if="postSuccess" class="p-3 bg-green-100 text-green-700 rounded-md font-medium">
                ✅ Transaction Data Generated and Submitted Successfully!
            </div>
            <div v-else-if="postError" class="p-3 bg-red-100 text-red-700 rounded-md font-medium">
                ❌ Submission Failed: {{ postError }}
            </div>
            <div v-else-if="postLoading" class="p-3 bg-blue-100 text-blue-700 rounded-md font-medium">
                Submitting data...
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div>
            <label for="name" class="block text-xs font-medium text-gray-700">Name</label>
            <input type="text" id="name" v-model="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label for="campusId" class="block text-sm font-medium text-gray-700">Campus ID</label>
            <input type="text" id="campusId" v-model="campusId" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <div>
            <label for="course" class="block text-sm font-medium text-gray-700">Course</label>
            <input type="text" id="course" v-model="course" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label for="transactionType" class="block text-sm font-medium text-gray-700">Transaction Type</label>
            <input type="text" id="transactionType" v-model="transactionType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <div>
            <label for="yearLevel" class="block text-sm font-medium text-gray-700">Year Level</label>
            <input type="text" id="yearLevel" v-model="yearLevel" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label for="paymentMethod" class="block text-sm font-medium text-gray-700">Payment Method</label>
            <input type="text" id="paymentMethod" v-model="paymentMethod" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>

          <div>
            <label for="schoolYear" class="block text-sm font-medium text-gray-700">School Year</label>
            <input type="text" id="schoolYear" v-model="schoolYear" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
            <input type="text" id="amount" v-model="amount" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          
          <div class="md:col-start-2 flex items-end justify-end mt-4 md:mt-0">
            <button 
                @click="generateQR" 
                :disabled="postLoading"
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-150"
                :class="{'opacity-50 cursor-not-allowed': postLoading}"
            >
              <span v-if="postLoading">Processing...</span>
              <span v-else>Generate QR and Submit</span>
            </button>
          </div> 
          
        </div>
      </div>
      
      <div class="flex-1 md:flex-none md:w-96 p-8 bg-white rounded-lg shadow-xl text-center flex flex-col items-center justify-center mx-auto">

        <h2 class="text-xl font-semibold text-gray-800 mb-4">Scan the QR Code:</h2>
        
        <div class="w-64 h-64 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-white">
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" class="w-full h-full object-contain p-2" />
          <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            QR Code will appear here
          </div>
        </div>
        
        <div v-if="referenceCode" class="mt-4 text-center">
          <p class="text-sm text-gray-600">Reference Code:</p>
          <p class="font-mono text-lg font-bold text-gray-800">{{ referenceCode }}</p>
        </div>

      </div>

    </div>
</main>
    </div>
  </div>
</template>