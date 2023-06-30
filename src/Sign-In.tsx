import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from './AuthContext';
import Cookies from 'js-cookie';

const signIn = () => {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState('');
  const { authToken, setAuthToken } = useContext(AuthContext);
  useEffect(() => {
    if (authToken) {
      navigate('/stream');
    }
})
  

  const handleSubmit = () => {
    setAuthToken(formInput);
    Cookies.set('meaning_user_key', formInput, { expires: 7 })
    event?.preventDefault();
    navigate('/stream');
  };
  const handleChange = (event: any) => {
    setFormInput(event.target.value);
  }

  return (
    <div className="text-center">
      <div className='text-2xl mb-4'>Welcome to</div>
      <h1 className='font-greycliff font-senibold mb-8 text-5xl'>Read with Meaning</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
        <label>
          Your Private Key:
          <div>
          <input type="text" value={formInput}
                 onChange={handleChange} className="bg-black mt-4 focus:border-b-2 border-b focus:outline-none focus:ring-0"/></div>
        </label>
        </div>
        <input type="submit" value="Sign In" className="border hover:border-2 hover:border-primary py-1 px-3 rounded-sm text-xl bg-secondary"
/>
      </form>
    </div>
  );
}

export default signIn;