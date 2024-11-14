import { UserRegistration } from '../api';
import useApi from './useApi';
const useAuth = () => {
  const api = useApi();
  const apiRegister = async (params: UserRegistration) => {
    return await api.registerUserRegisterPost(params);
  };
  const apiLogin = async (username: string, password: string) => {
    return await api.loginForAccessTokenTokenPost(username, password);
  };
  return { apiRegister, apiLogin };
};
export default useAuth;
