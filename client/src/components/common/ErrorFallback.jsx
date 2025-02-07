import { useRouteError } from "react-router-dom";
import './ErrorFallback.css'

export default function ErrorFallback() {
    const error = useRouteError();
    console.error(error); // Log the error for debugging
  
    return (
      <div>
        <h1>Oops! Something went wrong.</h1>
        <p>{error.message}</p> {/* Display the error message */}
      </div>
    );
}