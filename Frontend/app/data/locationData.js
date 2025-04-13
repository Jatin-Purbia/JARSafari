// All campus locations
export const locations = [
  "Old Mess", "New Mess", "Sports Complex", "Lecture Hall", 
  "Library", "Ground", "Shamiyana", "Hostel", "Cafeteria",
  "Auditorium", "Parking Lot", "Admin Block", "Medical Center",
  "Gymnasium", "Swimming Pool", "Tennis Court", "Basketball Court",
  "Hostel A", "Hostel B", "Hostel C", "Hostel D", "Academic Block",
  "Main Gate"
];

// Campus graph representation for Dijkstra's algorithm
export const campusGraph = {
  "Hostel A": { "Academic Block": 5, "Cafeteria": 3, "Library": 7 },
  "Hostel B": { "Academic Block": 6, "Cafeteria": 4, "Library": 8 },
  "Academic Block": { "Hostel A": 5, "Hostel B": 6, "Library": 2, "Cafeteria": 4 },
  "Library": { "Hostel A": 7, "Hostel B": 8, "Cafeteria": 3, "Sports Complex": 6 },
  "Cafeteria": { "Hostel A": 3, "Hostel B": 4, "Academic Block": 4, "Library": 3, "Sports Complex": 5 },
  "Sports Complex": { "Library": 6, "Cafeteria": 5, "Medical Center": 4 },
  "Medical Center": { "Sports Complex": 4, "Hostel C": 3 },
  "Hostel C": { "Medical Center": 3, "Hostel D": 2 },
  "Hostel D": { "Hostel C": 2, "Parking Lot": 4 },
  "Parking Lot": { "Hostel D": 4, "Main Gate": 3 },
  "Main Gate": { "Parking Lot": 3, "Auditorium": 5 },
  "Auditorium": { "Main Gate": 5, "Academic Block": 6 },
  "Old Mess": { "Hostel A": 3, "Hostel B": 4 },
  "New Mess": { "Hostel C": 3, "Hostel D": 4 },
  "Lecture Hall": { "Academic Block": 2, "Library": 3 },
  "Ground": { "Sports Complex": 2, "Basketball Court": 3 },
  "Shamiyana": { "Ground": 2, "Sports Complex": 3 },
  "Hostel": { "Hostel A": 1, "Hostel B": 1, "Hostel C": 1, "Hostel D": 1 },
  "Admin Block": { "Academic Block": 3, "Library": 4 },
  "Gymnasium": { "Sports Complex": 2, "Swimming Pool": 3 },
  "Swimming Pool": { "Gymnasium": 3, "Tennis Court": 2 },
  "Tennis Court": { "Swimming Pool": 2, "Basketball Court": 3 },
  "Basketball Court": { "Tennis Court": 3, "Ground": 3 }
};

// Location coordinates for IITJ
export const locationCoordinates = {
  "Hostel A": { latitude: 26.1799, longitude: 73.1159 },
  "Hostel B": { latitude: 26.1801, longitude: 73.1161 },
  "Academic Block": { latitude: 26.1803, longitude: 73.1163 },
  "Library": { latitude: 26.1805, longitude: 73.1165 },
  "Cafeteria": { latitude: 26.1807, longitude: 73.1167 },
  "Sports Complex": { latitude: 26.1809, longitude: 73.1169 },
  "Medical Center": { latitude: 26.1811, longitude: 73.1171 },
  "Hostel C": { latitude: 26.1813, longitude: 73.1173 },
  "Hostel D": { latitude: 26.1815, longitude: 73.1175 },
  "Parking Lot": { latitude: 26.1817, longitude: 73.1177 },
  "Main Gate": { latitude: 26.1819, longitude: 73.1179 },
  "Auditorium": { latitude: 26.1821, longitude: 73.1181 },
  "Old Mess": { latitude: 26.1823, longitude: 73.1183 },
  "New Mess": { latitude: 26.1825, longitude: 73.1185 },
  "Lecture Hall": { latitude: 26.1827, longitude: 73.1187 },
  "Ground": { latitude: 26.1829, longitude: 73.1189 },
  "Shamiyana": { latitude: 26.1831, longitude: 73.1191 },
  "Hostel": { latitude: 26.1833, longitude: 73.1193 },
  "Admin Block": { latitude: 26.1835, longitude: 73.1195 },
  "Gymnasium": { latitude: 26.1837, longitude: 73.1197 },
  "Swimming Pool": { latitude: 26.1839, longitude: 73.1199 },
  "Tennis Court": { latitude: 26.1841, longitude: 73.1201 },
  "Basketball Court": { latitude: 26.1843, longitude: 73.1203 }
};

// IITJ Campus Center Coordinates
export const IITJ_CENTER = {
  latitude: 26.1810,
  longitude: 73.1170,
};

// Helper function to determine location type
export function getLocationType(location) {
  if (!location || typeof location !== 'string') return 'other';
  const lowerLocation = location.toLowerCase();
  if (lowerLocation.includes('mess')) return 'dining';
  if (lowerLocation.includes('library')) return 'academic';
  if (lowerLocation.includes('hall')) return 'academic';
  if (lowerLocation.includes('ground') || lowerLocation.includes('court')) return 'sports';
  if (lowerLocation.includes('hostel')) return 'residential';
  if (lowerLocation.includes('medical')) return 'health';
  if (lowerLocation.includes('parking')) return 'transport';
  if (lowerLocation.includes('cafeteria')) return 'dining';
  if (lowerLocation.includes('auditorium')) return 'events';
  if (lowerLocation.includes('gate')) return 'entrance';
  if (lowerLocation.includes('block')) return 'academic';
  if (lowerLocation.includes('pool')) return 'sports';
  if (lowerLocation.includes('gym')) return 'sports';
  return 'other';
}

// Helper function to get icon for location
export function getLocationIcon(location) {
  if (!location || typeof location !== 'string') return 'place';
  const lowerLocation = location.toLowerCase();
  if (lowerLocation.includes('mess')) return 'restaurant';
  if (lowerLocation.includes('library')) return 'local-library';
  if (lowerLocation.includes('hall')) return 'school';
  if (lowerLocation.includes('ground')) return 'sports-soccer';
  if (lowerLocation.includes('court')) return 'sports-basketball';
  if (lowerLocation.includes('hostel')) return 'home';
  if (lowerLocation.includes('medical')) return 'medical-services';
  if (lowerLocation.includes('parking')) return 'local-parking';
  if (lowerLocation.includes('cafeteria')) return 'local-cafe';
  if (lowerLocation.includes('auditorium')) return 'event';
  if (lowerLocation.includes('gate')) return 'gate';
  if (lowerLocation.includes('block')) return 'business';
  if (lowerLocation.includes('pool')) return 'pool';
  if (lowerLocation.includes('gym')) return 'fitness-center';
  return 'place';
}

// Group locations by type
export function groupLocationsByType(locations) {
  const grouped = {};
  
  if (!locations || !Array.isArray(locations)) {
    return grouped;
  }
  
  locations.forEach(location => {
    if (!location) return;
    const type = getLocationType(location);
    if (!grouped[type]) {
      grouped[type] = [];
    }
    grouped[type].push(location);
  });
  
  return grouped;
} 