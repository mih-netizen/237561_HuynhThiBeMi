
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// ==================== SCHEMA NHÂN VIÊN ====================
const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Mã nhân viên là bắt buộc'],
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: [true, 'Họ tên là bắt buộc'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      trim: true,
      lowercase: true
    },
    gender: {
      type: String,
      default: 'Nam',
      trim: true
    },
    dateOfBirth: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      default: 'IT',
      trim: true
    },
    position: {
      type: String,
      default: 'Nhân viên',
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    hireDate: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'Đang làm việc',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Sử dụng collection employees trong MongoDB
const Employee = mongoose.model(
  'Employee',
  EmployeeSchema,
  'employees'
);

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend REST API đang hoạt động tốt',
    timestamp: new Date()
  });
});

// ==================== TRANG CHỦ API ====================
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Employee Management REST API',
    health: '/health',
    employees: '/api/employees'
  });
});

// ==================== GET: DANH SÁCH / TÌM KIẾM ====================
app.get('/api/employees', async (req, res) => {
  try {
    const search = (req.query.search || '').trim();

    let query = {};

    if (search) {
      // Tránh lỗi khi người dùng nhập ký tự đặc biệt vào tìm kiếm
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      query = {
        $or: [
          { employeeId: { $regex: safeSearch, $options: 'i' } },
          { fullName: { $regex: safeSearch, $options: 'i' } }
        ]
      };
    }

    const employees = await Employee.find(query).sort({
      createdAt: -1
    });

    return res.status(200).json(employees);
  } catch (err) {
    console.error('Lỗi lấy danh sách nhân viên:', err.message);

    return res.status(500).json({
      message: 'Lỗi máy chủ khi lấy danh sách nhân viên',
      error: err.message
    });
  }
});

// ==================== GET: CHI TIẾT NHÂN VIÊN ====================
app.get('/api/employees/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let employee = null;

    // Tìm theo MongoDB ObjectId nếu đúng định dạng
    if (/^[0-9a-fA-F]{24}$/.test(param)) {
      employee = await Employee.findById(param);
    }

    // Nếu không tìm thấy, tìm theo mã nhân viên
    if (!employee) {
      employee = await Employee.findOne({
        employeeId: param
      });
    }

    if (!employee) {
      return res.status(404).json({
        message: 'Không tìm thấy nhân viên'
      });
    }

    return res.status(200).json(employee);
  } catch (err) {
    console.error('Lỗi lấy chi tiết nhân viên:', err.message);

    return res.status(500).json({
      message: 'Lỗi máy chủ',
      error: err.message
    });
  }
});

// ==================== POST: THÊM NHÂN VIÊN ====================
app.post('/api/employees', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;

    if (
      typeof employeeId !== 'string' ||
      !employeeId.trim() ||
      typeof fullName !== 'string' ||
      !fullName.trim() ||
      typeof email !== 'string' ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: 'Mã nhân viên, họ tên và email là bắt buộc!'
      });
    }

    const normalizedId = employeeId.trim();

    const existing = await Employee.findOne({
      employeeId: normalizedId
    });

    if (existing) {
      return res.status(409).json({
        message: `Mã nhân viên '${normalizedId}' đã tồn tại!`
      });
    }

    const newEmployee = new Employee({
      ...req.body,
      employeeId: normalizedId,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase()
    });

    const savedEmployee = await newEmployee.save();

    return res.status(201).json({
      message: 'Thêm nhân viên thành công!',
      employee: savedEmployee
    });
  } catch (err) {
    console.error('Lỗi thêm nhân viên:', err.message);

    if (err.code === 11000) {
      return res.status(409).json({
        message: 'Mã nhân viên đã tồn tại!'
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: err.message
      });
    }

    return res.status(500).json({
      message: 'Lỗi máy chủ khi thêm nhân viên',
      error: err.message
    });
  }
});

// ==================== PUT: CẬP NHẬT NHÂN VIÊN ====================
app.put('/api/employees/:id', async (req, res) => {
  try {
    const param = req.params.id;
    const updateData = { ...req.body };

    // Không cho phép thay đổi trực tiếp các trường hệ thống
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    if (updateData.employeeId !== undefined) {
      if (
        typeof updateData.employeeId !== 'string' ||
        !updateData.employeeId.trim()
      ) {
        return res.status(400).json({
          message: 'Mã nhân viên không được để trống!'
        });
      }

      updateData.employeeId = updateData.employeeId.trim();
    }

    let updated = null;

    if (/^[0-9a-fA-F]{24}$/.test(param)) {
      updated = await Employee.findByIdAndUpdate(
        param,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );
    }

    if (!updated) {
      updated = await Employee.findOneAndUpdate(
        { employeeId: param },
        updateData,
        {
          new: true,
          runValidators: true
        }
      );
    }

    if (!updated) {
      return res.status(404).json({
        message: 'Không tìm thấy nhân viên để cập nhật'
      });
    }

    return res.status(200).json({
      message: 'Cập nhật nhân viên thành công!',
      employee: updated
    });
  } catch (err) {
    console.error('Lỗi cập nhật nhân viên:', err.message);

    if (err.code === 11000) {
      return res.status(409).json({
        message: 'Mã nhân viên đã tồn tại!'
      });
    }

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: err.message
      });
    }

    return res.status(500).json({
      message: 'Lỗi máy chủ khi cập nhật nhân viên',
      error: err.message
    });
  }
});

// ==================== DELETE: XÓA NHÂN VIÊN ====================
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let deleted = null;

    if (/^[0-9a-fA-F]{24}$/.test(param)) {
      deleted = await Employee.findByIdAndDelete(param);
    }

    if (!deleted) {
      deleted = await Employee.findOneAndDelete({
        employeeId: param
      });
    }

    if (!deleted) {
      return res.status(404).json({
        message: 'Không tìm thấy nhân viên để xóa'
      });
    }

    return res.status(200).json({
      message: 'Xóa nhân viên thành công!'
    });
  } catch (err) {
    console.error('Lỗi xóa nhân viên:', err.message);

    return res.status(500).json({
      message: 'Lỗi máy chủ khi xóa nhân viên',
      error: err.message
    });
  }
});

// ==================== XỬ LÝ ROUTE KHÔNG TỒN TẠI ====================
app.use((req, res) => {
  res.status(404).json({
    message: 'API không tồn tại',
    path: req.originalUrl
  });
});

// ==================== KẾT NỐI MONGODB & KHỞI ĐỘNG SERVER ====================
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('Chưa cấu hình MONGO_URI trong file .env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('>>> Kết nối thành công tới MongoDB Atlas!');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`>>> Server đang chạy tại port ${PORT}`);
      console.log(`>>> Health check: http://localhost:${PORT}/health`);
      console.log(`>>> API nhân viên: http://localhost:${PORT}/api/employees`);
    });
  } catch (err) {
    console.error('Lỗi khởi động backend:', err.message);
    process.exit(1);
  }
}

startServer();
