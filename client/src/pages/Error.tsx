import { useRouteError } from 'react-router-dom';
// This commit add interface for route error handling
interface RouteError {
  statusText?: string;
  message?: string;
}
// This commit imports useRouteError from react-router-dom to handle errors in the application
export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error);
// This commit logs the error to the console for debugging purposes
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}