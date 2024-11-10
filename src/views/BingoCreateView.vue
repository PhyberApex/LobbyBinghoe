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
    error.value = "Please enter an episode name";
    return false;
  }
  return true;
};

const createNew = async () => {
  if (!validateInput()) return;

  try {
    const id = await createNewCard(episodeName.value.trim());
    router.push(`card/${id}`);
  } catch (err) {
    error.value = "Failed to create card. Please try again.";
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !loading) {
    createNew();
  }
};
</script>

<template>
  <div class="create-page">
    <q-card class="creation-card" bordered>
      <!-- Header Section -->
      <q-card-section class="header-section">
        <div class="text-h4 text-weight-bold text-primary">Create New Card</div>
        <div class="text-subtitle1 text-grey-7 q-mt-sm">
          Start a new bingo game for your episode
        </div>
      </q-card-section>

      <q-separator />

      <!-- Form Section -->
      <q-card-section class="form-section q-pa-lg">
        <q-input
            v-model.trim="episodeName"
            :disable="loading"
            placeholder="e.g., Episode 42 - The Ultimate Game"
            filled
            clearable
            bottom-slots
            class="input-field"
            @keyup="handleKeyPress"
            :error="!!error"
            :error-message="error"
        >
          <template v-slot:prepend>
            <q-icon name="podcasts" color="primary" />
          </template>
          <template v-slot:append v-if="episodeName">
            <q-icon name="close" class="cursor-pointer" @click="episodeName = ''" />
          </template>
          <template v-slot:hint>
            Enter the name or number of the episode
          </template>
        </q-input>

        <q-btn
            unelevated
            color="primary"
            class="submit-btn q-mt-lg"
            size="large"
            :loading="loading"
            @click="createNew"
        >
          <span class="row items-center">
            <q-icon name="add_box" size="1.2em" class="q-mr-sm" />
            Create Bingo Card
          </span>

          <template v-slot:loading>
            <q-spinner-dots />
            Creating your card...
          </template>
        </q-btn>
      </q-card-section>

      <!-- Tips Section -->
      <q-card-section class="tips-section bg-grey-1">
        <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">
          Quick Tips:
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-6">
            <q-item dense class="tip-item">
              <q-item-section avatar>
                <q-icon color="positive" name="tips_and_updates" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>
                  Your card will be saved locally for easy access
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-12 col-sm-6">
            <q-item dense class="tip-item">
              <q-item-section avatar>
                <q-icon color="positive" name="share" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>
                  Share your card ID with friends to play together
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.create-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.creation-card {
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background: white;
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.creation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.header-section {
  text-align: center;
  padding: 2rem 1.5rem;
  background: linear-gradient(to right, #f8f9fa, white, #f8f9fa);
}

.form-section {
  padding: 2rem;
}

.input-field {
  transition: all 0.3s ease;
}

.input-field:hover {
  transform: translateX(4px);
}

.submit-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.tips-section {
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  padding: 1.5rem;
}

.tip-item {
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.tip-item:hover {
  background: rgba(25, 118, 210, 0.05);
}

/* Responsive Design */
@media (max-width: 599px) {
  .create-page {
    padding: 1rem 0.5rem;
  }

  .header-section {
    padding: 1.5rem 1rem;
  }

  .form-section {
    padding: 1.5rem 1rem;
  }

  .tips-section {
    padding: 1rem;
  }
}
</style>