/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { BasicInfoSection } from './forms/BasicInfoSection';
import { StylePreferencesSection } from './forms/StylePreferencesSection';
import { ClothingTypesSection } from './forms/ClothingTypesSection';
import { PricingSection } from './forms/PricingSection';
import { FeedbackSection } from './forms/FeedbackSection';
import { ConsentSection } from './forms/ConsentSection';
import { FormProgress } from './forms/FormProgress';
import type { FormData } from '../types/form';
import { useFormProgress } from './hooks/useFormProgress';
// import { useForm } from '@formspree/react';


const initialFormData: FormData = {
  basicInfo: {
    name: '',
    email: '',
    instagramHandle: '',
    twitterHandle: ''
  },
  stylePreferences: {
    styles: [],
    otherStyles: ''
  },
  clothingTypes: {
    types: []
  },
  pricingPreferences: {
    priceRange: ''
  },
  feedback: {
    designSuggestions: '',
    generalFeedback: ''
  },
  consent: {
    cashbackConsent: false,
    subscribeUpdates: false
  }
};

const InterestForm = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progress = useFormProgress(formData);
  // const [state, handleSubmit] = useForm('xnnnopvl');

  // useEffect(() => {
  //   if (state.succeeded) {
  //     setSubmitted(true);
  //   }
  // }, [state]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/interest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSubmitted(true);
        } else {
          const errorData = await response.json();
          setErrors({ general: errorData.detail || 'There was an error submitting the form.' });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ general: 'Could not connect to the backend server. Please make sure it is running.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.basicInfo.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.basicInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.basicInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.stylePreferences.styles.length === 0) {
      newErrors.styles = 'Please select at least one style preference';
    }

    if (formData.clothingTypes.types.length === 0) {
      newErrors.types = 'Please select at least one clothing type';
    }

    if (!formData.pricingPreferences.priceRange) {
      newErrors.priceRange = 'Please select a price range';
    }

    if (!formData.feedback.designSuggestions) {
      newErrors.designSuggestions = 'Please provide design suggestions';
    }

    if (!formData.consent.cashbackConsent) {
      newErrors.consent = 'Please accept the cashback terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = <T extends keyof FormData>(
    section: T,
    field: keyof FormData[T],
    value: string | number | string[] | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (submitted) {
    return (
      <div className="text-center py-20 px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-[#2C2C2C] p-8 rounded-2xl shadow-lg
                      transform transition-all duration-500 animate-fade-up">
          <div className="relative">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2">
              <div className="w-12 h-12 bg-[#FF4B8C] rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-noto text-[#2C2C2C] dark:text-white mb-4">
              ありがとうございます, {formData.basicInfo.name}!
            </h3>
            <p className="text-[#2C2C2C]/80 dark:text-white/80 mb-4">
              We've received your interest. You'll receive updates about our launch soon!
            </p>
            <p className="text-sm text-[#2C2C2C]/60 dark:text-white/60">
              Check your email for more details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl md:text-4xl font-noto text-[#2C2C2C] dark:text-white mb-6 text-center" >Tell Us What You Think!</h2>

      <div className="sticky top-0 bg-white dark:bg-[#1a1a1a] z-10">
        <FormProgress progress={progress} />
      </div>
      <form onSubmit={onSubmit} className="space-y-8 mt-8">
        <div className="space-y-8 transition-all duration-300">
          <BasicInfoSection
            data={formData.basicInfo}
            onChange={(field, value) => handleChange('basicInfo', field, value)}
            errors={errors}
          />

          <StylePreferencesSection
            data={formData.stylePreferences}
            onChange={(field, value) => handleChange('stylePreferences', field, value)}
            errors={errors}
          />

          <ClothingTypesSection
            data={formData.clothingTypes}
            onChange={(field, value) => handleChange('clothingTypes', field, value)}
            errors={errors}
          />

          <PricingSection
            data={formData.pricingPreferences}
            onChange={(field, value) => handleChange('pricingPreferences', field, value)}
            errors={errors}
          />

          <FeedbackSection
            data={formData.feedback}
            onChange={(field, value) => handleChange('feedback', field, value)}
            errors={errors}
          />

          <ConsentSection
            data={formData.consent}
            onChange={(field, value) => handleChange('consent', field, value)}
            errors={errors}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#FF4B8C] text-white px-6 py-4 rounded-xl font-semibold hover:bg-[#FF4B8C]/90 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <span>{isSubmitting ? 'Submitting...' : 'Submit Interest'}</span>
          <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
        </button>
      </form>
    </div>
  );
};

export default InterestForm;