/* eslint-disable */
const mongoose = require('mongoose');
const { connectDb } = require('../db/db');
const Subject = require('../modules/subjects/subject.model');
const Tenant = require('../modules/tenants/tenant.model');

(async () => {
  const editTenants = async () => {
    try {
      // Validate tenant exists
      const subjects = await Subject.find();
      const newSubjects = await Promise.all(
        subjects.map(async (subject) => {
          subject.tenants = [subject.tenant];
          await Subject.findByIdAndUpdate(subject._id.toString(), { $set: {tenants: subject.tenants} });
          return subject;
        })
      );
      // Find and update all subjects without a tenant
      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Error during migration:', error);
      process.exit(1);
    } finally {
      await mongoose.disconnect();
    }
  };

  const db = await connectDb();
  await editTenants();

})();
