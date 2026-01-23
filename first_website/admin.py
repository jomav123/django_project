from django.contrib import admin
from .models import User, Game, GameScore


class MemberAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email")

admin.site.register(User, MemberAdmin)


class GameAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "icon", "is_active", "order", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")

admin.site.register(Game, GameAdmin)


class GameScoreAdmin(admin.ModelAdmin):
    list_display = ("game", "user", "player_name", "score", "created_at")
    list_filter = ("game", "created_at")
    search_fields = ("player_name", "user__username")
    readonly_fields = ("created_at",)
    ordering = ("-score", "-created_at")

admin.site.register(GameScore, GameScoreAdmin)
