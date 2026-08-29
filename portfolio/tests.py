from django.test import TestCase, Client
from django.urls import reverse
from .models import Profile, Project, ProjectCategory, Technology, Service, Resume, ContactMessage


class PortfolioTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.category = ProjectCategory.objects.create(name="Full Stack", slug="full-stack")
        self.tech = Technology.objects.create(name="Django", slug="django", category="backend")
        
        self.project = Project.objects.create(
            title="GaadiMandi",
            slug="gaadimandi",
            tagline="Automotive dealer platform",
            category=self.category,
            overview="Solves vehicle dealer workflow.",
            what_i_built="Architected backend in Django.",
            key_features="- Dynamic search\n- Dealer dashboard",
            challenges_learning="Optimized queries.",
            is_featured=True
        )
        self.project.technologies.add(self.tech)

        self.service = Service.objects.create(
            title="Business Websites",
            slug="business-websites",
            short_summary="Custom websites",
            full_description="Full description",
            what_included="- Feature 1\n- Feature 2",
            who_its_for="Businesses",
            what_delivered="Live site",
            icon="layout"
        )

        self.profile = Profile.objects.create(
            name="Parmeet Singh",
            headline="Building digital products",
            subheadline="Computer Science Graduate",
            email="contact@parmeetsingh.dev"
        )

    def test_home_page_status(self):
        response = self.client.get(reverse('portfolio:home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Parmeet Singh")
        self.assertContains(response, "GaadiMandi")
        self.assertContains(response, "What I'm Exploring")

    def test_work_page_status_and_filter(self):
        response = self.client.get(reverse('portfolio:work'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "GaadiMandi")

        # Category filter
        response_filtered = self.client.get(reverse('portfolio:work') + '?category=full-stack')
        self.assertEqual(response_filtered.status_code, 200)
        self.assertContains(response_filtered, "GaadiMandi")

    def test_project_detail_page(self):
        response = self.client.get(reverse('portfolio:project_detail', kwargs={'slug': 'gaadimandi'}))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "GaadiMandi")
        self.assertContains(response, "Back to All Projects")
        self.assertContains(response, "What I Built &amp; Architecture")

    def test_about_page(self):
        response = self.client.get(reverse('portfolio:about'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "About Parmeet Singh")
        self.assertContains(response, "Technical Skill Matrix")

    def test_services_page(self):
        response = self.client.get(reverse('portfolio:services'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Business Websites")
        self.assertContains(response, "The Development Process")

    def test_resume_page(self):
        response = self.client.get(reverse('portfolio:resume'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Resume &amp; Qualifications")
        self.assertContains(response, "Download Resume PDF")

    def test_contact_form_submission(self):
        post_data = {
            'name': 'Hiring Manager',
            'email': 'recruiter@techcompany.com',
            'subject': 'Engineering Role Opportunity',
            'message': 'We would like to invite you for an interview regarding our software engineering role.',
            'bot_field': ''  # honeypot must be blank
        }
        response = self.client.post(reverse('portfolio:contact'), post_data, follow=True)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Thank you, Hiring Manager! Your message has been sent successfully.")
        
        # Verify message stored in DB
        self.assertTrue(ContactMessage.objects.filter(email='recruiter@techcompany.com').exists())

    def test_contact_honeypot_blocking(self):
        spam_data = {
            'name': 'Spam Bot',
            'email': 'bot@spam.com',
            'subject': 'Spam subject',
            'message': 'Buy cheap sunglasses',
            'bot_field': 'I am a bot'  # Filled by spam bot
        }
        response = self.client.post(reverse('portfolio:contact'), spam_data, follow=True)
        self.assertFalse(ContactMessage.objects.filter(email='bot@spam.com').exists())
