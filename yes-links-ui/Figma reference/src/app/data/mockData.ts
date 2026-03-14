// Mock data for YesLinks SDK

export interface LinkData {
  id: string;
  shortCode: string;
  targetUrl: string;
  campaign: string;
  tags: string[];
  clicks: number;
  sparklineData: number[];
  createdAt: string;
  isArchived: boolean;
}

export interface AnalyticsData {
  totalClicks: number;
  totalLinks: number;
  activeLinks: number;
  clickThroughRate: number;
  trendData: { date: string; clicks: number; conversions: number }[];
}

// Generate realistic sparkline data (24 hourly data points)
const generateSparklineData = (): number[] => {
  const data: number[] = [];
  let value = Math.floor(Math.random() * 20) + 5;
  
  for (let i = 0; i < 24; i++) {
    const change = (Math.random() - 0.5) * 10;
    value = Math.max(0, value + change);
    data.push(Math.round(value));
  }
  
  return data;
};

export const mockLinks: LinkData[] = [
  {
    id: '1',
    shortCode: 'PRD-2024',
    targetUrl: 'https://acme.com/products/enterprise-suite/annual-pricing',
    campaign: 'Enterprise / Q1 Launch',
    tags: ['enterprise', 'pricing'],
    clicks: 2847,
    sparklineData: generateSparklineData(),
    createdAt: '2024-03-01',
    isArchived: false,
  },
  {
    id: '2',
    shortCode: 'BLOG-AI',
    targetUrl: 'https://acme.com/blog/ai-powered-analytics-deep-dive',
    campaign: 'Content / AI Series',
    tags: ['blog', 'ai', 'analytics'],
    clicks: 1523,
    sparklineData: generateSparklineData(),
    createdAt: '2024-03-05',
    isArchived: false,
  },
  {
    id: '3',
    shortCode: 'WEB-DEMO',
    targetUrl: 'https://demo.acme.com/interactive-dashboard',
    campaign: 'Sales / Demo Portal',
    tags: ['demo', 'sales'],
    clicks: 4291,
    sparklineData: generateSparklineData(),
    createdAt: '2024-02-28',
    isArchived: false,
  },
  {
    id: '4',
    shortCode: 'DOCS-API',
    targetUrl: 'https://docs.acme.com/api/v2/authentication',
    campaign: 'Developer / Documentation',
    tags: ['docs', 'api', 'developer'],
    clicks: 892,
    sparklineData: generateSparklineData(),
    createdAt: '2024-03-08',
    isArchived: false,
  },
  {
    id: '5',
    shortCode: 'EVENT-24',
    targetUrl: 'https://acme.com/events/summit-2024/registration',
    campaign: 'Events / Summit 2024',
    tags: ['event', 'summit'],
    clicks: 3156,
    sparklineData: generateSparklineData(),
    createdAt: '2024-03-02',
    isArchived: false,
  },
  {
    id: '6',
    shortCode: 'CASE-FIN',
    targetUrl: 'https://acme.com/case-studies/fintech-transformation',
    campaign: 'Content / Case Studies',
    tags: ['case-study', 'fintech'],
    clicks: 674,
    sparklineData: generateSparklineData(),
    createdAt: '2024-03-10',
    isArchived: false,
  },
  {
    id: '7',
    shortCode: 'HIRE-ENG',
    targetUrl: 'https://careers.acme.com/positions/senior-engineer',
    campaign: 'Recruiting / Engineering',
    tags: ['careers', 'engineering'],
    clicks: 1847,
    sparklineData: generateSparklineData(),
    createdAt: '2024-02-15',
    isArchived: true,
  },
  {
    id: '8',
    shortCode: 'OLD-PROMO',
    targetUrl: 'https://acme.com/promo/winter-2023',
    campaign: 'Marketing / Winter Sale',
    tags: ['promo'],
    clicks: 5231,
    sparklineData: generateSparklineData(),
    createdAt: '2023-12-01',
    isArchived: true,
  },
];

// Generate trend data for the last 30 days
const generateTrendData = () => {
  const data = [];
  const today = new Date('2024-03-11');
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseClicks = 150 + Math.random() * 100;
    const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.6 : 1;
    const clicks = Math.round(baseClicks * weekendMultiplier);
    const conversions = Math.round(clicks * (0.15 + Math.random() * 0.1));
    
    data.push({
      date: date.toISOString().split('T')[0],
      clicks,
      conversions,
    });
  }
  
  return data;
};

export const mockAnalytics: AnalyticsData = {
  totalClicks: 15430,
  totalLinks: 8,
  activeLinks: 6,
  clickThroughRate: 18.7,
  trendData: generateTrendData(),
};

export const allTags = ['enterprise', 'pricing', 'blog', 'ai', 'analytics', 'demo', 'sales', 'docs', 'api', 'developer', 'event', 'summit', 'case-study', 'fintech', 'careers', 'engineering', 'promo'];

export const allCampaigns = [
  'Enterprise / Q1 Launch',
  'Content / AI Series',
  'Sales / Demo Portal',
  'Developer / Documentation',
  'Events / Summit 2024',
  'Content / Case Studies',
  'Recruiting / Engineering',
  'Marketing / Winter Sale',
];