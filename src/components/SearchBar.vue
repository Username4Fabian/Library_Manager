<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  searchQuery: String,
  searchProperty: String
});

const emits = defineEmits(['update:searchQuery', 'update:searchProperty', 'showOverlay']);
</script>

<template>
  <div class="flex items-center mb-4">
    <input
      :value="searchQuery"
      @input="$emit('update:searchQuery', $event.target.value)"
      type="text"
      placeholder="Search books..."
      class="p-2 border border-gray-300 rounded w-full"
    />
    <select
      :value="searchProperty"
      @change="$emit('update:searchProperty', $event.target.value)"
      class="ml-2 p-2 border border-gray-300 rounded"
      style="height: 40px;">
      <option value="all">All</option>
      <option value="title">Title</option>
      <option value="number">Number</option>
    </select>
    <button @click="$emit('showOverlay')" class="ml-2 px-4 py-0.5 bg-blue-500 text-white rounded self-stretch">
      Add Book
    </button>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>