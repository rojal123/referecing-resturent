import { Routes, Route } from 'react-router-dom';
import PublicLayout from './components/PublicLayout.jsx';
import Home from '../Home.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public site: shares the Navbar + Footer via PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}