import { Trophy, Users, Globe2, Rocket, CheckCircle2, Sparkles } from 'lucide-react';

interface AboutDataType {
  stats: {
    icon: JSX.Element;
    value: string;
    label: string;
  }[];
  values: {
    title: string;
    description: string;
  }[];
  introText: string;
  spanText: string;
  headingText: string;
  imageSrc: string;
  imageAlt: string;
}

export const aboutData: AboutDataType = {
  stats: [
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
  ],
  values: [
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
  ],
  introText: "Welcome to the dedicated Web Development Services division of <span className=\"text-white font-semibold\">Shadownik(Swnk)<\/span>, a specialized sub-division of <span className=\"text-white font-semibold\">Shadownik<\/span>, a leading force in the IT sector. Based at <span className=\"text-white font-semibold\">web.shadownik.online<\/span>, this platform showcases our expertise in building exceptional web experiences. At Shadownik(Swnk), we're more than just developers – we're digital craftsmen obsessed with perfection. Our journey began with a simple mission: to create exceptional digital experiences that push the boundaries of what's possible within the Shadownik(Swnk) ecosystem and for our clients.",
  spanText: "About Us",
  headingText: "Crafting Digital Excellence",
  imageSrc: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
  imageAlt: "Team collaboration"
}; 