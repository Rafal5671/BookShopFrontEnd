import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "@nextui-org/button";

const images = [
  { label: "Księgarnia", imgPath: "/slide1.png" },
  { label: "Księgarnia 2", imgPath: "/slide2.png" },
];

const ImageCarousel: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps
    );
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <div className="relative mx-auto shadow-lg rounded-2xl mt-3  w-5/6">
      <Button
        onClick={handleBack}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center shadow-md hover:bg-gray-100"
      >
        <FaArrowLeft />
      </Button>
      <div className="overflow-hidden rounded-2xl">
        <Carousel
          selectedItem={activeStep}
          onChange={handleStepChange}
          showArrows={false}
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={3000}
          transitionTime={500}
        >
          {images.map((step, index) => (
            <div key={step.label} className="flex justify-center items-center">
              <img src={step.imgPath} alt={step.label} className="w-full" />
            </div>
          ))}
        </Carousel>
      </div>

      <Button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-1 w-12 h-12 flex items-center justify-center shadow-md hover:bg-gray-100"
      >
        <FaArrowRight />
      </Button>
    </div>
  );
};

export default ImageCarousel;
