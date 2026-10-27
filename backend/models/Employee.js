const mongoose = require('mongoose');

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

module.exports = mongoose.model('Employee', EmployeeSchema, 'employees');