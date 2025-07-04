import { useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

 const handleGoBack = () => {
  navigate(-1);
  // React Router will handle cases where there's no previous page
};

  return (
    // Change css to fit Target Colors
    <footer className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        {location.pathname !== '/' && (
          <button
            className="btn btn-dark mb-3"
            onClick={handleGoBack}
          >
            &larr; Go Back
          </button>
        )}
        <h4>
          Made with{' '}
          <span
            className="emoji"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ❤️
          </span>{' '}
          by Robert Strickland 3868 Pass Down.
        </h4>
      </div>
    </footer>
  );
};

export default Footer;