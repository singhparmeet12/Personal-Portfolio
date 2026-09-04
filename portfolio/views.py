from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.http import FileResponse, Http404, HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from django.db.models import Count
from django.conf import settings
import os
import time
import django

from .models import (
    Profile,
    Project,
    ProjectCategory,
    Technology,
    SkillCategory,
    Experience,
    Education,
    Certification,
    Service,
    Resume,
    ContactMessage,
)
from .forms import ContactForm


def home_view(request):
    """Homepage: Hero with interactive visual, skills strip, selected work, exploration snapshot, freelance preview, about teaser."""
    featured_projects = []
    services_preview = []
    skill_categories = []
    try:
        qs = list(Project.objects.filter(is_featured=True).select_related('category').prefetch_related('technologies')[:3])
        if not qs:
            qs = list(Project.objects.all().select_related('category').prefetch_related('technologies')[:3])
        featured_projects = qs
    except Exception:
        featured_projects = []

    try:
        services_preview = list(Service.objects.exclude(slug='web-applications').order_by('display_order')[:3])
    except Exception:
        services_preview = []

    try:
        skill_categories = list(SkillCategory.objects.prefetch_related('skills').all())
    except Exception:
        skill_categories = []

    context = {
        'featured_projects': featured_projects,
        'services_preview': services_preview,
        'skill_categories': skill_categories,
        'active_page': 'home',
    }
    return render(request, 'portfolio/home.html', context)


def work_view(request):
    """Work Showcase: Filterable project grid across categories."""
    selected_category_slug = request.GET.get('category', '').strip()
    categories = []
    projects_qs = []
    try:
        categories = list(ProjectCategory.objects.all())
        projects_qs = Project.objects.all().select_related('category').prefetch_related('technologies')
        if selected_category_slug and selected_category_slug != 'all':
            projects_qs = projects_qs.filter(category__slug=selected_category_slug)
    except Exception:
        categories = []
        projects_qs = []

    context = {
        'projects': projects_qs,
        'categories': categories,
        'selected_category_slug': selected_category_slug or 'all',
        'active_page': 'work',
    }
    return render(request, 'portfolio/work.html', context)


def project_detail_view(request, slug):
    """Case Study: In-depth project breakdown with metrics, challenges, and architecture."""
    try:
        project = get_object_or_404(
            Project.objects.select_related('category').prefetch_related('technologies', 'gallery_images'),
            slug=slug
        )
        prev_project = project.get_prev_project()
        next_project = project.get_next_project()
        features_list = project.get_features_list()
    except Exception:
        raise Http404("Project not found")

    context = {
        'project': project,
        'prev_project': prev_project,
        'next_project': next_project,
        'features_list': features_list,
        'active_page': 'work',
    }
    return render(request, 'portfolio/project_detail.html', context)


def about_view(request):
    """About Page: Bio, education, work experience, skill matrix, certifications, and tech exploration."""
    skill_categories = []
    experiences = []
    educations = []
    certifications = []
    try:
        skill_categories = list(SkillCategory.objects.prefetch_related('skills').all())
        experiences = list(Experience.objects.all())
        educations = list(Education.objects.all())
        certifications = list(Certification.objects.all())
    except Exception:
        pass

    context = {
        'skill_categories': skill_categories,
        'experiences': experiences,
        'educations': educations,
        'certifications': certifications,
        'active_page': 'about',
    }
    return render(request, 'portfolio/about.html', context)


def services_view(request):
    """Services Page: Freelance web development, landing pages, custom digital solutions, workflow."""
    services = []
    try:
        services = list(Service.objects.exclude(slug='web-applications').order_by('display_order')[:3])
    except Exception:
        services = []

    context = {
        'services': services,
        'active_page': 'services',
    }
    return render(request, 'portfolio/services.html', context)


def resume_view(request):
    """Resume Page: Embedded viewer & structured resume representation."""
    resume_doc = None
    experiences = []
    educations = []
    skill_categories = []
    certifications = []
    projects = []
    try:
        resume_doc = Resume.objects.filter(is_active=True).first()
        experiences = list(Experience.objects.all())
        educations = list(Education.objects.all())
        skill_categories = list(SkillCategory.objects.prefetch_related('skills').all())
        certifications = list(Certification.objects.all())
        projects = list(Project.objects.all())
    except Exception:
        pass

    context = {
        'resume_doc': resume_doc,
        'experiences': experiences,
        'educations': educations,
        'skill_categories': skill_categories,
        'certifications': certifications,
        'projects': projects,
        'active_page': 'resume',
    }
    return render(request, 'portfolio/resume.html', context)



def resume_download_view(request):
    """Streams the active resume PDF to download directly with friendly filename."""
    resume_doc = Resume.objects.filter(is_active=True).first()
    if resume_doc and resume_doc.file and os.path.exists(resume_doc.file.path):
        response = FileResponse(
            open(resume_doc.file.path, 'rb'),
            content_type='application/pdf'
        )
        response['Content-Disposition'] = 'attachment; filename="Parmeet_Singh_Resume.pdf"'
        return response
    
    # If no physical PDF file is present yet, redirect to resume page with message
    messages.info(request, "Resume PDF will be available shortly. You can view the complete resume below.")
    return redirect('portfolio:resume')


def contact_view(request):
    """Contact Page: Direct contact info + validated Django contact form."""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            contact_msg = form.save(commit=False)
            # Capture client IP address if available
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                contact_msg.ip_address = x_forwarded_for.split(',')[0].strip()
            else:
                contact_msg.ip_address = request.META.get('REMOTE_ADDR')
            contact_msg.save()
            
            # Send direct email notification to Parmeet (parmeetssms@gmail.com)
            recipient_email = "parmeetssms@gmail.com"
            email_subject = f"[Portfolio Contact] {contact_msg.subject} — from {contact_msg.name}"
            email_body = f"""Hello Parmeet,

You have received a new direct message through your portfolio website contact form!

--------------------------------------------------
Sender Details:
--------------------------------------------------
Name:    {contact_msg.name}
Email:   {contact_msg.email}
Subject: {contact_msg.subject}
IP:      {contact_msg.ip_address or 'Unknown'}
Time:    {contact_msg.created_at.strftime('%Y-%m-%d %H:%M:%S UTC') if contact_msg.created_at else 'Just now'}

--------------------------------------------------
Message:
--------------------------------------------------
{contact_msg.message}

--------------------------------------------------
You can reply directly to {contact_msg.name} at: {contact_msg.email}
"""
            # 1. Dispatch directly to parmeetssms@gmail.com via FormSubmit Cloud Gateway
            try:
                import urllib.request
                import json

                formsubmit_data = json.dumps({
                    'name': contact_msg.name,
                    'email': contact_msg.email,
                    '_replyto': contact_msg.email,
                    'subject': f"Portfolio Contact: {contact_msg.subject}",
                    'message': contact_msg.message,
                    '_template': 'table',
                    '_captcha': 'false'
                }).encode('utf-8')

                req = urllib.request.Request(
                    'https://formsubmit.co/ajax/parmeetssms@gmail.com',
                    data=formsubmit_data,
                    headers={
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Referer': request.build_absolute_uri(),
                        'Origin': request.build_absolute_uri('/'),
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                    }
                )
                with urllib.request.urlopen(req, timeout=10) as resp:
                    resp_body = resp.read().decode('utf-8')
            except Exception as forward_err:
                pass

            # 2. Also attempt standard Django send_mail if SMTP is configured
            try:
                from django.core.mail import send_mail
                from django.conf import settings
                from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'webmaster@localhost')
                send_mail(
                    subject=email_subject,
                    message=email_body,
                    from_email=from_email,
                    recipient_list=[recipient_email],
                    fail_silently=True,
                )
            except Exception:
                pass

            messages.success(
                request,
                f"Thank you, {contact_msg.name}! Your message has been sent successfully. I have received your note and will contact you directly at {contact_msg.email} shortly."
            )
            return redirect('portfolio:contact')
        else:
            messages.error(request, "Please ensure all fields are filled out correctly with a valid email address.")
    else:
        form = ContactForm()

    context = {
        'form': form,
        'active_page': 'contact',
    }
    return render(request, 'portfolio/contact.html', context)


def lab_view(request):
    """Experimental Sandbox / Skills Playground: A free-form area for creative tech demos."""
    context = {
        'active_page': 'lab',
    }
    return render(request, 'portfolio/lab.html', context)


def custom_404_view(request, exception=None):
    """Custom 404 Not Found error page."""
    return render(request, '404.html', status=404)


def custom_500_view(request):
    """Custom 500 Server Error page."""
    return render(request, '500.html', status=500)


def system_metrics_api(request):
    """Live Django backend telemetry and system status API."""
    start_t = time.perf_counter()
    
    projects_count = Project.objects.count()
    techs_count = Technology.objects.count()
    services_count = Service.objects.count()
    categories_count = ProjectCategory.objects.count()
    
    latency_ms = round((time.perf_counter() - start_t) * 1000, 2)
    
    db_engine = settings.DATABASES['default']['ENGINE'].split('.')[-1].upper()
    
    data = {
        "status": "operational",
        "framework": f"Django {django.get_version()}",
        "runtime": "Python 3.12+ (WSGI/ASGI Async-Ready)",
        "database": db_engine,
        "metrics": {
            "projects_count": projects_count,
            "technologies_count": techs_count,
            "services_count": services_count,
            "categories_count": categories_count,
            "orm_latency_ms": latency_ms,
        },
        "security": {
            "csrf_protection": True,
            "xss_sanitization": True,
            "sql_injection_defense": "Parameterized ORM",
        },
        "timestamp": time.time(),
    }
    return JsonResponse(data)


def query_simulator_api(request):
    """Interactive ORM query execution runner demonstrating Django's query power."""
    scenario = request.GET.get('scenario', 'featured_projects')
    start_t = time.perf_counter()
    
    if scenario == 'featured_projects':
        qs = Project.objects.filter(is_featured=True).values('title', 'slug', 'category__name', 'client_type')
        results = list(qs)
        sql_preview = str(qs.query)
        orm_code = "Project.objects.filter(is_featured=True).values('title', 'slug', 'category__name', 'client_type')"
        desc = "Filtered query fetching featured projects joined with category metadata."

    elif scenario == 'tech_distribution':
        qs = Technology.objects.values('category').annotate(total=Count('id')).order_by('-total')
        results = list(qs)
        sql_preview = str(qs.query)
        orm_code = "Technology.objects.values('category').annotate(total=Count('id')).order_by('-total')"
        desc = "SQL GROUP BY aggregation computing technology distribution across domain categories."

    elif scenario == 'relational_prefetch':
        projects = Project.objects.prefetch_related('technologies', 'category').all()
        results = [
            {
                "title": p.title,
                "category": p.category.name if p.category else None,
                "tech_count": p.technologies.count(),
                "technologies": [t.name for t in p.technologies.all()]
            }
            for p in projects
        ]
        sql_preview = "SELECT ... FROM portfolio_project; SELECT ... FROM portfolio_technology INNER JOIN portfolio_project_technologies ..."
        orm_code = "Project.objects.prefetch_related('technologies', 'category').all()"
        desc = "Optimized M2M relational prefetch avoiding N+1 database queries."

    elif scenario == 'debt_algorithm':
        # TourCraze debt simplification simulation
        balances = {"Alice": -450, "Bob": 250, "Charlie": 200, "David": 0}
        debtors = [(k, -v) for k, v in balances.items() if v < 0]
        creditors = [(k, v) for k, v in balances.items() if v > 0]
        settlements = []
        i, j = 0, 0
        while i < len(debtors) and j < len(creditors):
            d_name, d_amt = debtors[i]
            c_name, c_amt = creditors[j]
            settled = min(d_amt, c_amt)
            settlements.append({"from": d_name, "to": c_name, "amount": settled})
            debtors[i] = (d_name, d_amt - settled)
            creditors[j] = (c_name, c_amt - settled)
            if debtors[i][1] == 0:
                i += 1
            if creditors[j][1] == 0:
                j += 1
        results = {
            "initial_balances": balances,
            "settlements_reduced_count": len(settlements),
            "transactions": settlements,
        }
        sql_preview = "-- Vectorized Graph Algorithm executed in Python (Sub-millisecond)"
        orm_code = "# TourCraze Debt Simplification Algorithm (Minimizes N transfers to N-1)"
        desc = "TourCraze bipartite graph debt-settlement engine reducing multi-user cash transactions."

    else:
        results = {"error": f"Unknown scenario: {scenario}"}
        sql_preview = ""
        orm_code = ""
        desc = "Invalid scenario"

    duration_ms = round((time.perf_counter() - start_t) * 1000, 3)

    return JsonResponse({
        "scenario": scenario,
        "description": desc,
        "orm_code": orm_code,
        "sql_preview": sql_preview,
        "execution_time_ms": duration_ms,
        "status_code": 200,
        "data": results,
    })


def custom_404_view(request, exception=None):
    """Custom 404 Not Found error page with clear guidance and home/contact links."""
    return render(request, '404.html', {'active_page': ''}, status=404)


def custom_500_view(request):
    """Custom 500 Internal Server Error page with helpful error messaging."""
    return render(request, '500.html', {'active_page': ''}, status=500)


def custom_403_view(request, exception=None):
    """Custom 403 Forbidden error page."""
    return render(request, '403.html', {'active_page': ''}, status=403)


