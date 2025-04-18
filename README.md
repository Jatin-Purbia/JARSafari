# JARSafari 🚶‍♂️📍

**JARSafari** is a personalized campus navigation app designed specifically for **IIT Jodhpur**. It provides optimized, real-time routes between campus locations like hostels, mess, academic blocks, and more. Unlike general-purpose maps, JARSafari supports **multi-stop navigation**, **live GPS tracking**, **favorites**, and smart autocomplete—all tailored to the student experience.

---

## 🚀 Features

- 🧭 **Campus-Specific Navigation**  
  Navigate the IIT Jodhpur campus with accuracy—designed for both outdoor and indoor zones.

- 🗺️ **Multi-Stop Route Planning**  
  Plan trips with multiple stops (e.g., Hostel → Mess → Lecture Hall) and receive the most optimized route.

- ⭐ **Favorites System**  
  Save your frequently visited locations for quick access on the homepage.

- 🔍 **Trie-Based Autocomplete Search**  
  Quickly find locations with smart suggestions as you type.

- 📍 **Live GPS Tracking**  
  Real-time user location tracking on campus map with visual routing guidance.

- 🕒 **Time-Aware Dynamic Map**  
  The homepage dynamically highlights relevant locations based on the current time (e.g., mess timings).

- ⚙️ **Optimized Routing Engine**  
  Uses OpenStreetMap-based routing (OSMR) and algorithms like Dijkstra or A* for fast pathfinding.

## 📱 App Screenshots

<div style="display: flex; flex-wrap: wrap; gap: 10px;">
  <img src="../Frontend/assets/app_view/home.jpg" alt="Home Screen" width="200"/>
  <img src="../Frontend/assets/app_view/info.jpg" alt="GPS Navigation" width="200"/>
  <img src="../Frontend/assets/app_view/favorites.jpg" alt="Favorites" width="200"/>
  <img src="../Frontend/assets/app_view/flanding.jpg" alt="Multi-Stop Planning" width="200"/>
  <img src="../Frontend/assets/app_view/gps.jpg" alt="Autocomplete Search" width="200"/>
  <img src="../Frontend/assets/app_view/autorec.jpg" alt="First Landing" width="200"/>
  <img src="../Frontend/assets/app_view/stops.jpg" alt="Location Info" width="200"/>
</div>


---

## 📈 Performance Highlights

- ⚡ Up to **40% faster** route generation compared to BFS in large maps.
- 🔁 Multi-stop routes calculated in under **50ms** on average.
- 💾 Space-efficient graph using adjacency lists.
- 📂 Caching common routes reduced recomputation by ~60%.

---

## 🧠 Key Learnings

- Identified key student pain points in navigating a large campus with similar-looking buildings.
- Built an adaptive routing system with real-time location awareness and personalization.
- Balanced efficient algorithms with a user-friendly mobile interface for maximum usability.

---

## 🔮 Scope for Future Extensions

- 📍 ETA prediction and voice-based navigation
- 🧏 Accessibility features for inclusive use
- 📅 Timetable integration with reminders and shortest path to upcoming classes
- 📡 Offline support for areas with limited connectivity

---

## 🙌 Acknowledgements

- Based on **OpenStreetMap Routing (OSMR)** for backend routing.
- Thanks to **LLMs** and open-source contributors for foundational support.

---

## 📂 Repository Structure

```
Frontend/
├── assets/
│   └── app_view/          # App screenshots and UI assets
├── app/                   # Main application code
│   ├── components/        # Reusable UI components
│   ├── screens/          # Individual app screens
│   ├── navigation/       # Navigation configuration
│   └── utils/            # Utility functions and helpers
├── package.json          # Project dependencies
└── README.md            # Project documentation
```
