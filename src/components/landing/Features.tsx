// components/Features.tsx

const Features = () => {
    const features = [
      {
        title: "Top-notch Events",
        description: "We organize the best events to leave you in awe.",
      },
      {
        title: "Customizable Experiences",
        description: "Tailor your experience to make it unique and memorable.",
      },
      {
        title: "World-Class Venues",
        description: "We partner with the finest venues to ensure perfection.",
      },
    ];
  
    return (
      <section className="p-8 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-md rounded hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default Features;