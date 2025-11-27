import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole, isAuthenticated, logout } from "../services/tokenService";
import "../styles/output.css"

export default function SidebarMenu() {
  const [role, setRole] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setRole(getUserRole());
    setIsAuth(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const isAdmin = role === "ADMIN";
  const isManager = role === "MANAGER";
  const isUser = role === "USER";

  return (
    <div className="flex flex-col justify-between h-screen w-72 backdrop-blur-lg bg-white/30 text-gray-900 rounded-3xl p-6 font-rubik shadow-xl">

      {/* Верхнее меню */}
      <div className="flex flex-col space-y-3">

        {/* Личный кабинет */}
        <div>
          <button
            onClick={() => setOpenAccount(!openAccount)}
            className="w-full flex justify-between items-center px-5 py-3 rounded-2xl bg-white/20 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-md backdrop-blur-sm"
          >
            Личный кабинет
            <span className="text-xl">{openAccount ? "▲" : "▼"}</span>
          </button>
          {openAccount && (
            <div className="ml-6 mt-2 flex flex-col space-y-2">
              <Link
                to="/settings"
                className="px-4 py-2 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
              >
                Настройки
              </Link>

              {isUser && (
                <Link
                  to="/bonuses"
                  className="px-4 py-2 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  Премии
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Пользователи (admin) */}
        {isAdmin && (
          <Link
            to="/users"
            className="block px-5 py-3 rounded-2xl bg-white/20 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-md backdrop-blur-sm"
          >
            Пользователи
          </Link>
        )}

        {/* Подчиненные (manager) */}
        {isManager && (
          <Link
            to="/subordinates"
            className="block px-5 py-3 rounded-2xl bg-white/20 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-md backdrop-blur-sm"
          >
            Подчиненные
          </Link>
        )}

        {/* Сотрудники (manager) */}
        {isManager && (
          <Link
            to="/employees"
            className="block px-5 py-3 rounded-2xl bg-white/20 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-md backdrop-blur-sm"
          >
            Сотрудники
          </Link>
        )}

        {/* Задачи */}
        {(isUser || isManager) && (
          <div>
            <button
              onClick={() => setOpenTasks(!openTasks)}
              className="w-full flex justify-between items-center px-5 py-3 rounded-2xl bg-white/20 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-md backdrop-blur-sm"
            >
              Задачи
              <span className="text-xl">{openTasks ? "▲" : "▼"}</span>
            </button>

            {openTasks && (
              <div className="ml-6 mt-2 flex flex-col space-y-2">

                {/* Новый подпункт — Список всех задач */}
                {isManager && (
                  <Link
                    to="/tasks/all"
                    className="px-4 py-2 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
                  >
                    Список
                  </Link>
                )}

                {/* USER */}
                {isUser && (
                  <>
                    <Link
                      to="/tasks/unassigned"
                      className="px-4 py-2 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
                    >
                      Не занятые
                    </Link>
                    <Link
                      to="/tasks/my"
                      className="px-4 py-2 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
                    >
                      Мои задачи
                    </Link>
                  </>
                )}

                {/* MANAGER */}
                {isManager && (
                  <>
                    <Link
                      to="/tasks/pending"
                      className="px-4 py-2 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
                    >
                      Невыполненные
                    </Link>


                    <Link
                      to="/tasks/completed"
                      className="px-4 py-2 rounded-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
                    >
                      Выполненные
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Создать задачу */}
        {isManager && (
          <Link
            to="/tasks/create"
            className="block px-5 py-3 rounded-2xl bg-white/20 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-md backdrop-blur-sm"
          >
            Создать задачу
          </Link>
        )}

        {/* Премии manager */}
        {isManager && (
          <Link
            to="/users_bonuses"
            className="block px-5 py-3 rounded-2xl bg-white/20 hover:bg-[var(--primary)] hover:text-white transition-all duration-300 shadow-md backdrop-blur-sm"
          >
            Премии
          </Link>
        )}
      </div>

      {/* Выйти */}
      {isAuth && (
        <button
          onClick={handleLogout}
          className="w-full px-5 py-3 mt-6 rounded-3xl bg-[var(--primary)] hover:bg-orange-600 text-white font-semibold shadow-lg transition-all duration-300"
        >
          Выйти
        </button>
      )}
    </div>
  );
}
