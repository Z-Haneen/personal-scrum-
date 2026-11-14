import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const columns = ['To Do', 'In Progress', 'In Review', 'In Trouble', 'Done'];
const availableTracks = ['UX', 'Flutter', 'AI', 'Backend'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [goalChecklist, setGoalChecklist] = useState([]);
  const [aiReport, setAiReport] = useState(null);
  const [theme, setTheme] = useState('dark'); // المود الافتراضي

  // حالة التحكم في فتح وإغلاق السايدبار للموبايل
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // بيانات التاسك
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [priorityColor, setPriorityColor] = useState('#10b981');

  // الأعضاء والهدف
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newGoalText, setNewGoalText] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    fetchData();
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const fetchData = async () => {
    try {
      const tasksRes = await axios.get('http://localhost:5000/api/tasks');
      const membersRes = await axios.get('http://localhost:5000/api/members');
      const goalsRes = await axios.get('http://localhost:5000/api/goals');

      setTasks(tasksRes.data);
      setTeamMembers(membersRes.data);
      setGoalChecklist(goalsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    await axios.post('http://localhost:5000/api/tasks', {
      title,
      description,
      assignees: selectedAssignees,
      startDate,
      endDate,
      tracks: selectedTracks,
      priorityColor,
      status: 'To Do'
    });
    setTitle('');
    setDescription('');
    setSelectedAssignees([]);
    setStartDate('');
    setEndDate('');
    setSelectedTracks([]);
    fetchData();
  };

  const moveTask = async (id, newStatus) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { status: newStatus });
    fetchData();
  };

  const archiveTask = async (id) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}`, { status: 'Archived' });
    fetchData();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchData();
  };

  const addTeamMember = async (e) => {
    e.preventDefault();
    if (!newMemberName) return;
    await axios.post('http://localhost:5000/api/members', { name: newMemberName, role: newMemberRole || 'عضو تيم' });
    setNewMemberName('');
    setNewMemberRole('');
    fetchData();
  };

  const deleteMember = async (id) => {
    await axios.delete(`http://localhost:5000/api/members/${id}`);
    fetchData();
  };

  const addGoalItem = async (e) => {
    e.preventDefault();
    if (!newGoalText) return;
    await axios.post('http://localhost:5000/api/goals', { text: newGoalText });
    setNewGoalText('');
    fetchData();
  };

  const deleteGoalItem = async (id) => {
    await axios.delete(`http://localhost:5000/api/goals/${id}`);
    fetchData();
  };

  const fetchAiAnalysis = async () => {
    const res = await axios.get('http://localhost:5000/api/ai-analysis');
    setAiReport(res.data);
  };

  const toggleTrack = (track) => {
    setSelectedTracks(prev => prev.includes(track) ? prev.filter(t => t !== track) : [...prev, track]);
  };

  const toggleAssignee = (name) => {
    setSelectedAssignees(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const completedGoalsCount = goalChecklist.filter(item => item.completed).length;
  const projectProgress = goalChecklist.length > 0 ? Math.round((completedGoalsCount / goalChecklist.length) * 100) : 0;

  return (
    <div className="App">
      <div className="main-content">
        {/* الهيدر مع زرار تبديل المود وزر فتح القائمة الجانبية للموبايل */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '5px' }}>
              {/* زر إظهار القائمة الجانبية في الموبايل */}
              <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
                ☰ القائمة وإدارة التيم
              </button>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700' }}>🌿 PlantX Scrum Pro Dashboard</h1>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: '5px 0 0', fontSize: '14px' }}>لوحة متابعة مشروع تخرج النباتات (ذكاء اصطناعي ونظام إدارة متكامل)</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={toggleTheme} style={{ background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
              {theme === 'dark' ? '☀️ مود نهاري' : '🌙 مود ليلي'}
            </button>
            <button onClick={fetchAiAnalysis} style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
              🤖 AI Progress Bot
            </button>
          </div>
        </header>

        {aiReport && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid #10b981', padding: '20px', borderRadius: '14px', marginBottom: '25px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#34d399' }}>📊 تقرير الذكاء الاصطناعي الأسبوعي</h3>
            <p><b>النسبة العامة للتقدم:</b> {aiReport.progressPercentage}%</p>
            <p style={{ color: 'var(--text-muted)' }}>{aiReport.analysis}</p>
          </div>
        )}

        {/* نموذج إضافة مهمة بتصميم مريح */}
        <form onSubmit={addTask} style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '30px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>➕ إضافة مهمة جديدة للـ Kanban</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <input type="text" placeholder="عنوان التاسك..." value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '14px' }} required />
            <input type="text" placeholder="الوصف التفصيلي أو الملاحظات..." value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '12px 16px', borderRadius: '10px', fontSize: '14px' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>الأعضاء المسؤولون عن المهمة:</label>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {teamMembers.length === 0 && <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>لم يتم إضافة أعضاء بعد (أضفهم من القائمة الجانبية)</span>}
              {teamMembers.map(m => (
                <label key={m._id} style={{ cursor: 'pointer', fontSize: '13px', background: 'var(--column-bg)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <input type="checkbox" checked={selectedAssignees.includes(m.name)} onChange={() => toggleAssignee(m.name)} style={{ marginLeft: '8px' }} />
                  {m.name}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '25px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>تاريخ البداية: </label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>تاريخ النهاية: </label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>لون الكارد:</label>
              <input type="color" value={priorityColor} onChange={e => setPriorityColor(e.target.value)} style={{ border: 'none', width: '35px', height: '35px', cursor: 'pointer', background: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginLeft: '15px' }}>التراكات (Tracks):</span>
            {availableTracks.map(track => (
              <label key={track} style={{ marginLeft: '20px', cursor: 'pointer', fontSize: '13px' }}>
                <input type="checkbox" checked={selectedTracks.includes(track)} onChange={() => toggleTrack(track)} style={{ marginLeft: '6px' }} />
                {track}
              </label>
            ))}
          </div>

          <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>حفظ وإضافة المهمة</button>
        </form>

        {/* أعمدة الـ Scrum بحجم مرن بدون قيود في الارتفاع */}
        <div className="kanban-container">
          {columns.map(col => (
            <div key={col} className="kanban-column">
              <h3 style={{ fontSize: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px', marginTop: 0 }}>{col}</h3>
              {tasks.filter(t => t.status === col).length === 0 && <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', textAlign: 'center', padding: '20px 0' }}>لا توجد مهام</span>}
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task._id} className="task-card" style={{ borderLeftColor: task.priorityColor || '#10b981' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px' }}>{task.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: '1.4' }}>{task.description}</p>

                  <div style={{ marginBottom: '10px' }}>
                    {task.tracks && task.tracks.map((t, i) => (
                      <span key={i} className={`tag tag-${t.toLowerCase()}`}>{t}</span>
                    ))}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    👥 {task.assignees && task.assignees.length > 0 ? task.assignees.join(', ') : 'غير محدد'} <br />
                    ⏳ من {task.startDate || '--'} إلى {task.endDate || '--'}
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <select value={task.status} onChange={(e) => moveTask(task._id, e.target.value)} style={{ width: '100%', fontSize: '12px', padding: '6px', borderRadius: '8px' }}>
                      {columns.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={() => archiveTask(task._id)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>أرشفة</button>
                    <button onClick={() => deleteTask(task._id)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* الخلفية المظللة عند فتح السايدبار في الموبايل */}
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* الـ Sidebar الجانبي */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '17px', margin: 0 }}>👥 إدارة أعضاء التيم</h3>
          {/* زر إغلاق القائمة في الموبايل */}
          <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>✕</button>
        </div>

        <form onSubmit={addTeamMember} style={{ marginBottom: '25px' }}>
          <input type="text" placeholder="اسم العضو..." value={newMemberName} onChange={e => setNewMemberName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', fontSize: '13px' }} />
          <input type="text" placeholder="التخصص (مثل AI, Backend)..." value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', fontSize: '13px' }} />
          <button type="submit" style={{ width: '100%', background: '#38bdf8', color: '#0f172a', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>إضافة عضو جديد</button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
          {teamMembers.length === 0 && <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>لا يوجد أعضاء مسجلين</span>}
          {teamMembers.map((m) => (
            <li key={m._id} style={{ background: 'var(--column-bg)', padding: '12px', borderRadius: '10px', marginBottom: '10px', borderLeft: '4px solid #38bdf8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '14px' }}>{m.name}</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.role}</div>
              </div>
              <button onClick={() => deleteMember(m._id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </li>
          ))}
        </ul>

        <h3 style={{ fontSize: '17px', marginBottom: '15px' }}>🎯 الهدف النهائي ({projectProgress}%)</h3>
        <div style={{ background: 'var(--column-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ background: 'var(--border-color)', borderRadius: '8px', height: '10px', width: '100%', marginBottom: '15px', overflow: 'hidden' }}>
            <div style={{ background: '#10b981', width: `${projectProgress}%`, height: '100%', transition: 'width 0.3s' }}></div>
          </div>
          {goalChecklist.length === 0 && <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>لم تقم بإضافة خطوات للهدف النهائي</span>}
          {goalChecklist.map((item) => (
            <div key={item._id} style={{ marginBottom: '10px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.text}</span>
              <button onClick={() => deleteGoalItem(item._id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>✕</button>
            </div>
          ))}

          <form onSubmit={addGoalItem} style={{ marginTop: '15px' }}>
            <input type="text" placeholder="خطوة جديدة للهدف النهائي..." value={newGoalText} onChange={e => setNewGoalText(e.target.value)} style={{ width: '100%', padding: '9px', marginBottom: '8px', borderRadius: '8px', fontSize: '13px' }} />
            <button type="submit" style={{ width: '100%', background: '#10b981', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>إضافة خطوة للهدف</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;