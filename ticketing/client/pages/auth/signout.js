import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const SignOut = () => {
  const { doRequest } = useRequest({
    url: 'http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing you out ......</div>;
};

export default SignOut;
