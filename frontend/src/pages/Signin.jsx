import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log(email, password);
      const result = await signIn.create({
        identifier: email,
        password: password,
      });
      console.log("Sign-in result:", result);
      // Sign-in successful
      await setActive({ session: result.createdSessionId });
      console.log("User signed in:", result.createdSessionId);
      navigate('/game');

    } catch (err) {
      console.error("Sign-in error:", err);
      const message = err.errors?.[0]?.message || "Invalid email or password";
      setError(message);
    }
  };

  return (
    <div className="bg-[url('/chess_landing_page_image.jpg')] bg-center bg-cover min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-5xl font-bold mb-6 text-center text-gray-800">Welcome to the World of Chess!</h1>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
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

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Sign In
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
