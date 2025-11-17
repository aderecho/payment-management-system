<script setup>
import { ref, defineEmits, defineProps } from 'vue';

const emit = defineEmits(['toggleSidebar']);

// 1. Define Props to accept user data dynamically
const props = defineProps({
    user: {
        type: Object,
        default: () => ({
            name: 'User Name',
            avatarUrl: '/images/default_avatar.jpg',
            email: 'user@upcebu.edu.ph',
        })
    }
});

const upLogoPath = "/images/UPC-WEBSITE-HEADER.png";
const AvatarSample = "/images/AvatarSample.png";
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const handleLogout = () => {
    console.log(`Log Out initiated for ${props.user.name}.`);
    isDropdownOpen.value = false;
    
    console.warn('Simulating logging out...'); 
};

const userAvatarUrl = ref(props.user.avatarUrl); 
</script>

<template>
    <header 
        class="w-full h-16 bg-[#8a1538] flex items-center justify-between px-5 shadow-md fixed top-0 z-30"
    >

        <div class="flex items-center gap-3">
            
            <i 
                @click="$emit('toggleSidebar')" 
                class="fa-solid fa-bars text-white text-xl cursor-pointer hover:opacity-75 transition duration-150 w-8 h-6 flex items-center justify-center"
                aria-label="Toggle Menu"
            ></i>
            
            <img 
                class="w-15.625 h-12 object-cover" 
                :src="upLogoPath" 
                alt="UP Cebu Logo"
            >
        </div>
        
        <div class="relative flex items-center gap-3">
            <div class="h-[40px] flex items-center justify-end">
                
                <button 
                    @click="toggleDropdown" 
                    class="block w-[40px] h-[40px] rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#8a1538] transition-shadow duration-200"
                    aria-expanded="isDropdownOpen"
                    aria-controls="profile-dropdown"
                    :title="`Logged in as ${user.name}`"
                >
                    <img 
                        class="w-full h-full object-cover cursor-pointer" 
                        :class="{'ring-2 ring-white ring-offset-1': isDropdownOpen}"
                        :src="AvatarSample" 
                        :alt="`${user.name} Profile Avatar`"
                    >
                </button>
            </div>

            <Transition name="fade-slide-down">
                <div 
                    v-if="isDropdownOpen"
                    id="profile-dropdown"
                    class="absolute right-0 top-12 mt-2 w-48 rounded-lg shadow-2xl bg-white ring-1 ring-black ring-opacity-5 z-20 overflow-hidden"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                >
                    <div class="py-1" role="none">
                        <div class="block px-4 py-2 text-sm font-semibold text-gray-800 truncate">
                            {{ props.user.name }}
                        </div>

                        <div class="block px-4 py-1 text-xs text-gray-500 bg-gray-50 border-b border-gray-100 truncate">
                            {{ props.user.email }}
                        </div>

                        <a 
                            href="#" 
                            @click.prevent="handleLogout"
                            class="text-gray-700  px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition duration-150 ease-in-out font-medium flex items-center" 
                            role="menuitem" 
                            tabindex="-1"
                            id="menu-item-logout"
                        >
                            <i class="fa-solid fa-sign-out-alt mr-3 w-4 text-center"></i> Log Out
                        </a>
                    </div>
                </div>
            </Transition>
        </div>
    </header>
</template>

<style scoped>
.fade-slide-down-enter-active,
.fade-slide-down-leave-active {
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
}

.fade-slide-down-enter-from,
.fade-slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>