
import React from 'react';
import { Hash } from 'lucide-react';

interface BankTransferFormProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: {
    reference: string;
  };
}

const BankTransferForm: React.FC<BankTransferFormProps> = ({ handleChange, formData }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-lg text-sm space-y-1">
        <p className="font-semibold">Bank Details (Dummy)</p>
        <p><span className="font-medium">Bank Name:</span> Bank of Kigali</p>
        <p><span className="font-medium">Account Number:</span> 100012345678</p>
        <p><span className="font-medium">Account Name:</span> E-Shop Inc.</p>
      </div>
      <p className="text-sm text-gray-600">Enter the transaction reference after making the transfer.</p>
      <div className="relative">
        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="text" name="reference" placeholder="Transaction Reference" value={formData.reference} onChange={handleChange} required className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
  );
};

export default BankTransferForm;
