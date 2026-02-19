from django.urls import path
from . import views


urlpatterns = [
    path('get-videos/',views.get_all_videos, name='getAllVideos'),
    path('post/',views.post_vidos , name='postVidos'),
    path('delete/<int:pk>/', views.delete_video, name='delete-video'),
    path('my-videos/',views.get_user_videos, name='my-videos'),

    path('pending-videos/',views.get_unapproved_videos , name='unapprovedVideos'),
    path('approve/<int:pk>/', views.approve_video, name='approve-video'),
    path('reject/<int:pk>/', views.reject_video, name='reject-video'),
    
    path('add-favorites/<int:video_id>/',views.add_favorite,name="add-favorites"),
    path('remove-favorites/<int:video_id>/',views.remove_favorite,name="remove-favorites"),
    path('my-favorites/',views.get_my_favorites,name="my-favorites"),
   
]