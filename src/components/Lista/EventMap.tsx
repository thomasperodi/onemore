type Props = {
    indirizzo: string;
  };
  
  export default function LinkGoogleMaps({ indirizzo }: Props) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(indirizzo)}`;
  
    return (
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {indirizzo}
      </a>
    );
  }
  