from django.db import models
from django.urls import reverse
from django.utils.text import slugify


class Profile(models.Model):
    name = models.CharField(max_length=100, default="Parmeet Singh")
    headline = models.CharField(
        max_length=255,
        default="Building digital products, working with data, and exploring what's next."
    )
    subheadline = models.TextField(
        default="I'm a Computer Science graduate specializing in AI & Data Science, building web applications, exploring data-driven solutions, and working on digital projects for businesses."
    )
    bio_short = models.TextField(
        default="Parmeet is a Computer Science graduate with a background in AI & Data Science who enjoys building practical software and experimenting across different areas of technology. He is currently exploring the intersection of Software Development, Data, and Digital Products."
    )
    bio_full = models.TextField(
        blank=True,
        default="I am an early-career technologist passionate about software engineering, data analytics, and digital product creation. My background in Computer Science with specialization in AI & Data Science has equipped me with strong problem-solving fundamentals, modern full-stack development skills (Python, Django, JavaScript), and data exploration capabilities. Rather than claiming senior expertise in everything, I focus on hands-on execution: understanding real-world user needs, writing clean code, analyzing information thoughtfully, and delivering functional digital experiences."
    )
    email = models.EmailField(default="contact@parmeetsingh.dev")
    location = models.CharField(max_length=100, default="Punjab, India")
    github_url = models.URLField(default="https://github.com/parmeetsingh")
    linkedin_url = models.URLField(default="https://linkedin.com/in/parmeetsingh")
    is_available_for_work = models.BooleanField(default=True)
    avatar = models.ImageField(upload_to="profile/", blank=True, null=True)

    class Meta:
        verbose_name = "Site Profile"
        verbose_name_plural = "Site Profile"

    def __str__(self):
        return f"{self.name} Profile"


class ProjectCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Project Category"
        verbose_name_plural = "Project Categories"
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Technology(models.Model):
    CATEGORY_CHOICES = [
        ('languages', 'Programming Languages'),
        ('backend', 'Backend & Frameworks'),
        ('frontend', 'Frontend & UI'),
        ('data_ai', 'Data, Analytics & AI'),
        ('database', 'Databases'),
        ('tools', 'Tools & DevOps'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='backend')
    badge_color = models.CharField(max_length=30, blank=True, default='indigo')

    class Meta:
        verbose_name = "Technology"
        verbose_name_plural = "Technologies"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Project(models.Model):
    CLIENT_TYPE_CHOICES = [
        ('personal', 'Personal Project'),
        ('freelance', 'Freelance / Client Work'),
        ('academic', 'Academic / Research'),
        ('open_source', 'Open Source'),
    ]

    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    tagline = models.CharField(max_length=255, help_text="Short one-line elevator pitch")
    category = models.ForeignKey(ProjectCategory, on_delete=models.SET_NULL, null=True, related_name='projects')
    technologies = models.ManyToManyField(Technology, related_name='projects')
    featured_image = models.ImageField(upload_to="projects/")
    
    overview = models.TextField(help_text="What real-world problem this project solves")
    what_i_built = models.TextField(help_text="Detailed explanation of Parmeet's actual contribution and architecture")
    key_features = models.TextField(help_text="List key features (separated by newlines)")
    challenges_learning = models.TextField(help_text="Technical challenges encountered and what was learned")
    
    github_url = models.URLField(blank=True, help_text="GitHub repository URL")
    live_url = models.URLField(blank=True, help_text="Live working demo URL")
    client_type = models.CharField(max_length=30, choices=CLIENT_TYPE_CHOICES, default='personal')
    
    is_featured = models.BooleanField(default=False, help_text="Feature on Homepage")
    completion_date = models.DateField(blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('portfolio:project_detail', kwargs={'slug': self.slug})

    def get_features_list(self):
        """Returns key features as a clean list of non-empty strings."""
        if not self.key_features:
            return []
        return [line.strip().lstrip('-*• ') for line in self.key_features.splitlines() if line.strip()]

    def get_next_project(self):
        """Returns the next project in sequence or loops to the first."""
        next_proj = Project.objects.filter(display_order__gt=self.display_order).order_by('display_order', '-created_at').first()
        if not next_proj:
            next_proj = Project.objects.exclude(id=self.id).order_by('display_order', '-created_at').first()
        return next_proj

    def get_prev_project(self):
        """Returns the previous project in sequence or loops to the last."""
        prev_proj = Project.objects.filter(display_order__lt=self.display_order).order_by('-display_order', 'created_at').first()
        if not prev_proj:
            prev_proj = Project.objects.exclude(id=self.id).order_by('-display_order', 'created_at').first()
        return prev_proj


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='gallery_images')
    image = models.ImageField(upload_to="projects/gallery/")
    caption = models.CharField(max_length=200, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Project Screenshot"
        verbose_name_plural = "Project Screenshots"
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"{self.project.title} - Screenshot {self.id}"


class SkillCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Skill Category"
        verbose_name_plural = "Skill Categories"
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Skill(models.Model):
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    note = models.CharField(max_length=100, blank=True, help_text="e.g. 'Core Stack', 'Data Pipelines', 'APIs'")
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Skill"
        verbose_name_plural = "Skills"
        ordering = ['display_order', 'name']

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class Experience(models.Model):
    EMPLOYMENT_TYPES = [
        ('internship', 'Internship'),
        ('freelance', 'Freelance / Contract'),
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
    ]

    company = models.CharField(max_length=150)
    role = models.CharField(max_length=150)
    location = models.CharField(max_length=100, blank=True)
    employment_type = models.CharField(max_length=30, choices=EMPLOYMENT_TYPES, default='internship')
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(help_text="Summary of responsibilities and achievements (supports bullet lines)")
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Work Experience"
        verbose_name_plural = "Work Experiences"
        ordering = ['display_order', '-start_date']

    def __str__(self):
        return f"{self.role} at {self.company}"

    def get_description_bullets(self):
        if not self.description:
            return []
        return [line.strip().lstrip('-*• ') for line in self.description.splitlines() if line.strip()]


class Education(models.Model):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200)
    grade = models.CharField(max_length=50, blank=True, help_text="e.g. CGPA / Percentage")
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    period_text = models.CharField(max_length=50, blank=True, help_text="e.g. '2021 - 2025'")
    description = models.TextField(blank=True, help_text="Key coursework or academic highlights")
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Education"
        verbose_name_plural = "Education"
        ordering = ['display_order', '-end_date']

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Certification(models.Model):
    name = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    issue_date = models.DateField(blank=True, null=True)
    issue_date_text = models.CharField(max_length=50, blank=True, help_text="e.g. '2024'")
    credential_url = models.URLField(blank=True)
    credential_id = models.CharField(max_length=150, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Certification"
        verbose_name_plural = "Certifications"
        ordering = ['display_order', '-issue_date']

    def __str__(self):
        return f"{self.name} ({self.issuer})"


class Service(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=150, unique=True)
    short_summary = models.CharField(max_length=255)
    full_description = models.TextField()
    what_included = models.TextField(help_text="Bullet points of what is included (newline separated)")
    who_its_for = models.TextField(help_text="Ideal target audience or business type")
    what_delivered = models.TextField(help_text="Deliverables and outcome")
    icon = models.CharField(max_length=50, default="code", help_text="Icon identifier (e.g. layout, code, database, refresh-cw, smartphone, layers)")
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Service"
        verbose_name_plural = "Services"
        ordering = ['display_order', 'title']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_included_list(self):
        if not self.what_included:
            return []
        return [line.strip().lstrip('-*• ') for line in self.what_included.splitlines() if line.strip()]


class Resume(models.Model):
    title = models.CharField(max_length=150, default="Parmeet Singh - Resume")
    file = models.FileField(upload_to="resumes/")
    is_active = models.BooleanField(default=True, help_text="Only active resume will be served to recruiters")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Resume Document"
        verbose_name_plural = "Resume Documents"
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.title} ({'Active' if self.is_active else 'Inactive'})"


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"
