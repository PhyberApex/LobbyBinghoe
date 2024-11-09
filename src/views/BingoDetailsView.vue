<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import useBingoCard from "@/composables/useBingoCard";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const props = defineProps<{
  id: string;
}>();

const isError = ref(false);
const errorText = ref("");
const router = useRouter();
const $q = useQuasar();

const {
  loading,
  bingoCard,
  fetchCard,
  bingoFound,
  lobbyHoeBingoFound,
  removeCardFromStorage,
} = useBingoCard();

// Watch for bingo state changes
watch([bingoFound, lobbyHoeBingoFound], ([newBingo, newLobbyHoeBingo], [oldBingo, oldLobbyHoeBingo]) => {
  if (!oldBingo && newBingo) {
    $q.notify({
      message: 'BINGO!',
      color: 'positive',
      position: 'top',
      timeout: 2000,
      actions: [
        { icon: 'celebration', color: 'white' }
      ]
    });
  }
  if (!oldLobbyHoeBingo && newLobbyHoeBingo) {
    $q.notify({
      message: 'LobbyHoe-BINGO!',
      color: 'positive',
      position: 'top',
      timeout: 2000,
      actions: [
        { icon: 'celebration', color: 'white' }
      ]
    });
  }
});

onMounted(async () => {
  try {
    await fetchCard(props.id);
  } catch (error) {
    isError.value = true;
    errorText.value = error instanceof Error ? error.message : "An unexpected error occurred";
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
        errorText.value = error instanceof Error ? error.message : "An unexpected error occurred";
      }
    },
);

const toggleField = (rowIndex: number, colIndex: number) => {
  if (bingoCard.value !== null) {
    bingoCard.value.bingoValues[rowIndex][colIndex] =
        !bingoCard.value.bingoValues[rowIndex][colIndex];
  }
};

// Function to get the field number (1-25)
const getFieldNumber = (rowIndex: number, colIndex: number): number => {
  return rowIndex * 5 + colIndex + 1;
};

// Compute flattened reference items
const referenceItems = computed(() => {
  if (!bingoCard.value) return [];

  const items = [];
  for (let rowIndex = 0; rowIndex < bingoCard.value.bingoFacts.length; rowIndex++) {
    for (let colIndex = 0; colIndex < bingoCard.value.bingoFacts[rowIndex].length; colIndex++) {
      items.push({
        number: rowIndex * 5 + colIndex + 1,
        text: bingoCard.value.bingoFacts[rowIndex][colIndex],
        rowIndex,
        colIndex,
        selected: bingoCard.value.bingoValues[rowIndex][colIndex]
      });
    }
  }
  return items;
});
</script>


<template>
  <div v-if="loading" class="flex flex-center q-pa-md" style="height: 100vh">
    <q-spinner color="primary" size="50px"></q-spinner>
  </div>

  <div v-else-if="!loading && bingoCard !== null" class="bingo-container">
    <q-card class="bingo-wrapper">
      <q-card-section class="q-pt-md q-pb-none">
        <div class="text-h6 text-center">{{ bingoCard?.episode }}</div>
        <div class="text-subtitle1 text-center"><span>{{ bingoCard?.id }}</span> <q-btn
            v-if="bingoCard?.isLocal"
            flat
            icon="delete"
            color="negative"
            @click="removeCard"
            class="q-mt-xs"
        >
          <q-tooltip>Remove this card from your history</q-tooltip>
        </q-btn> </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div v-if="bingoFound" class="q-ma-md text-h5 text-center text-positive">
          Bingo!
        </div>
        <div
            v-if="lobbyHoeBingoFound"
            class="q-ma-md text-h5 text-center text-positive"
        >
          LobbyHoe-Bingo!
        </div>
        <q-separator class="q-my-md" />

        <div class="bingo-game-container">
          <!-- Left side: Bingo Card -->
          <div class="bingo-card-container">
            <div class="bingo-card">
              <div
                  v-for="(row, rowIndex) in bingoCard.bingoValues"
                  :key="rowIndex"
                  class="bingo-row"
              >
                <q-btn
                    v-for="(field, colIndex) in row"
                    :key="colIndex"
                    :color="field ? 'positive' : 'dark'"
                    :text-color="field ? 'white' : 'grey-7'"
                    @click="toggleField(rowIndex, colIndex)"
                    class="square-btn"
                >
                  {{ getFieldNumber(rowIndex, colIndex) }}
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Right side: Reference Table -->
          <div class="reference-container">
            <div class="text-h6 q-mb-md">Reference</div>
            <q-list bordered separator class="reference-list">
              <q-item
                  v-for="item in referenceItems"
                  :key="item.number"
                  clickable
                  @click="toggleField(item.rowIndex, item.colIndex)"
                  class="q-item"
                  :class="{ 'bg-positive text-white': item.selected }"
              >
                <q-item-section side class="reference-number">
                  {{ item.number }}
                </q-item-section>
                <q-item-section>{{ item.text }}</q-item-section>
              </q-item>
            </q-list>
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
.bingo-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.bingo-wrapper {
  width: 100%;
}

.bingo-game-container {
  display: flex;
  gap: 2rem;
  margin: 0 auto;
}

/* Bingo Card Styles */
.bingo-card-container {
  flex: 0 0 auto;
}

.bingo-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bingo-row {
  display: flex;
  gap: 4px;
}

.square-btn {
  aspect-ratio: 1 / 1;
  width: 60px;
  height: 60px;
  font-size: 1.2rem;
  font-weight: bold;
}

/* Reference List Styles */
.reference-container {
  flex: 1;
  min-width: 0; /* Prevents flex item from overflowing */
}

.reference-list {
  height: calc(100% - 2rem);
  border-radius: 8px;
}

.reference-number {
  min-width: 40px;
  font-weight: bold;
}

.text-positive {
  background: #dff0d8;
  border-radius: 8px;
  padding: 10px;
}

/* Hover effects */
.q-item {
  transition: background-color 0.3s ease;
}

.q-item:hover:not(.bg-positive) {
  background-color: #f0f0f0;
}

/* Responsive Design */
@media (max-width: 1023px) {
  .bingo-game-container {
    flex-direction: column;
  }

  .bingo-card-container {
    margin: 0 auto;
  }

  .reference-container {
    width: 100%;
  }

  .reference-list {
    height: auto;
    max-height: 500px;
    overflow-y: auto;
  }
}

@media (max-width: 599px) {
  .bingo-container {
    padding: 0.5rem;
  }

  .square-btn {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }

  .reference-number {
    min-width: 32px;
  }
}

/* For very small screens */
@media (max-width: 359px) {
  .square-btn {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }

  .bingo-game-container {
    gap: 1rem;
  }
}
</style>