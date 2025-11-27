import { useEffect, useState } from "react";
import SideMenuComponent from "./SideMenuComponent";
import { getUser, updateUser } from "../services/UrlService";
import { getUserRole } from "../services/tokenService";
import "../styles/output.css";

export default function SettingsComponent() {
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    position: "",
    password: "",
  });

  useEffect(() => {
    setRole(getUserRole());
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await getUser();
      const data = response.data;
      setUserData(data);
      setFormState({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        position: data.position || "",
        password: "",
      });
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(userData.id, formState);
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        const payload = JSON.parse(atob(response.data.token.split(".")[1]));
        localStorage.setItem("userRole", payload.role);
      }
      alert("Данные успешно обновлены!");
      fetchUser();
    } catch (error) {
      console.error("Ошибка при обновлении данных", error);
    }
  };

  if (!userData) return null;

  const isManagerOrAdmin = role === "MANAGER" || role === "ADMIN";
  const isAdmin = role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-rubik p-6 flex gap-6">
      {/* Боковое меню */}
      <div className="w-72">
        <SideMenuComponent />
      </div>

      {/* Рабочая зона */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Личная информация пользователя</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Логин */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Логин</label>
            <input
              type="text"
              value={userData.login}
              disabled
              className="w-full p-3 rounded-xl bg-gray-100 border border-gray-300"
            />
          </div>

          {/* Пароль */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Пароль</label>
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="Введите новый пароль"
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>

          {/* Имя */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Имя</label>
            <input
              type="text"
              name="firstName"
              value={formState.firstName}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>

          {/* Фамилия */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Фамилия</label>
            <input
              type="text"
              name="lastName"
              value={formState.lastName}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>

          {/* Почта */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Почта</label>
            <input
              type="email"
              value={userData.email}
              disabled
              className="w-full p-3 rounded-xl bg-gray-100 border border-gray-300"
            />
          </div>

          {/* Позиция */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Позиция</label>
            <input
              type="text"
              name="position"
              value={formState.position}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>

          {/* Оклад */}
          {!isAdmin && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Оклад (BYN)</label>
              <input
                type="text"
                value={userData.salary ?? "0"}
                disabled
                className="w-full p-3 rounded-xl bg-gray-100 border border-gray-300"
              />
            </div>
          )}

          {/* Руководитель */}
          {!isManagerOrAdmin && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Закреплен за руководителем</label>
              <input
                type="text"
                value={userData.managerFullName ?? "Не назначен"}
                disabled
                className="w-full p-3 rounded-xl bg-gray-100 border border-gray-300"
              />
            </div>
          )}

          {/* Статистика задач */}
          {!isAdmin && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Количество выполненных задач</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl text-center">
                  <div className="text-orange-500 font-bold">{userData.completedEasy ?? 0}</div>
                  <div className="text-sm text-gray-500">Лёгкие</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center">
                  <div className="text-orange-500 font-bold">{userData.completedMedium ?? 0}</div>
                  <div className="text-sm text-gray-500">Средней сложности</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center">
                  <div className="text-orange-500 font-bold">{userData.completedCritical ?? 0}</div>
                  <div className="text-sm text-gray-500">Критические</div>
                </div>
              </div>
            </div>
          )}

          {/* Премии */}
          {!isAdmin && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Количество полученных премий</h3>
              <div className="bg-gray-50 p-3 rounded-xl text-center text-orange-500 font-bold">
                {userData.totalBonusesReceived ?? 0}
              </div>
            </div>
          )}

          {/* Кнопка */}
          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--primary)] hover:bg-orange-600 text-white rounded-3xl font-semibold shadow-md transition-all duration-300"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
