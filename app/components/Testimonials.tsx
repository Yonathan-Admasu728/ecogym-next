import Image from 'next/image';

const Testimonials = () => {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 opacity-5">
        <Image
          src="/images/pattern.svg"
          alt="Background pattern"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12">
          What Our Members Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-darkBlue-800 p-6 rounded-lg shadow-lg"
            >
              <p className="text-gray-300 mb-4">{testimonial.text}</p>
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-gray-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  {
    text: "EcoGym has transformed my approach to fitness. The mindful workouts are exactly what I needed.",
    name: "Sarah Johnson",
    title: "Member since 2023",
    avatar: "/images/placeholder-avatar.svg"
  },
  {
    text: "The combination of meditation and exercise has helped me achieve better balance in my life.",
    name: "Michael Chen",
    title: "Member since 2023",
    avatar: "/images/placeholder-avatar.svg"
  },
  {
    text: "I love how EcoGym makes wellness accessible and environmentally conscious at the same time.",
    name: "Emily Rodriguez",
    title: "Member since 2023",
    avatar: "/images/placeholder-avatar.svg"
  }
];

export default Testimonials;
