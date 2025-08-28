import React from "react";

function StatsPanel({ onFilterSelect, statsData }) {
  const total = statsData.length; // Toplam görev sayısı
  const completed = statsData.filter((t) => t.isCompleted).length; // Tamamlanmış görev sayısı
  const pending = statsData.filter((t) => !t.isCompleted).length; // Bekleyen görev sayısı

  const boxStyle = {
    flex: 1,
    padding: "15px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    textAlign: "center",
    position: "relative",
  };

  return (
    <div
      className="stats-panel"
      style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
    >
      {/* Total Tasks */}
      <div
        style={{ ...boxStyle, backgroundColor: "#e68b92" }}
        onClick={() => onFilterSelect("all")}
        title="Show all tasks"
      >
        <h3>Total Tasks</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{total}</p>
      </div>

      {/* Completed Tasks */}
      <div
        style={{ ...boxStyle, backgroundColor: "#e68b92" }}
        onClick={() => onFilterSelect("completed")}
        title="Show completed tasks"
      >
        <h3>Completed</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{completed}</p>
      </div>

      {/* Pending Tasks */}
      <div
        style={{ ...boxStyle, backgroundColor: "#e68b92" }}
        onClick={() => onFilterSelect("pending")}
        title="Show pending tasks"
      >
        <h3>Pending</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{pending}</p>
      </div>
    </div>
  );
}

export default StatsPanel;