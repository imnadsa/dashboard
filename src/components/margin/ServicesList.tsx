import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { MarginService } from '../../types/margin';

interface ServicesListProps {
  services: MarginService[];
  selectedServiceId: string | null;
  onSelectService: (id: string) => void;
  onCreateService: (name: string) => void;
  onUpdateService: (id: string, updates: Partial<MarginService>) => void;
  onDeleteService: (id: string) => void;
  isDark: boolean;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  selectedServiceId,
  onSelectService,
  onCreateService,
  onUpdateService,
  onDeleteService,
  isDark,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = () => {
    if (newServiceName.trim()) {
      onCreateService(newServiceName.trim());
      setNewServiceName('');
      setIsAdding(false);
    }
  };

  const handleEdit = (service: MarginService) => {
    setEditingId(service.id);
    setEditingName(service.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onUpdateService(editingId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className={`w-full lg:w-80 h-full flex flex-col rounded-2xl border ${
      isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      {/* Заголовок */}
      <div className="p-6 border-b border-slate-700/50">
        <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          📋 Мои услуги
        </h2>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {services.length} {services.length === 1 ? 'услуга' : 'услуг'}
        </p>
      </div>

      {/* Список услуг */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {services.map((service) => (
          <div
            key={service.id}
            className={`group p-3 rounded-xl transition-all cursor-pointer ${
              selectedServiceId === service.id
                ? isDark
                  ? 'bg-brand/20 border-brand/50'
                  : 'bg-brand/10 border-brand/30'
                : isDark
                  ? 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
            } border`}
            onClick={() => onSelectService(service.id)}
          >
            {editingId === service.id ? (
              // Режим редактирования
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className={`flex-1 px-2 py-1 rounded text-sm ${
                    isDark
                      ? 'bg-slate-600 text-slate-100 border-slate-500'
                      : 'bg-white text-slate-800 border-slate-300'
                  } border focus:outline-none focus:ring-2 focus:ring-brand/30`}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 rounded hover:bg-emerald-500/20 text-emerald-500"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 rounded hover:bg-rose-500/20 text-rose-500"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              // Обычный режим
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  {service.name}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(service);
                    }}
                    className="p-1 rounded hover:bg-brand/20 text-brand"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Удалить услугу "${service.name}"?`)) {
                        onDeleteService(service.id);
                      }
                    }}
                    className="p-1 rounded hover:bg-rose-500/20 text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Форма добавления новой услуги */}
        {isAdding ? (
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'
          }`}>
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Название услуги"
              className={`w-full px-3 py-2 rounded-lg text-sm mb-2 ${
                isDark
                  ? 'bg-slate-600 text-slate-100 border-slate-500'
                  : 'bg-white text-slate-800 border-slate-300'
              } border focus:outline-none focus:ring-2 focus:ring-brand/30`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') {
                  setIsAdding(false);
                  setNewServiceName('');
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 px-3 py-2 bg-brand text-white rounded-lg text-xs font-semibold hover:bg-brand-600 transition-colors"
              >
                Добавить
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewServiceName('');
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isDark
                    ? 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className={`w-full p-3 rounded-xl border-2 border-dashed transition-all ${
              isDark
                ? 'border-slate-600 hover:border-brand hover:bg-slate-700/30 text-slate-400 hover:text-brand'
                : 'border-slate-300 hover:border-brand hover:bg-brand/5 text-slate-500 hover:text-brand'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus size={18} />
              <span className="text-sm font-semibold">Добавить услугу</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default ServicesList;
