# 🧙‍♂️ Harry Potter - Hogwarts House Sorting Quiz

A beautifully themed interactive web quiz that sorts users into their Hogwarts house based on their answers—just like the Sorting Hat! Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and hosted on **Vercel**.

---

## ✨ Features

- ⚡ Fast and responsive UI
- 🎨 Magic parchment-style design
- 🧠 Dynamic scoring system based on house affinities
- 📊 Admin dashboard with house stats (mocked)
- 🌗 Dark/light parchment background options
- 🖼️ Questions with optional images and accessibility hints
- 📈 Recharts-powered visual analytics

---

## 🚀 Demo

Live site: [https://harrypotter-hogwarts-sorting.vercel.app](https://harrypotter-hogwarts-sorting.vercel.app)

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Custom themes
- **Icons:** Lucide, React Icons
- **Charts:** Recharts
- **Hosting:** Vercel

---

## 🧩 Folder Structure

src/
│
├── app/ # App Router pages and routes
│ ├── quiz/ # Quiz logic and pages
│ ├── admin/ # Admin dashboard (stats, questions)
│ └── layout.tsx # Root layout
│
├── components/
│ ├── ui/ # Reusable UI components (buttons, cards)
│ ├── shared/ # Shared layout components (Header, Footer, Charts)
│
├── lib/
│ ├── constants.ts # Questions and house definitions
│ ├── types.ts # Custom TypeScript interfaces
│ └── utils.ts # Utility functions
│
└── styles/ # Global styles (tailwind.config, globals.css)


---

## 🧠 Sorting Logic

Each answer has a `houseAffinity` like:

ts
{
  Gryffindor: 2,
  Slytherin: 1,
}

At the end of the quiz, the house with the highest total score is chosen for the user.

📊 Admin Stats Dashboard

Accessible at /admin/stats. Displays:

    Horizontal bar chart of house distribution

    Total quizzes taken

    Average questions answered

    Most common sorting period (mocked)

🔧 Environment Variables

If you’re using Gemini API or external integrations, add .env.local:

NEXT_PUBLIC_GEMINI_API_KEY=your-api-key-here

📦 Build & Deploy
Local Development

git clone https://github.com/devspidr/HPHH.git
cd HPHH
npm install
npm run dev

Deploy to Vercel

    Push to GitHub

    Import to Vercel

    Set the following in Environment Variables:
Key: NEXT_PUBLIC_GEMINI_API_KEY
Value: AIzaSyA9oK9a-i0c4Q5yHdspGdl5CBh-uAxveVM

🙌 Acknowledgments

    Based on the Wizarding World by J.K. Rowling

    Inspired by the Sorting Hat quiz on Pottermore

    Icons by Lucide and React Icons

👨‍💻 Author

Soundar Balaji J

    🔗 https://github.com/devspidr

    💼 https://www.linkedin.com/in/soundar-balaji-j-133b691b9/

🪄 License

MIT License. This is a fan project and not affiliated with J.K. Rowling or Warner Bros.


---

Let me know if you'd like me to add:
- Screenshots
- Badge icons (Vercel deploy, license, stars)
- Gemini AI usage instructions

I’ll be happy to enhance this!
