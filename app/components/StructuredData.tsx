// components/StructuredData.tsx
import React from 'react';

import { Program } from '../types';
import { SchemaOrg } from '../types/schema';

interface CourseSchema {
  "@type": "Course";
  position: number;
  name: string;
  description: string;
  provider: {
    "@type": "Organization";
    name: string;
    sameAs: string;
  };
}

interface ItemListSchema extends SchemaOrg {
  "@type": "ItemList";
  itemListElement: CourseSchema[];
}

interface StructuredDataProps {
  data?: SchemaOrg;
  programs?: Program[];
}

const StructuredData: React.FC<StructuredDataProps> = ({ data, programs }): JSX.Element | null => {
  let jsonLd: SchemaOrg;

  if (programs) {
    const itemList: ItemListSchema = {
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
    jsonLd = itemList;
  } else if (data) {
    jsonLd = data;
  } else {
    return null;
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
