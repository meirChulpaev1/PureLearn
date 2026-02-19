from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Video(models.Model):
    class ListCategories(models.TextChoices):
        MATH = 'MATH', 'Mathematics'
        SCIENCE = 'SCIENCE', 'Science'
        HISTORY = 'HISTORY', 'History'
        LANGUAGES = 'LANGUAGES', 'Languages'
        COMPUTERS = 'COMPUTERS', 'Computers'
        OTHER = 'OTHER', 'Other'
    title = models.CharField(max_length=100)
    url = models.URLField(max_length=500)
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='videos')
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(
        max_length=20,
        choices=ListCategories.choices,
        default=ListCategories.OTHER
    )
    def __str__(self):
        return  self.title
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
            unique_together = ('user', 'video')
    def __str__(self):
        return f"{self.user.username} -> {self.video.title}"