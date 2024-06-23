// src/pages/PhoneVerification.tsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth, db } from '../firebase/setup';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import toast from 'react-hot-toast';
import VerifyOtp from '../components/VerifyOtp';
import { Link } from 'react-router-dom';

const PhoneVerification: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        console.log(values.phoneNumber);
        
        const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', {});
        const confirmation = await signInWithPhoneNumber(auth, values.phoneNumber, recaptcha);
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
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Phone Verification</h2>

        {!isOtpSent ? (
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <PhoneInput
                value={formik.values.phoneNumber}
                onChange={(phoneNumber) => formik.setFieldValue('phoneNumber', "+" + phoneNumber)}
                country={'in'}
                inputProps={{
                  name: 'phone',
                  required: true,
                }}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <p className="text-red-500 text-xs italic">{formik.errors.phoneNumber}</p>
              ) : null}
              <div id='recaptcha'></div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`w-40 py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold`}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          </form>
        ) : (
          <VerifyOtp confirmationResult={confirmationResult!} />
        )}

        {!isOtpSent && (
          <div className="mt-4 text-center">
            <p className="text-gray-700">
              Don't have an account? 
              <Link to={'/sign-up'} className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
