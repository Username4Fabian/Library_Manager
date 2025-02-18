<script setup>
import { defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  customer: Object
});

const emits = defineEmits(['customerDeleted']);

const deleteCustomer = async () => {
  if (window.confirm(`Sind Sie sicher, dass Sie das Kind: ${props.customer.firstName} ${props.customer.lastName} löschen möchten?`)) {
    try {
      await axios.delete(`api/customers/DeleteCustomer/${props.customer.id}`);
      emits('customerDeleted', props.customer);
    } catch (error) {
      console.error('Fehler beim Löschen des Kindes:', error);
    }
  }
};
</script>

<template>
  <div class="p-4 bg-white shadow rounded flex justify-between items-center">
    <div>
      <h2 class="text-xl font-semibold">{{ customer.firstName }} {{ customer.lastName }}</h2>
      <p>Gruppe: {{ customer.group ? customer.group : '---' }}</p>
      <p>Buch: {{ customer.book ? `${customer.book.number} | ${customer.book.title}` : '---' }}</p>
    </div>
    <button @click="deleteCustomer" class="text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer hover:scale-102">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>
</template>
