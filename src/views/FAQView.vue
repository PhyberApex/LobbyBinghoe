<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-pb-md">Frequently Asked Questions</div>
    <q-expansion-item
        v-for="(faq, index) in faqs"
        :key="index"
        :label="faq.question"
        class="q-mb-md"
    >
      <template v-slot:default>
        <p>{{ faq.answer }}</p>
      </template>
    </q-expansion-item>
  </q-page>
</template>

<script lang="ts">
export default {
  name: "FAQ",
  data() {
    return {
      faqs: [
        {
          question: "What is LobbyBinghoe?",
          answer: "LobbyBinghoe is a bingo web application designed specifically for fans of the German podcast 'Hobbylos' by Rezo and Julien Bäm. It adds an interactive element to your podcast listening experience.",
        },
        {
          question: "How do I play LobbyBinghoe?",
          answer: "To play, simply listen to the 'Hobbylos' podcast and mark off items on your bingo card as they come up during the show. The goal is to get a bingo by completing a row, column, or diagonal on your card.",
        },
        {
          question: "Do I need to create an account to play?",
          answer: "Currently, LobbyBinghoe does not require user accounts. Your bingo card information is stored locally in your browser.",
        },
        {
          question: "How are my bingo cards saved?",
          answer: "Your bingo card IDs are saved in your browser's local storage. This means they will persist between sessions on the same device, but won't be available if you switch to a different device or browser.",
        },
        {
          question: "Is LobbyBinghoe available on mobile devices?",
          answer: "Yes, LobbyBinghoe is designed to be responsive and should work well on both desktop and mobile browsers.",
        },
        {
          question: "Who are LobbyHoes?",
          answer: "LobbyHoes is the affectionate term used for listeners of the 'Hobbylos' podcast by Rezo and Julien Bäm.",
        },
      ],
    };
  },
};
</script>