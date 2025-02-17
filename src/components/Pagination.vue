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
      <button @click="$emit('firstPage')" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">First</button>
      <button @click="$emit('prevPage')" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">Previous</button>
    </div>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <div class="flex space-x-2">
      <button @click="$emit('nextPage')" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">Next</button>
      <button @click="$emit('lastPage')" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">Last</button>
    </div>
  </div>
</template>