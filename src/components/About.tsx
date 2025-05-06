import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Users,
  Globe2,
  Rocket,
  CheckCircle2,
  Trophy,
  Sparkles
} from 'lucide-react';

const stats = [
  {
    icon: <Trophy className="w-6 h-6 text-primary" />,
    value: "4",
    label: "Happy Clients"
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    value: "8",
    label: "Projects Launched"
  },
  {
    icon: <Globe2 className="w-6 h-6 text-primary" />,
    value: "3",
    label: "Countries Served"
  },
  {
    icon: <Rocket className="w-6 h-6 text-primary" />,
    value: "100%",
    label: "Client Satisfaction"
  }
];

const values = [
  {
    title: "Innovation First",
    description: "Pushing boundaries with cutting-edge technology and creative solutions."
  },
  {
    title: "Quality Obsessed",
    description: "Maintaining the highest standards in every line of code we write."
  },
  {
    title: "Client Success",
    description: "Your success is our success. We're invested in your growth."
  },
  {
    title: "Global Excellence",
    description: "Bringing world-class expertise to every project, anywhere."
  }
];

const About = () => {
  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-primary uppercase tracking-wider text-sm font-medium">About Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-transparent">
              Crafting Digital Excellence Since 2024
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              At shadownik (swnk), we're more than just developers – we're digital craftsmen obsessed with perfection. Our journey began with a simple mission: to create exceptional digital experiences that push the boundaries of what's possible.
            </p>
            
            <div className="space-y-6 mb-12">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg backdrop-blur-sm border border-white/10">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                alt="Team collaboration"
                className="object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute -bottom-12 -left-12 bg-black/90 backdrop-blur-sm p-8 rounded-2xl border border-white/10"
            >
              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg backdrop-blur-sm">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;