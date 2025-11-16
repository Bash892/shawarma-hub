const Worker = require('../models/Worker');

// GET /api/workers (admin)
const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    console.error('getWorkers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// (Optional) POST /api/workers (admin) - if you want to add workers from admin panel
const createWorker = async (req, res) => {
  try {
    const { name, role, phone, active } = req.body;

    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }

    const worker = await Worker.create({
      name,
      role,
      phone,
      active: active !== undefined ? active : true,
    });

    res.status(201).json(worker);
  } catch (error) {
    console.error('createWorker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/workers/:id   (admin)
const deleteWorker = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findByIdAndDelete(id);

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json({ message: 'Worker removed successfully' });
  } catch (error) {
    console.error('deleteWorker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWorkers,
  createWorker,
  deleteWorker,
};
