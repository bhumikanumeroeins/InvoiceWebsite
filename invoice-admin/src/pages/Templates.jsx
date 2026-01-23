import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import img1 from '../assets/images/1.jpg';
import img2 from '../assets/images/2.jpg';
import img3 from '../assets/images/3.png';
import img4 from '../assets/images/4.jpg';
import img5 from '../assets/images/5.jpg';
import img6 from '../assets/images/6.jpg';

const Templates = () => {
  const templates = [
    { id: 1, name: 'Minimal', industry: 'Business', image: img1 },
    { id: 2, name: 'Corporate', industry: 'Corporate', image: img2 },
    { id: 3, name: 'Modern', industry: 'Design', image: img3 },
    { id: 4, name: 'Bold', industry: 'Marketing', image: img4 },
    { id: 5, name: 'GST', industry: 'Tax', image: img5 },
    { id: 6, name: 'Export', industry: 'International', image: img6 },
  ];

  const handleSelect = (template) => {
    // For now, just log the selection
    console.log('Selected template:', template.name);
    // In a real app, this would navigate to create invoice with the selected template
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Template Gallery</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{template.industry}</p>
                    <button
                      onClick={() => handleSelect(template)}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Templates;