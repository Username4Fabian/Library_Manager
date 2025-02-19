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
  <div class="relative flex flex-col items-center justify-center h-screen p-4 md:p-40 bg-cover bg-center" style="background-image: url('api/images/Buechertag.svg');">
    <div class="absolute inset-0 bg-white bg-opacity-50 rounded-2xl w-11/12 md:w-11/20 h-5/6 md:h-5/9 m-auto"></div>
    <div class="relative z-10 flex flex-col items-center justify-center w-full h-full space-y-4 p-4 md:p-40">
      <h1 class="text-4xl md:text-7xl text-center mb-4 md:mb-25 font-pacifico bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
        Büchertag <br> 
        <span class="text-2xl md:text-5xl">im Kindergarten</span>
      </h1>
      <button @click="showRentOverlay = true" class="w-full max-w-xs md:max-w-md lg:max-w-lg p-2 md:p-4 bg-blue-500 hover:bg-blue-600 text-white text-lg md:text-xl lg:text-2xl rounded hover:scale-102 hover:cursor-pointer">Buch ausleihen</button>
      <button @click="showReturnOverlay = true" class="w-full max-w-xs md:max-w-md lg:max-w-lg p-2 md:p-4 bg-green-500 hover:bg-green-600 text-white text-lg md:text-xl lg:text-2xl rounded hover:scale-102 hover:cursor-pointer">Buch zurückgeben</button>
      <RentBookOverlay v-if="showRentOverlay" @closeOverlay="showRentOverlay = false" @rentSuccess="handleRentSuccess" />
      <ReturnBookOverlay v-if="showReturnOverlay" @closeOverlay="showReturnOverlay = false" @returnSuccess="handleReturnSuccess" />
      <Toast v-if="showToast" :message="toastMessage" @close="closeToast" />
    </div>
  </div>
</template>

<style scoped>
.bg-cover {
  background-size: cover;
}
.bg-center {
  background-position: center;
}
.absolute {
  position: absolute;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.bg-opacity-50 {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>