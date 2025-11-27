import { useEffect, useState } from "react";
import SideMenuComponent from "./SideMenuComponent";
import { getUsersWithManager, createTask } from "../services/UrlService";
import "../styles/output.css";

export default function CreateTaskComponent() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("EASY");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const response = await getUsersWithManager();
      setWorkers(response.data);
    } catch (e) {
      console.error("Ошибка загрузки работников:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setMessage("Введите заголовок задачи");
      return;
    }

    const safePriority = priority || "EASY";

    const body = {
      title: title.trim(),
      description: description.trim(),
      priority: safePriority,
      startDate: startDate || null,
      dueDate: dueDate || null,
      assigneeId: assigneeId || null,
    };

    try {
      await createTask(body);
      setMessage("Задача успешно создана!");

      // Очистка полей
      setTitle("");
      setDescription("");
      setPriority("EASY");
      setStartDate("");
      setDueDate("");
      setAssigneeId(null);
    } catch (error) {
      console.error("Ошибка создания задачи:", error);
      const serverMessage = error.response?.data || "Сервер вернул ошибку";
      setMessage("Ошибка при создании задачи: " + serverMessage);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FFF8F0] font-rubik p-6 gap-6">

      {/* Sidebar */}
      <div className="w-72">
        <SideMenuComponent />
      </div>

      {/* Centered form area */}
      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white rounded-3xl shadow-lg p-8 backdrop-blur-xl bg-opacity-80 w-[480px]">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
            Создание задачи
          </h2>

          <div className="grid grid-cols-1 gap-5">

            {/* Title */}
            <div>
              <label className="font-medium">Название задачи:</label>
              <input
                type="text"
                className="w-full mt-1 p-3 rounded-2xl border border-gray-300 bg-white/60 backdrop-blur-md
                           focus:ring-2 focus:ring-orange-400 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-medium">Описание:</label>
              <textarea
                className="w-full mt-1 p-3 rounded-2xl border border-gray-300 bg-white/60 backdrop-blur-md
                           h-24 resize-none focus:ring-2 focus:ring-orange-400 outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание задачи"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="font-medium">Приоритет:</label>
              <select
                className="w-full mt-1 p-3 rounded-2xl border bg-white/70 backdrop-blur-md
                           focus:ring-2 focus:ring-orange-400 outline-none"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="EASY">Легкий</option>
                <option value="MEDIUM">Средний</option>
                <option value="CRITICAL">Критический</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-medium">Начальная дата:</label>
                <input
                  type="date"
                  className="w-full mt-1 p-3 rounded-2xl border bg-white/70 backdrop-blur-md
                             focus:ring-2 focus:ring-orange-400 outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="font-medium">Дата сдачи:</label>
                <input
                  type="date"
                  className="w-full mt-1 p-3 rounded-2xl border bg-white/70 backdrop-blur-md
                             focus:ring-2 focus:ring-orange-400 outline-none"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="font-medium">Назначить исполнителя:</label>
              <select
                className="w-full mt-1 p-3 rounded-2xl border bg-white/70 backdrop-blur-md
                           focus:ring-2 focus:ring-orange-400 outline-none"
                value={assigneeId ?? ""}
                onChange={(e) =>
                  setAssigneeId(e.target.value === "" ? null : Number(e.target.value))
                }
              >
                <option value="">Не назначать</option>
                {!loading &&
                  workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.lastName} {w.firstName} ({w.position})
                    </option>
                  ))}
              </select>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="mt-2 bg-orange-500 hover:bg-orange-600 transition text-white
                         font-medium py-3 rounded-2xl shadow-lg"
            >
              Создать задачу
            </button>

            {/* Message */}
            {message && (
              <p className="text-center text-lg mt-2 text-gray-700">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
