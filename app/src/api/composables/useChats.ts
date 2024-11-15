import { api } from 'src/boot/axios';
import { GetAnswerRequest } from '../api';

const useChats = () => {
  const apiGetChats = async () => {
    return await api.getChatsByUserChatsGet().then((res) => {
      return res.data;
    });
  };
  const apiCreateChat = async (vecName: string) => {
    return await api.createChatCreateChatPost(vecName);
  };
  const apiGetMessages = async (chatId: number) => {
    return await api.getMessagesByUserMessagesGet(chatId);
  };
  const apiSendMessage = async (params: GetAnswerRequest) => {
    return await api.getResponseGetResponsePost(params);
  };
  return { apiGetChats, apiCreateChat, apiGetMessages, apiSendMessage };
};
export default useChats;
