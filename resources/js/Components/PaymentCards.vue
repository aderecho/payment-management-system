<script setup>
import { ref } from 'vue';

const cardData = ref([
    {
        title: "Student Payment",
        value: "45,678.90",
        percentageChange: "-20% month over month",
        headerBgColor: "bg-[#8a1538]", // Maroon
        percentageColor: "text-red-600" // Adjusted for better visibility on white background
    },
    {
        title: "Vehicle Payment",
        value: "2,405",
        percentageChange: "+33% month over month",
        headerBgColor: "bg-[#0f6b4d]", // Dark Green
        percentageColor: "text-green-600" // Adjusted for better visibility on white background
    },
    {
        title: "Rent Payment",
        value: "10,353",
        percentageChange: "-8% month over month",
        headerBgColor: "bg-[#ffae1a]", // Yellow/Orange
        percentageColor: "text-red-600" // Adjusted for better visibility on white background
    },
]);
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 mt-16 ">
        
        <div 
            v-for="card in cardData" 
            :key="card.title"
            class="shadow-xl rounded-lg overflow-hidden" 
        >
            <div :class="card.headerBgColor" class="p-4 text-white text-lg font-semibold rounded-t-lg">
                {{ card.title }}
            </div>

            <div class="bg-white p-4 rounded-b-lg">
                <p class="text-4xl font-extrabold mb-1">₱{{ card.value }}</p>
                <p :class="card.percentageColor" class="text-sm font-medium">{{ card.percentageChange }}</p>
            </div>
        </div>
        
    </div>
</template>