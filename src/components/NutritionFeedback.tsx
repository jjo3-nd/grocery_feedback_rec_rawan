"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bungee, Open_Sans } from 'next/font/google';
import Image from 'next/image';
import Head from 'next/head';
import ReactGA from 'react-ga4';

const TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
});

interface NutritionFeedbackProps {
  feedbackId: string;
  weekId?: string;
}


const NutritionFeedback = ({ feedbackId, weekId }: NutritionFeedbackProps) => {
  interface PlateDataSection {
    name: string;
    score: string;
    status: string;
    details: string;
    icon: string;
    color: string;
    iconPosition: { x: number; y: number };
  } 
  
  interface PlateData {
    vegetables: PlateDataSection;
    fruits: PlateDataSection;
    protein: PlateDataSection;
    grains: PlateDataSection;
    dairy: PlateDataSection;
    unsaturatedfat: PlateDataSection;
  }

  interface ModerationDataSection {
    name: string;
    score: string;
    status: string;
    details: string;
    icon: string;
    color: string;
    iconPosition: { x: number; y: number };
  } 
  
  interface ModerationData {
    refinedgrains: ModerationDataSection;
    sodium: ModerationDataSection;
    addedsugars: ModerationDataSection;
    saturatedfat: ModerationDataSection;
  }

  interface JsonData {
    section1: [{
      good_choice_item1: string;
      good_choice_reason1: string;
      good_choice_item2: string;
      good_choice_reason2: string;
      good_choice_item3: string;
      good_choice_reason3: string;
    }];
    section2: [{
      user_goals: string;
      goal_feedback: Array<{
        feedback_text: string;
        feedback_items: string;
      }>;
    }];
    section3: [{
      total_HEI_score: string;
      vegetables_score: string;
      vegetables_score_label: string;
      vegetables_explanation: string;
      fruits_score: string;
      fruits_score_label: string;
      fruits_explanation: string;
      protein_score: string;
      protein_score_label: string;
      protein_explanation: string;
      grains_score: string;
      grains_score_label: string;
      grains_explanation: string;
      dairy_score: string;
      dairy_score_label: string;
      dairy_explanation: string;
      fattyacids_score: string;
      fattyacids_score_label: string;
      fattyacids_explanation: string;
    }];
    section4: [{
      refinedgrains_score: string;
      refinedgrains_score_label: string;
      refinedgrains_explanation: string;
      sodium_score: string;
      sodium_score_label: string;
      sodium_explanation: string;
      addedsugars_score: string;
      addedsugars_score_label: string;
      addedsugars_explanation: string;
      saturatedfats_score: string;
      saturatedfats_score_label: string;
      saturatedfats_explanation: string;
    }];
    section5: [{
      recommendation1: string;
      food_to_substitute1: string;
      recommendation2: string;
      food_to_substitute2: string;
      recommendation3: string;
      food_to_substitute3: string;
    }];
  }
  
  // Then update the useState:
  const [jsonData, setJsonData] = useState<JsonData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<keyof PlateData | null>(null);
  const [selectedModerationSection, setSelectedModerationSection] = useState<keyof ModerationData | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const loadNutritionData = async () => {
      try {
        // Construct the path based on whether weekId is provided
        const dataPath = weekId 
          ? `/data/${feedbackId}/${weekId}/openai_response.json`
          : `/data/${feedbackId}/openai_response.json`;

        const response = await fetch(dataPath);
        if (!response.ok) {
          throw new Error('Failed to fetch nutrition data');
        }
        const data = await response.json();
        setJsonData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    loadNutritionData();
  }, [feedbackId, weekId]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error loading data: {error}
      </div>
    );
  }

  if (isLoading || !jsonData) {
    return <div>Loading...</div>;
  }

  const plateData = {
    vegetables: {
      name: 'Vegetables',
      score: jsonData.section3[0].vegetables_score,
      status: jsonData.section3[0].vegetables_score_label,
      details: jsonData.section3[0].vegetables_explanation,
      icon: '/vegetables.png',
      color: '#74B744',
      iconPosition: { x: 100, y: 100 },
    },
    fruits: {
      name: 'Fruits',
      score: jsonData.section3[0].fruits_score,
      status: jsonData.section3[0].fruits_score_label,
      details: jsonData.section3[0].fruits_explanation,
      icon: '/fruits.png',
      color: '#D62128',
      iconPosition: { x: 300, y: 100 },
    },
    protein: {
      name: 'Protein',
      score: jsonData.section3[0].protein_score,
      status: jsonData.section3[0].protein_score_label,
      details: jsonData.section3[0].protein_explanation,
      icon: '/protein.png',
      color: '#5F4994',
      iconPosition: { x: 100, y: 300 },
    },
    grains: {
      name:'Grains',
      score: jsonData.section3[0].grains_score,
      status: jsonData.section3[0].grains_score_label,
      details: jsonData.section3[0].grains_explanation,
      icon: '/grains.png',
      color: '#E67323',
      iconPosition: { x: 300, y: 300 },
    },
    dairy: {
      name:'Dairy',
      score: jsonData.section3[0].dairy_score,
      status: jsonData.section3[0].dairy_score_label,
      details: jsonData.section3[0].dairy_explanation,
      icon: '/dairy.png',
      color: '#5083C5',
      iconPosition: { x: 450, y: 200 },
    },
    unsaturatedfat: {
      name:'Unsaturated Fat',
      score: jsonData.section3[0].fattyacids_score,
      status: jsonData.section3[0].fattyacids_score_label,
      details: jsonData.section3[0].fattyacids_explanation,
      icon: '/unsaturatedfat.png',
      color: '#fbb616',
      iconPosition: { x: 300, y: 100 },
    },
  }

  const moderationData = {
    refinedgrains: {
      name: 'Refined Grains',
      score: jsonData.section4[0].refinedgrains_score,
      status: jsonData.section4[0].refinedgrains_score_label,
      details: jsonData.section4[0].refinedgrains_explanation,
      icon: '/refinedgrains.png',
      color: '#e7138c',
      iconPosition: { x: 100, y: 100 },
    },
    sodium: {
      name: 'Sodium',
      score: jsonData.section4[0].sodium_score,
      status: jsonData.section4[0].sodium_score_label,
      details: jsonData.section4[0].sodium_explanation,
      icon: '/sodium.png',
      color: '#5ec9e3',
      iconPosition: { x: 300, y: 100 },
    },
    addedsugars: {
      name: 'Added Sugars',
      score: jsonData.section4[0].addedsugars_score,
      status: jsonData.section4[0].addedsugars_score_label,
      details: jsonData.section4[0].addedsugars_explanation,
      icon: '/addedsugars.png',
      color: '#9e69ad',
      iconPosition: { x: 100, y: 300 },
    },
    saturatedfat: {
      name: 'Saturated Fat',
      score: jsonData.section4[0].saturatedfats_score,
      status: jsonData.section4[0].saturatedfats_score_label,
      details: jsonData.section4[0].saturatedfats_explanation,
      icon: '/saturatedfat.png',
      color: '#fbb616',
      iconPosition: { x: 300, y: 300 },
    },
  };
  
  const headingColors = {
    title: '#1A365D',
    positiveChoices: '#A3AA4E',
    goalProgress: '#6B5286',
    myPlate: '#E4702D',
    otherNutrition: '#58504C',
    recommendations: '#D92027',
    progress: '#3E85C6'
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scroll({
        behavior: 'smooth',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "great":
        return "#009900";
      case "moderate":
        return "#ff6c00";
      case "needs improvement":
        return "#ff0000";
      default:
        return "#4B5563";
    }
  };

  // const handleSectionClick = (section: keyof typeof plateData) => {
  //   setSelectedSection(section === selectedSection ? null : section);
  // };

  // const handleModerationSectionClick = (section: keyof typeof moderationData) => {
  //   setSelectedModerationSection(section === selectedModerationSection ? null : section);
  // };


  const handleSectionClick = (section: keyof typeof plateData) => {
    const newSelectedSection = section === selectedSection ? null : section;
    setSelectedSection(newSelectedSection);

    // --- Google Analytics Event Tracking ---
    if (TRACKING_ID && newSelectedSection) { // Check if GA is configured AND a section is being selected
      const sectionName = plateData[newSelectedSection].name;
      const pageIdentifier = window.location.pathname; // Or `/${feedbackId}/${weekId}`;

      ReactGA.event({
        category: 'NutritionPlate_Interaction', // Category for this group of events
        action: 'Section_Selected',             // Action: a section was selected/opened
        label: `${sectionName} on ${pageIdentifier}`, // Label: includes section name and page context
      });
      console.log(`GA Event: Section_Selected, Label: ${sectionName} on ${pageIdentifier}`);
    }
    // --- End of Google Analytics Event Tracking ---
  };


  const handleModerationSectionClick = (section: keyof typeof moderationData) => {
    const newSelectedModerationSection = section === selectedModerationSection ? null : section;
    setSelectedModerationSection(newSelectedModerationSection);

    // --- Google Analytics Event Tracking ---
    // Only track when a moderation section is newly selected (opened)
    if (TRACKING_ID && newSelectedModerationSection) { // Check if GA is configured AND a section is being selected
      const sectionName = moderationData[newSelectedModerationSection].name;
      const pageIdentifier = window.location.pathname; // Or `/${feedbackId}/${weekId}`;

      ReactGA.event({
        category: 'ModerationPlate_Interaction',
        action: 'ModerationSection_Selected',
        label: `${sectionName} on ${pageIdentifier}`,
      });
      console.log(`GA Event: ModerationSection_Selected, Label: ${sectionName} on ${pageIdentifier}`);
    }
    // --- End of Google Analytics Event Tracking ---
  };

  const handleFNSLinkClick = () => {
    if (TRACKING_ID) {
      const pageIdentifier = window.location.pathname; // Or `/${feedbackId}/${weekId}`;
      ReactGA.event({
        category: 'ExternalLink_Click',
        action: 'Clicked_FNS_HEI_Scores_Link',
        label: `FNS HEI Scores Link on ${pageIdentifier}`, // Provides context of which page the link was on
        // For outbound links, you might also consider using a custom 'link_url' parameter
        // or relying on GA4's automatic outbound link tracking if enabled.
        // However, sending a specific event like this gives you more control.
      });
      console.log(`GA Event: Clicked_FNS_HEI_Scores_Link, Label: FNS HEI Scores Link on ${pageIdentifier}`);
    }
    // Since it's an outbound link opening in a new tab (target="_blank"),
    // you don't usually need to manually delay navigation.
  };
  

  const MyPlateSVG = () => {
    // Calculate the exact centers of each quadrant
    const radius = 200;
    const centerX = 200;
    const centerY = 200;
    const quadrantRadius = radius * 0.6; // (radius * Math.cos(45°)) for quadrant centers
    
    // Calculate exact center points for each section
    const centerPoints = {
      vegetables: {
        x: centerX - quadrantRadius * 0.7,  // top-left
        y: centerY - quadrantRadius * 0.7
      },
      fruits: {
        x: centerX + quadrantRadius * 0.7,  // top-right
        y: centerY - quadrantRadius * 0.7
      },
      protein: {
        x: centerX - quadrantRadius * 0.7,  // bottom-left
        y: centerY + quadrantRadius * 0.7
      },
      grains: {
        x: centerX + quadrantRadius * 0.7,  // bottom-right
        y: centerY + quadrantRadius * 0.7
      }
    };
  
    const iconSize = 110; // Size of the icons
    const halfIconSize = iconSize / 2;
  
    return (
      <div className="relative w-full max-w-md mx-auto">
        <svg viewBox="0 0 500 400" className="w-full h-auto max-w-sm mx-auto">
          {/* Base plate circle */}
          <circle 
            cx={centerX} 
            cy={centerY} 
            r={radius} 
            fill="none" 
            stroke="transparent" 
          />
  
          {/* Vegetables (top-left) */}
          <g onClick={() => handleSectionClick('vegetables')} className="cursor-pointer">
            <path 
              d="M200,200 L200,0 A200,200 0 0,0 0,200 Z" 
              fill={plateData.vegetables.color}
              className="transition-all hover:opacity-60"
            />
            <svg 
              x={centerPoints.vegetables.x - halfIconSize} 
              y={centerPoints.vegetables.y - halfIconSize} 
              width={iconSize} 
              height={iconSize}
            >
              <image
                href={plateData.vegetables.icon}
                width={iconSize}
                height={iconSize}
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
          </g>
  
          {/* Fruits (top-right) */}
          <g onClick={() => handleSectionClick('fruits')} className="cursor-pointer">
            <path 
              d="M200,200 L400,200 A200,200 0 0,0 200,0 Z" 
              fill={plateData.fruits.color}
              className="transition-all hover:opacity-60"
            />
            <svg 
              x={centerPoints.fruits.x - halfIconSize} 
              y={centerPoints.fruits.y - halfIconSize} 
              width={iconSize} 
              height={iconSize}
            >
              <image
                href={plateData.fruits.icon}
                width={iconSize}
                height={iconSize}
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
          </g>
  
          {/* Protein (bottom-left) */}
          <g onClick={() => handleSectionClick('protein')} className="cursor-pointer">
            <path 
              d="M200,200 L0,200 A200,200 0 0,0 200,400 Z" 
              fill={plateData.protein.color}
              className="transition-all hover:opacity-60"
            />
            <svg 
              x={centerPoints.protein.x - halfIconSize} 
              y={centerPoints.protein.y - halfIconSize} 
              width={iconSize} 
              height={iconSize}
            >
              <image
                href={plateData.protein.icon}
                width={iconSize}
                height={iconSize}
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
          </g>
  
          {/* Grains (bottom-right) */}
          <g onClick={() => handleSectionClick('grains')} className="cursor-pointer">
            <path 
              d="M200,200 L200,400 A200,200 0 0,0 400,200 Z" 
              fill={plateData.grains.color}
              className="transition-all hover:opacity-60"
            />
            <svg 
              x={centerPoints.grains.x - halfIconSize} 
              y={centerPoints.grains.y - halfIconSize} 
              width={iconSize} 
              height={iconSize}
            >
              <image
                href={plateData.grains.icon}
                width={iconSize}
                height={iconSize}
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
          </g>
  
          {/* Dairy circle */}
          <g onClick={() => handleSectionClick('dairy')} className="cursor-pointer">
            <circle 
              cx="430" 
              cy="100" 
              r="50" 
              fill={plateData.dairy.color}
              className="transition-opacity hover:opacity-80"
            />
            <svg x="380" y="50" width="100" height="100">
              <image
                href={plateData.dairy.icon}
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
          </g>


          {/* Unsaturated Fat circle */}
          <g onClick={() => handleSectionClick('unsaturatedfat')} className="cursor-pointer">
            <circle 
              cx="430" 
              cy="300" 
              r="50" 
              fill={plateData.unsaturatedfat.color}
              className="transition-opacity hover:opacity-80"
            />
            <svg x="380" y="250" width="100" height="100">
              <image
                href={plateData.unsaturatedfat.icon}
                width="100"
                height="100"
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
          </g>
        </svg>
  
      {/* Selected Section Details */}
      {selectedSection && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full" style={{ backgroundColor: plateData[selectedSection]?.color || 'transparent' }}>
              <div className="relative" style={{ width: '64px', height: '64px' }}>
                {plateData[selectedSection]?.icon && (
                  <Image
                    src={plateData[selectedSection].icon}
                    alt="Icon"
                    width={64}
                    height={64}
                    onError={() => {
                        console.error(`Image failed to load: ${plateData[selectedSection].icon}`);
                    }}
                  />
                )}
              </div>
            </div>
            
            <div className="text-gray-900">
            <h3 className="font-bold capitalize">
              {plateData[selectedSection].name}: {plateData[selectedSection].score} {"  "}
              <div 
                className="text-sm font-bold mb-2 px-2 py-1 rounded-full inline-block"
                style={{ 
                  backgroundColor: `${getStatusColor(plateData[selectedSection].status)}20`,
                  color: getStatusColor(plateData[selectedSection].status)
                }}
              >
                {plateData[selectedSection].status}
              </div>
            </h3>
            <p>{plateData[selectedSection].details}</p>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
  

const ModerationSVG = () => {
  // Calculate the exact centers of each quadrant
  const radius = 200;
  const centerX = 200;
  const centerY = 200;
  const quadrantRadius = radius * 0.6; // (radius * Math.cos(45°)) for quadrant centers
  
  // Calculate exact center points for each section
  const centerPoints = {
    refinedgrains: {
      x: centerX - quadrantRadius * 0.7,  // top-left
      y: centerY - quadrantRadius * 0.7
    },
    sodium: {
      x: centerX + quadrantRadius * 0.7,  // top-right
      y: centerY - quadrantRadius * 0.7
    },
    addedsugars: {
      x: centerX - quadrantRadius * 0.7,  // bottom-left
      y: centerY + quadrantRadius * 0.7
    },
    saturatedfat: {
      x: centerX + quadrantRadius * 0.7,  // bottom-right
      y: centerY + quadrantRadius * 0.7
    }
  };

  const iconSize = 110; // Size of the icons
  const halfIconSize = iconSize / 2;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 500 400" className="w-full h-auto max-w-sm mx-auto">
        {/* Base plate circle */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={radius} 
          fill="none" 
          stroke="transparent" 
        />

        {/* Refined Grains (top-left) */}
        <g onClick={() => handleModerationSectionClick('refinedgrains')} className="cursor-pointer">
          <path 
            d="M200,200 L200,0 A200,200 0 0,0 0,200 Z" 
            fill={moderationData.refinedgrains.color}
            className="transition-all hover:opacity-60"
          />
          <svg 
            x={centerPoints.refinedgrains.x - halfIconSize} 
            y={centerPoints.refinedgrains.y - halfIconSize} 
            width={iconSize} 
            height={iconSize}
          >
            <image
              href={moderationData.refinedgrains.icon}
              width={iconSize}
              height={iconSize}
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </g>

        {/* Sodium (top-right) */}
        <g onClick={() => handleModerationSectionClick('sodium')} className="cursor-pointer">
          <path 
            d="M200,200 L400,200 A200,200 0 0,0 200,0 Z" 
            fill={moderationData.sodium.color}
            className="transition-all hover:opacity-60"
          />
          <svg 
            x={centerPoints.sodium.x - halfIconSize} 
            y={centerPoints.sodium.y - halfIconSize} 
            width={iconSize} 
            height={iconSize}
          >
            <image
              href={moderationData.sodium.icon}
              width={iconSize}
              height={iconSize}
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </g>

        {/* Added Sugars (bottom-left) */}
        <g onClick={() => handleModerationSectionClick('addedsugars')} className="cursor-pointer">
          <path 
            d="M200,200 L0,200 A200,200 0 0,0 200,400 Z" 
            fill={moderationData.addedsugars.color}
            className="transition-all hover:opacity-60"
          />
          <svg 
            x={centerPoints.addedsugars.x - halfIconSize} 
            y={centerPoints.addedsugars.y - halfIconSize} 
            width={iconSize} 
            height={iconSize}
          >
            <image
              href={moderationData.addedsugars.icon}
              width={iconSize}
              height={iconSize}
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </g>

        {/* saturated fat (bottom-right) */}
        <g onClick={() => handleModerationSectionClick('saturatedfat')} className="cursor-pointer">
          <path 
            d="M200,200 L200,400 A200,200 0 0,0 400,200 Z" 
            fill={moderationData.saturatedfat.color}
            className="transition-all hover:opacity-60"
          />
          <svg 
            x={centerPoints.saturatedfat.x - halfIconSize} 
            y={centerPoints.saturatedfat.y - halfIconSize} 
            width={iconSize} 
            height={iconSize}
          >
            <image
              href={moderationData.saturatedfat.icon}
              width={iconSize}
              height={iconSize}
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </g>
      </svg>

    {/* Selected Section Details */}
    {selectedModerationSection && (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full" style={{ backgroundColor: moderationData[selectedModerationSection]?.color || 'transparent' }}>
            <div className="relative" style={{ width: '64px', height: '64px' }}>
              {moderationData[selectedModerationSection]?.icon && (
                <Image
                  src={moderationData[selectedModerationSection].icon}
                  alt="Icon"
                  width={64}
                  height={64}
                  onError={() => {
                      console.error(`Image failed to load: ${moderationData[selectedModerationSection].icon}`);
                  }}
                />
              )}
            </div>
          </div>
          <div className="text-gray-900">
            <h3 className="font-bold capitalize">
              {moderationData[selectedModerationSection].name}: {moderationData[selectedModerationSection].score} {"  "}
              <div 
                className="text-sm font-bold mb-2 px-2 py-1 rounded-full inline-block"
                style={{ 
                  backgroundColor: `${getStatusColor(moderationData[selectedModerationSection].status)}20`,
                  color: getStatusColor(moderationData[selectedModerationSection].status)
                }}
              >
                {moderationData[selectedModerationSection].status}
              </div>
            </h3>
            <p>{moderationData[selectedModerationSection].details}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);
};


  

  return (
    <>
    <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    </Head>
    <div className={`w-full bg-white ${openSans.className}`}>
      <div 
        className="min-h-screen overflow-y-auto p-4 text-gray-900"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {/* Logo & Title Section */}
        <div className="white p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0">
              <Image 
                src="/FINs.png" 
                alt="Food Logo" 
                width={64} 
                height={64} 
                className="h-8 w-auto"
              />
            </div>
            <div className="flex-1 text-center">
              <h1 className={`${bungee.className} text-2xl`} 
                  style={{ color: headingColors.title }}>
                Grocery Feedback: {weekId === 'week1-2' ? 'June 9-June 15' : weekId}
              </h1>
              <div className="text-center mt-4 mb-1 text-gray-500 text-sm max-w-2xl mx-auto">
                This is based on your Walmart shopping only 
              </div>
            </div>
          </div>
        </div>

        {/* Positive Choices Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className={`${bungee.className} text-xl mb-4 text-center`} 
              style={{ color: headingColors.positiveChoices }}>
            Positive Choices This Week
          </h2>
          <ul className="space-y-2 text-gray-900">
            <li className="flex items-center gap-2">• <strong>{jsonData.section1[0].good_choice_item1}</strong>{jsonData.section1[0].good_choice_reason1}</li>
            <li className="flex items-center gap-2">• <strong>{jsonData.section1[0].good_choice_item2}</strong>{jsonData.section1[0].good_choice_reason2}</li>
            <li className="flex items-center gap-2">• <strong>{jsonData.section1[0].good_choice_item3}</strong>{jsonData.section1[0].good_choice_reason3}</li>
          </ul>
        </div>

        {/* Goal Progress Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className={`${bungee.className} text-xl mb-4 text-center`}
              style={{ color: headingColors.goalProgress }}>
            Goal Progress
          </h2>
          <p className="mb-4 text-gray-900">You indicated your goals were to <strong>{jsonData.section2[0].user_goals}</strong>.</p>
          <ul className="space-y-2 text-gray-900">
            {jsonData.section2[0].goal_feedback.map((feedback, index) => (
              <li key={index} className="flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ 
                  __html: '• ' + feedback.feedback_text.replace(
                    feedback.feedback_items,
                    `<strong>${feedback.feedback_items}</strong>`
                  )
                }} />
              </li>
            ))}
          </ul>
        </div>


        {/* MyPlate Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className={`${bungee.className} text-xl mb-4 text-center`}
              style={{ color: headingColors.myPlate }}>
            MyPlate Breakdown
          </h2>
          <div className="score text-center m-4"><strong>Overall Nutrition Score: {jsonData.section3[0].total_HEI_score}</strong></div>
          <div className="text-center mt-4 mb-8 text-gray-500 text-sm max-w-2xl mx-auto">
            The Nutrition Score is calculated by the Healthy Eating Index which measures how well your food basket is aligned with the Dietary Guidelines for Americans.
            <br />
            It assumes you will eat 1 serving of each of the foods purchased.
            <br />
            For more information see <a 
              href="https://www.fns.usda.gov/cnpp/hei-scores-americans" 
              className="text-blue-500 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleFNSLinkClick}
            >here</a>
          </div>
          <MyPlateSVG />
          <div className="text-center mt-4 text-gray-500 text-sm">
            Tap to Explore Each Group
          </div>
        </div>

        {/* Other Nutrition Information Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className={`${bungee.className} text-xl mb-4 text-center`}
              style={{ color: headingColors.otherNutrition }}>
            Components to Moderate
          </h2>
          <ModerationSVG />
          <div className="text-center mt-4 text-gray-500 text-sm">
            Tap to Explore Each Group
          </div>
          {/* <div className="mb-4">
            <p className="text-red-500">Saturated Fats: 1.46/10 - Needs Improvement</p>
            <p className="text-gray-900">Choices such as <strong>Butter</strong> and <strong>Cheese</strong> introduced more saturated fats, affecting your score.</p>
          </div> */}
        </div>

        {/* Recommendations Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className={`${bungee.className} text-xl mb-4 text-center`}
              style={{ color: headingColors.recommendations }}>
            Suggestions
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <li className="flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ 
                  __html: jsonData.section5[0].recommendation1.replace(
                    jsonData.section5[0].food_to_substitute1,
                    `<strong>${jsonData.section5[0].food_to_substitute1}</strong>`
                  )
                }} />
              </li>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <li className="flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ 
                  __html: jsonData.section5[0].recommendation2.replace(
                    jsonData.section5[0].food_to_substitute2,
                    `<strong>${jsonData.section5[0].food_to_substitute2}</strong>`
                  )
                }} />
              </li>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <li className="flex items-center gap-2">
                <span dangerouslySetInnerHTML={{ 
                  __html: jsonData.section5[0].recommendation3.replace(
                    jsonData.section5[0].food_to_substitute3,
                    `<strong>${jsonData.section5[0].food_to_substitute3}</strong>`
                  )
                }} />
              </li>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NutritionFeedback;