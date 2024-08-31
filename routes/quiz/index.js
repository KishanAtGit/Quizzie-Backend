const express = require("express");
const quizRoutes = express();
const Quiz = require("../../schemas/quiz");

quizRoutes.post("/create", async (req, res, next) => {
  try {
    const { quizName, quizType, questions, createdBy_userId, createdOn } =
      req.body;
    const newQuiz = new Quiz({
      quizName,
      quizType,
      questions,
      createdBy_userId,
      createdOn,
    });
    await newQuiz.save();
    res
      .status(201)
      .json({ message: "Quiz Created Successfully!", quizId: newQuiz._id });
  } catch (error) {
    next(error);
  }
});

//to get all quizs
quizRoutes.get("/:createdBy_userId", async (req, res, next) => {
  try {
    const createdBy_userId = req.params.createdBy_userId;
    const isTrending = req.query.isTrending === "true";
    const isSorted = req.query.isSorted === "true";

    let quiz;

    if (isTrending && isSorted) {
      quiz = await Quiz.find({
        createdBy_userId,
        quizImpression: { $gt: 10 },
      })
        .sort({ quizImpression: -1 })
        .limit(12);
    } else if (isTrending) {
      quiz = await Quiz.find({
        createdBy_userId,
        quizImpression: { $gt: 10 },
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
      const quizForDashboard = await Quiz.find({ createdBy_userId });
      const totalQuestions = quizForDashboard
        .map(q => q.questions.length)
        .reduce((a, b) => a + b, 0);
      const totalQuizs = quizForDashboard.length;
      const totalImpression = quizForDashboard
        .map(q => q.quizImpression || 0)
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

//to update a quiz
quizRoutes.patch("/update/:quizId", async (req, res, next) => {
  try {
    console.log(req.params);
    console.log(req.body);

    const { quizId } = req.params;
    const { questions } = req.body; // Expecting the new questions array

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Replace the existing questions array with the new one

    if (Array.isArray(questions)) {
      quiz.questions = questions;
    } else {
      return res.status(400).json({ message: "Invalid questions array" });
    }

    await quiz.save();

    res.status(200).json({ message: "Quiz updated successfully", quiz });
  } catch (error) {
    next(error);
  }
});

//to delete a quiz
quizRoutes.delete("/delete/:quizId", async (req, res, next) => {
  try {
    const { quizId } = req.params;

    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = quizRoutes;
