<script setup>
import { ref } from 'vue';
import { defineEmits } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';

const emits = defineEmits(['closeOverlay', 'uploadSuccess', 'uploadStart']);

const file = ref(null);
const dragOver = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const fileInput = ref(null);

const handleFileUpload = (event) => {
  file.value = event.target.files[0];
};

const handleDragOver = (event) => {
  event.preventDefault();
  dragOver.value = true;
};

const handleDragLeave = () => {
  dragOver.value = false;
};

const handleDrop = (event) => {
  event.preventDefault();
  dragOver.value = false;
  file.value = event.dataTransfer.files[0];
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const deleteAllCustomers = async () => {
  try {
    const response = await axios.delete('api/customers/DeleteAllCustomers');
    if (response.status !== 200) {
      throw new Error(`Failed to delete all customers: ${response.status}`);
    }
  } catch (error) {
    console.error('Fehler beim Löschen aller Kunden:', error);
    errorMessage.value = `Fehler beim Löschen aller Kunden: ${error.message}`;
    throw error;
  }
};

const processFile = async () => {
  if (!file.value) {
    errorMessage.value = 'Bitte wählen Sie eine Datei aus.';
    return;
  }

  isLoading.value = true;
  emits('uploadStart');
  errorMessage.value = '';

  try {
    await deleteAllCustomers();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const customers = XLSX.utils.sheet_to_json(worksheet);

      try {
        const response = await axios.post('api/customers/CreateMultipleCustomers', customers);
        if (response.status === 200) {
          emits('uploadSuccess');
          emits('closeOverlay');
        } else {
          errorMessage.value = `Fehler beim Hochladen der Datei: ${response.status}`;
        }
      } catch (error) {
        console.error('Fehler beim Hochladen der Datei:', error);
        errorMessage.value = `Fehler beim Hochladen der Datei: ${error.message}`;
      } finally {
        isLoading.value = false;
      }
    };
    reader.readAsArrayBuffer(file.value);
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Datei:', error);
    isLoading.value = false;
  }
};

const downloadExampleFile = () => {
  const link = document.createElement('a');
  link.href = 'api/customers/downloadFile';
  link.download = 'Beispiel.xlsx';
  link.click();
};
</script>

<template>
  <div class="mb-4">
    <label class="block text-gray-700">Datei (alle Kinder) hochladen</label>
    <div
      @click="triggerFileInput"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      :class="{'border-blue-500': dragOver, 'border-gray-300': !dragOver}"
      class="w-full p-4 border-2 border-dashed rounded text-center cursor-pointer">
      <input type="file" @change="handleFileUpload" class="hidden" ref="fileInput" />
      <p v-if="!file">
        <span v-if="dragOver" class="text-gray-500">Datei hier ablegen</span>
        <span v-else class="text-gray-400">
          Datei hierher ziehen oder klicken, um eine Datei auszuwählen.
          <br>
          Dies kann einige Minuten in Anspruch nehmen!
          <br>
          Alle existierenden Einträge werden gelöscht.
        </span>
      </p>
      <p v-else>{{ file.name }}</p>
    </div>
    <div v-if="errorMessage" class="mb-4 text-red-500">{{ errorMessage }}</div>
    <div class="flex flex-col md:flex-row justify-end items-center space-y-2 md:space-y-0 md:space-x-2">
      <div v-if="isLoading" class="loader mr-2"></div>
      <button type="button" @click="downloadExampleFile" class="mt-2 ml-2 p-2 bg-gray-500 hover:bg-gray-700 text-white rounded hover:cursor-pointer hover:scale-102">Beispieldatei herunterladen</button>
      <button type="button" @click="processFile" :disabled="isLoading" class="mt-2 ml-2 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded hover:cursor-pointer hover:scale-102">Datei hochladen</button>
    </div>
  </div>
</template>

<style scoped>
.loader {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 24px;
  height: 24px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>