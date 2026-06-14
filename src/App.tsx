import Nav from './components/Nav';
import HeroSection from './components/HeroSection';

export default function App() {
  return (
    <div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Nav />
      <HeroSection />
    </div>
  );
}
