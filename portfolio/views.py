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
    """Homepage: Hero with interactive visual, selected work, exploration snapshot, freelance preview, about teaser."""
    featured_projects = Project.objects.filter(is_featured=True).prefetch_related('technologies', 'category')[:4]
    # Fallback to recent projects if none marked featured
    if not featured_projects.exists():
        featured_projects = Project.objects.all().prefetch_related('technologies', 'category')[:4]
    
    services_preview = Service.objects.exclude(slug='web-applications').order_by('display_order')[:3]

    context = {
        'featured_projects': featured_projects,
        'services_preview': services_preview,
        'active_page': 'home',
    }
    return render(request, 'portfolio/home.html', context)


def work_view(request):
    """Work Showcase: Filterable project grid across categories."""
    selected_category_slug = request.GET.get('category', '').strip()
    categories = ProjectCategory.objects.all()
    
    projects_qs = Project.objects.all().prefetch_related('technologies', 'category')
    if selected_category_slug and selected_category_slug != 'all':
        projects_qs = projects_qs.filter(category__slug=selected_category_slug)
        
    context = {
        'projects': projects_qs,
        'categories': categories,
        'selected_category_slug': selected_category_slug or 'all',
        'active_page': 'work',
    }
    return render(request, 'portfolio/work.html', context)


def project_detail_view(request, slug):
    """Case Study: In-depth project breakdown with metrics, challenges, and architecture."""
    project = get_object_or_404(
        Project.objects.prefetch_related('technologies', 'gallery_images', 'category'),
        slug=slug
    )
    prev_project = project.get_prev_project()
    next_project = project.get_next_project()
    features_list = project.get_features_list()
    
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
    skill_categories = SkillCategory.objects.prefetch_related('skills').all()
    experiences = Experience.objects.all()
    educations = Education.objects.all()
    certifications = Certification.objects.all()

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
    services = Service.objects.exclude(slug='web-applications').order_by('display_order')[:3]

    context = {
        'services': services,
        'active_page': 'services',
    }
    return render(request, 'portfolio/services.html', context)


def resume_view(request):
    """Resume Page: Embedded viewer & structured resume representation."""
    resume_doc = Resume.objects.filter(is_active=True).first()
    experiences = Experience.objects.all()
    educations = Education.objects.all()
    skill_categories = SkillCategory.objects.prefetch_related('skills').all()
    certifications = Certification.objects.all()

    context = {
        'resume_doc': resume_doc,
        'experiences': experiences,
        'educations': educations,
        'skill_categories': skill_categories,
        'certifications': certifications,
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
            
            messages.success(
                request,
                f"Thank you, {contact_msg.name}! Your message has been sent successfully. I will get back to you soon."
            )
            return redirect('portfolio:contact')
        else:
            messages.error(request, "Please check the form for errors and try again.")
    else:
        form = ContactForm()

    context = {
        'form': form,
        'active_page': 'contact',
    }
    return render(request, 'portfolio/contact.html', context)


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

