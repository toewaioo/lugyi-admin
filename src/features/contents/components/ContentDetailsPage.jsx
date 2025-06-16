// src/features/contents/components/ContentDetailsPage.jsx
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { fetchContentById } from '../redux/contentActions'; // Your existing action

const ContentDetailsPage = () => {
  const { id } = useParams(); // Get content ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedContent, loading, error } = useSelector((state) => state.contents);

  useEffect(() => {
    // Fetch content details when component mounts or ID changes
    if (id) {
      dispatch(fetchContentById(id));
    }
  }, [dispatch, id]);

  // Use useMemo to parse stringified JSON data only when selectedContent changes
  const parsedContent = useMemo(() => {
    if (!selectedContent || !selectedContent.content) return null;

    const contentData = selectedContent.content;

    try {
      return {
        ...contentData,
        casts: contentData.casts ? JSON.parse(contentData.casts) : [],
        files: { // Ensures files object and its nested properties are always present
            trailer: selectedContent.content.files?.trailer || { url: '', quality: '', size: '' },
            stream: selectedContent.content.files?.stream || [],
            download: selectedContent.content.files?.download || [],
          }
      };
    } catch (parseError) {
      console.error("Error parsing content data:", parseError);
      return null; // Handle parsing errors gracefully
    }
  }, [selectedContent]);


  if (loading) {
    return <div className="text-center p-6 text-gray-700">Loading content details...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">Error: {error.message || "Could not load content details."}</div>;
  }

  if (!parsedContent) {
    return <div className="text-center p-6 text-gray-700">Content not found.</div>;
  }

  const {
    title, profileImg, coverImg, duration, links, content,
    tags, category, casts, files, isvip, views_count
  } = parsedContent;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-5xl mx-auto my-8">
      <button
        onClick={() => navigate('/contents')}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
      >
        &larr; Back to Contents List
      </button>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{title}</h1>

      {/* Cover Image */}
      {coverImg && (
        <div className="mb-6">
          <img
            src={coverImg}
            alt={`${title} Cover`}
            className="w-full h-96 object-cover rounded-lg shadow-md"
            onError={(e) => e.target.src = 'https://via.placeholder.com/1280x720?text=No+Cover+Image'}
          />
        </div>
      )}

      {/* Profile Image (smaller, perhaps next to title or description) */}
      {profileImg && (
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={profileImg}
            alt={`${title} Profile`}
            className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
            onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Profile+Image'}
          />
          <div>
            <p className="text-sm text-gray-500">Duration: {duration}</p>
            <p className="text-sm text-gray-500">Category: <span className="font-medium text-gray-700">{category}</span></p>
            <p className="text-sm text-gray-500">Views: {views_count}</p>
            <p className={`text-sm font-semibold ${isvip ? 'text-green-600' : 'text-blue-600'}`}>
              {isvip ? 'VIP Content' : 'Free Content'}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>

      {tags && tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {casts && casts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Casts</h2>
          <ul className="list-disc list-inside text-gray-700">
            {casts.map((cast, index) => (
              <li key={index}>{cast.name} ({cast.role})</li>
            ))}
          </ul>
        </div>
      )}

      {links && links.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Related Links</h2>
          <ul className="list-disc list-inside text-blue-600">
            {links.map((link, index) => (
              <li key={index}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {files && (files.trailer?.url || files.stream?.length > 0 || files.download?.length > 0) && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Files</h2>
          {files.trailer?.url && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-1">Trailer</h3>
              <p className="text-gray-700">URL: <a href={files.trailer.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{files.trailer.url}</a></p>
              <p className="text-gray-700">Quality: {files.trailer.quality || 'N/A'}, Size: {files.trailer.size || 'N/A'}</p>
            </div>
          )}
          {files.stream?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-1">Stream Options</h3>
              <ul className="list-disc list-inside text-gray-700">
                {files.stream.map((file, index) => (
                  <li key={index}>
                    URL: <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{file.url}</a> (Quality: {file.quality || 'N/A'}, Size: {file.size || 'N/A'})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {files.download?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-1">Download Options</h3>
              <ul className="list-disc list-inside text-gray-700">
                {files.download.map((file, index) => (
                  <li key={index}>
                    URL: <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{file.url}</a> (Quality: {file.quality || 'N/A'}, Size: {file.size || 'N/A'})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {selectedContent.related_content && selectedContent.related_content.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedContent.related_content.map((related) => (
              <div key={related.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={related.coverImg || 'https://via.placeholder.com/1280x720?text=Related+Content'}
                  alt={related.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{related.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{related.short_description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {related.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/contents/details/${related.id}`)}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentDetailsPage;