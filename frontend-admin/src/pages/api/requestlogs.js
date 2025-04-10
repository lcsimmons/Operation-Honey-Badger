import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200',
});

export default async function handler(req, res) {
  try {
    // Execute Elasticsearch query
    const response = await client.search({
      index: 'attacker_logs',
      size: 2,
      query: {
        match_all: {},
      },
    });

    console.log("BRUH");
    console.log('Elasticsearch Response:', JSON.stringify(response, null, 2));

    //if (!response || !response.body || !response.body.hits || !response.body.hits.hits) {
    //  console.error('Invalid response format:', response);
    //  res.status(500).json({ error: 'Invalid response from Elasticsearch' });
    //  return;
    // }

    const logs = response.hits?.hits?.map((hit) => hit._source) || [];

    res.status(200).json({ message: logs});

  } catch (error) {
    console.error('Error during Elasticsearch query:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
}