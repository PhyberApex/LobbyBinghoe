<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, computed } from "vue";
import useBingoCard from "@/composables/useBingoCard";

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const { myCards } = useBingoCard();

const taglines = [
  "Hobbylos-Bingo für LobbyHoes",
  "Hör rein, mach Kreuze, ruf Bingo.",
  "Auf die Plätze, fertig, los!",
  "Wer zuerst Bingo ruft, gewinnt.",
];
const randomTagline = computed(() =>
  taglines[Math.floor(Math.random() * taglines.length)],
);
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="app-header">
      <q-toolbar class="q-py-sm">
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
          class="menu-button"
          aria-label="Open navigation menu"
        />
        <q-toolbar-title class="text-h5">
          <span class="logo-text">LobbyBinghoe</span>
          <div class="tagline text-caption q-mt-xs">{{ randomTagline }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered class="app-drawer">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple to="/" class="menu-item">
            <q-item-section avatar>
              <q-icon name="home" class="amber-icon" />
            </q-item-section>
            <q-item-section>Start</q-item-section>
          </q-item>

          <q-separator class="drawer-sep" spaced />

          <template v-if="myCards.length > 0">
            <div class="text-subtitle2 q-px-md q-py-xs text-weight-bold drawer-label">
              Meine Karten
            </div>

            <q-item
              v-for="card in myCards"
              :key="card.id"
              clickable
              v-ripple
              :to="`/bingo/card/${card.id}`"
              class="card-item q-my-xs"
            >
              <q-item-section avatar>
                <q-icon name="view_cozy" class="amber-icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ card.episode_name }}</q-item-label>
                <q-item-label caption class="text-secondary-muted">Zum Spielen öffnen</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" class="chevron-icon" />
              </q-item-section>
            </q-item>

            <q-separator class="drawer-sep" spaced />
          </template>

          <template v-else>
            <div class="empty-cards">
              <q-icon name="add_box" size="20px" class="empty-cards-icon" />
              <span>Noch keine Karten. <router-link to="/bingo/new" class="empty-cards-link" @click="leftDrawerOpen = false">Erste erstellen?</router-link></span>
            </div>

            <q-separator class="drawer-sep" spaced />
          </template>

          <q-item clickable v-ripple to="/faq" class="menu-item">
            <q-item-section avatar>
              <q-icon name="help" class="muted-icon" />
            </q-item-section>
            <q-item-section>FAQ</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="app-footer">
      <div class="row items-center justify-center q-px-md q-py-sm footer-inner">
        <span class="footer-text">Made with ❤️ by <a href="https://phyberapex.de">PhyberApex</a></span>
      </div>
    </q-footer>
  </q-layout>
</template>

<style scoped>
.footer-text a {
  color: var(--amber);
  text-decoration: none;
  transition: color 0.15s ease-out;
}

.footer-text a:hover {
  color: oklch(78% 0.19 72);
  text-decoration: underline;
}
.app-header {
  background-color: var(--bg-inset);
  border-bottom: 1px solid var(--border-subtle);
}

.app-footer {
  background-color: var(--bg-inset);
  border-top: 1px solid var(--border-subtle);
}

.footer-inner {
  min-height: 40px;
}

.footer-text {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.app-drawer {
  background-color: var(--bg-raised);
  border-right: 1px solid var(--border-subtle);
}

.drawer-sep {
  background-color: var(--border-subtle);
  opacity: 1;
}

.drawer-label {
  color: var(--amber);
  letter-spacing: 0.06em;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.logo-text {
  font-weight: 700;
  color: var(--amber);
  letter-spacing: 0.5px;
}

.tagline {
  opacity: 0.6;
  color: var(--text-primary);
  font-style: italic;
}

.menu-button {
  color: var(--text-secondary);
  transition: color 0.15s ease-out;
}

.menu-button:hover {
  color: var(--amber);
}

.menu-item {
  border-radius: 6px;
  margin: 2px 0;
  color: var(--text-primary);
  transition: background-color 0.15s ease-out;
}

.menu-item:hover {
  background-color: oklch(74% 0.06 72 / 0.1);
}

.card-item {
  border-radius: 6px;
  margin: 2px 4px;
  color: var(--text-primary);
  transition: background-color 0.15s ease-out;
}

.card-item:hover {
  background-color: oklch(74% 0.06 72 / 0.1);
}

.amber-icon {
  color: var(--amber);
}

.muted-icon {
  color: var(--text-secondary);
}

.chevron-icon {
  color: var(--text-secondary);
  opacity: 0.5;
}

.text-secondary-muted {
  color: var(--text-secondary);
}

.empty-cards {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  font-size: 0.8rem;
  line-height: 1.4;
}

.empty-cards-icon {
  color: var(--text-secondary);
  opacity: 0.4;
  flex: 0 0 auto;
}

.empty-cards-link {
  color: var(--amber);
  text-decoration: none;
}

.empty-cards-link:hover {
  text-decoration: underline;
}
</style>
