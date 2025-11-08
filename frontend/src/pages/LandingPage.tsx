import { Link } from "react-router-dom";

const LandingPageExtended = () => {
  return (
    <div className="text-center min-h-screen flex flex-col justify-center mt-20">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-4 py-20 ">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-7xl font-extrabold">
            Link<span className="text-primary">Up</span>
          </h1>
          <p className="text-2xl">
            Connect <span className="font-bold italic">instantly</span>. Chat
            <span className="font-bold italic"> seamlessly</span>. Share
            <span className="font-bold italic"> effortlessly</span>.
          </p>
          <div className="flex gap-5">
            <button className="button-padding">
              <Link to="/login">Log In</Link>
            </button>
            <button className="button-primary button-padding">
              <Link to="/signup">Sign Up</Link>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageExtended;
