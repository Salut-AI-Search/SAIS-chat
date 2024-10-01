import { UserCreate } from '../api';
import useApi from './useApi';

const useUsers = () => {
  const api = useApi();

  const createUser = async (params: UserCreate) => {
    return await api.createUserUsersPost(params);
  };

  const getUser = async (id: number) => {
    return await api.readUserUsersUserIdGet(id);
  };

  const updateUser = async (id: number, params: UserCreate) => {
    return await api.updateUserUsersUserIdPut(id, params);
  };

  const deleteUser = async (id: number) => {
    return await api.deleteUserUsersUserIdDelete(id);
  };

  return { createUser, getUser, updateUser, deleteUser };
};

export default useUsers();
