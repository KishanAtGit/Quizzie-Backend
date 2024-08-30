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
      questionText: String,
      optionType: String,
      optionTypeRadioChecked: {
        textType: Boolean,
        imageType: Boolean,
        textAndImageType: Boolean,
      },
      options: [
        {
          optionText: String,
          imageUrl: String,
          isCorrect: Boolean,
          timesChosen: Number,
        },
      ],
      totalPeopleAttempted: Number,
      peopleAttemptedCorrectly: Number,
      timer: Number,
    },
  ],
  quizImpression: Number,
  createdBy_userId: String,
  createdOn: String,
});

module.exports = mongoose.model("Quiz", quizSchema);
