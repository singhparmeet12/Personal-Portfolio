import re
from django import forms
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    # Honeypot field for bot spam prevention (hidden with CSS, bots fill it out)
    bot_field = forms.CharField(
        required=False,
        widget=forms.HiddenInput,
        label="Leave this blank"
    )

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control modern-input',
                'placeholder': 'Your Name',
                'id': 'contact-name',
                'required': True,
                'minlength': '2',
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control modern-input',
                'placeholder': 'name@company.com',
                'id': 'contact-email',
                'required': True,
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control modern-input',
                'placeholder': 'Data Analyst Project / Full-Stack Role / Collaboration',
                'id': 'contact-subject',
                'required': True,
                'minlength': '3',
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control modern-input modern-textarea',
                'placeholder': 'Describe your project scope, role requirements, or idea...',
                'id': 'contact-message',
                'rows': 5,
                'required': True,
                'minlength': '10',
            }),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email', '').strip().lower()
        if not email:
            raise ValidationError("Please provide a valid email address.")
        
        # Validate format using Django core validator
        try:
            validate_email(email)
        except ValidationError:
            raise ValidationError("Please enter a valid, well-formed email address (e.g. name@domain.com).")
            
        # Ensure there is a dot in domain part and reasonable length
        if '@' not in email or '.' not in email.split('@')[-1]:
            raise ValidationError("Please enter a valid email address with a valid domain (e.g. name@domain.com).")
            
        domain = email.split('@')[-1]
        if len(domain) < 4 or len(domain.split('.')[-1]) < 2:
            raise ValidationError("The email domain appears incomplete. Please verify your address.")
            
        return email

    def clean(self):
        cleaned_data = super().clean()
        bot_field = cleaned_data.get('bot_field')
        if bot_field:
            raise forms.ValidationError("Spam detected. Submission rejected.")
        return cleaned_data
