import { ref, readonly, computed } from "vue";
import validateBingoValues, {
  validateLobbyHoeBingo,
} from "@/utils/validateBingoValues";

const defaultBingoValues = () =>
  Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));

export default () => {
  const loading = ref(false);
  const bingoCard = ref<{
    id: string;
    episode: string;
    bingoFacts: Array<Array<string>>;
    bingoValues: Array<Array<boolean>>;
  } | null>(null);
  const errorText = ref("");
  const isError = ref(false);

  const setError = (newErrorText: string) => {
    isError.value = true;
    errorText.value = newErrorText;
  };

  const fetchCard = async (id: string) => {
    loading.value = true;
    try {
        const response = await fetch(`/.netlify/functions/get-card-by-id?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const newCard = await response.json();
        loading.value = false;
        bingoCard.value = {
            ...newCard,
            bingoValues: defaultBingoValues()
        };
      } catch (error) {
        console.error("There was an error!", error);
        loading.value = false;
        throw error;
      }
  };

  const lobbyHoeBingoFound = computed(() => {
    if (!bingoCard.value) return false;
    return validateLobbyHoeBingo(bingoCard.value.bingoValues);
  });

  const bingoFound = computed(() => {
    if (!bingoCard.value) return false;
    return validateBingoValues(bingoCard.value.bingoValues);
  });

  const createNewCard = async (episodeName: string): Promise<string> => {
    try {
      const response = await fetch("/.netlify/functions/create-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ episodeName }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const newCard = await response.json();
      return newCard.id;
    } catch (error) {
      console.error("There was an error!", error);
      throw error;
    }
  };

  return {
    loading: readonly(loading),
    bingoCard,
    isError,
    errorText,
    fetchCard,
    bingoFound,
    lobbyHoeBingoFound,
    createNewCard,
  };
};
