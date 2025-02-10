"use client"
const Testimonials = () => {
    const testimonials = [
      {
        name: "Anna Rossi",
        text: "The best event I’ve ever attended! Everything was perfect.",
      },
      {
        name: "Luca Verdi",
        text: "Amazing organization and attention to detail. Highly recommended!",
      },
    ];
  
    return (
      <section className="p-8 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6">What People Say</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-gray-100 shadow-md rounded hover:shadow-lg transition"
            >
              <p className="italic text-gray-700">&ldquo;{testimonial.text}&ldquo;</p>
              <h4 className="mt-4 font-semibold">- {testimonial.name}</h4>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default Testimonials;