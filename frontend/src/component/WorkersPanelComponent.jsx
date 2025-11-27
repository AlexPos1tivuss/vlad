import { useEffect, useState } from "react";
import SideMenuComponent from "./SideMenuComponent";
import { getAllWorkers, getAllManagers, changeManager } from "../services/UrlService";
import "../styles/output.css";

export default function WorkersPanelComponent() {
  const [workers, setWorkers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [workersPerPage] = useState(10);

  const fetchWorkers = async () => {
    try {
      const response = await getAllWorkers();
      setWorkers(response.data);
      console.log("Workers API response:", response.data); // <- add this
    } catch (error) {
      console.error("Ошибка загрузки работников:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await getAllManagers();
      setManagers(response.data);
    } catch (error) {
      console.error("Ошибка загрузки менеджеров:", error);
    }
  };

  useEffect(() => {
    fetchWorkers();
    fetchManagers();
  }, []);

  // Pagination
  const indexOfLast = currentPage * workersPerPage;
  const indexOfFirst = indexOfLast - workersPerPage;
  const currentWorkers = workers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(workers.length / workersPerPage);

  const handleManagerChange = async (userId, newManagerId) => {
    try {
        console.log(newManagerId);
      await changeManager(userId, newManagerId);
      fetchWorkers(); 
    } catch (error) {
      console.error("Ошибка смены менеджера:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FFF8F0] font-rubik p-6 gap-6">
      
      {/* Sidebar */}
      <div className="w-72">
        <SideMenuComponent />
      </div>

      {/* Main */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Сотрудники</h2>

        <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[600px]">
          <table className="min-w-full border-collapse">
            <thead className="bg-orange-500 text-white rounded-t-xl">
              <tr>
                <th className="py-2 px-4 text-left rounded-tl-xl">ID</th>
                <th className="py-2 px-4 text-left">Логин</th>
                <th className="py-2 px-4 text-left">Полное имя</th>
                <th className="py-2 px-4 text-left">Позиция</th>
                <th className="py-2 px-4 text-left">Оклад</th>
                <th className="py-2 px-4 text-left">Менеджер</th>
                <th className="py-2 px-4 text-left rounded-tr-xl">Вып. задачи (месяц)</th>
              </tr>
            </thead>

            <tbody>
              {currentWorkers.map(w => (
                <tr key={w.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{w.id}</td>
                  <td className="py-2 px-4">{w.login}</td>
                  <td className="py-2 px-4">{w.lastName} {w.firstName}</td>
                  <td className="py-2 px-4">{w.position}</td>
                  <td className="py-2 px-4">
                    {w.salary ? `${w.salary} BYN` : "Не установлен"}
                  </td>

                  {/* Manager dropdown */}
                  <td className="py-2 px-4">
                    <select
                      className="border rounded-xl px-3 py-1 bg-white cursor-pointer hover:border-orange-400 transition 
                                 focus:outline-none focus:ring-2 focus:ring-orange-300"
                      value={w.manager ? w.manager.id : ""}
                      onChange={(e) => handleManagerChange(w.id, e.target.value)}
                    >
                      {!w.manager && (
                        <option value="">Не назначен</option>
                      )}
                      

                      {managers
                        .filter(m => m.id !== w.id)
                        .map(m => (
                          <option
                            key={m.id}
                            value={m.id}
                            className="hover:bg-orange-100 hover:text-orange-600 rounded-xl"
                          >
                            {m.lastName} {m.firstName}
                          </option>
                        ))}
                    </select>
                  </td>

                  {/* Completed tasks count placeholder */}
                  <td className="py-2 px-4">{w.completedTasksThisMonth ?? 0}</td>
                </tr>
              ))}

              {currentWorkers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Нет данных
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2 text-gray-700">
            <button
              className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded-xl ${
                  page === currentPage
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                } transition`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
