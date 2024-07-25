// app/blog/BlogContent.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the type for a blog post
interface BlogPostType {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    image: string;
    slug: string;
    content: string;
}

// Define props type for BlogPost component
interface BlogPostProps {
    post: BlogPostType;
}

// Mock data for blog posts
const blogPosts: BlogPostType[] = [
    {
        id: 1,
        title: "The Mindful Muscle: Integrating Meditation into Your Fitness Routine",
        excerpt: "Discover how combining mindfulness with exercise can supercharge your workout results and overall well-being.",
        date: "2023-07-22",
        author: "Dr. Samantha Lee",
        image: "/images/blog/outdormeditation.webp",
        slug: "mindful-muscle-meditation-fitness",
        content: `
          <h2>The Power of Mind-Body Connection</h2>
          <p>In the quest for peak physical fitness, we often overlook our most powerful tool: the mind. At Ecogym, we believe that true wellness comes from nurturing both body and mind. This post explores how integrating meditation into your fitness routine can lead to remarkable improvements in your physical performance and mental well-being.</p>
      
          <h2>The Science Behind Mindful Fitness</h2>
          <p>Recent studies have shown that combining mindfulness practices with physical exercise can enhance muscle recovery, improve focus during workouts, and even boost your body's ability to build lean muscle mass. By engaging in mindful exercise, you're not just working out – you're tuning into your body's needs and capabilities on a deeper level.</p>
      
          <h2>5 Ways to Incorporate Mindfulness into Your Workouts</h2>
          <ol>
            <li><strong>Breathwork warm-ups:</strong> Start your session with 5 minutes of focused breathing to center your mind and prepare your body.</li>
            <li><strong>Mindful stretching:</strong> Pay close attention to how each stretch feels, focusing on the sensation in your muscles.</li>
            <li><strong>Moving meditation:</strong> During repetitive exercises like running or cycling, focus on the rhythm of your movement and breath.</li>
            <li><strong>Visualization:</strong> Before attempting a challenging lift or move, visualize yourself successfully completing it.</li>
            <li><strong>Cooldown reflection:</strong> End your workout with a short meditation, reflecting on your accomplishments and setting intentions for your next session.</li>
          </ol>
      
          <h2>The Ecogym Approach</h2>
          <p>At Ecogym, we've developed a unique program that seamlessly blends mindfulness practices with cutting-edge fitness routines. Our 'Mindful Muscle' classes combine high-intensity interval training (HIIT) with guided meditation interludes, allowing you to push your physical limits while maintaining mental clarity and focus.</p>
      
          <p>Remember, fitness isn't just about building a stronger body – it's about cultivating a resilient mind. By integrating mindfulness into your fitness routine, you're not just working out; you're working in, creating a harmonious balance that will elevate every aspect of your life.</p>
        `
      },
      {
        id: 2,
        title: "Eco-Friendly Fitness: Sustainable Workout Practices for a Healthier Planet",
        excerpt: "Learn how to make your fitness routine more environmentally friendly while still achieving your wellness goals.",
        date: "2023-07-29",
        author: "Alex Green",
        image: "/images/blog/workingout.webp",
        slug: "eco-friendly-fitness-sustainable-workouts",
        content: `
          <h2>Fitness for You and the Planet</h2>
          <p>At Ecogym, we believe that personal wellness and environmental health go hand in hand. As fitness enthusiasts, we have a unique opportunity to make our workout routines more sustainable. This post explores innovative ways to stay fit while reducing your carbon footprint.</p>
      
          <h2>The Environmental Impact of Fitness</h2>
          <p>From energy-hungry gym equipment to plastic water bottles and synthetic workout gear, the fitness industry can have a significant environmental impact. But with a few mindful changes, we can turn our workouts into a force for environmental good.</p>
      
          <h2>7 Eco-Friendly Fitness Practices</h2>
          <ol>
            <li><strong>Outdoor workouts:</strong> Embrace nature as your gym. Trail running, outdoor yoga, or beach workouts require no electricity and connect you with the environment.</li>
            <li><strong>Human-powered equipment:</strong> Opt for equipment like push mowers or bicycle generators that harness your energy output.</li>
            <li><strong>Sustainable gear:</strong> Choose workout clothes made from recycled materials or organic fabrics.</li>
            <li><strong>Reusable water bottles:</strong> Ditch single-use plastics for a durable, reusable water bottle.</li>
            <li><strong>Plogging:</strong> Combine jogging with picking up litter for a workout that directly benefits your community.</li>
            <li><strong>Digital fitness tracking:</strong> Use apps instead of physical trackers to monitor your progress.</li>
            <li><strong>Eco-friendly yoga mats:</strong> Swap out PVC mats for ones made from natural or recycled materials.</li>
          </ol>
      
          <h2>The Ecogym Commitment</h2>
          <p>At Ecogym, sustainability isn't just a buzzword – it's a core part of our mission. Our facilities use energy-efficient equipment, harness kinetic energy from workouts to power our buildings, and offer incentives for members who choose green transportation options.</p>
      
          <p>Remember, every small action counts. By making your fitness routine more eco-friendly, you're not just building a stronger body – you're contributing to a healthier planet. Let's work out for a better world, one rep at a time!</p>
        `
      },
      {
        id: 3,
        title: "Biohacking Your Way to Peak Performance: Cutting-Edge Techniques for Mind and Body Optimization",
        excerpt: "Explore innovative biohacking methods to elevate your physical and mental performance to new heights.",
        date: "2023-08-05",
        author: "Dr. Raj Patel",
        image: "/images/blog/biohack.webp",
        slug: "biohacking-peak-performance-optimization",
        content: `
          <h2>The Future of Fitness is Here</h2>
          <p>Welcome to the cutting edge of human performance. At Ecogym, we're always pushing the boundaries of what's possible in fitness and wellness. Today, we're diving into the world of biohacking – the art and science of optimizing your biology for peak performance.</p>
      
          <h2>What is Biohacking?</h2>
          <p>Biohacking is the practice of using science, technology, and self-experimentation to take control of and upgrade your body, mind, and life. It's about understanding your own biology and figuring out how to 'hack' it for better results.</p>
      
          <h2>5 Powerful Biohacking Techniques</h2>
          <ol>
            <li><strong>Cold Thermogenesis:</strong> Regular exposure to cold temperatures can boost metabolism, reduce inflammation, and improve mental clarity. Try ending your shower with 30 seconds of cold water, gradually increasing the duration.</li>
            <li><strong>Neurofeedback Training:</strong> Use EEG devices to visualize your brain activity in real-time, allowing you to train your mind for better focus, relaxation, and cognitive performance.</li>
            <li><strong>Intermittent Fasting:</strong> Cycle between periods of eating and fasting to improve insulin sensitivity, boost cellular repair, and enhance mental clarity. Start with a 16/8 fasting schedule (16 hours of fasting, 8-hour eating window).</li>
            <li><strong>Red Light Therapy:</strong> Exposure to red and near-infrared light can boost cellular energy production, accelerate muscle recovery, and improve skin health. Consider investing in a red light therapy device for home use.</li>
            <li><strong>Nootropic Stacking:</strong> Combine cognitive-enhancing supplements (nootropics) to create a personalized 'stack' that boosts your mental performance. Always consult with a healthcare professional before starting any new supplement regimen.</li>
          </ol>
      
          <h2>The Ecogym Biohacking Lab</h2>
          <p>At Ecogym, we've integrated biohacking principles into our facilities. Our Biohacking Lab features cryotherapy chambers, float tanks for sensory deprivation, and advanced biomarker testing. We also offer personalized biohacking consultations to help you create a tailored optimization plan.</p>
      
          <p>Remember, biohacking is about self-experimentation and finding what works best for your unique biology. Always approach new techniques with caution, start slowly, and listen to your body. With the right approach, biohacking can be your secret weapon for unlocking your full potential – in the gym and in life.</p>
        `
      },{
        id: 4,
        title: "The Neuroscience of Movement: How Exercise Shapes Your Brain",
        excerpt: "Delve into the fascinating ways physical activity influences brain structure, function, and overall cognitive health.",
        date: "2023-08-12",
        author: "Dr. Elena Rodriguez",
        image: "/images/blog/neuro.webp",
        slug: "neuroscience-movement-exercise-brain",
        content: `
          <h2>Moving Beyond Muscle: The Brain-Body Connection</h2>
          <p>At Ecogym, we've always known that exercise is good for you. But recent advances in neuroscience have revealed that the benefits of physical activity extend far beyond toned muscles and cardiovascular health. Today, we're exploring how exercise quite literally shapes your brain.</p>
      
          <h2>The Neuroplastic Nature of Exercise</h2>
          <p>Neuroplasticity refers to the brain's ability to form new neural connections and adapt throughout life. Exercise is one of the most powerful drivers of neuroplasticity, promoting the growth of new brain cells and strengthening the connections between them.</p>
      
          <h2>5 Ways Exercise Transforms Your Brain</h2>
          <ol>
            <li><strong>Boosting BDNF:</strong> Physical activity increases the production of Brain-Derived Neurotrophic Factor (BDNF), often called 'Miracle-Gro for the brain'. BDNF promotes the survival of existing neurons and encourages the growth of new ones.</li>
            <li><strong>Expanding the Hippocampus:</strong> Regular aerobic exercise has been shown to increase the size of the hippocampus, the brain region associated with memory and learning.</li>
            <li><strong>Enhancing Executive Function:</strong> Activities that combine physical exertion with complex motor skills (like dance or martial arts) can significantly improve executive function, including planning, decision making, and multitasking abilities.</li>
            <li><strong>Reducing Cognitive Decline:</strong> Consistent physical activity is linked to a slower rate of age-related cognitive decline and a reduced risk of neurodegenerative diseases like Alzheimer's.</li>
            <li><strong>Alleviating Depression and Anxiety:</strong> Exercise promotes the release of endorphins and other neurotransmitters that can help alleviate symptoms of depression and anxiety, often as effectively as medication.</li>
          </ol>
      
          <h2>The Ecogym Neuro-Fitness Program</h2>
          <p>Inspired by these findings, we've developed our Neuro-Fitness Program at Ecogym. This innovative regimen combines cardiovascular exercise, complex motor skill training, and cognitive challenges to maximize the brain-boosting benefits of your workout.</p>
      
          <h2>Optimizing Your Brain Through Movement</h2>
          <p>To get the most cognitive benefit from your workouts, try these strategies:</p>
          <ul>
            <li>Vary your routine: Different types of exercise affect the brain in different ways. Mix cardio, strength training, and skills-based activities.</li>
            <li>Learn new movements: Challenging your brain with novel movement patterns enhances neuroplasticity.</li>
            <li>Exercise outdoors: Combining physical activity with exposure to nature provides additional cognitive benefits.</li>
            <li>Stay consistent: Regular exercise provides cumulative benefits to brain health over time.</li>
          </ul>
      
          <p>Remember, every time you move your body, you're not just building a healthier physique – you're sculpting a sharper, more resilient mind. At Ecogym, we're committed to helping you optimize both your physical and cognitive performance. Let's exercise for a fitter body and a sharper mind!</p>
        `
      }
  // Add more blog posts here
];


  const BlogPost: React.FC<BlogPostProps> = ({ post }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105">
      <Image src={post.image} alt={post.title} width={400} height={200} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-400 mb-4">{post.excerpt}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{post.author}</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="mt-4 inline-block bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors duration-300">
          Read More
        </Link>
      </div>
    </div>
  );

  const BlogContent: React.FC = () => {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-8 text-center">Ecogym Blog</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <BlogPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default BlogContent;