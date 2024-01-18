<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const bingoId = ref("");
const router = useRouter();
const error = ref("");

const v4 = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
);

const validate = () => {
  if (!bingoId.value.match(v4)) {
    error.value = "Please enter a valid id";
    return false;
  }
  return true;
};

const navigate = () => {
  if (validate()) router.push(`bingo/card/${bingoId.value}`);
};
</script>

<template>
  <main class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h5 text-center q-pb-md">Create or Open with ID</div>

        <q-btn
          to="/bingo/new"
          color="primary"
          label="Create New Card"
          class="full-width q-mb-md"
        ></q-btn>

        <q-input
          filled
          v-model.trim="bingoId"
          placeholder="Card ID"
          class="q-mb-md"
        ></q-input>
        <q-btn
          color="secondary"
          label="Search"
          class="full-width"
          @click="navigate"
        ></q-btn>

        <div v-if="error !== ''" class="text-negative q-mt-md">{{ error }}</div>
      </q-card-section>
    </q-card>
  </main>
</template>

<style scoped>
.my-card {
  max-width: 400px;
  margin: 0 auto; /* Centers the card on the page */
}
</style>
