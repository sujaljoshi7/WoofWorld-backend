# 🐾 WoofWorld Admin – Powering the Ultimate Dog-Centric Platform! 🚀

WoofWorld Admin is the **brain behind WoofWorld**, seamlessly managing everything from blogs and events to product listings and user interactions. Built with **Django REST Framework** and **React 19**, it ensures a smooth and efficient content management experience. 🐶✨

---

## 🌟 Key Features

✅ **Complete Control** – Manage blogs, products, dog adoption listings, and events in one place.  
✅ **Advanced Rich Text Editing** – Enhanced with **Jodit Editor** (custom toolbar, preview, and color customization).  
✅ **Seamless API Integration** – Built using **Django REST Framework** for scalability.  
✅ **Modern & Responsive UI** – Powered by **React 19** & **Bootstrap**.  
✅ **Secure Authentication** – Role-based access with secure login/logout.  
✅ **Adoption Management** – Easily list and manage dogs available for adoption.  
✅ **E-commerce Ready** – Manage dog-related products efficiently.  
✅ **Event Handling** – Organize and showcase pet-centric events.  

---

## 🛠️ Tech Stack

### 🔹 Backend
- **Django** & **Django REST Framework** – Robust API-driven backend.
- **MySQL** – Scalable relational database.

### 🔹 Frontend
- **React 19** – Fast, component-based UI.
- **Bootstrap** – Sleek and adaptive styling.

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
cd TechFlow-CMS/admin

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
|--------|-------------------------|--------------------------------|
| `GET`  | `/api/blogs/`           | Fetch all blogs               |
| `POST` | `/api/blogs/`           | Create a new blog             |
| `PATCH`| `/api/blogs/{id}/`      | Update a blog                 |
| `DELETE`| `/api/blogs/{id}/`     | Delete a blog                 |
| `GET`  | `/api/products/`        | Fetch all products            |
| `POST` | `/api/products/`        | Add a new product             |
| `GET`  | `/api/adoptions/`       | Fetch dogs available for adoption |
| `POST` | `/api/adoptions/`       | Add a new adoption listing    |

---

## 🤝 Contributing

🐶 **WoofWorld is growing, and we’d love your help!**  
🔹 Fork the repository.  
🔹 Create a new branch (`feature/your-feature`).  
🔹 Commit your changes.  
🔹 Push to your branch and submit a PR.  

---

## 📞 Contact

📧 **Email:** work.sujaljoshi@gmail.com  
🌐 **GitHub:** [sujaljoshi7](https://github.com/sujaljoshi7)  

💡 **WoofWorld Admin – The ultimate control center for the WoofWorld experience!** 🐕🚀

