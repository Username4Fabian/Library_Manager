<script setup>
import { ref, onMounted } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';

const emits = defineEmits(['closeOverlay', 'addBook']);

const title = ref('');
const number = ref('');
const publisher = ref('');
const purchaseDate = ref('');
const borrowDate = ref(null);
const author = ref('');
const category = ref('');
const summary = ref('');

onMounted(() => {
  const today = new Date().toISOString().split('T')[0];
  purchaseDate.value = today;
});

const submitForm = async () => {
  const newBook = {
    title: title.value,
    number: number.value,
    publisher: publisher.value,
    purchaseDate: purchaseDate.value,
    borrowDate: borrowDate.value || null,
    author: author.value,
    category: category.value,
    summary: summary.value
  };

  try {
    const response = await axios.post('api/books/CreateNewBook', newBook);
    emits('addBook', response.data);
  } catch (error) {
    console.error('Error adding book:', error);
  }

  emits('closeOverlay');
};
</script>

<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-4">Neues Buch hinzufügen</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-gray-700">Titel</label>
          <input v-model="title" type="text" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Nummer</label>
          <input v-model="number" type="text" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Verlag</label>
          <input v-model="publisher" type="text" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Kaufdatum</label>
          <input v-model="purchaseDate" type="date" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Autor</label>
          <input v-model="author" type="text" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Kategorie</label>
          <input v-model="category" type="text" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Zusammenfassung</label>
          <textarea v-model="summary" class="w-full p-2 border border-gray-300 rounded"></textarea>
        </div>
        <div class="flex justify-end">
          <button type="button" @click="$emit('closeOverlay')" class="mr-2 p-2 bg-gray-500 hover:bg-gray-700 hover:scale-102 text-white rounded">Abbrechen</button>
          <button type="submit" class="p-2 bg-blue-500 hover:bg-blue-700 hover:scale-102 text-white rounded">Buch hinzufügen</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>