import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/setup';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import headImg from '../assets/img_header_logo.png';
import leftImg from '../assets/img_rectangle_signup.png';

interface LocationState {
  uid: string;
  phoneNumber: string;
}

const RegistrationForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const existingUserData = location.state as LocationState | null;
  const [isChecked, setIsChecked] = useState(false);


  //console.log("existingUserData",existingUserData);

  const initialValues = {
    name: '',
    email: '',
    phoneNumber: existingUserData ? existingUserData.phoneNumber : '',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').required('Phone number is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    //confirmPassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwords must match').required('Confirm Password is required')
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleRegistration = async (values: any, { setSubmitting, setFieldError }: any) => {
    //const { name, email, phoneNumber, password } = values;
    console.log(values.name);
    

    try {
      let uid;
      //let currentUser = auth.currentUser;
      //console.log(currentUser);



      if (existingUserData) {
        // Handle existing user sign-up with phone number
        uid = existingUserData.uid;

        await setDoc(doc(db, 'Users', uid), {
          displayName: values.name,
          phoneNumber: existingUserData.phoneNumber,
          email: values.email,
        });

        // await updateProfile(currentUser, {
        //   displayName: values.name,
        // });
        toast.success('Sign up successful! Redirecting to home...');

        navigate('/')

      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        console.log("normal signup",user);

        if (!user) {
          throw new Error('Failed to create user.');
        }

        uid = user.uid;

        await setDoc(doc(db, 'Users', uid), {
          displayName: values.name,
          phoneNumber: values.phoneNumber,
          email: values.email,
        });

        // await updateProfile(user, {
        //   displayName: values.name,
        // });
        toast.success('Sign up successful! Redirecting to home...');

        navigate('/');
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Registration error:', error);
      setFieldError('password', errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-6xl w-full flex">
        <div className="w-1/2 flex justify-start items-center pb-48 p-10">
          <img src={leftImg} alt="Left Image" className="w-full h-auto" />
        </div>

        <div className="w-1/2 p-8 flex flex-col items-end space-y-4">
          <img src={headImg} alt="Logo" className="w-24 h-auto ml-auto" />

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRegistration}
          >
            {({ isSubmitting }) => (
              <Form className="w-full">
                <p className="text-2xl font-bold">Sign Up</p>
                <h6 className="text-md text-gray-600">Create an account to access your travelwise features</h6><br />

                <div className="flex space-x-4 mb-4">
                  <div className="w-1/2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>

                    <Field
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                      placeholder="Enter your Name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs italic" />
                  </div>

                  <div className="w-1/2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                      placeholder="Enter your Email"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs italic" />
                  </div>

                  </div>
                  {/* Mobile Number input field */}
                  <div className="mb-4">
                    <label htmlFor="phoneNumber" className="text-sm font-medium">
                      Mobile Number
                    </label>

                    <Field
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                      placeholder="Enter your Phone Number"
                    />
                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-xs italic" />
                  </div>

                  {/* Password input field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>

                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                      placeholder="Enter your Password"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs italic" />
                  </div>

                  {/* 
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs italic" />
                </div> */}



                {/* Terms and Conditions checkbox */}
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                    I agree to the <Link to="/terms" className="text-blue-500 hover:underline">terms and conditions</Link>
                  </label>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>

                {/* Login link */}
                <p className="text-sm text-gray-600 mt-4">
                  Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
                </p>

              </Form>
            )}
          </Formik>        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
