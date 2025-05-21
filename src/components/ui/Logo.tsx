import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 70, className }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="https://raw.githubusercontent.com/Nefta11/MiPortafolioNefta/refs/heads/main/assets/esposaiconSiu.jpeg"
        alt="Espora Logo"
        style={{ width: size * 1.5, height: size }}
        className="object-contain"
      />
    </div>
  );
};
