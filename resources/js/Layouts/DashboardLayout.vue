<script setup>
// Removed: import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { ref, onMounted, computed } from 'vue';
import NavHeader from '@/Components/NavHeader.vue'; 
import Sidebar from '@/Components/Sidebar.vue';
import PaymentCards from '@/Components/PaymentCards.vue'; 
import TransactionList from '@/Components/TransactionList.vue'; 
// import SVG from '@/Components/SVG.vue'; 
// Note: SVG component is imported but primarily used inside Sidebar.vue

const menuItems = [
    // UPDATED: Changed icon to use SVG key from SVG.vue
    { name: "Dashboard", icon: "Dashboard", route: "/DashboardPage" },
    { name: "Counter Payment", icon: "Counter Payment", route: "/CounterPaymentPage" },
    { name: "Transaction Log", icon: "Transaction Log", route: "/TransactionLogPage" },
];

const isSidebarOpen = ref(true); 
const isMobile = computed(() => window.innerWidth < 1024);

onMounted(() => {
    // Set initial state based on device size
    if (isMobile.value) {
        isSidebarOpen.value = false;
    } else {
        isSidebarOpen.value = true;
    }
});

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

// HANDLERS FOR MOUSE EVENTS
const openSidebarOnEnter = () => {
    // Only expand if we are not on a mobile screen
    if (!isMobile.value) {
        isSidebarOpen.value = true;
    }
};

const closeSidebarOnLeave = () => {
    // Collapse to icon view when mouse leaves, but only on desktop
    if (!isMobile.value) {
        isSidebarOpen.value = false;
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
            class="flex-1 transition-all duration-300 p-5 min-w-0" 
            :class="{ 
                'ml-[12.5rem]': isSidebarOpen, 
                'ml-[4.5rem]': !isSidebarOpen 
            }"
            >
            
            <PaymentCards />
            
            <TransactionList />
        </main>
    </div>
</div>
</template>