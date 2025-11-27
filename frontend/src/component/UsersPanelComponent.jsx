import { useEffect, useState } from "react";
import SideMenuComponent from "./SideMenuComponent";
import { getAllUsers, deleteUser, changeRoleById } from "../services/UrlService";
import "../styles/output.css";

export default function UsersPanelComponent() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // количество пользователей на странице

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      // Исключаем админа
      const filtered = response.data.filter(user => user.role !== "ADMIN");
      setUsers(filtered);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Вы точно хотите удалить пользователя?")) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
    }
  };

  const handleChangeRole = async (userId) => {
    try {
      await changeRoleById(userId);
      fetchUsers();
    } catch (error) {
      console.error("Ошибка при смене роли:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Пагинация
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex bg-[#FFF8F0] font-rubik p-6 gap-6">
      {/* Боковое меню */}
      <div className="w-72">
        <SideMenuComponent />
      </div>

      {/* Таблица пользователей */}
      <div className="flex-1 bg-white rounded-3xl shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Панель пользователей</h2>

        {/* Таблица с фиксированной высотой */}
        <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[600px]">
          <table className="min-w-full border-collapse">
            <thead className="bg-orange-500 text-white rounded-t-xl">
              <tr>
                <th className="py-2 px-4 text-left rounded-tl-xl">ID</th>
                <th className="py-2 px-4 text-left">Логин</th>
                <th className="py-2 px-4 text-left">Полное имя</th>
                <th className="py-2 px-4 text-left">Позиция</th>
                <th className="py-2 px-4 text-left">Руководитель</th>
                <th className="py-2 px-4 text-left">Роль</th>
                <th className="py-2 px-4 text-left rounded-tr-xl">Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{user.id}</td>
                  <td className="py-2 px-4">{user.login}</td>
                  <td className="py-2 px-4">{user.lastName} {user.firstName}</td>
                  <td className="py-2 px-4">{user.position}</td>
                  <td className="py-2 px-4">{user.manager ? `${user.manager.lastName} ${user.manager.firstName}` : "Не назначен"}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                      onClick={() => handleChangeRole(user.id)}
                    >
                      Изменить роль
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                      onClick={() => handleDelete(user.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    Нет пользователей
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2 text-gray-700">
            <button
              className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &#8592;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`px-3 py-1 rounded-xl ${page === currentPage ? "bg-orange-500 text-white" : "bg-gray-200 hover:bg-gray-300"} transition`}
                onClick={() => paginate(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="px-3 py-1 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &#8594;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
