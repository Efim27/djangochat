from email import message
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET, require_POST
from django.http import JsonResponse
from django.contrib.auth.models import User

from .models import UserMsg

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

@require_GET
@login_required
def user_chat(request):
	return render(request, 'main/pages/chat.html')

@require_POST
@login_required
def user_chat_send(request):
	msg_text = request.POST.get('msg_text').strip()
	recipient_id = request.POST.get('recipient_id')
	recipient = User.objects.filter(id=int(recipient_id)).first()

	if (not msg_text) or (len(msg_text) > 4000):
		return JsonResponse({
			'status': 'error',
			'error': 'Неверный формат сообщения (до 4000 символов)'
		})

	if not recipient:
		return JsonResponse({
			'status': 'error',
			'error': 'Получатель сообщения не найден'
		})

	new_msg = UserMsg(
		owner=request.user,
		recipient=recipient,
		msg_text=msg_text,
	)
	new_msg.save()

	return JsonResponse({
			'status': 'ok'
		})

@require_POST
@login_required
def user_chat_messages(request):
	user = request.user
	recipient_id = request.POST.get('recipient_id')
	recipient = User.objects.filter(id=int(recipient_id)).first()

	if not recipient:
		return JsonResponse({
			'status': 'error',
			'error': 'Получатель сообщения не найден'
		})

	message_list = UserMsg.user_msgs.dicts_by_users(user, recipient)

	return JsonResponse({
			'status': 'ok',
			'messages': message_list
		})