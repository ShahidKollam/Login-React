import React, { useState } from 'react';

const PhoneVerification: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Invalid phone number. Please enter a 10-digit phone number.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Verification code sent!');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Phone Verification</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          className={`w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
          } text-white font-bold`}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Send Verification Code'}
        </button>
      </div>
    </div>
  );
};

export default PhoneVerification;
