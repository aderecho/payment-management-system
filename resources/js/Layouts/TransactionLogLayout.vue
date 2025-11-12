<script setup>
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ref, onMounted, computed } from 'vue';
import NavHeader from '@/Components/NavHeader.vue'; 
import Sidebar from '@/Components/Sidebar.vue';
// import TransactionMockData from '@/Components/TransactionList/TransactionMockData.vue';
import TransactionListAxios from '@/Components/TransactionList/TransactionListAxios.vue';

const menuItems = [
    { name: "Dashboard", icon: "Dashboard", route: "/DashboardPage" },
    { name: "Counter Payment", icon: "Counter Payment", route: "/CounterPaymentPage" },
    { name: "Transaction Log", icon: "Transaction Log", route: "/TransactionLogPage" },
];

const isSidebarOpen = ref(false); 
const isMobile = computed(() => window.innerWidth < 1024);

onMounted(() => {
    if(isMobile.value){
        isSidebarOpen.value = false;
    } else{
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

const closeSidebarOnLeave = () =>{
    if(!isMobile.value){
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
            class="flex-1 transition-all duration-300 p-5 min-w-0 mt-16"
            :class="{ 
                'ml-[12.5rem]': isSidebarOpen, 
                'ml-[4.5rem]': !isSidebarOpen 
            }">

    
            
            <!-- <TransactionMockData /> -->
            <TransactionListAxios />
          
             
        </main>
        
    </div>
</div>
</template>