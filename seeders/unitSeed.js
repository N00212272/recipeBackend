const Unit = require('../models/unit.model');

const seedUnits = async () => {
    const units = [
        { name: 'Gram', abbreviation: 'g' },
        { name: 'Kilogram', abbreviation: 'kg' },
        { name: 'Milliliter', abbreviation: 'ml' },
        { name: 'Liter', abbreviation: 'l' },
        { name: 'Cup', abbreviation: 'cup' },
        { name: 'Tablespoon', abbreviation: 'tbsp' },
        { name: 'Teaspoon', abbreviation: 'tsp' },
        { name: 'Pound', abbreviation: 'lb' },
        { name: 'Ounce', abbreviation: 'oz' },
    ];

    await Unit.insertMany(units);
    console.log('Units seeded.');
};

module.exports = seedUnits;
