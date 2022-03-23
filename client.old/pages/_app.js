import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

export async function getServerSideProps(appContext) {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentusers');
  let pageProps = {};
  if (appContext.Component.getServerSideProps) {
    pageProps = await appContext.Component.getServerSideProps(appContext.ctx);
  }
  return {
    pageProps,
    ...data,
  };
}

export default AppComponent;
