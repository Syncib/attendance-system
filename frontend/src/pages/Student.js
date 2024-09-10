import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Student = () => {
  const [leaveFormStatus, setLeaveFormStatus] = useState(false);
  const [attandanceView, setAttandanceView] = useState(false);
  const [leaveText, setLeaveText] = useState("");
  const { user } = useAuthContext();
  const date = new Date();

  const [attendance, setAttendance] = useState({
    userId: user?._id || "",
    userName: user?.name || "",
    email: user?.email || "",
    isMarked: false,
    markDate: date.toISOString().split("T")[0],
    isLeave: false,
    leaveReason: "",
    isLeaveApproved: false,
  });

  const leaveSubmitHandler = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/attendance/mark-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            ...attendance,
            isLeave: true,
            leaveReason: leaveText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark attendance");
      }
      const data = await response.json();
      setAttendance(data.attendance);
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
    leaveFormStatus(false);
  };

  const markAttendance = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/attendance/mark-attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ ...attendance, isMarked: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark attendance");
      }
      const data = await response.json();
      setAttendance(data.attendance);
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:4000/api/attendance/get-attendance",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              email: user.email,
              markDate: date.toISOString().split("T")[0],
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance");
        }

        const data = await response.json();
        setAttendance(data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
    return () => {
      setAttendance({...attendance,loginStatus:false})
    };
  }, [user]);

  return (
    <>
      <div>
        <h1>
          Hi there, {user.name}!{" "}
          {attendance.isMarked || attendance.isLeave
            ? "You have already marked your attendance/leave."
            : "Please mark your attendance or mark your leave if you wish."}
        </h1>
        <div
          className="bg-primary-subtle position-relative"
          style={{ height: "200px" }}
        >
          <div className="d-flex justify-content-around position-relative top-50">
            <button
              className="btn btn-primary"
              disabled={(attendance.isMarked || attendance.isLeave) && true}
              onClick={() => {
                setLeaveFormStatus(!leaveFormStatus);
              }}
            >
              Mark Leave
            </button>
            <button
              className="btn btn-success"
              onClick={markAttendance}
              disabled={(attendance.isMarked || attendance.isLeave) && true}
            >
              Mark Attendance
            </button>
            <button
              className="btn btn-warning"
              onClick={() => {
                setAttandanceView(!attandanceView);
              }}
            >
              View Attendance
            </button>
          </div>
        </div>
        <form
          className={leaveFormStatus ? "d-block" : "d-none"}
          onSubmit={leaveSubmitHandler}
        >
          <div className="mb-3">
            <label htmlFor="leavereason" className="form-label">
              Reason for leave:
            </label>
            <textarea
              className="form-control"
              value={leaveText}
              onChange={(e) => setLeaveText(e.target.value)}
            ></textarea>
          </div>
          <button className="btn btn-success" type="submit">
            Submit
          </button>
        </form>
        <div className={attandanceView ? "d-block" : "d-none"}>
          <p>Following is your attandance status for today:</p>
          <p>Is Marked: {attendance.isMarked ? "Yes" : "No"}</p>
          <p>On Leave: {attendance.isLeave ? "Yes" : "No"} </p>
          <p>Leave Reason: {attendance.leaveReason || "N/A"}</p>
          <p>
            Leave Approved Status:{" "}
            {attendance.isLeaveApproved
              ? "Approved"
              : attendance.isLeave
              ? "Pending"
              : "N/A"}
          </p>
          <p>Marked on: {attendance.markDate || "N/A"}</p>
        </div>
      </div>
    </>
  );
};

export default Student;
