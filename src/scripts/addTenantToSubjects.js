/* eslint-disable */
const mongoose = require('mongoose');
const { connectDb } = require('../db/db');
const Subject = require('../modules/subjects/subject.model');
const Tenant = require('../modules/tenants/tenant.model');

(async () => {
  const addTenantToSubjects = async (tenantId) => {
    try {
      // Validate tenant exists
      const tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        console.error('Tenant not found');
        process.exit(1);
      }

      console.log(`Found tenant: ${tenant.name}`);

      // Find and update all subjects without a tenant
      const result = await Subject.updateMany(
        { tenant: { $exists: false } },
        { $set: { tenant: tenantId } }
      );

      console.log(`Updated ${result.modifiedCount} subjects with tenant ${tenant.name}`);
      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Error during migration:', error);
      process.exit(1);
    } finally {
      await mongoose.disconnect();
    }
  };

  // Get tenant ID from command line argument
  const tenantId = process.argv[2];

  if (!tenantId) {
    console.error('Please provide a tenant ID as an argument');
    console.log('Usage: node addTenantToSubjects.js <tenantId>');
    process.exit(1);
  }

  // Run the migration
  const db = await connectDb();
  addTenantToSubjects(tenantId);

})();
