const BASE = 'https://nate-aaro-portifolio.onrender.com/api';

function getToken() {
  return localStorage.getItem('na_admin_token');
}

async function request(path, { method = 'GET', body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  // auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),

  // services
  getServices: () => request('/services'),
  getAllServices: () => request('/services/all', { auth: true }),
  createService: (data) => request('/services', { method: 'POST', body: data, auth: true }),
  updateService: (id, data) => request(`/services/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteService: (id) => request(`/services/${id}`, { method: 'DELETE', auth: true }),

  // projects
  getProjects: (category) => request(`/projects${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (data) => request('/projects', { method: 'POST', body: data, auth: true }),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE', auth: true }),
  addProjectMedia: (id, data) => request(`/projects/${id}/media`, { method: 'POST', body: data, auth: true }),
  deleteProjectMedia: (mediaId) => request(`/projects/media/${mediaId}`, { method: 'DELETE', auth: true }),
  uploadProjectFile: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/projects/upload', { method: 'POST', body: fd, auth: true, isForm: true });
  },

  // testimonials
  getTestimonials: () => request('/testimonials'),
  getAllTestimonials: () => request('/testimonials/all', { auth: true }),
  createTestimonial: (data) => request('/testimonials', { method: 'POST', body: data, auth: true }),
  updateTestimonial: (id, data) => request(`/testimonials/${id}`, { method: 'PUT', body: data, auth: true }),
  deleteTestimonial: (id) => request(`/testimonials/${id}`, { method: 'DELETE', auth: true }),

  // bookings
  createBooking: (data) => request('/bookings', { method: 'POST', body: data }),
  trackBooking: (ref) => request(`/bookings/track/${ref}`),
  getGalleryInfo: (ref) => request(`/bookings/gallery/${ref}/info`),
  getGallery: (ref, password) => request(`/bookings/gallery/${ref}`, { method: 'POST', body: { password } }),
  getBookings: (status) => request(`/bookings${status ? `?status=${status}` : ''}`, { auth: true }),
  updateBookingStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  setGalleryPassword: (id, password) => request(`/bookings/${id}/gallery-password`, { method: 'PATCH', body: { password }, auth: true }),
  addGalleryMedia: (id, data) => request(`/bookings/${id}/gallery-media`, { method: 'POST', body: data, auth: true }),
  deleteGalleryMedia: (mediaId) => request(`/bookings/gallery-media/${mediaId}`, { method: 'DELETE', auth: true }),
  deleteBooking: (id) => request(`/bookings/${id}`, { method: 'DELETE', auth: true }),
  uploadBookingFile: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/bookings/upload', { method: 'POST', body: fd, auth: true, isForm: true });
  },

  // settings
  uploadPortrait: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/settings/upload/portrait', { method: 'POST', body: fd, auth: true, isForm: true });
  }
};

export { getToken };
