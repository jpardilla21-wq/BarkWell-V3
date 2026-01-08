import { useState, useEffect } from 'react';
import { getRecommendedContent, getContent, getContentCategories } from '../services/api';

function ContentLibrary({ petId, petName }) {
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [loading, setLoading] = useState(true);
  const [personalization, setPersonalization] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    fetchCategories();
  }, [petId]);

  useEffect(() => {
    fetchContent();
  }, [selectedCategory, selectedFormat]);

  const fetchRecommendations = async () => {
    try {
      const response = await getRecommendedContent(petId, 6);
      if (response.success) {
        setRecommendedContent(response.data.recommended);
        setPersonalization(response.data.personalization);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory !== 'all' ? selectedCategory : undefined;
      const formatParam = selectedFormat !== 'all' ? selectedFormat : undefined;

      const response = await getContent(categoryParam, formatParam);
      if (response.success) {
        setAllContent(response.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getContentCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const formatIcon = (format) => {
    return format === 'Video' ? '🎥' : '📄';
  };

  const categoryIcon = (category) => {
    const icons = {
      'Training': '🎓',
      'Nutrition': '🍖',
      'Health': '💊',
      'Behavior': '🐕',
      'Grooming': '✂️'
    };
    return icons[category] || '📚';
  };

  const ContentCard = ({ content }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {content.thumbnail_url && (
        <img
          src={content.thumbnail_url}
          alt={content.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{categoryIcon(content.category)}</span>
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {content.category}
          </span>
          <span className="text-xs text-gray-500">{formatIcon(content.format)} {content.format}</span>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{content.title}</h3>

        {content.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{content.description}</p>
        )}

        <div className="flex items-center justify-between">
          {content.duration_minutes && (
            <span className="text-xs text-gray-500">⏱️ {content.duration_minutes} min</span>
          )}

          {content.difficulty_level && (
            <span className={`text-xs px-2 py-1 rounded ${
              content.difficulty_level === 'beginner' ? 'bg-green-100 text-green-700' :
              content.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {content.difficulty_level}
            </span>
          )}
        </div>

        {content.tags && content.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {content.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <a
          href={content.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          View Content →
        </a>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Learning Center</h2>
        <p className="text-gray-600">
          Educational content personalized for {petName}
        </p>
      </div>

      {/* Personalized "For You" Section */}
      {recommendedContent.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-bold text-gray-900">✨ For You</h3>
            {personalization && (
              <span className="text-sm text-gray-600">
                Based on {petName}'s profile ({personalization.petAge} years old)
              </span>
            )}
          </div>

          {personalization && personalization.tags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Personalized for:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {personalization.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-white text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </div>
      )}

      {/* Browse All Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Browse All Content</h3>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Formats</option>
              <option value="Video">Videos</option>
              <option value="Article">Articles</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        ) : allContent.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No content found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allContent.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentLibrary;
