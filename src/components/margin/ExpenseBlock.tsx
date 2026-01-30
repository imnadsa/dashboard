import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ServiceExpenses, CustomExpense } from '../../types/margin';
import { calculatePercent, calculateRubFromPercent, formatCurrency } from '../../lib/marginCalculations';

interface ExpenseBlockProps {
  expenses: ServiceExpenses;
  currentPrice: number;
  onUpdateExpenses: (expenses: ServiceExpenses) => void;
  isDark: boolean;
}

const ExpenseBlock: React.FC<ExpenseBlockProps> = ({
  expenses,
  currentPrice,
  onUpdateExpenses,
  isDark,
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomName, setNewCustomName] = useState('');

  // Обновить статический расход
  const updateStaticExpense = (
    field: 'doctorSalary' | 'materials' | 'acquiring',
    type: 'rub' | 'percent',
    value: number
  ) => {
    const newExpenses = { ...expenses };
    
    if (type === 'rub') {
      newExpenses[field].rub = value;
      newExpenses[field].percent = calculatePercent(value, currentPrice);
    } else {
      newExpenses[field].percent = value;
      newExpenses[field].rub = calculateRubFromPercent(value, currentPrice);
    }
    
    onUpdateExpenses(newExpenses);
  };

  // Добавить кастомный расход
  const addCustomExpense = () => {
    if (newCustomName.trim()) {
      const newCustom: CustomExpense = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newCustomName.trim(),
        rub: 0,
        percent: 0,
      };
      
      onUpdateExpenses({
        ...expenses,
        custom: [...expenses.custom, newCustom],
      });
      
      setNewCustomName('');
      setIsAddingCustom(false);
    }
  };

  // Обновить кастомный расход
  const updateCustomExpense = (id: string, type: 'rub' | 'percent', value: number) => {
    const newCustom = expenses.custom.map((item) => {
      if (item.id === id) {
        if (type === 'rub') {
          return {
            ...item,
            rub: value,
            percent: calculatePercent(value, currentPrice),
          };
        } else {
          return {
            ...item,
            percent: value,
            rub: calculateRubFromPercent(value, currentPrice),
          };
        }
      }
      return item;
    });
    
    onUpdateExpenses({ ...expenses, custom: newCustom });
  };

  // Удалить кастомный расход
  const deleteCustomExpense = (id: string) => {
    onUpdateExpenses({
      ...expenses,
      custom: expenses.custom.filter((item) => item.id !== id),
    });
  };

  // Общий итог расходов
  const totalExpenses = 
    expenses.doctorSalary.rub +
    expenses.materials.rub +
    expenses.acquiring.rub +
    expenses.custom.reduce((sum, item) => sum + item.rub, 0);

  return (
    <div className={`rounded-2xl border p-6 ${
      isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 rounded-full bg-rose-500" />
        <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          Расходная часть
        </h3>
      </div>

      <div className="space-y-4">
        {/* ЗП врача */}
        <ExpenseRow
          label="ЗП врача"
          rub={expenses.doctorSalary.rub}
          percent={expenses.doctorSalary.percent}
          onChangeRub={(val) => updateStaticExpense('doctorSalary', 'rub', val)}
          onChangePercent={(val) => updateStaticExpense('doctorSalary', 'percent', val)}
          isDark={isDark}
        />

        {/* Расходные материалы */}
        <ExpenseRow
          label="Расходные материалы"
          rub={expenses.materials.rub}
          percent={expenses.materials.percent}
          onChangeRub={(val) => updateStaticExpense('materials', 'rub', val)}
          onChangePercent={(val) => updateStaticExpense('materials', 'percent', val)}
          isDark={isDark}
        />

        {/* Эквайринг */}
        <ExpenseRow
          label="Эквайринг"
          rub={expenses.acquiring.rub}
          percent={expenses.acquiring.percent}
          onChangeRub={(val) => updateStaticExpense('acquiring', 'rub', val)}
          onChangePercent={(val) => updateStaticExpense('acquiring', 'percent', val)}
          isDark={isDark}
        />

        {/* Кастомные расходы */}
        {expenses.custom.map((customExpense) => (
          <ExpenseRow
            key={customExpense.id}
            label={customExpense.name}
            rub={customExpense.rub}
            percent={customExpense.percent}
            onChangeRub={(val) => updateCustomExpense(customExpense.id, 'rub', val)}
            onChangePercent={(val) => updateCustomExpense(customExpense.id, 'percent', val)}
            onDelete={() => deleteCustomExpense(customExpense.id)}
            isDark={isDark}
            isCustom
          />
        ))}

        {/* Форма добавления кастомного расхода */}
        {isAddingCustom ? (
          <div className={`p-3 rounded-xl border ${
            isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-slate-50 border-slate-200'
          }`}>
            <input
              type="text"
              value={newCustomName}
              onChange={(e) => setNewCustomName(e.target.value)}
              placeholder="Название категории"
              className={`w-full px-3 py-2 rounded-lg text-sm mb-2 ${
                isDark
                  ? 'bg-slate-600 text-slate-100 border-slate-500'
                  : 'bg-white text-slate-800 border-slate-300'
              } border focus:outline-none focus:ring-2 focus:ring-brand/30`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCustomExpense();
                if (e.key === 'Escape') {
                  setIsAddingCustom(false);
                  setNewCustomName('');
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={addCustomExpense}
                className="flex-1 px-3 py-2 bg-brand text-white rounded-lg text-xs font-semibold hover:bg-brand-600 transition-colors"
              >
                Добавить
              </button>
              <button
                onClick={() => {
                  setIsAddingCustom(false);
                  setNewCustomName('');
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
            onClick={() => setIsAddingCustom(true)}
            className={`w-full p-3 rounded-xl border-2 border-dashed transition-all ${
              isDark
                ? 'border-slate-600 hover:border-brand hover:bg-slate-700/30 text-slate-400 hover:text-brand'
                : 'border-slate-300 hover:border-brand hover:bg-brand/5 text-slate-500 hover:text-brand'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Plus size={16} />
              <span className="text-sm font-semibold">Добавить категорию</span>
            </div>
          </button>
        )}

        {/* Итого расходов */}
        <div className={`pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              ИТОГО РАСХОДОВ:
            </span>
            <span className={`text-lg font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {formatCurrency(totalExpenses)} ₽
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компонент строки расхода
interface ExpenseRowProps {
  label: string;
  rub: number;
  percent: number;
  onChangeRub: (value: number) => void;
  onChangePercent: (value: number) => void;
  onDelete?: () => void;
  isDark: boolean;
  isCustom?: boolean;
}

const ExpenseRow: React.FC<ExpenseRowProps> = ({
  label,
  rub,
  percent,
  onChangeRub,
  onChangePercent,
  onDelete,
  isDark,
  isCustom = false,
}) => {
  return (
    <div className={`p-3 rounded-xl ${
      isDark ? 'bg-slate-700/30' : 'bg-slate-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-semibold ${
          isDark ? 'text-slate-200' : 'text-slate-700'
        }`}>
          {label}
        </span>
        {isCustom && onDelete && (
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-rose-500/20 text-rose-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Рубли */}
        <div>
          <label className={`text-[10px] font-medium uppercase tracking-wider mb-1 block ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Рубли
          </label>
          <input
            type="number"
            value={rub || ''}
            onChange={(e) => onChangeRub(parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 rounded-lg text-sm ${
              isDark
                ? 'bg-slate-600 text-slate-100 border-slate-500'
                : 'bg-white text-slate-800 border-slate-300'
            } border focus:outline-none focus:ring-2 focus:ring-brand/30`}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>

        {/* Проценты */}
        <div>
          <label className={`text-[10px] font-medium uppercase tracking-wider mb-1 block ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Проценты
          </label>
          <input
            type="number"
            value={percent ? percent.toFixed(2) : ''}
            onChange={(e) => onChangePercent(parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 rounded-lg text-sm ${
              isDark
                ? 'bg-slate-600 text-slate-100 border-slate-500'
                : 'bg-white text-slate-800 border-slate-300'
            } border focus:outline-none focus:ring-2 focus:ring-brand/30`}
            placeholder="0"
            min="0"
            max="100"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseBlock;
