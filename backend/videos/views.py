
from .models import Video,Favorite
from .serializers import VideoSerializer,FavoriteSerializer
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_videos(request):
    print(request.user)
    all_videos = Video.objects.filter(is_approved=True)
    if not all_videos.exists():
        return Response({'message':'Videos not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = VideoSerializer(all_videos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_vidos(request):
    new_video = request.data
    serializer = VideoSerializer(data=new_video)
    if serializer.is_valid():
        serializer.save(uploader=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_video(request, pk):
    video = get_object_or_404(Video, pk=pk)
    if not request.user==video.uploader:
        return Response({'error': 'You can only delete your videos!'}, status=status.HTTP_403_FORBIDDEN)
    video_title = video.title
    video.delete()
    return Response({'message': f'your video "{video_title}" deleted.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_videos(request):
    my_videos = Video.objects.filter(uploader=request.user)
    if not my_videos.exists():
        return Response({'message':'your videos not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = VideoSerializer(my_videos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)




#-----------------------------------------------------------------------------------------------------------------




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unapproved_videos(request):
    if not request.user.is_staff:
        return Response({'error': 'Only admins can unapproved videos'}, status=status.HTTP_403_FORBIDDEN)
    unapproved_videos=Video.objects.filter(is_approved=False)
    serializer = VideoSerializer(unapproved_videos, many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_video(request, pk):
    if not request.user.is_staff:
        return Response({'error': 'Only admins can approve videos'}, status=status.HTTP_403_FORBIDDEN)
    video = get_object_or_404(Video, pk=pk)
    video.is_approved = True
    video.save()
    return Response({'message': f'Video "{video.title}" is now approved!'}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def reject_video(request, pk):
    if not request.user.is_staff:
        return Response({'error': 'Admins only'}, status=status.HTTP_403_FORBIDDEN)
    
    video = get_object_or_404(Video, pk=pk)
    video_title = video.title
    video.delete()
    
    return Response({'message': f'Video "{video_title}" deleted.'}, status=status.HTTP_200_OK)



#-----------------------------------------------------------------------------------------------------------------




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_favorites(request):
    favorites = Favorite.objects.filter(user=request.user).order_by('-created_at')
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorite(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    created = Favorite.objects.filter(user=request.user, video=video).exists()
    if created:
        return Response({'message': 'The video is already in your favorites'}, status=status.HTTP_200_OK)
    else:
        Favorite.objects.create(user=request.user, video=video)
        return Response({'message': 'added to your favorites'}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_favorite(request, video_id):
    video = get_object_or_404(Video, id=video_id)
    favorite = Favorite.objects.filter(user=request.user, video=video)
    if favorite.exists():
        favorite.delete()
        return Response({'message': 'Removed from favorites'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Video not found in favorites'}, status=status.HTTP_404_NOT_FOUND)