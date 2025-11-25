const database = require("mongoose");

const taskSchema = new database.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề là bắt buộc"],
      minLength: [3, "Tiêu đề phải ít nhất 3 ký tự"],
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "finish", "doing", "initial"],
        message: "{VALUE} không hợp lệ. Chỉ chấp nhận pending/finish/doing",
      },
      required: [true, "Trạng thái là bắt buộc"],
    },
    createBy: String,
    listUsers: Array,
    taskParentId: String,
    content: {
      type: String,
      required: [true, "Nội dung không được để trống"],
    },

    timeStart: {
      type: Date,
      required: [true, "Thời gian bắt đầu là bắt buộc"],
    },

    timeFinish: {
      type: Date,
      required: [true, "Thời gian kết thúc là bắt buộc"],
      validate: {
        validator: function (value) {
          return value >= this.timeStart;
        },
        message: "timeFinish phải lớn hơn hoặc bằng timeStart",
      },
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,
  },
  { timestamps: true }
);

const task = database.model("task", taskSchema, "task");

module.exports = task;
