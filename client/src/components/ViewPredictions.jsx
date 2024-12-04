import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JSZip from 'jszip';

import '../styles/ViewPredictions.css'; // Optional: Add styles for your component

const ViewPredictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get('/predictions'); // Fetch predictions from backend
        setPredictions(response.data.predictions);
      } catch (err) {
        console.error('Error fetching predictions:', err);
        setError('Failed to load predictions');
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const downloadAll = (prediction) => {
    // Create a zip file to download all assets at once (image, mask, prediction data)
    const jsonData = JSON.stringify(prediction, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const imageBlob = fetch(prediction.imagePath).then(res => res.blob());
    const maskBlob = fetch(prediction.maskPath).then(res => res.blob());

    // Create a zip file and add all blobs to it (requires JSZip library)
    Promise.all([imageBlob, maskBlob]).then(([image, mask]) => {
      const zip = new JSZip();
      zip.file('prediction.json', blob);
      zip.file('image.png', image);
      zip.file('mask.png', mask);
      zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `prediction_${prediction.predictionId}.zip`;
        link.click();
      });
    });
  };

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div className="predictions-container">
      <h1 className="predictions-title">Your Past Predictions</h1>
      {predictions.length === 0 ? (
        <p className="no-predictions-text">No predictions found.</p>
      ) : (
        <ul className="predictions-list">
          {predictions.map((prediction) => {
            return (
              <li key={prediction.predictionId} className="prediction-item">
                <div className="prediction-card">
                  <p className="prediction-date">
                    Prediction Date: {prediction.predictionDate?.replace('T', ' ').replace('Z', '')}
                  </p>
                  <div className="prediction-images">
                    <div className="prediction-image">
                      <p>Uploaded Image:</p>
                      <img src={prediction.imagePath} alt="Uploaded" className="uploaded-img" />
                    </div>
                    <div className="prediction-mask">
                      <p>Prediction Mask:</p>
                      <img src={prediction.maskPath} alt="Mask" className="mask-img" />
                    </div>
                  </div>
                  <p className="prediction-result">
                    Pixels: {prediction.pixels_with_oil_spills}
                  </p>
                  <button onClick={() => downloadAll(prediction)} className="download-btn">
                    Download Results
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ViewPredictions;
