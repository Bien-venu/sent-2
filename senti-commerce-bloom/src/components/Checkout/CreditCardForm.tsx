
import React from 'react';
import { CreditCard, Lock } from 'lucide-react';

interface CreditCardFormProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: {
    card: string;
    expiry: string;
    cvc: string;
  };
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ handleChange, formData }) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="text" name="card" placeholder="Card Number (e.g., 4111...)" value={formData.card} onChange={handleChange} required className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleChange} required className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" name="cvc" placeholder="CVC" value={formData.cvc} onChange={handleChange} required className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <p className="text-xs text-gray-500">For testing: card starting with <strong>4111</strong> will succeed, <strong>4222</strong> will fail.</p>
    </div>
  );
};

export default CreditCardForm;
