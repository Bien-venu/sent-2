import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCart } from "../features/cart/cartSlice";
import {
  CreditCard,
  Lock,
  User,
  Mail,
  MapPin,
  Loader2,
  Phone,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CreditCardForm from "@/components/Checkout/CreditCardForm";
import MobileMoneyForm from "@/components/Checkout/MobileMoneyForm";
import BankTransferForm from "@/components/Checkout/BankTransferForm";
import { apiService, CheckoutData } from "../utils/api";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    card: "",
    expiry: "",
    cvc: "",
    phone: "",
    network: "mtn",
    reference: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNetworkChange = (value: string) => {
    setFormData({ ...formData, network: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Prepare checkout data according to API format
      const checkoutData: CheckoutData = {
        shipping: {
          full_name: formData.name,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zip_code: formData.zip,
        },
        payment: {
          payment_method: paymentMethod.replace("-", "_"), // Convert to snake_case
          card_number: formData.card,
          expiry_date: formData.expiry,
          cvc: formData.cvc,
        },
      };

      // Call the checkout API
      const response = await apiService.checkout(checkoutData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Payment successful!");
        console.log("Order submitted:", response.data);
        dispatch(clearCart());
        navigate("/confirmation");
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to proceed</h1>
        <p className="text-gray-600 mb-8">
          You need to be logged in to complete your purchase.
        </p>
        <Link
          to="/login"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">
          You can't checkout with an empty cart.
        </p>
        <Link
          to="/products"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Checkout
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6 space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                    required
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP Code"
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              <p className="text-sm text-gray-500 mb-4">
                This is a dummy payment system for testing purposes. No real
                transaction will be made.
              </p>

              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
              >
                <div>
                  <RadioGroupItem
                    value="credit-card"
                    id="r-credit-card"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="r-credit-card"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Credit Card
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="mobile-money"
                    id="r-mobile-money"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="r-mobile-money"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Mobile Money
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="bank-transfer"
                    id="r-bank-transfer"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="r-bank-transfer"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Bank Transfer
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "credit-card" && (
                <CreditCardForm
                  handleChange={handleChange}
                  formData={formData}
                />
              )}
              {paymentMethod === "mobile-money" && (
                <MobileMoneyForm
                  handleChange={handleChange}
                  handleRadioChange={handleNetworkChange}
                  formData={formData}
                />
              )}
              {paymentMethod === "bank-transfer" && (
                <BankTransferForm
                  handleChange={handleChange}
                  formData={formData}
                />
              )}
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${(total * 1.08).toFixed(2)}`
              )}
            </button>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${(total * 1.08).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
