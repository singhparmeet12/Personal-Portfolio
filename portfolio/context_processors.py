from django.utils import timezone
from .models import Profile, Resume, ProjectCategory, Service


def portfolio_globals(request):
    """Context processor providing site-wide global portfolio variables."""
    profile = Profile.objects.first()
    if not profile:
        # Graceful fallback before DB is seeded
        profile = Profile(
            name="Parmeet Singh",
            headline="Building digital products, working with data, and exploring what's next.",
            subheadline="I'm a Computer Science graduate specializing in AI & Data Science, building web applications, exploring data-driven solutions, and working on digital projects for businesses.",
            email="contact@parmeetsingh.dev",
            location="Punjab, India",
            github_url="https://github.com/parmeetsingh",
            linkedin_url="https://linkedin.com/in/parmeetsingh",
            is_available_for_work=True
        )
    
    active_resume = Resume.objects.filter(is_active=True).first()
    categories = ProjectCategory.objects.all()
    featured_services = Service.objects.all()[:5]

    return {
        'site_profile': profile,
        'active_resume': active_resume,
        'global_categories': categories,
        'global_services': featured_services,
        'current_year': timezone.now().year,
    }
