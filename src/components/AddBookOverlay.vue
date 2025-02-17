<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';

const emits = defineEmits(['closeOverlay', 'addBook']);

const title = ref('');
const number = ref('');
const purchaseDate = ref('');
const borrowDate = ref('');
const author = ref('');

const submitForm = () => {
  const newBook = {
    title: title.value,
    number: number.value,
    purchaseDate: purchaseDate.value,
    borrowDate: borrowDate.value,
    author: author.value
  };
  emits('addBook', newBook);
  emits('closeOverlay');
};
</script>

<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-4">Add New Book</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-gray-700">Title</label>
          <input v-model="title" type="text" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Number</label>
          <input v-model="number" type="number" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Purchase Date</label>
          <input v-model="purchaseDate" type="date" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Borrow Date</label>
          <input v-model="borrowDate" type="date" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Author</label>
          <input v-model="author" type="text" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="flex justify-end">
          <button type="button" @click="$emit('closeOverlay')" class="mr-2 p-2 bg-gray-500 text-white rounded">Cancel</button>
          <button type="submit" class="p-2 bg-blue-500 text-white rounded">Add Book</button>
        </div>
      </form>
    </div>
  </div>
</template>
