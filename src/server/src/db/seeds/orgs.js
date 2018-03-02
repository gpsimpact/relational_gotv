const faker = require('faker');
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('organizations')
    .del()
    .then(function() {
      const orgs = [];
      Array(20)
        .fill()
        .map((_, i) => {
          orgs.push({
            id: faker.random.uuid(),
            name: faker.company.companyName(),
            cta: faker.company.catchPhrase(),
            slug: faker.lorem.slug(),
            contact_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            contact_email: faker.internet.email(),
            contact_phone: faker.phone.phoneNumber(),
          });
        });

      // Inserts seed entries
      return knex('organizations').insert(orgs);
    });
};
