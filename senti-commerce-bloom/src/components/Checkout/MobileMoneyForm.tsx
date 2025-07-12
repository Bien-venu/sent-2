
import React from 'react';
import { Phone } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface MobileMoneyFormProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRadioChange: (value: string) => void;
  formData: {
    phone: string;
    network: string;
  };
}

const MobileMoneyForm: React.FC<MobileMoneyFormProps> = ({ handleChange, handleRadioChange, formData }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Enter your Rwandan mobile money number.</p>
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="tel" name="phone" placeholder="07XXXXXXXX" value={formData.phone} onChange={handleChange} required className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>
      <RadioGroup name="network" onValueChange={handleRadioChange} value={formData.network} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mtn" id="mtn" />
          <Label htmlFor="mtn">MTN MoMo</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="airtel" id="airtel" />
          <Label htmlFor="airtel">Airtel Money</Label>
        </div>
      </RadioGroup>
      <p className="text-xs text-gray-500">For testing: phone starting with <strong>078</strong> will succeed, <strong>073</strong> will fail.</p>
    </div>
  );
};

export default MobileMoneyForm;
