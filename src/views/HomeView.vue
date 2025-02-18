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
  <div>
    <button @click="showOverlay = true" class="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded">Buch ausleihen</button>
    <RentBookOverlay v-if="showOverlay" @closeOverlay="showOverlay = false" @rentSuccess="handleRentSuccess" />
    <Toast v-if="showToast" :message="toastMessage" @close="closeToast" />
  </div>
</template>