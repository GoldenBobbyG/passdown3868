import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { input: { ...formState } },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="d-flex justify-content-center mb-4">
      <div className="col-12 col-lg-6 col-md-8">
        <div className="card shadow-lg border-0">
          <div className="card-header text-center py-4" style={{ backgroundColor: '#CC0000', color: 'white' }}>
            <h4 className="m-0 fw-bold">Join 3868 Pass Down</h4>
            <p className="m-0 small">Create Your Shift Dashboard Account</p>
          </div>
          <div className="card-body p-4" style={{ backgroundColor: '#f8f9fa' }}>
            {data ? (
              <div className="text-center">
                <div className="alert alert-success mb-3" style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb' }}>
                  <h5 className="alert-heading">Account Created Successfully!</h5>
                  <p className="mb-0">
                    Welcome to the team! Redirecting to your dashboard...{' '}
                    <Link to="/" className="alert-link">Or click here to continue.</Link>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fw-semibold">Username</label>
                  <input
                    id="username"
                    className="form-control form-control-lg"
                    placeholder="Choose a username"
                    name="username"
                    type="text"
                    value={formState.username}
                    onChange={handleChange}
                    required
                    style={{ borderColor: '#CC0000' }}
                  />
                  <div className="form-text">This will be displayed on your shift reports</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                  <input
                    id="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    style={{ borderColor: '#CC0000' }}
                  />
                  <div className="form-text">Used for notifications and password recovery</div>
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">Password</label>
                  <input
                    id="password"
                    className="form-control form-control-lg"
                    placeholder="Create a secure password"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    style={{ borderColor: '#CC0000' }}
                  />
                  <div className="form-text">Must be at least 6 characters long</div>
                </div>
                <button
                  className="btn btn-lg w-100 mb-3 fw-semibold"
                  style={{ 
                    backgroundColor: '#CC0000', 
                    borderColor: '#CC0000',
                    color: 'white',
                    cursor: 'pointer' 
                  }}
                  type="submit"
                >
                  Create Account
                </button>
                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#CC0000' }}>
                      Login here
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {error && (
              <div className="alert alert-danger mt-3" style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>
                <strong>Signup Error:</strong> {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;