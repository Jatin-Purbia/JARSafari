// All campus locations
export const locations = [
  "Office of Director", "Knowledge Tree", "Central Library", "Director Residence",
  "IIT Jodhpur Museum", "Lecture Hall Complex", "Mechanical Engineering Department",
  "Electrical Engineering Department", "Computer Science Department",
  "Bioscience & Bioengineering Department", "Chemical Engineering Department",
  "Civil & Infrastructure Engineering Dept", "Metallurgical & Materials Engg. Dept",
  "Physics Department", "Chemistry Department", "Mathematics Department",
  "Humanities & Social Sciences Dept", "Basic Laboratory", "Computer Center",
  "Administration Block", "Student Activity Center", "Hostel I3", "Hostel I2",
  "Medical Center", "Sports Complex", "Cricket Ground", "Volleyball Court",
  "Football Field", "Basketball Court", "Tennis Court", "Badminton Court",
  "Hockey Field", "Canara Bank Atm", "Shiv Mandir", "Old Mess", "New Mess",
  "Canteen", "Fresh N Green", "Main Entrance Gate"
];

// Campus graph representation for Dijkstra's algorithm
export const campusGraph = {
  "Office of Director": { "Knowledge Tree": 1, "Central Library": 1, "Director Residence": 1 },
  "Knowledge Tree": { "Office of Director": 1, "Central Library": 1, "IIT Jodhpur Museum": 2 },
  "Central Library": { "Office of Director": 1, "Knowledge Tree": 1, "Computer Center": 1 },
  "Director Residence": { "Office of Director": 1 },
  "IIT Jodhpur Museum": { "Knowledge Tree": 2 },
  
  "Lecture Hall Complex": { "Computer Science Department": 1, "Basic Laboratory": 1 },
  
  "Mechanical Engineering Department": { "Electrical Engineering Department": 1, "Chemical Engineering Department": 1 },
  "Electrical Engineering Department": { "Mechanical Engineering Department": 1, "Computer Science Department": 1 },
  "Computer Science Department": { "Electrical Engineering Department": 1, "Lecture Hall Complex": 1, "Bioscience & Bioengineering Department": 1 },
  "Bioscience & Bioengineering Department": { "Computer Science Department": 1, "Chemistry Department": 1 },
  "Chemical Engineering Department": { "Mechanical Engineering Department": 1, "Civil & Infrastructure Engineering Dept": 1 },
  "Civil & Infrastructure Engineering Dept": { "Chemical Engineering Department": 1, "Metallurgical & Materials Engg. Dept": 1 },
  "Metallurgical & Materials Engg. Dept": { "Civil & Infrastructure Engineering Dept": 1, "Physics Department": 1 },
  "Physics Department": { "Metallurgical & Materials Engg. Dept": 1, "Mathematics Department": 1 },
  "Chemistry Department": { "Bioscience & Bioengineering Department": 1, "Basic Laboratory": 1 },
  "Mathematics Department": { "Physics Department": 1, "Humanities & Social Sciences Dept": 1 },
  "Humanities & Social Sciences Dept": { "Mathematics Department": 1 },
  "Basic Laboratory": { "Lecture Hall Complex": 1, "Chemistry Department": 1 },
  "Computer Center": { "Central Library": 1 },
  
  "Administration Block": { "Student Activity Center": 1 },
  "Student Activity Center": { "Administration Block": 1 },
  
  "Hostel I3": { "Hostel I2": 1, "Old Mess": 1 },
  "Hostel I2": { "Hostel I3": 1, "New Mess": 1 },
  
  "Medical Center": { "Sports Complex": 1 },
  
  "Sports Complex": { "Medical Center": 1, "Cricket Ground": 2, "Volleyball Court": 1, "Football Field": 1, "Basketball Court": 1, "Tennis Court": 1, "Badminton Court": 1, "Hockey Field": 1 },
  "Cricket Ground": { "Sports Complex": 2 },
  "Volleyball Court": { "Sports Complex": 1 },
  "Football Field": { "Sports Complex": 1 },
  "Basketball Court": { "Sports Complex": 1 },
  "Tennis Court": { "Sports Complex": 1 },
  "Badminton Court": { "Sports Complex": 1 },
  "Hockey Field": { "Sports Complex": 1 },
  
  "Canara Bank Atm": { "Office of Director": 1 },
  "Shiv Mandir": {},
  
  "Old Mess": { "Hostel I3": 1, "Canteen": 1 },
  "New Mess": { "Hostel I2": 1 },
  "Canteen": { "Old Mess": 1 },
  
  "Fresh N Green": { "Main Entrance Gate": 1 },
  "Main Entrance Gate": { "Fresh N Green": 1 }
};

// Location coordinates for IITJ
export const locationCoordinates = {
  "Office of Director": { latitude: 26.47117, longitude: 73.11308 },
  "Knowledge Tree": { latitude: 26.47046, longitude: 73.11367 },
  "Central Library": { latitude: 26.47157, longitude: 73.11356 },
  "Director Residence": { latitude: 26.47114, longitude: 73.11208 },
  "IIT Jodhpur Museum": { latitude: 26.47054, longitude: 73.11594 },

  "Lecture Hall Complex": { latitude: 26.47297, longitude: 73.11407 },
  
  // departments
  "Mechanical Engineering Department": { latitude: 26.47909, longitude: 73.11663 },
  "Electrical Engineering Department": { latitude: 26.47932, longitude: 73.11607 },
  "Computer Science Department": { latitude: 26.47499, longitude: 73.11444 },
  "Bioscience & Bioengineering Department": { latitude: 26.47552, longitude: 73.11445 },
  "Chemical Engineering Department": { latitude: 26.47946, longitude: 73.11677 },
  "Civil & Infrastructure Engineering Dept": { latitude: 26.47856, longitude: 73.11627 },
  "Metallurgical & Materials Engg. Dept": { latitude: 26.47979, longitude: 73.11689 },
  "Physics Department": { latitude: 26.47985, longitude: 73.11623 },
  "Chemistry Department": { latitude: 26.47546, longitude: 73.11507 },
  "Mathematics Department": { latitude: 26.48028, longitude: 73.11586 },
  "Humanities & Social Sciences Dept": { latitude: 26.48013, longitude: 73.11647 },
  "Basic Laboratory": { latitude: 26.47498, longitude: 73.11501 },
  "Computer Center": { latitude: 26.47148, longitude: 73.11397 },

  "Administration Block": { latitude: 26.4726, longitude: 73.1156 },
  "Student Activity Center": { latitude: 26.4724, longitude: 73.1155 },
  
  "Hostel I3": { latitude: 26.47164, longitude: 73.11614 },
  "Hostel I2": { latitude: 26.47159, longitude: 73.11544},

  "Medical Center": { latitude: 26.48125, longitude: 73.11961 },
 // sports
  "Sports Complex": { latitude: 26.47675, longitude: 73.11974 },
  "Cricket Ground": { latitude: 26.47855, longitude: 73.12262 },
  "Volleyball Court": { latitude: 26.47759, longitude: 73.12167 },
  "Football Field": { latitude: 26.47621, longitude: 73.12056 },
  "Basketball Court": { latitude: 26.47662, longitude: 73.12118 },
  "Tennis Court": { latitude: 26.47711, longitude: 73.12114 },
  "Badminton Court": { latitude: 26.47699, longitude: 73.11943},
  "Hockey Field": { latitude: 26.47378, longitude: 73.11949},
  
  "Canara Bank Atm": { latitude: 26.47113, longitude: 73.11373 },

  "Shiv Mandir": { latitude: 26.48562, longitude: 73.12309},

  "Old Mess": { latitude: 26.47204, longitude: 73.11679},
  "New Mess": { latitude: 26.47290, longitude: 73.11724},
  "Canteen": { latitude: 26.47210, longitude: 73.11685},

  "Fresh N Green": { latitude: 26.46652, longitude: 73.11165 },
  "Main Entrance Gate": { latitude: 26.46669, longitude: 73.11532 }
};

// IITJ Campus Center Coordinates
export const IITJ_CENTER = {
  latitude: 26.47103,
  longitude: 73.11341,
};

// Building markers for Google Earth view
export const buildingMarkers = Object.entries(locationCoordinates).map(([name, coords]) => ({
  name,
  position: { lat: coords.latitude, lng: coords.longitude }
}));

// Helper function to determine location type
export function getLocationType(location) {
  if (!location || typeof location !== 'string') return 'other';
  const lowerLocation = location.toLowerCase();
  if (lowerLocation.includes('hostel')) return 'residential';
  if (lowerLocation.includes('department') || lowerLocation.includes('block')) return 'academic';
  if (lowerLocation.includes('library')) return 'academic';
  if (lowerLocation.includes('hall')) return 'academic';
  if (lowerLocation.includes('dining')) return 'dining';
  if (lowerLocation.includes('medical')) return 'health';
  if (lowerLocation.includes('sports')) return 'sports';
  if (lowerLocation.includes('shopping')) return 'commercial';
  if (lowerLocation.includes('guest')) return 'residential';
  if (lowerLocation.includes('housing')) return 'residential';
  if (lowerLocation.includes('park')) return 'commercial';
  if (lowerLocation.includes('gate')) return 'entrance';
  if (lowerLocation.includes('auditorium')) return 'events';
  if (lowerLocation.includes('center')) return 'events';
  return 'other';
}

// Helper function to get icon for location
export function getLocationIcon(location) {
  if (!location || typeof location !== 'string') return 'place';
  const lowerLocation = location.toLowerCase();
  if (lowerLocation.includes('hostel')) return 'home';
  if (lowerLocation.includes('department') || lowerLocation.includes('block')) return 'school';
  if (lowerLocation.includes('library')) return 'local-library';
  if (lowerLocation.includes('hall')) return 'restaurant';
  if (lowerLocation.includes('medical')) return 'medical-services';
  if (lowerLocation.includes('sports')) return 'sports-soccer';
  if (lowerLocation.includes('shopping')) return 'shopping-cart';
  if (lowerLocation.includes('guest')) return 'hotel';
  if (lowerLocation.includes('housing')) return 'apartment';
  if (lowerLocation.includes('park')) return 'business';
  if (lowerLocation.includes('gate')) return 'gate';
  if (lowerLocation.includes('auditorium')) return 'event';
  if (lowerLocation.includes('center')) return 'event';
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