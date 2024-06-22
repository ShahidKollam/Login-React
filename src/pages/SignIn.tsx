import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth } from '../firebase/setup';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import toast from 'react-hot-toast';
import VerifyOtp from '../components/VerifyOtp';

const PhoneVerification: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const sendOtp = async () => {
    try {

      setLoading(true);
      const recaptcha = new RecaptchaVerifier(auth,'recaptcha', {});
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      toast.success('OTP sent successfully!');

    } catch (error) {
      const errorMessage = (error as Error).message;

      if (errorMessage.includes('auth/too-many-requests')) {
        toast.error('Too many requests. Please try again later.');
      } else {
        toast.error(errorMessage);
      }

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    toast.success('Phone number verified successfully!');
  };

  const handleVerificationError = (message: string) => {
    setError(message);
    toast.error(message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Phone Verification</h2>

        {!isOtpSent ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <PhoneInput
                value={phoneNumber}
                onChange={(phoneNumber) => setPhoneNumber("+" + phoneNumber)}
                country={'in'}
              />
              <div id='recaptcha'></div>
            </div>

            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

            <button
              onClick={sendOtp}
              className={`w-40 py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold`}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <VerifyOtp
            confirmationResult={confirmationResult!}
            onVerified={handleVerificationSuccess}
            onError={handleVerificationError}
          />
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
