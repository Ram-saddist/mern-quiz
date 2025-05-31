import React, { useState } from "react";
import axios from "axios";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

export default function TakeExam() {
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleChange = (e) => {
    setSubject(e.target.value);
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/questions/${subject}`
      );

      const transformed = res.data.map((q) => ({
        id: q.id,
        question: q.question,
        options: [
          { label: "A", text: q["Option A"] },
          { label: "B", text: q["Option B"] },
          { label: "C", text: q["Option C"] },
          { label: "D", text: q["Option D"] },
        ],
        correctAnswer: q.answer,
      }));

      setQuestions(transformed);
      setSubmitted(false);
      setAnswers({});
      setScore(0);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const handleSubmit = async () => {
    let newScore = 0;

    questions.forEach((q) => {
      const selected = answers[q.id];
      if (selected === q.correctAnswer) {
        newScore += 1;
      }
    });

    setScore(newScore);
    setSubmitted(true);

    const student = JSON.parse(localStorage.getItem("student"));
    if (student) {
      const subjectCollection = collection(db, subject.toLowerCase());
      const studentDocRef = doc(subjectCollection, student.email);

      const attemptEntry = {
        score: newScore,
        total: questions.length,
        timestamp: new Date().toISOString(),
      };

      try {
        const docSnap = await getDoc(studentDocRef);

        if (docSnap.exists()) {
          await updateDoc(studentDocRef, {
            attempts: arrayUnion(attemptEntry),
          });
        } else {
          await setDoc(studentDocRef, {
            name: student.name,
            email: student.email,
            attempts: [attemptEntry],
          });
        }
      } catch (error) {
        console.error("Error saving score to Firestore:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Select Subject to Take Exam</h2>
      <div className="mb-3">
        <select className="form-select" onChange={handleChange} value={subject}>
          <option value="">-- Select Subject --</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="react">React</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <button className="btn btn-primary mt-3" onClick={fetchQuestions}>
          Start Quiz
        </button>
      </div>

      {questions.length > 0 && !submitted && (
        <div>
          <h4 className="mb-3">Answer the following questions:</h4>
          {questions.map((q, idx) => (
            <div className="mb-4" key={q.id}>
              <p>
                <strong>Q{idx + 1}:</strong> {q.question}
              </p>
              {q.options.map((opt) => (
                <div className="form-check" key={opt.label}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt.label}
                    onChange={() => handleAnswer(q.id, opt.label)}
                    checked={answers[q.id] === opt.label}
                  />
                  <label className="form-check-label">{opt.text}</label>
                </div>
              ))}
            </div>
          ))}
          <button className="btn btn-success" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

      {submitted && (
        <div className="alert alert-info mt-4">
          <h4>Quiz Completed!</h4>
          <p>
            Your Score: <strong>{score}</strong> / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
}
