import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProjectManagement from '/Users/Lenovo/project/src/pages/ProjectManagement';
import DrawingManagement from '/Users/Lenovo/project/src/pages/DrawingManagement';

interface Project {
  id: string;
  name: string;
  measurementSystem: 'Imperial' | 'Metric';
}

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 text-white">
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">Projects</Link>
          </li>
          <li>
            <Link to="/drawings" className="hover:underline">Drawings</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<ProjectManagement projects={projects} setProjects={setProjects} />} />
        <Route path="/drawings" element={<DrawingManagement projects={projects} />} />
      </Routes>
    </div>
  );
};

export default App;