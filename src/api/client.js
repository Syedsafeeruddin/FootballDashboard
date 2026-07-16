// getApiResponse function to fetch football data for a specific date

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getApiResponse() {
  const url = `https://v3.football.api-sports.io/fixtures?date=${getTodayDateString()}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": import.meta.env.VITE_APIKEY,
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    const matches = result.response;
    return matches;
  } catch (error) {
    throw new Error(`Failed to fetch API response: ${error.message}`);
  }
}

// getLiveData function to fetch live football data

export async function getLiveData() {
  const url = "https://v3.football.api-sports.io/fixtures?live=all";
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": import.meta.env.VITE_APIKEY,
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    const matches = result.response;

    return matches;
  } catch (error) {
    throw new Error(`Failed to fetch live data: ${error.message}`);
  }
}
