const mongoose = require("mongoose");
const quizSchema = new mongoose.Schema({
  quizName: {
    type: String,
    required: true,
  },
  quizType: {
    type: String,
    enum: ["Q&A", "Poll"],
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
      },
      answer: {
        type: Number,
      },
      timer: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("Quiz", quizSchema);
