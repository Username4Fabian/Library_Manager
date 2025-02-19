<script setup>
import { ref } from 'vue';
import RentBookOverlay from '../components/home/RentBookOverlay.vue';
import ReturnBookOverlay from '../components/home/ReturnBookOverlay.vue';
import Toast from '../components/Toast.vue';

const showRentOverlay = ref(false);
const showReturnOverlay = ref(false);
const showToast = ref(false);
const toastMessage = ref('');

const handleRentSuccess = (message) => {
  toastMessage.value = message;
  showToast.value = true;
};

const handleReturnSuccess = (message) => {
  toastMessage.value = message;
  showToast.value = true;
};

const closeToast = () => {
  showToast.value = false;
};
</script>

<template>
  <div class="flex flex-col items-center justify-start h-screen p-4 md:p-40">
    <button @click="showRentOverlay = true" class="w-full max-w-md p-4 bg-blue-500 hover:bg-blue-700 text-white text-2xl rounded mb-4 hover:scale-102 hover:cursor-pointer">Buch ausleihen</button>
    <button @click="showReturnOverlay = true" class="w-full max-w-md p-4 bg-green-500 hover:bg-green-700 text-white text-2xl rounded mb-4 hover:scale-102 hover:cursor-pointer">Buch zurückgeben</button>
    <RentBookOverlay v-if="showRentOverlay" @closeOverlay="showRentOverlay = false" @rentSuccess="handleRentSuccess" />
    <ReturnBookOverlay v-if="showReturnOverlay" @closeOverlay="showReturnOverlay = false" @returnSuccess="handleReturnSuccess" />
    <Toast v-if="showToast" :message="toastMessage" @close="closeToast" />
  </div>
</template>