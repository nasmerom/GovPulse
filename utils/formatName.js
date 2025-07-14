// Utility to format names as 'Title, First Name, M, Last Name'
export function formatFullName(person) {
  // Prefer explicit fields
  const title = person.title || '';
  const first = person.firstName || '';
  const middle = person.middleName || person.middle || '';
  const last = person.lastName || '';

  // If all fields are present, use them
  if (title || first || middle || last) {
    return [title, first, middle, last].filter(Boolean).join(' ').replace(/ +/g, ' ').trim();
  }

  // Fallback: try to parse from a single name string
  let name = person.name || '';
  if (name.includes(',')) {
    // Format: Last, First Middle
    const [lastName, rest] = name.split(',');
    const parts = rest.trim().split(' ');
    const firstName = parts[0] || '';
    const middleName = parts[1] || '';
    return [title, firstName, middleName, lastName.trim()].filter(Boolean).join(' ').replace(/ +/g, ' ').trim();
  } else {
    // Format: Title First Middle Last or just First Last
    const parts = name.trim().split(' ');
    if (parts.length === 4) {
      return parts.join(' ');
    } else if (parts.length === 3) {
      return [title, parts[0], parts[1], parts[2]].filter(Boolean).join(' ');
    } else if (parts.length === 2) {
      return [title, parts[0], parts[1]].filter(Boolean).join(' ');
    } else {
      return [title, name].filter(Boolean).join(' ');
    }
  }
} 