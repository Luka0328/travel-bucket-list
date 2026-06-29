const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

function formatError(data, fallback) {
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }
  return data?.message || fallback;
}

async function request(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      'Ne mogu da se povezem sa serverom. Proveri da li backend radi (php artisan serve).'
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(formatError(data, 'Greska na serveru'));
  }

  return data;
}

export const api = {
  register: (body) => request('/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/logout', { method: 'POST' }),
  profile: () => request('/profile'),
  destinations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/destinations${query ? `?${query}` : ''}`);
  },
  destination: (id) => request(`/destinations/${id}`),
  categories: () => request('/destinations/categories'),
  myVisits: (status) => request(`/my-visits${status ? `?status=${status}` : ''}`),
  addVisit: (destinacijaId) =>
    request('/my-visits', { method: 'POST', body: JSON.stringify({ destinacija_id: destinacijaId }) }),
  updateVisit: (id, body) =>
    request(`/my-visits/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteVisit: (id) => request(`/my-visits/${id}`, { method: 'DELETE' }),
  activities: (visitId) => request(`/my-visits/${visitId}/activities`),
  addActivity: (visitId, body) =>
    request(`/my-visits/${visitId}/activities`, { method: 'POST', body: JSON.stringify(body) }),
  updateActivity: (id, body) =>
    request(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteActivity: (id) => request(`/activities/${id}`, { method: 'DELETE' }),
  statistics: () => request('/statistics'),
};
