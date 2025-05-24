const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  try {
    const { sheet } = JSON.parse(event.body);
    const tableMap = {
      'Directors': 'Directors',
      'Radars': 'Radars',
      'UsersLocations': 'UsersLocations',
    };

    const tableName = tableMap[sheet];
    if (!tableName) {
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