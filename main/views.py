from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.models import User

@require_GET
def index(request):
	if request.user.is_authenticated:
		return redirect('/user/list')

	return redirect('/signin')

@require_GET
@login_required
def user_list(request):
	user_list = User.objects.all().exclude(id=request.user.id)

	return render(request, 'main/pages/user/list.html', {'userList': user_list})