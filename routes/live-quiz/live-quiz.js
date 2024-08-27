const express = require("express");
const liveQuiz = express();
const Quiz = require("../../schemas/quiz");

liveQuiz.get("/:quizId", async (req, res, next) => {
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

module.exports = liveQuiz;
