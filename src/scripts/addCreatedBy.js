/* eslint-disable */
const mongoose = require('mongoose');
const { connectDb } = require('../db/db');
const Quiz = require('../modules/quizzes/quiz.model');

(async () => {
  const addCreatedBy = async () => {
    try {
      // Validate tenant exists
      const quizzes = await Quiz.find();
      const newQuizzes = await Promise.all(
        quizzes.map(async (quiz) => {
          quiz.createdBy = "67526789bf0020b6b651ebf4";
          quiz.updatedBy = "67526789bf0020b6b651ebf4";
          await Quiz.findByIdAndUpdate(quiz._id.toString(), { $set: {createdBy: quiz.createdBy, updatedBy: quiz.updatedBy} });
          return quiz;
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
  await addCreatedBy();

})();
