
export const backgroundPatterns = {
  none: {
    name: 'None',
    header: null,
    footer: null
  },
  
  waves1: {
    name: 'Ocean Waves',
    header: (color = '#4F46E5') => (
      <svg className="absolute top-0 left-0 w-full" height="120" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path fill={color} fillOpacity="0.1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        <path fill={color} fillOpacity="0.2" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
      </svg>
    ),
    footer: (color = '#4F46E5') => (
      <svg className="absolute bottom-0 left-0 w-full" height="120" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path fill={color} fillOpacity="0.1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        <path fill={color} fillOpacity="0.2" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
      </svg>
    )
  },

  waves2: {
    name: 'Smooth Waves',
    header: (color = '#4F46E5') => (
      <svg className="absolute top-0 left-0 w-full" height="100" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path fill={color} fillOpacity="0.15" d="M0,50 Q360,0 720,50 T1440,50 L1440,0 L0,0 Z"></path>
        <path fill={color} fillOpacity="0.1" d="M0,70 Q360,20 720,70 T1440,70 L1440,0 L0,0 Z"></path>
      </svg>
    ),
    footer: (color = '#4F46E5') => (
      <svg className="absolute bottom-0 left-0 w-full" height="100" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path fill={color} fillOpacity="0.15" d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z"></path>
        <path fill={color} fillOpacity="0.1" d="M0,30 Q360,80 720,30 T1440,30 L1440,100 L0,100 Z"></path>
      </svg>
    )
  },

  curves: {
    name: 'Elegant Curves',
    header: (color = '#4F46E5') => (
      <svg className="absolute top-0 left-0 w-full" height="150" viewBox="0 0 1440 150" preserveAspectRatio="none">
        <path fill={color} fillOpacity="0.2" d="M0,96L80,90.7C160,85,320,75,480,80C640,85,800,107,960,112C1120,117,1280,107,1360,101.3L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
      </svg>
    ),
    footer: (color = '#4F46E5') => (
      <svg className="absolute bottom-0 left-0 w-full" height="150" viewBox="0 0 1440 150" preserveAspectRatio="none">
        <path fill={color} fillOpacity="0.2" d="M0,96L80,90.7C160,85,320,75,480,80C640,85,800,107,960,112C1120,117,1280,107,1360,101.3L1440,96L1440,150L1360,150C1280,150,1120,150,960,150C800,150,640,150,480,150C320,150,160,150,80,150L0,150Z"></path>
      </svg>
    )
  },

  geometric: {
    name: 'Geometric',
    header: (color = '#4F46E5') => (
      <svg className="absolute top-0 left-0 w-full" height="120" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <polygon fill={color} fillOpacity="0.15" points="0,0 1440,0 1440,60 720,120 0,60"></polygon>
        <polygon fill={color} fillOpacity="0.1" points="0,0 1440,0 1440,40 720,80 0,40"></polygon>
      </svg>
    ),
    footer: (color = '#4F46E5') => (
      <svg className="absolute bottom-0 left-0 w-full" height="120" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <polygon fill={color} fillOpacity="0.15" points="0,120 1440,120 1440,60 720,0 0,60"></polygon>
        <polygon fill={color} fillOpacity="0.1" points="0,120 1440,120 1440,80 720,40 0,80"></polygon>
      </svg>
    )
  },

  diagonal: {
    name: 'Diagonal Stripes',
    header: (color = '#4F46E5') => (
      <svg className="absolute top-0 left-0 w-full" height="100" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <polygon fill={color} fillOpacity="0.15" points="0,0 1440,0 1440,100 0,50"></polygon>
        <polygon fill={color} fillOpacity="0.08" points="0,0 1440,0 1440,70 0,30"></polygon>
      </svg>
    ),
    footer: (color = '#4F46E5') => (
      <svg className="absolute bottom-0 left-0 w-full" height="100" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <polygon fill={color} fillOpacity="0.15" points="0,100 1440,100 1440,0 0,50"></polygon>
        <polygon fill={color} fillOpacity="0.08" points="0,100 1440,100 1440,30 0,70"></polygon>
      </svg>
    )
  },

  circles: {
    name: 'Circles',
    header: (color = '#4F46E5') => (
      <svg className="absolute top-0 left-0 w-full" height="120" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <circle cx="200" cy="40" r="60" fill={color} fillOpacity="0.1" />
        <circle cx="500" cy="60" r="80" fill={color} fillOpacity="0.08" />
        <circle cx="900" cy="30" r="70" fill={color} fillOpacity="0.12" />
        <circle cx="1200" cy="50" r="65" fill={color} fillOpacity="0.09" />
        <circle cx="350" cy="70" r="50" fill={color} fillOpacity="0.1" />
        <circle cx="1050" cy="80" r="55" fill={color} fillOpacity="0.11" />
      </svg>
    ),
    footer: (color = '#4F46E5') => (
      <svg className="absolute bottom-0 left-0 w-full" height="120" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <circle cx="200" cy="80" r="60" fill={color} fillOpacity="0.1" />
        <circle cx="500" cy="60" r="80" fill={color} fillOpacity="0.08" />
        <circle cx="900" cy="90" r="70" fill={color} fillOpacity="0.12" />
        <circle cx="1200" cy="70" r="65" fill={color} fillOpacity="0.09" />
        <circle cx="350" cy="50" r="50" fill={color} fillOpacity="0.1" />
        <circle cx="1050" cy="40" r="55" fill={color} fillOpacity="0.11" />
      </svg>
    )
  },

  abstract: {
    name: 'Abstract Flow',
    header: (color = '#4F46E5') => (
      <svg className="absolute top-0 left-0 w-full" height="140" viewBox="0 0 1440 140" preserveAspectRatio="none">
        <path fill={color} fillOpacity="0.12" d="M0,70 C240,20 480,120 720,70 C960,20 1200,120 1440,70 L1440,0 L0,0 Z"></path>
        <path fill={color} fillOpacity="0.08" d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,0 L0,0 Z"></path>
        <ellipse cx="300" cy="30" rx="80" ry="40" fill={color} fillOpacity="0.06" />
        <ellipse cx="1100" cy="40" rx="100" ry="50" fill={color} fillOpacity="0.06" />
      </svg>
    ),
    footer: (color = '#4F46E5') => (
      <svg className="absolute bottom-0 left-0 w-full" height="140" viewBox="0 0 1440 140" preserveAspectRatio="none">
        <path fill={color} fillOpacity="0.12" d="M0,70 C240,120 480,20 720,70 C960,120 1200,20 1440,70 L1440,140 L0,140 Z"></path>
        <path fill={color} fillOpacity="0.08" d="M0,90 C240,40 480,140 720,90 C960,40 1200,140 1440,90 L1440,140 L0,140 Z"></path>
        <ellipse cx="300" cy="110" rx="80" ry="40" fill={color} fillOpacity="0.06" />
        <ellipse cx="1100" cy="100" rx="100" ry="50" fill={color} fillOpacity="0.06" />
      </svg>
    )
  },

  minimal: {
    name: 'Minimal Line',
    header: (color = '#4F46E5') => (
      <svg className="absolute top-0 left-0 w-full" height="80" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <rect x="0" y="0" width="1440" height="4" fill={color} fillOpacity="0.2" />
        <rect x="0" y="10" width="1440" height="2" fill={color} fillOpacity="0.1" />
      </svg>
    ),
    footer: (color = '#4F46E5') => (
      <svg className="absolute bottom-0 left-0 w-full" height="80" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <rect x="0" y="76" width="1440" height="4" fill={color} fillOpacity="0.2" />
        <rect x="0" y="68" width="1440" height="2" fill={color} fillOpacity="0.1" />
      </svg>
    )
  },

  gradient: {
    name: 'Gradient Fade',
    header: (color = '#4F46E5') => (
      <svg className="absolute top-0 left-0 w-full" height="150" viewBox="0 0 1440 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="150" fill="url(#headerGrad)" />
      </svg>
    ),
    footer: (color = '#4F46E5') => (
      <svg className="absolute bottom-0 left-0 w-full" height="150" viewBox="0 0 1440 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="footerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.2 }} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="150" fill="url(#footerGrad)" />
      </svg>
    )
  }
};

export const BackgroundPattern = ({ pattern, position, color }) => {
  if (!pattern || pattern === 'none' || !backgroundPatterns[pattern]) {
    return null;
  }

  const patternData = backgroundPatterns[pattern];
  
  if (position === 'header' && patternData.header) {
    return patternData.header(color);
  }
  
  if (position === 'footer' && patternData.footer) {
    return patternData.footer(color);
  }
  
  return null;
};

export default BackgroundPattern;
