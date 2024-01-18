<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from "vue";
import useBingoCard from "@/composables/useBingoCard";

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
const { myCards } = useBingoCard();
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> LobbyBinghoe </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area class="fit">
        <q-list>
          <q-item clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>
          <q-separator />
          <div v-if="myCards.length > 0" class="text-subtitle2 q-px-md q-py-sm">
            My Bingo Cards
          </div>
          <q-item
            v-for="card in myCards"
            :key="card.id"
            clickable
            v-ripple
            :to="`/bingo/card/${card.id}`"
          >
            <q-item-section avatar>
              <q-icon name="view_cozy" />
            </q-item-section>
            <q-item-section>{{ card.episode_name }}</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-ripple to="/faq">
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>
            <q-item-section>FAQ</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      Created by PhyberApex
    </q-footer>
  </q-layout>
</template>
