<script setup lang="ts">
import { computed, ref, watch } from "vue";

interface FAQ {
  question: string;
  answer: string;
  category: string;
  icon?: string;
}

const expandedItem = ref<number | null>(null);

const faqs: FAQ[] = [
  {
    question: "Was ist LobbyBinghoe?",
    answer:
      "LobbyBinghoe ist eine Bingo-App speziell für Fans des deutschen Podcasts 'Hobbylos' von Rezo und Julien Bäm. Hör rein und mach Kreuze, wenn du etwas vorhergesagt hast.",
    category: "Allgemein",
    icon: "casino",
  },
  {
    question: "Wie spiele ich LobbyBinghoe?",
    answer:
      "Hör den 'Hobbylos'-Podcast und markiere Felder auf deiner Karte, sobald die entsprechenden Dinge passieren. Bingo gibt es, wenn eine Reihe, Spalte oder Diagonale vollständig markiert ist.",
    category: "Gameplay",
    icon: "sports_esports",
  },
  {
    question: "Brauche ich einen Account?",
    answer:
      "Nein. Alles wird lokal in deinem Browser gespeichert, kein Account nötig.",
    category: "Account",
    icon: "person_outline",
  },
  {
    question: "Wie werden meine Karten gespeichert?",
    answer:
      "Karten-IDs und dein Spielfortschritt werden im lokalen Speicher deines Browsers gesichert. Sie bleiben zwischen Sitzungen erhalten, sind aber nicht auf anderen Geräten oder Browsern verfügbar.",
    category: "Technik",
    icon: "save",
  },
  {
    question: "Funktioniert LobbyBinghoe auf dem Handy?",
    answer: "Ja, die App läuft auf Desktop- und Mobilgeräten.",
    category: "Technik",
    icon: "smartphone",
  },
  {
    question: "Wer sind die LobbyHoes?",
    answer:
      "LobbyHoes ist die liebevolle Bezeichnung für Hörerinnen und Hörer des 'Hobbylos'-Podcasts von Rezo und Julien Bäm.",
    category: "Allgemein",
    icon: "groups",
  },
];

const categories = [...new Set(faqs.map((faq) => faq.category))];

const toggleExpanded = (index: number) => {
  expandedItem.value = expandedItem.value === index ? null : index;
};

const searchQuery = ref("");
const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs;
  const query = searchQuery.value.toLowerCase();
  return faqs.filter(
    (faq) =>
      faq.category.toLowerCase().includes(query) ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query),
  );
});

watch(searchQuery, () => {
  expandedItem.value = null;
});
</script>

<template>
  <div class="faq-page">
    <h1 class="faq-title">FAQ</h1>

    <q-input
      v-model="searchQuery"
      filled
      class="search-bar q-mb-md"
      label="Suche"
      clearable
      dark
    >
      <template v-slot:prepend>
        <q-icon name="search" style="color: var(--text-secondary)" />
      </template>
      <template v-slot:append v-if="searchQuery">
        <span class="result-count">{{ filteredFaqs.length }}</span>
      </template>
    </q-input>

    <div class="category-row q-mb-lg">
      <button
        v-for="category in categories"
        :key="category"
        class="cat-chip"
        :class="{ 'cat-chip--active': searchQuery === category }"
        @click="searchQuery = searchQuery === category ? '' : category"
      >
        {{ category }}
      </button>
    </div>

    <div class="faq-list">
      <div
        v-for="(faq, index) in filteredFaqs"
        :key="index"
        class="faq-item"
        :class="{ 'faq-item--open': expandedItem === index }"
      >
        <button
          class="faq-trigger"
          @click="toggleExpanded(index)"
          :aria-expanded="expandedItem === index ? 'true' : 'false'"
        >
          <q-icon :name="faq.icon ?? 'help'" class="faq-icon" size="18px" />
          <span class="faq-q">{{ faq.question }}</span>
          <q-icon
            name="expand_more"
            class="faq-chevron"
            :class="{ 'faq-chevron--open': expandedItem === index }"
            size="18px"
          />
        </button>

        <div
          class="faq-answer-wrap"
          :class="{ 'faq-answer-wrap--open': expandedItem === index }"
        >
          <div class="faq-answer-inner">
            <p class="faq-answer">{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <div v-if="searchQuery && filteredFaqs.length === 0" class="no-results">
        <q-icon name="search_off" size="40px" style="color: var(--text-secondary)" />
        <div class="no-results-text q-mt-md">Keine passenden Fragen gefunden</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  background-color: var(--bg-base);
  min-height: 100vh;
}

.faq-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--amber);
  margin: 0 0 1.5rem;
  letter-spacing: -0.5px;
}

.search-bar {
  max-width: 100%;
}

.result-count {
  font-size: 0.75rem;
  color: var(--amber);
  font-weight: 600;
}

.category-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cat-chip {
  background: none;
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  padding: 0.5rem 0.875rem;
  min-height: 36px;
  font-size: 0.78rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.15s ease-out, color 0.15s ease-out, background-color 0.15s ease-out;
}

.cat-chip:hover {
  border-color: var(--amber-dim);
  color: var(--text-primary);
}

.cat-chip--active {
  border-color: var(--amber);
  background-color: oklch(74% 0.06 72 / 0.15);
  color: var(--amber);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.faq-item {
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--bg-raised);
  transition: border-color 0.15s ease-out;
}

.faq-item--open {
  border-color: oklch(74% 0.06 72 / 0.5);
}

.faq-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.875rem 1rem;
  min-height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--text-primary);
}

.faq-icon {
  color: var(--amber);
  flex: 0 0 auto;
}

.faq-q {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
}

.faq-chevron {
  flex: 0 0 auto;
  color: var(--text-secondary);
  transition: transform 0.2s ease-out;
}

.faq-chevron--open {
  transform: rotate(180deg);
}

.faq-answer-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.22s ease-out;
}

.faq-answer-wrap--open {
  grid-template-rows: 1fr;
}

.faq-answer-wrap > * {
  overflow: hidden;
}

.faq-answer-inner {
  padding-bottom: 0.25rem;
}

.faq-answer {
  padding: 0 1rem 0.75rem 3rem;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.no-results {
  text-align: center;
  padding: 3rem;
}

.no-results-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
</style>
