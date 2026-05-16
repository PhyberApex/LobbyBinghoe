import { getDatabase } from '@netlify/database';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function fillArray(data) {
  const gridSize = 5;
  const result = [];
  const shuffledData = shuffleArray([...data]);
  for (let i = 0; i < gridSize; i++) {
    result[i] = [];
    for (let j = 0; j < gridSize; j++) {
      result[i][j] = shuffledData[(i * gridSize + j) % shuffledData.length];
    }
  }
  return result;
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const episode = JSON.parse(event.body).episodeName;
  const db = getDatabase({
    connectionString: process.env.NETLIFY_DATABASE_URL
  });

  try {
    const factsRows = await db.sql`SELECT fact_text FROM bingo_fact`;
    const bingoFacts = fillArray(factsRows.map((r) => r.fact_text));

    const [card] = await db.sql`
      INSERT INTO bingo_card (episode_name, bingo_facts)
      VALUES (${episode}, ${JSON.stringify(bingoFacts)})
      RETURNING id, episode_name, bingo_facts
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: card.id,
        episode_name: card.episode_name,
        bingo_facts: card.bingo_facts,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
