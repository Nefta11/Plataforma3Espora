import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Client } from "../../types/client";
import { ClientCard } from "./ClientCard";

interface ClientCarouselProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

export const ClientCarousel: React.FC<ClientCarouselProps> = ({
  clients,
  onSelectClient
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleClients, setVisibleClients] = useState<Client[]>([]);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [centerClientName, setCenterClientName] = useState<string>('');
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateVisibleClients = () => {
      // Calculate indices to ensure center positioning
      const offset = Math.floor(itemsPerView / 2);
      let startIndex = Math.max(0, currentIndex - offset);
      let endIndex = Math.min(startIndex + itemsPerView, clients.length);

      // Adjust startIndex if we're near the end
      if (endIndex - startIndex < itemsPerView) {
        startIndex = Math.max(0, endIndex - itemsPerView);
      }

      setVisibleClients(clients.slice(startIndex, endIndex));

      // Update center client name
      const centerIndex = Math.floor(itemsPerView / 2);
      const centerClient = clients[currentIndex];
      if (centerClient) {
        setCenterClientName(centerClient.name);
      }
    };

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    updateVisibleClients();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clients, currentIndex, itemsPerView]);

  const goToPrevious = () => {
    setCurrentIndex(prev => {
      if (prev === 0) {
        // Jump to the end of the original set
        return Math.floor(clients.length / 3) * 2 - 1;
      }
      return prev - 1;
    });
  };

  const goToNext = () => {
    setCurrentIndex(prev => {
      if (prev >= Math.floor(clients.length / 3) * 2) {
        // Jump back to the start of the middle set
        return Math.floor(clients.length / 3);
      }
      return prev + 1;
    });
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reset transition state
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);


  const handleSelectClient = async (client: Client) => {
    setIsTransitioning(true);
    onSelectClient(client);
    
    // Add fade-out animation
    if (carouselRef.current) {
      carouselRef.current.style.opacity = '0';
      carouselRef.current.style.transform = 'scale(0.95)';
    }
    
    // Wait for animation to complete before navigation
    await new Promise(resolve => setTimeout(resolve, 400));
    navigate('/dashboard');
  };
  return (
    <div className="relative w-full px-32 py-8">
      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className={`
          absolute left-0 top-1/2 -translate-y-1/2 z-20
          w-14 h-14 flex items-center justify-center
          bg-white/80 backdrop-blur-sm rounded-full shadow-lg
          transition-all duration-200 ease-in-out
          hover:scale-110 hover:bg-white hover:shadow-xl
        `}
      >
        <ArrowLeft size={28} className="text-gray-700" />
      </button>
      <div
        ref={carouselRef}
        className={`
          flex items-center justify-center gap-8 py-16 overflow-hidden 
          transition-all duration-700 ease-in-out perspective-1000
          ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        `}
      >
        {visibleClients.map((client, index) => (
          <ClientCard
            key={client.id}
            client={client}
            isActive={client.id === clients[currentIndex].id}
            onClick={handleSelectClient}
          />
        ))}
      </div>
      
      {/* Client Name Display */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12">
        <h3 className="text-2xl font-semibold text-gray-900 whitespace-nowrap">
          {centerClientName}
        </h3>
      </div>
      
      <button
        onClick={goToNext}
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 z-20
          w-14 h-14 flex items-center justify-center
          bg-white/80 backdrop-blur-sm rounded-full shadow-lg
          transition-all duration-200 ease-in-out
          hover:scale-110 hover:bg-white hover:shadow-xl
        `}
      >
        <ArrowRight size={28} className="text-gray-700" />
      </button>
    </div>
  );
};