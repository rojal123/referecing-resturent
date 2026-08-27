const MenuItem = require('../models/MenuItem');
const { serializeMenuItem } = require('../utils/serializers');

async function getPublicMenu(search) {
  const filter = { isAvailable: true };

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { category: regex }, { description: regex }];
  }

  const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
  return items.map(serializeMenuItem);
}

module.exports = { getPublicMenu };