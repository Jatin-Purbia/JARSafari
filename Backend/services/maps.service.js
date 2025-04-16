const axios = require('axios');

module.exports = {
  getAddressCoordinate: async (address) => {
    const apiKey = process.env.Google_api_key;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng
        };
      } else {
        throw new Error('Failed to get address coordinate');
      }
    } catch (error) {
      throw new Error('Failed to get address coordinate');
    }
  },

  getRoute: async (origin, destination) => {
    const apiKey = process.env.Google_api_key;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        return {
          routes: response.data.routes,
          status: response.data.status
        };
      } else {
        throw new Error('Failed to get route');
      }
    } catch (error) {
      throw new Error('Failed to get route');
    }
  }
};
