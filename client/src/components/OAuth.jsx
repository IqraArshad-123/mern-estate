import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken: await result.user.getIdToken() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Google sign-in failed');
            dispatch(signInSuccess(data));
            navigate('/');
            
        } catch (error) {
            setError('Google sign-in could not finish. Please use email and password or try again.');
            
        }
    }
  return (
    <><button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>{error && <p role="alert" className="text-red-700">{error}</p>}</>
  )
}
