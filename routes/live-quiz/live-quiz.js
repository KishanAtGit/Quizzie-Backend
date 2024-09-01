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
      quiz.quizImpression = (quiz.quizImpression || 0) + 1;
      await quiz.save();
      res.status(200).json({ quiz });
    }
  } catch (error) {
    next(error);
  }
});

liveQuiz.put("/attempt/:quizId/:questionId", async (req, res, next) => {
  try {
    const { quizId, questionId } = req.params;
    const { isCorrect } = req.body;

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

    // Update totalPeopleAttempted
    question.totalPeopleAttempted = (question.totalPeopleAttempted || 0) + 1;

    // Update peopleAttemptedCorrectly if the answer is correct
    if (isCorrect && quiz.quizType === "Q&A") {
      question.peopleAttemptedCorrectly =
        (question.peopleAttemptedCorrectly || 0) + 1;
    } else if (!isCorrect && quiz.quizType === "Q&A") {
      question.peopleAttemptedWrongly =
        (question.peopleAttemptedWrongly || 0) + 1;
    } else if (quiz.quizType === "Poll") {
      question.options.map(
        option =>
          option._id == isCorrect &&
          (option.timesChosen = (option.timesChosen || 0) + 1)
      );
    }

    // Save the updated quiz
    await quiz.save();

    res.status(200).json({ message: "Attempt recorded successfully", quiz });
  } catch (error) {
    next(error);
  }
});

module.exports = liveQuiz;
