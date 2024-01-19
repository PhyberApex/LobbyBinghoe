<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import useBingoCard from "@/composables/useBingoCard";

const router = useRouter();

const episodeName = ref("");
const { createNewCard, loading } = useBingoCard();

const createNew = async () => {
  const id = await createNewCard(episodeName.value);
  router.push(`card/${id}`);
};
</script>

<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h5 text-center q-pb-md">Create a New Card</div>

        <q-input
          filled
          v-model="episodeName"
          placeholder="Enter Episode Name"
          class="q-mb-md"
        ></q-input>
        <q-btn
          color="primary"
          label="Create"
          class="full-width"
          :loading="loading"
          @click="createNew"
        ></q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.my-card {
  max-width: 400px;
  margin: 0 auto; /* Centers the card on the page */
}
</style>
