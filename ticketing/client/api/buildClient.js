import axios from 'axios';

const buildClient = ({ req }) => {
  return axios.create({
    baseURL: 'http://SERVICENAME.NAMESPACE.svc.cluster.local',
    headers: req.headers,
  });
};

export default buildClient;
