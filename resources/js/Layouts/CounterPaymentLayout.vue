<script setup>
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ref, onMounted, computed } from 'vue';
import NavHeader from '@/Components/NavHeader.vue'; 
import Sidebar from '@/Components/Sidebar.vue';

const menuItems = [
    { name: "Dashboard", icon: "fa-solid fa-table-cells-large", route: "/DashboardPage" },
    { name: "Counter Payment", icon: "fa-solid fa-boxes-packing", route: "/CounterPayment" },
    { name: "Transaction Log", icon: "fa-solid fa-file-export", route: "/transaction-log" },
];

const isSidebarOpen = ref(false); 
const isMobile = computed(() => window.innerWidth < 1024);

onMounted(() => {
    isSidebarOpen.value = false;
});

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
    <!-- <h1>hello</h1> -->

<div class="min-h-screen bg-gray-100 flex flex-col">
    <NavHeader @toggleSidebar="toggleSidebar" />
    
    <div class="flex-1 flex">
        
        <Sidebar 
            :menu-items="menuItems" 
            :is-sidebar-open="isSidebarOpen"
        />

        <main class="flex-1 transition-all duration-300 p-5 min-w-0">
        
        </main>
    </div>
</div>
</template>