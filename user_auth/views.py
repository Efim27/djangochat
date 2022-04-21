from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse, HttpResponseForbidden
from django.contrib import auth

import json

from .forms import RegisterForm
from django.contrib.auth.models import User


@require_GET
def signin_view(request):
	if not request.user.is_anonymous:
		return redirect('/')

	return render(request, 'user_auth/pages/signin.html')


@require_POST
def signin_post(request):
	if request.user.is_authenticated:
		return HttpResponseForbidden()

	username = request.POST.get('username')
	password = request.POST.get('password')
	user = User.objects.filter(username=username).first()

	if (user is None) or (not user.check_password(password)):
		return JsonResponse({
			'status': 'error',
			'error': 'Неверная пара логин/пароль'
		})

	auth.login(request, user)
	return JsonResponse({
		'status': 'ok'
	})


@require_GET
def signup_view(request):
	if not request.user.is_anonymous:
		return redirect('/')

	return render(request, 'user_auth/pages/signup.html')


@require_POST
def signup_post(request):
	if request.user.is_authenticated:
		return HttpResponseForbidden()

	print(request.POST)
	form = RegisterForm(request.POST)
	if not form.is_valid():
		return JsonResponse({
			'status': 'error',
			'errors': form.errors
		})

	user = form.save()
	user.save()

	return JsonResponse({
		'status': 'ok'
	})


@login_required
def logout(request):
	auth.logout(request)
	return redirect('/')
