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

//to update a quiz
quizRoutes.patch("/update/:quizId/:questionId", async (req, res, next) => {
  try {
    const { quizId, questionId } = req.params;
    const { questionText, optionText, timer, optionIndex } = req.body;

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Find the specific question by questionId
    const question = quiz.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update the questionText if provided
    if (questionText) {
      question.questionText = questionText;
    }

    // Update the timer if provided
    if (timer !== undefined) {
      question.timer = timer;
    }

    // Update the specific optionText if provided
    if (optionText !== undefined && optionIndex !== undefined) {
      const option = question.options[optionIndex];
      if (option) {
        option.optionText = optionText;
      } else {
        return res.status(404).json({ message: "Option not found" });
      }
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
