import { useEffect, useState } from "react";
import SideMenuComponent from "./SideMenuComponent";
import { getAllManagerBonuses } from "../services/UrlService";
import "../styles/output.css";

export default function ManagerBonusesComponent() {
  const [bonusesData, setBonusesData] = useState(null);
  const [modal, setModal] = useState({ show: false, bonus: null });

  const loadBonuses = async () => {
    try {
      const response = await getAllManagerBonuses();
      setBonusesData(response.data);
    } catch (error) {
      console.error("Ошибка загрузки списка премий:", error);
    }
  };

  useEffect(() => {
    loadBonuses();
  }, []);

  if (!bonusesData) {
    return (
      <div className="min-h-screen flex bg-[#FFF8F0] font-rubik p-6 gap-6">
        <div className="w-72">
          <SideMenuComponent />
        </div>
        <div className="flex-1 bg-white rounded-3xl shadow-lg p-6">
          Загружаем данные...
        </div>
      </div>
    );
  }

  const openModal = (bonus) => {
    setModal({ show: true, bonus });
  };

  return (
    <div className="min-h-screen flex bg-[#FFF8F0] font-rubik p-6 gap-6">

      <div className="w-72">
        <SideMenuComponent />
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Премии, начисленные менеджером: {bonusesData.fullName}
        </h2>

        <table className="min-w-full border-collapse">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Кому начислено</th>
              <th className="py-2 px-4 text-left">Задач выполнено</th>
              <th className="py-2 px-4 text-left">KPI</th>
              <th className="py-2 px-4 text-left">Премия (BYN)</th>
              <th className="py-2 px-4 text-left">Период</th>
              <th className="py-2 px-4 text-left">Дата выдачи</th>
            </tr>
          </thead>

          <tbody>
            {bonusesData.bonuses.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">

                <td className="py-2 px-4">{b.id}</td>

                <td className="py-2 px-4">
                  {b.employeeLastName} {b.employeeFirstName}
                </td>

                <td
                  className="py-2 px-4 cursor-pointer"
                  onClick={() => openModal(b)}
                >
                  {b.totalTasksCompleted}
                </td>

                <td className="py-2 px-4">{b.efficiencyRate}%</td>

                <td className="py-2 px-4">{b.bonusAmount}</td>

                <td className="py-2 px-4">
                  {new Date(b.calculationPeriod).toLocaleDateString()}
                </td>

                <td className="py-2 px-4">
                  {new Date(b.awardedAt).toLocaleString()}
                </td>

              </tr>
            ))}

            {bonusesData.bonuses.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Вы ещё никому не начисляли премии
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-1/3 relative">

            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setModal({ show: false, bonus: null })}
            >
              ✖
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center">
              Выполненные задачи по категориям
            </h3>

            <p><strong>Легкие:</strong> {modal.bonus.normalPriorityCount}</p>
            <p><strong>Средние:</strong> {modal.bonus.mediumPriorityCount}</p>
            <p><strong>Критические:</strong> {modal.bonus.criticalPriorityCount}</p>

          </div>
        </div>
      )}

    </div>
  );
}
