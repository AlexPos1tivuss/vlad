import { useEffect, useState } from "react";
import SideMenuComponent from "./SideMenuComponent";
import { getCompletedSubTasks } from "../services/UrlService";
import * as XLSX from "xlsx";
import "../styles/output.css";

export default function CompletedTasksComponent() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  const priorityMap = {
    EASY: "Лёгкий",
    MEDIUM: "Средний",
    CRITICAL: "Критический",
  };

  const statusMap = {
    COMPLETED: "Завершена",
    IN_PROGRESS: "В работе",
    OPEN: "Открыта"
  };

  const fetchTasks = async () => {
    try {
      const response = await getCompletedSubTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Ошибка загрузки завершённых задач:", error);
    }
  };

  // Excel export
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      tasks.map((t) => ({
        ID: t.id,
        Сотрудник: t.assigneeName,
        Название: t.title,
        Описание: t.description,
        "Дата начала": t.startDate,
        "Дата окончания": t.dueDate,
        "Дата сдачи": t.completedDate,
        Статус: statusMap[t.status],
        Приоритет: priorityMap[t.priority],
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CompletedTasks");
    XLSX.writeFile(wb, "completed_tasks.xlsx");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#FFF8F0] font-rubik p-6 gap-6">

      {/* Sidebar */}
      <div className="w-72">
        <SideMenuComponent />
      </div>

      {/* Main */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 flex flex-col">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Выполненные задачи</h2>

          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
          >
            Скачать Excel
          </button>
        </div>

        <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[600px]">
          <table className="min-w-full border-collapse">
            <thead className="bg-orange-500 text-white rounded-t-xl">
              <tr>
                <th className="py-2 px-4 text-left w-12 rounded-tl-xl">ID</th>
                <th className="py-2 px-4 text-left w-48">Сотрудник</th>
                <th className="py-2 px-4 text-left w-56">Название</th>
                <th className="py-2 px-4 text-left w-40">Сроки</th>
                <th className="py-2 px-4 text-left w-32">Дата сдачи</th>
                <th className="py-2 px-4 text-left w-32 rounded-tr-xl">Статус</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">

                  <td className="py-2 px-4">{task.id}</td>

                  <td className="py-2 px-4">{task.assigneeName}</td>

                  <td
                    className="py-2 px-4 cursor-pointer truncate font-medium"
                    onClick={() => setCurrentTask(task)}
                    title={task.title}
                  >
                    {task.title}
                  </td>

                  <td className="py-2 px-4 truncate">
                    {task.startDate} - {task.dueDate}
                  </td>

                  <td className="py-2 px-4">{task.completedDate}</td>

                  <td className="py-2 px-4">
                    {statusMap[task.status]}
                  </td>

                </tr>
              ))}

              {tasks.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Нет завершённых задач
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal window */}
        {currentTask && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-2/5 relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                onClick={() => setCurrentTask(null)}
              >
                ✖
              </button>

              <h3 className="text-xl font-semibold mb-4">{currentTask.title}</h3>

              <p className="mb-2"><strong>Описание:</strong> {currentTask.description}</p>
              <p className="mb-2"><strong>Сотрудник:</strong> {currentTask.assigneeName}</p>
              <p className="mb-2"><strong>Приоритет:</strong> {priorityMap[currentTask.priority]}</p>
              <p className="mb-2"><strong>Сроки:</strong> {currentTask.startDate} - {currentTask.dueDate}</p>
              <p className="mb-2"><strong>Дата сдачи:</strong> {currentTask.completedDate}</p>
              <p className="mb-2"><strong>Статус:</strong> {statusMap[currentTask.status]}</p>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
