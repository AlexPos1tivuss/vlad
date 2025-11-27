import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenuComponent from "./SideMenuComponent";
import { getUsersWithManager, changeSalary, getBonusInfo, awardBonus } from "../services/UrlService";
import "../styles/output.css";

export default function SubordinatesComponent() {
  const [workers, setWorkers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage] = useState(10);
  const [currentWorker, setCurrentWorker] = useState(null);

  const navigate = useNavigate();
  const [planValueInput, setPlanValueInput] = useState("0");
  const [coefInput, setCoefInput] = useState("1");
  const [planValue, setPlanValue] = useState(0);
  const [coef, setCoef] = useState(1);
  const [efficiencyRate, setEfficiencyRate] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);

  const fetchWorkers = async () => {
    try {
      const response = await getUsersWithManager();
      setWorkers(response.data);
    } catch (error) {
      console.error("Ошибка загрузки работников:", error);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSalaryChange = async (userId, newSalary) => {
    try {
      await changeSalary(userId, newSalary);
      fetchWorkers();
    } catch (error) {
      console.error("Ошибка обновления зарплаты:", error);
    }
  };

  const indexOfLast = currentPage * workersPerPage;
  const indexOfFirst = indexOfLast - workersPerPage;
  const currentWorkers = workers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(workers.length / workersPerPage);

  const openBonusModal = async (worker) => {
    try {
      const response = await getBonusInfo(worker.id);
      setCurrentWorker(response.data);

      const lastPlan = response.data.lastPlanValue ?? 0;
      setPlanValue(lastPlan);
      setPlanValueInput(lastPlan.toString());

      setCoef(1);
      setCoefInput("1");

      calculateEfficiency(response.data, lastPlan, 1);
    } catch (error) {
      console.error("Ошибка загрузки информации о премии:", error);
    }
  };

  const calculateEfficiency = (workerData, plan, coefValue) => {
    if (!plan) {
      setEfficiencyRate(0);
      setBonusAmount(0);
      return;
    }
    const eff = ((workerData.normal * 1.0 + workerData.medium * 1.5 + workerData.critical * 2.0) / plan) * 100;
    setEfficiencyRate(eff.toFixed(2));
    const bonus = (workerData.salary / 100) * eff * coefValue;
    setBonusAmount(bonus.toFixed(2));
  };

  const handlePlanBlur = () => {
    const value = parseFloat(planValueInput);
    if (!isNaN(value) && value >= 0) {
      setPlanValue(value);
      calculateEfficiency(currentWorker, value, coef);
    } else {
      setPlanValueInput(planValue.toString());
      alert("Введите корректное число для планового показателя (>=0)!");
    }
  };

  const handleCoefBlur = () => {
    const value = parseFloat(coefInput);
    if (!isNaN(value) && value >= 0 && value <= 1.5) {
      setCoef(value);
      calculateEfficiency(currentWorker, planValue, value);
    } else {
      setCoefInput(coef.toString());
      alert("Коэффициент должен быть в диапазоне 0–1.5!");
    }
  };

  const handleAwardBonus = async () => {
    try {
      await awardBonus({
        employeeId: currentWorker.userId,
        normal: currentWorker.normal,
        medium: currentWorker.medium,
        critical: currentWorker.critical,
        planValue,
        coef,
        efficiencyRate,
        bonusAmount,
      });
      alert("Премия успешно назначена!");
      setCurrentWorker(null);
      fetchWorkers();
    } catch (error) {
      console.error("Ошибка назначения премии:", error);
      alert("Ошибка назначения премии");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FFF8F0] font-rubik p-6 gap-6">
      <div className="w-72">
        <SideMenuComponent />
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Работники под управлением</h2>

        <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[600px]">
          <table className="min-w-full border-collapse">
            <thead className="bg-orange-500 text-white rounded-t-xl">
              <tr>
                <th className="py-2 px-4 text-left rounded-tl-xl">ID</th>
                <th className="py-2 px-4 text-left">Логин</th>
                <th className="py-2 px-4 text-left">Полное имя</th>
                <th className="py-2 px-4 text-left">Позиция</th>
                <th className="py-2 px-4 text-left">Оклад</th>
                <th className="py-2 px-4 text-left">Выполнено задач (все время)</th>
                <th className="py-2 px-4 text-left">Выполнено задач (месяц)</th>
                <th className="py-2 px-4 text-left">Начислено премий</th>
                <th className="py-2 px-4 text-left rounded-tr-xl">Действие</th>
              </tr>
            </thead>

            <tbody>
              {currentWorkers.map(w => (
                <tr key={w.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{w.id}</td>
                  <td className="py-2 px-4">{w.login}</td>
                  <td
                    className="py-2 px-4 cursor-pointer"
                    onClick={() => navigate(`/bonuses/${w.id}`)}
                  >
                    {w.lastName} {w.firstName}
                  </td>

                  <td className="py-2 px-4">{w.position}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      defaultValue={w.salary ?? 0}
                      className="border rounded-xl px-3 py-1 w-24 text-right"
                      onBlur={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) handleSalaryChange(w.id, value);
                        else { e.target.value = w.salary ?? 0; alert("Введите корректное число!"); }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value)) handleSalaryChange(w.id, value);
                          else { e.target.value = w.salary ?? 0; alert("Введите корректное число!"); }
                        }
                      }}
                    />
                  </td>
                  <td className="py-2 px-4">{w.completedTasksAllTime ?? 0}</td>
                  <td className="py-2 px-4">{w.completedTasksThisMonth ?? 0}</td>
                  <td className="py-2 px-4">{w.bonusesCount ?? 0}</td>
                  <td className="py-2 px-4">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                      onClick={() => openBonusModal(w)}
                    >
                      Рассчитать премию
                    </button>
                  </td>
                </tr>
              ))}
              {currentWorkers.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">Нет данных</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2 text-gray-700">
            <button className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}>←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} className={`px-3 py-1 rounded-xl ${page === currentPage ? "bg-orange-500 text-white" : "bg-gray-200 hover:bg-gray-300"} transition`}
                onClick={() => setCurrentPage(page)}>{page}</button>
            ))}
            <button className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}>→</button>
          </div>
        )}

        {/* Modal */}
        {currentWorker && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-2/5 relative">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={() => setCurrentWorker(null)}>✖</button>
              <h3 className="text-xl font-semibold mb-4">{currentWorker.fullName}</h3>
              <p><strong>Позиция:</strong> {currentWorker.position}</p>
              <p><strong>Оклад:</strong> {currentWorker.salary}</p>
              <p><strong>Задачи за месяц:</strong> Легкий: {currentWorker.normal}, Средний: {currentWorker.medium}, Критический: {currentWorker.critical}</p>
              {currentWorker.lastAwardPeriod && <p><strong>Последняя премия:</strong> {currentWorker.lastAwardPeriod}, выдана {new Date(currentWorker.lastAwardDate).toLocaleDateString()}</p>}

              <div className="flex flex-col gap-2 mt-4">
                <label>
                  Плановый показатель:
                  <input type="number" value={planValueInput} onChange={e => setPlanValueInput(e.target.value)}
                    onBlur={handlePlanBlur} onKeyDown={e => e.key === "Enter" && handlePlanBlur()}
                    className="border rounded-xl px-2 py-1 w-full"/>
                </label>
                <label>
                  Корректирующий коэффициент (0-1.5):
                  <input type="number" step="0.01" min="0" max="1.5" value={coefInput} onChange={e => setCoefInput(e.target.value)}
                    onBlur={handleCoefBlur} onKeyDown={e => e.key === "Enter" && handleCoefBlur()}
                    className="border rounded-xl px-2 py-1 w-full"/>
                </label>
              </div>

              <p className="mt-2"><strong>KPI:</strong> {efficiencyRate}%</p>
              <p><strong>Размер премии:</strong> {bonusAmount}</p>

              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                onClick={handleAwardBonus}>
                Назначить премию
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
