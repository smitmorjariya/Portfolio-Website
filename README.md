# 💻 Smit Morjariya | Front-End Developer Portfolio

A modern, responsive personal developer portfolio built for **Smit Morjariya**, showcasing front-end engineering skills, internship experience, academic background, real shipped projects, and a full-stack contact email system with a dark obsidian aesthetic and refined interactive motion.

## 🚀 Overview

This portfolio presents my technical profile as a Computer Science graduate and Front-End Developer specializing in React.js, JavaScript, and Tailwind CSS. It is designed to give recruiters, hiring managers, and engineering teams a clear, fast-loading look at my practical work, architecture choices, and direct ways to connect.

---

## 📁 Project Screenshot

<!-- Replace the placeholder below with a full-page or hero screenshot of your live portfolio once uploaded to GitHub -->


<img width="1440" height="900" alt="r2-desktop-hero" src="https://github.com/user-attachments/assets/7ee88c76-bcfa-4177-ac58-874a3b4a4588" />



## ✨ Features

* 🎨 **Modern Dark UI Design** — Deep obsidian theme (`#07080C`) with violet/blue accents, custom typography (`Bricolage Grotesque`, `Plus Jakarta Sans`, `JetBrains Mono`), and subtle gradient section dividers
* 📱 **Fully Responsive Layout** — Clean, overflow-free presentation across mobile, tablet, and desktop screens
* ✨ **Smooth GSAP Motion & Micro-Interactions** — Scroll-triggered reveals, desktop GPU-composited parallax depth layers, tactile hover transitions, and `prefers-reduced-motion` support
* 🖱️ **Smooth Custom Cursor & Scroll Progress** — Lag-free `requestAnimationFrame` + linear interpolation cursor on fine-pointer desktop devices alongside a top scroll progress bar
* 💼 **Interactive Featured Projects Showcase** — Multi-screen preview switcher, fullscreen lightbox inspection, live demo links, and GitHub source links
* ⏱️ **Estimated Reading-Time Badges** — Dynamic word-count reading-time badges displayed on long-form sections
* 📄 **Direct Resume Access** — One-click resume PDF access from the navigation bar, hero section, and footer
* 📬 **Full-Stack Contact Form & Dual Email Delivery** — Strict frontend and backend validation, per-IP rate limiting, formatted owner notification emails to `smit.8189@gmail.com`, and mobile-friendly automatic confirmation replies sent directly to the visitor's email address
* 🔍 **Granular SEO & Social Sharing Metadata** — Dynamic and static per-section / per-project Open Graph, Twitter Card, canonical URL, and Schema.org JSON-LD metadata
* 🔖 **Modern Multi-Resolution Favicon Suite** — Custom gradient **S** logo exported across `favicon.ico` (16/32/48), `16×16`, `32×32`, `48×48`, `apple-touch-icon` (`180×180`), `192×192`, `512×512`, and `site.webmanifest`

---

## 🛠️ Built With

* **Google AI Studio**
* **React 19** & **TypeScript**
* **Vite 8**
* **Tailwind CSS v4**
* **GSAP** (`ScrollTrigger`)
* **Lucide React**
* **Express.js** & **Node.js**
* **Nodemailer** (SMTP email delivery)
* **Vercel Serverless Functions** (`api/contact.ts`)
* **Node Test Runner** (`node:test` + `tsx`)

---

## 📂 Website Sections

* **Hero** — Developer introduction, availability status, portrait card, Resume download, quick summary cards, and primary CTAs
* **01. About Me** — Engineering background, front-end learning path, quick facts, and reading-time badge
* **02. Technical Skills** — Core Frontend stack (`HTML5`, `CSS3`, `JavaScript`, `Tailwind CSS`, `React.js`) and daily Tools (`Git`, `GitHub`, `VS Code`, `Google AI Studio`)
* **03. Experience** — Remote internships at **Zidio Development** (MERN Stack Development Intern) and **Tech OctaNet Service Pvt. Ltd.** (Front-End Development Intern)
* **04. Education** — B.E. Computer Science & Engineering (GTU, CGPA 7.83) and Higher Secondary Certificate (HSC — Science)
* **05. Featured Projects** — Detailed case studies for **TeamOrbit (Task Management System)** and **PixelCraft (Creative Studio Website)** with live previews and fullscreen inspection
* **06. What I Do** — Core capabilities across Responsive Website Development, Frontend Development, React.js Development, and Modern Web Interfaces
* **07. Contact** — Direct contact channels (Email with one-click copy, LinkedIn, GitHub, Location) and validated contact form
* **Footer** — Quick links to GitHub, LinkedIn, Email, and Resume

---

## 🎯 Purpose

The primary goal of this project is to present my front-end engineering skills, internship experience, and real-world applications in a structured, recruiter-friendly web experience as I pursue **Frontend Developer**, **React.js Intern**, and **Junior Web Developer** opportunities.

---

## 🌐 Live Demo

🔗 [https://smitmorjariya.vercel.app/](https://smitmorjariya.vercel.app/)

---

## 📥 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-portfolio-repository-url>
cd <your-portfolio-folder>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and add your server-side email credentials (required for the Contact Form email delivery):

```bash
cp .env.example .env
```

```env
EMAIL_USER="your-gmail-address@gmail.com"
EMAIL_PASS="your-16-character-gmail-app-password"
CONTACT_RECIPIENT_EMAIL="smit.8189@gmail.com"
```

> **Note:** Use a 16-character **Gmail App Password** (Google Account → Security → 2-Step Verification → App passwords) rather than your regular Gmail login password. Never commit `.env` or private credentials to GitHub.

### 4. Run locally in development

```bash
npm run dev
```

The Express + Vite development server starts on `http://localhost:3000`.

### 5. Build, start production server, lint & test

```bash
# Type-check with TypeScript
npm run lint

# Build production bundle & per-project static SEO HTML pages
npm run build

# Start production Express server
NODE_ENV=production npm run start

# Run automated unit & mailer tests
npx tsx --test src/utils/*.test.ts src/server/*.test.ts
```

---

## 👨‍💻 Developer

### Smit Morjariya

**Front-End Developer**  
🎓 B.E. Computer Science & Engineering — Noble Group of Institutions, Junagadh (GTU)  
📧 Email: [smit.8189@gmail.com](mailto:smit.8189@gmail.com)  
🔗 LinkedIn: [https://www.linkedin.com/in/smitmorjariya/](https://www.linkedin.com/in/smitmorjariya/)  
🔗 GitHub: [https://github.com/smitmorjariya](https://github.com/smitmorjariya)  
📍 Jetpur, Gujarat, India

---

## 📄 License

This project is available for educational and personal portfolio purposes.
