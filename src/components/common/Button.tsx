'use client'

// 1. Definerer props-typen
interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

// 2. Komponentdefinisjon
const Button = ({ 
  text, 
  onClick, 
  variant = 'primary', 
  size = 'medium' 
}: ButtonProps) => {
  // 3. Helper funksjon for å bestemme CSS klasser
  const getButtonClasses = () => {
    const baseClasses = 'rounded-md font-medium transition-all duration-200';
    
    const variantClasses = {
      primary: 'bg-red-600 text-white hover:bg-red-700 border-2 border-red-600',
      secondary: 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-100'
    };
    
    const sizeClasses = {
      small: 'px-4 py-2 text-sm',
      medium: 'px-6 py-2.5 text-base',
      large: 'px-8 py-3 text-lg'
    };

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  };

  // 4. JSX/HTML struktur
  return (
    <button 
      className={getButtonClasses()}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
};

export default Button; 