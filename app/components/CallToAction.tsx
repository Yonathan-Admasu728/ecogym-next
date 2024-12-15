import Image from 'next/image';

const CallToAction = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/images/pattern.svg"
          alt="Background pattern"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Wellness Journey Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of mindful movers and discover a better way to exercise.
          </p>
          <button className="bg-turquoise-500 hover:bg-turquoise-600 text-white font-bold py-3 px-8 rounded-full transition duration-300">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
