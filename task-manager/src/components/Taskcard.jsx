export default function TaskCard({ task, stages, stageColor, onEdit, onDelete, onStageChange }) {
  return (
    <div className="task-card fade-in" style={{ "--accent": stageColor }}>
      <div className="task-card-top">
        <h4>{task.title}</h4>
        <div className="task-actions">
          <button onClick={() => onEdit(task)} title="Edit">✏️</button>
          <button onClick={() => onDelete(task.id)} title="Delete">🗑️</button>
        </div>
      </div>
      {task.description && <p className="task-desc">{task.description}</p>}
      <div className="task-card-bottom">
        <select value={task.stage} onChange={(e) => onStageChange(task.id, e.target.value)} className="stage-select">
          {stages.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}