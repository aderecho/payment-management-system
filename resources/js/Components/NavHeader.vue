<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['toggleSidebar']);

const upLogoPath = "/images/UPC-WEBSITE-HEADER.png";
const userAvatarUrl = ref('/images/default_avatar.jpg'); 
</script>
<template>
    
<header 
    class="w-full h-16 bg-[#8a1538] flex items-center justify-between px-5 shadow-md fixed top-0 z-30"
>

    <div class="flex items-center gap-3">
        
        <i 
            @click="$emit('toggleSidebar')" 
            class="fa-solid fa-bars  text-white text-xl cursor-pointer hover:opacity-75 transition duration-150 w-8 h-6 flex items-center justify-center"
            
            aria-label="Toggle Menu"
        ></i>
        
        <img 
            class="w-15.625 h-12 object-cover" 
            :src="upLogoPath" 
            alt="UP Seal Logo"
        >
    </div>
   

    <div class="flex items-center gap-3">
        <div class="h-[40px] flex items-center justify-end gap-2">
            
            <img 
                class="w-[40px] h-[40px] object-cover rounded-full cursor-pointer border-2 border-white" 
                :src="userAvatarUrl" 
                alt="User Profile Avatar"
                title="Click to view profile"
            >
            
            <div class="w-8 h-8 flex items-center justify-center cursor-pointer text-white hover:text-gray-200 transition">
                <svg class="w-[13.34px] h-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
</header>
</template>

