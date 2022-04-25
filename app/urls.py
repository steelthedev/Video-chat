from django.contrib import admin
from django.urls import path
from . import views

app_name="app"

urlpatterns = [
    path('', views.lobby , name="lobby"),
    path('room',views.Room, name="room")
]
