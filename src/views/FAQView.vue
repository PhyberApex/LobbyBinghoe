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

<script>
export default {
  name: "FAQ",
  data() {
    return {
      faqs: [
        {
          question: "What is Quasar Framework?",
          answer:
            "Quasar is a Vue.js based framework, which allows you as a web developer to quickly craft responsive websites/apps in many flavors.",
        },
        {
          question: "How to install Quasar?",
          answer:
            "You can install Quasar using the Quasar CLI or by adding it to a Vue project via Vue CLI.",
        },
        {
          question: "Can Quasar be used for mobile apps?",
          answer:
            "Yes, Quasar is designed to build apps for both web and mobile platforms using the same codebase.",
        },
        // Add more FAQs here
      ],
    };
  },
};
</script>
