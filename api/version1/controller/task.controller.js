const Task = require("../../../model/task.model");
const paginationHelpers = require("../../../helpers/pagination");
const searchKey = require("../../../helpers/search-key");
// index
module.exports.index = async (req, res) => {
  const find = {
    $or: [
      {
        createBy: req.user.id,
      },
      {
        listUsers: req.user.id,
      },
    ],
    deleted: false,
  };
  // Pagination
  const taskCount = await Task.countDocuments(find);
  let initPagination = {
    currentPage: 1,
    limitItem: 2,
  };

  const Pagination = paginationHelpers(initPagination, req.query, taskCount);

  //   search
  if (req.query.keyword) {
    const key = searchKey(req.query);
    find.title = key.regex;
  }
  // sort
  const sort = {};
  if (req.query.status) {
    find.status = req.query.status;
  }
  if (req.query.sortKey && req.query.keyValue) {
    sort[req.query.sortKey] = req.query.keyValue;
  }
  const task = await Task.find(find)
    .sort(sort)
    .limit(Pagination.limitItem)
    .skip(Pagination.skip);

  res.json(task);
};
// [GET] /api/task/version1/detail/:id
module.exports.details = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({
      _id: id,
      deleted: false,
    });
    res.json(task);
  } catch (error) {
    res.json({
      code: "Not found task by id",
    });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const status = req.body.status;
    await Task.updateOne(
      { _id: id },
      {
        status: status,
      }
    );

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tìm thấy dữ liệu",
    });
  }
};

// [PATCH] /api/task/version1/change-mutil

module.exports.changeMutil = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    console.log(ids);
    console.log(key);

    console.log(value);
    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );
        res.json({
          code: "200",
          message: "Cập nhật thành công",
        });
        break;
      case "delete":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
          }
        );
        res.json({
          code: "200",
          message: "Xóa thành công",
        });
        break;
      default:
        break;
    }
  } catch (error) {
    res.json({
      code: "400",
      message: "Không tồn tại",
    });
  }
};

// [POST] /api/task/version1/create

module.exports.create = async (req, res) => {
  try {
    const task = new Task(req.body);
    task.createBy = req.user.id;
    const result = await task.save();

    return res.json({
      code: 200,
      message: "Tạo thành công",
      data: result,
    });
  } catch (error) {
    // Lỗi validation của Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({
        code: 400,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    // Lỗi khác
    console.log("Server error:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};

// [POST] /api/task/version1/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Task.updateOne(
      {
        _id: id,
      },
      req.body
    );

    return res.json({
      code: 200,
      message: "Cập nhật thành công",
      data: data,
    });
  } catch (error) {
    // Lỗi validation của Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({
        code: 400,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    // Lỗi khác
    console.log("Server error:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};

// [POST] /api/task/version1/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
      }
    );

    return res.json({
      code: 200,
      message: "Xóa thành công",
    });
  } catch (error) {
    // Lỗi validation của Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({
        code: 400,
        message: "Validation failed",
        errors: error.errors,
      });
    }

    // Lỗi khác
    console.log("Server error:", error);
    return res.status(500).json({
      code: 500,
      message: "Lỗi server",
    });
  }
};
