import { api } from 'src/boot/axios';
import Cookies from 'js-cookie';

const login = async () => {
  api
    .post(
      '/token',
      {
        username: 'daniil',
        password: 'daniil',
      },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    .then((res) => {
      console.log(res.data);
      Cookies.set('jwtToken', res.data['access_token']);
    });
};

export default login;
