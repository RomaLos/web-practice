import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  measurementSystem: 'Imperial' | 'Metric';
}

interface ProjectManagementProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ projects, setProjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('New project');
  const [measurementSystem, setMeasurementSystem] = useState<'Imperial' | 'Metric'>('Metric');
  const [nameError, setNameError] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const validateName = (name: string) => {
    if (name.length > 150) {
      return 'Name must be 150 characters or less';
    }
    if (!/^[a-zA-Z0-9\s]*$/.test(name)) {
      return 'Name can only contain letters and numbers';
    }
    return '';
  };

  const handleCreateProject = () => {
    const error = validateName(newProjectName);
    if (error) {
      setNameError(error);
      return;
    }
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: newProjectName || 'New project',
      measurementSystem,
    };
    setProjects([...projects, newProject]);
    setIsModalOpen(false);
    setNewProjectName('New project');
    setMeasurementSystem('Metric');
    setNameError('');
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    setSelectedProjects(selectedProjects.filter((selectedId) => selectedId !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Project Management</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        + New project
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 bg-white rounded shadow relative">
            <input
              type="checkbox"
              className="absolute top-2 left-2"
              checked={selectedProjects.includes(project.id)}
              onChange={() => {
                setSelectedProjects(
                  selectedProjects.includes(project.id)
                    ? selectedProjects.filter((id) => id !== project.id)
                    : [...selectedProjects, project.id]
                );
              }}
            />
            <Link to="/drawings" className="text-xl font-semibold hover:underline">
              {project.name}
            </Link>
            <p>System: {project.measurementSystem}</p>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => handleDeleteProject(project.id)}
            >
              ⋮
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">New project</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="New project"
                value={newProjectName}
                onChange={(e) => {
                  setNewProjectName(e.target.value);
                  setNameError(validateName(e.target.value));
                }}
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1">Measurement system</label>
              <select
                className="w-full p-2 border rounded"
                value={measurementSystem}
                onChange={(e) => setMeasurementSystem(e.target.value as 'Imperial' | 'Metric')}
              >
                <option value="Metric">Metric</option>
                <option value="Imperial">Imperial</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleCreateProject}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;