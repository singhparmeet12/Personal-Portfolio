from django.urls import path
from . import views

app_name = 'portfolio'

urlpatterns = [
    path('', views.home_view, name='home'),
    path('work/', views.work_view, name='work'),
    path('work/<slug:slug>/', views.project_detail_view, name='project_detail'),
    path('about/', views.about_view, name='about'),
    path('services/', views.services_view, name='services'),
    path('resume/', views.resume_view, name='resume'),
    path('resume/download/', views.resume_download_view, name='resume_download'),
    path('contact/', views.contact_view, name='contact'),
    path('lab/', views.lab_view, name='lab'),
    
    # Live Django Full-Stack Showcase APIs
    path('api/v1/system-metrics/', views.system_metrics_api, name='system_metrics_api'),
    path('api/v1/query-simulator/', views.query_simulator_api, name='query_simulator_api'),
]
