declare module 'react-slick' {
    
    import { Component } from "react";
  
    interface SliderProps {
      dots?: boolean;
      infinite?: boolean;
      speed?: number;
      slidesToShow?: number;
      slidesToScroll?: number;
      responsive?: Array<{
        breakpoint: number;
        settings: Partial<SliderProps>;
      }>;
    }
  
    class Slider extends Component<SliderProps> {}
    export default Slider;
  }
  