import { UserRegistration } from '../api';
import { api } from 'src/boot/axios';
import Cookies from 'js-cookie';
const useAuth = () => {
  const apiRegister = async (params: UserRegistration) => {
    return await api.registerUserRegisterPost(params);
  };
  const apiLogin = async (username: string, password: string) => {
    await api.loginForAccessTokenTokenPost(username, password).then((res) => {
      Cookies.set('jwtToken', res.data.access_token);
    });
  };
  return { apiRegister, apiLogin };
};
export default useAuth;
