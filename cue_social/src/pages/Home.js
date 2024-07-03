import UploadForm from '../components/UploadForm';
import Login from '../components/Login';

function Home() {

  return (
    <div className="Home" id="home">
      <Login />
      <UploadForm />
    </div>
  );
}

export default Home;
