

import Image from "next/image";

interface CarouselProps {
  images: string[]; // Dichiarazione del tipo dell'array di immagini
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  return (
    <section className="p-8 bg-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6">Gallery</h2>
      <div className="flex overflow-x-scroll gap-4">
        {images.map((src, index) => (
          <div key={index} className="w-80 h-60 relative">
            <Image
              src={src}
              alt={`Gallery ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded shadow-md"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
