import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
  measurementSystem: 'Imperial' | 'Metric';
}

interface Drawing {
  id: string;
  name: string;
  projectId: string;
}

interface DrawingManagementProps {
  projects: Project[];
}

const DrawingManagement: React.FC<DrawingManagementProps> = ({ projects }) => {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDrawingName, setNewDrawingName] = useState('New drawing');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [nameError, setNameError] = useState('');
  const [editingDrawingId, setEditingDrawingId] = useState<string | null>(null);
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

  const handleCreateOrUpdateDrawing = () => {
    const error = validateName(newDrawingName);
    if (error) {
      setNameError(error);
      return;
    }
    if (!selectedProjectId) {
      setNameError('Оберіть проєкт');
      return;
    }
    if (editingDrawingId) {
      setDrawings(
        drawings.map((drawing) =>
          drawing.id === editingDrawingId
            ? { ...drawing, name: newDrawingName, projectId: selectedProjectId }
            : drawing
        )
      );
    } else {
      const newDrawing: Drawing = {
        id: crypto.randomUUID(),
        name: newDrawingName || 'New drawing',
        projectId: selectedProjectId,
      };
      setDrawings([...drawings, newDrawing]);
    }
    setIsModalOpen(false);
    setNewDrawingName('New drawing');
    setSelectedProjectId(projects[0]?.id || '');
    setNameError('');
    setEditingDrawingId(null);
    setKebabMenuOpen(null);
  };

  const handleEditDrawing = (drawing: Drawing) => {
    setEditingDrawingId(drawing.id);
    setNewDrawingName(drawing.name);
    setSelectedProjectId(drawing.projectId);
    setIsModalOpen(true);
    setKebabMenuOpen(null);
  };

  const handleDeleteDrawing = (id: string) => {
    setDrawings(drawings.filter((drawing) => drawing.id !== id));
    setKebabMenuOpen(null);
  };

  const filteredDrawings = drawings.filter((drawing) =>
    drawing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Управління малюнками</h1>
      <div className="flex flex-col sm:flex-row mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
          onClick={() => setIsModalOpen(true)}
        >
          + Новий малюнок
        </button>
        <input
          type="text"
          className="p-2 border rounded w-full text-sm sm:text-base"
          placeholder="Пошук..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDrawings.map((drawing) => (
          <div key={drawing.id} className="p-4 bg-white rounded-lg shadow relative">
            <h2 className="text-lg sm:text-xl font-semibold">{drawing.name}</h2>
            <p className="text-sm text-gray-600">
              Проєкт: {projects.find((p) => p.id === drawing.projectId)?.name || 'Невідомий'}
            </p>
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setKebabMenuOpen(kebabMenuOpen === drawing.id ? null : drawing.id)}
            >
              ⋮
            </button>
            {kebabMenuOpen === drawing.id && (
              <div className="absolute top-10 right-4 bg-white shadow-md rounded border z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleEditDrawing(drawing)}
                >
                  Редагувати
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={() => handleDeleteDrawing(drawing.id)}
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
                {editingDrawingId ? 'Редагувати малюнок' : 'Новий малюнок'}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewDrawingName('New drawing');
                  setSelectedProjectId(projects[0]?.id || '');
                  setNameError('');
                  setEditingDrawingId(null);
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
                placeholder="New drawing"
                value={newDrawingName}
                onChange={(e) => {
                  setNewDrawingName(e.target.value);
                  setNameError(validateName(e.target.value));
                }}
              />
              {nameError && <p className="text-red-500 text-xs sm:text-sm mt-1">{nameError}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm sm:text-base">Проєкт</label>
              <select
                className="w-full p-2 border rounded text-sm sm:text-base"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm sm:text-base"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewDrawingName('New drawing');
                  setSelectedProjectId(projects[0]?.id || '');
                  setNameError('');
                  setEditingDrawingId(null);
                }}
              >
                Скасувати
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                onClick={handleCreateOrUpdateDrawing}
              >
                {editingDrawingId ? 'Зберегти' : 'Створити'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingManagement;