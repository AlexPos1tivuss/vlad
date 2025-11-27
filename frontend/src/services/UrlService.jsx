import axios from "axios";
import { getToken, getAuthHeaders } from "./tokenService";

const REST_API_BASE_URL = import.meta.env.PROD 
    ? 'https://api.example.com/api'
    : 'http://localhost:8080/api';
const REST_API_AUTH_URL = REST_API_BASE_URL + '/auth';
const REST_API_ADMIN_URL = REST_API_BASE_URL + '/admin';
const REST_API_MANAGER_URL = REST_API_BASE_URL + '/manager';
const REST_API_USER_URL = REST_API_BASE_URL + '/user';
const REST_API_TASK_URL = REST_API_BASE_URL + '/task';
const REST_API_BONUS_URL = REST_API_BASE_URL + '/bonus';

export const authRegister = (user) => axios.post(REST_API_AUTH_URL + '/register', user);
export const authAuthenticate = (user) => axios.post(REST_API_AUTH_URL + '/authenticate', user);


export const getAllTasks = () => axios.get(REST_API_TASK_URL, {headers: getAuthHeaders()});
export const changeTaskAssignee = (taskId, newAssigneeId) => axios.put(REST_API_TASK_URL +'/changeAssignee/'+ taskId, {assigneeId : newAssigneeId}, {headers: getAuthHeaders()});
export const createTask = (task) => axios.post(REST_API_TASK_URL, task, {headers: getAuthHeaders()});
export const deleteTask = (taskId) => axios.delete(REST_API_TASK_URL + "/" + taskId, {headers: getAuthHeaders()});

export const getAllFreeUserTasks = () => axios.get(REST_API_USER_URL + '/tasks', {headers: getAuthHeaders()});
export const startTask = (taskId) => axios.put(REST_API_USER_URL + '/tasks/' + taskId, {}, {headers : getAuthHeaders()});
export const getAllUserTasks = () => axios.get(REST_API_USER_URL + '/tasks/user', {headers: getAuthHeaders()});
export const endTask = (taskId) => axios.put(REST_API_USER_URL + '/tasks/user/' + taskId, {}, {headers: getAuthHeaders()});

export const updateUser = (userId, user) => axios.put(REST_API_USER_URL + '/' + userId, user, {headers: getAuthHeaders()});
export const getUser = () => axios.get(REST_API_USER_URL, {headers: getAuthHeaders()});
export const getAllUsers = () => axios.get(REST_API_USER_URL + '/all', {headers: getAuthHeaders()});
export const deleteUser = (userId) => axios.delete(REST_API_USER_URL + '/' + userId, {headers: getAuthHeaders()});
export const changeRoleById = (userId) => axios.put(REST_API_USER_URL + '/role/' + userId, {headers: getAuthHeaders()});

export const getUsersWithManager = () => axios.get(REST_API_MANAGER_URL +'/workersWithManager', {headers: getAuthHeaders()});
export const getAllWorkers = () => axios.get(REST_API_MANAGER_URL + '/workers', {headers: getAuthHeaders()});
export const getAllManagers = () => axios.get(REST_API_MANAGER_URL + '/all', {headers: getAuthHeaders()});
export const changeManager = (userId, newManagerId) => axios.put(REST_API_MANAGER_URL +'/changeManager/'+ userId, { managerId: newManagerId }, {headers: getAuthHeaders()});
export const changeSalary = (userId, newSalary) => axios.put(REST_API_MANAGER_URL + '/updateSalary/'+ userId, {salary: newSalary}, {headers: getAuthHeaders()});
export const getCompletedSubTasks = () => axios.get(REST_API_TASK_URL + "/completed", {headers: getAuthHeaders()});

export const getBonusInfo = (userId) => axios.get(REST_API_BONUS_URL + "/" + userId, {headers: getAuthHeaders()});
export const awardBonus = (bonusData) => axios.post(REST_API_BONUS_URL + "/award", bonusData, {headers: getAuthHeaders()});
export const getAllUserBonuses = (userId) => axios.get(REST_API_BONUS_URL + "/" + userId + "/all", {headers: getAuthHeaders()});
export const getAllMyBonuses = () => axios.get(REST_API_BONUS_URL + "/all", {headers: getAuthHeaders()});
export const getAllManagerBonuses = () => axios.get(REST_API_BONUS_URL + "/given", {headers: getAuthHeaders()});