import React, { useEffect, useState } from "react";
import "./App.css";
import StatsPanel from './components/StatsPanel';
import TaskDetailsPanel from './components/TaskDetailsPanel';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
    isCompleted: false,
    assignedTo: "",
  });
  const [filterStatus, setFilterStatus] = useState(null);  // Filtre durumu burada
  const [editingTask, setEditingTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 4;

  const fetchTasks = () => {
    fetch(`https://localhost:7275/api/Tasks/GetAll`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Görev ekleme fonksiyonu
  const handleAddTask = () => {
    fetch(`https://localhost:7275/api/Tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks((prev) => [...prev, data]);
        setNewTask({
          title: "",
          description: "",
          dueDate: "",
          status: "",
          isCompleted: false,
          assignedTo: "",
        });
        setShowAddModal(false);
      });
  };

  // Silme fonksiyonu
  const handleDelete = (id) => {
    fetch(`https://localhost:7275/api/Tasks/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    });
  };

  // Güncelleme fonksiyonu
  const handleUpdate = () => {
    fetch(`https://localhost:7275/api/Tasks/${editingTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingTask),
    }).then(() => {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? editingTask : t))
      );
      setEditingTask(null);
    });
  };

  // Detay gösterme butonuna alert değil, burada kullanmadık.
  // Filtrelenmiş görevler
  const filteredTasks = filterStatus
    ? tasks.filter((task) => {
        if (filterStatus === "completed") return task.isCompleted == true;
        if (filterStatus === "pending") return task.isCompleted == false;
        if (filterStatus === "all") return true;
        return task.status === filterStatus;
      })
    : tasks;

  // Sayfalama işlemi
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <div className="container">
      <h1>📝 Task Tracker</h1>

      {/* İstatistik Paneli, filtre seçimini buradan alıyoruz */}
      <StatsPanel onFilterSelect={setFilterStatus} statsData={tasks} />

      {/* Filtre seçilmişse detay modalı göster */}
      {filterStatus && (
        <TaskDetailsPanel
          tasks={filteredTasks}
          onClose={() => setFilterStatus(null)}
          filterStatus={filterStatus}
        />
      )}

      {/* Add Task Modal Açma Butonu */}
      <button onClick={() => setShowAddModal(true)}>➕ Add New Task</button>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Task</h2>
            <input
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <input
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <input
              type="datetime-local"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <input
              placeholder="Status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            />
            <input
              placeholder="Assigned To"
              value={newTask.assignedTo}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedTo: e.target.value })
              }
            />
            <label>
              Completed?
              <input
                type="checkbox"
                checked={newTask.isCompleted}
                onChange={(e) =>
                  setNewTask({ ...newTask, isCompleted: e.target.checked })
                }
              />
            </label>
            <br />
            <button onClick={handleAddTask}>Add Task</button>
            <button className="cancel-button" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <hr />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="task-table">
            <thead>
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
              {currentTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{new Date(task.dueDate).toLocaleString()}</td>
                  <td>{task.status}</td>
                  <td>{task.assignedTo}</td>
                  <td>{task.isCompleted ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => handleDelete(task.id)}>Delete</button>
                    <button onClick={() => setEditingTask(task)}>Edit</button>
                    {/* Detaylar artık StatsPanel tıklamasıyla gösteriliyor */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={currentPage === num ? "active-page" : ""}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <input
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            />
            <input
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
            />
            <input
              type="datetime-local"
              value={editingTask.dueDate}
              onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
            />
            <input
              value={editingTask.status}
              onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
            />
            <input
              value={editingTask.assignedTo}
              onChange={(e) =>
                setEditingTask({ ...editingTask, assignedTo: e.target.value })
              }
            />
            <label>
              Completed?
              <input
                type="checkbox"
                checked={editingTask.isCompleted}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, isCompleted: e.target.checked })
                }
              />
            </label>
            <br />
            <button onClick={handleUpdate}>Save</button>
            <button className="cancel-button" onClick={() => setEditingTask(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;