"""
URL configuration for portfolio_core project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('portfolio.urls', namespace='portfolio')),
]

# Serve media and static files in development mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom error handlers
handler404 = 'portfolio.views.custom_404_view'
handler500 = 'portfolio.views.custom_500_view'
handler403 = 'portfolio.views.custom_403_view'

# Admin header branding
admin.site.site_header = "Parmeet Singh — Portfolio Admin"
admin.site.site_title = "Parmeet Singh Admin"
admin.site.index_title = "Portfolio Management System"
