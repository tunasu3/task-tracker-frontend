import React from "react";

const TaskDetailsPanel = ({ tasks, onClose, filterStatus }) => {
  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "80%",
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        <h2>
          Tasks -{" "}
          {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
        </h2>

        {tasks.length === 0 ? (
          <p>No tasks found for this filter.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                  Title
                </th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                  Description
                </th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                  Due Date
                </th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                  Status
                </th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                  Assigned To
                </th>
                <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
                  Completed
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {task.title}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {task.description}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {new Date(task.dueDate).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {task.status}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {task.assignedTo}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                    {task.isCompleted ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          style={{
            marginTop: "15px",
            padding: "8px 12px",
            backgroundColor: "#c45656ff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsPanel;