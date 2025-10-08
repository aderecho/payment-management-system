<script setup>
import { defineProps, defineEmits } from 'vue';
import { Link, usePage } from "@inertiajs/vue3";
// ADDED: Import the SVG component
import SVG from '@/Components/SVG.vue'; 

const props = defineProps({
    menuItems: {
        type: Array,
        required: true,
    },
    isSidebarOpen: {
        type: Boolean,
        required: true,
    }
});

// Define emits for mouse events to communicate with the parent
const emit = defineEmits(['mouseenter', 'mouseleave']);

const page = usePage();

const isActive = (route) => page.url.startsWith(route);
</script>

<template>
    <aside 
        :class="[
            'bg-white shadow-lg transition-all duration-300 ease-in-out z-30',
            // Use width classes for collapsed/expanded states
            props.isSidebarOpen ? 'w-49' : 'w-16', 
            'fixed top-16 bottom-0' 
        ]"
        class="h-screen"
        
        @mouseenter="emit('mouseenter')"
        @mouseleave="emit('mouseleave')"
    >
        <ul class="py-7 font-semibold space-y-2 h-full overflow-hidden">
            <li v-for="item in menuItems" :key="item.name" class="rounded-md">
                <Link 
                    :href="item.route" 
                    :class="{'bg-[#D9D9D9]': isActive(item.route)}"
                    class="flex items-center gap-3 text-[#3A3434] py-4 px-4 mx-1 rounded-md hover:bg-[#D9D9D9] transition-colors duration-200"
                >
                    <SVG 
                        :icon-name="item.icon" 
                        container-class="w-6 h-6 text-[#3A3434] text-base"
                    />
                    
                    <span 
                        :class="{'opacity-100 max-w-xs': isSidebarOpen, 'opacity-0 max-w-0': !isSidebarOpen}"
                        class="text-base whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out"
                    >
                        {{ item.name }}
                    </span>
                </Link>
            </li>
        </ul>
    </aside>
</template>