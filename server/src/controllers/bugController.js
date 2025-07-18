import Bug from '../models/Bug.js';

export const getBugs = async (req, res) => {
  const bugs = await Bug.find();
  res.json(bugs);
};

export const createBug = async (req, res) => {
  const bug = new Bug(req.body);
  await bug.save();
  res.status(201).json(bug);
};

export const updateBug = async (req, res) => {
  const bug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(bug);
};

export const deleteBug = async (req, res) => {
  await Bug.findByIdAndDelete(req.params.id);
  res.json({ message: 'Bug deleted' });
};
