import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations'; // Changed from 'Login as LOGIN_MUTATION'
import Auth from '../utils/auth';
// This commits the login function 
const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error, data }] = useMutation(LOGIN_USER); // Changed from LOGIN_MUTATION
// This commits the login mutation to handle user login
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
// This commits the handleChange function to update form state
    setFormState({
      ...formState,
      [name]: value,
    });
  };
// This commits the handleFormSubmit function to handle form submission
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log(formState);
    try {
      const { data } = await login({
        variables: { ...formState },
      });
// This commits the login mutation to authenticate the user
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    setFormState({
      email: '',
      password: '',
    });
  };
// This commits the main structure of the login page
  return (
    <main className="d-flex justify-content-center mb-4">
      <div className="col-12 col-lg-6 col-md-8">
        <div className="card shadow-lg border-0">
          <div className="card-header text-center py-4" style={{ backgroundColor: '#CC0000', color: 'white' }}>
            <h4 className="m-0 fw-bold">3868 Pass Down Login</h4>
            <p className="m-0 small">Shift Turnover Dashboard</p>
          </div>
          <div className="card-body p-4" style={{ backgroundColor: '#f8f9fa' }}>
            {data ? (
              <div className="text-center">
                <div className="alert alert-success mb-3" style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb' }}>
                  <h5 className="alert-heading">Login Successful!</h5>
                  <p className="mb-0">
                    Redirecting to your dashboard...{' '}
                    <Link to="/" className="alert-link">Or click here to continue.</Link>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
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
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">Password</label>
                  <input
                    id="password"
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    name="password"
                    type="password"
                    value={formState.password}
                    onChange={handleChange}
                    required
                    style={{ borderColor: '#CC0000' }}
                  />
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
                  Login to Dashboard
                </button>
                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: '#CC0000' }}>
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {error && (
              <div className="alert alert-danger mt-3" style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>
                <strong>Login Error:</strong> {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;