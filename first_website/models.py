from django.db import models
from django.contrib.auth.models import User as AuthUser


class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150)
    age = models.IntegerField(default=0)
    phone_number = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.email}"


class Game(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='🎮')  # Emoji or icon class
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = 'Game'
        verbose_name_plural = 'Games'
    
    def __str__(self):
        return self.name


class GameScore(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='scores')
    user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, null=True, blank=True, related_name='game_scores')
    score = models.IntegerField()
    player_name = models.CharField(max_length=100, blank=True)  # For anonymous players
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-score', '-created_at']
        verbose_name = 'Game Score'
        verbose_name_plural = 'Game Scores'
    
    def __str__(self):
        player = self.user.username if self.user else self.player_name or 'Anonymous'
        return f"{self.game.name} - {player}: {self.score}"