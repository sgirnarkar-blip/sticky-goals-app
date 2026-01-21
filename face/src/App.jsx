import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const colors = ["#ffdac1", "#b2e2f2", "#fdfd96", "#b2f2bb", "#ffb7b2"];

  useEffect(() => {
    fetch('https://sticky-goals-app.onrender.com')
      .then(res => res.json())
      .then(data => setTasks(Array.isArray(data) ? data : []))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const newTaskData = {
      title: input,
      completed: false,
      color: colors[tasks.length % colors.length],
      date: new Date().toLocaleDateString()
    };
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData)
      });
      const data = await res.json();
      setTasks([data, ...tasks]);
      setInput("");
    } catch (err) { console.error(err); }
  };

  const toggleComplete = async (task) => {
    const newStatus = !task.completed;
    await fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newStatus })
    });
    setTasks(tasks.map(t => t._id === task._id ? { ...t, completed: newStatus } : t));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerCard}>
        <h1 style={styles.title}>✨ Todays tasks</h1>
        <div style={styles.dots}>............</div>
        <div style={styles.inputRow}>
         <input 
         value={input} 
        onChange={(e) => setInput(e.target.value)} 
  
         // ADD THIS LINE BELOW:
        onKeyDown={(e) => e.key === 'Enter' && addTask()} 
  
        placeholder="Plant a new goal..."
        style={styles.inputField}
        />
          <button onClick={addTask} style={styles.addBtn}>Add</button>
        </div>
      </div>

      <div style={styles.grid}>
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
            
           
              key={task._id} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              style={{ ...styles.note, backgroundColor: task.color }}
            >
              <div style={styles.clip}>📎</div>
              <p style={styles.dateText}>{task.date}</p>
              <div style={styles.content}>
                <input 
                  type="checkbox" checked={task.completed} 
                  onChange={() => toggleComplete(task)}
                  style={styles.check}
                />
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </span>
              </div>
              <button onClick={() => deleteTask(task._id)} style={styles.del}>🗑️</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  headerCard: { background: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center', width: '100%', maxWidth: '450px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
  title: { fontSize: '2rem', margin: 0 },
  dots: { fontWeight: 'bold', marginBottom: '20px', letterSpacing: '4px' },
  inputRow: { display: 'flex', gap: '10px' },
  inputField: { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' },
  addBtn: { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' },
  grid: { display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' },
  note: { width: '180px', height: '180px', padding: '20px', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '5px 5px 15px rgba(0,0,0,0.1)', borderRadius: '2px' },
  clip: { position: 'absolute', top: '-15px', left: '45%', fontSize: '1.5rem' },
  dateText: { fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px' },
  content: { flex: 1, display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '600' },
  check: { width: '18px', height: '18px' },
  del: { alignSelf: 'flex-end', background: 'none', border: 'none', cursor: 'pointer' }
};

export default App;