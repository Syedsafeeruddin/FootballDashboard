import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard.jsx';
import { GameDetail } from './components/GameDetail.jsx';
import { useGames } from './hooks/useGames.js';

export default function App() {
  const { data, loading, error } = useGames();

  return (
    <Routes>
      <Route path="/" element={<Dashboard data={data} loading={loading} error={error} />} />
      <Route path="/game/:id" element={<GameDetail data={data} />} />
    </Routes>
  );
}