from django.db import models
from django.contrib.auth.models import User

class UserMsg(models.Model):
	id = models.AutoField(primary_key=True)
	owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_messages')
	recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
	msg_text = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)