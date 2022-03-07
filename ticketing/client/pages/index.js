import buildClient from '../api/buildClient';
const LandingPage = ({ data }) => {
  console.log('current user is', data);
  return data ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
};

export async function getServerSideProps(ctx) {
  const { data } = await buildClient(ctx).get('/api/users/currentusers');
  return { props: { data } };
}

export default LandingPage;
