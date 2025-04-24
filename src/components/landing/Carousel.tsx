import Image from "next/image";

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => (
  <section className="p-8 bg-gray-200">
    <h2 className="text-3xl font-bold text-center mb-6">Gallery</h2>
    <div className="flex overflow-x-auto gap-4">
      {images.map((src, index) => (
        <div key={index} className="min-w-[320px] h-60 relative">
          <Image src={src} alt={`Gallery ${index + 1}`} fill className="object-cover rounded shadow-md" />
        </div>
      ))}
    </div>
  </section>
);

export default Carousel;
