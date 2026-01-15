# Portfolio Website with Firebase Backend

A modern, responsive portfolio website with a complete admin dashboard powered by Firebase.

## Features

### Main Portfolio Site

- **Hero Section**: Displays name, profession, and profile image
- **About Section**: Dynamic about information with contact details
- **Skills Section**: Categorized skills with proficiency levels
- **Experience Timeline**: Professional experience with dates and technologies
- **Projects Gallery**: Showcase projects with images, descriptions, and links
- **Blog Section**: Latest blog posts with categories and dates
- **Contact Form**: Get in touch section
- **Responsive Design**: Works on all devices

### Admin Dashboard

- **Secure Authentication**: Firebase Authentication
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Manage About**: Edit about information and contact details
- **Manage Skills**: Add, edit, delete skills by category
- **Manage Experience**: Add, edit, delete work experience
- **Manage Projects**: Add, edit, delete projects with images
- **Manage Blogs**: Add, edit, delete blog posts

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Firebase (Firestore Database + Authentication)
- **No Frameworks**: Pure JavaScript implementation

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Email/Password Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Create your admin user
4. Create **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Set security rules (see below)

### 2. Firebase Security Rules

In Firestore Database > Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access
    match /{document=**} {
      allow read: true;
    }

    // Only authenticated users can write
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Update Firebase Configuration

Replace the Firebase config in these files with your own:

- `/app/portfolio/index.html`
- `/app/portfolio/login.html`
- `/app/portfolio/dashboard.html`

Find this section in each file:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

### 4. Create Admin User

1. Go to Firebase Console > Authentication > Users
2. Click "Add user"
3. Enter email and password
4. This will be your admin login credentials

### 5. Run the Portfolio

#### Option 1: Using Python (Recommended)

```bash
cd /app/portfolio
python3 server.py
```

Then open:

- Portfolio: http://localhost:8080
- Admin Login: http://localhost:8080/login.html
- Admin Dashboard: http://localhost:8080/dashboard.html

#### Option 2: Using any other web server

You can use any static file server like:

- `python3 -m http.server 8080`
- `npx serve`
- VS Code Live Server extension

## Usage

### Admin Workflow

1. **Login**: Go to `/login.html` and sign in with your Firebase credentials
2. **Add Content**:
   - Navigate through different sections using the sidebar
   - Click "+ Add" buttons to create new content
   - Fill in the forms and submit
3. **Edit Content**: Click "Edit" button on any item
4. **Delete Content**: Click "Delete" button (requires confirmation)
5. **Logout**: Click logout button in sidebar

### Main Site

The main portfolio at `/index.html` automatically loads and displays all content from Firebase. If no content exists in a section, it shows an empty state message.

## Firebase Collections Structure

### `about` (Document: "main")

```javascript
{
  description: string,
  email: string,
  location: string,
  status: string
}
```

### `skills` (Collection)

```javascript
{
  category: string,
  name: string,
  level: "Expert" | "Advanced" | "Intermediate"
}
```

### `experience` (Collection)

```javascript
{
  position: string,
  company: string,
  startDate: string,
  endDate: string,
  description: string,
  technologies: string[]
}
```

### `projects` (Collection)

```javascript
{
  title: string,
  description: string,
  image: string (URL),
  technologies: string[],
  githubLink: string (URL),
  liveLink: string (URL)
}
```

### `blogs` (Collection)

```javascript
{
  title: string,
  category: string,
  excerpt: string,
  image: string (URL),
  date: string (YYYY-MM-DD),
  link: string (URL)
}
```

## File Structure

```
/app/portfolio/
├── index.html              # Main portfolio page
├── login.html              # Admin login page
├── dashboard.html          # Admin dashboard
├── server.py               # Python development server
├── css/
│   ├── styles.css          # Main portfolio styles
│   └── admin.css           # Admin dashboard styles
└── js/
    ├── portfolio.js        # Portfolio data loading
    ├── script.js           # Portfolio interactions
    ├── login.js            # Login functionality
    └── dashboard.js        # Dashboard CRUD operations
```

## Features in Detail

### Empty States

- All sections show "No data added yet" when empty
- Encourages admin to add content
- Main site remains functional even without data

### Responsive Design

- Mobile-first approach
- Hamburger menu on mobile devices
- Touch-friendly interface
- Optimized for all screen sizes

### Security

- Firebase Authentication for admin access
- Public read, authenticated write Firestore rules
- No sensitive data exposure
- Secure admin dashboard

## Troubleshooting

### Can't Login

- Verify you've created a user in Firebase Authentication
- Check Firebase config is correct in login.html
- Check browser console for errors

### Data Not Showing

- Check Firestore security rules allow public read
- Check Firebase config in index.html
- Check browser console for errors
- Verify data exists in Firestore Database

### CORS Errors

- Must use a web server (not file:// protocol)
- Use the provided server.py or any other HTTP server

## Customization

### Colors

- Primary color: `#c6ff00` (Lime green)
- Background: `#0f0f10` (Dark)
- Cards: `#1a1a1b`
- Borders: `#2a2a2b`

You can change these in the CSS files.

### Layout

- Modify HTML structure in the respective files
- Update CSS classes as needed
- JavaScript is modular and easy to modify

## License

MIT License - Feel free to use for your own portfolio!

## Support

For issues or questions, please check:

1. Firebase Console for any service errors
2. Browser console for JavaScript errors
3. Network tab for API call failures
