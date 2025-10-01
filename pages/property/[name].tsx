import { useRouter } from "next/router";
import { useState } from "react";
import PropertyReviews from "../../components/PropertyReviews";
import PropertyMap from "../../components/PropertyMap";
import GoogleReviews from "../../components/GoogleReviews";

export default function PropertyPage() {
  const router = useRouter();
  const { name } = router.query;
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!name) {
    return (
      <p className="text-gray-400 text-center mt-10 animate-pulse">
        Loading...
      </p>
    );
  }

  const property = {
    name: name as string,
    location: "Paris, France",
    imageUrl: "/image.png",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 3,
    price: 176.53,
  };

  const shortDescription = `L'appartement à La Motte est idéalement situé, parfait pour explorer la région. Il est spacieux et très confortable, avec des équipements de qualité pour vous garantir un séjour agréable. Vous trouverez tout ce dont vous avez besoin pour vous sentir chez vous. La tranquillité du quartier et sa prox...`;

  const fullDescription = `L'L'appartement à La Motte est idéalement situé, parfait pour explorer la région. Il est spacieux et très confortable, avec des équipements de qualité pour vous garantir un séjour agréable. Vous trouverez tout ce dont vous avez besoin pour vous sentir chez vous. La tranquillité du quartier et sa proximité avec les attractions en font un endroit parfait pour se détendre.

              Cet appartement studio est idéal pour un séjour confortable. Il dispose d’un grand lit double, d'une salle de bain privée et d'une cuisine entièrement équipée avec des appareils de haute qualité. Pour votre confort, tous les duvets et oreillers sont hypoallergéniques, et le linge de lit est 100% coton. En tout, l'appartement peut héberger jusqu'à 2 personnes. Vous vous y sentirez comme chez vous!

              Votre confort est ma priorité, alors si vous avez besoin de quoi que ce soit ou si je peux vous aider d’une manière ou d’une autre, n’hésitez pas à me le faire savoir – je serai toujours ravi de vous assister !

              La Motte est un endroit idéal pour se détendre et profiter de la nature. Le quartier est calme, tout en étant proche des commerces locaux, des restaurants et des sites à découvrir. Vous pourrez facilement explorer les alentours, tout en revenant dans un environnement paisible le soir. C’est vraiment un endroit parfait pour passer du temps en toute tranquillité.

              Firmine - 11 minutes à pied
              Le Bouchon - 12 minutes à pied
              LE PAVILLON Paris 15 - 5 minutes à pied

              Lors de votre arrivée, il vous sera demandé de présenter une pièce d'identité valide et d'accepter nos conditions générales. Ces étapes sont mises en place pour garantir un processus sécurisé et fluide pour tous. Merci beaucoup pour votre compréhension !`;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="max-w-6xl w-full grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          {/* Image & Price */}
          <div className="relative">
            <img
              src={property.imageUrl}
              alt={property.name}
              className="w-full h-80 object-cover"
            />
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow px-3 py-1">
              <p className="text-green-600 font-bold">
                ${property.price.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">per night</p>
            </div>
          </div>

          {/* Property Info */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {property.name} – The Flex Paris
            </h1>
            <p className="text-gray-500">{property.location}</p>

            <div className="flex flex-wrap gap-6 mt-4 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                🛏 {property.bedrooms} Bedroom
              </div>
              <div className="flex items-center gap-2">
                🛁 {property.bathrooms} Bathroom
              </div>
              <div className="flex items-center gap-2">
                👥 Up to {property.maxGuests} guests
              </div>
            </div>
          </div>

          {/* About & Amenities & Stay Policies */}
          <div className="p-6 bg-gray-50 border-t space-y-6">
            {/* About */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                About this property
              </h2>
              <p className="text-gray-600">
                {showFullDescription ? fullDescription : shortDescription}
              </p>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-sm text-blue-600 mt-1 hover:underline"
              >
                {showFullDescription ? "Show less" : "Read more"}
              </button>
            </div>

            {/* Amenities */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">📺 Cable TV</div>
                <div className="flex items-center gap-2">🌐 Internet</div>
                <div className="flex items-center gap-2">📶 Wireless</div>
                <div className="flex items-center gap-2">🍳 Kitchen</div>
                <div className="flex items-center gap-2">💇 Hair Dryer</div>
                <div className="flex items-center gap-2">🔥 Heating</div>
                <div className="flex items-center gap-2">🚨 Smoke Detector</div>
                <div className="flex items-center gap-2">⚠️ Carbon Monoxide Detector</div>
                <div className="flex items-center gap-2">🛁 Essentials</div>
              </div>
              <button className="mt-3 text-sm text-blue-600 hover:underline">
                View all amenities →
              </button>
            </div>

            {/* Stay Policies*/}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Stay Policies</h2>

              {/* Check-in & Check-out */}
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  ⏰ Check-in & Check-out
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs text-gray-500">Check-in Time</p>
                    <p className="font-semibold text-gray-700">3:00 PM</p>
                  </div>
                  <div className="bg-white rounded-md p-3">
                    <p className="text-xs text-gray-500">Check-out Time</p>
                    <p className="font-semibold text-gray-700">10:00 AM</p>
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  🛡 House Rules
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-md p-2 text-sm text-gray-700 flex items-center gap-2">🚭 No smoking</div>
                  <div className="bg-white rounded-md p-2 text-sm text-gray-700 flex items-center gap-2">🐾 No pets</div>
                  <div className="bg-white rounded-md p-2 text-sm text-gray-700 flex items-center gap-2">🎉 No parties or events</div>
                  <div className="bg-white rounded-md p-2 text-sm text-gray-700 flex items-center gap-2">🛑 Security deposit required</div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  📅 Cancellation Policy
                </h3>
                <div className="bg-white rounded-md p-4 mb-4">
                  <p className="font-semibold text-gray-700 mb-2">
                    For stays less than 28 days
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Full refund up to 14 days before check-in</li>
                    <li>No refund for bookings less than 14 days before check-in</li>
                  </ul>
                </div>
                <div className="bg-white rounded-md p-4">
                  <p className="font-semibold text-gray-700 mb-2">
                    For stays of 28 days or more
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Full refund up to 30 days before check-in</li>
                    <li>No refund for bookings less than 30 days before check-in</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <PropertyMap lat={48.8566} lng={2.3522} /> {/* Example: Paris */}
            </div>
          </div>

          {/* Google Reviews with no actual placeId */}
          <div className="p-6">
            <GoogleReviews placeId="ChIJd8BlQ2BZwokRAFUEcm_qrcA" /> 
          </div>

          {/* Guest Reviews */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Guest Reviews
            </h2>
            <PropertyReviews propertyName={property.name} />
          </div>
        </div>

        {/* Book Your Stay */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Book Your Stay
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Select dates to see prices
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="date"
                className="border border-gray-300 text-gray-600 rounded-md p-2"
              />
              <select className="border border-gray-300 text-gray-600 rounded-md p-2">
                <option>1 guest</option>
                <option>2 guests</option>
                <option>3 guests</option>
              </select>
              <button className="bg-gray-300 text-gray-700 py-2 rounded-md">
                Check availability
              </button>
              <button className="text-green-600 hover:underline">
                Send Inquiry
              </button>
              <p className="text-xs text-gray-400 mt-2">
                ⏱ Instant booking confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
