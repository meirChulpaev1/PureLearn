from pathlib import Path
import re
import requests
from .models import Video, Favorite
from .serializers import VideoSerializer, FavoriteSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404

import os
from dotenv import load_dotenv
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Create your views here.


@api_view(["GET"])
@permission_classes([AllowAny])
def get_all_videos(request):
    print(request.user)
    all_videos = Video.objects.filter(is_approved=True)
    if not all_videos.exists():
        return Response(
            {"message": "Videos not found"}, status=status.HTTP_404_NOT_FOUND
        )
    serializer = VideoSerializer(all_videos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_vidos(request):
    new_video = request.data
    serializer = VideoSerializer(data=new_video)
    if serializer.is_valid():
        if request.user.is_staff:
            serializer.save(uploader=request.user,is_approved=True)
        else:
            serializer.save(uploader=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_video(request, pk):
    video = get_object_or_404(Video, pk=pk)
    if not request.user == video.uploader and request.user.is_staff == False :
        return Response(
            {"error": "You can only delete your videos!"},
            status=status.HTTP_403_FORBIDDEN,
        )
    video_title = video.title
    video.delete()
    return Response(
        {"message": f'your video "{video_title}" deleted.'}, status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_videos(request):
    my_videos = Video.objects.filter(uploader=request.user)
    if not my_videos.exists():
        return Response(
            {"message": "your videos not found"}, status=status.HTTP_404_NOT_FOUND
        )
    serializer = VideoSerializer(my_videos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# -----------------------------------------------------------------------------------------------------------------


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_unapproved_videos(request):
    if not request.user.is_staff:
        return Response(
            {"error": "Only admins can unapproved videos"},
            status=status.HTTP_403_FORBIDDEN,
        )
    unapproved_videos = Video.objects.filter(is_approved=False)
    serializer = VideoSerializer(unapproved_videos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_video(request, pk):
    if not request.user.is_staff:
        return Response(
            {"error": "Only admins can approve videos"},
            status=status.HTTP_403_FORBIDDEN,
        )
    video = get_object_or_404(Video, pk=pk)
    video.is_approved = True
    video.save()
    return Response(
        {"message": f'Video "{video.title}" is now approved!'},
        status=status.HTTP_200_OK,
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def reject_video(request, pk):
    if not request.user.is_staff:
        return Response({"error": "Admins only"}, status=status.HTTP_403_FORBIDDEN)

    video = get_object_or_404(Video, pk=pk)
    video_title = video.title
    video.delete()

    return Response(
        {"message": f'Video "{video_title}" deleted.'}, status=status.HTTP_200_OK
    )


# -----------------------------------------------------------------------------------------------------------------


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_my_favorites(request):
    favorites = Favorite.objects.filter(user=request.user).order_by("-created_at")
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_favorite(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    created = Favorite.objects.filter(user=request.user, video=video).exists()
    if created:
        return Response(
            {"message": "The video is already in your favorites"},
            status=status.HTTP_200_OK,
        )
    else:
        Favorite.objects.create(user=request.user, video=video)
        return Response(
            {"message": "added to your favorites"}, status=status.HTTP_201_CREATED
        )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_favorite(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    favorite = Favorite.objects.filter(user=request.user, video=video)
    if favorite.exists():
        favorite.delete()
        return Response(
            {"message": "Removed from favorites"}, status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"message": "Video not found in favorites"},
            status=status.HTTP_404_NOT_FOUND,
        )


# ----------------------------------------------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def get_video_category(request):
    video_url = request.data.get("url", "")
    regex = r'(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})'
    match = re.search(regex, video_url)
    video_id = match.group(1) if match else None
    if not video_id:
        return Response(False)
    api_key =os.getenv('DB_API_KEY')
    api_url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={video_id}&key={api_key}"
    try:
        response = requests.get(api_url)
        data = response.json()
        if "error" in data:
            print(f"YouTube API Error: {data['error']['message']}")
            return Response({"error": "API Key issue", "is_educational": False})
        if "items" in data and len(data["items"]) > 0:
            category_id = int(data["items"][0]["snippet"]["categoryId"])
            is_educational = category_id in [27, 26, 28,24]
            return Response({"is_educational":is_educational,"number":category_id})

        return Response({"is_educational": False, "message": "Video not found"})
    except Exception as e:
        print(f"Python Error: {e}")
        return Response(False)
