<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import useBingoCard from "@/composables/useBingoCard";

const props = defineProps<{
  id: string;
}>();

const {
  loading,
  isError,
  errorText,
  bingoCard,
  fetchCard,
  bingoFound,
  lobbyHoeBingoFound,
} = useBingoCard();

onMounted(() => fetchCard(props.id));

const shouldShowTooltip = (text: string) => {
  // Implement logic to determine if the text is overflowing and needs a tooltip
  // This might depend on the length of the text and/or the size of the container
  return text.length > 50; // Replace `certainLength` with the appropriate number
};

watch(
  () => props.id,
  (newId) => fetchCard(newId),
);

const toggleField = (rowIndex: number, colIndex: number) => {
  if (bingoCard.value !== null)
    bingoCard.value.bingoValues[rowIndex][colIndex] =
      !bingoCard.value.bingoValues[rowIndex][colIndex];
};
</script>
<template>
  <div v-if="loading">
    <q-spinner color="primary" size="50px"></q-spinner>
  </div>
  <div v-else-if="!loading && bingoCard !== null">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h4 text-center q-pb-md">Bingo Card</div>
        <div class="text-center text-h5">{{ bingoCard?.episode }}</div>
        <div class="text-center text-subtitle2">{{ bingoCard?.id }}</div>
        <q-separator></q-separator>
        <div class="q-pa-md">
          <div
            v-for="(row, rowIndex) in bingoCard.bingoValues"
            :key="rowIndex"
            class="row q-gutter-md justify-center row-spacing"
          >
            <q-btn
              v-for="(field, colIndex) in row"
              :key="colIndex"
              :color="field ? 'positive' : 'dark'"
              :text-color="field ? 'white' : 'grey-7'"
              label=""
              rounded
              push
              @click="toggleField(rowIndex, colIndex)"
              class="bingo-btn"
            >
              <span class="text-truncate">{{
                bingoCard.bingoFacts[rowIndex][colIndex]
              }}</span>
              <q-tooltip
                v-if="
                  shouldShowTooltip(bingoCard.bingoFacts[rowIndex][colIndex])
                "
              >
                {{ bingoCard.bingoFacts[rowIndex][colIndex] }}
              </q-tooltip>
            </q-btn>
          </div>
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
  max-width: 800px;
  margin: 0 auto; /* Centers the card on the page */
}
.row-spacing {
  margin-bottom: 16px;
}
.bingo-btn {
  width: 120px;
  height: 120px;
  font-size: 12px;
}
/* Style for the Bingo Found label */
.text-positive {
  background: #dff0d8;
  border-radius: 8px;
  padding: 10px;
}
.text-truncate {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
