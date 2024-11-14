import { api } from 'src/boot/axios';
import { useChatStore } from 'src/stores/chatStore';

const { setVectorStores, vectorStores } = useChatStore();

const getVectorStores = async () => {
  return await api.get('getVectorStoresList').then((res) => {
    setVectorStores(res.data.answer);
    console.log(res.data.answer);
    console.log(vectorStores);
  });
};

export default getVectorStores;
