<script setup>
import { ref } from 'vue';
import RentBookOverlay from '../components/home/RentBookOverlay.vue';
import Toast from '../components/Toast.vue';

const showOverlay = ref(false);
const showToast = ref(false);
const toastMessage = ref('');

const handleRentSuccess = (message) => {
  toastMessage.value = message;
  showToast.value = true;
};

const closeToast = () => {
  showToast.value = false;
};
</script>

<template>
  <div class="flex flex-col items-center justify-start h-screen p-4 md:p-40">
    <button @click="showOverlay = true" class="w-full max-w-md p-4 bg-blue-500 hover:bg-blue-700 text-white text-2xl rounded mb-4">Buch ausleihen</button>
    <RentBookOverlay v-if="showOverlay" @closeOverlay="showOverlay = false" @rentSuccess="handleRentSuccess" />
    <Toast v-if="showToast" :message="toastMessage" @close="closeToast" />
  </div>
</template>