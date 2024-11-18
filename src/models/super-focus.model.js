import { Schema, model } from "mongoose";

const pomodoroSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    focusTime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const superFocusSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    settings: {
      time: {
        studyTime: {
          type: Number,
          required: true,
          min: 1,
        },
        shortBreak: {
          type: Number,
          required: true,
          min: 1,
        },
        longBreak: {
          type: Number,
          required: true,
          min: 1,
        },
      },
      studyOptions: {
        autoStartStudyTimer: {
          type: Boolean,
          required: true,
        },
        autoPlayStudyMusic: {
          type: Boolean,
          required: true,
        },
        studyMusicSource: {
          type: String,
          required: true,
        },
        studyMusicPlaylistId: {
          type: String,
          required: true,
        },
      },
      breakOptions: {
        autoStartBreakTimer: {
          type: Boolean,
          required: true,
        },
        autoPlayBreakTimer: {
          type: Boolean,
          required: true,
        },
        breakMusicSource: {
          type: String,
          required: true,
        },
        breakMusicPlaylistId: {
          type: String,
          required: true,
        },
        longBreakInterval: {
          type: Number,
          required: true,
        },
      },
      uiOptions: {
        backgroundImageUrl: {
          type: String,
          required: true,
        },
      },
    },
    userPomodorosRecord: [pomodoroSchema],
  },
  { timestamps: true }
);

export const SuperFocusUserRecord = model(
  "SuperFocusUserRecord",
  superFocusSchema
);
