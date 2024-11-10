<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import useBingoCard from "@/composables/useBingoCard";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const props = defineProps<{ id: string }>();
const isError = ref(false);
const errorText = ref("");
const router = useRouter();
const $q = useQuasar();
const showConfetti = ref(false);

const {
  loading,
  bingoCard,
  fetchCard,
  bingoFound,
  lobbyHoeBingoFound,
  removeCardFromStorage,
} = useBingoCard();

// Enhanced notifications with animations
watch([bingoFound, lobbyHoeBingoFound], ([newBingo, newLobbyHoeBingo], [oldBingo, oldLobbyHoeBingo]) => {
  if (!oldBingo && newBingo) {
    showConfetti.value = true;
    $q.notify({
      message: 'BINGO!',
      color: 'positive',
      position: 'top',
      timeout: 3000,
      actions: [
        { icon: 'celebration', color: 'white', handler: () => { /* celebration click handler */ } }
      ],
      html: true,
      classes: 'notification-zoom'
    });
  }
  if (!oldLobbyHoeBingo && newLobbyHoeBingo) {
    showConfetti.value = true;
    $q.notify({
      message: 'LobbyHoe-BINGO! 🎉',
      color: 'positive',
      position: 'top',
      timeout: 3000,
      actions: [
        { icon: 'celebration', color: 'white', handler: () => { /* celebration click handler */ } }
      ],
      html: true,
      classes: 'notification-zoom'
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
  $q.dialog({
    title: 'Confirm Removal',
    message: 'Are you sure you want to remove this card from your history?',
    persistent: true,
    color: 'negative',
    ok: {
      label: 'Remove',
      color: 'negative',
    },
    cancel: {
      label: 'Cancel',
      color: 'grey',
    }
  }).onOk(() => {
    removeCardFromStorage();
    router.push("/");
  });
};

watch(() => props.id, async (newId) => {
  try {
    await fetchCard(newId);
  } catch (error) {
    isError.value = true;
    errorText.value = error instanceof Error ? error.message : "An unexpected error occurred";
  }
});

const toggleField = (rowIndex: number, colIndex: number) => {
  if (bingoCard.value !== null) {
    bingoCard.value.bingoValues[rowIndex][colIndex] = !bingoCard.value.bingoValues[rowIndex][colIndex];
  }
};

const getFieldNumber = (rowIndex: number, colIndex: number): number => {
  return rowIndex * 5 + colIndex + 1;
};

const referenceItems = computed(() => {
  if (!bingoCard.value) return [];

  return bingoCard.value.bingoFacts.flatMap((row, rowIndex) =>
      row.map((text, colIndex) => ({
        number: rowIndex * 5 + colIndex + 1,
        text,
        rowIndex,
        colIndex,
        selected: bingoCard?.value?.bingoValues[rowIndex][colIndex]
      }))
  );
});

const copyCardId = () => {
  if (bingoCard.value?.id) {
    navigator.clipboard.writeText(bingoCard.value.id);
    $q.notify({
      message: 'Card ID copied to clipboard!',
      color: 'info',
      position: 'top',
      timeout: 2000,
      icon: 'content_copy'
    });
  }
};
</script>

<template>
  <div class="bingo-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <q-spinner-dots color="primary" size="50px" />
      <div class="text-subtitle1 text-grey q-mt-md">Loading your bingo card...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="error-container q-pa-md">
      <q-banner inline-actions rounded class="bg-negative text-white">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        {{ errorText }}
        <template v-slot:action>
          <q-btn flat color="white" label="Go Back" to="/" icon="arrow_back" />
        </template>
      </q-banner>
    </div>

    <!-- Game Content -->
    <div v-else-if="bingoCard !== null" class="bingo-container">
      <q-card flat bordered class="bingo-wrapper">
        <!-- Header Section -->
        <q-card-section class="header-section">
          <div class="text-h5 text-weight-bold text-primary">{{ bingoCard?.episode }}</div>
          <div class="id-section q-mt-sm">
            <q-chip
                outline
                color="primary"
                class="id-chip"
                clickable
                @click="copyCardId"
            >
              <q-icon name="content_copy" size="sm" class="q-mr-xs" />
              {{ bingoCard?.id }}
            </q-chip>
            <q-btn
                v-if="bingoCard?.isLocal"
                flat
                round
                color="negative"
                icon="delete"
                @click="removeCard"
            >
              <q-tooltip>Remove from history</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <!-- Bingo Announcements -->
        <q-card-section v-if="bingoFound || lobbyHoeBingoFound" class="announcement-section">
          <div class="row items-center justify-center q-gutter-md">
            <q-banner v-if="bingoFound" rounded class="bingo-banner">
              <template v-slot:avatar>
                <q-icon name="emoji_events" color="warning" size="2rem" />
              </template>
              <span class="text-h6">BINGO!</span>
            </q-banner>
            <q-banner v-if="lobbyHoeBingoFound" rounded class="lobbyhoe-banner">
              <template v-slot:avatar>
                <q-icon name="workspace_premium" color="warning" size="2rem" />
              </template>
              <span class="text-h6">LobbyHoe-BINGO!</span>
            </q-banner>
          </div>
        </q-card-section>

        <!-- Game Grid Section -->
        <q-card-section class="game-section">
          <div class="bingo-game-container">
            <!-- Bingo Card Grid -->
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
                      :color="field ? 'primary' : 'grey-3'"
                      :text-color="field ? 'white' : 'grey-8'"
                      @click="toggleField(rowIndex, colIndex)"
                      class="bingo-cell"
                      :class="{ 'selected': field }"
                  >
                    {{ getFieldNumber(rowIndex, colIndex) }}
                  </q-btn>
                </div>
              </div>
            </div>

            <!-- Reference List -->
            <div class="reference-container">
              <div class="text-h6 text-primary q-mb-md">Reference Items</div>
              <q-scroll-area class="reference-scroll">
                <q-list padding bordered separator class="reference-list">
                  <q-item
                      v-for="item in referenceItems"
                      :key="item.number"
                      clickable
                      v-ripple
                      @click="toggleField(item.rowIndex, item.colIndex)"
                      :class="{ 'selected-item': item.selected }"
                  >
                    <q-item-section side>
                      <q-chip
                          :color="item.selected ? 'primary' : 'grey-3'"
                          :text-color="item.selected ? 'white' : 'grey-8'"
                          class="number-chip"
                      >
                        {{ item.number }}
                      </q-chip>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ item.text }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style scoped>
.bingo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  padding: 2rem 1rem;
}

.loading-container,
.error-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bingo-container {
  max-width: 1400px;
  margin: 0 auto;
}

.bingo-wrapper {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.header-section {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(to right, #f8f9fa, white, #f8f9fa);
}

.id-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.id-chip {
  transition: all 0.3s ease;
}

.id-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.announcement-section {
  padding: 1rem;
}

.bingo-banner,
.lobbyhoe-banner {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  animation: pulse 2s infinite;
}

.game-section {
  padding: 1.5rem;
}

.bingo-game-container {
  display: flex;
  gap: 2rem;
}

.bingo-card-container {
  flex: 0 0 auto;
}

.bingo-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.bingo-row {
  display: flex;
  gap: 8px;
}

.bingo-cell {
  aspect-ratio: 1;
  width: 70px;
  height: 70px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.bingo-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bingo-cell.selected {
  animation: pop 0.3s ease;
}

.reference-container {
  flex: 1;
  min-width: 0;
}

.reference-scroll {
  height: calc(100vh - 300px);
  border-radius: 12px;
}

.reference-list {
  background: white;
  border-radius: 12px;
}

.selected-item {
  background: rgba(25, 118, 210, 0.05);
  transition: background-color 0.3s ease;
}

.number-chip {
  min-width: 40px;
  font-weight: bold;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.notification-zoom {
  animation: zoomIn 0.3s ease;
}

@keyframes zoomIn {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Responsive Design */
@media (max-width: 1023px) {
  .bingo-game-container {
    flex-direction: column;
    align-items: center;
  }

  .bingo-card-container {
    margin-bottom: 2rem;
  }

  .reference-scroll {
    height: 400px;
  }
}

@media (max-width: 599px) {
  .bingo-page {
    padding: 1rem 0.5rem;
  }

  .bingo-cell {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }
}

@media (max-width: 359px) {
  .bingo-cell {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
}
</style>