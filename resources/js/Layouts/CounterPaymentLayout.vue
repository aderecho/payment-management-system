<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios'; 
// NOTE: QRCode import is commented out. For QR generation to work, you must install 'qrcode' library: npm install qrcode
// import QRCode from 'qrcode'; 
import NavHeader from '@/Components/NavHeader.vue';
import Sidebar from '@/Components/Sidebar.vue';

// Menu items for the sidebar
const menuItems = [
    { name: "Dashboard", icon: "Dashboard", route: "/DashboardPage" },
    { name: "Counter Payment", icon: "Counter Payment", route: "/CounterPaymentPage" },
    { name: "Transaction Log", icon: "Transaction Log", route: "/TransactionLogPage" },
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

// State for API call status/messages
const postLoading = ref(false);
const postSuccess = ref(false); 
const postError = ref(null);
const messageVisible = ref(false);

// Function to close the success/error message
const closeMessage = () => {
    messageVisible.value = false;
    postSuccess.value = false;
    postError.value = null;
};

// Function to generate a random reference code
const generateReferenceCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Function to generate the QR code AND send data to API
const generateQR = async () => {
    // 1. Basic Form Validation
    if (!campusId.value || !name.value || !transactionType.value || !amount.value || !paymentMethod.value) {
        alert('Please fill out all required fields.');
        return;
    }
    
    // 2. Clear previous states and set loading
    postSuccess.value = false;
    postError.value = null;
    messageVisible.value = false; 
    postLoading.value = true;

    // 3. Generate data structure
    referenceCode.value = generateReferenceCode();

    const data = {
        campusId: campusId.value,
        name: name.value,
        course: course.value,
        yearLevel: yearLevel.value,
        schoolYear: schoolYear.value,
        transactionType: transactionType.value,
        paymentMethod: paymentMethod.value,
        amount: parseFloat(amount.value), // Ensure amount is treated as number
        referenceCode: referenceCode.value,
        // Match expected fields in TransactionList
        date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        status: 'Floating', 
    };
    
    const qrData = JSON.stringify(data);
    
    // 4. QR Code Generation (Placeholder/Requires 'qrcode' library)
    if (typeof QRCode !== 'undefined' && QRCode.toDataURL) {
        try {
            qrCodeUrl.value = await QRCode.toDataURL(qrData);
        } catch (err) {
            console.error("Error generating QR code:", err);
            qrCodeUrl.value = '';
        }
    } else {
        console.warn("QRCode library not found. Using placeholder image.");
        // Placeholder for missing library
        qrCodeUrl.value = 'data:image/png;base64,iVBORn0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; 
    }
    
    // 5. AXIOS POST: Send the payment data to the API
    try {
        const API_URL = 'http://your-backend-api.com/transactions'; 
        
        await axios.post(API_URL, data);

        postSuccess.value = true;
        
    } catch (err) {
        console.error("Error posting transaction:", err);
        postError.value = err.response?.data?.message || 'Failed to submit transaction to the server.';
        postSuccess.value = false;
    } finally {
        postLoading.value = false;
        messageVisible.value = true;
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
        class="flex-1 transition-all duration-300 p-4 min-w-0 "
          :class="{
              'ml-[12.5rem]': isSidebarOpen,
              'ml-[4.5rem]': !isSidebarOpen, 
          }">
    
        <h1 class="text-3xl font-bold text-gray-800 mb-4 ml-2">Over the Counter Payment</h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
            
            <div class="lg:col-span-3 bg-white p-5 rounded-xl shadow-lg">
                
                <div class="mb-3">
                    <div v-if="postSuccess && messageVisible" 
                         class="p-3 text-sm text-green-700 bg-green-100 rounded-lg font-medium flex justify-between items-center" 
                         role="alert">
                        
                        <span> Transaction Data Submitted! Reference: {{ referenceCode }}</span>
                        
                        <button type="button" @click="closeMessage" class="ml-4 text-green-700 hover:text-green-900 focus:outline-none">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    
                    <div v-else-if="postError && messageVisible" 
                         class="p-3 text-sm text-red-700 bg-red-100 rounded-lg font-medium flex justify-between items-center" 
                         role="alert">
                        
                        <span> Submission Failed: {{ postError }}</span>
                        
                        <button type="button" @click="closeMessage" class="ml-4 text-red-700 hover:text-red-900 focus:outline-none">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <form @submit.prevent="generateQR">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        
                        <div class="mb-4 md:mb-0">
                            <label for="campusId" class="block text-sm font-medium text-gray-700 mb-1">Campus ID</label>
                            <input type="text" id="campusId" v-model="campusId" required
                                class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
                        </div>
                        
                        <div class="hidden md:block"></div> 
                        
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" id="name" v-model="name" required
                                class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                        </div>
                        
                        <div>
                            <label for="transactionType" class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                            <input type="text" id="transactionType" v-model="transactionType" required
                                class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
                        </div>

                        <div>
                            <label for="course" class="block text-sm font-medium text-gray-700 mb-1">Course</label>
                            <input type="text" id="course" v-model="course" 
                                class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
                        </div>
                        
                        <div>
                            <label for="referenceCode" class="block text-sm font-medium text-gray-700 mb-1">Reference Code</label>
                            <input type="text" id="referenceCode" :value="referenceCode" readonly disabled
                                class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed transition duration-150" placeholder="Auto-Generated on Submit" />
                        </div>

                        <div>
                            <label for="yearLevel" class="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
                            <input type="text" id="yearLevel" v-model="yearLevel" 
                                class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
                        </div>
                        
                        <div>
                            <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount (₱)</label>
                            <input type="number" id="amount" v-model="amount" required min="0"
                                class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
                        </div>

                        <div>
                            <label for="schoolYear" class="block text-sm font-medium text-gray-700 mb-1">School Year</label>
                            <input type="text" id="schoolYear" v-model="schoolYear" 
                                class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" />
                        </div>
                        
                        <div>
                            <label for="paymentMethod" class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                            <select id="paymentMethod" v-model="paymentMethod" required
                                class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-700">
                                <option value="" disabled>Select Mode of Payment</option>
                                <option value="Cash">Cash</option>
                                <option value="Maya">Maya</option>
                                <option value="Gcash">Gcash</option>
                                <option value="Credit Card">Bank Transfer</option>
                            </select>
                        </div>
                        
                        <div class="md:col-start-2 flex items-end justify-end pt-3 md:pt-0">
                            <button 
                                type="submit" 
                                :disabled="postLoading"
                                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-[1.01] flex items-center"
                                :class="{'opacity-50 cursor-not-allowed': postLoading}"
                            >
                                <span v-if="postLoading">Processing...</span>
                                <span v-else>Generate QR and Submit</span>
                                <i class="fa-solid fa-arrow-right-to-bracket ml-2" v-if="!postLoading"></i>
                            </button>
                        </div>

                    </div>
                </form>
            </div>
            <div class="lg:col-span-2 bg-white p-5 rounded-xl shadow-lg flex flex-col items-center justify-center border border-gray-100">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Scan the QR Code:</h2>
                
                <div class="w-full max-w-[200px] h-[200px] border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                    <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" class="w-full h-full object-contain p-2" />
                    <div v-else class="w-full h-full bg-gray-200 flex flex-col items-center justify-center text-gray-500 text-center text-sm p-4">
                        QR Code will appear here after submission.
                    </div>
                </div>

                <div v-if="referenceCode" class="mt-4 text-center">
                    <p class="text-sm text-gray-600">Generated Reference Code:</p>
                    <p class="font-mono text-lg font-bold text-gray-800 break-all">{{ referenceCode }}</p>
                </div>
            </div>

        </div>
    </main>
    </div>
  </div>
</template>