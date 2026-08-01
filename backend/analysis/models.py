from django.db import models
from django.conf import settings


# Create your models here.
class Analysis(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="analyses"
    )
    resume_file = models.FileField(upload_to="resumes/")

    resume_text = models.TextField(blank=True)

    job_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis {self.id} = {self.user.username}"
