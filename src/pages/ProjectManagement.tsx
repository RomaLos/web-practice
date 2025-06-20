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
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [newProjectName, setNewProjectName] = useState('New project');
  const [measurementSystem, setMeasurementSystem] = useState<'Imperial' | 'Metric'>('Metric');
  const [nameError, setNameError] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [kebabMenuOpen, setKebabMenuOpen] = useState<string | null>(null);

  const validateName = (name: string) => {
    if (name.length > 150) {
      return 'Назва має бути не довшою за 150 символів';
    }
    if (!/^[a-zA-Z0-9\s]*$/.test(name)) {
      return 'Назва може містити лише літери та цифри';
    }
    return '';
  };

  const handleCreateOrUpdateProject = () => {
    const error = validateName(newProjectName);
    if (error) {
      setNameError(error);
      return;
    }
    if (modalMode === 'create') {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name: newProjectName || 'New project',
        measurementSystem,
      };
      setProjects([...projects, newProject]);
    } else if (editingProjectId) {
      setProjects(
        projects.map((project) =>
          project.id === editingProjectId
            ? { ...project, name: newProjectName, measurementSystem }
            : project
        )
      );
    }
    setIsModalOpen(false);
    setNewProjectName('New project');
    setMeasurementSystem('Metric');
    setNameError('');
    setEditingProjectId(null);
    setModalMode('create');
  };

  const handleEditProject = (project: Project) => {
    setModalMode('edit');
    setEditingProjectId(project.id);
    setNewProjectName(project.name);
    setMeasurementSystem(project.measurementSystem);
    setIsModalOpen(true);
    setKebabMenuOpen(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    setSelectedProjects(selectedProjects.filter((selectedId) => selectedId !== id));
    setKebabMenuOpen(null);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Управління проєктами</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
        onClick={() => {
          setModalMode('create');
          setIsModalOpen(true);
        }}
      >
        + Новий проєкт
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 bg-white rounded-lg shadow relative">
            <input
              type="checkbox"
              className="absolute top-4 left-4"
              checked={selectedProjects.includes(project.id)}
              onChange={() => {
                setSelectedProjects(
                  selectedProjects.includes(project.id)
                    ? selectedProjects.filter((id) => id !== project.id)
                    : [...selectedProjects, project.id]
                );
              }}
            />
            <Link to="/drawings" className="text-lg sm:text-xl font-semibold hover:underline">
              {project.name}
            </Link>
            <p className="text-sm text-gray-600">Система: {project.measurementSystem}</p>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setKebabMenuOpen(kebabMenuOpen === project.id ? null : project.id)}
            >
              ⋮
            </button>
            {kebabMenuOpen === project.id && (
              <div className="absolute top-10 right-4 bg-white shadow-md rounded border z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleEditProject(project)}
                >
                  Редагувати
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Видалити
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">
                {modalMode === 'create' ? 'Новий проєкт' : 'Редагувати проєкт'}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewProjectName('New project');
                  setMeasurementSystem('Metric');
                  setNameError('');
                  setEditingProjectId(null);
                  setModalMode('create');
                }}
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm sm:text-base">Назва</label>
              <input
                type="text"
                className="w-full p-2 border rounded text-sm sm:text-base"
                placeholder="New project"
                value={newProjectName}
                onChange={(e) => {
                  setNewProjectName(e.target.value);
                  setNameError(validateName(e.target.value));
                }}
              />
              {nameError && <p className="text-red-500 text-xs sm:text-sm mt-1">{nameError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm sm:text-base">Система вимірювання</label>
              <select
                className="w-full p-2 border rounded text-sm sm:text-base"
                value={measurementSystem}
                onChange={(e) => setMeasurementSystem(e.target.value as 'Imperial' | 'Metric')}
              >
                <option value="Metric">Metric</option>
                <option value="Imperial">Imperial</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm sm:text-base"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewProjectName('New project');
                  setMeasurementSystem('Metric');
                  setNameError('');
                  setEditingProjectId(null);
                  setModalMode('create');
                }}
              >
                Скасувати
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                onClick={handleCreateOrUpdateProject}
              >
                {modalMode === 'create' ? 'Створити' : 'Зберегти'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;