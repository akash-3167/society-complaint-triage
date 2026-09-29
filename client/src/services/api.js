/**
 * API Service for Society Complaint Triage
 * Connects frontend React components to Express backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.error?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (err) {
      console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err.message);
      throw err;
    }
  }

  // Fetch all complaints with optional filtering
  async getComplaints(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
    if (filters.category && filters.category !== 'ALL') params.append('category', filters.category);
    if (filters.urgency && filters.urgency !== 'ALL') params.append('urgency', filters.urgency);
    if (filters.flat_number) params.append('flat_number', filters.flat_number);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await this.request(`/complaints${queryString}`);
    return res.data || [];
  }

  // Fetch single complaint by ID
  async getComplaintById(id) {
    const res = await this.request(`/complaints/${id}`);
    return res.data;
  }

  // Create new complaint
  async createComplaint(payload) {
    const res = await this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  // Update existing complaint (status, assignment, etc.)
  async updateComplaint(id, updates) {
    const res = await this.request(`/complaints/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return res.data;
  }

  // Delete complaint
  async deleteComplaint(id) {
    return await this.request(`/complaints/${id}`, {
      method: 'DELETE',
    });
  }

  // Fetch committee dashboard metrics
  async getStats() {
    const res = await this.request('/complaints/stats/summary');
    return res.data;
  }
}

export const api = new ApiService();
export default api;
