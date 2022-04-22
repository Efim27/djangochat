from django.db import models
from django.db.models import Q
from django.core import serializers

import json

from django.contrib.auth.models import User

class UserMsgManager(models.Manager):
	def by_users(self, user1, user2):
		return super(UserMsgManager, self).get_queryset().filter(
			(Q(owner=user1) & Q(recipient=user2)) |
			(Q(owner=user2) & Q(recipient=user1))
		).order_by('created_at')

	def dicts_by_users(self, user1, user2):
		message_list = []
		for message in self.by_users(user1, user2):
			message_list.append({
				'id': message.id,
				'owner': message.owner.id,
				'recipient': message.recipient.id,
				'msg_text': message.msg_text,
				'created_at': message.created_at.strftime("%Y-%m-%d %H:%M:%S")
			})

		return message_list

class UserMsg(models.Model):
	id = models.AutoField(primary_key=True)
	owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_messages')
	recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
	msg_text = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	objects = models.Manager()
	user_msgs = UserMsgManager()