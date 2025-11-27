import { useEffect, useState } from "react";
import SideMenuComponent from "./SideMenuComponent";
import { getAllTasks, getUsersWithManager, changeTaskAssignee } from "../services/UrlService";
import "../styles/output.css";

export default function AllTasksComponent() {
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  const statusMap = {
    OPEN: "Открыта",
    IN_PROGRESS: "В работе",
    COMPLETED: "Выполнена"
  };

  const priorityMap = {
    EASY: "Легкий",
    MEDIUM: "Средний",
    CRITICAL: "Критический"
  };

  const fetchTasks = async () => {
    try {
      const response = await getAllTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Ошибка загрузки задач:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await getUsersWithManager();
      setWorkers(response.data);
    } catch (error) {
      console.error("Ошибка загрузки работников:", error);
    }
  };

  const handleAssigneeChange = async (taskId, newAssigneeId) => {
    try {
      await changeTaskAssignee(taskId, newAssigneeId);
      fetchTasks();
    } catch (error) {
      console.error("Ошибка смены исполнителя:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchWorkers();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#FFF8F0] font-rubik p-6 gap-6">

      {/* Sidebar */}
      <div className="w-72">
        <SideMenuComponent />
      </div>

      {/* Main */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Все задачи</h2>

        <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[600px]">
          <table className="min-w-full border-collapse">
            <thead className="bg-orange-500 text-white rounded-t-xl">
              <tr>
                <th className="py-2 px-4 text-left rounded-tl-xl w-12">ID</th>
                <th className="py-2 px-4 text-left w-48">Исполнитель</th>
                <th className="py-2 px-4 text-left w-56">Название</th>
                <th className="py-2 px-4 text-left w-32">Приоритет</th>
                <th className="py-2 px-4 text-left w-40">Сроки</th>
                <th className="py-2 px-4 text-left rounded-tr-xl w-32">Статус</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{task.id}</td>

                  {/* Assignee select */}
                  <td className="py-2 px-4">
                    <select
                      value={task.assigneeId ?? ""}
                      onChange={(e) =>
                        handleAssigneeChange(
                          task.id,
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="border rounded-xl px-2 py-1 w-full"
                    >
                      <option value="">Не назначен</option>
                      {workers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.lastName} {w.firstName} ({w.position})
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Task title */}
                  <td
                    className="py-2 px-4 text-600 cursor-pointer truncate"
                    onClick={() => setCurrentTask(task)}
                    title={task.title}
                  >
                    {task.title}
                  </td>

                  <td className="py-2 px-4">{priorityMap[task.priority]}</td>
                  <td className="py-2 px-4 truncate">{task.startDate} - {task.dueDate}</td>
                  <td className="py-2 px-4">{statusMap[task.status]}</td>
                </tr>
              ))}

              {tasks.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Нет данных
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for task info */}
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
              <p className="mb-2"><strong>Исполнитель:</strong> {currentTask.assigneeName}</p>
              <p className="mb-2"><strong>Приоритет:</strong> {priorityMap[currentTask.priority]}</p>
              <p className="mb-2"><strong>Статус:</strong> {statusMap[currentTask.status]}</p>
              <p className="mb-2"><strong>Сроки:</strong> {currentTask.startDate} - {currentTask.dueDate}</p>
              {currentTask.completedDate && (
                <p className="mb-2"><strong>Дата выполнения:</strong> {currentTask.completedDate}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
