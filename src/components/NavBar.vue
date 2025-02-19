<script setup>
import { ref, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

const menuItems = ref([
  { name: 'Home', link: '/' },
  { name: 'Aktuell', link: '/aktuell' },
  { name: 'Bücherliste', link: '/buecherliste' },
  { name: 'Kinderliste', link: '/kinderliste' },
  { name: 'Einstellungen', link: '/einstellungen' }
]);

const isMenuOpen = ref(false);
const router = useRouter();

watch(router.currentRoute, () => {
  isMenuOpen.value = false;
});
</script>

<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-bold">Library Manager</div>
      <ul class="hidden md:flex space-x-4">
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.link" class="text-white hover:text-gray-400">{{ item.name }}</router-link>
        </li>
      </ul>
      <div class="md:hidden">
        <button @click="isMenuOpen = !isMenuOpen" class="text-white focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-if="isMenuOpen" class="md:hidden">
        <ul class="flex flex-col space-y-2 mt-2">
          <li v-for="item in menuItems" :key="item.name">
            <router-link :to="item.link" class="text-white hover:text-gray-400 block px-4 py-2">{{ item.name }}</router-link>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>