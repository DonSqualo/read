import { useNavigate } from "react-router-dom";

const signIn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/stream');
  };

  return (
    <div className="text-center">
      <div className='text-2xl mb-4'>Welcome to</div>
      <h1 className='font-greycliff font-senibold mb-8 text-5xl'>Read with Meaning</h1>
      <button
        onClick={handleClick}
        className="border hover:border-2 hover:border-primary py-1 px-3 rounded-sm text-xl bg-secondary"
      >
        Sign In
      </button>
    </div>
  );
}

export default signIn;