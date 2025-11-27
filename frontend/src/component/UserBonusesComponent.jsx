import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideMenuComponent from "./SideMenuComponent";
import {getAllUserBonuses} from "../services/UrlService";
import * as XLSX from "xlsx";
import "../styles/output.css";

export default function UserBonusesComponent() {
    const { userId } = useParams();

    console.log(userId);
  const [data, setData] = useState(null);
  const [taskModal, setTaskModal] = useState({ show: false, bonus: null });

  useEffect(() => {
    loadBonuses();
  }, [userId]);

  const loadBonuses = async () => {
    try {
      const res = await getAllUserBonuses(userId);
      setData(res.data);
    } catch (e) {
      console.error("Ошибка загрузки списка премий:", e);
    }
  };

  const openTaskModal = (bonus) => {
    setTaskModal({ show: true, bonus });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.bonuses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bonuses");
    XLSX.writeFile(workbook, `bonuses_user_${data.userId}.xlsx`);
  };

  if (!data) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen flex bg-[#FFF8F0] font-rubik p-6 gap-6">

      {/* Sidebar */}
      <div className="w-72">
        <SideMenuComponent />
      </div>

      {/* Main */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            Премии сотрудника — {data.fullName} ({data.position})
          </h2>

          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-500 rounded-xl text-white hover:bg-green-600 transition"
          >
            Экспорт в Excel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[600px]">
          <table className="min-w-full border-collapse">
            <thead className="bg-orange-500 text-white rounded-t-xl">
              <tr>
                <th className="py-2 px-4 text-left rounded-tl-xl">ID</th>
                <th className="py-2 px-4 text-left">Кем начислено</th>
                <th className="py-2 px-4 text-left">Оклад (BYN)</th>
                <th className="py-2 px-4 text-left">Выполнено задач</th>
                <th className="py-2 px-4 text-left">KPI</th>
                <th className="py-2 px-4 text-left">Сумма (BYN)</th>
                <th className="py-2 px-4 text-left">Период</th>
                <th className="py-2 px-4 text-left rounded-tr-xl">Дата</th>
              </tr>
            </thead>

            <tbody>
              {data.bonuses.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{b.id}</td>
                  <td className="py-2 px-4">{b.managerFullName}</td>
                  <td className="py-2 px-4">{b.employeeSalary}</td>

                  <td
                    className="py-2 px-4 cursor-pointer"
                    onClick={() => openTaskModal(b)}
                  >
                    {b.totalTasksCompleted}
                  </td>

                  <td className="py-2 px-4">{b.efficiencyRate}</td>
                  <td className="py-2 px-4">{b.bonusAmount}</td>
                  <td className="py-2 px-4">{b.calculationPeriod}</td>
                  <td className="py-2 px-4">
                    {new Date(b.awardedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* No Data */}
        {data.bonuses.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Нет начисленных премий
          </div>
        )}

        {/* Modal */}
        {taskModal.show && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-1/3 relative">

              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                onClick={() => setTaskModal({ show: false, bonus: null })}
              >
                ✖
              </button>

              <h3 className="text-xl font-semibold mb-4">
                Выполненные задачи по категориям
              </h3>

              <p><strong>Легкие:</strong> {taskModal.bonus.normalPriorityCount}</p>
              <p><strong>Средние:</strong> {taskModal.bonus.mediumPriorityCount}</p>
              <p><strong>Критические:</strong> {taskModal.bonus.criticalPriorityCount}</p>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
