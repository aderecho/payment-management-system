<script setup>
import { ref } from 'vue';

const cardData = ref([
    {
        title: "Student University Enrollment Related",
        value: "45,678.90",
        percentageChange: "-20% month over month",
        headerBgColor: "bg-brand-maroon", // Maroon from tailwind.config.js
        percentageColor: "text-red-600" 
    },
    {
        title: "Library-Fees and Fines",
        value: "2,405",
        percentageChange: "+33% month over month",
        headerBgColor: "bg-brand-green-dark", 
        percentageColor: "text-green-600" 
    },
    {
        title: "Facilities, Equipments & Vehicle Registration",
        value: "10,353",
        percentageChange: "-8% month over month",
        headerBgColor: "bg-brand-gold", 
        percentageColor: "text-red-600" 
    },
]);
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4 mt-16 ">
        
        <div 
            v-for="card in cardData" 
            :key="card.title"
            class="shadow-xl rounded-lg overflow-hidden" 
        >
            <div :class="card.headerBgColor" class="p-4 text-white text-sm sm:text-base md:text-lg font-semibold rounded-t-lg w-auto h-auto truncate ">
                {{ card.title }}
            </div>

            <div class="bg-white p-4 rounded-b-lg h-full">
                <p class="md:text-2xl font-extrabold mb-1">₱{{ card.value }}</p>
                <p :class="card.percentageColor" class="text-sm font-medium">{{ card.percentageChange }}</p>
            </div>
        </div>
        
    </div>
</template>