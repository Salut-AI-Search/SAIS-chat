import { UserRegistration } from '../api';
import { api } from 'src/boot/axios';

const useAuth = () => {
  const apiRegister = async (params: UserRegistration) => {
    return await api.registerUserRegisterPost(params);
  };
  const apiLogin = async (username: string, password: string) => {
    return await api
      .loginForAccessTokenTokenPost(username, password)
      .then((res) => {
        return res.data.access_token;
      })
      .catch((e) => {
        throw e;
      });
  };
  return { apiRegister, apiLogin };
};
export default useAuth;
