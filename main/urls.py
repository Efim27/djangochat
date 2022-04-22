from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('user/list', views.user_list, name='user_list'),
    path('chat/', views.user_chat, name='user_chat'),
    path('chat/send_msg', views.user_chat_send, name='user_chat_send'),
]