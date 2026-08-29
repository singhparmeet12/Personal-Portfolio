from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Profile,
    ProjectCategory,
    Technology,
    Project,
    ProjectImage,
    SkillCategory,
    Skill,
    Experience,
    Education,
    Certification,
    Service,
    Resume,
    ContactMessage,
)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'headline', 'email', 'location', 'is_available_for_work']
    fieldsets = (
        ('Personal Info', {
            'fields': ('name', 'headline', 'subheadline', 'avatar', 'is_available_for_work')
        }),
        ('Narrative & Bios', {
            'fields': ('bio_short', 'bio_full')
        }),
        ('Contact & Links', {
            'fields': ('email', 'location', 'github_url', 'linkedin_url')
        }),
    )


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'display_order']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['display_order']


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'category', 'badge_color']
    list_filter = ['category']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 2
    fields = ['image', 'caption', 'display_order']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'client_type', 'is_featured', 'display_order', 'completion_date', 'image_preview']
    list_filter = ['category', 'is_featured', 'client_type']
    search_fields = ['title', 'tagline', 'overview', 'what_i_built']
    list_editable = ['is_featured', 'display_order']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['technologies']
    inlines = [ProjectImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'tagline', 'category', 'client_type', 'is_featured', 'display_order', 'completion_date')
        }),
        ('Media & Visuals', {
            'fields': ('featured_image',)
        }),
        ('Case Study Details', {
            'fields': ('overview', 'what_i_built', 'technologies', 'key_features', 'challenges_learning')
        }),
        ('External Links', {
            'fields': ('live_url', 'github_url')
        }),
    )

    def image_preview(self, obj):
        if obj.featured_image:
            return format_html('<img src="{}" style="height: 40px; border-radius: 4px; object-fit: cover;" />', obj.featured_image.url)
        return "-"
    image_preview.short_description = "Preview"


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 3
    fields = ['name', 'note', 'display_order']


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'display_order']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['display_order']
    inlines = [SkillInline]


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'note', 'display_order']
    list_filter = ['category']
    search_fields = ['name', 'note']
    list_editable = ['display_order']


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['role', 'company', 'employment_type', 'start_date', 'end_date', 'is_current', 'display_order']
    list_filter = ['employment_type', 'is_current']
    search_fields = ['role', 'company', 'description']
    list_editable = ['display_order']


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['degree', 'institution', 'period_text', 'grade', 'display_order']
    search_fields = ['institution', 'degree', 'field_of_study']
    list_editable = ['display_order']


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['name', 'issuer', 'issue_date_text', 'display_order']
    search_fields = ['name', 'issuer']
    list_editable = ['display_order']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'short_summary', 'icon', 'display_order']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['display_order']


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'updated_at', 'file_link']
    list_editable = ['is_active']

    def file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">Download / View File</a>', obj.file.url)
        return "No file"
    file_link.short_description = "File"


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read', 'ip_address']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at', 'ip_address']
