import * as XLSX from 'xlsx';
import { MarginService } from '../types/margin';
import { calculateMargin, formatCurrency, formatPercent } from './marginCalculations';

export const exportServicesToExcel = (services: MarginService[]) => {
  // Подготавливаем данные для экспорта
  const data = services.map((service) => {
    const calculation = calculateMargin(service.currentPrice, service.expenses, 55); // Используем 55% как целевую маржу по умолчанию
    
    return {
      'Наименование': service.name,
      'Текущая стоимость (₽)': formatCurrency(service.currentPrice),
      'Общие расходы (₽)': formatCurrency(calculation.totalExpenses),
      'Текущая маржа (₽)': formatCurrency(calculation.currentProfit),
      'Текущая маржа (%)': formatPercent(calculation.currentMarginPercent),
      'Рекомендуемая стоимость (₽)': formatCurrency(calculation.recommendedPrice),
      'ЗП врача (₽)': formatCurrency(service.expenses.doctorSalary.rub),
      'ЗП врача (%)': formatPercent(service.expenses.doctorSalary.percent),
      'Расходники (₽)': formatCurrency(service.expenses.materials.rub),
      'Расходники (%)': formatPercent(service.expenses.materials.percent),
      'Эквайринг (₽)': formatCurrency(service.expenses.acquiring.rub),
      'Эквайринг (%)': formatPercent(service.expenses.acquiring.percent),
    };
  });

  // Создаём workbook и worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Услуги');

  // Устанавливаем ширину колонок
  const columnWidths = [
    { wch: 30 }, // Наименование
    { wch: 20 }, // Текущая стоимость
    { wch: 18 }, // Общие расходы
    { wch: 18 }, // Текущая маржа (₽)
    { wch: 18 }, // Текущая маржа (%)
    { wch: 25 }, // Рекомендуемая стоимость
    { wch: 15 }, // ЗП врача (₽)
    { wch: 15 }, // ЗП врача (%)
    { wch: 15 }, // Расходники (₽)
    { wch: 15 }, // Расходники (%)
    { wch: 15 }, // Эквайринг (₽)
    { wch: 15 }, // Эквайринг (%)
  ];
  worksheet['!cols'] = columnWidths;

  // Генерируем имя файла с датой
  const date = new Date().toISOString().split('T')[0];
  const filename = `Калькулятор_маржи_${date}.xlsx`;

  // Скачиваем файл
  XLSX.writeFile(workbook, filename);
};
