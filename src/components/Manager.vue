<script setup lang="ts">  
  import Modal from './Modal.vue';
  import { ref } from 'vue';
  import axios from 'axios';

  const isModalVisible = ref(false);
  const quotaData = ref({ quota: 0, reason: '' });
  const snackbar = ref(false);

  function showModal() {
    isModalVisible.value = true;
  }

  async function handleSave(data: { quota: number; reason: string }) {
    try {
      const response = await axios.post('https://httpstat.us/200', data);
      if (response.status === 200) {
        quotaData.value = data;
        snackbar.value = true;
        console.log('Saving quota data:', data);
      } else {
        console.error('Failed to save quota data:', response);
      }
    } catch (error) {
      console.error('Error saving quota data:', error);
    }
  }
</script>

<template>
  <v-container class="d-flex flex-column align-center justify-center" style="height: 100vh;">
    <v-btn @click="showModal" color="primary" class="mb-4">Edit flights</v-btn>
    <Modal
      v-model:visible="isModalVisible"
      :quotaData="quotaData"
      @save="handleSave"
    />
    <v-snackbar v-model="snackbar" :timeout="3000" top>
      Updated flight quota successfully!<br>
      Flights left: {{ quotaData.quota }}<br>
      Reason: {{ quotaData.reason }}
      <template v-slot:actions>
        <v-btn color="red" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>