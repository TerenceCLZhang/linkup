import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeatureCardsData from "../lib/FeatureCards.json";

const LandingPageExtended = () => {
  return (
    <motion.div
      className="text-center flex flex-col justify-center items-center gap-30 mb-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Hero Section */}
      <section className="mt-20 max-w-3xl flex flex-col items-center gap-10 justify-center mx-auto relative">
        <img src="/hero.png" alt="" className="-mt-20 -mb-10 w-100" />

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
      </section>

      {/* Features Section */}
      <section className="flex flex-col gap-10 max-w-5xl">
        <h2 className="text-4xl">Features</h2>

        <motion.div
          className="flex gap-5 justify-between h-100"
          initial="hidden"
          viewport={{ once: true }}
          whileInView="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {FeatureCardsData.map((card, i) => (
            <motion.div
              key={i}
              className="landing-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span>{card.emoji}</span>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </motion.div>
  );
};

export default LandingPageExtended;
