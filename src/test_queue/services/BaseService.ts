import axios from 'axios';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import { MasterDataInterface } from 'base/MasterData';

declare let window: Window;

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  NProgress.start();
  return config;
}, function (error) {
  // Do something with request error
  console.error(error)
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  NProgress.done();
  return response;
}, function (error) {
  // Do something with response error
  console.error(error)
  setTimeout(() => {
    NProgress.done();
  }, 5000);
  return Promise.reject(error);
});


export const getApiKey = async () => {
  let masterData: MasterDataInterface = window.masterData;
  let apiKey = await masterData.getData("api_key", "");
  return apiKey;
}

const ENDPOINT = '/api'
export default {
  FILE2: ENDPOINT + '/file2',
  // Not used for a while
  SQL: ENDPOINT + '/sql',
  FILE: ENDPOINT + '/file',
  QUEUE: ENDPOINT + '/queue',
  QUEUE_RECORD: ENDPOINT + '/queue-record',
  QUEUE_RECORD_DETAIL: ENDPOINT + "/queue-record-detail",
  QUEUE_RECORD_SCHEDULE: ENDPOINT + '/queue-record-schedule',
  AUTH: ENDPOINT + '/auth',
  USER: ENDPOINT + '/user',
  PROJECT: ENDPOINT + '/project',
  PIPELINE: ENDPOINT + '/pipeline',
  PIPELINE_ITEM: ENDPOINT + '/pipeline-item',
  PIPELINE_TASK: ENDPOINT + '/pipeline-task',
  GUEST: ENDPOINT + '/guest',
  HOST: ENDPOINT + '/host',
  EXECUTION: ENDPOINT + '/execution',
  VARIABLE: ENDPOINT + '/variable',
  REPOSITORY: ENDPOINT + '/repository',
  WEBHOOK: ENDPOINT + '/webhook',
  TOKEN: ENDPOINT + '/personal-token',
  OAUTH_USER: ENDPOINT + '/oauth-user',
  CREDENTIAL: ENDPOINT + '/credential',
  CONFIGURATION: ENDPOINT + "/configuration",
  VARIABLE_ITEM: ENDPOINT + "/variable-item",
  PAGE_PUBLISHER: ENDPOINT + "/page-publisher",
  PAGE_PUBLISHER_USER: ENDPOINT + "/page-publisher-user"
}