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
          // Handle non-200 responses
          const contentType = response.headers.get('Content-Type');
          let errorText;
          if (contentType && contentType.includes('application/json')) {
            // If response has JSON body, parse it
            errorText = (await response.json()).error;
          } else {
            // If no JSON body, use status text
            errorText = response.statusText;
          }
          throw new Error(`${response.status} (${errorText})`);
        }
        const newCard = await response.json();
        loading.value = false;
        bingoCard.value = {
            ...newCard,
            bingoValues: defaultBingoValues()
        };
      } catch (error) {
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
    fetchCard,
    bingoFound,
    lobbyHoeBingoFound,
    createNewCard,
  };
};
