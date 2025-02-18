<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: Number,
  totalPages: Number
});

const emits = defineEmits(['prevPage', 'nextPage', 'firstPage', 'lastPage']);
</script>

<template>
  <div class="flex justify-between mt-4">
    <div class="flex space-x-2">
      <button @click="$emit('firstPage')" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-102">Erste</button>
      <button @click="$emit('prevPage')" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-102">Vorherige</button>
    </div>
    <span>Seite {{ currentPage }} von {{ totalPages }}</span>
    <div class="flex space-x-2">
      <button @click="$emit('nextPage')" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-102">Nächste</button>
      <button @click="$emit('lastPage')" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50 hover:cursor-pointer hover:scale-102">Letzte</button>
    </div>
  </div>
</template>