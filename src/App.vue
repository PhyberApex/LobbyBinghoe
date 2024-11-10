<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref, computed } from "vue";
import useBingoCard from "@/composables/useBingoCard";

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const { myCards } = useBingoCard();

// Add some personality with random taglines
const taglines = [
  "Where lobby dreams come true!",
  "Check those boxes!",
  "Bingo just got better!",
  "Let the games begin!",
];
const randomTagline = computed(() =>
    taglines[Math.floor(Math.random() * taglines.length)]
);
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="header-gradient">
      <q-toolbar class="q-py-sm">
        <q-btn
            dense
            flat
            round
            icon="menu"
            @click="toggleLeftDrawer"
            class="menu-button"
        >
          <q-tooltip>Toggle Menu</q-tooltip>
        </q-btn>
        <q-toolbar-title class="text-h5">
          <span class="logo-text">🎲 LobbyBinghoe</span>
          <div class="tagline text-caption q-mt-xs">{{ randomTagline }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        side="left"
        bordered
        class="drawer-background"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple to="/" class="menu-item">
            <q-item-section avatar>
              <q-icon name="home" color="primary" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>

          <q-separator spaced />

          <template v-if="myCards.length > 0">
            <div class="text-subtitle1 q-px-md q-py-sm text-weight-bold text-primary">
              My Bingo Cards
            </div>

            <q-item
                v-for="card in myCards"
                :key="card.id"
                clickable
                v-ripple
                :to="`/bingo/card/${card.id}`"
                class="card-item q-my-sm"
            >
              <q-item-section avatar>
                <q-icon name="view_cozy" color="accent" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ card.episode_name }}</q-item-label>
                <q-item-label caption>Click to play!</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" color="grey-7" />
              </q-item-section>
            </q-item>
          </template>

          <q-separator spaced />

          <q-item clickable v-ripple to="/faq" class="menu-item">
            <q-item-section avatar>
              <q-icon name="help" color="info" />
            </q-item-section>
            <q-item-section>FAQ</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="footer-gradient">
      <div class="row items-center justify-between q-px-md q-py-sm">
        <div>Created with ❤️ by PhyberApex</div>
        <q-btn
            flat
            round
            icon="favorite"
            color="red-3"
            class="pulse-animation"
        >
          <q-tooltip>Show some love!</q-tooltip>
        </q-btn>
      </div>
    </q-footer>
  </q-layout>
</template>

<style scoped>
.header-gradient {
  background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
}

.footer-gradient {
  background: linear-gradient(135deg, #424242 0%, #212121 100%);
}

.drawer-background {
  background-color: #f8f9fa;
}

.logo-text {
  font-weight: 700;
  letter-spacing: 0.5px;
}

.tagline {
  opacity: 0.9;
  font-style: italic;
}

.menu-item {
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

.card-item {
  border-radius: 12px;
  margin: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.card-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.menu-button {
  transition: transform 0.3s ease;
}

.menu-button:hover {
  transform: rotate(90deg);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.pulse-animation {
  animation: pulse 2s infinite;
}
</style>