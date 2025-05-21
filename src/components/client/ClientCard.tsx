import React from "react";
import { Client } from "../../types/client";

interface ClientCardProps {
  client: Client;
  isActive?: boolean;
  onClick?: (client: Client) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ 
  client, 
  isActive = false, 
  onClick
}) => {
  const handleClick = () => {
    onClick?.(client);
  };

  return (
    <button 
      className={`
        relative w-full max-w-[480px] h-[300px] flex flex-col items-center justify-center 
        cursor-pointer transition-all duration-500 ease-out rounded-2xl
        bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl border border-white/50
        ${isActive
          ? 'scale-125 z-10 opacity-100 shadow-2xl p-4 bg-white'
          : 'scale-90 opacity-70 hover:opacity-90 hover:scale-95 -mx-6 p-8 hover:bg-white'}
      `}
      onClick={handleClick}
    >
      <div className={`
        rounded-xl overflow-hidden flex items-center justify-center 
        bg-gradient-to-br from-gray-50/50 to-gray-100/50
        ${isActive ? 'w-full h-full' : 'w-full h-full'}
      `}>
        <img
          src={client.logoUrl}
          alt={`${client.name} logo`}
          className="w-full h-full object-cover object-center transition-all duration-500 
            hover:scale-110 hover:rotate-1"
          loading="lazy"
          onError={(e) => {
            // Fallback for broken images
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Logo';
          }}
        />
      </div>
    </button>
  );
};