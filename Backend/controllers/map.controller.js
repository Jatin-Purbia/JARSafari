const mapsService = require('../services/maps.service');

module.exports = {
  getAddressCoordinate: async (req, res) => {
    try {
      const { address } = req.query;
      if (!address) {
        return res.status(400).json({ error: 'Address is required' });
      }
      const coordinate = await mapsService.getAddressCoordinate(address);
      res.json(coordinate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getRoute: async (req, res) => {
    try {
      const { origin, destination } = req.query;
      if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination are required' });
      }
      const route = await mapsService.getRoute(origin, destination);
      res.json(route);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
