import React, { useEffect, useState } from "react";

function StatsPanel({ onNavigate }) {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7275/api/tasks/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="stats-panel" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <div
        className="stat-box"
        style={{ flex: 1, padding: '10px', backgroundColor: '#c45656ff', borderRadius: '8px', cursor: 'pointer' }}
        onClick={() => onNavigate("all")}
      >
        <h3>Total Tasks</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</p>
      </div>

      <div
        className="stat-box"
        style={{ flex: 1, padding: '10px', backgroundColor: '#4caf50', borderRadius: '8px', cursor: 'pointer' }}
        onClick={() => onNavigate("completed")}
      >
        <h3>Completed</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.completed}</p>
      </div>

      <div
        className="stat-box"
        style={{ flex: 1, padding: '10px', backgroundColor: '#ff9800', borderRadius: '8px', cursor: 'pointer' }}
        onClick={() => onNavigate("pending")}
      >
        <h3>Pending</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.pending}</p>
      </div>
    </div>
  );
}

function TaskList({ tasks, filter }) {
  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed === true;
    if (filter === "pending") return task.completed === false;
    return true; // all
  });

  if (filteredTasks.length === 0) return <p>No tasks to show.</p>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ backgroundColor: '#d96c6c', color: 'white' }}>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Assigned To</th>
          <th>Completed</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredTasks.map(task => (
          <tr key={task.id} style={{ borderBottom: '1px solid #ddd' }}>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>{new Date(task.dueDate).toLocaleString()}</td>
            <td>{task.status}</td>
            <td>{task.assignedTo}</td>
            <td>{task.completed ? "Yes" : "No"}</td>
            <td>
              <button>Delete</button>
              <button>Edit</button>
              <button>Details</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7275/api/tasks")
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleNavigate = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
      <StatsPanel onNavigate={handleNavigate} />
      {loading ? <p>Loading tasks...</p> : <TaskList tasks={tasks} filter={filter} />}
    </div>
  );
}

export default App;