/**
 * Predefined Society Staff List for Committee Complaint Assignment
 */
export const SOCIETY_STAFF = [
  'Ramesh (Plumber)',
  'Suresh (Electrician)',
  'Anita (Housekeeping Lead)',
  'Johnson Lifts Support',
  'Security Team'
];

/**
 * Returns suggested staff member based on complaint category
 */
export const getSuggestedStaff = (category) => {
  switch ((category || '').toUpperCase()) {
    case 'WATER':
      return 'Ramesh (Plumber)';
    case 'ELECTRICITY':
    case 'MAINTENANCE':
      return 'Suresh (Electrician)';
    case 'CLEANING':
      return 'Anita (Housekeeping Lead)';
    case 'LIFT':
      return 'Johnson Lifts Support';
    case 'SECURITY':
    case 'NOISE':
    case 'PARKING':
      return 'Security Team';
    default:
      return 'Ramesh (Plumber)';
  }
};

export default SOCIETY_STAFF;

