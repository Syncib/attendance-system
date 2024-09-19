import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAuthContext } from "../hooks/useAuthContext";

const Admin = () => {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isAllLogOpen, setIsAllLogOpen] = useState(false);
  const [allDetails, setAllDetails] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { user } = useAuthContext();
  const date = new Date();

  const calculateGrade = (daysAttended) => {
    let grade;
    if (daysAttended >= 26) {
      grade = "A";
    } else if (daysAttended >= 21) {
      grade = "B";
    } else if (daysAttended >= 16) {
      grade = "C";
    } else if (daysAttended >= 11) {
      grade = "D";
    } else {
      grade = "F";
    }
    return grade;
  };

  const generateReport = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 16);

    const tableColumn = [
      "Student ID",
      "Student Name",
      "Attendance",
      "Marked Date",
      "Number of Attendance",
      "Attendance Grade",
    ];
    const tableRows = filteredDetails.map((item) => [
      item.userId,
      item.userName,
      item.isMarked ? "Present" : "Absent",
      item.markDate,
      allDetails.filter(
        (att) => att.userId === item.userId && att.isMarked === true
      ).length,
      calculateGrade(item.attendanceCount),
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("attendance-report.pdf");
  };

  const filteredDetails = allDetails.filter((item) => {
    if (!startDate || !endDate) return true;
    const itemDate = new Date(item.markDate);
    return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
  });

  // Fetch all attendance data on component mount
  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/attendance/get-all-attendance",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setAllDetails(data);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    if (user) {
      getDetails();
    }
  }, [user]);

  // Update attendance status (mark present/absent)
  const updateAttendance = async (id, isMarked, markDate, isLeaveApproved) => {
    if (!user) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/attendance/update-attendance/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ isMarked, markDate, isLeaveApproved }),
        }
      );

      if (response.ok) {
        setAllDetails(
          allDetails.map((detail) =>
            detail._id === id
              ? { ...detail, isMarked, markDate, isLeaveApproved }
              : detail
          )
        );
      } else {
        console.error("Failed to update attendance.");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  // Delete attendance record
  const deleteAttendance = async (id) => {
    if (!user) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:4000/api/attendance/delete-attendance/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        setAllDetails(allDetails.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete attendance.");
      }
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  return (
    <div>
      <h1>Hi there, Admin!</h1>
      <div
        className="bg-primary-subtle position-relative"
        style={{ height: "200px" }}
      >
        <div className="d-flex justify-content-around position-relative top-50">
          <button
            className="btn btn-primary"
            onClick={() => setIsLogOpen(!isLogOpen)}
          >
            View Logged in Students
          </button>
          <button
            className="btn btn-success"
            onClick={() => setIsAllLogOpen(!isAllLogOpen)}
          >
            View all Attendance
          </button>
          <button className="btn btn-success" onClick={generateReport}>
            Generate Report
          </button>
        </div>
      </div>

      <div className={isLogOpen ? "my-3" : "d-none"}>
        <h2>Logged in Students</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Login Status</th>
            </tr>
          </thead>
          <tbody>
            {allDetails.map(
              (item, index) =>
                item.loginStatus && (
                  <tr key={index}>
                    <td>{item.userId}</td>
                    <td>{item.userName}</td>
                    <td>{item.loginStatus ? "Logged in" : "N/A"}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>

      <div className={isAllLogOpen ? "my-3" : "d-none"}>
        <h2>All Attendance</h2>
        <div className="mb-3">
          <label className="form-label">From Date:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label className="form-label">To Date:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Attendance</th>
              <th>Marked Date</th>
              <th>Number of Attendance</th>
              <th>Attendance Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDetails.map((item, index) => (
              <tr key={item._id}>
                <td>{item.userId}</td>
                <td>{item.userName}</td>
                <td>
                  {item.isMarked
                    ? "Present"
                    : item.isLeaveApproved
                    ? "On Leave"
                    : "Absent"}
                </td>
                <td>{item.markDate}</td>
                <td>
                  {
                    allDetails.filter(
                      (att) =>
                        att.userId === item.userId && att.isMarked === true
                    ).length
                  }
                </td>
                <td>{calculateGrade(item.attendanceCount)}</td>
                <td>
                  {item.isMarked ? (
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        updateAttendance(item._id, false, "", false)
                      }
                    >
                      Mark Absent
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        updateAttendance(
                          item._id,
                          true,
                          date.toISOString().split("T")[0],
                          false
                        )
                      }
                    >
                      Mark Present
                    </button>
                  )}

                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => deleteAttendance(item._id)}
                  >
                    Delete
                  </button>
                  {(item.isMarked || item.isLeaveApproved )|| (
                    <button
                      className="btn btn-warning ms-2"
                      onClick={() =>
                        updateAttendance(
                          item._id,
                          false,
                          date.toISOString().split("T")[0],
                          true
                        )
                      }
                    >
                      Approve Leave
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
