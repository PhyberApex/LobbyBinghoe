import { ref, readonly, computed } from 'vue';
import validateBingoValues, { validateLobbyHoeBingo } from '../utils/validateBingoValues.ts'

const defaultBingoValues = () => [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ];

  const exampleBingoFacts = [
    ['Fact1', 'Fact2', 'Fact3', 'Fact4', 'Fact5'],
    ['Fact6', 'Fact7', 'Fact8', 'Fact9', 'Fact10'],
    ['Fact6', 'Fact7', 'Fact8', 'Fact9', 'Fact10'],
    ['Fact6', 'Fact7', 'Fact8', 'Fact9', 'Fact10'],
    ['Fact6', 'Fact7', 'Fact8', 'Fact9', 'Fact10'],
  ];

  const validID = '05b12b7a-47ad-4159-bd61-3652bc743bf4';

export default () => {
    const loading = ref(false);
    const bingoCard = ref<{id: string, episode: string, bingoFacts: Array<Array<string>>, bingoValues: Array<Array<boolean>>} | null>(null);
    const errorText = ref('');
    const isError = ref(false);

    const setError = (newErrorText: string) => {
        isError.value = true;
        errorText.value = newErrorText;
    }

    const fetchCard = async (id: string) => {
        loading.value = true;
        return new Promise(resolve => setTimeout(() => {
            loading.value = false;
            if (id === validID){
                bingoCard.value = {
                    id: validID,
                    episode: 'test',
                    bingoFacts: exampleBingoFacts,
                    bingoValues: defaultBingoValues(),
                  }
                  return;
            }
            setError('Card not found');
            resolve(0);
        }, 3000))
    };

    const lobbyHoeBingoFound = computed(() => {
        if (!bingoCard.value)
            return false;
        return validateLobbyHoeBingo(bingoCard.value.bingoValues)
    });

    const bingoFound = computed(() => {
        if (!bingoCard.value)
          return false;
        return validateBingoValues(bingoCard.value.bingoValues);
      
    });

    return {
        loading: readonly(loading),
        bingoCard,
        isError,
        errorText,
        fetchCard,
        bingoFound,
        lobbyHoeBingoFound,
    }
}