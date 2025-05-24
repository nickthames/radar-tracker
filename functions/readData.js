const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  try {
    // Log the event for debugging
    console.log('Event received:', event);

    // Check if event.body is defined and not empty
    if (!event.body) {
      console.error('No request body provided');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No request body provided' }),
      };
    }

    // Parse the request body
    const { sheet } = JSON.parse(event.body);
    if (!sheet) {
      console.error('Sheet parameter is missing in request body');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Sheet parameter is missing in request body' }),
      };
    }

    const tableMap = {
      'Directors': 'Directors',
      'Radars': 'Radars',
      'UsersLocations': 'UsersLocations',
    };

    const tableName = tableMap[sheet];
    if (!tableName) {
      console.error('Invalid sheet name:', sheet);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid sheet name' }),
      };
    }

    const records = await base(tableName).select().all();
    if (sheet === 'Directors') {
      const directors = records.length > 0 ? JSON.parse(records[0].fields.Data) : [];
      return {
        statusCode: 200,
        body: JSON.stringify(directors),
      };
    } else {
      const data = records.map(record => record.fields);
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }
  } catch (error) {
    console.error('ReadData error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};


