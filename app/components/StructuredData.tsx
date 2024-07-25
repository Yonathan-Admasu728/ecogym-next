// components/StructuredData.tsx
import React from 'react';
import { Program } from '../types';

interface StructuredDataProps {
  data?: Record<string, any>;
  programs?: Program[];
}

const StructuredData: React.FC<StructuredDataProps> = ({ data, programs }) => {
  let jsonLd;

  if (programs) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": programs.map((program, index) => ({
        "@type": "Course",
        "position": index + 1,
        "name": program.title,
        "description": program.description,
        "provider": {
          "@type": "Organization",
          "name": "Ecogym",
          "sameAs": "https://ecogym.space"
        }
      }))
    };
  } else if (data) {
    jsonLd = data;
  } else {
    return null; // Return null if no data is provided
  }

  // Use JSON.stringify with a custom replacer function to handle HTML entities
  const jsonString = JSON.stringify(jsonLd, (key, value) => {
    if (typeof value === 'string') {
      return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return value;
  }).replace(/"/g, '&quot;');

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
};

export default StructuredData;