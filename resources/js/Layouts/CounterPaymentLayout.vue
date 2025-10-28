<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import NavHeader from '@/Components/NavHeader.vue';
import Sidebar from '@/Components/Sidebar.vue';

// **************************** DYNAMIC DATA IMPORT START ****************************
// NOTE: Assuming studentDataForAutofill is available for autofill logic
import { studentDataForAutofill } from '@/MockData.js'; 

// --- MOCK STUDENT DATA FOR AUTOFILL (Now Dynamic) ---
const studentMockData = studentDataForAutofill; 

// --- DYNAMIC DROPDOWN DATA (NEW) ---
const transactionTypes = [
    'University Enrollment Related',
    'University Library-Fees & Fines',
    'UP Cebu Facilities, Other Equipment and Vehicle Registration',
];
const paymentMethods = [
    'Cash',
    'Gcash',
    'Maya',
    'Bank Transfer',
];

// --- PURPOSE/FEE OPTIONS ---
const enrollmentOptions = [
    'Tuition Fee',
    'Residency',
    'Leave of Absence (LOA)',
];

const libraryOptions = [
    'Overdue Books',
    'Lost Books',
    'Internet Fee',
    'Alumni and Researchers Fee',
    'Non-UP (Private)',
    'Photocopy',
    'Printing',
    'Scanning',
];
// **************************** DYNAMIC DATA IMPORT END ****************************


// Menu items for the sidebar
const menuItems = [
    { name: "Dashboard", icon: "Dashboard", route: "/DashboardPage" },
    { name: "Counter Payment", icon: "Counter Payment", route: "/CounterPaymentPage" },
    { name: "Transaction Log", icon: "Transaction Log", route: "/TransactionLogPage" },
];

// **************************** UI STATE LOGIC ****************************
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

// **************************** FORM STATE ****************************
const name = ref('');
const course = ref('');
const yearLevel = ref('');
const schoolYear = ref('');
const campusId = ref('');
const email = ref(''); 
const transactionType = ref(transactionTypes[0]); 
const paymentMethod = ref(paymentMethods[0]); 
const amount = ref('');
const purpose = ref(''); // Used for all three dynamic fields (dropdown value or input text)
// --- OR FIELDS ---
const isNameOnOR = ref(true); 
const organizationNameOR = ref('');
// --- NEW REFERENCE NUMBER FIELD ---
const referenceNumber = ref('');
// **************************** END FORM STATE ****************************

// **************************** DYNAMIC PURPOSE LOGIC ****************************

// Watcher to reset the `purpose` value when `transactionType` changes
watch(transactionType, () => {
    purpose.value = ''; 
});

const purposeLabel = computed(() => {
    if (transactionType.value === 'University Enrollment Related') {
        return 'Purpose (Enrollment)';
    } else if (transactionType.value === 'University Library-Fees & Fines') {
        return 'Choose Library Fees and Fines';
    } else if (transactionType.value === 'UP Cebu Facilities, Other Equipment and Vehicle Registration') {
        return 'Name of the Activity';
    }
    return 'Purpose';
});

const purposeOptions = computed(() => {
    if (transactionType.value === 'University Enrollment Related') {
        return enrollmentOptions;
    } else if (transactionType.value === 'University Library-Fees & Fines') {
        return libraryOptions;
    }
    return []; // Empty for the text input case
});

const isPurposeDropdown = computed(() => {
    return purposeOptions.value.length > 0;
});


// **************************** AUTOFILL LOGIC ****************************
const autofillStudentData = (newCampusId) => {
    if (newCampusId) {
        const student = studentMockData.find(s => s.campusId.toUpperCase() === newCampusId.toUpperCase());
        if (student) {
            name.value = student.name;
            course.value = student.course;
            yearLevel.value = student.yearLevel;
            schoolYear.value = student.schoolYear;
            email.value = student.email || ''; 
        } else {
            // Clear fields if ID is not found 
            name.value = '';
            course.value = '';
            yearLevel.value = '';
            schoolYear.value = '';
            email.value = ''; 
        }
    } else {
        // Clear fields if the Campus ID field is cleared
        name.value = '';
        course.value = '';
        yearLevel.value = '';
        schoolYear.value ='';
        email.value = '';
    }
};

// Watcher to trigger autofill when campusId changes
watch(campusId, (newCampusId) => {
    autofillStudentData(newCampusId);
});

// **************************** PAYMENT LOGIC (SIMPLIFIED) ****************************

// Placeholder for payment images (replace with actual image URLs/paths in a real application)
const paymentImages = {
    'Gcash': 'https://via.placeholder.com/300x300?text=Gcash+QR+Code',
    'Maya': 'https://via.placeholder.com/300x300?text=Maya+QR+Code',
    'Bank Transfer': 'https://via.placeholder.com/300x300?text=Bank+Transfer+Details',
};

// Computed property to select the correct payment image/details based on method
const currentPaymentComponent = computed(() => {
    if (paymentMethod.value === 'Cash') {
        return 'Payment will be processed by the counter personnel.';
    }
    // Return the placeholder URL for the selected e-payment method
    return paymentImages[paymentMethod.value] || null; 
});

const submitPayment = () => {
    // Basic Form Validation 
    if (!campusId.value || !name.value || !transactionType.value || !paymentMethod.value || !amount.value || !email.value || !purpose.value) {
        alert('Please fill out all required fields.');
        return;
    }

    // Validation for OR Name
    if (isNameOnOR.value === false && !organizationNameOR.value.trim()) {
        alert('Please indicate the complete name of the organization/company for the Original Receipt.');
        return;
    }

    // Validation for Reference Number (NEW)
    if (paymentMethod.value !== 'Cash' && !referenceNumber.value.trim()) {
        alert('Please provide the Reference Number for your selected non-cash payment method.');
        return;
    }

    // Logging data
    console.log('Payment Submitted:', {
        campusId: campusId.value,
        name: name.value,
        transactionType: transactionType.value,
        paymentMethod: paymentMethod.value,
        amount: amount.value,
        purpose: purpose.value,
        email: email.value,
        isNameOnOR: isNameOnOR.value,
        organizationNameOR: isNameOnOR.value ? name.value : organizationNameOR.value,
        referenceNumber: referenceNumber.value, // NEW: Include reference number
    });

    // Simulated submission feedback
    alert(`Payment of ₱${amount.value} via ${paymentMethod.value} submitted successfully! (Simulated)`);
    
    // Clear the form after successful submission
    clearForm(); 
};

//Clear button
const clearForm = () => {
    // Clear student detail fields
    campusId.value = '';
    name.value = '';
    course.value = '';
    yearLevel.value = '';
    schoolYear.value = '';
    email.value = '';

    // Clear transaction fields (reset to defaults)
    transactionType.value = transactionTypes[0]; 
    paymentMethod.value = paymentMethods[0]; 
    amount.value = '';
    purpose.value = ''; 

    // Clear conditional fields
    isNameOnOR.value = true;
    organizationNameOR.value = '';
    referenceNumber.value = ''; // NEW: Clear reference number
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
                class="flex-1 transition-all duration-300 p-4 min-w-0"
                :class="{
                    'lg:ml-[12.5rem]': isSidebarOpen,
                    'lg:ml-[4.5rem]': !isSidebarOpen,
                }">

                <h1 class="text-3xl font-bold text-gray-800 mb-4 ml-2">Over the Counter Payment</h1>

                <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">

                    <div class="lg:col-span-3">

                        <div class="bg-white p-5 rounded-xl shadow-lg mb-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                
                                <div class="md:col-span-2"> 
                                    <label for="transactionType" class="block text-sm font-bold text-gray-700 mb-1">Transaction Type</label>
                                    <div class="relative">
                                        <select id="transactionType" v-model="transactionType" required
                                            class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm 
                                                   hover:border-brand-maroon-300 hover:shadow-md 
                                                   focus:ring-brand-maroon focus:border-brand-maroon 
                                                   transition duration-150 text-gray-700 pr-10">
                                            <option v-for="type in transactionTypes" :key="type" :value="type">
                                                {{ type }}
                                            </option>
                                        </select>
                                        </div>
                                </div>
                                
                                <div class="col-span-1"> 
                                    <label for="paymentMethod" class="block text-sm font-bold text-gray-700 mb-1">Payment Method</label>
                                    <div class="relative">
                                        <select id="paymentMethod" v-model="paymentMethod" required
                                            class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm 
                                                   hover:border-brand-maroon-300 hover:shadow-md
                                                   focus:ring-brand-maroon focus:border-brand-maroon 
                                                   transition duration-150 text-gray-700 pr-10">
                                            <option v-for="method in paymentMethods" :key="method" :value="method">
                                                {{ method }}
                                            </option>
                                        </select>
                                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-maroon-700">
                                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-span-1">
                                    <label for="purpose" class="block text-sm font-bold text-gray-700 mb-1">{{ purposeLabel }}</label>
                                    
                                    <div class="relative">
                                        <select v-if="isPurposeDropdown" id="purpose" v-model="purpose" required
                                            class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm 
                                                   hover:border-brand-maroon-300 hover:shadow-md 
                                                   focus:ring-brand-maroon focus:border-brand-maroon 
                                                   transition duration-150 text-gray-700 pr-10">
                                            <option value="" disabled>Select an option</option>
                                            <option v-for="opt in purposeOptions" :key="opt" :value="opt">
                                                {{ opt }}
                                            </option>
                                        </select>
                                        <input v-else type="text" id="purpose" v-model="purpose" required
                                            class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm 
                                                   focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" 
                                            :placeholder="transactionType === 'UP Cebu Facilities, Other Equipment and Vehicle Registration' ? 'e.g., UP Cebu Alumni Home Rental' : 'Enter purpose here'" />

                                        <div v-if="isPurposeDropdown" class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-maroon-700">
                                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white p-5 rounded-xl shadow-lg">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                
                                <div>
                                    <label for="campusId" class="block text-sm font-medium text-gray-700 mb-1">Campus ID</label>
                                    <input type="text" id="campusId" v-model="campusId" required
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                </div>

                                <div>
                                    <label for="schoolYear" class="block text-sm font-medium text-gray-700 mb-1">School Year</label>
                                    <input type="text" id="schoolYear" v-model="schoolYear" 
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                </div>

                                <div>
                                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" id="name" v-model="name" required 
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                </div>

                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" id="email" v-model="email" required
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                </div>

                                <div>
                                    <label for="course" class="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                    <input type="text" id="course" v-model="course" 
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                </div>

                                <div>
                                    <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <input 
                                        type="text" 
                                        id="amount" 
                                        v-model="amount" 
                                        required 
                                        inputmode="numeric"
                                        pattern="[0-9]*(\.[0-9]+)?"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" 
                                    />
                                </div>

                                <div>
                                    <label for="yearLevel" class="block text-sm font-medium text-gray-700 mb-1">Year Level</label>
                                    <input type="text" id="yearLevel" v-model="yearLevel" 
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                </div>
                                <div class="md:col-span-2 mt-4 border p-2 rounded-lg">
                                    <p class="block text-sm font-bold text-gray-700 mb-2">Does the above-mentioned name will appear on the Original Receipt (OR)? *</p>
                                    <div class="flex flex-col space-y-2">
                                        <div class="flex items-center">
                                            <input id="name-on-or-yes" name="name-on-or" type="radio" :value="true" v-model="isNameOnOR" 
                                                class="h-4 w-4 text-brand-maroon border-gray-300 focus:ring-brand-maroon">
                                            <label for="name-on-or-yes" class="ml-2 block text-sm font-medium text-gray-700">
                                                Yes
                                            </label>
                                        </div>
                                        <div class="flex items-start">
                                            <input id="name-on-or-no" name="name-on-or" type="radio" :value="false" v-model="isNameOnOR" 
                                                class="h-4 w-4 text-brand-maroon border-gray-300 focus:ring-brand-maroon mt-1">
                                            <label for="name-on-or-no" class="ml-2 block text-sm font-medium text-gray-700">
                                                No (Kindly indicate the complete name of the organization / company to be printed in the Original Receipt (OR)).
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="isNameOnOR === false" class="md:col-span-2">
                                    <label for="organizationNameOR" class="block text-sm font-bold text-yellow-600 mb-1">Indicate complete name of the organization / company to be printed in the Original Receipt (OR): *</label>
                                    <input 
                                        type="text" 
                                        id="organizationNameOR" 
                                        v-model="organizationNameOR" 
                                        required
                                        :class="{ 'border-red-500': isNameOnOR === false && !organizationNameOR.trim() }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" 
                                        placeholder="Enter your answer here"
                                    />
                                    <p v-if="isNameOnOR === false && !organizationNameOR.trim()" class="text-xs text-red-500 mt-1">This field is required.</p>
                                </div>
                                <div v-if="paymentMethod !== 'Cash'" class="md:col-span-2">
                                    <label for="referenceNumber" class="block text-sm font-bold text-gray-700 mb-1">Reference Number: *</label>
                                    <input 
                                        type="text" 
                                        id="referenceNumber" 
                                        v-model="referenceNumber" 
                                        required
                                        :class="{ 'border-red-500': paymentMethod !== 'Cash' && !referenceNumber.trim() }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" 
                                        placeholder="Enter transaction reference number"
                                    />
                                    <p v-if="paymentMethod !== 'Cash' && !referenceNumber.trim()" class="text-xs text-red-500 mt-1">
                                        The Reference Number is required for {{ paymentMethod }} payments.
                                    </p>
                                </div>
                                <div class="flex items-start md:items-end justify-start pt-3 md:pt-0">
                                    <button
                                        type="button"
                                        @click="clearForm"
                                        class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-[1.01] w-full md:w-auto"
                                    >
                                        Clear 
                                    </button>
                                </div>

                                <div class="flex items-end justify-end pt-3 md:pt-0">
                                    <button
                                        type="button"
                                        @click="submitPayment"
                                        class="bg-brand-maroon hover:bg-brand-maroon-hover text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-[1.01] w-full md:w-auto"
                                    >
                                        Submit
                                    </button>
                                </div>
                                </div>
                        </div>
                    </div>


                    <div class="lg:col-span-2 bg-white p-5 rounded-xl shadow-lg flex flex-col items-center justify-center border border-gray-100 min-h-[400px]">
                        <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
                            {{ paymentMethod === 'Cash' ? 'Cash Payment Instructions' : `Details for ${paymentMethod}` }}
                        </h2>

                        <div v-if="paymentMethod !== 'Cash' && currentPaymentComponent" 
                             class="w-full max-w-xs border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-white p-2">
                            <img :src="currentPaymentComponent" :alt="`${paymentMethod} QR/Details`" class="w-full h-auto object-contain" />
                        </div>

                        <div v-else-if="paymentMethod === 'Cash'" class="text-center p-4 text-gray-600">
                            <p class="mb-2">
                                Please present the **Campus ID**, **Email**, and the **Amount** to the counter personnel for processing. 
                            </p>
                            <p class="font-semibold text-gray-800">
                                Selected: <span class="text-brand-maroon">{{ transactionType }}</span>
                            </p>
                        </div>
                        
                        <div v-else class="w-full max-w-xs h-64 bg-gray-100 flex flex-col items-center justify-center text-gray-500 text-center text-sm p-4 rounded-lg">
                            <i class="fa-solid fa-qrcode text-4xl mb-3"></i>
                            Select a payment method to view details.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
/*
  The `appearance-none` is crucial for hiding the default arrow 
  so the custom SVG arrow (text-brand-maroon-700) is visible for #paymentMethod.
*/
#paymentMethod {
    /* Hides the native arrow for the custom SVG to appear */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
/*
  We apply appearance: none to #purpose as well IF it is rendered as a select,
  to ensure the custom arrow shows up when it's the Library or Enrollment purpose.
*/
#purpose {
    appearance: auto; /* Default for text input, but overriden if it becomes a select */
    -webkit-appearance: auto;
    -moz-appearance: auto;
}
/* This class ensures the custom arrow for dynamic purpose dropdown appears */
select[id='purpose'] {
     -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
/* #transactionType now uses browser default arrow which is cleaner */
</style>