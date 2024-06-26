import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    threshold: { type: Number, required: true, min: 0, max: 100 },
    is_approved: { type: Boolean, default: false },
    is_available: { type: Boolean, default: false },
    order: { type: Number, required: true, unique: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }],
}, {
    timestamps: true
});


const Lesson = mongoose.models?.Lesson || mongoose.model("Lesson", LessonSchema);
export default Lesson;