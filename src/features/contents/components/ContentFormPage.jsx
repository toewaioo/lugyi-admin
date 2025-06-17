// src/features/contents/components/ContentFormPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  createNewContent,
  fetchContentById,
  updateExistingContent,
} from "../redux/contentActions";
import useImageValidator from "../../../hook/useImageValidator";
// --- Step 1: Basic Information ---
const StepBasicInfo = ({
  formData,
  handleChange,
  formErrors,
  addTag,
  removeTag,
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Step 1: Basic Information
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 block w-full border ${
            formErrors.title ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Example Movie Title"
          required
        />
        {formErrors.title && (
          <p className="text-red-500 text-xs italic mt-1">{formErrors.title}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700"
        >
          Duration (e.g., HH:MM:SS)
        </label>
        <input
          type="text"
          name="duration"
          id="duration"
          value={formData.duration}
          onChange={handleChange}
          className={`mt-1 block w-full border ${
            formErrors.duration ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="2:15:00"
          required
        />
        {formErrors.duration && (
          <p className="text-red-500 text-xs italic mt-1">
            {formErrors.duration}
          </p>
        )}
      </div>
    </div>
    <div>
      <label
        htmlFor="content"
        className="block text-sm font-medium text-gray-700"
      >
        Content Description
      </label>
      <textarea
        name="content"
        id="content"
        rows="4"
        value={formData.content}
        onChange={handleChange}
        className={`mt-1 block w-full border ${
          formErrors.content ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
        placeholder="Full movie description here..."
        required
      ></textarea>
      {formErrors.content && (
        <p className="text-red-500 text-xs italic mt-1">{formErrors.content}</p>
      )}
    </div>
    <div>
      <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-700"
      >
        Category
      </label>
      <input
        type="text"
        name="category"
        id="category"
        value={formData.category}
        onChange={handleChange}
        className={`mt-1 block w-full border ${
          formErrors.category ? "border-red-500" : "border-gray-300"
        } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
        placeholder="Engsub, Dubbed, etc."
        required
      />
      {formErrors.category && (
        <p className="text-red-500 text-xs italic mt-1">
          {formErrors.category}
        </p>
      )}
    </div>

    {/* Tags Input and View */}
    <div>
      <label
        htmlFor="tagInput"
        className="block text-sm font-medium text-gray-700"
      >
        Tags
      </label>
      <div className="flex items-center space-x-2 mt-1">
        <input
          type="text"
          id="tagInput"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim() !== "") {
              e.preventDefault(); // Prevent form submission
              addTag(e.target.value.trim());
              e.target.value = ""; // Clear input
            }
          }}
          className="block flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add a tag and press Enter"
        />
        <button
          type="button"
          onClick={() => {
            const input = document.getElementById("tagInput");
            if (input.value.trim() !== "") {
              addTag(input.value.trim());
              input.value = "";
            }
          }}
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          Add
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {formData.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-2 -mr-0.5 h-4 w-4 flex-shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  </div>
);
// In StepMediaAndFiles component
const ProfileImgPreview = ({ url }) => {
  const { isValid, isLoading, error } = useImageValidator(url);

  if (!url) return null;

  if (isLoading) {
    return (
      <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 text-center">
        <p className="text-sm text-gray-600">Loading preview...</p>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="mt-2 p-2 border border-red-200 rounded-md bg-red-50 text-center">
        <p className="text-sm text-red-600">{error || "Invalid image URL"}</p>
      </div>
    );
  }

  return (
    <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 text-center">
      <p className="text-sm text-gray-600 mb-1">Profile Image Preview:</p>
      <img
        src={url}
        alt="Profile Preview"
        className="max-w-full h-auto max-h-48 object-contain mx-auto rounded-md"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150?text=Invalid+Image";
        }}
      />
    </div>
  );
};
// In StepMediaAndFiles component
const CoverImgPreview = ({ url }) => {
  const { isValid, isLoading, error } = useImageValidator(url);

  if (!url) return null;

  if (isLoading) {
    return (
      <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 text-center">
        <p className="text-sm text-gray-600">Loading preview...</p>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="mt-2 p-2 border border-red-200 rounded-md bg-red-50 text-center">
        <p className="text-sm text-red-600">{error || "Invalid image URL"}</p>
      </div>
    );
  }

  return (
    <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 text-center">
      <p className="text-sm text-gray-600 mb-1">Cover Image Preview:</p>
      <img
        src={url}
        alt="Cover Preview"
        className="max-w-full h-auto max-h-48 object-contain mx-auto rounded-md"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/300x150?text=Invalid+Image";
        }}
      />
    </div>
  );
};
// --- Step 2: Media and Files ---
const StepMediaAndFiles = ({
  formData,
  handleChange,
  handleFileArrayChange,
  addFileEntry,
  removeFileEntry,
  formErrors,
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Step 2: Media and Files
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          htmlFor="profileImg"
          className="block text-sm font-medium text-gray-700"
        >
          Profile Image URL
        </label>
        <input
          type="url"
          name="profileImg"
          id="profileImg"
          value={formData.profileImg}
          onChange={handleChange}
          className={`mt-1 block w-full border ${
            formErrors.profileImg ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="https://example.com/images/profile.jpg"
          required
        />
        {formErrors.profileImg && (
          <p className="text-red-500 text-xs italic mt-1">
            {formErrors.profileImg}
          </p>
        )}
        {formData.profileImg && <ProfileImgPreview url={formData.profileImg} />}
      </div>
      <div>
        <label
          htmlFor="coverImg"
          className="block text-sm font-medium text-gray-700"
        >
          Cover Image URL
        </label>
        <input
          type="url"
          name="coverImg"
          id="coverImg"
          value={formData.coverImg}
          onChange={handleChange}
          className={`mt-1 block w-full border ${
            formErrors.coverImg ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="https://example.com/covers/cover.jpg"
          required
        />
        {formErrors.coverImg && (
          <p className="text-red-500 text-xs italic mt-1">
            {formErrors.coverImg}
          </p>
        )}
        {formData.coverImg && <CoverImgPreview url={formData.coverImg} />}
      </div>
    </div>

    {/* Files - Trailer */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Trailer File
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div>
          <label
            htmlFor="trailerUrl"
            className="block text-xs font-medium text-gray-500"
          >
            URL
          </label>
          <input
            type="url"
            name="files.trailer.url"
            id="trailerUrl"
            value={formData.files.trailer?.url || ""}
            onChange={handleChange}
            className={`mt-1 block w-full border ${
              formErrors.trailerUrl ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm p-2`}
            placeholder="https://example.com/trailer.mp4"
          />
          {formErrors.trailerUrl && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.trailerUrl}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="trailerQuality"
            className="block text-xs font-medium text-gray-500"
          >
            Quality
          </label>
          <input
            type="text"
            name="files.trailer.quality"
            id="trailerQuality"
            value={formData.files.trailer?.quality || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="1080p"
          />
        </div>
        <div>
          <label
            htmlFor="trailerSize"
            className="block text-xs font-medium text-gray-500"
          >
            Size
          </label>
          <input
            type="text"
            name="files.trailer.size"
            id="trailerSize"
            value={formData.files.trailer?.size || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="250MB"
          />
        </div>
      </div>
    </div>

    {/* Files - Stream */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Stream Files
      </label>
      {formData.files.stream.map((file, index) => (
        <div key={index} className="flex space-x-2 mb-2 items-end">
          <div className="flex-1">
            <label
              htmlFor={`streamUrl${index}`}
              className="block text-xs font-medium text-gray-500"
            >
              URL
            </label>
            <input
              type="url"
              id={`streamUrl${index}`}
              value={file.url}
              onChange={(e) =>
                handleFileArrayChange(index, "url", e.target.value, "stream")
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="https://stream.com/v1.mp4"
            />
          </div>
          <div className="w-1/4">
            <label
              htmlFor={`streamQuality${index}`}
              className="block text-xs font-medium text-gray-500"
            >
              Quality
            </label>
            <input
              type="text"
              id={`streamQuality${index}`}
              value={file.quality}
              onChange={(e) =>
                handleFileArrayChange(
                  index,
                  "quality",
                  e.target.value,
                  "stream"
                )
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="720p"
            />
          </div>
          <div className="w-1/4">
            <label
              htmlFor={`streamSize${index}`}
              className="block text-xs font-medium text-gray-500"
            >
              Size
            </label>
            <input
              type="text"
              id={`streamSize${index}`}
              value={file.size}
              onChange={(e) =>
                handleFileArrayChange(index, "size", e.target.value, "stream")
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="1.2GB"
            />
          </div>
          <button
            type="button"
            onClick={() => removeFileEntry(index, "stream")}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 mb-1"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addFileEntry("stream")}
        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
      >
        Add Stream File
      </button>
      {formErrors.stream && (
        <p className="text-red-500 text-xs italic mt-1">{formErrors.stream}</p>
      )}
      {formData.files.stream.map(
        (file, index) =>
          formErrors[`streamUrl${index}`] && (
            <p
              key={`error-${index}`}
              className="text-red-500 text-xs italic mt-1"
            >
              {formErrors[`streamUrl${index}`]}
            </p>
          )
      )}
    </div>
  </div>
);

// --- Step 3: Advanced Details (Casts, Links, VIP) ---
const StepAdvancedDetails = ({
  formData,
  handleChange,
  handleArrayChange,
  handleCastChange,
  addCast,
  removeCast,
  addFileEntry,
  removeFileEntry,
  handleFileArrayChange,
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      Step 3: Advanced Details
    </h2>
    <div>
      <label
        htmlFor="links"
        className="block text-sm font-medium text-gray-700"
      >
        Image Links (comma-separated Image URLs)
      </label>
      <input
        type="text"
        name="links"
        id="links"
        value={formData.links.join(", ")}
        onChange={(e) => handleArrayChange(e, "links")}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="https://imdb.com/title123, https://rotten-tomatoes.com/movie456"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Casts
      </label>
      {formData.casts.map((cast, index) => (
        <div key={index} className="flex space-x-2 mb-2 items-end">
          <input
            type="text"
            value={cast.name}
            onChange={(e) => handleCastChange(index, "name", e.target.value)}
            className="block w-full flex-1 border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Actor Name"
          />
          <input
            type="text"
            value={cast.role}
            onChange={(e) => handleCastChange(index, "role", e.target.value)}
            className="block w-full flex-1 border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Role (e.g., Actor, Director)"
          />
          <button
            type="button"
            onClick={() => removeCast(index)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addCast}
        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
      >
        Add Cast
      </button>
    </div>

    {/* Files - Download */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Download Files
      </label>
      {formData.files.download.map((file, index) => (
        <div key={index} className="flex space-x-2 mb-2 items-end">
          <div className="flex-1">
            <label
              htmlFor={`downloadUrl${index}`}
              className="block text-xs font-medium text-gray-500"
            >
              URL
            </label>
            <input
              type="url"
              id={`downloadUrl${index}`}
              value={file.url}
              onChange={(e) =>
                handleFileArrayChange(index, "url", e.target.value, "download")
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="https://download.com/file1.mp4"
            />
          </div>
          <div className="w-1/4">
            <label
              htmlFor={`downloadQuality${index}`}
              className="block text-xs font-medium text-gray-500"
            >
              Quality
            </label>
            <input
              type="text"
              id={`downloadQuality${index}`}
              value={file.quality}
              onChange={(e) =>
                handleFileArrayChange(
                  index,
                  "quality",
                  e.target.value,
                  "download"
                )
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="1080p"
            />
          </div>
          <div className="w-1/4">
            <label
              htmlFor={`downloadSize${index}`}
              className="block text-xs font-medium text-gray-500"
            >
              Size
            </label>
            <input
              type="text"
              id={`downloadSize${index}`}
              value={file.size}
              onChange={(e) =>
                handleFileArrayChange(index, "size", e.target.value, "download")
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="2.5GB"
            />
          </div>
          <button
            type="button"
            onClick={() => removeFileEntry(index, "download")}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 mb-1"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addFileEntry("download")}
        className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
      >
        Add Download File
      </button>
    </div>
    {/* Is VIP */}
    <div className="flex items-center">
      <input
        type="checkbox"
        name="isvip"
        id="isvip"
        checked={formData.isvip}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label
        htmlFor="isvip"
        className="ml-2 block text-sm font-medium text-gray-700"
      >
        Is VIP Content?
      </label>
    </div>
  </div>
);

const ContentFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: contentId } = useParams();
  const { loading, error, selectedContent } = useSelector(
    (state) => state.contents
  );
  const parsedContent = useMemo(() => {
    if (!selectedContent || !selectedContent.content) return null;

    const contentData = selectedContent.content;

    try {
      return {
        ...contentData,
        casts: contentData.casts || [],
        files: {
          // Ensures files object and its nested properties are always present
          trailer: selectedContent.content.files?.trailer || {
            url: "",
            quality: "",
            size: "",
          },
          stream: selectedContent.content.files?.stream || [],
          download: selectedContent.content.files?.download || [],
        },
      };
    } catch (parseError) {
      console.error("Error parsing content data:", parseError);
      return null; // Handle parsing errors gracefully
    }
  }, [selectedContent]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    profileImg: "",
    coverImg: "",
    duration: "",
    links: [],
    content: "",
    tags: [],
    category: "",
    casts: [],
    files: {
      trailer: { url: "", quality: "", size: "" },
      stream: [],
      download: [],
    },
    isvip: false,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (contentId) {
      dispatch(fetchContentById(contentId));
    }
  }, [dispatch, contentId]);

  useEffect(() => {
    if (
      contentId &&
      parsedContent &&
      parsedContent.id.toString() === contentId
    ) {
      // Ensure arrays are initialized if null/undefined from API
      setFormData({
        title: parsedContent.title || "",
        profileImg: parsedContent.profileImg || "",
        coverImg: parsedContent.coverImg || "",
        duration: parsedContent.duration || "",
        links: parsedContent.links || [],
        content: parsedContent.content || "",
        tags: parsedContent.tags || [],
        category: parsedContent.category || "",
        casts: parsedContent.casts || [],
        files: {
          trailer: parsedContent.files?.trailer || {
            url: "",
            quality: "",
            size: "",
          },
          stream: parsedContent.files?.stream || [],
          download: parsedContent.files?.download || [],
        },
        isvip: parsedContent.isvip || false,
      });
    }
  }, [contentId, parsedContent]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      // Handle nested fields like files.trailer.url
      const [parent, child, grandChild] = name.split(".");
      if (grandChild) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...(prev[parent]?.[child] || {}),
              [grandChild]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Dedicated function for handling comma-separated array inputs (e.g., links)
  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  // Functions for Tag management
  const addTag = (tag) => {
    setFormData((prev) => {
      // Only add if tag doesn't already exist and is not empty
      if (tag && !prev.tags.includes(tag)) {
        return { ...prev, tags: [...prev.tags, tag] };
      }
      return prev;
    });
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleCastChange = (index, field, value) => {
    const newCasts = [...formData.casts];
    newCasts[index][field] = value;
    setFormData((prev) => ({ ...prev, casts: newCasts }));
  };

  const addCast = () => {
    setFormData((prev) => ({
      ...prev,
      casts: [...prev.casts, { name: "", role: "" }],
    }));
  };

  const removeCast = (index) => {
    setFormData((prev) => ({
      ...prev,
      casts: prev.casts.filter((_, i) => i !== index),
    }));
  };

  const handleFileArrayChange = (index, subField, value, fileType) => {
    const newFiles = [...formData.files[fileType]];
    if (!newFiles[index]) {
      newFiles[index] = {};
    }
    newFiles[index][subField] = value;
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: newFiles,
      },
    }));
  };

  const addFileEntry = (fileType) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: [
          ...prev.files[fileType],
          { url: "", quality: "", size: "" },
        ],
      },
    }));
  };

  const removeFileEntry = (index, fileType) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: prev.files[fileType].filter((_, i) => i !== index),
      },
    }));
  };

  const validateStep = (step) => {
    const errors = {};
    let isValid = true;

    // Clear previous errors for this step before validating
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (step === 1) {
        delete newErrors.title;
        delete newErrors.duration;
        delete newErrors.content;
        delete newErrors.category;
      } else if (step === 2) {
        delete newErrors.profileImg;
        delete newErrors.coverImg;
        delete newErrors.trailerUrl;
      }
      return newErrors;
    });

    console.log(step);
    if (step === 1) {
      if (!formData.title) errors.title = "Title is required";
      if (!formData.duration) errors.duration = "Duration is required";
      if (!formData.content) errors.content = "Content description is required";
      if (!formData.category) errors.category = "Category is required";
    } else if (step === 2) {
      if (!formData.profileImg)
        errors.profileImg = "Profile Image URL is required";
      if (formData.profileImg && !/^https?:\/\/.+/.test(formData.profileImg))
        errors.profileImg = "Invalid URL format";
      if (!formData.coverImg) errors.coverImg = "Cover Image URL is required";
      if (formData.coverImg && !/^https?:\/\/.+/.test(formData.coverImg))
        errors.coverImg = "Invalid URL format";
      if (!formData.files?.trailer?.url) {
        errors.trailerUrl = "Trailer URL is required";
      } else if (!/^https?:\/\/.+/.test(formData.files.trailer.url)) {
        errors.trailerUrl = "Invalid URL format";
      }
      if (formData.files.stream.length === 0) {
        errors.download = "At least one stream file is required";
      } else {
        formData.files.stream.forEach((file, index) => {
          if (!file.url) {
            errors[
              `downloadUrl${index}`
            ] = `Download URL is required for file ${index + 1}`;
          } else if (!/^https?:\/\/.+/.test(file.url)) {
            errors[`downloadUrl${index}`] = `Invalid URL format for file ${
              index + 1
            }`;
          }
        });
      }
    } else if (step == 3) {
      if (formData.files.download.length === 0) {
        errors.download = "At least one download file is required";
      } else {
        formData.files.download.forEach((file, index) => {
          if (!file.url) {
            errors[
              `downloadUrl${index}`
            ] = `Download URL is required for file ${index + 1}`;
          } else if (!/^https?:\/\/.+/.test(file.url)) {
            errors[`downloadUrl${index}`] = `Invalid URL format for file ${
              index + 1
            }`;
          }
        });
      }
    } else if (step === 4) {
      setFormErrors((prev) => ({ ...prev, ...errors }));

      isValid = Object.keys(errors).length === 0;
      return isValid;
    }
    if (currentStep == 3 && contentId) {
      //for update content, we can skip validation for optional fields
      //contentId is present, so we can assume the content already exists
      setCurrentStep(currentStep + 1);
      return false;
    }

    // Step 3 has optional fields, so it might always return true unless you add more requirements

    setFormErrors((prev) => ({ ...prev, ...errors }));

    isValid = Object.keys(errors).length === 0;
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) {
      return;
    }

    try {
      if (contentId) {
        await dispatch(updateExistingContent(contentId, formData));
        alert("Content updated successfully!");
      } else {
        await dispatch(createNewContent(formData));
        alert("Content created successfully!");
      }
      navigate("/contents");
    } catch (err) {
      console.error("Failed to save content:", err);
      // More detailed error message from backend if available
      alert(
        `Error: ${
          err.message ||
          (err.errors ? JSON.stringify(err.errors) : JSON.stringify(err))
        }`
      );
    }
  };

  if (contentId && loading && !selectedContent) {
    return <div className="text-center p-6">Loading content...</div>;
  }
  if (contentId && error) {
    return (
      <div className="text-center p-6 text-red-500">
        Error loading content: {error.message}
      </div>
    );
  }

  const renderStep = () => {
    console.log("Current Step:", currentStep);
    switch (currentStep) {
      case 1:
        return (
          <StepBasicInfo
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
            addTag={addTag}
            removeTag={removeTag}
          />
        );
      case 2:
        return (
          <StepMediaAndFiles
            formData={formData}
            handleChange={handleChange}
            handleFileArrayChange={handleFileArrayChange}
            addFileEntry={addFileEntry}
            removeFileEntry={removeFileEntry}
            formErrors={formErrors}
          />
        );
      case 3:
        return (
          <StepAdvancedDetails
            formData={formData}
            handleChange={handleChange}
            handleArrayChange={handleArrayChange}
            handleCastChange={handleCastChange}
            addCast={addCast}
            removeCast={removeCast}
            addFileEntry={addFileEntry}
            removeFileEntry={removeFileEntry}
            handleFileArrayChange={handleFileArrayChange}
          />
        );
      case 4:
        return (
          <StepAdvancedDetails
            formData={formData}
            handleChange={handleChange}
            handleArrayChange={handleArrayChange}
            handleCastChange={handleCastChange}
            addCast={addCast}
            removeCast={removeCast}
            addFileEntry={addFileEntry}
            removeFileEntry={removeFileEntry}
            handleFileArrayChange={handleFileArrayChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {contentId ? "Edit Content" : "Create New Content"}
      </h1>

      {/* Step Indicator */}
      <div className="flex justify-center mb-8">
        <div
          className={`w-1/3 text-center ${
            currentStep >= 1 ? "text-blue-600 font-bold" : "text-gray-400"
          }`}
        >
          <div
            className={`p-2 rounded-full mx-auto mb-2 ${
              currentStep >= 1 ? "bg-blue-100" : "bg-gray-100"
            } w-10 h-10 flex items-center justify-center`}
          >
            1
          </div>
          Basic Info
        </div>
        <div className="flex-1 border-t-2 border-gray-200 mt-5"></div>
        <div
          className={`w-1/3 text-center ${
            currentStep >= 2 ? "text-blue-600 font-bold" : "text-gray-400"
          }`}
        >
          <div
            className={`p-2 rounded-full mx-auto mb-2 ${
              currentStep >= 2 ? "bg-blue-100" : "bg-gray-100"
            } w-10 h-10 flex items-center justify-center`}
          >
            2
          </div>
          Media & Files
        </div>
        <div className="flex-1 border-t-2 border-gray-200 mt-5"></div>
        <div
          className={`w-1/3 text-center ${
            currentStep >= 3 ? "text-blue-600 font-bold" : "text-gray-400"
          }`}
        >
          <div
            className={`p-2 rounded-full mx-auto mb-2 ${
              currentStep >= 3 ? "bg-blue-100" : "bg-gray-100"
            } w-10 h-10 flex items-center justify-center`}
          >
            3
          </div>
          Advanced Details
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep == 1 && (
            <button
              type="button"
              onClick={() => navigate("/contents")}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                currentStep === 1 ? "ml-auto" : ""
              }`}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-auto"
              disabled={loading}
            >
              {loading
                ? contentId
                  ? "Updating..."
                  : "Creating..."
                : contentId
                ? "Update Content"
                : "Create Content"}
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            Error: {error.message || JSON.stringify(error)}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContentFormPage;
