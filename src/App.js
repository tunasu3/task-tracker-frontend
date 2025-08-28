import React, { useEffect, useState } from "react";
import "./App.css";
import StatsPanel from './components/StatsPanel';
import TaskDetailsPanel from './components/TaskDetailsPanel';

function App() {
  const [tasks, setTasks] = useState([]); // All tasks
  const [loading, setLoading] = useState(true); // Loading state
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
    isCompleted: false,
    assignedTo: "",
  });
  const [filterStatus, setFilterStatus] = useState("all"); // Filter status
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query
  const [editingTask, setEditingTask] = useState(null); // Task being edited
  const [showAddModal, setShowAddModal] = useState(false); // Modal visibility
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const tasksPerPage = 3; // Tasks per page

  // Fetch tasks from the API
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const filteredTasks = tasks.filter((task) => {
  console.log(task.isCompleted); // Check the value here
  const matchesStatus =
    filterStatus === "all" || task.status.toLowerCase() === filterStatus;
  const matchesSearch =
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesStatus && matchesSearch;
});

  // Handle Add Task
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
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  // Delete a task
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`https://localhost:7275/api/Tasks/${id}`, {
        method: "DELETE",
      }).then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      });
    }
  };

  // Update a task
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

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Modal toggle
  const toggleModal = () => {
    setShowAddModal(!showAddModal);
  };

  // Modal outside click
  const handleOverlayClick = () => {
    setShowAddModal(false); // Close modal
  };

  return (
    <div className="container">
      <h1>📝 Task Tracker</h1>

      {/* Stats Panel */}
      <StatsPanel onFilterSelect={setFilterStatus} statsData={tasks} />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Add Task Button */}
      <button onClick={() => setShowAddModal(true)}>➕ Add New Task</button>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={currentPage === num ? "active-page" : ""}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
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