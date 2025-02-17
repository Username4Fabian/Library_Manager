<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentPage: Number,
  totalPages: Number
});

const emits = defineEmits(['prevPage', 'nextPage']);
</script>

<template>
  <div class="flex justify-between mt-4">
    <button @click="$emit('prevPage')" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="$emit('nextPage')" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">Next</button>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>