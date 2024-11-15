import { api } from 'src/boot/axios';
import { useChatStore } from 'src/stores/chatStore';
const { setVectorStores } = useChatStore();
const useVecStore = () => {
  const apiGetVecStoreList = async () => {
    await api.getVectorStoresListGetVectorStoresListGet().then((res) => {
      setVectorStores(res.data.answer);
    });
  };
  const apiGetVecStoreFromFiles = async (
    vecName: string,
    files: Array<File>
  ) => {
    return await api.getVectorstoreFromFilesVectorStorageFromFilesPost(
      vecName,
      files
    );
  };
  return { apiGetVecStoreList, apiGetVecStoreFromFiles };
};
export default useVecStore;
