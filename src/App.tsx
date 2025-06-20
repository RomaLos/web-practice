import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProjectManagement from './pages/ProjectManagement';
import DrawingManagement from './pages/DrawingManagement';

interface Project {
  id: string;
  name: string;
  measurementSystem: 'Imperial' | 'Metric';
}

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-blue-600 p-4 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-semibold">Drawing Management App</h1>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:underline text-sm sm:text-base">Projects</Link>
            </li>
            <li>
              <Link to="/drawings" className="hover:underline text-sm sm:text-base">Drawings</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<ProjectManagement projects={projects} setProjects={setProjects} />} />
          <Route path="/drawings" element={<DrawingManagement projects={projects} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;