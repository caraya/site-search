// netlify/functions/google-search.js
// 
// This function handles Google Custom Search API requests.
// It expects a query parameter 'q' for the search term.
//
// Make sure to set the environment variables GOOGLE_API_KEY and GOOGLE_CX in your Netlify settings.
// You can use this function in your Netlify site to perform Google searches.
// The function returns the search results in JSON format.
//
// Environment Variables:
// - GOOGLE_API_KEY: Your Google API key for Custom Search
// - GOOGLE_CX: Your Custom Search Engine ID (CX)
// Register your API keys in the Netlify dashboard under Site settings > Build & deploy > Environment > Environment variables.
//
// Requirements
// - Node.js environment
// - 'node-fetch' package for making HTTP requests

exports.handler = async function(event) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  // --- Get Search Query ---
  // The search query is passed as a query parameter named 'q'.
  const query = event.queryStringParameters.q;

  // --- Validate Input ---
  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Search query is required.' }),
    };
  }

  if (!apiKey || !cx) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key or CX is not configured.' }),
    };
  }

  // --- Construct API URL ---
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

  try {
    // --- Fetch Search Results ---
    // We're using 'node-fetch' which you'll need to include in your package.json
    const fetch = (await import('node-fetch')).default;
    const searchResponse = await fetch(url);
    const searchData = await searchResponse.json();

    // --- Return Results ---
    return {
      statusCode: 200,
      body: JSON.stringify(searchData),
    };
  } catch (error) {
    // --- Handle Errors ---
    console.error('Error fetching search results:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch search results.' }),
    };
  }
};
