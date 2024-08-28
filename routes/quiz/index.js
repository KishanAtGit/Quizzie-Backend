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

quizRoutes.get("/:createdBy_userId", async (req, res, next) => {
  try {
    console.log(req.query);
    const createdBy_userId = req.params.createdBy_userId;
    const isTrending = req.query.isTrending === "true";
    const isSorted = req.query.isSorted === "true";

    let quiz;

    if (isTrending && isSorted) {
      quiz = await Quiz.find({
        createdBy_userId,
        quizImpression: { $gt: 10 }, // Filter: impressions greater than 10
      })
        .sort({ quizImpression: -1 })
        .limit(12);
    } else if (isTrending) {
      quiz = await Quiz.find({
        createdBy_userId,
        quizImpression: { $gt: 10 }, // Filter: impressions greater than 10
      }).limit(12);
    } else if (isSorted) {
      quiz = await Quiz.find({ createdBy_userId }).sort({
        quizImpression: -1,
      });
    } else {
      quiz = await Quiz.find({ createdBy_userId });
    }

    if (!quiz) {
      res.status(500);
    } else {
      const totalQuestions = quiz
        .map(q => q.questions.length)
        .reduce((a, b) => a + b, 0);
      const totalQuizs = quiz.length;
      const totalImpression = quiz
        .map(q => q.quizImpression)
        .reduce((a, b) => a + b, 0);

      res.status(200).json({
        quiz,
        totalQuestions,
        totalQuizs,
        totalImpression,
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = quizRoutes;
