<script setup lang="ts">
import {computed, ref} from 'vue';

interface FAQ {
  question: string;
  answer: string;
  category?: string;
  icon?: string;
}

const expandedItem = ref<number | null>(null);

const faqs: FAQ[] = [
  {
    question: "What is LobbyBinghoe?",
    answer: "LobbyBinghoe is a bingo web application designed specifically for fans of the German podcast 'Hobbylos' by Rezo and Julien Bäm. It adds an interactive element to your podcast listening experience.",
    category: "General",
    icon: "casino"
  },
  {
    question: "How do I play LobbyBinghoe?",
    answer: "To play, simply listen to the 'Hobbylos' podcast and mark off items on your bingo card as they come up during the show. The goal is to get a bingo by completing a row, column, or diagonal on your card.",
    category: "Gameplay",
    icon: "sports_esports"
  },
  {
    question: "Do I need to create an account to play?",
    answer: "Currently, LobbyBinghoe does not require user accounts. Your bingo card information is stored locally in your browser.",
    category: "Account",
    icon: "person_outline"
  },
  {
    question: "How are my bingo cards saved?",
    answer: "Your bingo card IDs are saved in your browser's local storage. This means they will persist between sessions on the same device, but won't be available if you switch to a different device or browser.",
    category: "Technical",
    icon: "save"
  },
  {
    question: "Is LobbyBinghoe available on mobile devices?",
    answer: "Yes, LobbyBinghoe is designed to be responsive and should work well on both desktop and mobile browsers.",
    category: "Technical",
    icon: "smartphone"
  },
  {
    question: "Who are LobbyHoes?",
    answer: "LobbyHoes is the affectionate term used for listeners of the 'Hobbylos' podcast by Rezo and Julien Bäm.",
    category: "General",
    icon: "groups"
  },
];

const categories = [...new Set(faqs.map(faq => faq.category))];

const toggleExpanded = (index: number) => {
  expandedItem.value = expandedItem.value === index ? null : index;
};

const searchQuery = ref('');
const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs;
  const query = searchQuery.value.toLowerCase();
  return faqs.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
  );
});
</script>

<template>
  <q-page class="faq-page q-pa-md">
    <!-- Header Section -->
    <div class="header-section q-mb-lg">
      <div class="text-h4 text-weight-bold text-primary q-mb-md">
        Frequently Asked Questions
      </div>
      <div class="text-subtitle1 text-grey-7">
        Find answers to common questions about LobbyBinghoe
      </div>
    </div>

    <!-- Search Bar -->
    <q-input
        v-model="searchQuery"
        filled
        class="q-mb-lg search-bar"
        placeholder="Search FAQs..."
        clearable
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append v-if="searchQuery">
        <q-badge color="primary" text-color="white" floating>
          {{ filteredFaqs.length }}
        </q-badge>
      </template>
    </q-input>

    <!-- FAQ Categories -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div
          v-for="category in categories"
          :key="category"
          class="col-auto"
      >
        <q-chip
            clickable
            :color="searchQuery === category ? 'primary' : 'grey-3'"
            :text-color="searchQuery === category ? 'white' : 'grey-8'"
            @click="searchQuery = searchQuery === category ? '' : category"
        >
          {{ category }}
        </q-chip>
      </div>
    </div>

    <!-- FAQ List -->
    <div class="faq-list">
      <q-slide-transition v-for="(faq, index) in filteredFaqs" :key="index">
        <q-card
            flat
            bordered
            class="faq-item q-mb-md"
            :class="{ 'faq-item-expanded': expandedItem === index }"
        >
          <q-item
              clickable
              v-ripple
              @click="toggleExpanded(index)"
              class="faq-question"
          >
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                <q-icon :name="faq.icon" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1 text-weight-medium">
                {{ faq.question }}
              </q-item-label>
              <q-item-label caption>
                {{ faq.category }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon
                  :name="expandedItem === index ? 'expand_less' : 'expand_more'"
                  size="24px"
                  class="transition-transform"
                  :class="{ 'rotate-180': expandedItem === index }"
              />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-card-section
              class="faq-answer"
              :class="{ 'faq-answer-visible': expandedItem === index }"
          >
            <p class="text-body1 q-ma-none">{{ faq.answer }}</p>
          </q-card-section>
        </q-card>
      </q-slide-transition>

      <!-- No Results Message -->
      <div v-if="searchQuery && filteredFaqs.length === 0" class="no-results">
        <q-icon name="search_off" size="48px" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">No matching questions found</div>
        <div class="text-body1 text-grey-6">Try adjusting your search terms</div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.faq-page {
  max-width: 800px;
  margin: 0 auto;
}

.header-section {
  text-align: center;
  padding: 2rem 0;
}

.search-bar {
  max-width: 600px;
  margin: 0 auto;
}

.faq-item {
  border-radius: 8px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.faq-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.faq-item-expanded {
  background-color: #f8f9fa;
}

.faq-question {
  padding: 1rem;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 1rem;
}

.faq-answer-visible {
  max-height: 500px;
  padding: 1rem;
}

.transition-transform {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.no-results {
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 2rem;
}
</style>