from django.urls import path
from . import views

urlpatterns = [
    path('', views.welcome, name='first_website'),
]


