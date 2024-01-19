import { ref, readonly, computed } from "vue";
import { useStorage } from "@vueuse/core";
import validateBingoValues, {
  validateLobbyHoeBingo,
} from "@/utils/validateBingoValues";

const defaultBingoValues = () =>
  Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));

const myCards = useStorage(
  "my-cards",
  [] as {
    id: string;
    episode_name: string;
  }[],
  localStorage,
);

export default () => {
  const loading = ref(false);
  const bingoCard = ref<{
    id: string;
    episode: string;
    bingoFacts: Array<Array<string>>;
    bingoValues: Array<Array<boolean>>;
    isLocal: boolean;
  } | null>(null);

  const fetchCard = async (id: string) => {
    loading.value = true;
    try {
      const response = await fetch(
        `/.netlify/functions/get-card-by-id?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        // Handle non-200 responses
        const contentType = response.headers.get("Content-Type");
        let errorText;
        if (contentType && contentType.includes("application/json")) {
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
        bingoValues: defaultBingoValues(),
        isLocal: !!myCards.value.find((card) => card.id === newCard.id),
      };
    } catch (error) {
      loading.value = false;
      throw error;
    }
  };

  const removeCardFromStorage = () => {
    if (bingoCard.value === null) return;

    const bingoCardId = bingoCard.value.id;
    myCards.value = myCards.value.filter((card) => bingoCardId !== card.id);
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
    loading.value = true;
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
      myCards.value = [...myCards.value, newCard];
      loading.value = false;
      return newCard.id;
    } catch (error) {
      loading.value = false;
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
    myCards,
    removeCardFromStorage,
  };
};
