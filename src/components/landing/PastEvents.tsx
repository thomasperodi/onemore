"use client";

interface Event {
  title: string;
  description: string;
  date: string;
}

interface PastEventsProps {
  events: Event[]; // Array di eventi con proprietà definite
}

const PastEvents: React.FC<PastEventsProps> = ({ events }) => {
  return (
    <section className="p-8 bg-white text-center">
      <h2 className="text-3xl font-bold mb-6">Past Events</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event, index) => (
          <div
            key={index}
            className="p-6 bg-gray-100 shadow-md rounded hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
            <p className="text-gray-400 text-sm mt-2">{event.date}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PastEvents;
