import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <h2 className="text-5xl">404 - Page Not Found</h2>
      <p>The page you are looking for does't exist.</p>

      <button className="p-3 button-primary mt-5">
        <Link to={"/"}>Back to Home</Link>
      </button>
    </div>
  );
};

export default NotFoundPage;
