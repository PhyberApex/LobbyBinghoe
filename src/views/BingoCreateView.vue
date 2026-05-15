<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import useBingoCard from "@/composables/useBingoCard";

const router = useRouter();
const episodeName = ref("");
const { createNewCard, loading } = useBingoCard();
const error = ref("");

const validateInput = () => {
  error.value = "";
  if (!episodeName.value.trim()) {
    error.value = "Bitte gib einen Folgennamen ein.";
    return false;
  }
  return true;
};

const createNew = async () => {
  if (!validateInput()) return;

  try {
    const id = await createNewCard(episodeName.value.trim());
    await router.push(`card/${id}`);
  } catch (err) {
    const code = err instanceof Error ? err.message.match(/^(\d{3})/)?.[1] : null;
    error.value = code === "500"
      ? "Serverfehler. Bitte später nochmal versuchen."
      : "Karte konnte nicht erstellt werden. Bitte nochmal versuchen.";
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !loading.value) {
    createNew();
  }
};
</script>

<template>
  <div class="create-page">
    <div class="create-content">
      <h1 class="create-title">Neue Karte</h1>
      <p class="create-sub">Gib der Folge einen Namen, damit du sie später findest.</p>

      <q-input
        v-model.trim="episodeName"
        :disable="loading"
        label="Folgenname"
        placeholder="z.B. Folge 42"
        filled
        clearable
        bottom-slots
        class="name-input"
        @keyup="handleKeyPress"
        :error="!!error"
        :error-message="error"
        dark
      >
        <template v-slot:prepend>
          <q-icon name="podcasts" style="color: var(--amber)" />
        </template>
        <template v-slot:hint>
          Name oder Nummer, wie du magst
        </template>
      </q-input>

      <q-btn
        unelevated
        no-caps
        class="submit-btn"
        size="large"
        :loading="loading"
        @click="createNew"
      >
        <q-icon name="add_box" size="1.2em" class="q-mr-sm" />
        Karte erstellen

        <template v-slot:loading>
          <q-spinner-dots />
          <span class="q-ml-sm">Wird erstellt...</span>
        </template>
      </q-btn>

      <ul class="tips-list">
        <li>Name ist nur für dich, also kreativ sein.</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.create-page {
  min-height: 100vh;
  background-color: var(--bg-base);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 3rem 1.5rem 2rem;
}

.create-content {
  width: 100%;
  max-width: 480px;
}

.create-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--amber);
  margin: 0 0 0.25rem;
  letter-spacing: -0.5px;
}

.create-sub {
  color: var(--text-secondary);
  margin: 0 0 2rem;
  font-size: 0.95rem;
}

.name-input {
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  height: 48px;
  background-color: var(--amber);
  color: var(--amber-fg);
  font-weight: 700;
  border-radius: 8px;
  transition: background-color 0.15s ease-out;
  margin-bottom: 2rem;
}

.submit-btn:hover:not(:disabled) {
  background-color: oklch(78% 0.19 72);
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

@media (max-width: 599px) {
  .create-page {
    padding: 2rem 1rem;
  }
}
</style>
