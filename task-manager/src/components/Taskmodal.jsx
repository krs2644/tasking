import { useState } from "react";

export default function TaskModal({ task, stages, onSave, onClose }) {
  const [form, setForm] = useState({
    title:       task?.title       || "",
    description: task?.description || "",
    stage:       task?.stage       || "todo",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title is required");
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{task ? "Edit Task" : "New Task"}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              name="title"
              type="text"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Add details (optional)"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Stage</label>
            <select name="stage" value={form.stage} onChange={handleChange}>
              {stages.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}