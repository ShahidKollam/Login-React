import React, { useState } from 'react';
import { ConfirmationResult } from 'firebase/auth';
import {  doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import OTPInput from 'react-otp-input';
import { db } from '../firebase/setup';
import { useNavigate } from 'react-router-dom';

interface VerifyOtpProps {
  confirmationResult: ConfirmationResult;
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ confirmationResult }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const verifyOtp = async () => {
    try {
      setLoading(true);

      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      
      if (!user || !user.uid) {
        throw new Error('User UID is undefined');
      }

      const userDocRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {

        console.log('User exists in Firestore:', userDoc.data());
        navigate('/');

      } else {
        console.log('User does not exist in Firestore');
        navigate('/sign-up');
      }

      toast.success('Phone number verified successfully!');

    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setError('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="mb-4 w-full">
        <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="otp">
          Enter OTP
        </label>
        <OTPInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span className="mx-2">-</span>}
          inputStyle={{
            width: '2.1rem',
            height: '2.1rem',
            margin: '0 0.15rem',
            fontSize: '1rem',
            borderRadius: '0.25rem',
            border: '1px solid rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
          }}
          renderInput={(props) => (
            <input
              {...props}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              onKeyDown={(e) => {
                const validKeys = [
                  'Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab',
                ];
                if (e.key.match(/^[0-9]$/) || validKeys.includes(e.key)) {
                  return true;
                } else {
                  e.preventDefault();
                }
              }}
            />
          )}
        />
      </div>

      {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}
      <div className="flex justify-center">
        <button
          onClick={verifyOtp}
          className={`w-40 py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold`}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
