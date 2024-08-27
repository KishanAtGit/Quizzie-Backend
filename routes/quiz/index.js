const express = require("express");
const quizRoutes = express();
const Quiz = require("../../schemas/quiz");

quizRoutes.post("/create", async (req, res, next) => {
  try {
    const { quizName, quizType, questions, createdBy_userId } = req.body;
    const newQuiz = new Quiz({
      quizName,
      quizType,
      questions,
      createdBy_userId,
    });
    await newQuiz.save();
    res
      .status(201)
      .json({ message: "Quiz Created Successfully!", quizId: newQuiz._id });
  } catch (error) {
    next(error);
  }
});

quizRoutes.get("/live-quiz/:quizId", async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(500);
    } else {
      res.status(200).json({ quiz });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = quizRoutes;
