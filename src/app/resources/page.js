"use client"
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faVideo, faChevronDown, faChevronUp, faPlay, faTimes } from "@fortawesome/free-solid-svg-icons";

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [cloudinaryVideos, setCloudinaryVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Fetch videos from Cloudinary via API route (Search API)
  useEffect(() => {
    const fetchCloudinaryVideos = async () => {
      try {
        const res = await fetch("/api/cloudinary-videos");
        if (!res.ok) {
          console.error("Failed to load Cloudinary videos");
          return;
        }
        const data = await res.json();
        setCloudinaryVideos(data.videos || []);
      } catch (error) {
        console.error("Error loading Cloudinary videos:", error);
      }
    };

    fetchCloudinaryVideos();
  }, []);

  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Resources data - all videos are fetched dynamically from Cloudinary API
  const resourcesData = {
    "engineering": {
      title: "Engineering",
      icon: "⚙️",
      subCategories: {
        "computer-science": {
          name: "Computer Science",
          resources: cloudinaryVideos.map(video => ({
            type: "video",
            title: video.public_id.split('/').pop().replace(/_/g, ' ').replace(/\.[^/.]+$/, '') || video.public_id,
            url: video.secure_url,
            description: video.folder ? `From folder: ${video.folder}` : "Video lecture from Cloudinary"
          }))
        }
      }
    }
  };

  const handleResourceClick = (resource) => {
    if (resource.type === "video" && resource.url && resource.url !== "#") {
      setSelectedVideo(resource);
      setIsVideoModalOpen(true);
    }
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#1e293b] to-[#0F172A] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Study Resources Databank
          </h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto">
            Access comprehensive video study materials for Engineering courses
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Cards */}
        <div className="flex justify-center mb-12">
          {Object.entries(resourcesData).map(([key, category]) => (
            <div
              key={key}
              className={`bg-[#1e293b] rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 w-full max-w-md ${selectedCategory === key
                ? 'border-[#F39C12] shadow-lg'
                : 'border-transparent hover:border-[#F39C12]'
                }`}
              onClick={() => {
                setSelectedCategory(selectedCategory === key ? null : key);
                setSelectedSubCategory(null);
              }}
            >
              <div className="text-5xl mb-4 text-center">{category.icon}</div>
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                {category.title}
              </h2>
              <p className="text-white text-center text-sm">
                {Object.keys(category.subCategories).length} subjects available
              </p>
            </div>
          ))}
        </div>

        {/* Resources Display */}
        {selectedCategory && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">
                {resourcesData[selectedCategory].title} - Subjects
              </h2>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubCategory(null);
                }}
                className="text-white hover:text-[#F39C12] transition-colors"
              >
                Close
              </button>
            </div>

            {/* Sub-Categories */}
            <div className="space-y-4">
              {Object.entries(resourcesData[selectedCategory].subCategories).map(([subKey, subCategory]) => (
                <div
                  key={subKey}
                  className="bg-[#1e293b] rounded-lg overflow-hidden border border-gray-700"
                >
                  <button
                    onClick={() => toggleCategory(subKey)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#334155] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FontAwesomeIcon icon={faBook} className="text-white text-xl" />
                      <h3 className="text-xl font-semibold text-white">{subCategory.name}</h3>
                      <span className="text-sm text-white">
                        ({subCategory.resources.length} resources)
                      </span>
                    </div>
                    <FontAwesomeIcon
                      icon={expandedCategories[subKey] ? faChevronUp : faChevronDown}
                      className="text-white"
                    />
                  </button>

                  {expandedCategories[subKey] && (
                    <div className="px-6 py-4 bg-[#0F172A]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subCategory.resources.map((resource, index) => (
                          <div
                            key={index}
                            className="bg-[#1e293b] rounded-lg p-4 hover:bg-[#334155] transition-all duration-300 cursor-pointer border border-gray-700 hover:border-[#F39C12]"
                            onClick={() => handleResourceClick(resource)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="p-3 rounded-lg bg-red-500/20 text-red-400">
                                <FontAwesomeIcon
                                  icon={faVideo}
                                  className="text-xl"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">
                                  {resource.title}
                                </h4>
                                <p className="text-sm text-white mb-3">
                                  {resource.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                  <FontAwesomeIcon icon={faPlay} className="text-white" />
                                  <span className="text-white">Watch Video</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedCategory && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              Select a category to view resources
            </h3>
            <p className="text-white">
              Click on Engineering to explore study materials
            </p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {isVideoModalOpen && selectedVideo && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-8 bg-black/70 backdrop-blur-sm"
          onClick={closeVideoModal}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#020617] rounded-2xl border border-gray-700 overflow-hidden shadow-2xl transform transition-all duration-300 ease-out"
            style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - More Visible */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 bg-[#F39C12] hover:bg-[#e67e22] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
              aria-label="Close video player"
              style={{ minWidth: "44px", minHeight: "44px" }}
            >
              <FontAwesomeIcon icon={faTimes} className="text-2xl" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 pr-20">
              <h3 className="text-lg md:text-xl font-semibold text-white truncate">
                {selectedVideo.title}
              </h3>
            </div>

            {/* Video Player */}
            <div className="relative w-full bg-black">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <video
                  className="absolute top-0 left-0 w-full h-full"
                  controls
                  controlsList="nodownload"
                  autoPlay
                  src={selectedVideo.url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Video Description */}
            {selectedVideo.description && (
              <div className="px-6 py-4 border-t border-gray-700">
                <p className="text-white text-sm">
                  {selectedVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResourcesPage;

