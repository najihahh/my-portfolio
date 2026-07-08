import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Mail, ExternalLink, Code, Layers, Database, Monitor, FileText, ChevronDown, Skull, Award, Gamepad2, Users, Flame, ChevronLeft, ChevronRight, ShieldCheck, Trophy, Megaphone } from 'lucide-react';

// Inline GitHub icon
function GithubIcon({ size = 18, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 4.94 3.2 9.13 7.65 10.6.56.1.76-.24.76-.54 0-.27-.01-1.16-.02-2.1-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.02-.69.08-.68.08-.68 1.12.08 1.72 1.15 1.72 1.15 1 1.72 2.62 1.22 3.26.93.1-.73.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.62 5.24-5.11 5.52.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54A11.03 11.03 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

// Inline LinkedIn icon
function LinkedinIcon({ size = 18, className = '' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

// ---------- Interactive network-node background ----------
function NetworkCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width, height;
    let nodes = [];

    const NODE_COUNT_BASE = 42;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      const count = Math.max(18, Math.round((width * height) / 26000));
      nodes = Array.from({ length: Math.min(count, NODE_COUNT_BASE) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 1.2,
      }));
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          n.x += (dx / (dist || 1)) * force * 1.2;
          n.y += (dy / (dist || 1)) * force * 1.2;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        
        const dxm = nodes[i].x - mouse.x, dym = nodes[i].y - mouse.y;
        const distm = Math.sqrt(dxm * dxm + dym * dym);
        if (distm < 160) {
          const opacity = (1 - distm / 160) * 0.5;
          ctx.strokeStyle = `rgba(216, 180, 254, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(216, 180, 254, 0.85)';
        ctx.fill();
      }

      animationId = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-auto" />;
}

// ---------- Scroll-reveal hook ----------
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

// ---------- Skill bar with animated fill ----------
function SkillBar({ label, level, detail }) {
  const [ref, inView] = useInView(0.4);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-zinc-300 font-medium group-hover:text-purple-300 transition-colors">{label}</span>
        <span className={`text-xs text-purple-400 font-mono transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-60'}`}>
          {level}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-purple-950/20 border border-purple-900/20 overflow-hidden shadow-inner backdrop-blur-sm">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-400 transition-all duration-[1400ms] ease-out shadow-[0_0_8px_rgba(168,85,247,0.5)]"
          style={{ width: inView ? `${level}%` : '0%' }}
        />
      </div>
      <p className={`text-xs text-zinc-400 mt-1.5 overflow-hidden transition-all duration-300 ${hovered ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
        {detail}
      </p>
    </div>
  );
}

// ---------- Project data ----------
const PROJECTS = [
  {
    id: 'netdiagram',
    icon: Code,
    title: 'NetDiagram (Topology System)',
    blurb: 'An interactive web-based network topology editor built during an internship at Akademi Kastam Diraja Malaysia.',
    detail: 'Users construct and organize network structures with drag-and-drop mechanics, saving layouts to a live PostgreSQL backend via Supabase. The canvas engine handles node linking, auto-layout snapping, and export for documentation handoffs.',
    role: 'Sole developer — designed the schema, built the canvas interactions, and shipped the internal tool.',
    tech: ['React.js', 'React Flow', 'Node.js', 'Supabase', 'PostgreSQL'],
  },
  {
    id: 'rekod',
    icon: Layers,
    title: 'Sistem Pengurusan Rekod Berpusat',
    blurb: 'A secure centralized inventory management system replacing historical manual logs.',
    detail: 'Built with role-based access control, credential hashing, and an automated rule-monitoring module that pushes real-time alerts to a Telegram bot whenever inventory thresholds are breached.',
    role: 'Full-stack build — backend auth, database schema, and the alerting integration.',
    tech: ['PHP', 'MySQL', 'JavaScript', 'Telegram API', 'Hostinger'],
  },
  {
    id: 'atlas',
    icon: Skull,
    title: '3D Atlas: Head Anatomy',
    blurb: 'An interactive mobile app with augmented reality experience for anatomical modeling application for education.',
    detail: 'Learners rotate, explode, and label customized skeletal mesh parts inside an immersive virtual canvas — built as a multimedia computing capstone exploring 3D interaction design for learning.',
    role: 'Built the interaction system and mesh labeling logic; modeled assets in Blender.',
    tech: ['Unity', 'C#', 'Blender'],
  },
];

function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = project.icon;

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`relative bg-zinc-950/30 border rounded-2xl p-6 flex flex-col cursor-pointer transition-all duration-500 backdrop-blur-sm group
        ${expanded ? 'border-purple-500 bg-gradient-to-br from-purple-950/30 via-zinc-950/50 to-black md:col-span-2 lg:col-span-2 shadow-[0_0_30px_rgba(147,51,234,0.15)]' : 'border-purple-950/60 hover:border-purple-500/50 hover:bg-purple-950/10 hover:-translate-y-2 shadow-lg'}
      `}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center justify-between text-zinc-400 mb-6 relative z-10">
        <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-900/30 text-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300">
          <Icon className={`transition-transform duration-500 ${expanded ? 'scale-110 rotate-12' : 'group-hover:rotate-12'}`} size={22} />
        </div>
        <div className="flex items-center gap-3">
          <a href="#" onClick={(e) => e.stopPropagation()} className="hover:text-purple-400 transition-colors p-1.5 hover:bg-zinc-900/60 rounded-lg"><GithubIcon size={18} /></a>
          <a href="#" onClick={(e) => e.stopPropagation()} className="hover:text-purple-400 transition-colors p-1.5 hover:bg-zinc-900/60 rounded-lg"><ExternalLink size={18} /></a>
          <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-300 ${expanded ? 'rotate-180 text-purple-400' : ''}`} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-zinc-100 mb-2 relative z-10 group-hover:text-purple-300 transition-colors">{project.title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed mb-4 relative z-10">{project.blurb}</p>

      <div className={`grid transition-all duration-500 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="border-t border-purple-900/30 pt-4 space-y-3 relative z-10">
            <p className="text-sm text-zinc-300 leading-relaxed">{project.detail}</p>
            <p className="text-xs text-purple-300/80 italic bg-purple-950/30 p-2.5 rounded-lg border border-purple-900/20">{project.role}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 mt-auto relative z-10">
        {project.tech.map((tech) => (
          <span key={tech} className="text-[11px] font-medium font-mono px-2.5 py-1 rounded-lg bg-purple-950/40 text-purple-300 border border-purple-900/30 group-hover:border-purple-500/30 transition-colors">{tech}</span>
        ))}
      </div>

      {!expanded && (
        <span className="absolute bottom-4 right-6 text-[10px] font-mono tracking-wider text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400/80">EXPLORE DETAILS →</span>
      )}
    </div>
  );
}

// ---------- Timeline data ----------
const TIMELINE = [
  {
    date: 'March 2026 — August 2026',
    role: 'ICT Intern',
    org: 'Akademi Kastam Diraja Malaysia',
    summary: 'Built full-stack solutions for monitoring organizational network components.',
    points: [
      'Designed and shipped NetDiagram, an internal topology-mapping tool used by the IT team.',
      'Maintained and documented live network topologies across departments.',
      'Provided day-to-day technical support for corporate operational systems.',
    ],
    current: true,
  },
  {
    date: 'September 2021 — February 2022',
    role: 'IT Technician Support Intern',
    org: 'PC World',
    summary: 'Handled hardware diagnostics and OS deployment for consumer clients.',
    points: [
      'Ran hardware fault assessments and repairs for walk-in customers.',
      'Performed clean OS installs and configuration for workstation clients.',
      'Assisted senior technicians with client-facing troubleshooting.',
    ],
    current: false,
  },
];

function TimelineItem({ item, index }) {
  const [open, setOpen] = useState(index === 0);
  const [ref, inView] = useInView(0.2);

  return (
    <div
      ref={ref}
      className={`relative pl-12 group transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
    >
      {/* Immersive interactive pulse connector */}
      <div className={`absolute left-2 top-2 w-3.5 h-3.5 rounded-full bg-black border-2 transition-all duration-500 z-10 
        ${item.current ? 'border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)] animate-pulse' : 'border-purple-950 group-hover:border-purple-500'} ${open ? 'bg-purple-400 scale-125' : ''}`} 
      />
      
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left space-y-1 p-5 rounded-2xl bg-zinc-950/20 hover:bg-purple-950/10 border transition-all duration-500 relative overflow-hidden backdrop-blur-sm
          ${open ? 'border-purple-500/40 bg-purple-950/5 shadow-[0_0_25px_rgba(168,85,247,0.05)]' : 'border-purple-950/30 hover:border-purple-900/40'}`}
      >
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-mono tracking-wider ${item.current ? 'text-purple-400 font-bold' : 'text-zinc-500'}`}>{item.date}</span>
          <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-500 flex-shrink-0 ${open ? 'rotate-180 text-purple-400' : ''}`} />
        </div>
        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-purple-300 transition-colors pt-1">{item.role}</h3>
        <p className="text-sm font-medium text-purple-400/90">{item.org}</p>
        <p className="text-sm text-zinc-400 pt-1 leading-relaxed">{item.summary}</p>

        <div className={`grid transition-all duration-500 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <ul className="space-y-2.5 pt-3 border-t border-purple-900/20">
              {item.points.map((p, i) => (
                <li key={i} className="text-sm text-zinc-400 flex gap-2.5 items-start leading-relaxed">
                  <span className="text-purple-400 font-bold select-none">›</span> <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </button>
    </div>
  );
}

// ---------- Section wrapper with reveal-on-scroll ----------
function Reveal({ children, className = '' }) {
  const [ref, inView] = useInView(0.12);
  return (
    <div ref={ref} className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}>
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Interactive Modal Lightbox state
  const [lightbox, setLightbox] = useState({ isOpen: false, images: [], currentIndex: 0, title: '', desc: '' });

  const sections = ['hero', 'about', 'projects', 'skills', 'experience', 'credentials', 'involvement', 'contact'];

  const CREDENTIALS = [
    {
      title: 'Kursus Microsoft Excel (Tahap 1)',
      issuer: 'Akademi Kastam Diraja Malaysia, Melaka',
      type: 'Professional Training',
      icon: Award,
      image: '/excel(1).jpeg',
      desc: 'Advanced corporate data manipulation, formulas audit configurations, and visual dashboard macro metrics analysis.'
    },
    {
      title: 'AI Appreciate Badge',
      issuer: 'Ministry of Digital Malaysia',
      type: 'National Digital Initiative',
      icon: Trophy,
      image: '/AI APPRECIATE BADGE.png',
      desc: 'Recognized for understanding national digital transformation frameworks and practical generative model engineering principles.'
    },
    {
      title: 'AI Aware Badge',
      issuer: 'Ministry of Digital Malaysia',
      type: 'National Digital Initiative',
      icon: Monitor,
      image: '/AI AWARE BADGE.png',
      desc: 'Foundational verification in AI ethics, deep learning implications, and automation impact over domestic web ecosystems.'
    },
    {
      title: 'Cloud Untuk Rakyat',
      issuer: 'Ministry of Digital Malaysia',
      type: 'National Digital Initiative',
      icon: Database,
      image: '/cloud untuk rakyat certificate.png',
      desc: 'Completed specialized modules targeting localized public-sector cloud architectures and distributed secure hosting layouts.'
    },
    {
      title: 'Cybersecurity Certificate',
      issuer: 'Ministry of Digital Malaysia',
      type: 'Technical Credential',
      icon: ShieldCheck,
      image: '/cybersecurity certificate.png',
      desc: 'Validated competencies in threat assessment, web-app credential parsing vectors, data sanitization, and cryptographic hashes.'
    }
  ];

  const LEADERSHIP = [
    {
      title: 'FUTURE INNOVATORS: EXPLORING THE TECH WORLD',
      category: 'Industry Exploration',
      icon: Gamepad2,
      details: [
        'Coordinated documentation, schedules, and committee communications as Programme Secretary.',       
        'Supported the successful industry visit to PlayStation Studios Malaysia.',
        'Gained insights into multimedia careers and real-world applications of AI, UX design, and game production.',
      ],
      images: ['/playstation(1).jpeg', '/playstation(2).jpeg', '/playstation(3).jpeg']
    },
    {
      title: 'Kembara Ilmu Bersama Pelajar Orang Asli (KIBPOA)',
      category: 'Program Leadership',
      icon: Flame,
      details: [
        'Spearheaded project initiatives and community milestones.',
        'Collaborated with UiTM Seri Iskandar and committee members to ensure smooth programme execution.',
        'Contributed to a successful community outreach programme that received positive feedback.',
      ],
      images: ['/kipboa.jpeg']
    },
    {
      title: 'Multimedia Club (UPM)',
      category: 'Department Representative',
      icon: Users,
      details: [
        'Coordinated club documentation, communications, and committee activities as Deputy Secretary of the club.',
        'Managed creative content pipelines and digital communications across student platforms.',
        'Contributed to club improvements recognized and praised by the Dean.',
      ],
      images: ['/mmc(1).jpeg', '/mmc(2).jpg', '/mmc(3).jpeg']
    },
    {
      title: 'MULTIMEDIA DIGITAL COLLOQUIUM 2025',
      category: 'Pitching Augmented Reality',
      icon: Megaphone,
      details: [
        'Present 3D Atlas : Head Anatomy, an augmented reality learning application.',
        'Demonstrate the application in a live showcase to be judge.',
        'Enhanced my presentation and communication skills through project pitiching.'
      ],
      images: ['/ar(1).jpg', '/ar(2).jpg', '/ar(3).jpg', '/ar(4).jpg']
    }
  
  ];

  const openLightbox = (images, index, title = '', desc = '') => {
    setLightbox({ isOpen: true, images, currentIndex: index, title, desc });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, images: [], currentIndex: 0, title: '', desc: '' });
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItem = (id, label) => (
    <button
      onClick={() => scrollToSection(id)}
      className={`text-xs uppercase font-mono tracking-wider transition-colors relative pb-1
        ${activeSection === id ? 'text-purple-400 font-bold' : 'text-zinc-400 hover:text-white'}`}
    >
      {label}
      {activeSection === id && (
        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050208] text-zinc-200 font-sans antialiased selection:bg-purple-600 selection:text-white relative">
      
      {/* HIGH-END INTERACTIVE FLOATING SIDE NAVIGATION TRACK */}
      <div className="hidden lg:flex flex-col fixed right-8 top-1/2 -translate-y-1/2 z-40 space-y-4 bg-zinc-950/40 border border-purple-950/40 p-3 rounded-full backdrop-blur-md shadow-2xl">
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => scrollToSection(sec)}
            className="group relative flex items-center justify-center p-1.5"
            aria-label={`Scroll to ${sec}`}
          >
            <span className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === sec ? 'bg-purple-400 scale-150 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'bg-zinc-700 group-hover:bg-purple-900 group-hover:scale-125'}`} />
            <span className="absolute right-8 uppercase font-mono text-[10px] tracking-widest bg-zinc-950/90 border border-purple-900/40 px-2.5 py-1 rounded-md text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl backdrop-blur-sm whitespace-nowrap">
              {sec === 'credentials' ? 'Badges & Certs' : sec}
            </span>
          </button>
        ))}
      </div>

      {/* 1. STICKY NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#050208]/70 border-b border-purple-950/20 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-xl font-bold bg-gradient-to-r from-purple-400 via-white to-fuchsia-400 bg-clip-text text-transparent hover:opacity-80 transition-all duration-300 tracking-tight"
          >
            Najihah.
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navItem('about', 'About')}
            {navItem('projects', 'Projects')}
            {navItem('skills', 'Skills')}
            {navItem('experience', 'Experience')}
            {navItem('credentials', 'Badges & Certs')}
            {navItem('involvement', 'Involvement')}
            <a
              href="/UPDATED%20RESUME.pdf"
              download="Nur_Najihah_Resume.pdf"
              className="inline-flex items-center gap-2 bg-purple-950/30 border border-purple-900/40 hover:border-purple-400 text-xs uppercase font-mono tracking-wider px-4 py-2 rounded-xl text-zinc-200 hover:text-white hover:bg-purple-900/40 shadow-lg hover:shadow-purple-950/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <FileText size={14} /> Resume
            </a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors p-1 bg-zinc-950/40 border border-purple-950/30 rounded-lg">
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-[#050208]/95 border-b border-purple-950/40 px-4 pt-2 pb-5 space-y-2 flex flex-col backdrop-blur-lg">
            <button onClick={() => scrollToSection('about')} className={`text-left py-2.5 transition-colors pl-3 font-mono text-sm rounded-xl ${activeSection === 'about' ? 'text-purple-400 bg-purple-950/20' : 'text-zinc-400 hover:text-white'}`}>About</button>
            <button onClick={() => scrollToSection('projects')} className={`text-left py-2.5 transition-colors pl-3 font-mono text-sm rounded-xl ${activeSection === 'projects' ? 'text-purple-400 bg-purple-950/20' : 'text-zinc-400 hover:text-white'}`}>Projects</button>
            <button onClick={() => scrollToSection('skills')} className={`text-left py-2.5 transition-colors pl-3 font-mono text-sm rounded-xl ${activeSection === 'skills' ? 'text-purple-400 bg-purple-950/20' : 'text-zinc-400 hover:text-white'}`}>Skills</button>
            <button onClick={() => scrollToSection('experience')} className={`text-left py-2.5 transition-colors pl-3 font-mono text-sm rounded-xl ${activeSection === 'experience' ? 'text-purple-400 bg-purple-950/20' : 'text-zinc-400 hover:text-white'}`}>Experience</button>
            <button onClick={() => scrollToSection('credentials')} className={`text-left py-2.5 transition-colors pl-3 font-mono text-sm rounded-xl ${activeSection === 'credentials' ? 'text-purple-400 bg-purple-950/20' : 'text-zinc-400 hover:text-white'}`}>Badges & Certs</button>
            <button onClick={() => scrollToSection('involvement')} className={`text-left py-2.5 transition-colors pl-3 font-mono text-sm rounded-xl ${activeSection === 'involvement' ? 'text-purple-400 bg-purple-950/20' : 'text-zinc-400 hover:text-white'}`}>Involvement</button>
            <a href="/UPDATED%20RESUME.pdf" download="Nur_Najihah_Resume.pdf" className="inline-flex items-center justify-center gap-2 bg-purple-950/40 border border-purple-900/60 py-3 rounded-xl text-sm font-mono uppercase tracking-wider text-zinc-200 transition-colors mt-2">
              <FileText size={16} /> Resume
            </a>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-60">
          <NetworkCanvas />
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#09040f] to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 flex flex-col-reverse md:flex-row items-center justify-between gap-12 pointer-events-none w-full">
          <div className="flex-1 space-y-6 text-center md:text-left pointer-events-auto">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400" />
              </span>
              Available for Fulltime Roles
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Hi, I'm <span className="bg-gradient-to-r from-white via-purple-300 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(168,85,247,0.15)]">Nur Najihah</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
              Computer Science graduate specializing in Multimedia Computing with a passion for building scalable web applications and interactive digital solutions. I develop software that combines intuitive user experiences with reliable backend systems to solve real-world problems.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={() => scrollToSection('projects')}
                className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-xl shadow-purple-950/50 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-zinc-950/60 border border-purple-950 hover:border-purple-500/40 hover:bg-purple-950/10 text-zinc-300 font-medium px-7 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              >
                Let's Connect
              </button>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-5 text-zinc-500 pt-4">
              <a href="https://github.com/najihahh" target="_blank" rel="noreferrer" className="hover:text-purple-400 hover:scale-110 transition-all duration-300 p-2 hover:bg-zinc-950/60 rounded-xl border border-transparent hover:border-purple-950/30 shadow-md"><GithubIcon size={20} /></a>
              <a href="https://www.linkedin.com/in/nur-najihah-190ba8213?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noreferrer" className="hover:text-purple-400 hover:scale-110 transition-all duration-300 p-2 hover:bg-zinc-950/60 rounded-xl border border-transparent hover:border-purple-950/30 shadow-md"><LinkedinIcon size={20} /></a>
              <a href="mailto:nurnajihahassan01@gmail.com" className="hover:text-purple-400 hover:scale-110 transition-all duration-300 p-2 hover:bg-zinc-950/60 rounded-xl border border-transparent hover:border-purple-950/30 shadow-md"><Mail size={20} /></a>
            </div>
          </div>

          <div className="flex-shrink-0 pointer-events-auto">
            <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-2xl relative bg-gradient-to-tr from-purple-500 via-purple-950 to-zinc-900 p-[1.5px] shadow-2xl shadow-purple-950/40 group cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:rotate-2">
              <div className="w-full h-full bg-[#050208] rounded-2xl flex items-center justify-center overflow-hidden border border-purple-950/30 group-hover:border-purple-400/60 transition-all duration-500">
                <img
                  src="/me(1).jpeg"
                  alt="Nur Najihah"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 group-hover:rotate-[-2px]"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-500 to-fuchsia-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT ME SECTION */}
      <section id="about" className="relative bg-gradient-to-b from-[#09040f] via-[#050209] to-[#0a0512] py-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
        
        <Reveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10 flex items-center gap-3 cursor-default group">
              <span className="text-purple-400 font-mono text-xl group-hover:scale-110 transition-transform duration-300">01.</span> About Me
            </h2>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-2 space-y-5 text-zinc-400 leading-relaxed text-sm sm:text-base">
                <p>
                  I'm a Computer Science graduate specializing in Multimedia Computing with a passion for full-stack web development and software engineering.
                </p>
                <p>
                  I enjoy designing and building scalable web applications, interactive user experiences, and database-driven systems that solve real-world problems. My experience includes developing full-stack applications, creating interactive network visualization tools, designing inventory management systems, and building 3D educational applications.
                </p>         
                <p>
                  I'm always looking for opportunities to learn new technologies, take on challenging projects, and build software that is efficient, intuitive, and impactful.
                </p>         
              </div>

              <div className="bg-zinc-950/40 backdrop-blur-md border border-purple-950/60 p-6 rounded-2xl space-y-4 hover:border-purple-500/40 hover:bg-purple-950/10 transition-all duration-500 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-all" />
                <h3 className="text-xs font-bold text-purple-300 uppercase tracking-widest border-b border-purple-900/20 pb-2">Quick Highlights</h3>
                <ul className="space-y-3.5 text-xs text-zinc-400">
                  <li className="flex items-start gap-2.5 group/li"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 group-hover/li:scale-150 group-hover/li:bg-fuchsia-400 transition-all duration-300" /> <span>B.Comp.Sc (Hons) Multimedia Computing</span></li>
                  <li className="flex items-start gap-2.5 group/li"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 group-hover/li:scale-150 group-hover/li:bg-fuchsia-400 transition-all duration-300" /> <span>Full-stack Web Development</span></li>
                  <li className="flex items-start gap-2.5 group/li"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 group-hover/li:scale-150 group-hover/li:bg-fuchsia-400 transition-all duration-300" /> <span>Database Management & Security</span></li>
                  <li className="flex items-start gap-2.5 group/li"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 group-hover/li:scale-150 group-hover/li:bg-fuchsia-400 transition-all duration-300" /> <span>Melaka, Malaysia</span></li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. FEATURED PROJECTS */}
      <section id="projects" className="bg-gradient-to-b from-[#0a0512] via-[#050209] to-[#07030e] py-24">
        <Reveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3 cursor-default group">
              <span className="text-purple-400 font-mono text-xl group-hover:scale-110 transition-transform duration-300">02.</span> Featured Projects
            </h2>
            <p className="text-xs font-mono text-purple-400/60 tracking-wider mb-12">CLICK CARDS TO TRIGGER CASE STUDY DEPLOYMENT VIEW.</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROJECTS.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 5. SKILL MATRIX */}
      <section id="skills" className="bg-gradient-to-b from-[#07030e] via-[#050209] to-[#0b0514] py-24 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-fuchsia-900/5 rounded-full blur-[100px] pointer-events-none" />
        
        <Reveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3 cursor-default group">
              <span className="text-purple-400 font-mono text-xl group-hover:scale-110 transition-transform duration-300">03.</span> Tech Stack & Skills
            </h2>
            <p className="text-xs font-mono text-purple-400/60 tracking-wider mb-12">HOVER INTERACTIVE MATRICES FOR DEPLOYED SYSTEM METRICS.</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-zinc-950/40 backdrop-blur-sm border border-purple-950/60 rounded-2xl space-y-5 hover:border-purple-500/30 hover:bg-purple-950/5 transition-all duration-500 shadow-xl">
                <div className="flex items-center gap-2.5 text-purple-300 font-bold text-xs uppercase font-mono tracking-wider border-b border-purple-900/20 pb-2"><Code size={14}/> Languages</div>
                <div className="space-y-4">
                  <SkillBar label="JavaScript / ES6+" level={60} detail="Primary language across all full-stack projects." />
                  <SkillBar label="PHP" level={70} detail="Backend logic for the records management system." />
                  <SkillBar label="SQL" level={70} detail="Schema design for PostgreSQL & MySQL projects." />
                  <SkillBar label="Python / C++" level={65} detail="Coursework, scripting, and algorithms." />
                </div>
              </div>
              <div className="p-5 bg-zinc-950/40 backdrop-blur-sm border border-purple-950/60 rounded-2xl space-y-5 hover:border-purple-500/30 hover:bg-purple-950/5 transition-all duration-500 shadow-xl">
                <div className="flex items-center gap-2.5 text-purple-300 font-bold text-xs uppercase font-mono tracking-wider border-b border-purple-900/20 pb-2"><Layers size={14}/> Frameworks</div>
                <div className="space-y-4">
                  <SkillBar label="React.js" level={75} detail="Built NetDiagram's canvas UI and this portfolio." />
                  <SkillBar label="Node.js / Express" level={65} detail="API layer for the topology editor backend." />
                  <SkillBar label="Tailwind CSS" level={80} detail="Default styling approach for new UI work." />
                  <SkillBar label="Bootstrap / Vite" level={70} detail="Used in earlier and rapid-prototype projects." />
                </div>
              </div>
              <div className="p-5 bg-zinc-950/40 backdrop-blur-sm border border-purple-950/60 rounded-2xl space-y-5 hover:border-purple-500/30 hover:bg-purple-950/5 transition-all duration-500 shadow-xl">
                <div className="flex items-center gap-2.5 text-purple-300 font-bold text-xs uppercase font-mono tracking-wider border-b border-purple-900/20 pb-2"><Database size={14}/> Infrastructure</div>
                <div className="space-y-4">
                  <SkillBar label="PostgreSQL / Supabase" level={70} detail="Backend for the network topology system." />
                  <SkillBar label="MySQL" level={75} detail="Records management system database." />
                  <SkillBar label="Git & GitHub" level={80} detail="Version control across all projects." />
                  <SkillBar label="Hostinger / Cloud Deployment" level={70} detail="Deployment setups for web projects." />
                </div>
              </div>
              <div className="p-5 bg-zinc-950/40 backdrop-blur-sm border border-purple-950/60 rounded-2xl space-y-5 hover:border-purple-500/30 hover:bg-purple-950/5 transition-all duration-500 shadow-xl">
                <div className="flex items-center gap-2.5 text-purple-300 font-bold text-xs uppercase font-mono tracking-wider border-b border-purple-900/20 pb-2"><Monitor size={14}/> Multimedia & Net</div>
                <div className="space-y-4">
                  <SkillBar label="Unity / C#" level={70} detail="Built the 3D Atlas anatomy education app." />
                  <SkillBar label="Blender" level={50} detail="Modeled skeletal mesh assets for 3D Atlas." />
                  <SkillBar label="Network Topology" level={60} detail="Core focus of the ICT internship & NetDiagram." />
                  <SkillBar label="Systems Repair" level={70} detail="Hands-on support during both internships." />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 6. PROFESSIONAL EXPERIENCE TIMELINE */}
      <section id="experience" className="bg-gradient-to-b from-[#0b0514] via-[#050209] to-[#0a0412] py-24">
        <Reveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3 cursor-default group">
              <span className="text-purple-400 font-mono text-xl group-hover:scale-110 transition-transform duration-300">04.</span> Professional Timeline
            </h2>
            <p className="text-xs font-mono text-purple-400/60 tracking-wider mb-12">TRIGGER NODE SELECTION FOR GRANULAR PROJECT OVERVIEWS.</p>

            <div className="max-w-3xl space-y-6 relative before:absolute before:inset-y-2 before:right-auto before:left-[18px] before:w-[2px] before:bg-gradient-to-b before:from-purple-500 before:via-purple-950/40 before:to-transparent">
              {TIMELINE.map((item, i) => (
                <TimelineItem key={item.org} item={item} index={i} />
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 6.2 CERTIFICATIONS & DIGITAL BADGES SECTION */}
      <section id="credentials" className="bg-gradient-to-b from-[#0a0412] via-[#06030c] to-[#0a0412] py-24 relative overflow-hidden">
        <div className="absolute left-1/3 top-1/4 w-[450px] h-[450px] bg-purple-600/5 rounded-full blur-[130px] pointer-events-none" />
        
        <Reveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3 cursor-default group">
              <span className="text-purple-400 font-mono text-xl group-hover:scale-110 transition-transform duration-300">05.</span> Certifications & Digital Badges
            </h2>
            <p className="text-xs font-mono text-purple-400/60 tracking-wider mb-12">HOVER MATRIX HOUSES — CLICK TO LAUNCH HIGH-RESOLUTION PROOF AGGREGATOR.</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CREDENTIALS.map((cert, index) => {
                const Icon = cert.icon;
                return (
                  <div
                    key={index}
                    onClick={() => openLightbox([cert.image], 0, cert.title, cert.desc)}
                    className="group bg-zinc-950/40 backdrop-blur-sm border border-purple-950/60 p-5 rounded-2xl flex flex-col justify-between cursor-zoom-in hover:border-purple-500/40 hover:bg-purple-950/10 transition-all duration-500 shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="p-2.5 bg-purple-950/50 rounded-xl text-purple-400 border border-purple-900/30 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-black shadow-md transition-all duration-500">
                          <Icon size={18} />
                        </div>
                        <span className="text-[9px] font-mono tracking-widest text-purple-400 bg-purple-950/40 border border-purple-900/20 px-2 py-0.5 rounded uppercase">
                          {cert.type}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-zinc-100 group-hover:text-purple-300 transition-colors tracking-tight leading-snug">
                        {cert.title}
                      </h3>
                      <p className="text-xs font-medium text-zinc-400 pt-0.5 pb-2">
                        {cert.issuer}
                      </p>
                      <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                        {cert.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-purple-950/40 flex items-center justify-between text-[11px] font-mono text-zinc-600 group-hover:text-purple-400 transition-colors">
                      <span className="uppercase tracking-wider">Verification Document</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        VIEW PROOF <ExternalLink size={10} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 6.5 INTERACTIVE LEADERSHIP & INVOLVEMENT SECTION */}
      <section id="involvement" className="bg-gradient-to-b from-[#0a0412] via-[#050209] to-[#040206] py-24 relative overflow-hidden">
        <div className="absolute left-1/4 top-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <Reveal>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3 cursor-default group">
              <span className="text-purple-400 font-mono text-xl group-hover:scale-110 transition-transform duration-300">06.</span> Leadership & Involvement
            </h2>
            <p className="text-xs font-mono text-purple-400/60 tracking-wider mb-12">HOVER EVIDENCE MATRIX CARDS — CLICK IMAGES FOR FULL LIGHTBOX OVERLAYS.</p>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 items-start">
              {LEADERSHIP.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-zinc-950/40 backdrop-blur-sm border border-purple-950/60 p-6 rounded-2xl flex flex-col h-full hover:border-purple-500/40 hover:bg-purple-950/10 transition-all duration-500 group shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center gap-3.5 mb-5 relative z-10">
                      <div className="p-3 bg-purple-950/50 rounded-xl text-purple-400 border border-purple-900/30 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-black shadow-md group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all duration-500 flex-shrink-0">
                        <Icon size={18} />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold tracking-widest text-purple-400 font-mono bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/20">{item.category}</span>
                        <h3 className="text-base font-bold text-zinc-100 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug pt-1">{item.title}</h3>
                      </div>
                    </div>

                    <div className={`grid gap-2 mb-5 mt-1 relative z-10 ${item.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {item.images.map((img, imgIdx) => (
                        <div 
                          key={imgIdx} 
                          onClick={() => openLightbox(item.images, imgIdx, item.title)}
                          className="relative rounded-xl overflow-hidden bg-zinc-900 border border-purple-900/20 aspect-[4/3] cursor-zoom-in group/img shadow-md"
                        >
                          <img 
                            src={img} 
                            alt={`${item.title} Evidence view #${imgIdx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="text-[10px] uppercase font-mono tracking-widest text-purple-200 font-medium bg-purple-950/90 px-3 py-1.5 rounded-lg border border-purple-500/40 shadow-xl transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300">Expand View</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-2.5 text-sm text-zinc-400 mt-auto pt-3 border-t border-purple-950/40 relative z-10">
                      {item.details.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex gap-2.5 items-start text-xs leading-relaxed">
                          <span className="text-purple-400 font-bold flex-shrink-0 select-none">›</span>
                          <span className="text-zinc-300">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* FULL-SCREEN IMMERSIVE LIGHTBOX MODAL GALLERY (WITH ROBUST ERROR HANDLING VISUAL NODES) */}
      {lightbox.isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md transition-opacity duration-300"
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-900/60 p-3 rounded-full border border-zinc-800 transition-all shadow-2xl hover:border-purple-500 z-50"
            aria-label="Close modal view"
          >
            <X size={20} />
          </button>

          <div className="relative max-w-4xl max-h-[70vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {lightbox.images.length > 1 && (
              <button 
                onClick={prevImage}
                className="absolute left-4 z-10 p-3 bg-zinc-900/80 border border-zinc-800 hover:border-purple-500 text-zinc-300 hover:text-white rounded-xl transition-all shadow-2xl backdrop-blur-sm"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Smart Container with a backup visual card if path fails */}
            <div className="relative max-w-full max-h-full flex items-center justify-center group/panel">
              <img 
                src={lightbox.images[lightbox.currentIndex]} 
                alt="Expanded high-resolution attachment" 
                className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl border border-purple-950/40 animate-in fade-in zoom-in-95 duration-300 relative z-10"
                onError={(e) => {
                  // If the file path is broken, display a stylish placeholder layout instead of a broken icon
                  e.target.style.display = 'none';
                  document.getElementById("lightbox-fallback").style.display = "flex";
                }}
              />
              
              {/* Elegant fallback interface shown only if image path fails to load */}
              <div 
                id="lightbox-fallback" 
                style={{ display: 'none' }}
                className="flex-col items-center justify-center text-center p-8 rounded-2xl bg-zinc-950 border border-purple-500/30 max-w-md shadow-[0_0_50px_rgba(168,85,247,0.15)]"
              >
                <div className="p-4 bg-purple-950/40 rounded-full text-purple-400 border border-purple-900/30 mb-4 animate-bounce">
                  <ShieldCheck size={36} />
                </div>
                <h4 className="text-lg font-bold text-zinc-100 mb-2">{lightbox.title || 'Credential Document Verified'}</h4>
                <p className="text-xs text-zinc-400 mb-6 max-w-xs">{lightbox.desc || 'Document secure asset file mapped to local build. Verify asset exists in public routing directory.'}</p>
                <span className="text-[10px] font-mono px-3 py-1 bg-purple-950/60 rounded text-purple-300 border border-purple-900/30 select-all">
                  File path: public{lightbox.images[lightbox.currentIndex]}
                </span>
              </div>
            </div>

            {lightbox.images.length > 1 && (
              <button 
                onClick={nextImage}
                className="absolute right-4 z-10 p-3 bg-zinc-900/80 border border-zinc-800 hover:border-purple-500 text-zinc-300 hover:text-white rounded-xl transition-all shadow-2xl backdrop-blur-sm"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {/* Bottom context indicators */}
          <div className="mt-6 flex flex-col items-center text-center space-y-1.5 pointer-events-none max-w-xl">
            {lightbox.title && <h3 className="text-zinc-200 text-sm font-bold tracking-tight">{lightbox.title}</h3>}
            {lightbox.images.length > 1 ? (
              <div className="text-purple-400 font-mono text-[10px] tracking-widest bg-purple-950/40 border border-purple-900/30 px-3 py-1.5 rounded-full shadow-inner">
                IMAGE {lightbox.currentIndex + 1} OF {lightbox.images.length}
              </div>
            ) : (
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider">SECURE DIGITAL CREDENTIAL EMBED</span>
            )}
          </div>
        </div>
      )}

      {/* 7. CONTACT FOOTER */}
      <section id="contact" className="bg-gradient-to-b from-[#040206] to-[#000000] border-t border-purple-950/20 py-20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Let's Build Something Together</h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            I'm currently seeking roles aligned with software engineering and web application architectures. Let's start talking!
          </p>
          <div className="pt-4">
            <a
              href="mailto:nurnajihahassan01@gmail.com"
              className="inline-flex items-center gap-2 bg-zinc-950 border border-purple-950 hover:border-purple-400 text-xs uppercase font-mono tracking-wider font-semibold px-6 py-3.5 rounded-xl text-purple-300 hover:text-black hover:bg-purple-400 shadow-xl shadow-purple-950/40 transition-all duration-300"
            >
              <Mail size={14} /> Get In Touch
            </a>
          </div>
          <p className="text-[10px] font-mono text-zinc-600 tracking-wider pt-16">
            © 2026 Built using React & Tailwind CSS.
          </p>
        </div>
      </section>

    </div>
  );
}