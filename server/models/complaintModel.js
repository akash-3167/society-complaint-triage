const { supabase, isSupabaseConfigured } = require('../config/supabase');

const STATUS_ENUM = {
  OPEN: 'OPEN',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED'
};

const CATEGORY_ENUM = {
  WATER: 'WATER',
  LIFT: 'LIFT',
  PARKING: 'PARKING',
  NOISE: 'NOISE',
  CLEANING: 'CLEANING',
  MAINTENANCE: 'MAINTENANCE',
  OTHER: 'OTHER'
};

const URGENCY_ENUM = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

// Realistic mock seed complaints representing housing society scenarios in English, Hindi, and Hinglish
let memoryComplaints = [
  {
    id: 'c-101',
    resident_name: 'Rajesh Sharma',
    flat_number: 'B-402',
    description: 'Main pump motor trip ho gaya hai subah se. B wing me paani bilkul nahi aa raha hai. Subah se taps are completely dry!',
    category: CATEGORY_ENUM.WATER,
    urgency: URGENCY_ENUM.CRITICAL,
    language: 'Hinglish',
    ai_summary: 'B-wing water supply disruption due to tripped pump motor.',
    suggested_action: 'Dispatch society electrician & plumber to inspect B-wing pump panel.',
    status: STATUS_ENUM.OPEN,
    assigned_to: null,
    cluster_id: 'cl-water-01',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'c-102',
    resident_name: 'Pooja Verma',
    flat_number: 'B-201',
    description: 'Water pressure in B-wing bathrooms is completely zero since 7 AM. Anyone else facing this issue?',
    category: CATEGORY_ENUM.WATER,
    urgency: URGENCY_ENUM.CRITICAL,
    language: 'English',
    ai_summary: 'Zero water pressure in B-wing bathrooms.',
    suggested_action: 'Group with B-wing pump failure cluster; notify B-wing maintenance staff.',
    status: STATUS_ENUM.ASSIGNED,
    assigned_to: 'Ramesh (Plumber)',
    cluster_id: 'cl-water-01',
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'c-103',
    resident_name: 'Vikram Malhotra',
    flat_number: 'A-701',
    description: 'Tower A lift 2 floor 4 pe jerk le rahi hai and squeaking noise bohot zyada hai. Bacche dar rahe hain enter karne me.',
    category: CATEGORY_ENUM.LIFT,
    urgency: URGENCY_ENUM.HIGH,
    language: 'Hinglish',
    ai_summary: 'Lift 2 in Tower A is jerking and producing loud squeaks at 4th floor.',
    suggested_action: 'Immediately halt Lift 2 and summon Johnson Lifts AMC technician.',
    status: STATUS_ENUM.IN_PROGRESS,
    assigned_to: 'Johnson Lifts Support',
    cluster_id: 'cl-lift-01',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'c-104',
    resident_name: 'Sunita Patil',
    flat_number: 'C-104',
    description: 'White Swift car (MH-12-AB-3421) is parked right in front of Tower C ramp, blocking wheelchair and stretcher access.',
    category: CATEGORY_ENUM.PARKING,
    urgency: URGENCY_ENUM.HIGH,
    language: 'English',
    ai_summary: 'Unauthorized vehicle blocking wheelchair/stretcher access ramp at Tower C.',
    suggested_action: 'Main gate security to identify owner via vehicle log and move vehicle.',
    status: STATUS_ENUM.OPEN,
    assigned_to: null,
    cluster_id: null,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'c-105',
    resident_name: 'Amitabh Sengupta',
    flat_number: 'D-303',
    description: 'Late night loud music and bass vibration from flat D-305 till 2:30 AM yesterday. Senior citizens were unable to sleep.',
    category: CATEGORY_ENUM.NOISE,
    urgency: URGENCY_ENUM.MEDIUM,
    language: 'English',
    ai_summary: 'Excessive late night noise from flat D-305 disturbing elderly residents.',
    suggested_action: 'Issue society silence hours notice and alert floor committee rep.',
    status: STATUS_ENUM.OPEN,
    assigned_to: null,
    cluster_id: null,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'c-106',
    resident_name: 'Kavita Nair',
    flat_number: 'A-102',
    description: 'Clubhouse walkway lighting ke do poles fuse ho chuke hain, shaam ko pura dark ho jata hai walking track.',
    category: CATEGORY_ENUM.MAINTENANCE,
    urgency: URGENCY_ENUM.LOW,
    language: 'Hinglish',
    ai_summary: 'Two pathway lights fused along the clubhouse jogging walkway.',
    suggested_action: 'Electrician to replace pathway LED flood fixtures.',
    status: STATUS_ENUM.RESOLVED,
    assigned_to: 'Suresh (Electrician)',
    cluster_id: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'c-107',
    resident_name: 'Mohd. Farhan',
    flat_number: 'B-503',
    description: 'Corridor dustbin on 5th floor is overflowing and cats are scattering waste outside the elevator entrance.',
    category: CATEGORY_ENUM.CLEANING,
    urgency: URGENCY_ENUM.MEDIUM,
    language: 'English',
    ai_summary: 'Corridor dustbin overflowing and scattered waste on 5th floor.',
    suggested_action: 'Housekeeping supervisor to ensure twice-daily corridor clearance.',
    status: STATUS_ENUM.RESOLVED,
    assigned_to: 'Anita (Housekeeping Lead)',
    cluster_id: null,
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to sanitize / validate incoming complaint fields
const validateComplaintInput = (data) => {
  const errors = [];
  if (!data.resident_name || typeof data.resident_name !== 'string' || !data.resident_name.trim()) {
    errors.push('Resident name is required');
  }
  if (!data.flat_number || typeof data.flat_number !== 'string' || !data.flat_number.trim()) {
    errors.push('Flat number is required');
  }
  if (!data.description || typeof data.description !== 'string' || !data.description.trim()) {
    errors.push('Complaint description is required');
  }
  return errors;
};

const ComplaintModel = {
  STATUS_ENUM,
  CATEGORY_ENUM,
  URGENCY_ENUM,

  // Retrieve complaints with optional filter criteria
  async getAll(filters = {}) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('complaints').select('*').order('created_at', { ascending: false });

        if (filters.status && filters.status !== 'ALL') {
          query = query.eq('status', filters.status);
        }
        if (filters.category && filters.category !== 'ALL') {
          query = query.eq('category', filters.category);
        }
        if (filters.urgency && filters.urgency !== 'ALL') {
          query = query.eq('urgency', filters.urgency);
        }
        if (filters.flat_number) {
          query = query.ilike('flat_number', `%${filters.flat_number}%`);
        }
        if (filters.search) {
          query = query.or(`description.ilike.%${filters.search}%,resident_name.ilike.%${filters.search}%,flat_number.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('[Model] Supabase query failed, falling back to memory store:', err.message);
      }
    }

    // In-Memory filtering
    let results = [...memoryComplaints];

    if (filters.status && filters.status !== 'ALL') {
      results = results.filter(c => c.status === filters.status);
    }
    if (filters.category && filters.category !== 'ALL') {
      results = results.filter(c => c.category === filters.category);
    }
    if (filters.urgency && filters.urgency !== 'ALL') {
      results = results.filter(c => c.urgency === filters.urgency);
    }
    if (filters.flat_number) {
      results = results.filter(c => c.flat_number.toLowerCase().includes(filters.flat_number.toLowerCase()));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(c => 
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.resident_name && c.resident_name.toLowerCase().includes(q)) ||
        (c.flat_number && c.flat_number.toLowerCase().includes(q)) ||
        (c.ai_summary && c.ai_summary.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return results;
  },

  // Retrieve single complaint by ID
  async getById(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('complaints').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[Model] Supabase getById failed, using memory store:', err.message);
      }
    }
    return memoryComplaints.find(c => String(c.id) === String(id)) || null;
  },

  // Create a new complaint
  async create(data) {
    const now = new Date().toISOString();
    const newComplaint = {
      id: data.id || `c-${Date.now().toString().slice(-6)}`,
      resident_name: data.resident_name ? data.resident_name.trim() : 'Anonymous Resident',
      flat_number: data.flat_number ? data.flat_number.trim().toUpperCase() : 'N/A',
      description: data.description ? data.description.trim() : '',
      category: data.category || CATEGORY_ENUM.OTHER,
      urgency: data.urgency || URGENCY_ENUM.MEDIUM,
      language: data.language || 'English',
      ai_summary: data.ai_summary || null,
      suggested_action: data.suggested_action || null,
      status: data.status || STATUS_ENUM.OPEN,
      assigned_to: data.assigned_to || null,
      cluster_id: data.cluster_id || null,
      created_at: now,
      updated_at: now
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: inserted, error } = await supabase.from('complaints').insert([newComplaint]).select().single();
        if (!error && inserted) return inserted;
      } catch (err) {
        console.warn('[Model] Supabase insert failed, storing in memory:', err.message);
      }
    }

    memoryComplaints.unshift(newComplaint);
    return newComplaint;
  },

  // Update complaint (e.g. status, assigned_to, ai fields)
  async update(id, updates) {
    const now = new Date().toISOString();
    const allowedFields = [
      'status', 'assigned_to', 'category', 'urgency', 
      'ai_summary', 'suggested_action', 'cluster_id', 'language', 'description'
    ];

    const cleanUpdates = { updated_at: now };
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        cleanUpdates[key] = updates[key];
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: updated, error } = await supabase
          .from('complaints')
          .update(cleanUpdates)
          .eq('id', id)
          .select()
          .single();
        if (!error && updated) return updated;
      } catch (err) {
        console.warn('[Model] Supabase update failed, updating memory:', err.message);
      }
    }

    const index = memoryComplaints.findIndex(c => String(c.id) === String(id));
    if (index === -1) return null;

    memoryComplaints[index] = {
      ...memoryComplaints[index],
      ...cleanUpdates
    };
    return memoryComplaints[index];
  },

  // Delete complaint
  async delete(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('complaints').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('[Model] Supabase delete failed, removing from memory:', err.message);
      }
    }

    const index = memoryComplaints.findIndex(c => String(c.id) === String(id));
    if (index === -1) return false;
    memoryComplaints.splice(index, 1);
    return true;
  },

  // Aggregated stats for committee dashboard
  async getStats() {
    const all = await this.getAll();
    const stats = {
      total: all.length,
      critical: all.filter(c => c.urgency === URGENCY_ENUM.CRITICAL).length,
      high: all.filter(c => c.urgency === URGENCY_ENUM.HIGH).length,
      open: all.filter(c => c.status === STATUS_ENUM.OPEN).length,
      assigned: all.filter(c => c.status === STATUS_ENUM.ASSIGNED).length,
      inProgress: all.filter(c => c.status === STATUS_ENUM.IN_PROGRESS).length,
      resolved: all.filter(c => c.status === STATUS_ENUM.RESOLVED).length
    };
    return stats;
  },

  validateComplaintInput
};

module.exports = ComplaintModel;
