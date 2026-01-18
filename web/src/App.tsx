import "./index.css";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { HowItWorks } from "./components/HowItWorks";
import { Installation } from "./components/Installation";
import { Security } from "./components/Security";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Hero />
      <Features />
      <HowItWorks />
      <Installation />
      <Security />
      <Footer />
    </div>
  );
}

export default App;
