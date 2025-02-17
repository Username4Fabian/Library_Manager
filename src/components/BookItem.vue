<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  book: Object
});
</script>

<template>
  <div class="p-4 bg-white shadow rounded">
    <h2 class="text-xl font-semibold">{{ book.title }}</h2>
    <p>Author: {{ book.author }}</p>
    <p>Number: {{ book.number }}</p>
    <p>Purchase Date: {{ new Date(book.purchaseDate).toLocaleDateString() }}</p>
    <p>Borrow Date: {{ new Date(book.borrowDate).toLocaleDateString() }}</p>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>