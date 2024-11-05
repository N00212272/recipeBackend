const Role = require('../models/role.model');

const seedRoles = async () => {
    console.log(Role)
    const roles = [
        { name: 'customer' },
        { name: 'admin' }
    ];

    await Role.deleteMany();
    
    for (const role of roles) {
        await Role.create(role);
        console.log(`Role created: ${role.name}`);
    }   
};

module.exports = seedRoles;
