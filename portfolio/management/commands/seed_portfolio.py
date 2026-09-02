import os
import datetime
from pathlib import Path
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont
import io

from portfolio.models import (
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
)


class Command(BaseCommand):
    help = "Seeds initial realistic portfolio data, projects, mockups, and resume."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding portfolio data for Parmeet Singh..."))
        
        # Ensure media directories exist
        os.makedirs(settings.MEDIA_ROOT / 'projects' / 'gallery', exist_ok=True)
        os.makedirs(settings.MEDIA_ROOT / 'resumes', exist_ok=True)
        os.makedirs(settings.MEDIA_ROOT / 'profile', exist_ok=True)

        self.seed_profile()
        categories = self.seed_categories()
        techs = self.seed_technologies()
        self.seed_projects(categories, techs)
        self.seed_skills()
        self.seed_experience()
        self.seed_education()
        self.seed_certifications()
        self.seed_services()
        self.seed_resume()

        self.stdout.write(self.style.SUCCESS("[OK] Portfolio data successfully seeded!"))

    def create_mockup_image(self, title, subtitle, tag, color_accent=(99, 102, 241), width=800, height=480):
        """Generates a sleek dark-themed project UI mockup image."""
        img = Image.new('RGB', (width, height), color=(14, 21, 38))
        draw = ImageDraw.Draw(img)

        # Background subtle gradients & borders
        draw.rectangle([(0, 0), (width, 40)], fill=(9, 13, 23))
        draw.line([(0, 40), (width, 40)], fill=(30, 41, 59), width=1)
        
        # Browser mockup dots (Red, Yellow, Green)
        draw.ellipse([(15, 14), (27, 26)], fill=(239, 68, 68))
        draw.ellipse([(35, 14), (47, 26)], fill=(245, 158, 11))
        draw.ellipse([(55, 14), (67, 26)], fill=(16, 185, 129))

        # URL bar mockup
        draw.rounded_rectangle([(90, 8), (width - 30, 32)], radius=6, fill=(19, 30, 53), outline=(40, 56, 85))

        # Inner UI Canvas Card
        draw.rounded_rectangle([(40, 70), (width - 40, height - 40)], radius=12, fill=(10, 16, 29), outline=(35, 48, 74))

        # Grid lines in mockup
        for y in range(90, height - 50, 40):
            draw.line([(50, y), (width - 50, y)], fill=(18, 27, 46), width=1)

        # Accent Tag Banner
        draw.rounded_rectangle([(60, 95), (240, 125)], radius=6, fill=color_accent)
        draw.text((75, 103), tag.upper(), fill=(255, 255, 255))

        # Title & Subtitle
        draw.text((60, 150), title, fill=(248, 250, 252))
        draw.text((60, 185), subtitle, fill=(148, 163, 184))

        # Mockup Content Panels
        # Left Panel (e.g. Chart / Data preview)
        draw.rounded_rectangle([(60, 225), (420, 400)], radius=8, fill=(16, 25, 44), outline=(30, 45, 72))
        draw.text((80, 245), "ENGINEERING METRICS", fill=(6, 182, 212))
        draw.line([(80, 350), (140, 320), (200, 340), (260, 290), (320, 300), (380, 260)], fill=color_accent, width=3)
        draw.text((80, 365), "Throughput: 99.9% | Latency: <45ms", fill=(100, 116, 139))

        # Right Panel (Code & System architecture)
        draw.rounded_rectangle([(445, 225), (width - 60, 400)], radius=8, fill=(16, 25, 44), outline=(30, 45, 72))
        draw.text((465, 245), "SYSTEM ARCHITECTURE", fill=(16, 185, 129))
        draw.text((465, 280), "def process_pipeline(data):", fill=(129, 140, 248))
        draw.text((485, 305), "models = load_engine()", fill=(203, 213, 225))
        draw.text((485, 330), "return models.evaluate(data)", fill=(203, 213, 225))
        draw.text((465, 365), "Status: Verified & Deployed", fill=(52, 211, 153))

        buf = io.BytesIO()
        img.save(buf, format='PNG')
        buf.seek(0)
        return buf

    def seed_profile(self):
        profile, _ = Profile.objects.get_or_create(id=1)
        profile.name = "Parmeet Singh"
        profile.headline = "Building digital products, working with data, and exploring what's next."
        profile.subheadline = "I'm a Computer Science graduate specializing in AI & Data Science, building web applications, exploring data-driven solutions, and working on digital projects for businesses."
        profile.bio_short = "Parmeet is a Computer Science graduate with a background in AI & Data Science who enjoys building practical software and experimenting across different areas of technology. He is currently exploring the intersection of Software Development, Data, and Digital Products."
        profile.bio_full = (
            "I am an early-career technologist passionate about software engineering, data analytics, and digital product creation. "
            "My background in Computer Science with specialization in AI & Data Science has equipped me with strong problem-solving fundamentals, "
            "modern full-stack development skills (Python, Django, JavaScript), and data exploration capabilities. "
            "Rather than claiming senior expertise in everything, I focus on hands-on execution: understanding real-world user needs, writing clean code, "
            "analyzing information thoughtfully, and delivering functional digital experiences."
        )
        profile.email = "contact@parmeetsingh.dev"
        profile.location = "Punjab, India"
        profile.github_url = "https://github.com/parmeetsingh"
        profile.linkedin_url = "https://linkedin.com/in/parmeetsingh"
        profile.is_available_for_work = True
        profile.save()
        self.stdout.write("  [OK] Profile seeded")

    def seed_categories(self):
        cats_data = [
            ("Full Stack", "full-stack", "Comprehensive web applications featuring frontend, backend, database and APIs.", 1),
            ("Web Development", "web-development", "Modern responsive websites, portals, and interactive digital interfaces.", 2),
            ("Data & Analytics", "data-analytics", "Data processing, analytics pipelines, visualizations, and statistical models.", 3),
            ("AI / ML", "ai-ml", "Predictive modeling, machine learning pipelines, and intelligence workflows.", 4),
            ("Freelance", "freelance", "Client projects delivered for businesses and entrepreneurs.", 5),
        ]
        categories = {}
        for name, slug, desc, order in cats_data:
            cat, _ = ProjectCategory.objects.get_or_create(slug=slug, defaults={'name': name, 'description': desc, 'display_order': order})
            categories[slug] = cat
        self.stdout.write("  [OK] Project Categories seeded")
        return categories

    def seed_technologies(self):
        tech_data = [
            ("Python", "python", "languages"),
            ("Django", "django", "backend"),
            ("JavaScript", "javascript", "languages"),
            ("PostgreSQL", "postgresql", "database"),
            ("SQLite", "sqlite", "database"),
            ("Pandas", "pandas", "data_ai"),
            ("NumPy", "numpy", "data_ai"),
            ("Scikit-Learn", "scikit-learn", "data_ai"),
            ("HTML5 & CSS3", "html-css", "frontend"),
            ("Bootstrap 5", "bootstrap", "frontend"),
            ("REST APIs", "rest-apis", "backend"),
            ("Git & GitHub", "git-github", "tools"),
            ("Matplotlib", "matplotlib", "data_ai"),
            ("PyTorch / YOLOv5", "pytorch-yolov5", "data_ai"),
            ("TradingView API", "tradingview", "frontend"),
            ("feedparser (RSS)", "feedparser", "backend"),
        ]
        techs = {}
        for name, slug, cat in tech_data:
            t, _ = Technology.objects.get_or_create(slug=slug, defaults={'name': name, 'category': cat})
            techs[slug] = t
        self.stdout.write("  [OK] Technologies seeded")
        return techs

    def seed_projects(self, categories, techs):
        projects_data = [
            {
                "title": "GaadiMandi",
                "slug": "gaadimandi",
                "tagline": "Automotive Dealer & Vehicle Inventory Management Platform",
                "category": categories["full-stack"],
                "tech_slugs": ["python", "django", "postgresql", "javascript", "bootstrap", "html-css", "rest-apis"],
                "client_type": "freelance",
                "is_featured": True,
                "completion_date": datetime.date(2025, 1, 15),
                "display_order": 1,
                "overview": (
                    "Used car dealerships and automotive brokers frequently grapple with disorganized inventory records, "
                    "fragmented customer inquiries across phone and WhatsApp, and unoptimized mobile viewing experiences. "
                    "GaadiMandi was developed to solve this by providing a unified dealership operating system with dynamic vehicle catalog "
                    "management and a high-converting customer discovery portal."
                ),
                "what_i_built": (
                    "Engineered the full-stack multi-dealer web architecture in Django with PostgreSQL backend. "
                    "Designed dynamic vehicle database models supporting multi-parameter filtering (make, model, fuel type, transmission, price brackets). "
                    "Built an admin management portal for vehicle lifecycle tracking, direct WhatsApp customer inquiry routing, and automated lead capture."
                ),
                "key_features": (
                    "- Dynamic multi-parameter vehicle search and live faceted filtering\n"
                    "- Dealer admin portal for vehicle lifecycle, pricing, and status updates\n"
                    "- Direct WhatsApp inquiry routing and automated customer test-drive booking\n"
                    "- Responsive mobile-first interface optimized for speed and high-resolution photo galleries\n"
                    "- SEO-optimized vehicle slug URLs and OpenGraph social share previews"
                ),
                "challenges_learning": (
                    "Optimized database indexing on multi-filter queries to maintain sub-50ms query response times under high catalog volume. "
                    "Configured dynamic thumbnail resizing pipelines to prevent heavy image payloads from slowing down mobile visitors."
                ),
                "github_url": "https://github.com/parmeetsingh/gaadimandi",
                "live_url": "https://gaadimandi.com",
            },
            {
                "title": "TourCraze",
                "slug": "tourcraze",
                "tagline": "Full-Stack Travel Planning & Group Expense Management Platform",
                "category": categories["web-development"],
                "tech_slugs": ["python", "django", "javascript", "sqlite", "bootstrap", "html-css", "rest-apis"],
                "client_type": "personal",
                "is_featured": True,
                "completion_date": datetime.date(2024, 11, 20),
                "display_order": 2,
                "overview": (
                    "Planning trips with friends often leads to disorganized spreadsheets, messy split-cost calculations, and awkward payment settlements. "
                    "TourCraze provides a clean, unified platform for collaborative itinerary scheduling, day-by-day activity tracking, and equitable group expense settlement."
                ),
                "what_i_built": (
                    "Developed the complete Django backend and interactive client frontend. "
                    "Created a graph-based debt simplification algorithm that minimizes the number of transactions required to settle balances among all trip members. "
                    "Implemented interactive day-by-day itinerary builders with budget breakdown charts."
                ),
                "key_features": (
                    "- Day-by-day visual itinerary scheduler with activity timeline tracking\n"
                    "- Intelligent expense-splitting engine with automated debt minimization algorithm\n"
                    "- Dynamic budget variance indicators and category spending breakdowns\n"
                    "- Group member invitation via secure tokenized share links\n"
                    "- Printable and exportable trip summary documentation"
                ),
                "challenges_learning": (
                    "Engineered the debt-settlement algorithm to handle uneven expense contributions and partial participant exclusions cleanly. "
                    "Created custom Django template tags and asynchronous AJAX form submission for seamless real-time expense additions."
                ),
                "github_url": "https://github.com/parmeetsingh/tourcraze",
                "live_url": "https://tourcraze.app",
            },
            {
                "title": "TradeLab",
                "slug": "tradelab",
                "tagline": "AI-Powered Trading Education & Multi-Market Analysis Platform",
                "category": categories["ai-ml"],
                "tech_slugs": ["python", "django", "pytorch-yolov5", "javascript", "bootstrap", "tradingview", "feedparser", "sqlite"],
                "client_type": "personal",
                "is_featured": True,
                "completion_date": datetime.date(2025, 2, 10),
                "display_order": 3,
                "overview": (
                    "Retail traders and beginners face fragmented tools, unstructured learning material, a steep chart pattern learning curve, and overly noisy TradingView indicators that clutter charts with conflicting signals. "
                    "TradeLab solves this by unifying an 8-milestone trading curriculum, real-time TradingView charting hubs (Crypto, Forex, Indian Equities), computer vision chart pattern analysis (YOLOv5), a clean low-noise Pine Script algorithmic indicator suite, and live market news into a single, cohesive dark fintech command center."
                ),
                "what_i_built": (
                    "Architected and built the full-stack Django web platform featuring modular multi-market routing and dynamic TradingView widget embedding. "
                    "Designed a comprehensive 8-milestone educational roadmap with detailed technical analysis modules. "
                    "Integrated a custom-trained YOLOv5 computer vision model (20 chart pattern classes) for screenshot-based pattern detection. "
                    "Implemented live RSS news parsing via feedparser, global market session timing dashboards, and custom Pine Script v5 algorithmic indicator scripts."
                ),
                "key_features": (
                    "- 8-Milestone Structured Trader Learning Curriculum (Fundamentals to Advanced Risk Management)\n"
                    "- Interactive Multi-Market Charting Hubs for Crypto (24/7), Forex (24/5), and Indian Equities (NSE/BSE)\n"
                    "- AI Chart Pattern Recognition pipeline powered by custom-trained YOLOv5 computer vision\n"
                    "- Production-ready Pine Script v5 algorithmic indicator suite (Triple EMA, ATR trailing stops, candle counters)\n"
                    "- Real-time global financial news feed integration using live RSS feeds\n"
                    "- Global market session timing breakdown with active volatility clocks\n"
                    "- Cyberpunk-fintech responsive user interface built for desktop and mobile devices"
                ),
                "challenges_learning": (
                    "Trained and structured a 20-class YOLOv5 object detection model on annotated financial chart datasets to identify complex formations like Head & Shoulders and Double Bottoms. "
                    "Designed an extensible Django routing and template hierarchy to support seamless switching across multi-asset charting hubs while maintaining high page responsiveness and client-side performance."
                ),
                "github_url": "https://github.com/parmeetsingh/tradelab",
                "live_url": "https://tradelab-analytics.com",
            },
        ]

        accent_colors = {
            "gaadimandi": (37, 99, 235),
            "tourcraze": (14, 165, 233),
            "tradelab": (16, 185, 129),
        }

        for p_data in projects_data:
            tech_slugs = p_data.pop("tech_slugs")
            slug = p_data["slug"]
            
            project, created = Project.objects.get_or_create(slug=slug, defaults=p_data)
            
            # Associate technologies
            for t_slug in tech_slugs:
                if t_slug in techs:
                    project.technologies.add(techs[t_slug])

            # Generate and attach mockup image if missing
            if not project.featured_image:
                color = accent_colors.get(slug, (99, 102, 241))
                buf = self.create_mockup_image(
                    title=project.title,
                    subtitle=project.tagline,
                    tag=project.category.name,
                    color_accent=color,
                    width=900,
                    height=520
                )
                filename = f"{slug}_banner.png"
                project.featured_image.save(filename, ContentFile(buf.getvalue()), save=True)

            # Generate gallery screenshots
            if project.gallery_images.count() == 0:
                for i in range(1, 3):
                    color = accent_colors.get(slug, (99, 102, 241))
                    buf = self.create_mockup_image(
                        title=f"{project.title} — Interface {i}",
                        subtitle=f"Module {i} View & Controls",
                        tag=f"Screen {i}",
                        color_accent=color,
                        width=700,
                        height=420
                    )
                    gal_img = ProjectImage(
                        project=project,
                        caption=f"{project.title} - Interface Module {i}",
                        display_order=i
                    )
                    gal_img.image.save(f"{slug}_screenshot_{i}.png", ContentFile(buf.getvalue()), save=True)

        self.stdout.write("  [OK] Projects and Mockups seeded")

    def seed_skills(self):
        skills_data = [
            ("Languages & Core", "languages", 1, [
                ("Python", "Primary Language & Scripts"),
                ("JavaScript", "Modern ES6+ UI"),
                ("SQL", "Relational Queries"),
                ("HTML5 & CSS3", "Semantic & Modern Layouts"),
            ]),
            ("Web & Full-Stack", "web-dev", 2, [
                ("Django", "MVC, ORM, Auth & Admin"),
                ("REST APIs", "Endpoints & Data Serialization"),
                ("Bootstrap 5", "Responsive Grids & Utilities"),
                ("PostgreSQL & SQLite", "Data Modeling & Indexing"),
            ]),
            ("Data & Analytics", "data-analytics", 3, [
                ("Pandas", "Data Wrangling & Transformation"),
                ("NumPy", "Vectorized Array Operations"),
                ("Scikit-Learn", "ML Modeling & Evaluation"),
                ("Exploratory Data Analysis", "Statistical Insights & Trends"),
                ("Matplotlib", "Data Visualization"),
            ]),
            ("Tools & Environment", "tools-devops", 4, [
                ("Git & GitHub", "Version Control & Collaboration"),
                ("Google Antigravity", "Development & Debugging"),
                ("Linux / Bash", "Command Line & Automation"),
                ("Virtual Environments", "Dependency Management"),
            ]),
        ]

        for cat_name, cat_slug, cat_order, skill_list in skills_data:
            cat, _ = SkillCategory.objects.get_or_create(slug=cat_slug, defaults={'name': cat_name, 'display_order': cat_order})
            for s_order, (s_name, s_note) in enumerate(skill_list, start=1):
                Skill.objects.get_or_create(category=cat, name=s_name, defaults={'note': s_note, 'display_order': s_order})

        self.stdout.write("  [OK] Skills Matrix seeded")

    def seed_experience(self):
        exp_data = [
            {
                "role": "Full-Stack Web Developer",
                "company": "Freelance & Client Projects",
                "location": "Remote",
                "employment_type": "freelance",
                "start_date": datetime.date(2024, 5, 1),
                "end_date": None,
                "is_current": True,
                "description": (
                    "- Architected and deployed dynamic database-driven web platforms using Django, Python, and JavaScript.\n"
                    "- Designed responsive user interfaces and optimized asset delivery for fast mobile page performance.\n"
                    "- Implemented relational data schemas, custom filter queries, and automated lead management systems."
                ),
                "display_order": 1,
            },
            {
                "role": "Software & Data Science Intern",
                "company": "Technical Training & Applied Project Internship",
                "location": "Punjab, India",
                "employment_type": "internship",
                "start_date": datetime.date(2023, 6, 1),
                "end_date": datetime.date(2023, 12, 1),
                "is_current": False,
                "description": (
                    "- Developed Python scripts for data cleaning, exploratory data analysis, and feature visualization.\n"
                    "- Built predictive classification models using Scikit-Learn to analyze customer behavior datasets.\n"
                    "- Collaborated on code reviews, Git version control workflows, and project documentation."
                ),
                "display_order": 2,
            },
        ]

        for exp in exp_data:
            Experience.objects.get_or_create(role=exp["role"], company=exp["company"], defaults=exp)

        self.stdout.write("  [OK] Experience seeded")

    def seed_education(self):
        edu_data = [
            {
                "institution": "Guru Nanak Dev University / Engineering College",
                "degree": "B.Tech in Computer Science and Engineering",
                "field_of_study": "Specialization in Artificial Intelligence & Data Science",
                "grade": "First Class",
                "period_text": "2021 - 2025",
                "description": (
                    "Comprehensive coursework in Data Structures & Algorithms, Database Management Systems, "
                    "Machine Learning, Operating Systems, Web Engineering, and Software Architecture."
                ),
                "display_order": 1,
            }
        ]

        for edu in edu_data:
            Education.objects.get_or_create(degree=edu["degree"], institution=edu["institution"], defaults=edu)

        self.stdout.write("  [OK] Education seeded")

    def seed_certifications(self):
        certs_data = [
            {
                "name": "Full-Stack Web Development with Python & Django",
                "issuer": "Udemy",
                "issue_date_text": "2024",
                "credential_url": "https://www.udemy.com/certificate/UC-PLACEHOLDER-01/",
                "credential_id": "CERT_01 — Udemy",
                "display_order": 1,
            },
            {
                "name": "Python for Data Science & Machine Learning Bootcamp",
                "issuer": "Udemy",
                "issue_date_text": "2024",
                "credential_url": "https://www.udemy.com/certificate/UC-PLACEHOLDER-02/",
                "credential_id": "CERT_02 — Udemy",
                "display_order": 2,
            },
            {
                "name": "Software Engineering & Database Architecture Foundations",
                "issuer": "Infosys Springboard",
                "issue_date_text": "2024",
                "credential_url": "https://infyspringboard.onwingspan.com",
                "credential_id": "CERT_03 — Infosys",
                "display_order": 3,
            },
        ]

        Certification.objects.all().delete()
        for cert in certs_data:
            Certification.objects.create(**cert)

        self.stdout.write("  [OK] Certifications seeded (2 Udemy, 1 Infosys)")

    def seed_services(self):
        services_data = [
            {
                "title": "Business Websites",
                "slug": "business-websites",
                "short_summary": "Modern, responsive websites tailored to establish credibility and convert visitors into clients.",
                "full_description": "Custom-designed web presence built with clean code, fast loading speeds, and SEO-friendly structure to showcase your brand.",
                "what_included": (
                    "- Custom responsive layout (mobile, tablet, desktop)\n"
                    "- Clean typography and curated visual identity\n"
                    "- Contact forms, WhatsApp inquiry integration, and map embed\n"
                    "- On-page SEO optimization & fast loading score\n"
                    "- Domain and hosting configuration"
                ),
                "who_its_for": "Small to medium businesses, consultants, agencies, and professional services.",
                "what_delivered": "Fully deployed, high-speed website with source code and admin management.",
                "icon": "layout",
                "display_order": 1,
            },
            {
                "title": "Landing Pages",
                "slug": "landing-pages",
                "short_summary": "High-conversion single-page experiences focused on generating leads and promoting products.",
                "full_description": "Strategically structured landing pages designed to clearly communicate your offer and drive visitor action.",
                "what_included": (
                    "- Compelling hero section with conversion-focused CTAs\n"
                    "- Feature highlights, social proof layout, and FAQs\n"
                    "- Form integration with email notifications\n"
                    "- Lightning-fast loading performance and mobile optimization"
                ),
                "who_its_for": "Product launches, marketing campaigns, freelancers, and event organizers.",
                "what_delivered": "Turnkey landing page ready for marketing traffic.",
                "icon": "layers",
                "display_order": 2,
            },
            {
                "title": "Website Redesign",
                "slug": "website-redesign",
                "short_summary": "Modernizing outdated websites to improve visual appeal, responsiveness, and performance.",
                "full_description": "Upgrade your legacy website with modern dark/light UI aesthetics, cleaner code, and improved user experience.",
                "what_included": (
                    "- Visual design overhaul and modern design system\n"
                    "- Code refactoring and mobile responsiveness fix\n"
                    "- Page speed and Core Web Vitals optimization\n"
                    "- Content re-structuring for enhanced clarity"
                ),
                "who_its_for": "Businesses with dated websites that look neglected or load slowly.",
                "what_delivered": "Refreshed, modernized website maintaining your existing content and SEO authority.",
                "icon": "refresh-cw",
                "display_order": 3,
            },
        ]

        created_count = 0
        for s_data in services_data:
            slug = s_data.pop("slug")
            service, created = Service.objects.update_or_create(
                slug=slug,
                defaults=s_data
            )
            if created:
                created_count += 1

        # Clean up obsolete services
        Service.objects.filter(slug__in=['web-applications', 'custom-digital-solutions']).delete()

        self.stdout.write(self.style.SUCCESS(f"  Services: {len(services_data)} synced ({created_count} created)"))

    def seed_resume(self):
        """Generates a clean PDF document for Parmeet Singh and saves to Resume model."""
        resume_doc, created = Resume.objects.get_or_create(
            title="Parmeet Singh — Resume (B.Tech AI & Data Science)",
            defaults={"is_active": True}
        )

        # Generate sample PDF bytes with standard PDF structure
        pdf_content = (
            b"%PDF-1.4\n"
            b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
            b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
            b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
            b"4 0 obj\n<< /Length 450 >>\nstream\n"
            b"BT\n/F1 20 Tf\n50 720 Td\n(PARMEET SINGH) Tj\n"
            b"/F1 12 Tf\n0 -25 Td\n(Computer Science Graduate - AI & Data Science) Tj\n"
            b"0 -20 Td\n(Email: contact@parmeetsingh.dev | Location: Punjab, India) Tj\n"
            b"0 -30 Td\n(SUMMARY:) Tj\n"
            b"0 -15 Td\n(Early-career technologist specializing in Python, Django, Web Apps & Data Analytics.) Tj\n"
            b"0 -30 Td\n(EDUCATION: B.Tech Computer Science (AI & Data Science) 2021-2025) Tj\n"
            b"0 -30 Td\n(PROJECTS: GaadiMandi, TourCraze, TradeLab) Tj\n"
            b"0 -30 Td\n(SKILLS: Python, Django, JavaScript, Pandas, NumPy, Scikit-Learn, SQL, Git) Tj\n"
            b"ET\nendstream\nendobj\n"
            b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n"
            b"xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000240 00000 n \n0000000742 00000 n \n"
            b"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n824\n%%EOF\n"
        )

        filename = "Parmeet_Singh_Resume.pdf"
        resume_doc.file.save(filename, ContentFile(pdf_content), save=True)
        self.stdout.write("  [OK] Resume PDF generated and registered")
