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
      <div class="overlay m-50"></div>
      <div class="content z-10 flex flex-col items-center justify-center space-y-4">
        <h1 class="text-7xl text-center mb-25 font-pacifico bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
            Büchertag <br> 
            <span class="text-5xl">im Kindergarten</span>
        </h1>
        <button @click="showRentOverlay = true" class="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white text-2xl rounded hover:scale-102 hover:cursor-pointer pl-80 pr-80">Buch ausleihen</button>
        <button @click="showReturnOverlay = true" class="w-full p-4 bg-green-500 hover:bg-green-600 text-white text-2xl rounded hover:scale-102 hover:cursor-pointer">Buch zurückgeben</button>
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
.relative {
  position: relative;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  opacity: 0.8;
  border-radius: 1rem;
  z-index: 1; /* Ensure overlay is above the background but below the content */
}
.content {
  position: relative;
  z-index: 10; /* Ensure content is above the overlay */
}
</style>