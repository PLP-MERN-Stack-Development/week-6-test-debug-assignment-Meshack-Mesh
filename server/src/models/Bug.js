import mongoose from 'mongoose';

const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Bug', bugSchema);
