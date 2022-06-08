import axios from 'axios';
import 'nprogress/nprogress.css';
import NProgress from 'nprogress';

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
  return Promise.reject(error);
});

const ENDPOINT = '/xhr'
export default {
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
  HOST: ENDPOINT + '/host',
  EXECUTION: ENDPOINT + '/execution',
  VARIABLE: ENDPOINT + '/variable',
  REPOSITORY: ENDPOINT + '/repository',
  WEBHOOK: ENDPOINT + '/webhook',
  TOKEN: ENDPOINT + '/personal-token'
}