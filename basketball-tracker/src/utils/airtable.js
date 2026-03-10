const BASE_URL = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;

const headers = {
  Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
  'Content-Type': 'application/json',
};

// PLAYERS
export async function fetchPlayers() {
  const res = await fetch(`${BASE_URL}/Players?sort[0][field]=name`, { headers });
  if (!res.ok) throw new Error('Failed to fetch players');
  const data = await res.json();
  return data.records.map((r) => ({ id: r.id, ...r.fields }));
}

export async function createPlayer(fields) {
  const res = await fetch(`${BASE_URL}/Players`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error('Failed to create player');
  const data = await res.json();
  return { id: data.id, ...data.fields };
}

export async function deletePlayer(id) {
  const res = await fetch(`${BASE_URL}/Players/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete player');
}

// GAMES
export async function fetchGames() {
  const res = await fetch(
    `${BASE_URL}/Games?sort[0][field]=date&sort[0][direction]=desc`,
    { headers }
  );
  if (!res.ok) throw new Error('Failed to fetch games');
  const data = await res.json();
  return data.records.map((r) => ({ id: r.id, ...r.fields }));
}

export async function createGame(fields) {
  const res = await fetch(`${BASE_URL}/Games`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error('Failed to create game');
  const data = await res.json();
  return { id: data.id, ...data.fields };
}

// STATS
export async function fetchStatsByGame(gameId) {
  const formula = encodeURIComponent(`{gameId} = '${gameId}'`);
  const res = await fetch(`${BASE_URL}/Stats?filterByFormula=${formula}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch stats');
  const data = await res.json();
  return data.records.map((r) => ({ id: r.id, ...r.fields }));
}

export async function saveStats(statRecords) {
  const gameId = statRecords[0].gameId;
  const formula = encodeURIComponent(`{gameId} = '${gameId}'`);
  const existing = await fetch(`${BASE_URL}/Stats?filterByFormula=${formula}`, { headers });
  if (!existing.ok) throw new Error('Failed to fetch existing stats');
  const existingData = await existing.json();
  const existingRecords = existingData.records;

  const toCreate = [];
  const toUpdate = [];

  statRecords.forEach((fields) => {
    const match = existingRecords.find((r) => r.fields.playerId === fields.playerId);
    if (match) {
      toUpdate.push({ id: match.id, fields });
    } else {
      toCreate.push({ fields });
    }
  });

  if (toUpdate.length > 0) {
    const res = await fetch(`${BASE_URL}/Stats`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ records: toUpdate }),
    });
    if (!res.ok) throw new Error('Failed to update stats');
  }

  if (toCreate.length > 0) {
    const res = await fetch(`${BASE_URL}/Stats`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ records: toCreate }),
    });
    if (!res.ok) throw new Error('Failed to create stats');
  }
}
