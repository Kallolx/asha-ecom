import React from 'react';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';

const teamMembers = [
  {
    id: 1,
    name: 'Md. Anwar Hossain',
    position: 'CEO',
    image: '/team/ceo.jpg',
    description: 'Leading our vision for sustainable organic products and community growth.',
    social: null
  },
  {
    id: 2,
    name: 'Ahnaf Tazwar Udoy',
    position: 'Managing Director',
    image: '/team/director.jpg',
    description: 'Driving innovation and excellence in organic food delivery.',
    social: {
      linkedin: '#',
      twitter: '#'
    }
  },
  {
    id: 3,
    name: 'Delivery Team',
    position: 'Heroes Behind Quick Delivery',
    image: '/team/delivery.jpg',
    description: 'Our dedicated team ensuring fresh organic products reach your doorstep.',
    social: null
  },
  {
    id: 4,
    name: 'Technical Support',
    position: 'Development & Support',
    image: '/team/dev.png',
    description: 'Ensuring smooth technical operations and continuous platform improvement.',
    social: {
      github: 'https://github.com/Kallolx'
    }
  }
];

const TeamMemberCard = ({ member }) => (
  <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:-translate-y-1 duration-300 touch-manipulation">
    {/* Image Container */}
    <div className="aspect-[3/4] overflow-hidden">
      <img 
        src={member.image} 
        alt={member.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    
    {/* Content Overlay */}
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2B7A0B]/90 to-transparent p-3 md:p-4 text-white">
      {/* Title Area - Always Visible */}
      <div className="mb-2 md:mb-3">
        <h3 className="text-sm md:text-lg font-bold leading-tight">{member.name}</h3>
        <p className="text-green-200 text-xs md:text-sm font-medium">{member.position}</p>
      </div>
      
      {/* Description - Always Visible on Mobile, Hover on Desktop */}
      <div className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-xs md:text-sm text-green-100 mb-2 md:mb-3">
          {member.description}
        </p>
        
        {/* Social Links - Only show if social links exist */}
        {member.social && (
          <div className="flex gap-2">
            {member.social.linkedin && (
              <a 
                href={member.social.linkedin}
                className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors active:bg-white/30"
              >
                <FaLinkedin className="text-sm md:text-base" />
              </a>
            )}
            {member.social.twitter && (
              <a 
                href={member.social.twitter}
                className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors active:bg-white/30"
              >
                <FaTwitter className="text-sm md:text-base" />
              </a>
            )}
            {member.social.github && (
              <a 
                href={member.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors active:bg-white/30"
              >
                <svg 
                  className="w-4 h-4 md:w-5 md:h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

const TeamMembers = () => {
  return (
    <div className="py-8 md:py-16 px-4 bg-[#F3F9F1]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-3xl font-bold mb-3 text-gray-800">
            Meet Our Team
          </h2>
          <div className="w-16 md:w-24 h-1 bg-[#2B7A0B] mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            The passionate individuals behind our mission to deliver fresh, organic products to your doorstep
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* Join Team Banner */}
        <div className="mt-8 md:mt-12 bg-white rounded-xl p-4 md:p-6 text-center shadow-sm">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
            Join Our Growing Team
          </h3>
          <p className="text-gray-600 text-sm md:text-base mb-4 max-w-2xl mx-auto">
            We're always looking for passionate individuals who share our vision for sustainable organic food delivery
          </p>
          <button className="inline-flex items-center gap-2 bg-[#2B7A0B] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#236209] transition-colors">
            View Open Positions
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers; 