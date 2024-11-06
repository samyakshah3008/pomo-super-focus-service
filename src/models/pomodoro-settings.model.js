import { Schema, model } from "mongoose";

const pomodoroSettingsSchema = new Schema(
  {
    timeOptionsSettings: {
      study: {
        type: Number,
        required: true,
        default: 25,
      },
      shortBreak: {
        type: Number,
        required: true,
        default: 5,
      },
      longBreak: {
        type: Number,
        required: true,
        default: 15,
      },
    },
    studyOptionsSettings: {
      autoStartStudyTimer: {
        type: Boolean,
        required: true,
        default: true,
      },
      autoPlayStudyMusic: {
        type: Boolean,
        required: true,
        default: true,
      },
      studyMusicSource: {
        type: String,
        required: true,
        default: "youtube",
      },
      studyMusicPlaylistId: {
        type: String,
        required: true,
        default: "7NOSDKb0HlU",
      },
    },
    breakOptionsSettings: {
      breakMusicSource: {
        type: String,
        required: true,
        default: "youtube",
      },
      autoStartBreakTimer: {
        type: Boolean,
        required: true,
        default: true,
      },
      autoPlayBreakMusic: {
        type: Boolean,
        required: true,
        default: true,
      },
      breakMusicVideoId: {
        type: String,
        required: true,
        default: "qRTVg8HHzUo",
      },
      longBreakInterval: {
        type: Number,
        required: true,
        default: 4,
      },
    },
    uiOptionsSettings: {
      backgroundImageUrl: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const PomodoroSettings = model(
  "PomodoroSettings",
  pomodoroSettingsSchema
);
