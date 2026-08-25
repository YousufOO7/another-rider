"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuickReceiptMutation } from '@/app/redux/features/bookings/bookingsApi';
import DatePickerOnly from '@/app/utils/helper/DatePickerOnly';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface QuickReceiptFormProps {
  bookingId?: string | number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const QuickReceiptForm = ({ 
  bookingId: propBookingId, 
  onSuccess, 
  onError 
}: QuickReceiptFormProps) => {
  const [formData, setFormData] = useState({
    booking_id: propBookingId || '',
    email: '',
    pickupDate: null as Date | null,
  });

  const [quickReceipt, { isLoading }] = useQuickReceiptMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.booking_id) {
    toast.error('Booking ID is required');
    return;
  }

  if (!formData.email) {
    toast.error('Email is required');
    return;
  }

  if (!formData.pickupDate) {
    toast.error('Trip date is required');
    return;
  }

  const formattedDate = new Date(
    formData.pickupDate.getTime() -
      formData.pickupDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split('T')[0];

  const requestData = {
    booking_id: Number(formData.booking_id),
    email: formData.email,
    trip_date: formattedDate,
  };

  try {
    const pdfBlob = await quickReceipt(requestData).unwrap();

    // Blob থেকে URL তৈরি
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // নতুন tab এ PDF দেখাবে
    const newWindow = window.open(pdfUrl, '_blank');

    if (!newWindow) {
      toast.error('Popup blocked! Please allow popups.');

      // fallback download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `receipt_${formData.booking_id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.success('Receipt opened successfully!');
    }

    // কিছুক্ষণ পর object URL cleanup
    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 10000);

    onSuccess?.(pdfBlob);
  } catch (err: any) {
    console.error('Quick receipt error:', err);

    const errorMessage =
      err?.data?.message ||
      err?.error ||
      'Failed to generate receipt';

    toast.error(errorMessage);

    onError?.(err);
  }
};

  return (
    <div className="min-h-[calc(100vh-64px)] px-5 flex items-center justify-center bg-gray-50 py-10">
    <div className="w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quick Receipt</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Booking ID */}
        <div>
          <label htmlFor="booking_id" className="block text-sm font-medium text-gray-700 mb-1">
            Booking ID *
          </label>
          <input
            type="number"
            id="booking_id"
            name="booking_id"
            value={formData.booking_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter booking ID"
            required
            disabled={!!propBookingId}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email address"
            required
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trip Date *
          </label>
          <DatePickerOnly
            date={formData.pickupDate ?? undefined}
            onDateChange={(date) =>
              setFormData((prev: any) => ({
                ...prev,
                pickupDate: date,
              }))
            }
          />
        </div>

        {formData.pickupDate && (
          <div className="text-sm text-gray-600">
            Selected: {formData.pickupDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Generating...
            </span>
          ) : (
            'Get Receipt'
          )}
        </Button>
      </form>
    </div>
    </div>
  );
};

export default QuickReceiptForm;