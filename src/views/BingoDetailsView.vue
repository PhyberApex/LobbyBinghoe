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
const legendOpen = ref(false);
const {
  loading,
  bingoCard,
  fetchCard,
  bingoFound,
  lobbyHoeBingoFound,
  removeCardFromStorage,
} = useBingoCard();

const HTTP_ERRORS: Record<number, string> = {
  404: "Diese Karte existiert nicht. Stimmt die ID?",
  403: "Kein Zugriff auf diese Karte.",
  500: "Serverfehler. Bitte später nochmal versuchen.",
  503: "Service momentan nicht erreichbar. Bitte kurz warten.",
};

const toErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) return "Unbekannter Fehler. Bitte neu laden.";
  const match = error.message.match(/^(\d{3})/);
  if (match) {
    const code = Number(match[1]);
    return HTTP_ERRORS[code] ?? `Fehler ${code}. Bitte neu laden.`;
  }
  return error.message || "Unbekannter Fehler. Bitte neu laden.";
};

const loadCard = async (id: string) => {
  isError.value = false;
  errorText.value = "";
  try {
    await fetchCard(id);
  } catch (error) {
    isError.value = true;
    errorText.value = toErrorMessage(error);
  }
};

watch(
  [bingoFound, lobbyHoeBingoFound],
  ([newBingo, newLobbyHoeBingo], [oldBingo, oldLobbyHoeBingo]) => {
    if (!oldBingo && newBingo) {
      $q.notify({
        message: "BINGO!",
        color: "positive",
        position: "top",
        timeout: 3000,
        actions: [{ icon: "celebration", color: "white", handler: () => {} }],
        html: true,
      });
    }
    if (!oldLobbyHoeBingo && newLobbyHoeBingo) {
      $q.notify({
        message: "LobbyHoe-BINGO!",
        color: "positive",
        position: "top",
        timeout: 3000,
        actions: [{ icon: "celebration", color: "white", handler: () => {} }],
        html: true,
      });
    }
  },
);

onMounted(() => loadCard(props.id));

const removeCard = () => {
  $q.dialog({
    title: "Karte entfernen?",
    message: "Sie wird aus deinem Browserverlauf gelöscht.",
    persistent: true,
    color: "negative",
    ok: { label: "Entfernen", color: "negative" },
    cancel: { label: "Abbrechen", color: "grey" },
  }).onOk(() => {
    removeCardFromStorage();
    router.push("/");
  });
};

watch(() => props.id, loadCard);

const toggleField = (rowIndex: number, colIndex: number) => {
  if (bingoCard.value !== null) {
    bingoCard.value.bingoValues[rowIndex]![colIndex] =
      !bingoCard.value.bingoValues[rowIndex]![colIndex];
  }
};

const gridItems = computed(() => {
  if (!bingoCard.value) return [];
  return bingoCard.value.bingoFacts.flatMap((row, rowIndex) =>
    row.map((text, colIndex) => ({
      number: rowIndex * 5 + colIndex + 1,
      text,
      rowIndex,
      colIndex,
      selected: bingoCard.value!.bingoValues[rowIndex]![colIndex],
    })),
  );
});

const copyCardId = () => {
  if (bingoCard.value?.id) {
    navigator.clipboard.writeText(bingoCard.value.id);
    $q.notify({
      message: "Karten-ID kopiert",
      color: "info",
      position: "top",
      timeout: 2000,
      icon: "content_copy",
    });
  }
};
</script>

<template>
  <div class="bingo-page">
    <!-- Loading -->
    <div v-if="loading" class="state-container">
      <q-spinner-dots style="color: var(--amber)" size="50px" />
      <div class="state-text q-mt-md">Karte wird geladen...</div>
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="state-container q-pa-md">
      <q-banner inline-actions rounded class="error-banner">
        <template v-slot:avatar>
          <q-icon name="error" style="color: var(--q-negative)" />
        </template>
        <span class="error-msg">{{ errorText }}</span>
        <template v-slot:action>
          <q-btn flat icon="refresh" label="Nochmal" class="error-retry-btn" @click="loadCard(props.id)" />
          <q-btn flat label="Zurück" to="/" icon="arrow_back" class="error-back-btn" />
        </template>
      </q-banner>
    </div>

    <!-- Game -->
    <div v-else-if="bingoCard !== null" class="game-page">

      <!-- Header -->
      <div class="card-header">
        <div class="episode-name">{{ bingoCard.episode }}</div>
        <div class="header-actions">
          <button
            class="id-chip"
            @click="copyCardId"
            aria-label="Karten-ID in die Zwischenablage kopieren"
          >
            <q-icon name="content_copy" size="14px" />
            <span>{{ bingoCard.id }}</span>
          </button>
          <q-btn
            v-if="bingoCard.isLocal"
            flat
            round
            dense
            icon="delete"
            class="remove-btn"
            @click="removeCard"
            aria-label="Karte aus dem Verlauf entfernen"
          >
            <q-tooltip>Aus Verlauf entfernen</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Win banners -->
      <div v-if="bingoFound || lobbyHoeBingoFound" class="win-row" role="status" aria-live="polite">
        <div v-if="bingoFound" class="win-chip">
          <q-icon name="emoji_events" size="1.1rem" />
          BINGO!
        </div>
        <div v-if="lobbyHoeBingoFound" class="win-chip win-chip--super">
          <q-icon name="workspace_premium" size="1.1rem" />
          LobbyHoe-BINGO!
        </div>
      </div>

      <!-- Bingo Grid -->
      <div class="bingo-grid" role="group" aria-label="Bingo card">
        <button
          v-for="item in gridItems"
          :key="item.number"
          class="bingo-cell"
          :class="{ 'bingo-cell--on': item.selected }"
          @click="toggleField(item.rowIndex, item.colIndex)"
          :aria-label="`${item.text}, ${item.selected ? 'marked' : 'not marked'}`"
          :aria-pressed="item.selected ? 'true' : 'false'"
        >
          <span class="cell-num">{{ item.number }}</span>
          <span class="cell-text">{{ item.text }}</span>
        </button>
      </div>

      <!-- Legend (collapsed by default) -->
      <details class="legend" @toggle="legendOpen = ($event.target as HTMLDetailsElement).open">
        <summary class="legend-summary">
          <q-icon
            name="expand_more"
            size="16px"
            class="legend-chevron"
            :class="{ 'legend-chevron--open': legendOpen }"
          />
          Alle Felder
        </summary>
        <div class="legend-list">
          <button
            v-for="item in gridItems"
            :key="item.number"
            class="legend-item"
            :class="{ 'legend-item--on': item.selected }"
            @click="toggleField(item.rowIndex, item.colIndex)"
            :aria-label="`${item.text}, ${item.selected ? 'marked' : 'not marked'}`"
            :aria-pressed="item.selected ? 'true' : 'false'"
          >
            <span class="legend-num" :class="{ 'legend-num--on': item.selected }">
              {{ item.number }}
            </span>
            <span class="legend-text">{{ item.text }}</span>
          </button>
        </div>
      </details>

    </div>
  </div>
</template>

<style scoped>
.bingo-page {
  min-height: 100vh;
  background-color: var(--bg-base);
  padding: 1.5rem 1rem 3rem;
}

/* Loading / error states */
.state-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.state-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.error-banner {
  background-color: var(--bg-raised);
  border: 1px solid oklch(50% 0.18 20 / 0.4);
  max-width: 500px;
}

.error-msg { color: var(--text-primary); }
.error-retry-btn { color: var(--amber); }
.error-back-btn { color: var(--text-secondary); }

/* Game page wrapper */
.game-page {
  max-width: 760px;
  margin: 0 auto;
}

/* Header */
.card-header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.episode-name {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.25;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.id-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  font-size: 0.72rem;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: monospace;
  transition: border-color 0.15s ease-out, color 0.15s ease-out;
}

.id-chip:hover {
  border-color: var(--amber-dim);
  color: var(--amber);
}

.remove-btn {
  color: var(--text-secondary);
  transition: color 0.15s ease-out;
}

.remove-btn:hover { color: var(--q-negative); }

/* Win row */
.win-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.win-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: oklch(70% 0.18 142 / 0.15);
  border: 1px solid var(--green);
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--green);
}

.win-chip--super {
  background-color: oklch(74% 0.19 72 / 0.12);
  border-color: var(--amber);
  color: var(--amber);
}

/* Bingo grid */
.bingo-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  margin-bottom: 1rem;
}

.bingo-cell {
  height: 88px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.45rem 0.5rem 0.4rem;
  border-radius: 7px;
  background-color: var(--bg-raised);
  border: 1px solid var(--border-subtle);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.12s ease-out, border-color 0.12s ease-out;
}

.bingo-cell:hover {
  background-color: oklch(74% 0.06 72 / 0.14);
  border-color: var(--amber-dim);
}

.bingo-cell--on {
  background-color: var(--amber);
  border-color: var(--amber);
}

.bingo-cell--on:hover {
  background-color: oklch(78% 0.19 72);
  border-color: oklch(78% 0.19 72);
}

.cell-num {
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--text-secondary);
  line-height: 1;
  flex: 0 0 auto;
  transition: color 0.12s ease-out;
}

.bingo-cell--on .cell-num {
  color: var(--amber-fg);
  opacity: 0.7;
}

.cell-text {
  font-size: 0.68rem;
  line-height: 1.3;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  transition: color 0.12s ease-out;
}

.bingo-cell--on .cell-text {
  color: var(--amber-fg);
}

/* Legend */
.legend {
  margin-top: 0.5rem;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--bg-raised);
}

.legend-summary {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 0.875rem;
  min-height: 44px;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
  list-style: none;
  user-select: none;
  transition: color 0.15s ease-out;
}

.legend-summary::-webkit-details-marker { display: none; }

.legend-summary:hover { color: var(--text-primary); }

.legend-chevron {
  color: var(--text-secondary);
  transition: transform 0.2s ease-out;
  flex: 0 0 auto;
}

.legend-chevron--open { transform: rotate(180deg); }

.legend-list {
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.375rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.6rem;
  min-height: 44px;
  border-radius: 5px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background-color 0.12s ease-out;
}

.legend-item:hover { background-color: oklch(74% 0.06 72 / 0.1); }

.legend-item--on { background-color: oklch(74% 0.06 72 / 0.1); }

.legend-num {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--bg-overlay);
  border: 1px solid var(--border-subtle);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-secondary);
  transition: background-color 0.12s ease-out, color 0.12s ease-out, border-color 0.12s ease-out;
}

.legend-num--on {
  background-color: var(--amber);
  border-color: var(--amber);
  color: var(--amber-fg);
}

.legend-text {
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--text-primary);
}

/* Responsive */
@media (max-width: 599px) {
  .bingo-page { padding: 1rem 0.375rem 2rem; }

  .bingo-grid { gap: 3px; }

  .bingo-cell {
    height: 76px;
    padding: 0.35rem 0.4rem 0.3rem;
  }

  .cell-text {
    font-size: 0.72rem;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 359px) {
  .bingo-grid { gap: 2px; }

  .bingo-cell {
    height: 64px;
    padding: 0.3rem;
  }

  .cell-text {
    font-size: 0.72rem;
    -webkit-line-clamp: 2;
  }
}
</style>
