import React, { useState } from 'react';
import { X } from 'lucide-react';

interface StartTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
}

export default function StartTripModal({ isOpen, onClose, onConfirm }: StartTripModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-white w-full sm:w-96 rounded-t-3xl sm:rounded-3xl p-6 relative z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-6">选择出发时间</h2>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-2xl mb-6"
        />
        <button 
          onClick={() => onConfirm(date)}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold"
        >
          确定出发
        </button>
      </div>
    </div>
  );
}
