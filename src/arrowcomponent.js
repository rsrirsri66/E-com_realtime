import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
 // Using react-icons for arrows

export const CustomPrevIcon = (props) => (
  <button {...props} className="carousel-control-prev-icon">
    <FaArrowLeft size={30} />
  </button>
);

export const CustomNextIcon = (props) => (
  <button {...props} className="carousel-control-next-icon">
    <FaArrowRight size={30} />
  </button>
);
