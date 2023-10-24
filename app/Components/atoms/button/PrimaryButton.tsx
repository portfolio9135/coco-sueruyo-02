import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = (props) => {
  const { children, onClick, className } = props;

  return (
    <button
      className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition duration-300 ease-in-out ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;