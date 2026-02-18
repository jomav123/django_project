
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('welcome/', include('first_website.urls')),
    path('admin/', admin.site.urls),
]


