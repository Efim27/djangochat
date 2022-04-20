from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User


class RegisterForm(UserCreationForm):
    email = forms.EmailField(label="e-mail")
    username = forms.CharField(label="Имя")
    error_messages = {
        'required': 'Это поле необходимо заполнить',
        'invalid': 'Вы ввели некорректное значение',
        'unique': 'Имя пользователя уже кем-то используется',
        'email_exist': 'Данный e-mail уже кем-то используется',
        'password_mismatch': 'Пароли не совпадают'
    }

    def save(self, commit=True):
        user = super(RegisterForm, self).save(commit=False)
        user.username = self.cleaned_data["username"]
        user.email = self.cleaned_data["email"]

        if commit:
            user.save()
        return user

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(
                self.error_messages['email_exist'],
                code='email_exist',
            )
        return self.cleaned_data.get('email')

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
