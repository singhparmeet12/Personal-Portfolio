from django.conf import settings
from django.utils import timezone
from .models import Profile, Resume, ProjectCategory, Service


def portfolio_globals(request):
    """Context processor providing site-wide global portfolio variables with zero-crash fallbacks."""
    profile = None
    active_resume = None
    categories = []
    featured_services = []

    try:
        profile = Profile.objects.first()
    except Exception:
        profile = None

    if not profile:
        profile = Profile(
            name="Parmeet Singh",
            headline="Building digital products, working with data, and exploring what's next.",
            subheadline="I'm a Computer Science graduate specializing in AI & Data Science, building web applications, exploring data-driven solutions, and working on digital projects for businesses.",
            email="contact@parmeetsingh.dev",
            location="Punjab, India",
            github_url="https://github.com/singhparmeet12",
            linkedin_url="https://linkedin.com/in/parmeetsingh",
            is_available_for_work=True
        )

    try:
        active_resume = Resume.objects.filter(is_active=True).first()
    except Exception:
        active_resume = None

    try:
        categories = list(ProjectCategory.objects.all())
    except Exception:
        categories = []

    try:
        featured_services = list(Service.objects.all()[:5])
    except Exception:
        featured_services = []

    return {
        'site_profile': profile,
        'active_resume': active_resume,
        'global_categories': categories,
        'global_services': featured_services,
        'current_year': timezone.now().year,
        'enable_lab': getattr(settings, 'ENABLE_LAB', True),
    }

