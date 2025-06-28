import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { signUp, setActive } = useSignUp(); // use Clerk's signUp hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // 1. Create sign-up
      const result = await signUp.create({
        emailAddress: email,
        password: password,
      });
      console.log('Sign up created');
      // 2. (Optional) Skip verification — for demo/testing
      //await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // 3. Auto-activate the session (without verification step for now)
      // const completeSignUp = await signUp.attemptEmailAddressVerification({
      //   code: '000000' // Use valid code in production flow
      // });

      await setActive({ session: result.createdSessionId });
      console.log('Session activated');

      
      navigate('/game'); // Redirect to game page after signup

    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Sign up failed');
    }
  };

  return (
    <div className="bg-[url('/chess_landing_page_image.jpg')] bg-center bg-cover min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Sign Up
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account? <a href="/" className="text-blue-600 hover:underline">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
