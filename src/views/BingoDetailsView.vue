<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import useBingoCard from '../composables/useBingoCard.ts'

const props = defineProps<{
  id: string;
}>();

const {loading, isError, errorText, bingoCard, fetchCard, bingoFound, lobbyHoeBingoFound} = useBingoCard();

onMounted(() => fetchCard(props.id))

watch(() => props.id, newId => fetchCard(newId));

</script>

<template>
  <div class="about">
    <h2>This is the details page for bingo id: {{ id }}</h2>
    <h3 v-if="bingoFound">YOU FOUND A BINGO!</h3>
    <h3 v-if="lobbyHoeBingoFound">YOU FOUND A SUPER BINGO!</h3>
    <table v-if="!loading && bingoCard !== null" class="bingoCard">
      <tr v-for="(row, rowIndex) in bingoCard.bingoFacts">
        <td v-for="(column, colIndex) in row" :class="{bingofactTrue: bingoCard.bingoValues[rowIndex][colIndex]}" @click="bingoCard.bingoValues[rowIndex][colIndex] = !bingoCard.bingoValues[rowIndex][colIndex]">
          {{ column }}
        </td>
      </tr>
    </table>
    <div v-else-if="isError">
      <div>{{ errorText }}</div>
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
