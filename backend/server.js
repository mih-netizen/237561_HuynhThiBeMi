const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Schema & Model Nhân viên
const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  gender: { type: String, default: 'Nam' },
  dateOfBirth: { type: String },
  department: { type: String, default: 'IT' },
  position: { type: String, default: 'Nhân viên' },
  phone: { type: String },
  hireDate: { type: String },
  status: { type: String, default: 'Đang làm việc' }
}, { timestamps: true });

const Employee = mongoose.model('Employee', EmployeeSchema, 'employees');

// Endpoint /health (Yêu cầu đề bài)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend REST API đang hoạt động tốt', timestamp: new Date() });
});

// GET /api/employees & Tìm kiếm ?search=
app.get('/api/employees', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search, $options: 'i' } },
          { fullName: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/employees/:id
app.get('/api/employees/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let employee = param.match(/^[0-9a-fA-F]{24}$/) ? await Employee.findById(param) : null;
    if (!employee) employee = await Employee.findOne({ employeeId: param });
    if (!employee) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/employees (Tạo mới & Check trùng mã)
app.post('/api/employees', async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;
    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ message: 'Mã nhân viên, Họ tên và Email là bắt buộc!' });
    }
    const existing = await Employee.findOne({ employeeId: employeeId.trim() });
    if (existing) {
      return res.status(400).json({ message: `Mã nhân viên '${employeeId}' đã tồn tại!` });
    }
    const newEmployee = new Employee(req.body);
    const saved = await newEmployee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/employees/:id (Cập nhật)
app.put('/api/employees/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let updated = param.match(/^[0-9a-fA-F]{24}$/)
      ? await Employee.findByIdAndUpdate(param, req.body, { new: true })
      : null;
    if (!updated) updated = await Employee.findOneAndUpdate({ employeeId: param }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy nhân viên để cập nhật' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/employees/:id (Xóa)
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let deleted = param.match(/^[0-9a-fA-F]{24}$/) ? await Employee.findByIdAndDelete(param) : null;
    if (!deleted) deleted = await Employee.findOneAndDelete({ employeeId: param });
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy nhân viên để xóa' });
    res.status(200).json({ message: 'Xóa nhân viên thành công!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('>>> Kết nối thành công tới MongoDB Atlas!');
    app.listen(PORT, () => console.log(`>>> Server đang chạy tại port ${PORT}`));
  })
  .catch(err => console.error('Lỗi kết nối MongoDB:', err.message));