from django import forms
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
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control modern-input',
                'placeholder': 'your.email@example.com',
                'id': 'contact-email',
                'required': True,
            }),
            'subject': forms.TextInput(attrs={
                'class': 'form-control modern-input',
                'placeholder': 'Project Inquiry / Opportunity / Collaboration',
                'id': 'contact-subject',
                'required': True,
            }),
            'message': forms.Textarea(attrs={
                'class': 'form-control modern-input modern-textarea',
                'placeholder': 'Tell me about your project, idea, or role...',
                'id': 'contact-message',
                'rows': 5,
                'required': True,
            }),
        }

    def clean(self):
        cleaned_data = super().clean()
        bot_field = cleaned_data.get('bot_field')
        if bot_field:
            raise forms.ValidationError("Spam detected. Submission rejected.")
        return cleaned_data
