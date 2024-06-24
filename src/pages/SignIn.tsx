import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { auth } from '../firebase/setup';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import toast from 'react-hot-toast';
import VerifyOtp from '../components/VerifyOtp';
import { Link } from 'react-router-dom';
import headImg from '../assets/img_header_logo.png';
import rightImg from '../assets/img_rectangle_20.png';

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
        const formattedPhoneNumber = "+" + values.phoneNumber;
        const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', {});

        const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptcha);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-6xl w-full flex">
        <div className="w-1/2 p-8 flex flex-col items-start space-y-4">
          <img src={headImg} alt="Logo" className="w-24 h-auto" />
          <h1 className="text-3xl font-bold">Phone Verification</h1>
          <h5 className="text-lg text-gray-600">Login to access your travelwise account</h5>

          {!isOtpSent ? (
            
            <form onSubmit={formik.handleSubmit} className="w-full">
              <div className="mb-4">
                <label className="text-sm font-medium">Phone Number</label>
                <PhoneInput
                  value={formik.values.phoneNumber}
                  onChange={(phoneNumber) => formik.setFieldValue('phoneNumber', phoneNumber)}
                  country={'in'}
                  inputProps={{
                    name: 'phone',
                    required: true,
                  }}
                  inputClass="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <p className="text-red-500 text-xs italic">{formik.errors.phoneNumber}</p>
                ) : null}
                <div id='recaptcha'></div>
              </div>

              <button
                type="submit"
                className={` w-full py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <VerifyOtp confirmationResult={confirmationResult!} />
          )}

          {!isOtpSent && (
            <p className="text-sm text-gray-600 mt-4">
              Don't have an account?
              <Link to={'/sign-up'} className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </div>

        <div className="w-1/2 flex justify-end items-center pb-48 p-10">
          <img src={rightImg} alt="Right Image" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
