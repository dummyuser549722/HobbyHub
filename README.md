# 📸 HobbyHub – Photography Sharing Platform

HobbyHub is a full-stack web app that allows users to create, explore, and upvote photography posts. It features support for guest users, registered users, and provides UI customization with light/dark mode and grid/list post views.

## 🚀 Deployed App
You can access the live app here: [https://hobby-hub-fawn.vercel.app/](https://hobby-hub-fawn.vercel.app/)

## 🛠 Features
- User authentication (Supabase Auth)
- Guest UUID fallback for anonymous posting
- Post creation with image or YouTube video preview
- Upvotes, comments, reposting support
- Light/Dark theme toggle
- Grid/List view layout switch
- Filtering and sorting posts by tags, popularity, or date

## 🧰 Tech Stack
- Frontend: React, React Router, Bootstrap
- Backend: Supabase (PostgreSQL + Auth)
- Hosting: Vercel

## 📝 Development
To run locally:

```bash
npm install
npm start
```

## ✨ Customize
- Theme toggle and layout preferences are saved in localStorage.
- Guests are assigned persistent UUIDs to manage post ownership.

---

Made with 💙 for hobbyists, by hobbyists.
