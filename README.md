# 🚀 TechFlow CMS

TechFlow CMS is a powerful and modern content management system built with **Django REST Framework** and **React 19**. It enables seamless content creation, management, and publishing with an intuitive UI and rich feature set. 🎯

---

## 🌟 Features

✅ **Full CMS Support** – Manage blogs, users, and events efficiently.
✅ **Rich Text Editing** – Enhanced with **Jodit Editor** (customized toolbar, preview, and color support).
✅ **API-Driven** – Built using Django REST Framework for scalable API interactions.
✅ **Modern UI** – React 19-powered frontend with a clean and responsive design.
✅ **Authentication** – Secure login/logout with Django authentication.
✅ **Event & Blog Management** – Easily create, edit, and delete events and blogs.

---

## 🛠️ Tech Stack

### 🔹 Backend
- **Django** & **Django REST Framework** – Robust API development.
- **MySQL** – Scalable relational database.

### 🔹 Frontend
- **React 19** – Modern component-based UI.
- **Tailwind CSS** – Sleek and responsive styling.

---

## 🚀 Installation Guide

### 1️⃣ Backend Setup (Django)
```sh
# Clone the repo
git clone https://github.com/sujaljoshi7/Techflow-CMS.git
cd TechFlow-CMS/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

### 2️⃣ Frontend Setup (React)
```sh
cd TechFlow-CMS/frontend

# Install dependencies
yarn install  # Or npm install

# Start the development server
yarn dev  # Or npm start
```

---

## 🖊️ Jodit Editor Customization

🟢 Removed **image & file upload** options.
🟢 Added **horizontal line, preview, color, highlight, table, font family & size**.
🟢 Fixed **white background issue in preview**.

---

## 🎯 API Endpoints (Example)

| Method | Endpoint | Description |
|--------|-------------------------|------------------------------|
| `GET` | `/api/blogs/` | Fetch all blogs |
| `POST` | `/api/blogs/` | Create a new blog |
| `PATCH` | `/api/blogs/{id}/` | Update a blog |
| `DELETE` | `/api/blogs/{id}/` | Delete a blog |

---

## 🤝 Contributing

🔹 Fork the repository.
🔹 Create a new branch (`feature/your-feature`).
🔹 Commit your changes.
🔹 Push to your branch and submit a PR.

---

## 📞 Contact

📧 **Email:** work.sujaljoshi@gmail.com  
🌐 **GitHub:** [sujaljoshi7](https://github.com/sujaljoshi7)

💡 **TechFlow CMS – Manage content effortlessly!** ✨
