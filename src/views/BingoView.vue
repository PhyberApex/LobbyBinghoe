<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const bingoId = ref("");
const router = useRouter();
const error = ref("");
const isLoading = ref(false);

const v4 = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
);

const validate = () => {
  error.value = "";
  if (!bingoId.value) {
    error.value = "Bitte gib eine Karten-ID ein.";
    return false;
  }
  if (!bingoId.value.match(v4)) {
    error.value = "Keine gültige Karten-ID. Format: xxxxxxxx-xxxx-4xxx-…";
    return false;
  }
  return true;
};

const navigate = async () => {
  if (validate()) {
    isLoading.value = true;
    try {
      await router.push(`bingo/card/${bingoId.value}`);
    } finally {
      isLoading.value = false;
    }
  }
};

const isValidId = computed(() =>
  bingoId.value ? bingoId.value.match(v4) !== null : true,
);

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    navigate();
  }
};
</script>

<template>
  <main class="page-container">
    <div class="home-content">
      <h1 class="home-title">LobbyBinghoe</h1>
      <p class="home-sub">Bingo für LobbyHoes. Hör Hobbylos, mach Kreuze, ruf Bingo.</p>

      <div class="actions-row">
        <q-btn
          to="/bingo/new"
          class="primary-btn"
          size="large"
          unelevated
          no-caps
        >
          <q-icon name="add_box" size="20px" class="q-mr-sm" />
          Neue Karte
        </q-btn>
      </div>

      <div class="join-section">
        <div class="divider-label">oder mit einer Karten-ID beitreten</div>

        <q-input
          filled
          v-model.trim="bingoId"
          label="Karten-ID"
          placeholder="xxxxxxxx-xxxx-4xxx-..."
          @keyup="handleKeyPress"
          :error="!!error"
          :error-message="error"
          class="id-input"
          bottom-slots
          dark
          bg-color="bg-raised"
        >
          <template v-slot:prepend>
            <q-icon name="badge" style="color: var(--text-secondary)" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="bingoId"
              :name="isValidId ? 'check_circle' : 'error'"
              :style="
                isValidId ? 'color: var(--green)' : 'color: var(--q-negative)'
              "
            />
          </template>
        </q-input>

        <q-btn
          class="join-btn"
          size="large"
          unelevated
          no-caps
          @click="navigate"
          :loading="isLoading"
          :disable="!bingoId"
        >
          <q-icon name="search" size="20px" class="q-mr-sm" />
          Karte suchen
        </q-btn>
      </div>

      <ul class="tips-list">
        <li>Kein Account nötig, alles bleibt im Browser</li>
        <li>Karten-ID teilen und zusammen mitspielen</li>
        <li>Jede Karte gehört zu einer Episode</li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: var(--bg-base);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 1.5rem 2rem;
}

.home-content {
  width: 100%;
  max-width: 440px;
}

.home-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--amber);
  margin: 0 0 0.25rem;
  letter-spacing: -0.5px;
}

.home-sub {
  color: var(--text-secondary);
  margin: 0 0 2rem;
  font-size: 0.95rem;
}

.actions-row {
  margin-bottom: 2rem;
}

.primary-btn {
  width: 100%;
  background-color: var(--amber);
  color: var(--amber-fg);
  font-weight: 700;
  letter-spacing: 0.3px;
  border-radius: 8px;
  height: 48px;
  transition: background-color 0.15s ease-out;
}

.primary-btn:hover {
  background-color: oklch(78% 0.19 72);
}

.join-section {
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 1.25rem;
  background-color: var(--bg-raised);
  margin-bottom: 2rem;
}

.divider-label {
  color: var(--text-secondary);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 1rem;
}

.id-input {
  margin-bottom: 0.75rem;
}

.join-btn {
  width: 100%;
  background-color: var(--bg-overlay);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  font-weight: 600;
  border-radius: 8px;
  height: 44px;
  transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
}

.join-btn:hover:not(:disabled) {
  background-color: oklch(74% 0.06 72 / 0.15);
  border-color: var(--amber-dim);
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  color: var(--text-secondary);
  font-size: 0.82rem;
  padding: 0.3rem 0 0.3rem 1.2rem;
  position: relative;
}

.tips-list li::before {
  content: "·";
  position: absolute;
  left: 0.3rem;
  color: var(--amber-dim);
  font-size: 1.1rem;
  line-height: 1.2;
}
</style>
