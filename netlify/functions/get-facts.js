const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  // Provide fetch to the Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Example: Fetch data from a Supabase table
    const { data, error } = await supabase
      .from('bingo_fact')
      .select('fact_text');

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};