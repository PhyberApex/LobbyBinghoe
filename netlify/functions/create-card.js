const { createClient } = require('@supabase/supabase-js');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function fillArray(data) {
    const gridSize = 5;
    let result = [];
    let shuffledData = shuffleArray([...data]);
  
    for (let i = 0; i < gridSize; i++) {
      result[i] = [];
      for (let j = 0; j < gridSize; j++) {
        result[i][j] = shuffledData[(i * gridSize + j) % shuffledData.length];
      }
    }
  
    return result;
  }

exports.handler = async (event, context) => {

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  const episode = JSON.parse(event.body).episodeName;

  // Provide fetch to the Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Example: Fetch data from a Supabase table
    const { data: factsData, error: factsError } = await supabase
      .from('bingo_fact')
      .select('fact_text');

    if (factsError) throw factsError;

    const newCard = {
        episode_name: episode,
        bingo_facts: fillArray(factsData.map(e => e.fact_text)),
    }

    const { data: cards, error: cardError } = await supabase
    .from('bingo_card')
    .insert([newCard])
    .select('*');

    if (cardError) throw cardError;

    newCard.id = cards[0].id;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCard)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
