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
    error.value = "Please enter a card ID";
    return false;
  }
  if (!bingoId.value.match(v4)) {
    error.value = "Please enter a valid card ID";
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
    bingoId.value ? bingoId.value.match(v4) !== null : true
);

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    navigate();
  }
};
</script>

<template>
  <main class="page-container">
    <q-card class="my-card" bordered>
      <q-card-section class="card-header bg-primary text-white">
        <div class="text-h5 text-center">Welcome to LobbyBinghoe! 🎲</div>
        <div class="text-subtitle2 text-center q-mt-sm">Create a new game or join an existing one</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <div class="row q-col-gutter-md">
          <!-- Create New Card Section -->
          <div class="col-12">
            <q-btn
                to="/bingo/new"
                color="primary"
                class="full-width create-btn"
                size="large"
            >
              <template v-slot:default>
                <div class="row items-center">
                  <q-icon name="add_box" size="24px" class="q-mr-sm" />
                  <div>
                    <div class="text-subtitle1 text-weight-bold">Create New Card</div>
                    <div class="text-caption">Start a fresh bingo card</div>
                  </div>
                </div>
              </template>
            </q-btn>
          </div>

          <div class="col-12">
            <div class="text-center text-subtitle1 text-grey-7 q-py-md">
              - OR -
            </div>
          </div>

          <!-- Join Existing Card Section -->
          <div class="col-12">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">Search Existing Card</div>
            <q-input
                filled
                v-model.trim="bingoId"
                placeholder="Enter Card ID"
                @keyup="handleKeyPress"
                :error="!!error"
                :error-message="error"
                class="q-mb-md"
                bottom-slots
            >
              <template v-slot:prepend>
                <q-icon name="badge" />
              </template>
              <template v-slot:append>
                <q-icon
                    v-if="bingoId"
                    :name="isValidId ? 'check_circle' : 'error'"
                    :color="isValidId ? 'positive' : 'negative'"
                />
              </template>
              <template v-slot:hint>
                Enter a valid card ID to use it
              </template>
            </q-input>

            <q-btn
                color="secondary"
                class="full-width join-btn"
                size="large"
                @click="navigate"
                :loading="isLoading"
                :disable="!bingoId"
            >
              <template v-slot:default>
                <div class="row items-center">
                  <q-icon name="search" size="24px" class="q-mr-sm" />
                  <div class="text-subtitle1">Search Card</div>
                </div>
              </template>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <!-- Quick Tips Section -->
      <q-card-section class="bg-grey-2">
        <div class="text-subtitle2 text-weight-bold q-mb-sm">Quick Tips:</div>
        <ul class="q-ma-none text-grey-8">
          <li>Create a new card to start a fresh game</li>
          <li>Use an existing Card ID to join friends</li>
          <li>Share your Card ID with others to play together</li>
        </ul>
      </q-card-section>
    </q-card>
  </main>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

.my-card {
  max-width: 500px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
  padding: 2rem 1.5rem;
}

.create-btn {
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.join-btn {
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.join-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  padding: 4px 0;
  position: relative;
  padding-left: 1.5rem;
}

li::before {
  content: "•";
  color: var(--q-primary);
  position: absolute;
  left: 0.5rem;
}
</style>