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
    const { sheet, data } = JSON.parse(event.body);
    if (!sheet || !data) {
      console.error('Sheet or data parameter is missing in request body');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Sheet or data parameter is missing in request body' }),
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

    const existingRecords = await base(tableName).select().all();
    if (existingRecords.length > 0) {
      const recordIds = existingRecords.map(record => record.id);
      for (let i = 0; i < recordIds.length; i += 10) {
        const batch = recordIds.slice(i, i + 10);
        await base(tableName).destroy(batch);
      }
    }

    if (sheet === 'Directors') {
      await base(tableName).create([{ fields: { Data: JSON.stringify(data) } }]);
    } else {
      const recordsToCreate = data.map(item => ({ fields: item }));
      for (let i = 0; i < recordsToCreate.length; i += 10) {
        const batch = recordsToCreate.slice(i, i + 10);
        await base(tableName).create(batch);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'success' }),
    };
  } catch (error) {
    console.error('WriteData error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
