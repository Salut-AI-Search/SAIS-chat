import { DefaultApi } from '../api';
import { Configuration } from '../configuration';

const useApi = () => {
  const config = new Configuration({
    basePath: process.env.VUE_APP_API_BASE_URL,
  });

  const api = new DefaultApi(config);
  return api;
};

export default useApi;
