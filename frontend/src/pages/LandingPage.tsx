const LandingPage = () => {
  return (
    <div className="text-center">
      <section className="max-w-2xl">
        <img src="hero.png" alt="" className="mx-auto w-100 -mt-25" />

        <div className="space-y-10 ">
          {" "}
          <div className="space-y-7">
            <h2 className="text-7xl">
              Link<span className="text-primary">Up</span>
            </h2>
            <span className="text-2xl">
              Connect <span className="font-bold italic">instantly</span>. Chat
              <span className="font-bold italic"> seamlessly</span>.
            </span>
          </div>
          <p>
            A real-time messaging platform built with the MERN stack that lets
            you connect with friends, create group chats, and share media
            instantly.
          </p>
          <div className="space-x-5">
            <button type="button">
              <a href="/login">Log In</a>
            </button>
            <button type="button" className="button-primary">
              <a href="/signup">Sign Up</a>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
