const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://haneenzar1fadev_db_user:xNS9a9snHFlNboEG@cluster0.ehq5yop.mongodb.net';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Atlas Connected Successfully!'))
    .catch(err => console.log('❌ DB Connection Error:', err));

// Schema لتاسكات المشروع والأعضاء والهدف
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    assignees: [String],
    status: { type: String, enum: ['To Do', 'In Progress', 'In Review', 'In Trouble', 'Done', 'Archived'], default: 'To Do' },
    priorityColor: String,
    startDate: String,
    endDate: String,
    tracks: [String]
});

const memberSchema = new mongoose.Schema({
    name: String,
    role: String
});

const goalSchema = new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);
const Member = mongoose.model('Member', memberSchema);
const Goal = mongoose.model('Goal', goalSchema);

// جلب كل البيانات (تاسكات، أعضاء، أهداف) فارغة في البداية
dataEndpoints: {
    app.get('/api/tasks', async (req, res) => {
        const tasks = await Task.find({ status: { $ne: 'Archived' } });
        res.json(tasks);
    });
    app.get('/api/members', async (req, res) => {
        const members = await Member.find();
        res.json(members);
    });
    app.get('/api/goals', async (req, res) => {
        const goals = await Goal.find();
        res.json(goals);
    });
}

// إضافة تاسك جديد
app.post('/api/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
});

// تحديث أو نقل أو أرشفة التاسك
app.put('/api/tasks/:id', async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
});

// حذف التاسك نهائياً
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
});

// إضافة عضو جديد للقاعدة
app.post('/api/members', async (req, res) => {
    const newMember = new Member(req.body);
    await newMember.save();
    res.status(201).json(newMember);
});

// حذف عضو
app.delete('/api/members/:id', async (req, res) => {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
});

// إضافة خطوة للهدف النهائي
app.post('/api/goals', async (req, res) => {
    const newGoal = new Goal(req.body);
    await newGoal.save();
    res.status(201).json(newGoal);
});

// حذف خطوة من الهدف
app.delete('/api/goals/:id', async (req, res) => {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted' });
});

// الذكاء الاصطناعي التحليلي
app.get('/api/ai-analysis', async (req, res) => {
    const tasks = await Task.find({ status: { $ne: 'Archived' } });
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === 'Done').length;
    const troubleTasks = tasks.filter(t => t.status === 'In Trouble').length;

    const progressPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    let analysisMessage = `نسبة إنجاز المشروع الحالية هي ${progressPercentage}%. `;
    if (troubleTasks > 0) {
        analysisMessage += `تنبيه: يوجد ${troubleTasks} تاسكات متعطلة في عمود (In Trouble). `;
    } else {
        analysisMessage += `الأداء ممتاز والتقدم مستقر تماماً.`;
    }

    res.json({ progressPercentage, analysis: analysisMessage });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));