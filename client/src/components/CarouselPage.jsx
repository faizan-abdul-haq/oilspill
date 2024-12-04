import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import '../styles/CarouselPage.css';

function CarouselPage(props) {
  const toggle_mode = () => {
    props.theme === 'light' ? props.setTheme('dark') : props.setTheme('light');
  };

  return (
    <div className="carousel-container">
      <h1>Oil Spill News</h1>
      <Carousel>
        <Carousel.Item>
          <a href="https://www.oneindia.com/videos/oil-tanker-sinks-near-oman-coast-13-indians-missing-4163124.html">
            <img
              className="d-block w-100"
              src="https://imagesvs.oneindia.com/img/videos/2024/07/1587239826-oil-tanker-sinks-off-oman-coast-13-indians-go-missing-under-suspicious-circumstances-full-report.jpg"
              alt="Oil Tanker Sinks"
            />
          </a>
          <Carousel.Caption>
            <h3>Oil Tanker Sinks Near Oman Coast</h3>
            <p>13 Indians Missing Under Suspicious Circumstances</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <a href="https://www.khaleejtimes.com/uae/environment/uae-oil-spill-hits-fujairah-beach-authority-to-take-legal-action-against-those-responsible">
            <img
              className="d-block w-100"
              src="https://image.khaleejtimes.com/?uuid=a4713f52-89df-558c-9185-ca7774998671&function=fit&type=preview&source=false&q=75&maxsize=1500&scaleup=0"
              alt="Mauritius Oil Spill"
            />
          </a>
          <Carousel.Caption>
            <h3>UAE</h3>
            <p>UAE: Oil spill hits beach near Fujairah’s Snoopy Island; authority to investigate cause</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfV9jQJJxlpFanD03DSs_Gwb46SGO6bMf6SA&s"
            alt="Oil Spill News"
          />
          <Carousel.Caption>
            <h3>Impact of Oil Spills</h3>
            <p>The long-term effects on marine life</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfV9jQJJxlpFanD03DSs_Gwb46SGO6bMf6SA&s"
            alt="Oil Spill Environment"
          />
          <Carousel.Caption>
            <h3>Environmental Consequences</h3>
            <p>How oil spills affect the ecosystem</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default CarouselPage;
