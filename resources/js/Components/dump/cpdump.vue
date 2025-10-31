<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import NavHeader from '@/Components/NavHeader.vue';
import Sidebar from '@/Components/Sidebar.vue';

// --- DATA: Mock/Dropdown Values ---
// Import should be handled by the original setup, assume it's working
import { studentDataForAutofill } from '@/MockData.js'; 

const studentMockData = studentDataForAutofill; 

// Transaction type options for the main dropdown
const transactionTypes = [
    'University Enrollment Related',
    'University Library-Fees & Fines',
    'UP Cebu Facilities, Other Equipment and Vehicle Registration',
];
// Payment method options
const paymentMethods = [
    'Cash',
    'Gcash',
    'Maya',
    'Bank Transfer',
];

// Sub-options for the 'Purpose' field, dependent on transaction type
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

// Sidebar configuration
const menuItems = [
    { name: "Dashboard", icon: "Dashboard", route: "/DashboardPage" },
    { name: "Counter Payment", icon: "Counter Payment", route: "/CounterPaymentPage" },
    { name: "Transaction Log", icon: "Transaction Log", route: "/TransactionLogPage" },
];

// --- UI STATE LOGIC ---
const isSidebarOpen = ref(true);
// Determines if the user is on a mobile viewport
const isMobile = computed(() => window.innerWidth < 1024);

onMounted(() => {
    // Closes sidebar by default on mobile on load
    if (isMobile.value) {
        isSidebarOpen.value = false;
    } else {
        isSidebarOpen.value = true;
    }
});

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

// Opens sidebar on hover for non-mobile viewports (mini-mode functionality)
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

// --- FORM STATE ---
const name = ref('');
const course = ref('');
const yearLevel = ref('');
const schoolYear = ref('');
const campusId = ref('');
const email = ref(''); 
const transactionType = ref(transactionTypes[0]); 
const paymentMethod = ref(paymentMethods[0]); 
const amount = ref('');
const purpose = ref(''); 

// OR (Official Receipt) Fields
const isNameOnOR = ref(true); 
const organizationNameOR = ref('');
// **FIELD** for Facilities transaction type
const facilitiesReferenceNumber = ref('');
const referenceNumber = ref(''); // For Payment Method Reference Number

// --- VALIDATION STATE ---
// Object to hold error messages for inline display
const validationErrors = ref({}); 

// ** MODAL STATE**
const showSummaryModal = ref(false);

// --- DYNAMIC FIELD LOGIC ---

// Computed property to determine field requirements based on transactionType
const fieldRequirements = computed(() => {
    const type = transactionType.value;
    const isEnrollment = type === 'University Enrollment Related';
    const isLibrary = type === 'University Library-Fees & Fines';
    const isFacilities = type === 'UP Cebu Facilities, Other Equipment and Vehicle Registration';

    return {
        isEnrollment,
        isLibrary,
        isFacilities,
        // Fields with required status: [required, label]
        campusId: { 
            required: isEnrollment,
            label: 'Campus ID', 
            optionalLabel: 'Campus ID ',
        },
        name: { 
            required: true, 
            label: 'Name',
        },
        courseYearSchoolYear: { 
            required: isEnrollment,
            label: 'Course, Year Level, School Year',
            optionalLabel: 'Course, Year Level, School Year ',
        },
        email: { 
            required: true,
            label: 'Email',
            optionalLabel: 'Email ',
        },
        facilitiesReferenceNumber: {
            required: isFacilities,
            label: 'Reference Number (from approved reservation form)',
        },
        // Amount is always required per the prompt for all three types
        amount: { 
            required: true, 
            label: 'Amount',
        },
    };
});

// Reset conditional fields when main 'transactionType' changes
watch(transactionType, () => {
    purpose.value = ''; 
    facilitiesReferenceNumber.value = ''; // Clear facilities-specific field
});

// Dynamically changes the label for the 'Purpose' field
const purposeLabel = computed(() => {
    if (transactionType.value === 'University Enrollment Related') {
        return 'Purpose';
    } else if (transactionType.value === 'University Library-Fees & Fines') {
        return 'Choose Library Fees and Fines';
    } else if (transactionType.value === 'UP Cebu Facilities, Other Equipment and Vehicle Registration') {
        return 'Name of the Activity';
    }
    return 'Purpose';
});

// Provides dropdown options based on the selected transaction type
const purposeOptions = computed(() => {
    if (transactionType.value === 'University Enrollment Related') {
        return enrollmentOptions;
    } else if (transactionType.value === 'University Library-Fees & Fines') {
        return libraryOptions;
    }
    return []; // Returns empty array for the text input case
});

// Determines if the 'Purpose' field should be a dropdown or a text input
const isPurposeDropdown = computed(() => {
    return purposeOptions.value.length > 0;
});
// --- AUTOFILL LOGIC (no change, but remains to show full context) ---
const autofillStudentData = (newCampusId) => {
    if (newCampusId) {
        // Find student in mock data, case-insensitive check
        const student = studentMockData.find(s => s.campusId.toUpperCase() === newCampusId.toUpperCase());
        if (student) {
            // Populate fields if student is found
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
        // Clear fields if the Campus ID input is cleared
        if (!fieldRequirements.value.name.required) name.value = ''; // Only clear if name isn't required by other logic
        if (!fieldRequirements.value.email.required) email.value = ''; // Only clear if email isn't required by other logic
        course.value = '';
        yearLevel.value = '';
        schoolYear.value ='';
    }
};

// Trigger autofill on every change to campusId
watch(campusId, (newCampusId) => {
    autofillStudentData(newCampusId);
});

// --- PAYMENT/SUBMISSION LOGIC ---

// Mock payment component URLs (QR codes, bank details, etc.)
const paymentImages = {
    'Gcash': 'https://via.placeholder.com/300x300?text=Gcash+QR+Code',
    'Maya': 'https://via.placeholder.com/300x300?text=Maya+QR+Code',
    'Bank Transfer': 'https://via.placeholder.com/300x300?text=Bank+Transfer+Details',
};

// Returns the relevant image URL or a message based on the payment method
const currentPaymentComponent = computed(() => {
    if (paymentMethod.value === 'Cash') {
        return 'Payment will be processed by the counter personnel.';
    }
    return paymentImages[paymentMethod.value] || null; 
});

// **UPDATED VALIDATION LOGIC**
const validateForm = () => {
    // 1. Clear previous errors
    validationErrors.value = {};
    let isValid = true;
    const reqs = fieldRequirements.value;

    // 2. Helper for validation
    const validateField = (fieldKey, value, isRequired, errorMessage) => {
        if (isRequired && (!value || (typeof value === 'string' && !value.trim()))) {
            validationErrors.value[fieldKey] = errorMessage;
            isValid = false;
        }
    };
    
    // --- General Required Fields ---
    validateField('transactionType', transactionType.value, true, 'Transaction Type is required.');
    validateField('paymentMethod', paymentMethod.value, true, 'Payment Method is required.');
    validateField('purpose', purpose.value, true, 'This is required.');
    
    // Amount validation is complex, so keep it separate for precision
    if (!amount.value || isNaN(parseFloat(amount.value)) || parseFloat(amount.value) <= 0) {
        validationErrors.value.amount = 'Amount must be a valid number greater than zero.';
        isValid = false;
    }
    
    // --- Dynamic Personal/Transaction Info Fields ---
    
    // Name is REQUIRED for ALL types based on the prompt
    validateField('name', name.value, true, 'Name is required.');
    
    // Campus ID
    validateField('campusId', campusId.value, reqs.campusId.required, 'Campus ID is required.');
    
    // Email
    validateField('email', email.value, reqs.email.required, 'Email is required.');
    
    // Course, Year Level, School Year
    if (reqs.courseYearSchoolYear.required) {
        validateField('course', course.value, true, 'Course is required.');
        validateField('yearLevel', yearLevel.value, true, 'Year Level is required.');
        validateField('schoolYear', schoolYear.value, true, 'School Year is required.');
    }

    // Facilities-specific Reference Number
    if (reqs.isFacilities) {
        validateField('facilitiesReferenceNumber', facilitiesReferenceNumber.value, true, 'Reference Number from approved reservation form is required.');
    }

    // --- Conditional OR Name validation ---
    if (isNameOnOR.value === false && !organizationNameOR.value.trim()) {
        validationErrors.value.organizationNameOR = 'Organization/company name is required for the Original Receipt (OR).';
        isValid = false;
    }

    // --- Conditional Payment Reference Number validation ---
    if (paymentMethod.value !== 'Cash' && !referenceNumber.value.trim()) {
        validationErrors.value.referenceNumber = `Payment Reference Number is required for ${paymentMethod.value} payments.`;
        isValid = false;
    }
    
    return isValid;
};

// **NEW:** Function to show the modal on successful client-side validation
const openSummaryModal = () => {
    if (validateForm()) {
        showSummaryModal.value = true;
    } else {
        // Stop submission and rely on inline errors
        // Optional: Scroll to the first error element for better UX
        const firstErrorEl = document.querySelector('.border-red-500');
        if (firstErrorEl) {
            firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

// **NEW:** Function to handle the final submission from inside the modal
const confirmPayment = () => {
    // Log the data before simulated submission
    console.log('Payment Confirmed and Submitted:', {
        transactionType: transactionType.value,
        paymentMethod: paymentMethod.value,
        purpose: purpose.value,
        amount: amount.value,
        // Facilities Ref is only included if applicable
        facilitiesReferenceNumber: fieldRequirements.value.isFacilities ? facilitiesReferenceNumber.value : undefined,
        // Personal Info: Use a consistent structure
        campusId: campusId.value,
        name: name.value,
        course: course.value, 
        yearLevel: yearLevel.value, 
        schoolYear: schoolYear.value, 
        email: email.value,
        // OR Info
        nameOnOR: isNameOnOR.value ? name.value : organizationNameOR.value,
        isNameOnOR: isNameOnOR.value,
        organizationNameOR: organizationNameOR.value,
        // Payment Ref Info
        paymentReferenceNumber: referenceNumber.value, 
    });

    // Simulated submission feedback
    alert(`Payment of ₱${amount.value} via ${paymentMethod.value} submitted successfully! (Simulated)`);
    
    // Close modal and clear form
    showSummaryModal.value = false;
    clearForm(); 
};

// **Original clearForm function**
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
    referenceNumber.value = '';
    facilitiesReferenceNumber.value = '';

    // Clear validation errors when clearing the form
    validationErrors.value = {};
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
                            <h2 class="text-xl font-semibold text-gray-800 mb-4">Transaction Details</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                
                                <div class="md:col-span-2"> 
                                    <label for="transactionType" class="block text-sm font-bold text-gray-700 mb-1">Transaction Type</label>
                                    <div class="relative">
                                        <select id="transactionType" v-model="transactionType" required
                                            :class="{ 'border-red-500': validationErrors.transactionType }"
                                            class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm 
                                                    hover:border-brand-maroon-300 hover:shadow-md 
                                                    focus:ring-brand-maroon focus:border-brand-maroon 
                                                    transition duration-150 text-gray-700 pr-10">
                                            <option v-for="type in transactionTypes" :key="type" :value="type">
                                                {{ type }}
                                            </option>
                                        </select>
                                    </div>
                                    <p v-if="validationErrors.transactionType" class="text-xs text-red-500 mt-1">{{ validationErrors.transactionType }}</p>
                                </div>
                                
                                <div class="col-span-1"> 
                                    <label for="paymentMethod" class="block text-sm font-bold text-gray-700 mb-1">Payment Method</label>
                                    <div class="relative">
                                        <select id="paymentMethod" v-model="paymentMethod" required
                                            :class="{ 'border-red-500': validationErrors.paymentMethod }"
                                            class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm 
                                                    hover:border-brand-maroon-300 hover:shadow-md
                                                    focus:ring-brand-maroon focus:border-brand-maroon 
                                                    transition duration-150 text-gray-700 pr-10">
                                            <option v-for="method in paymentMethods" :key="method" :value="method">
                                                {{ method }}
                                            </option>
                                        </select>
                                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-maroon-700">
                                        </div>
                                    </div>
                                    <p v-if="validationErrors.paymentMethod" class="text-xs text-red-500 mt-1">{{ validationErrors.paymentMethod }}</p>
                                </div>
                                
                                <div class="col-span-1">
                                    <label for="purpose" class="block text-sm font-bold text-gray-700 mb-1">{{ purposeLabel }}</label>
                                    
                                    <div class="relative">
                                        <select v-if="isPurposeDropdown" id="purpose" v-model="purpose" required
                                            :class="{ 'border-red-500': validationErrors.purpose }"
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
                                            :class="{ 'border-red-500': validationErrors.purpose }"
                                            class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm 
                                                    focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" 
                                            :placeholder="transactionType === 'UP Cebu Facilities, Other Equipment and Vehicle Registration' ? 'e.g., UP Cebu Alumni Home Rental' : 'Enter purpose here'" />

                                        <div v-if="isPurposeDropdown" class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-maroon-700">
                                        </div>
                                    </div>
                                    <p v-if="validationErrors.purpose" class="text-xs text-red-500 mt-1">{{ validationErrors.purpose }}</p>
                                </div>

                                <div v-if="fieldRequirements.isFacilities" class="md:col-span-2">
                                    <label for="facilitiesReferenceNumber" class="block text-sm font-bold text-gray-700 mb-1">
                                        {{ fieldRequirements.facilitiesReferenceNumber.label }} <span class="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="facilitiesReferenceNumber" 
                                        v-model="facilitiesReferenceNumber" 
                                        required
                                        :class="{ 'border-red-500': validationErrors.facilitiesReferenceNumber }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" 
                                        placeholder="Enter the reservation reference number"
                                    />
                                    <p v-if="validationErrors.facilitiesReferenceNumber" class="text-xs text-red-500 mt-1">
                                        {{ validationErrors.facilitiesReferenceNumber }}
                                    </p>
                                </div>

                                <div class="col-span-1">
                                    <label for="amount" class="block text-sm font-bold text-gray-700 mb-1">Amount <span class="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        id="amount" 
                                        v-model="amount" 
                                        required 
                                        inputmode="numeric"
                                        pattern="[0-9]*(\.[0-9]+)?"
                                        :class="{ 'border-red-500': validationErrors.amount }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" 
                                    />
                                    <p v-if="validationErrors.amount" class="text-xs text-red-500 mt-1">{{ validationErrors.amount }}</p>
                                </div>
                                
                            </div>
                        </div>

                        <div class="bg-white p-5 rounded-xl shadow-lg">
                            <h2 class="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                
                                <div>
                                    <label for="campusId" class="block text-sm font-medium text-gray-700 mb-1">
                                        {{ fieldRequirements.campusId.required ? 'Campus ID' : 'Campus ID' }}
                                    </label>
                                    <input type="text" id="campusId" v-model="campusId" 
                                        :required="fieldRequirements.campusId.required"
                                        :class="{ 'border-red-500': validationErrors.campusId && fieldRequirements.campusId.required }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                    <p v-if="validationErrors.campusId && fieldRequirements.campusId.required" class="text-xs text-red-500 mt-1">{{ validationErrors.campusId }}</p>
                                </div>

                                 <div :class="{ 'opacity-50': !fieldRequirements.courseYearSchoolYear.required }">
                                    <label for="course" class="block text-sm font-medium text-gray-700 mb-1">
                                        {{ fieldRequirements.courseYearSchoolYear.required ? 'Course *' : 'Course ' }}
                                    </label>
                                    <input type="text" id="course" v-model="course" 
                                        :required="fieldRequirements.courseYearSchoolYear.required"
                                        :class="{ 'border-red-500': validationErrors.course && fieldRequirements.courseYearSchoolYear.required }" 
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                    <p v-if="validationErrors.course && fieldRequirements.courseYearSchoolYear.required" class="text-xs text-red-500 mt-1">{{ validationErrors.course }}</p>
                                </div>

                                <div class="col-span-1">
                                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name <span class="text-red-500">*</span></label>
                                    <input type="text" id="name" v-model="name" required 
                                        :class="{ 'border-red-500': validationErrors.name }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                    <p v-if="validationErrors.name" class="text-xs text-red-500 mt-1">{{ validationErrors.name }}</p>
                                </div>

                                <div :class="{ 'opacity-50': !fieldRequirements.courseYearSchoolYear.required }">
                                    <label for="yearLevel" class="block text-sm font-medium text-gray-700 mb-1">
                                        {{ fieldRequirements.courseYearSchoolYear.required ? 'Year Level *' : 'Year Level' }}
                                    </label>
                                    <input type="text" id="yearLevel" v-model="yearLevel" 
                                        :required="fieldRequirements.courseYearSchoolYear.required"
                                        :class="{ 'border-red-500': validationErrors.yearLevel && fieldRequirements.courseYearSchoolYear.required }" 
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                    <p v-if="validationErrors.yearLevel && fieldRequirements.courseYearSchoolYear.required" class="text-xs text-red-500 mt-1">{{ validationErrors.yearLevel }}</p>
                                </div>

                                <div>
                                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                                        {{ fieldRequirements.email.required ? 'Email *' : 'Email' }}
                                    </label>
                                    <input type="email" id="email" v-model="email" 
                                        :required="fieldRequirements.email.required"
                                        :class="{ 'border-red-500': validationErrors.email && fieldRequirements.email.required }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                    <p v-if="validationErrors.email && fieldRequirements.email.required" class="text-xs text-red-500 mt-1">{{ validationErrors.email }}</p>
                                </div>
                            
                                <div :class="{ 'opacity-50': !fieldRequirements.courseYearSchoolYear.required }">
                                    <label for="schoolYear" class="block text-sm font-medium text-gray-700 mb-1">
                                        {{ fieldRequirements.courseYearSchoolYear.required ? 'School Year *' : 'School Year' }}
                                    </label>
                                    <input type="text" id="schoolYear" v-model="schoolYear" 
                                        :required="fieldRequirements.courseYearSchoolYear.required"
                                        :class="{ 'border-red-500': validationErrors.schoolYear && fieldRequirements.courseYearSchoolYear.required }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" />
                                    <p v-if="validationErrors.schoolYear && fieldRequirements.courseYearSchoolYear.required" class="text-xs text-red-500 mt-1">{{ validationErrors.schoolYear }}</p>
                                </div>
                                
                                
                                
                                <div class="md:col-span-2 mt-4 border p-2 rounded-lg bg-gray-50">
                                    <p class="block text-sm font-bold text-gray-700 mb-2">Does the above-mentioned name will appear on the Original Receipt (OR)?</p>
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
                                                No (Kindly indicate the complete name of the organization / company to be printed in the Original Receipt (OR).
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="isNameOnOR === false" class="md:col-span-2">
                                    <label for="organizationNameOR" class="block text-sm font-bold text-yellow-600 mb-1">Organization / Company Name for OR <span class="text-red-500">*</span>:</label>
                                    <input 
                                        type="text" 
                                        id="organizationNameOR" 
                                        v-model="organizationNameOR" 
                                        required
                                        :class="{ 'border-red-500': validationErrors.organizationNameOR }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" 
                                        placeholder="Enter the complete name for the receipt"
                                    />
                                    <p v-if="validationErrors.organizationNameOR" class="text-xs text-red-500 mt-1">{{ validationErrors.organizationNameOR }}</p>
                                </div>

                                <div v-if="paymentMethod !== 'Cash'" class="md:col-span-2">
                                    <label for="referenceNumber" class="block text-sm font-bold text-gray-700 mb-1">
                                        Payment Reference Number / Transaction ID: (Required for {{ paymentMethod }}) <span class="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        id="referenceNumber" 
                                        v-model="referenceNumber" 
                                        required
                                        :class="{ 'border-red-500': validationErrors.referenceNumber }"
                                        class="p-2 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-brand-maroon focus:border-brand-maroon transition duration-150" 
                                        placeholder="Enter transaction reference number"
                                    />
                                    <p v-if="validationErrors.referenceNumber" class="text-xs text-red-500 mt-1">
                                        {{ validationErrors.referenceNumber }}
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
                                        @click="openSummaryModal"
                                        class="bg-brand-maroon hover:bg-brand-maroon-hover text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 transform hover:scale-[1.01] w-full md:w-auto"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                         <div class="lg:col-span-2 bg-white p-5 rounded-xl shadow-lg flex flex-col items-center justify-center border border-gray-100 h-screen sticky top-0">
                    <!-- <div class="lg:col-span-5 bg-white p-5 rounded-xl shadow-lg flex flex-col items-center justify-center border border-gray-100 min-h-[400px] sticky top-4"> -->
                        <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
                            {{ paymentMethod === 'Cash' ? 'Cash Payment Instructions' : `Scan QR Code: ${paymentMethod}` }}
                        </h2>

                        <div v-if="paymentMethod !== 'Cash' && currentPaymentComponent" 
                             class="w-full max-w-xs border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-white p-2">
                            <img :src="currentPaymentComponent" :alt="`${paymentMethod} QR/Details`" class="w-full h-auto object-contain" />
                        </div>

                        <div v-else-if="paymentMethod === 'Cash'" class="text-center p-4 text-gray-600">
                            <p class="mb-2 text-lg font-medium">
                                Payment will be processed by the counter personnel.
                            </p>
                            <p class="font-semibold text-gray-800 text-sm">
                                Transaction Type: <span class="text-brand-maroon">{{ transactionType }}</span>
                            </p>
                            <p class="text-sm">
                                Please bring the exact cash amount.
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

        <div v-if="showSummaryModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showSummaryModal = false"></div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-brand-maroon-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg class="h-6 w-6 text-brand-maroon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                                <h3 class="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                                    Payment Summary and Confirmation
                                </h3>
                                <div class="mt-2 text-sm text-gray-500">
                                    <p class="mb-3">Please <strong>review the details below carefully</strong> before confirming the payment submission.</p>

                                    <dl class="divide-y divide-gray-100 border rounded-lg p-2 text-gray-700">
                                        <div class="py-2 flex justify-between">
                                            <dt class="font-medium text-gray-900">Transaction Type</dt>
                                            <dd class="text-right font-semibold">{{ transactionType }}</dd>
                                        </div>
                                        <div class="py-2 flex justify-between">
                                            <dt class="font-medium text-gray-900">Purpose</dt>
                                            <dd class="text-right">{{ purpose }}</dd>
                                        </div>
                                        <div class="py-2 flex justify-between">
                                            <dt class="font-bold text-lg text-brand-maroon">Amount Due</dt>
                                            <dd class="text-right font-bold text-lg text-brand-maroon">₱{{ parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</dd>
                                        </div>
                                        <div class="py-2 flex justify-between">
                                            <dt class="font-medium text-gray-900">Payment Method</dt>
                                            <dd class="text-right">{{ paymentMethod }}</dd>
                                        </div>
                                        <div v-if="paymentMethod !== 'Cash' && referenceNumber" class="py-2 flex justify-between text-xs">
                                            <dt class="font-medium text-gray-700">Payment Ref #</dt>
                                            <dd class="text-right break-words max-w-[50%]">{{ referenceNumber }}</dd>
                                        </div>
                                        <div v-if="fieldRequirements.isFacilities && facilitiesReferenceNumber" class="py-2 flex justify-between text-xs">
                                            <dt class="font-medium text-gray-700">Facilities Ref #</dt>
                                            <dd class="text-right break-words max-w-[50%]">{{ facilitiesReferenceNumber }}</dd>
                                        </div>
                                        <div class="py-2 flex justify-between">
                                            <dt class="font-medium text-gray-900">Name on OR</dt>
                                            <dd class="text-right">
                                                {{ isNameOnOR ? name : organizationNameOR }}
                                                <span v-if="!isNameOnOR" class="block text-xs text-yellow-600">(Organization)</span>
                                            </dd>
                                        </div>
                                        <div v-if="campusId" class="py-2 flex justify-between text-xs">
                                            <dt class="font-medium text-gray-700">Campus ID</dt>
                                            <dd class="text-right">{{ campusId }}</dd>
                                        </div>
                                        <div v-if="email" class="py-2 flex justify-between text-xs">
                                            <dt class="font-medium text-gray-700">Email</dt>
                                            <dd class="text-right break-words max-w-[50%]">{{ email }}</dd>
                                        </div>
                                    </dl>

                                    <div class="mt-4 p-2 bg-red-50 border-l-4 border-red-400 text-red-700">
                                        IMPORTANT: Clicking (Confirm Payment) registers the transaction. Ensure payment is already made for non-cash methods.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button 
                            type="button" 
                            @click="confirmPayment"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-150">
                            Confirm Payment
                        </button>
                        <button 
                            type="button" 
                            @click="showSummaryModal = false"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-150">
                            Cancel / Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Ensure custom SVG arrow is visible by hiding the native one for select elements */
#paymentMethod, select[id='purpose'] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
/* Utility class to visually highlight optional fields (if you want this, otherwise remove) */
.opacity-50 {
    opacity: 0.90;
}
</style>