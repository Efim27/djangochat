from django.urls import path
from . import views

urlpatterns = [
    path('signin', views.signin_view, name='signin_view'),
	path('signin/post', views.signin_post, name='signin_post'),
	path('signup', views.signup_view, name='signup_view'),
	path('signup/post', views.signup_post, name='signup_post'),
	path('logout', views.logout, name='logout'),
]