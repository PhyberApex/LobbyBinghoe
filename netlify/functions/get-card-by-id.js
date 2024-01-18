const { createClient } = require('@supabase/supabase-js');

const v4 = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
);

exports.handler = async (event, context) => {

  // Only allow POST requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  const queryParams = event.queryStringParameters;
  // Example: accessing a parameter named 'id'
  const id = queryParams.id;

  if (!id.match(v4)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Please provide a valid id" })
    };
  }

  // Provide fetch to the Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Example: Fetch data from a Supabase table
    const { data, error } = await supabase
      .from('bingo_card')
      .select('*')
      .eq('id', id);

    if (error) throw error;

    if (data.lenght === 0){
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Card not found" })
      };
    }

    const fetchedCard = data[0];
    console.log(fetchedCard);
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: fetchedCard.id,
        episode: fetchedCard.episode_name,
        bingoFacts: fetchedCard.bingo_facts,
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};