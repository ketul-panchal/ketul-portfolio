// Projects Data Configuration
// Add, remove, or modify projects here
//
// `image` is the BASE path of an optimised asset — no width suffix, no
// extension. `npm run optimize:images` turns each original in assets-src/project
// into `<base>-720.webp` and `<base>-1200.webp`, and the card builds its srcset
// from those two widths. `imageWidth` / `imageHeight` are the ORIGINAL pixel
// dimensions; the browser uses them to reserve the right space before the
// screenshot arrives, so the card never reflows mid-scroll.

export const projectsHeader = {
  title: "Projects",
  description:
    "My projects make use of a vast variety of latest technology tools. My best experience is to create full-stack projects and deploy them to web applications using cloud infrastructure.",
};

export const projects = [
    {
    id: "crown-pos",
    name: "Crown POS",
    techStack: "Flutter, Laravel, REST APIs",
    description:
      "A high-performance Flutter POS app integrated with a Laravel ERP system.",
    url: "https://apps.apple.com/in/app/crown-pos/id6743543865",
    image: "assets/project/project_two",
    imageWidth: 1689,
    imageHeight: 1018,
    galleryImages: [],
    cardBackground: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    textColor: "#ffffff",
    accentColor: "#ff8c42",
  },
  {
    id: "quick-qr",
    name: "Digital QR Code Restaurant Menu Maker & Contactless Ordering System",
    techStack: "ReactJs, NodeJs, ExpressJs, MongoDB",
    description:
      "web application that allows restaurant owners to create QR code menus for their customers. Customers can scan the QR code and view the menu on their mobile devices. They can also place orders.",
    url: "https://github.com/ketul-panchal/quickqr-saas",
    image: "assets/project/Gemini_Generated_Image_6habqa6habqa6hab-Photoroom", // Main project image
    imageWidth: 1280,
    imageHeight: 1280,
    galleryImages: [], // Optional additional images
    cardBackground: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    textColor: "#ffffff",
    accentColor: "#ff6b35",
  },
  {
    id: "lux-erp",
    name: "LUXE - ERP And E-Commerce Website",
    techStack: "Turborepo, NextJs, NodeJs, Postgres",
    description:
      "A unified Turborepo ERP and eCommerce platform with real-time inventory and a modern storefront.",
    url: "https://www.upwork.com/freelancers/~01c5fa39b4890a9392?p=1955385959952928768",
    image: "assets/project/project_new", // Main project image
    imageWidth: 1536,
    imageHeight: 1024,
    galleryImages: [], // Optional additional images
    cardBackground: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    textColor: "#ffffff",
    accentColor: "#ff6b35",
  },
  {
    id: "elite-protector",
    name: "Elite - Protector And Security",
    techStack: "Flutter, MERN, REST APIs",
    description:
      "A premium Flutter app for on-demand mobility and protection with secure membership integration.",
    url: "https://www.upwork.com/freelancers/~01c5fa39b4890a9392?p=1955020508802568192",
    image: "assets/project/project_tree",
    imageWidth: 1373,
    imageHeight: 983,
    galleryImages: [],
    cardBackground: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    textColor: "#ffffff",
    accentColor: "#00d9ff",
  },
    {
    id: "wanderlust",
    name: "Wanderlust",
    techStack: "ReactJs, NodeJs, ExpressJs, MongoDB",
    description:
      "Wunderlust is a travel and hotel booking platform that allows users to explore, list, and manage stays through a modern full-stack web application.",
    url: "https://mainproject-ia3w.onrender.com/listings",
    image: "assets/project/project_four",
    imageWidth: 1536,
    imageHeight: 1024,
    galleryImages: [],
    cardBackground: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    textColor: "#ffffff",
    accentColor: "#00d9ff",
  },
   {
    id: "Empire-WooCommerce",
    name: "Empire WooCommerce App",
    techStack: "Flutter, WooREST API",
    description:
      "A high-performance Flutter WooCommerce apps integrated with a WordPress website",
    url: "https://apps.apple.com/in/app/empire-distribution/id6739735244",
    image: "assets/project/project_five",
    imageWidth: 3408,
    imageHeight: 2213,
    galleryImages: [],
    cardBackground: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    textColor: "#ffffff",
    accentColor: "#00d9ff",
  },
     {
    id: "Gotham-WooCommerce",
    name: "Gotham WooCommerce App",
    techStack: "Flutter, WooREST API",
    description:
      "A high-performance Flutter WooCommerce apps integrated with a WordPress website",
    url: "https://apps.apple.com/in/app/gotham-distribution/id6740434735",
    image: "assets/project/project_six",
    imageWidth: 1926,
    imageHeight: 1373,
    galleryImages: [],
    cardBackground: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    textColor: "#ffffff",
    accentColor: "#00d9ff",
  },
  {
    id: "food-app",
    name: "Yum Point App",
    techStack: "Flutter, Laravel, REST APIs",
    description:
      "Food App that's help people easly order food and fast delivery",
    url: "https://github.com/ketul-panchal/yummy-restorent-website",
    image: "assets/project/project_seven",
    imageWidth: 1390,
    imageHeight: 993,
    galleryImages: [],
    cardBackground: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    textColor: "#ffffff",
    accentColor: "#00d9ff",
  },
  // {
  //   id: "portfolio-website",
  //   name: "Portfolio Website",
  //   techStack: "React, Three.js, Framer Motion, GSAP",
  //   description:
  //     "A modern, animated portfolio website with 3D elements and smooth scroll effects.",
  //   url: "#",
  //   image: "/projects/portfolio.jpg",
  //   galleryImages: [],
  //   cardBackground: "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
  //   textColor: "#ffffff",
  //   accentColor: "#ff6b35",
  // },
];

export default projects;
