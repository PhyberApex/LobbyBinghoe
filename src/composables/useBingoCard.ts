import { ref, readonly, computed } from "vue";
import validateBingoValues, {
  validateLobbyHoeBingo,
} from "@/utils/validateBingoValues";

const defaultBingoValues = () =>
  Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));

const exampleBingoFacts = [
  [
    "Ju wechselt plötzlich das Thema",
    "Rezo sagt 'Spaaaaaaß'",
    "Rezo lobt sich selbst",
    "Ju lobt sich selbst",
    "Ju sagt 'Spaaaaaaß'",
  ],
  [
    "Ju stöhnt etwas, oder betont es unnötig sexual",
    "Ju erwähnt Vagina / Vulva",
    "Rezo erwähnt Vagina / Vulva",
    "Ju erwähnt Penis",
    "Rezo erwähnt Penis",
  ],
  [
    "Rezo macht keinen Mathe-Fact",
    "5-Sterne Bewertung wird erwähnt",
    "Rezo anwortet mit 'Hää?'",
    "Ju sagt was dummes, kurze Pause, beide lachen",
    "Ju sagt 'Ach, Freunde!'",
  ],
  [
    "Einer der beiden erwähnt das es sich um einen News Podcast handelt",
    "Rezo erinnert Ju daran nicht zu viel zu versprechen",
    "Rezo spricht ein 't' wie ein 'd' aus",
    "Rezo sagt 'Weiiiiß ich jetzt nicht'",
    "Ju wird auf Tinder angesprochen",
  ],
  [
    "Geschlechtsverkehr wird erwähnt",
    "Ein neues Intro wird erstellt / soll erstellt werden",
    "Rezo versucht Ju einen Fuß-fetisch unter zu jubeln",
    "Ju versucht Rezzo einen Muttermilch-fetisch unter zu jubeln",
    "Einer der beiden hat angst vor Marina",
  ],
];

let exampleEpisodeName = "Test";

const validID = "05b12b7a-47ad-4159-bd61-3652bc743bf4";

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
    return new Promise((resolve) =>
      setTimeout(() => {
        loading.value = false;
        if (id === validID) {
          bingoCard.value = {
            id: validID,
            episode: exampleEpisodeName,
            bingoFacts: exampleBingoFacts,
            bingoValues: defaultBingoValues(),
          };
          return;
        }
        setError("Card not found");
        resolve(0);
      }, 3000),
    );
  };

  const lobbyHoeBingoFound = computed(() => {
    if (!bingoCard.value) return false;
    return validateLobbyHoeBingo(bingoCard.value.bingoValues);
  });

  const bingoFound = computed(() => {
    if (!bingoCard.value) return false;
    return validateBingoValues(bingoCard.value.bingoValues);
  });

  const createNewCard = (episodeName: string): string => {
    exampleEpisodeName = episodeName;
    return validID;
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
