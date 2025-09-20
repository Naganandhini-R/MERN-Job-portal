import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Using SVG icons instead of lucide-react to avoid dependency issues

const SkillsLearning = () => {
  const { userData, userApplications } = useContext(AppContext);
  const [selectedSkill, setSelectedSkill] = useState('Node.js');
  const [completedCourses, setCompletedCourses] = useState([]);
  const [bookmarkedVideos, setBookmarkedVideos] = useState([]);

  // Skills data with real learning resources
  const skillsData = {
    'Node.js': {
      marketDemand: 95,
      gap: 50,
      currentLevel: 30,
      requiredLevel: 80,
      resources: [
        {
          type: 'youtube',
          title: 'Node.js Complete Course 2024',
          channel: 'Programming with Mosh',
          duration: '3:45:30',
          views: '2.1M',
          rating: 4.9,
          thumbnail: 'https://img.youtube.com/vi/TlB_eWDSMt4/maxresdefault.jpg',
          url: 'https://youtube.com/watch?v=TlB_eWDSMt4',
          difficulty: 'Beginner',
          description: 'Complete Node.js tutorial covering fundamentals to advanced concepts'
        },
        {
          type: 'youtube',
          title: 'Build REST APIs with Node.js',
          channel: 'Traversy Media',
          duration: '2:15:45',
          views: '1.8M',
          rating: 4.8,
          thumbnail: 'https://img.youtube.com/vi/L72fhGm1tfE/maxresdefault.jpg',
          url: 'https://youtube.com/watch?v=L72fhGm1tfE',
          difficulty: 'Intermediate',
          description: 'Learn to build RESTful APIs using Node.js and Express'
        },
        {
          type: 'course',
          title: 'Node.js Fundamentals - freeCodeCamp',
          provider: 'freeCodeCamp',
          duration: '8 hours',
          price: 'Free',
          rating: 4.7,
          url: 'https://freecodecamp.org/learn/back-end-development-and-apis/',
          difficulty: 'Beginner',
          description: 'Free comprehensive Node.js course with hands-on projects'
        }
      ]
    },
    'React': {
      marketDemand: 92,
      gap: 35,
      currentLevel: 45,
      requiredLevel: 80,
      resources: [
        {
          type: 'youtube',
          title: 'React Course for Beginners',
          channel: 'freeCodeCamp.org',
          duration: '11:55:07',
          views: '4.2M',
          rating: 4.8,
          thumbnail: 'https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg',
          url: 'https://youtube.com/watch?v=bMknfKXIFA8',
          difficulty: 'Beginner',
          description: 'Complete React tutorial from basics to advanced concepts'
        },
        {
          type: 'youtube',
          title: 'React Hooks Tutorial',
          channel: 'The Net Ninja',
          duration: '2:30:15',
          views: '1.1M',
          rating: 4.7,
          thumbnail: 'https://img.youtube.com/vi/6RhOzQciVwI/maxresdefault.jpg',
          url: 'https://youtube.com/watch?v=6RhOzQciVwI',
          difficulty: 'Intermediate',
          description: 'Master React Hooks with practical examples'
        }
      ]
    },
    'Docker': {
      marketDemand: 85,
      gap: 60,
      currentLevel: 10,
      requiredLevel: 70,
      resources: [
        {
          type: 'youtube',
          title: 'Docker Tutorial for Beginners',
          channel: 'TechWorld with Nana',
          duration: '3:10:45',
          views: '3.2M',
          rating: 4.9,
          thumbnail: 'https://img.youtube.com/vi/3c-iBn73dDE/maxresdefault.jpg',
          url: 'https://youtube.com/watch?v=3c-iBn73dDE',
          difficulty: 'Beginner',
          description: 'Complete Docker tutorial from basics to containerization'
        }
      ]
    },
    'AWS': {
      marketDemand: 90,
      gap: 55,
      currentLevel: 20,
      requiredLevel: 75,
      resources: [
        {
          type: 'youtube',
          title: 'AWS Full Course for Beginners',
          channel: 'freeCodeCamp.org',
          duration: '4:20:15',
          views: '1.5M',
          rating: 4.7,
          thumbnail: 'https://img.youtube.com/vi/3hLmDS179YE/maxresdefault.jpg',
          url: 'https://youtube.com/watch?v=3hLmDS179YE',
          difficulty: 'Beginner',
          description: 'Complete AWS cloud computing course covering core services'
        }
      ]
    }
  };

  // Load saved data from localStorage
  useEffect(() => {
    const savedCompleted = localStorage.getItem('completedCourses');
    const savedBookmarks = localStorage.getItem('bookmarkedVideos');
    
    if (savedCompleted) {
      setCompletedCourses(JSON.parse(savedCompleted));
    }
    if (savedBookmarks) {
      setBookmarkedVideos(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('completedCourses', JSON.stringify(completedCourses));
  }, [completedCourses]);

  useEffect(() => {
    localStorage.setItem('bookmarkedVideos', JSON.stringify(bookmarkedVideos));
  }, [bookmarkedVideos]);

  const toggleBookmark = (resource) => {
    setBookmarkedVideos(prev => 
      prev.find(item => item.url === resource.url)
        ? prev.filter(item => item.url !== resource.url)
        : [...prev, resource]
    );
  };

  const markAsCompleted = (resource) => {
    setCompletedCourses(prev => 
      prev.find(item => item.url === resource.url)
        ? prev.filter(item => item.url !== resource.url)
        : [...prev, resource]
    );
  };

  const isCompleted = (resource) => {
    return completedCourses.some(item => item.url === resource.url);
  };

  const isBookmarked = (resource) => {
    return bookmarkedVideos.some(item => item.url === resource.url);
  };

  const currentSkillData = skillsData[selectedSkill];

  const ResourceCard = ({ resource }) => {
    const getTypeIcon = (type) => {
      switch(type) {
        case 'youtube': return (
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        );
        case 'course': return (
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        );
        case 'article': return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        );
        default: return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
        );
      }
    };

    const getDifficultyColor = (difficulty) => {
      switch(difficulty?.toLowerCase()) {
        case 'beginner': return 'bg-green-100 text-green-700';
        case 'intermediate': return 'bg-yellow-100 text-yellow-700';
        case 'advanced': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${isCompleted(resource) ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
        <div className="flex items-start gap-3">
          {resource.thumbnail && (
            <img 
              src={resource.thumbnail} 
              alt={resource.title}
              className="w-24 h-16 object-cover rounded flex-shrink-0"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                {getTypeIcon(resource.type)}
                <h4 className="font-semibold text-gray-800 truncate">{resource.title}</h4>
              </div>
              
              <button
                onClick={() => toggleBookmark(resource)}
                className={`p-1 rounded flex-shrink-0 ${isBookmarked(resource) ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
              >
                <svg className={`w-4 h-4 ${isBookmarked(resource) ? 'fill-current' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
              {resource.channel && <span>by {resource.channel}</span>}
              {resource.provider && <span>by {resource.provider}</span>}
              
              {resource.duration && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  {resource.duration}
                </span>
              )}
              
              {resource.readTime && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  {resource.readTime}
                </span>
              )}
              
              {resource.views && <span>{resource.views} views</span>}
              
              {resource.rating && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {resource.rating}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                {resource.difficulty}
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => markAsCompleted(resource)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    isCompleted(resource) 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isCompleted(resource) ? 'Completed' : 'Mark Complete'}
                </button>
                
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1"
                >
                  {resource.type === 'youtube' ? 'Watch' : 'Learn'}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {resource.description && (
              <p className="text-sm text-gray-600">{resource.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container px-4 2xl:px-20 mx-auto py-8 min-h-[70vh]">
        {/* Header */}
        
        {/* Header */}
<div className="mb-8">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
      {/* Inline trending-up SVG */}
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" />
      </svg>
    </div>
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Skills Learning Hub</h1>
      <p className="text-gray-600">
        Master the skills you need with curated learning resources
      </p>
    </div>
  </div>
</div>


        {/* Skills Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Priority Skills to Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(skillsData).map(([skill, data]) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedSkill === skill 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{skill}</h3>
                  <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                    Gap: {data.gap}%
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  Market Demand: {data.marketDemand}%
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Current Level</span>
                    <span>{data.currentLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${data.currentLevel}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Required Level</span>
                    <span>{data.requiredLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-400 h-2 rounded-full" 
                      style={{ width: `${data.requiredLevel}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Resources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Learning Resources for {selectedSkill}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{currentSkillData.resources.length} resources available</span>
              <span>{completedCourses.filter(course => 
                currentSkillData.resources.some(r => r.url === course.url)
              ).length} completed</span>
            </div>
          </div>

          <div className="grid gap-4">
            {currentSkillData.resources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>

          {/* Learning Path Suggestion */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-800 mb-2">🎯 Suggested Learning Path</h3>
            <p className="text-sm text-gray-600 mb-3">
              To close the {currentSkillData.gap}% skill gap in {selectedSkill}, we recommend starting with beginner resources and progressing through intermediate content.
            </p>
            <div className="flex flex-wrap gap-2">
              {currentSkillData.resources
                .sort((a, b) => {
                  const order = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
                  return (order[a.difficulty?.toLowerCase()] || 2) - (order[b.difficulty?.toLowerCase()] || 2);
                })
                .slice(0, 3)
                .map((resource, index) => (
                  <span key={index} className="bg-white px-3 py-1 rounded-full text-sm border">
                    {index + 1}. {resource.title}
                  </span>
                ))
              }
            </div>
          </div>
        </div>

        {/* Bookmarked Resources */}
        {bookmarkedVideos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">📚 Bookmarked Resources ({bookmarkedVideos.length})</h2>
            <div className="grid gap-4">
              {bookmarkedVideos.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SkillsLearning;