import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  ArrowRight,
  Tag,
  BookOpen,
  Sparkles
} from 'lucide-react';

const posts = [
  {
    title: "The Future of Web Development: AI-Driven Interfaces",
    excerpt: "Explore how artificial intelligence is revolutionizing the way we build and interact with web applications.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    category: "Technology",
    readTime: "5 min read",
    date: "Mar 15, 2024"
  },
  {
    title: "Optimizing Performance in Modern Web Apps",
    excerpt: "Learn the latest techniques and best practices for building lightning-fast web applications.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    category: "Development",
    readTime: "8 min read",
    date: "Mar 12, 2024"
  },
  {
    title: "Design Systems: Building for Scale",
    excerpt: "A comprehensive guide to creating and maintaining design systems that scale with your organization.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200",
    category: "Design",
    readTime: "6 min read",
    date: "Mar 10, 2024"
  }
];

const BlogCard = ({ post, index }: { post: typeof posts[0], index: number }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl overflow-hidden border border-white/10"
    >
      <div className="aspect-w-16 aspect-h-9 relative">
        <img
          src={post.image}
          alt={post.title}
          className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-110 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
      </div>

      <div className="p-8">
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-2 text-primary" />
            {post.category}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            {post.readTime}
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary transition-all duration-300">
          {post.title}
        </h3>
        
        <p className="text-gray-400 mb-6">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{post.date}</span>
          <motion.a
            href="#"
            whileHover={{ x: 5 }}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
          >
            Read More <ArrowRight className="ml-2 w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
};

const Blog = () => {
  return (
    <section id="blog" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(99,102,241,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-primary uppercase tracking-wider text-sm font-medium">Our Blog</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-neon-purple bg-clip-text text-transparent">
            Latest Insights
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stay updated with the latest trends, insights, and best practices in web development and design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post.title} post={post} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 px-6 py-3 rounded-full hover:from-primary/30 hover:to-accent/30 transition-colors border border-white/10"
          >
            View All Posts
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;