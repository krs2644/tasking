import { useState, useEffect } from "react";
import axios from "axios";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

const API = "http://localhost:5000/api";

const STAGES = [
  { id: "todo",       label: "Todo",        color: "#6ee7b7", dim: "rgba(110,231,183,0.1)" },
  { id: "inprogress", label: "In Progress",  color: "#fbbf24", dim: "rgba(251,191,36,0.1)"  },
  { id: "done",       label: "Done",         color: "#34d399", dim: "rgba(52,211,153,0.1)"  },
];

export default function Board({ token, user, onLogout }) {
  const [tasks, setTasks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask]   = useState(null);
  const [visible, setVisible]     = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTasks();
    setTimeout(() => setVisible(true), 50);
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/tasks`, { headers });
      setTasks(res.data.tasks || []);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editTask) {
        const res = await axios.put(`${API}/tasks/${editTask.id}`, data, { headers });
        setTasks(tasks.map(t => t.id === editTask.id ? res.data.task : t));
      } else {
        const res = await axios.post(`${API}/tasks`, data, { headers });
        setTasks([res.data.task, ...tasks]);
      }
      setShowModal(false);
      setEditTask(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save task");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await axios.delete(`${API}/tasks/${id}`, { headers });
      setTasks(tasks.filter(t => t.id !== id));
    } catch {
      alert("Failed to delete task");
    }
  };

  const handleStageChange = async (id, stage) => {
    try {
      const res = await axios.patch(`${API}/tasks/${id}/stage`, { stage }, { headers });
      setTasks(tasks.map(t => t.id === id ? res.data.task : t));
    } catch {
      alert("Failed to move task");
    }
  };

  const openEdit = (task) => { setEditTask(task); setShowModal(true); };
  const openCreate = () => { setEditTask(null); setShowModal(true); };

  return (
    <div className={`board-bg ${visible ? "board-visible" : ""}`}>
      <header className="board-header">
        <div className="board-header-left">
          <span className="board-logo">♛</span>
          <span className="board-title">TasKing</span>
        </div>
        <div className="board-header-right">
          <span className="board-user">👋 {user.name}</span>
          <button className="add-btn" onClick={openCreate}>+ New Task</button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {error && <div className="board-error fade-in">{error}</div>}

      {loading ? (
        <div className="board-loading">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
      ) : (
        <div className="board-columns">
          {STAGES.map((stage, i) => {
            const stageTasks = tasks.filter(t => t.stage === stage.id);
            return (
              <div className="column" key={stage.id} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="column-header" style={{ borderBottom: `1px solid ${stage.color}22` }}>
                  <span className="column-dot" style={{ background: stage.color, boxShadow: `0 0 8px ${stage.color}` }} />
                  <span className="column-label" style={{ color: stage.color }}>{stage.label}</span>
                  <span className="column-count" style={{ background: stage.dim, color: stage.color, border: `1px solid ${stage.color}33` }}>
                    {stageTasks.length}
                  </span>
                </div>
                <div className="column-body">
                  {stageTasks.length === 0 && (
                    <div className="column-empty">No tasks here</div>
                  )}
                  {stageTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      stages={STAGES}
                      stageColor={stage.color}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onStageChange={handleStageChange}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <TaskModal
          task={editTask}
          stages={STAGES}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTask(null); }}
        />
      )}
    </div>
  );
}