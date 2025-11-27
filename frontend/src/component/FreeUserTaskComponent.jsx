import { useEffect, useState } from "react";
import SideMenuComponent from "./SideMenuComponent";
import { getAllFreeUserTasks, startTask } from "../services/UrlService";
import "../styles/output.css";

export default function FreeTasksComponent() {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  const priorityMap = {
    EASY: "Лёгкий",
    MEDIUM: "Средний",
    CRITICAL: "Критический"
  };

  const fetchTasks = async () => {
    try {
      const response = await getAllFreeUserTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Ошибка загрузки задач:", error);
    }
  };

  const handleStart = async (taskId) => {
    if (!window.confirm("Вы точно хотите начать выполнение этой задачи?")) return;
    try {
      await startTask(taskId);
      alert("Задача успешно назначена!");
      fetchTasks();
    } catch (error) {
      console.error("Ошибка при назначении задачи:", error);
      alert("Не удалось начать задачу");
    }
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

      {/* Main content */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Свободные задачи</h2>

        <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[600px]">
          <table className="min-w-full border-collapse">
            <thead className="bg-orange-500 text-white rounded-t-xl">
              <tr>
                <th className="py-2 px-4 text-left w-12">ID</th>
                <th className="py-2 px-4 text-left w-48">Название</th>
                <th className="py-2 px-4 text-left w-56">Описание</th>
                <th className="py-2 px-4 text-left w-32">Приоритет</th>
                <th className="py-2 px-4 text-left w-48">Сроки</th>
                <th className="py-2 px-4 text-left rounded-tr-xl w-32">Действие</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{task.id}</td>

                  {/* Task title */}
                  <td
                    className="py-2 px-4 cursor-pointer text-left truncate"
                    onClick={() => setCurrentTask(task)}
                    title={task.title}
                  >
                    {task.title}
                  </td>

                  {/* Task description in table */}
                  <td className="py-2 px-4 truncate" title={task.description}>
                    {task.description}
                  </td>

                  <td className="py-2 px-4">{priorityMap[task.priority]}</td>

                  <td className="py-2 px-4 truncate">
                    {task.startDate} - {task.dueDate}
                  </td>

                  <td className="py-2 px-4">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
                      onClick={() => handleStart(task.id)}
                    >
                      Начать
                    </button>
                  </td>
                </tr>
              ))}

              {tasks.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    Нет свободных задач
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for full task info */}
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
              <p className="mb-2"><strong>Исполнитель:</strong> {currentTask.assigneeName ?? "Не назначен"}</p>
              <p className="mb-2"><strong>Приоритет:</strong> {priorityMap[currentTask.priority]}</p>
              <p className="mb-2"><strong>Сроки:</strong> {currentTask.startDate} - {currentTask.dueDate}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
