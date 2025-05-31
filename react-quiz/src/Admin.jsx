import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Admin() {
  const [selectedSubject, setSelectedSubject] = useState(""); // No subject selected initially
  const [results, setResults] = useState([]);
  const subjects = ["html", "css", "python","react","java"];

  useEffect(() => {
    const fetchResults = async () => {
      if (!selectedSubject) return; // Do nothing until a subject is selected

      try {
        const subjectRef = collection(db, selectedSubject);
        const snapshot = await getDocs(subjectRef);

        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          const latestAttempt = docData.attempts?.[0];

          return {
            name: docData.name,
            score: latestAttempt?.score || 0,
            date: latestAttempt?.timestamp
              ? new Date(latestAttempt.timestamp).toLocaleDateString()
              : "N/A"
          };
        });

        setResults(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchResults();
  }, [selectedSubject]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <div className="mb-4 text-center">
        <label className="form-label me-2"><strong>Select Subject:</strong></label>
        <select
          className="form-select d-inline w-auto"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Subject</option>
          {subjects.map((subj) => (
            <option key={subj} value={subj}>{subj.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {selectedSubject && (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">No data found for {selectedSubject}</td>
              </tr>
            ) : (
              results.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.score}</td>
                  <td>{student.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}