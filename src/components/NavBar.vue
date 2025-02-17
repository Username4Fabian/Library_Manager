<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const menuItems = ref([
  { name: 'Home', link: '/' },
  { name: 'Aktuell', link: '/aktuell-ausgebort' },
  { name: 'Bücherliste', link: '/buecherliste' },
  { name: 'Kinderliste', link: '/kinderliste' },
  { name: 'Einstellungen', link: '/einstellungen' }
]);
</script>

<template>
  <nav class="bg-gray-800 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white text-lg font-bold">Library Manager</div>
      <ul class="flex space-x-4">
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.link" class="text-white hover:text-gray-400">{{ item.name }}</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
