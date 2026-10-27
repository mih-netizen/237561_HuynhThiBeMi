const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.get('/', async (req, res) => {
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

module.exports = router;