import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Smartphone,
  ShoppingBag,
  Database,
  Palette,
  Gauge,
  Blocks,
  BrainCircuit,
  Sparkles
} from 'lucide-react';

const services = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "Web Development",
    description: "Crafting performant, scalable web applications with cutting-edge technologies and best practices.",
    features: ["Custom Development", "Progressive Web Apps", "API Integration", "Cloud Solutions"]
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile Solutions",
    description: "Building native and cross-platform mobile applications that deliver exceptional user experiences.",
    features: ["iOS Development", "Android Development", "React Native", "Flutter"]
  },
  {
    icon: <ShoppingBag className="w-8 h-8" />,
    title: "E-Commerce",
    description: "Creating powerful online stores with seamless payment integration and inventory management.",
    features: ["Custom Platforms", "Payment Gateway", "Inventory Systems", "Analytics"]
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Backend Systems",
    description: "Developing robust backend infrastructure that scales with your business needs.",
    features: ["API Development", "Database Design", "Cloud Architecture", "Security"]
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "UI/UX Design",
    description: "Designing intuitive interfaces that engage users and drive conversions.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"]
  },
  {
    icon: <Gauge className="w-8 h-8" />,
    title: "Performance",
    description: "Optimizing applications for speed, reliability, and exceptional user experience.",
    features: ["Speed Optimization", "Load Testing", "SEO", "Analytics"]
  },
  {
    icon: <Blocks className="w-8 h-8" />,
    title: "Blockchain",
    description: "Building secure and scalable blockchain solutions for the future of technology.",
    features: ["Smart Contracts", "DApps", "Web3", "NFT Platforms"]
  },
  {
    icon: <BrainCircuit className="w-8 h-8" />,
    title: "AI Integration",
    description: "Implementing cutting-edge AI solutions to automate and enhance your business.",
    features: ["Machine Learning", "Natural Language", "Computer Vision", "Predictive Analytics"]
  }
];

const ServiceCard = ({ service, index }: { service: typeof services[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 hover:from-primary/10 hover:to-accent/10 transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      
      <div className="relative">
        <div className="mb-6 p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl w-fit">
          {React.cloneElement(service.icon, { className: 'w-8 h-8 text-primary' })}
        </div>

        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {service.title}
        </h3>
        <p className="text-gray-400 mb-6">{service.description}</p>

        <ul className="space-y-3">
          {service.features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm text-gray-300">
              <div className="w-1.5 h-1.5 bg-primary/50 rounded-full mr-3" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-primary uppercase tracking-wider text-sm font-medium">Our Expertise</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-transparent">
            Comprehensive Solutions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Comprehensive digital solutions tailored to transform your vision into reality. We leverage cutting-edge technology to deliver exceptional results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;