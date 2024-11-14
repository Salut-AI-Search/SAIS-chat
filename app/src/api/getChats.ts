import { api } from 'src/boot/axios';

const getChats = async () => {
  return await api.get('chats').then((res) => {
    return res.data;
  });
};

export default getChats;
