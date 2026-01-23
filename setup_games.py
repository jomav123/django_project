"""
Auto-setup script for creating default games.
This is called automatically by start.bat
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'website.settings')
django.setup()

from first_website.models import Game

# Games data
games_data = [
    {
        'name': 'Snake',
        'slug': 'snake',
        'description': 'Classic snake game. Use arrow keys or WASD to control the snake and eat food!',
        'icon': '🐍',
        'is_active': True,
        'order': 1,
    },
    {
        'name': 'Memory Game',
        'slug': 'memory',
        'description': 'Find matching pairs of cards. Test your memory skills!',
        'icon': '🎯',
        'is_active': True,
        'order': 2,
    },
    {
        'name': 'Quiz',
        'slug': 'quiz',
        'description': 'Test your knowledge with multiple choice questions!',
        'icon': '❓',
        'is_active': True,
        'order': 3,
    },
    {
        'name': 'Tic-Tac-Toe',
        'slug': 'tic-tac-toe',
        'description': 'Play against the computer in this classic game!',
        'icon': '⭕',
        'is_active': True,
        'order': 4,
    },
    {
        'name': 'Breakout',
        'slug': 'breakout',
        'description': 'Break all blocks with the ball. Use arrow keys or A/D to move!',
        'icon': '🎾',
        'is_active': True,
        'order': 5,
    },
    {
        'name': 'Hangman',
        'slug': 'hangman',
        'description': 'Guess the word letter by letter before the hangman is drawn!',
        'icon': '🎭',
        'is_active': True,
        'order': 6,
    },
    {
        'name': 'Tetris',
        'slug': 'tetris',
        'description': 'Classic Tetris! Use arrow keys or WASD to move and rotate pieces.',
        'icon': '🧩',
        'is_active': True,
        'order': 7,
    },
    {
        'name': 'Minesweeper',
        'slug': 'minesweeper',
        'description': 'Find all mines without exploding! Click to reveal, right-click to flag.',
        'icon': '💣',
        'is_active': True,
        'order': 8,
    },
    {
        'name': '2048',
        'slug': '2048',
        'description': 'Combine tiles to reach 2048! Use arrow keys or WASD to move.',
        'icon': '🔢',
        'is_active': True,
        'order': 9,
    },
]

# Create games
created_count = 0
for game_data in games_data:
    game, created = Game.objects.get_or_create(
        slug=game_data['slug'],
        defaults=game_data
    )
    if created:
        created_count += 1
        print(f"✓ Created game: {game.name}")
    else:
        print(f"  Game already exists: {game.name}")

if created_count > 0:
    print(f"\n✓ Setup complete! Created {created_count} game(s).")
else:
    print("\n✓ All games already exist.")

