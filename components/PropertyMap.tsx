import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type PropertyMapProps = {
  lat: number;
  lng: number;
};

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "12px"
};

export default function PropertyMap({ lat, lng }: PropertyMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string, // Store in .env.local
  });

  if (!isLoaded) return <p className="text-center text-gray-400">Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat, lng }}
      zoom={14}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
}
