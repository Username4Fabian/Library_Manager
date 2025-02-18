<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';
import UploadCustomerOverlay from './UploadCustomerOverlay.vue';

const emits = defineEmits(['closeOverlay', 'addCustomer', 'uploadSuccess']);

const firstName = ref('');
const lastName = ref('');
const group = ref('');
const book = ref('');

const errorMessage = ref('');
const isLoading = ref(false);

const submitForm = async () => {
  const newCustomer = {
    firstName: firstName.value,
    lastName: lastName.value,
    group: group.value,
    book: book.value ? { title: book.value } : null 
  };

  try {
    const response = await axios.post('api/customers/CreateNewCustomer', newCustomer);
    emits('addCustomer', response.data);
    emits('closeOverlay');
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Kindes:', error);
    errorMessage.value = 'Fehler beim Hinzufügen des Kindes: ' + (error.response?.data?.message || error.message);
  }
};

const handleUploadSuccess = () => {
  isLoading.value = false;
  emits('uploadSuccess');
};

const handleUploadStart = () => {
  isLoading.value = true;
};
</script>

<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-4">Neues Kind hinzufügen</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block text-gray-700">Vorname</label>
          <input v-model="firstName" type="text" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Nachname</label>
          <input v-model="lastName" type="text" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Gruppe</label>
          <input v-model="group" type="text" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div class="flex justify-end mb-4">
          <button type="button" @click="$emit('closeOverlay')" :disabled="isLoading" class="mr-2 p-2 bg-gray-500 hover:bg-gray-700 text-white rounded hover:cursor-pointer">Abbrechen</button>
          <button type="submit" :disabled="isLoading" class="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded hover:cursor-pointer">Kind hinzufügen</button>
        </div>
        <UploadCustomerOverlay @uploadSuccess="handleUploadSuccess" @uploadStart="handleUploadStart" @closeOverlay="$emit('closeOverlay')" />
        <div v-if="errorMessage" class="mb-4 text-red-500">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>