from rest_framework import serializers
from .models import Video
from .models import Favorite

class VideoSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    uploader = serializers.ReadOnlyField(source='uploader.username')
    class Meta:
        model = Video
        fields = ['id', 'title', 'url', 'category', 'category_display', 'uploader', 'is_approved', 'created_at']
        read_only_fields = ['is_approved', 'uploader', 'created_at']
        
class FavoriteSerializer(serializers.ModelSerializer):
    video = VideoSerializer(read_only=True)
    class Meta:
        model = Favorite
        fields = ['id','user', 'video', 'created_at']
        read_only_fields = ['user', 'created_at']