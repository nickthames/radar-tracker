const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event, context) {
  try {
    const { sheet, data } = JSON.parse(event.body);
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