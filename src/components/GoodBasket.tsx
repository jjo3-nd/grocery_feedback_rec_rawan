"use client";

import React, { useState, useRef } from 'react';
import { Bungee, Open_Sans } from 'next/font/google';
import Image from 'next/image';
import Head from 'next/head';
// import Link from 'next/link';

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
});

const GoodBasket = () => {
  const [selectedSection, setSelectedSection] = useState<keyof typeof plateData | null>(null); // Keep this one
  const [selectedModerationSection, setSelectedModerationSection] = useState<keyof typeof moderationData | null>(null); // Keep this one

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  
  const plateData = {
    vegetables: {
      name: 'Vegetables',
      score: '10/10',
      status: 'Great',
      details: 'You had a great score due to Fresh Roma Tomato and Great Value Cut Green Beans. Vegetables are great to include in your diet as they are high in essential vitamins and minerals and low in calories, supporting overall health. Keep it up!',
      icon: '/vegetables.png',
      color: '#74B744',
      iconPosition: { x: 100, y: 100 },
    },
    fruits: {
      name: 'Fruits',
      score: '10/10',
      status: 'Great',
      details: 'Your purchase of Fresh Gala Apples and Great Value Sliced Bananas (Frozen) contributed to a high fruit score. Fruits are essential for providing vitamins, minerals, and fiber. Keep it up!',
      icon: '/fruits.png',
      color: '#D62128',
      iconPosition: { x: 300, y: 100 },
    },
    protein: {
      name:'Protein',
      score: '10/10',
      status: 'Great',
      details: 'Your purchase of Perdue Harvestland Fresh Ground Turkey and Great Value Black Beans contributed to a high protein score. Protein supports muscle maintenance and repair. Continue enjoying a variety of protein sources!',
      icon: '/protein.png',
      color: '#5F4994',
      iconPosition: { x: 100, y: 300 },
    },
    grains: {
      name:'Grains',
      score: '5.17/10',
      status: 'Moderate',
      details: 'The purchase of Quaker, Quick 1 Minute Oats contributed to your whole grain intake, but Minute Instant White Rice, a refined grain, lowered the score. Whole grains provide more fiber and nutrients compared to refined grains.',
      icon: '/grains.png',
      color: '#E67323',
      iconPosition: { x: 300, y: 300 },
    },
    dairy: {
      name:'Dairy',
      score: '8.05/10',
      status: 'Great',
      details: 'Great Value Greek Plain Nonfat Yogurt and Great Value, 2% Reduced Fat Milk contributed positively to your dairy score. Dairy is an important source of calcium and vitamin D essential for bone health. Well done!',
      icon: '/dairy.png',
      color: '#5083C5',
      iconPosition: { x: 450, y: 200 },
    },
    unsaturatedfat: {
      name:'Unsaturated Fat',
      score: '6.53/10',
      status: 'Moderate',
      details: 'You had a moderate fatty acid score this week. Foods like Great Value Reduced Fat Mayonnaise with Olive Oil contributed to this. Fatty acids, especially omega-3s, improve heart health. Consider balancing your fats better.',
      icon: '/unsaturatedfat.png',
      color: '#fbb616',
      iconPosition: { x: 300, y: 100 },
    },
  };

  const moderationData = {
    refinedgrains: {
      name: 'Refined Grains',
      score: '10/10',
      status: 'Great',
      details: 'Minimal purchase of refined grains like white rice ensured an excellent score. Refined grains, such as white rice, are lower in fiber and nutrients. Try focusing on whole grains for extra health benefits.',
      icon: '/refinedgrains.png',
      color: '#e7138c',
      iconPosition: { x: 100, y: 100 },
    },
    sodium: {
      name: 'Sodium',
      score: '6.49/10',
      status: 'Moderate',
      details: 'Some high-sodium items like Swanson 100% Natural Chicken Broth were purchased. Reducing the intake of high-sodium products can prevent high blood pressure and related diseases. Aim for more low-sodium products next time.',
      icon: '/sodium.png',
      color: '#5ec9e3',
      iconPosition: { x: 300, y: 100 },
    },
    addedsugars: {
      name: 'Added Sugars',
      score: '10/10',
      status: 'Great',
      details: 'Your choices like Great Value Greek Plain Nonfat Yogurt had minimal added sugars. This is beneficial, as high added sugar intake can contribute to weight gain and dental problems. Keep it up!',
      icon: '/addedsugars.png',
      color: '#9e69ad',
      iconPosition: { x: 100, y: 300 },
    },
    saturatedfat: {
      name: 'Saturated Fat',
      score: '9.73/10',
      status: 'Great',
      details: 'With minimal items high in saturated fats, you maintained a great score. Keeping saturated fat low is important in reducing the risk of heart disease. Well done!',
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

  const handleSectionClick = (section: keyof typeof plateData) => {
    setSelectedSection(section === selectedSection ? null : section);
  };

  const handleModerationSectionClick = (section: keyof typeof moderationData) => {
    setSelectedModerationSection(section === selectedModerationSection ? null : section);
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
                Grocery Feedback
              </h1>
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
            <li className="flex items-center gap-2">• Great Value Greek Plain Nonfat Yogurt</li>
            <li className="flex items-center gap-2">• Fresh Roma Tomato</li>
            <li className="flex items-center gap-2">• Great Value Cut Green Beans</li>
          </ul>
        </div>

        {/* Goal Progress Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className={`${bungee.className} text-xl mb-4 text-center`}
              style={{ color: headingColors.goalProgress }}>
            Goal Progress
          </h2>
          <p className="mb-4 text-gray-900">You indicated your goals were to <strong>reduce added sugar</strong>, <strong>reduce sodium</strong>, and <strong>increase vegetable intake</strong>.</p>
          <ul className="space-y-2 text-gray-900">
            <li>• Great work! You made great progress with your goals in reducing added sugar. This was due to your purchases of: Great Value Greek Plain Nonfat Yogurt. Keep it up!</li>
            <li>• You did well in increasing vegetable intake with purchases like <strong>Fresh Roma Tomato</strong> and <strong>Great Value Cut Green Beans</strong>. Keep it up!</li>
            <li>• Some choices this week didn't align with your dietary goal of reducing sodium. While there were some high-sodium items like <strong>Swanson 100% Natural Chicken Broth</strong>, the overall sodium intake should still be monitored.</li>
          </ul>
        </div>

        {/* MyPlate Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className={`${bungee.className} text-xl mb-4 text-center`}
              style={{ color: headingColors.myPlate }}>
            MyPlate Breakdown
          </h2>
          <div className="score text-center m-4"><strong>Overall Nutrition Score: 85.96 / 100</strong></div>
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
              <h3 className="font-bold text-gray-900">Minute Instant White Rice:</h3>
              <p className="text-gray-900">
                Next week try substituting it with brown rice or quinoa for added fiber and nutrients.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-bold text-gray-900">Swanson 100% Natural Chicken Broth:</h3>
              <p className="text-gray-900">
              Consider low-sodium chicken broth or making your own for reduced sodium content.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className={`${bungee.className} text-xl mb-4 text-center`}
              style={{ color: headingColors.progress }}>
            Your Progress
          </h2>
          <div className="p-4 bg-white rounded-lg">
            <div className="mb-4 flex justify-center">
              <Image 
                src="/progress.png" 
                alt="Progress Graph" 
                width={600}
                height={300}
                className="rounded-lg"
                style={{ width: '600px', height: '300px' }} 
              />
            </div>
            <p className="text-gray-900 font-bold text-center">
              Week 3: Congrats! Your HEI Score has increased from last week
            </p>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default GoodBasket;