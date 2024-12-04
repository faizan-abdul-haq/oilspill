import React, { useState } from 'react';
import axios from 'axios';
import '../styles/detect.css';

const Detect = () => {
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [resultsReceived, setResultsReceived] = useState(false);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSegment = () => {
    if (images.length === 0) {
      setErrorMessage('Please upload images before segmenting.');
      return;
    }

    setSuccessMessage('Images have been sent for segmentation.');
    setLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    axios
      .post('/detect', formData)
      .then((response) => {
        console.log(response.data);
        setResults(response.data.results);
        setResultsReceived(true);
        setShowResults(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error during the file upload', error);
        setErrorMessage('There was an error uploading the images. Please try again.');
        setLoading(false);
      });
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const closeResultsBanner = () => {
    setShowResults(false);
  };

  const handleNewUpload = () => {
    setImages([]);
    setResults([]);
    setResultsReceived(false);
    setShowResults(false);
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="detect-container">
      <h2 className="detect-title">Segment Your SAR Images</h2>

      {showResults && results.length > 0 && (
        <div className="results-banner">
          <button className="close-button" onClick={closeResultsBanner}>
            &times;
          </button>
          <h3 className="results-banner-title">Segmentation Results</h3>
          <div className="results-preview-container">
            {results.map((result, index) => (
              <div key={index} className="result-preview">
                {/* Original uploaded image */}
                <img
                  src={URL.createObjectURL(images[index])}
                  alt={`Uploaded Image ${index}`}
                  className="preview-img"
                />

                {/* Predicted mask/result image */}
                <img
                  src={`data:image/png;base64,${result.predictionMask}`}
                  alt={`Prediction Mask ${index}`}
                  className="preview-img"
                />

                {/* Render pixels and percentage */}
                <div className="result-details">
                  <p>Pixels with Oil Spills: {result.pixelsWithOilSpills}</p>
                  {/* <p>Oil Spill Percentage: {result.oilSpillPercentage}%</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!resultsReceived && (
        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                className="preview-img"
              />
              <button className="remove-button" onClick={() => handleRemoveImage(index)}>
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="detect-form">
        {!resultsReceived && (
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="file-input"
              onChange={handleImageUpload}
              id="file-input"
            />
            <div className="button-container">
              <label htmlFor="file-input" className="segment-button upload-button">
                Upload SAR Image
              </label>
              <button className="segment-button" onClick={handleSegment} disabled={loading}>
                {loading ? 'Segmenting...' : 'Segment'}
              </button>
            </div>
          </div>
        )}

        {resultsReceived && (
          <button className="segment-button" onClick={handleNewUpload}>
            Upload New SAR Images
          </button>
        )}
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Detect;
