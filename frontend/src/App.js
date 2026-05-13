import React, { useState, useEffect } from 'react';
// just for git push
const API_URL = process.env.REACT_APP_API_URL || 'https://be-todo-02230284.onrender.com';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/todos`);
      const data = await res.json();
      // Ensure we always set an array, never an error object
      setTodos(Array.isArray(data) ? data : []);
      if (!res.ok) setError('Backend error: ' + (data.error || res.status));
    } catch (err) {
      setError('Failed to connect to backend.');
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.trim() }),
      });
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setInput('');
    } catch (err) {
      setError('Failed to add todo.');
    }
  };

  // Toggle completed
  const toggleTodo = async (todo) => {
    try {
      const res = await fetch(`${API_URL}/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const updated = await res.json();
      setTodos(todos.map(t => t.id === updated.id ? updated : t));
    } catch (err) {
      setError('Failed to update todo.');
    }
  };

  // Save edited todo
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editText.trim() }),
      });
      const updated = await res.json();
      setTodos(todos.map(t => t.id === updated.id ? updated : t));
      setEditId(null);
      setEditText('');
    } catch (err) {
      setError('Failed to edit todo.');
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📝 Todo App</h1>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="Add a new task..."
          />
          <button style={styles.addBtn} onClick={addTodo}>Add</button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
        ) : todos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#aaa' }}>No tasks yet. Add one above!</p>
        ) : (
          <ul style={styles.list}>
            {todos.map(todo => (
              <li key={todo.id} style={styles.item}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  style={{ marginRight: 12, cursor: 'pointer' }}
                />
                {editId === todo.id ? (
                  <>
                    <input
                      style={{ ...styles.input, flex: 1, marginRight: 8 }}
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(todo.id)}
                    />
                    <button style={styles.saveBtn} onClick={() => saveEdit(todo.id)}>Save</button>
                    <button style={styles.cancelBtn} onClick={() => setEditId(null)}>✕</button>
                  </>
                ) : (
                  <>
                    <span style={{
                      flex: 1,
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#aaa' : '#222'
                    }}>
                      {todo.title}
                    </span>
                    <button style={styles.editBtn} onClick={() => { setEditId(todo.id); setEditText(todo.title); }}>✏️</button>
                    <button style={styles.deleteBtn} onClick={() => deleteTodo(todo.id)}>🗑️</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    padding: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
  },
  title: { textAlign: 'center', marginBottom: 24, color: '#333', fontSize: 28 },
  error: { background: '#fee', color: '#c00', padding: '8px 12px', borderRadius: 8, marginBottom: 12 },
  inputRow: { display: 'flex', gap: 8, marginBottom: 20 },
  input: {
    flex: 1, padding: '10px 14px', borderRadius: 8,
    border: '1.5px solid #ddd', fontSize: 15, outline: 'none'
  },
  addBtn: {
    padding: '10px 20px', background: '#667eea', color: '#fff',
    border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600
  },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  item: {
    display: 'flex', alignItems: 'center', padding: '10px 12px',
    borderRadius: 8, marginBottom: 8, background: '#f9f9f9',
    border: '1px solid #eee'
  },
  editBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, marginLeft: 4 },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, marginLeft: 4 },
  saveBtn: {
    padding: '6px 12px', background: '#22c55e', color: '#fff',
    border: 'none', borderRadius: 6, cursor: 'pointer', marginRight: 4
  },
  cancelBtn: {
    padding: '6px 10px', background: '#ef4444', color: '#fff',
    border: 'none', borderRadius: 6, cursor: 'pointer'
  },
};