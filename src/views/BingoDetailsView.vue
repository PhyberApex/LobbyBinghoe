<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import useBingoCard from "@/composables/useBingoCard";
import { useRouter } from "vue-router";

const props = defineProps<{
  id: string;
}>();

const isError = ref(false);
const errorText = ref("");

const router = useRouter();

const {
  loading,
  bingoCard,
  fetchCard,
  bingoFound,
  lobbyHoeBingoFound,
  removeCardFromStorage,
} = useBingoCard();

onMounted(async () => {
  try {
    await fetchCard(props.id);
  } catch (error) {
    isError.value = true;
    if (error instanceof Error) {
      // If it's an instance of Error, use the message property
      errorText.value = error.message;
    } else {
      // If it's not an Error object, default to a standard error message
      errorText.value = "An unexpected error occurred";
    }
  }
});

const removeCard = () => {
  removeCardFromStorage();
  router.push("/");
};

watch(
  () => props.id,
  async (newId) => {
    try {
      await fetchCard(newId);
    } catch (error) {
      isError.value = true;
      if (error instanceof Error) {
        // If it's an instance of Error, use the message property
        errorText.value = error.message;
      } else {
        // If it's not an Error object, default to a standard error message
        errorText.value = "An unexpected error occurred";
      }
    }
  },
);

const toggleField = (rowIndex: number, colIndex: number) => {
  if (bingoCard.value !== null)
    bingoCard.value.bingoValues[rowIndex][colIndex] =
      !bingoCard.value.bingoValues[rowIndex][colIndex];
};
</script>
<template>
  <div v-if="loading" class="flex flex-center q-pa-md" style="height: 100vh">
    <q-spinner color="primary" size="50px"></q-spinner>
  </div>

  <div v-else-if="!loading && bingoCard !== null">
    <q-card class="my-card">
      <q-card-section class="q-pt-md q-pb-none q-px-md">
        <div class="text-h6 text-center">{{ bingoCard?.episode }}</div>
        <div class="text-subtitle1 text-center">{{ bingoCard?.id }}</div>
        <div class="row justify-end">
          <q-btn
            v-if="bingoCard?.isLocal"
            flat
            icon="delete"
            color="negative"
            @click="removeCard"
            class="q-mt-xs"
          >
            <q-tooltip> Remove this card from your history </q-tooltip></q-btn
          >
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div
          v-if="bingoFound"
          class="q-ma-md text-h5 text-center text-positive"
        >
          Bingo!
        </div>
        <div
          v-if="lobbyHoeBingoFound"
          class="q-ma-md text-h5 text-center text-positive"
        >
          LobbyHoe-Bingo!
        </div>
        <q-separator></q-separator>
        <div class="q-pa-md">
          <div
            v-for="(row, rowIndex) in bingoCard.bingoValues"
            :key="rowIndex"
            class="row"
          >
            <q-btn
              :key="colIndex"
              :color="field ? 'positive' : 'dark'"
              :text-color="field ? 'white' : 'grey-7'"
              label=""
              rounded
              push
              v-for="(field, colIndex) in row"
              @click="toggleField(rowIndex, colIndex)"
              class="square-btn"
            >
              <span class="text-truncate">{{
                bingoCard.bingoFacts[rowIndex][colIndex]
              }}</span>
              <q-tooltip>
                {{ bingoCard.bingoFacts[rowIndex][colIndex] }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <div v-else-if="isError">
    <q-banner inline-actions class="bg-negative text-white" dense>
      <template v-slot:avatar>
        <q-icon name="report_problem" />
      </template>
      {{ errorText }}
    </q-banner>
    <q-btn to="/" flat class="q-mt-md" color="primary">
      <q-icon name="arrow_back" /> Back
    </q-btn>
  </div>
</template>

<style scoped>
.my-card {
  max-width: 100%;
  margin: 0 auto; /* Centers the card on the page */
}

.row {
  width: 500px;
}

.square-btn {
  aspect-ratio: 1 / 1;
  height: 100px;
  width: 100px; /* Ensure it fills the parent column */
}

/* Style for the Bingo Found label */
.text-positive {
  background: #dff0d8;
  border-radius: 8px;
  padding: 10px;
}

.text-truncate {
  white-space: break-spaces;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
