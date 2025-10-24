'use client';

import React, { useRef } from 'react';
import { Download, Upload, Save, FolderOpen } from 'lucide-react';

interface FileControlsProps {
  onSave: () => void;
  onLoad: (data: any) => void;
}

const FileControls: React.FC<FileControlsProps> = ({ onSave, onLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          onLoad(jsonData);
          alert('Graph loaded successfully!');
        } catch (error) {
          alert('Error loading file. Please make sure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FolderOpen className="w-5 h-5" />
        File Management
      </h3>
      
      <div className="space-y-3">
        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center gap-2"
        >
          <Save size={16} />
          Save Graph
        </button>

        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <Upload size={16} />
          Load Graph
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Instructions */}
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">Instructions:</p>
          <ul className="space-y-1">
            <li>• <strong>Save:</strong> Downloads your graph as a JSON file</li>
            <li>• <strong>Load:</strong> Upload a previously saved JSON file</li>
            <li>• Files are saved with timestamp in the filename</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileControls;
