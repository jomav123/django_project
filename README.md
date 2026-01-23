# Game Hub 🎮

A modern web-based gaming platform built with Django, featuring multiple interactive games.

## Features

- **3 Interactive Games:**
  - 🐍 Snake - Classic snake game with arrow key controls
  - 🎯 Memory Game - Find matching pairs of cards
  - ❓ Quiz - Test your knowledge with multiple choice questions

- **User System:**
  - Optional registration and login
  - Play games without logging in (no score saving)
  - Save scores when logged in
  - View your game history in profile

- **Modern Design:**
  - Responsive layout that works on all devices
  - Beautiful gradient color scheme
  - Smooth animations and transitions
  - Clean and intuitive user interface

## Quick Start (Windows)

**Super easy - Just double-click:**

1. **Double-click `start.bat`** - This single file will:
   - Create virtual environment (if needed)
   - Install all dependencies (if needed)
   - Run database migrations automatically
   - Start the Django server
   - Open http://127.0.0.1:8000/ in your browser

2. **Add games to database:**
   - Go to http://127.0.0.1:8000/admin/
   - Login with superuser (create one if needed: `python manage.py createsuperuser`)
   - Add games or use `create_games.py` script

That's it! One file does everything! 🚀

## Manual Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd django_project-main
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser (optional, for admin panel):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Add games to database:**
   
   **Option 1 - Using Admin Panel:**
   - Start the development server: `python manage.py runserver`
   - Go to http://127.0.0.1:8000/admin/
   - Login with your superuser credentials
   - Go to "Games" section
   - Add games with the following data:
     - **Snake:** name="Snake", slug="snake", icon="🐍", order=1
     - **Memory Game:** name="Memory Game", slug="memory", icon="🎯", order=2
     - **Quiz:** name="Quiz", slug="quiz", icon="❓", order=3
   
   **Option 2 - Using Python script:**
   ```bash
   python manage.py shell
   ```
   Then paste the code from `create_games.py` file

7. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

8. **Open your browser:**
   Navigate to http://127.0.0.1:8000/

## Project Structure

```
django_project-main/
├── first_website/          # Main application
│   ├── models.py          # Game, User, GameScore models
│   ├── views.py           # View functions
│   ├── urls.py            # URL routing
│   ├── admin.py           # Admin panel configuration
│   └── templates/         # HTML templates
│       ├── base.html      # Base template
│       ├── home.html      # Home page with game grid
│       ├── profile.html   # User profile page
│       └── games/         # Game-specific templates
│           ├── snake.html
│           ├── memory.html
│           └── quiz.html
├── website/               # Project settings
│   ├── settings.py        # Django settings
│   └── urls.py           # Main URL configuration
├── static/               # Static files (CSS, JS, images)
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   └── js/               # JavaScript files
│       ├── snake.js
│       ├── memory.js
│       └── quiz.js
├── manage.py             # Django management script
└── requirements.txt      # Python dependencies
```

## Games

### Snake 🐍
- Use arrow keys to control the snake
- Eat food to grow and score points
- Avoid hitting walls or yourself
- High score is saved in browser localStorage

### Memory Game 🎯
- Click cards to flip them
- Find matching pairs
- Try to complete with as few moves as possible
- 8 pairs to find

### Quiz ❓
- Answer 10 multiple choice questions
- Get instant feedback on your answers
- See your final score and percentage
- Questions cover various topics

## Usage

1. **Home Page:** View all available games in a 3x3 grid (9 slots)
2. **Play Games:** Click on any game card to start playing
3. **Register/Login (Optional):** Create an account to save your scores
4. **Profile:** View your game history and scores (when logged in)
5. **Play Without Account:** You can play all games without logging in, but scores won't be saved

## Development

### Adding New Games

1. Create a new game template in `first_website/templates/games/`
2. Add JavaScript file in `static/js/`
3. Add the game to the database via admin panel
4. Update `views.py` `game_detail` function to route to your game template

### Customization

- **Colors:** Edit CSS variables in `static/css/style.css`
- **Games:** Modify game logic in respective JavaScript files
- **Models:** Add fields to models in `first_website/models.py`

## Technologies Used

- **Backend:** Django 5.2.8
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Database:** SQLite (default, can be changed in settings)

## License

This project is open source and available for educational purposes.

## Notes

- The project uses Django's built-in authentication system
- Static files are served in development mode
- For production, configure proper static file serving (e.g., WhiteNoise, AWS S3)
- Remember to set `DEBUG = False` and configure `ALLOWED_HOSTS` for production

