"""
Script to create initial games in the database.
Run this after migrations: python manage.py shell < create_games.py
Or run: python manage.py shell, then paste this code.
"""

from first_website.models import Game

# Create games
games_data = [
    {
        'name': 'Snake',
        'slug': 'snake',
        'description': 'Classic snake game. Use arrow keys to control the snake and eat food!',
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
]

for game_data in games_data:
    game, created = Game.objects.get_or_create(
        slug=game_data['slug'],
        defaults=game_data
    )
    if created:
        print(f"Created game: {game.name}")
    else:
        print(f"Game already exists: {game.name}")

print("\nGames setup complete!")

