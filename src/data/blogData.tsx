import { Clock, ArrowRight, Tag, BookOpen, Sparkles } from 'lucide-react';

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
}

interface BlogDataType {
  spanText: string;
  headingText: string;
  descriptionText: string;
  viewAllButtonText: string;
  posts: BlogPost[];
}

export const blogData: BlogDataType = {
  spanText: "Our Blog",
  headingText: "Latest Insights",
  descriptionText: "Stay updated with the latest trends, insights, and best practices in web development and design.",
  viewAllButtonText: "View All Posts",
  posts: [
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
  ]
}; 