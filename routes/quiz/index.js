const express = require("express");
const router = express();
const Quiz = require("../../schemas/quiz");

router.post("/create", async (req, res, next) => {
  try {
    const { quizName, quizType, questions } = req.body;
    // console.log(questions[0].options);

    // const questionArray = questions.map(question =>
    //   question.options.split(",").map(option => option.trim())
    // );
    // const questionArray = questions.split(",").map(question => question.trim());
    const newQuiz = new Quiz({
      quizName,
      quizType,
      questions,
    });
    await newQuiz.save();
    res.status(201).json({ message: "Quiz Created Successfully!" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
