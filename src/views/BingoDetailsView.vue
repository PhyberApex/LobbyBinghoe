<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

// TEST DATA
const validID = '05b12b7a-47ad-4159-bd61-3652bc743bf4';
const bingoFacts = [['Fact1', 'Fact2', 'Fact3'], ['Fact4', 'Fact5', 'Fact6'], ['Fact7', 'Fact8', 'Fact9']];
const bingoValues = [[true, false, false], [false, false, false], [false, false, false]];
// END TEST DATA

const props = defineProps<{
  id: string;
}>();

const bingoCard = ref();
const error = ref('');
const loading = ref(false);
const initialized = ref(false);
const ready = computed(() => initialized.value && !loading.value && error.value === '')

const fetchBingoCard = async (bingoId: string) => { 
  loading.value = true;
  if(bingoId === validID) {
    loading.value = false;
    initialized.value = true;
    bingoCard.value = {
      id: validID,
      episode: 'test',
      bingoFacts,
      bingoValues,
    }
    return;
  }
  loading.value = false;
  error.value = 'CARD NOT FOUND';
};

onMounted(() => fetchBingoCard(props.id))

watch(
      () => props.id,
      newId => fetchBingoCard(newId)
    )

</script>

<template>
  <div class="about">
    <h1>This is the details page for bingo id: {{ id }}</h1>
    <table v-if="ready" class="bingoCard">
      <tr>
        <td :class="{bingofactTrue: bingoCard.bingoValues[0][0]}" @click="bingoCard.bingoValues[0][0] = !bingoCard.bingoValues[0][0]">{{ bingoCard.bingoFacts[0][0] }}</td>
        <td>{{ bingoCard.bingoFacts[0][1] }}</td>
        <td>{{ bingoCard.bingoFacts[0][2] }}</td>
      </tr>
      <tr>
        <td>{{ bingoCard.bingoFacts[1][0] }}</td>
        <td>{{ bingoCard.bingoFacts[1][1] }}</td>
        <td>{{ bingoCard.bingoFacts[1][2] }}</td>
      </tr>
      <tr>
        <td>{{ bingoCard.bingoFacts[2][0] }}</td>
        <td>{{ bingoCard.bingoFacts[2][1] }}</td>
        <td>{{ bingoCard.bingoFacts[2][2] }}</td>
      </tr>
    </table>
    <div v-else-if="error !== ''">
      <div>{{ error }}</div>
    </div>
    <div v-else>
      LOADING
    </div>
  </div>
</template>

<style>
.bingoCard td {
    color: red;
    cursor: pointer;
}
.bingoCard td.bingofactTrue {
  text-decoration: line-through;
  color: green;
}
</style>
