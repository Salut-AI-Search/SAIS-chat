import { TextRequest, TextsRequest } from '../api';
import useApi from './useApi';

const useEmbeddings = () => {
  const api = useApi();

  const createEmbedding = async (text: TextRequest) => {
    return await api.makeEmbeddingEmbeddingPost(text);
  };

  const createEmbeddings = async (texts: TextsRequest) => {
    return await api.makeEmbeddingsEmbeddingsPost(texts);
  };

  return { createEmbedding, createEmbeddings };
};

export default useEmbeddings;
