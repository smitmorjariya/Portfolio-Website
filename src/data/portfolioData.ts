export interface SkillGroup {
  category: string;
  description: string;
  items: {
    name: string;
    context: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  type: string;
  location: string;
  period: string;
  duration: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  affiliation: string;
  location: string;
  period: string;
  grade: string;
  highlights: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  overview: string;
  problemSolved: string;
  contribution: string;
  technologies: string[];
  features: string[];
  githubUrl: string;
  liveUrl: string | null;
  images: ProjectImage[];
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  focus: string[];
}

export const PERSONAL_INFO = {
  name: 'Smit Morjariya',
  shortName: 'Smit Morjariya',
  title: 'Front-End Developer',
  tagline: 'Building modern, responsive and interactive web experiences.',
  heroIntro:
    'Computer Science graduate focused on clean component architecture, responsive interfaces, and practical React.js development. Seeking Frontend Developer, React.js Intern, and Junior Web Developer opportunities.',
  availability: 'Available for Frontend Developer, React.js Intern & Junior Web Developer roles',
  location: 'Jetpur, Gujarat, India',
  email: 'smit.8189@gmail.com',
  phone: '+91 8160888895',
  githubUrl: 'https://github.com/smitmorjariya',
  linkedinUrl: 'https://www.linkedin.com/in/smitmorjariya/',
  portfolioUrl: 'https://smitmorjariya.vercel.app/',
  resumeUrl: '/assets/aistudio/Smit_Resume_ceebd3f0.pdf',
  portraitUrl: '/assets/aistudio/WhatsApp_Image_2025-08-04_at_10.24.33_e02dd8ce_06c563df.jpg',
} as const;

export const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const;

export const ABOUT_CONTENT = {
  heading: 'Practical engineering grounded in clean front-end fundamentals.',
  paragraphs: [
    'I completed my Bachelor of Engineering in Computer Science & Engineering from Noble Group of Institutions, Junagadh, affiliated with Gujarat Technological University (GTU). During my studies, I gravitated toward front-end web development because I enjoy turning clear design structure and application logic into responsive interfaces people can immediately use.',
    'My learning path began with semantic HTML5, modern CSS3 layouts, and JavaScript fundamentals before progressing into Tailwind CSS and React.js component architecture. Through remote internships at Tech OctaNet Service and Zidio Development, I moved from building static responsive pages to developing complete, data-driven interfaces with authentication, API integration, and real-time updates.',
    'I focus on writing readable, maintainable front-end code that adapts naturally across desktop and mobile screens. Right now, I am looking to contribute to an engineering team where I can ship reliable React.js interfaces and continue growing as a developer.',
  ],
  quickFacts: [
    { label: 'Location', value: 'Jetpur, Gujarat, India' },
    { label: 'Degree', value: 'B.E. Computer Science & Engineering (GTU)' },
    { label: 'Focus', value: 'React.js, JavaScript & Responsive Web Apps' },
    { label: 'Status', value: 'Fresher — Open to Intern & Junior Roles' },
  ],
} as const;

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Frontend',
    description: 'Core languages, styling architecture, and component frameworks I use to build responsive web applications.',
    items: [
      {
        name: 'HTML5',
        context: 'Semantic document structure, accessible landmarks, and clean form markup',
      },
      {
        name: 'CSS3',
        context: 'Flexbox, CSS Grid, responsive breakpoints, and smooth UI transitions',
      },
      {
        name: 'JavaScript',
        context: 'ES6+ syntax, DOM manipulation, asynchronous API calls, and client-side logic',
      },
      {
        name: 'Tailwind CSS',
        context: 'Utility-first layout systems, consistent spacing scales, and responsive styling',
      },
      {
        name: 'React.js',
        context: 'Reusable functional components, hooks, routing, and state-driven interfaces',
      },
    ],
  },
  {
    category: 'Tools',
    description: 'Daily version-control and development environment tools supporting collaborative workflows.',
    items: [
      {
        name: 'Git',
        context: 'Branching, structured commit history, and local change management',
      },
      {
        name: 'GitHub',
        context: 'Remote repositories, project documentation, and code hosting',
      },
      {
        name: 'VS Code',
        context: 'Primary editor for React, JavaScript, and Tailwind CSS development',
      },
      {
        name: 'Google AI Studio',
        context: 'AI-assisted UI prototyping and modern web workflows',
      },
    ],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'zidio',
    role: 'MERN Stack Development Intern',
    company: 'Zidio Development',
    type: 'Internship · Remote',
    location: 'Remote',
    period: 'February 2025 – May 2025',
    duration: '3 Months',
    summary:
      'Built TeamOrbit, a full-stack task management web application using the MERN stack, with emphasis on responsive React.js views and role-based workflows.',
    responsibilities: [
      'Developed the TeamOrbit Task Management System using React.js, Tailwind CSS, Node.js, Express.js, and MongoDB.',
      'Implemented separate Admin and User interfaces protected with JWT-based authentication and role-aware routing.',
      'Built interactive task creation, priority tracking, status filtering, and dashboard analytics views using Recharts.',
      'Integrated real-time team messaging with Socket.IO and collaborative video meeting views inside the application.',
    ],
    technologies: ['React.js', 'Tailwind CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB'],
  },
  {
    id: 'octanet',
    role: 'Front-End Development Intern',
    company: 'Tech OctaNet Service Pvt. Ltd.',
    type: 'Internship · Remote',
    location: 'Remote',
    period: 'June 2024 – July 2024',
    duration: '1 Month',
    summary:
      'Completed practical front-end deliverables focused on layout fidelity, responsive styling, and interactive JavaScript functionality.',
    responsibilities: [
      'Built a responsive landing page translating layout references from Figma into semantic HTML5 and CSS3.',
      'Developed an interactive to-do list web application with client-side task creation, completion, and removal.',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    id: 'be-cse',
    degree: 'B.E. Computer Science & Engineering',
    field: 'Bachelor of Engineering',
    institution: 'Noble Group of Institutions, Junagadh',
    affiliation: 'Gujarat Technological University (GTU)',
    location: 'Junagadh, Gujarat',
    period: '2021 – 2025',
    grade: 'CGPA 7.83',
    highlights:
      'Completed core undergraduate coursework in web technologies, data structures, database systems, and software engineering while building hands-on front-end and MERN web projects.',
  },
  {
    id: 'hsc-science',
    degree: 'Higher Secondary Certificate (HSC — Science)',
    field: 'Class XII',
    institution: 'A Success School, Jetpur',
    affiliation: 'Gujarat Secondary & Higher Secondary Education Board',
    location: 'Jetpur, Gujarat',
    period: '2020 – 2021',
    grade: '74%',
    highlights:
      'Completed higher secondary education in the Science stream, building the analytical foundation for computer engineering.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'teamorbit',
    number: '01',
    title: 'TeamOrbit',
    subtitle: 'Task Management System',
    category: 'MERN Stack Web Application · Zidio Development Internship',
    year: '2025',
    overview:
      'A full-stack task management system built during my internship at Zidio Development to help teams create, assign, track, and discuss tasks inside a unified web workspace.',
    problemSolved:
      'Small teams often split task lists, priority tracking, status reports, and team discussions across disconnected tools. TeamOrbit brings role-based task workflows, visual status summaries, and real-time messaging into one browser interface.',
    contribution:
      'Developed the full application end to end during my internship—implementing the React.js + Tailwind CSS dashboards, role-based Admin and User routes, REST API endpoints with Express.js and MongoDB, Recharts task charts, Excel export support, and Socket.IO chat.',
    technologies: [
      'React.js',
      'Tailwind CSS',
      'React Router',
      'Recharts',
      'Axios',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Socket.IO',
      'JWT',
    ],
    features: [
      'Role-based Admin and User dashboards with JWT authentication',
      'Task creation, editing, checklist progress, and priority/status filtering',
      'Task distribution donut chart and priority bar chart powered by Recharts',
      'Real-time team messaging with Socket.IO and Jitsi meeting room views',
      'Downloadable Excel task and user reports via backend export routes',
    ],
    githubUrl: 'https://github.com/smitmorjariya/TeamOrbit-Task-Manager-App',
    liveUrl: null,
    images: [
      {
        src: '/assets/projects/teamorbit-preview.png',
        alt: 'TeamOrbit Admin Dashboard showing total tasks, pending/in-progress/completed counts, task distribution chart, priority bar chart, and recent tasks table',
        caption: 'Admin Dashboard — Task metrics, distribution & priority charts, and recent task table',
      },
      {
        src: '/assets/projects/teamorbit-login.png',
        alt: 'TeamOrbit Authentication screen with email and password login form and split visual panel',
        caption: 'Authentication Flow — Role-aware login view for Admin and Team Member accounts',
      },
    ],
  },
  {
    id: 'pixelcraft',
    number: '02',
    title: 'PixelCraft',
    subtitle: 'Creative Studio Website',
    category: 'Responsive Web Interface · Deployed on Vercel',
    year: '2025',
    overview:
      'A responsive creative digital agency website built to present studio capabilities, design process, featured work, and client inquiry flows with crisp dark editorial styling.',
    problemSolved:
      'Gives creative studios and small digital businesses a structured, fast-loading web presence that communicates services and workflow clearly while guiding visitors directly toward contacting the team.',
    contribution:
      'Built the responsive front-end layout and interactive sections—structuring navigation, Home, About, Services, Process, Work, Contact, and legal pages (Privacy Policy and Terms & Conditions) with smooth scroll transitions and mobile adaptability.',
    technologies: ['Google AI Studio', 'React.js', 'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'GSAP'],
    features: [
      'Editorial dark-theme layout with bold display typography and persistent sidebar navigation',
      'Dedicated Home, About, Services, Process, Work, and Contact sections',
      'Smooth scroll-driven transitions and interactive navigation states',
      'Integrated contact form flow alongside Privacy Policy and Terms pages',
      'Fully responsive experience deployed live on Vercel',
    ],
    githubUrl: 'https://github.com/smitmorjariya/PixelCraft_Website',
    liveUrl: 'https://pixelcraftcreativestudio.vercel.app/',
    images: [
      {
        src: '/assets/projects/pixelcraft-preview.png',
        alt: 'PixelCraft Creative Studio live website homepage featuring bold editorial typography, vertical brand navigation, and contact call to action',
        caption: 'Live Homepage — Editorial studio hero captured directly from pixelcraftcreativestudio.vercel.app',
      },
    ],
  },
];

export const SERVICES: ServiceItem[] = [
  {
    number: '01',
    title: 'Responsive Website Development',
    description:
      'Building multi-device websites with semantic HTML5, modern CSS Grid/Flexbox, and Tailwind CSS so layouts remain readable and effortless across desktop, tablet, and mobile screens.',
    focus: ['Mobile-first layouts', 'Cross-browser consistency', 'Clean semantic markup'],
  },
  {
    number: '02',
    title: 'Frontend Development',
    description:
      'Translating visual specifications and functional requirements into structured, maintainable client-side code with predictable state handling and accessible controls.',
    focus: ['HTML5 & CSS3', 'Modern JavaScript (ES6+)', 'Accessibility fundamentals'],
  },
  {
    number: '03',
    title: 'React.js Development',
    description:
      'Creating modular single-page applications using React.js components, hooks, client-side routing, and REST API integrations for dashboards and interactive tools.',
    focus: ['Reusable components', 'Hooks & state flow', 'API integration'],
  },
  {
    number: '04',
    title: 'Modern Web Interfaces',
    description:
      'Crafting refined, fast-loading interfaces enhanced with purposeful GSAP motion, clear typographic hierarchy, and thoughtful interactive feedback.',
    focus: ['Tailwind CSS systems', 'GSAP micro-interactions', 'Performance-minded UI'],
  },
];
