import { api } from 'src/boot/axios';

const newChat = async (vec_name) => {
  return await api.post('create_chat', { vec_name }).then((res) => {
    return res.data;
  });
};
