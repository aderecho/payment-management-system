<script setup>
import { defineProps } from 'vue';
import { Link, usePage } from "@inertiajs/vue3";

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

const page = usePage();

const isActive = (route) => page.url.startsWith(route);
</script>

<template>
    <aside 
        :class="[
            'w-49 bg-white shadow-lg transition-transform duration-300 ease-in-out z-30',
            // Use transform to slide it in and out
            {'transform -translate-x-full': !isSidebarOpen, 'transform translate-x-0': isSidebarOpen},
            'fixed top-16 bottom-0' 
        ]"
        class="h-screen "
    >
        <ul class="py-7 font-semibold space-y-2 h-full">
            <li v-for="item in menuItems" :key="item.name" class="rounded-md">
                <Link 
                    :href="item.route" 
                    :class="{'bg-[#D9D9D9]': isActive(item.route)}"
                    class="flex items-center gap-3 text-[#3A3434] py-4 px-4 mx-3 rounded-md hover:bg-[#D9D9D9]"
                >
                    <i :class="[item.icon, 'text-base']"></i>
                    <span class="text-base">{{ item.name }}</span>
                </Link>
            </li>
        </ul>
    </aside>
</template>