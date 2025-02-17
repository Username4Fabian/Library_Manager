<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  book: Object
});

const emits = defineEmits(['deleteBook']);

const formatDate = (date) => {
  const d = new Date(date);
  return d.getTime() === 0 ? '---' : d.toLocaleDateString();
};

const purchaseDate = computed(() => formatDate(props.book.purchaseDate));
const borrowDate = computed(() => formatDate(props.book.borrowDate));

const deleteBook = () => {
  if (window.confirm(`Are you sure you want to delete the book "${props.book.title}"?`)) {
    emits('deleteBook', props.book.id);
  }
};
</script>

<template>
  <div class="p-4 bg-white shadow rounded flex justify-between items-center">
    <div>
      <h2 class="text-xl font-semibold">{{ book.title }}</h2>
      <p>Author: {{ book.author }}</p>
      <p>Number: {{ book.number }}</p>
      <p>Publisher: {{ book.publisher }}</p>
      <p>Category: {{ book.category }}</p>
      <p>Purchase Date: {{ purchaseDate }}</p>
      <p>Borrow Date: {{ borrowDate }}</p>
      <p>Summary: {{ book.summary }}</p>
    </div>
    <button @click="deleteBook" class="text-gray-500 hover:text-gray-700 text-2xl">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>