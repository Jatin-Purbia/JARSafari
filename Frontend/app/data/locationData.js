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

// Location coordinates for IITJ
export const locationCoordinates = {
  "Office of Director": { latitude: 26.47117, longitude: 73.11308 },
  "Knowledge Tree": { latitude: 26.46920, longitude: 73.11422 },
  "Central Library": { latitude: 26.47157, longitude: 73.11356 },
  "Director Residence": { latitude: 26.47114, longitude: 73.11208 },
  "IIT Jodhpur Museum": { latitude: 26.47054, longitude: 73.11594 },
  "Lecture Hall Complex": { latitude: 26.47297, longitude: 73.11407 },
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

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// Create complete graph with actual distances and walkable paths
export const campusGraph = {};
locations.forEach(location1 => {
  campusGraph[location1] = {};
  locations.forEach(location2 => {
    if (location1 !== location2) {
      const coords1 = locationCoordinates[location1];
      const coords2 = locationCoordinates[location2];
      const distance = calculateDistance(
        coords1.latitude,
        coords1.longitude,
        coords2.latitude,
        coords2.longitude
      );
      
      // Only add edges for walkable paths
      if (isWalkablePath(location1, location2)) {
        campusGraph[location1][location2] = distance;
      }
    }
  });
});

// Function to check if a direct path exists between two locations
export function isDirectPathExists(start, end) {
  // List of locations that have direct walkable paths
  const directPaths = {
    "Main Entrance Gate": ["Fresh N Green", "Administration Block"],
    "Administration Block": ["Main Entrance Gate", "Student Activity Center", "Computer Center"],
    "Student Activity Center": ["Administration Block", "Hostel I2", "Hostel I3"],
    "Hostel I2": ["Student Activity Center", "Hostel I3", "Old Mess"],
    "Hostel I3": ["Student Activity Center", "Hostel I2", "New Mess"],
    "Old Mess": ["Hostel I2", "Canteen"],
    "New Mess": ["Hostel I3", "Canteen"],
    "Canteen": ["Old Mess", "New Mess", "Sports Complex"],
    "Sports Complex": ["Canteen", "Cricket Ground", "Volleyball Court", "Football Field", "Basketball Court", "Tennis Court", "Badminton Court", "Hockey Field"],
    "Computer Center": ["Administration Block", "Central Library"],
    "Central Library": ["Computer Center", "Lecture Hall Complex"],
    "Lecture Hall Complex": ["Central Library", "Mechanical Engineering Department", "Electrical Engineering Department", "Computer Science Department"],
    "Mechanical Engineering Department": ["Lecture Hall Complex", "Electrical Engineering Department", "Chemical Engineering Department"],
    "Electrical Engineering Department": ["Lecture Hall Complex", "Mechanical Engineering Department", "Computer Science Department"],
    "Computer Science Department": ["Lecture Hall Complex", "Electrical Engineering Department", "Bioscience & Bioengineering Department"],
    "Bioscience & Bioengineering Department": ["Computer Science Department", "Chemical Engineering Department"],
    "Chemical Engineering Department": ["Mechanical Engineering Department", "Bioscience & Bioengineering Department", "Civil & Infrastructure Engineering Dept"],
    "Civil & Infrastructure Engineering Dept": ["Chemical Engineering Department", "Metallurgical & Materials Engg. Dept"],
    "Metallurgical & Materials Engg. Dept": ["Civil & Infrastructure Engineering Dept", "Physics Department"],
    "Physics Department": ["Metallurgical & Materials Engg. Dept", "Mathematics Department"],
    "Mathematics Department": ["Physics Department", "Humanities & Social Sciences Dept"],
    "Humanities & Social Sciences Dept": ["Mathematics Department", "Chemistry Department"],
    "Chemistry Department": ["Humanities & Social Sciences Dept", "Basic Laboratory"],
    "Basic Laboratory": ["Chemistry Department", "Computer Science Department"],
    "Medical Center": ["Sports Complex"],
    "Canara Bank Atm": ["Administration Block"],
    "Shiv Mandir": ["Main Entrance Gate"],
    "Fresh N Green": ["Main Entrance Gate"]
  };

  return directPaths[start]?.includes(end) || directPaths[end]?.includes(start);
}

// Function to check if a path is walkable
export function isWalkablePath(start, end) {
  return isDirectPathExists(start, end);
}

// Dijkstra's algorithm implementation with walkable paths check
export function findShortestPath(start, end) {
  // First check if there's a direct walkable path
  if (isDirectPathExists(start, end)) {
    return {
      path: [start, end],
      distance: campusGraph[start][end]
    };
  }

  const distances = {};
  const previous = {};
  const unvisited = new Set(locations);
  
  // Initialize distances
  locations.forEach(location => {
    distances[location] = Infinity;
  });
  distances[start] = 0;
  
  while (unvisited.size > 0) {
    // Find the unvisited node with the smallest distance
    let current = null;
    let smallestDistance = Infinity;
    unvisited.forEach(location => {
      if (distances[location] < smallestDistance) {
        smallestDistance = distances[location];
        current = location;
      }
    });
    
    if (current === null || current === end) break;
    unvisited.delete(current);
    
    // Update distances to neighbors (only walkable paths)
    Object.entries(campusGraph[current]).forEach(([neighbor, weight]) => {
      if (unvisited.has(neighbor) && isWalkablePath(current, neighbor)) {
        const distance = distances[current] + weight;
        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = current;
        }
      }
    });
  }
  
  // Reconstruct the path
  const path = [];
  let current = end;
  while (current !== undefined) {
    path.unshift(current);
    current = previous[current];
  }
  
  return {
    path,
    distance: distances[end]
  };
}

// Example usage:
// const result = findShortestPath("Computer Science Department", "Central Library");
// console.log(result.path); // Array of locations in the shortest path
// console.log(result.distance); // Total distance in kilometers 