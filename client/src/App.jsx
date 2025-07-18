import { useEffect, useState } from 'react';
import BugForm from './components/BugForm';
import BugList from './components/BugList';

export default function App() {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/bugs')
      .then(res => res.json())
      .then(data => setBugs(data));
  }, []);

  return (
    <div className="app">
      <h1>Bug Tracker</h1>
      <BugForm setBugs={setBugs} />
      <BugList bugs={bugs} setBugs={setBugs} />
    </div>
  );
}
