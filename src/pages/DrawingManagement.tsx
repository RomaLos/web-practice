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

  const handleAddDrawing = () => {
    if (projects.length === 0) return;
    const newDrawing: Drawing = {
      id: crypto.randomUUID(),
      name: `Drawing ${drawings.length + 1}`,
      projectId: projects[0].id,
    };
    setDrawings([...drawings, newDrawing]);
  };

  const handleDeleteDrawing = (id: string) => {
    setDrawings(drawings.filter((drawing) => drawing.id !== id));
  };

  const filteredDrawings = drawings.filter((drawing) =>
    drawing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Drawing Management</h1>
      <div className="flex mb-4 space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddDrawing}
        >
          + New drawing
        </button>
        <input
          type="text"
          className="p-2 border rounded w-full"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrawings.map((drawing) => (
          <div key={drawing.id} className="p-4 bg-white rounded shadow relative">
            <h2 className="text-xl font-semibold">{drawing.name}</h2>
            <p>Project: {projects.find((p) => p.id === drawing.projectId)?.name || 'Unknown'}</p>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => handleDeleteDrawing(drawing.id)}
            >
              ⋮
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrawingManagement;