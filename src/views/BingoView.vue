<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const bingoId = ref('');
const router = useRouter();
const error = ref('');

const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);

const validate = () => {
    if (!bingoId.value.match(v4)) {
      error.value = 'Please enter a valid id';
      return false;
    }
    return true;
};

const navigate = () => {
    if (validate())
    router.push(`bingo/card/${bingoId.value}`);
}

</script>

<template>
  <main>
    <h1>Create or open with id</h1>
    <div>
        <RouterLink to="/bingo/new">Create new card</RouterLink>
    </div>
    <div>
        <input type="text" placeholder="card id" v-model.trim="bingoId"/>
        <button @click="navigate">Search</button>
        <div>
          <small v-if="error !== ''">{{ error }}</small>
        </div>
    </div>
  </main>
</template>
