const User = require('../models/user.model'); 
const Role = require('../models/role.model'); 
const bcrypt = require('bcryptjs');
const usersSeed = async () => {
    await User.deleteMany();
    const users = [
        {
            firstName:"Admin",
            lastName:"Kacper",
            email: 'admin@admin.com',
            password: 'password'
        },
        {
            firstName:"Customer",
            lastName:"Kacper",
            email: 'cust@cust.com',
            password: 'password'
        }
    ];

    const customerRole = await Role.findOne({ name: 'customer' });
    const adminRole = await Role.findOne({ name: 'admin' });

    if (!customerRole || !adminRole) {
        console.error('Roles not found');
        return;
    }

    for (const user of users) {
        const newUser = new User({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            roles: [] 
        });

       
        newUser.password = bcrypt.hashSync(newUser.password, 10);

        // Assign roles based on user type
        if (user.email === 'cust@cust.com') {
            newUser.roles.push(customerRole._id);
        } else if (user.email === 'admin@admin.com') {
            newUser.roles.push(adminRole._id);
        }

        await newUser.save();
        console.log(`Users seeded ${users}`);
    }
};

module.exports = usersSeed;
