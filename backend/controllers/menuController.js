const menuService = require('../services/menuService');

async function listMenu(req, res) {
  try {
    const { search } = req.query;
    const items = await menuService.getPublicMenu(search);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching menu' });
  }
}

module.exports = { listMenu };