from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib import messages
from django.http import JsonResponse
from .models import Game, GameScore


def create_default_games():
    """Create default games if they don't exist"""
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
    
    for game_data in games_data:
        Game.objects.get_or_create(
            slug=game_data['slug'],
            defaults=game_data
        )


def home(request):
    """Home page with game grid (3x3 = 9 slots)"""
    # Auto-create games if database is empty
    if Game.objects.count() == 0:
        create_default_games()
    
    games = Game.objects.filter(is_active=True).order_by('order', 'name')
    total_slots = 9
    empty_slots = range(max(0, total_slots - games.count()))
    context = {
        'games': games,
        'empty_slots': empty_slots,
    }
    return render(request, 'home.html', context)


def game_detail(request, slug):
    """Game detail page - redirects to specific game"""
    game = get_object_or_404(Game, slug=slug, is_active=True)
    
    # Route to specific game template
    game_templates = {
        'snake': 'games/snake.html',
        'memory': 'games/memory.html',
        'quiz': 'games/quiz.html',
        'tic-tac-toe': 'games/tic-tac-toe.html',
        'breakout': 'games/breakout.html',
        'hangman': 'games/hangman.html',
        'tetris': 'games/tetris.html',
        'minesweeper': 'games/minesweeper.html',
        '2048': 'games/2048.html',
    }
    
    template = game_templates.get(slug, 'games/default.html')
    context = {
        'game': game,
    }
    return render(request, template, context)


def register_view(request):
    """User registration"""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})


def logout_view(request):
    """Custom logout view that accepts GET requests"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('home')


@login_required
def profile_view(request):
    """User profile with game scores"""
    scores = GameScore.objects.filter(user=request.user).order_by('-created_at')[:10]
    
    # Get high scores for each game
    games = Game.objects.filter(is_active=True)
    game_high_scores = []
    for game in games:
        best_score = GameScore.objects.filter(user=request.user, game=game).order_by('-score').first()
        game_high_scores.append({
            'game': game,
            'score': best_score.score if best_score else None,
            'date': best_score.created_at if best_score else None
        })
    
    context = {
        'scores': scores,
        'game_high_scores': game_high_scores,
    }
    return render(request, 'profile.html', context)


@login_required
def save_score(request):
    """Save game score via AJAX"""
    if request.method == 'POST':
        import json
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
        
        game_slug = data.get('game_slug')
        score = data.get('score')
        player_name = data.get('player_name', '')
        
        if not game_slug or score is None:
            return JsonResponse({'success': False, 'message': 'Missing required fields'}, status=400)
        
        try:
            game = Game.objects.get(slug=game_slug, is_active=True)
            game_score = GameScore.objects.create(
                game=game,
                user=request.user,
                score=int(score),
                player_name=player_name
            )
            return JsonResponse({'success': True, 'message': 'Score saved!'})
        except Game.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Game not found'}, status=404)
        except ValueError:
            return JsonResponse({'success': False, 'message': 'Invalid score value'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)



