from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializer import ProductoSerializer, ProductoLiteSerializer, ImagenProductoSerializer, CategoriaSerializer
from .models import Producto, Categoria, ImagenProducto, Profile



class ProductoPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Permitir el acceso a todos los usuarios, autenticados o no, para leer (GET)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Para otros métodos, verificar si el usuario está autenticado y aprobado
        if request.user.is_authenticated:
            profile = Profile.objects.get(user=request.user)
            return profile.approved
        return False
    


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [ProductoPermission]

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return ProductoSerializer
        else:
            return ProductoLiteSerializer

    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        if self.request.user.is_authenticated and profile.approved:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def perform_update(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        if self.request.user.is_authenticated and profile.approved:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def perform_destroy(self, instance):
        profile = Profile.objects.get(user=self.request.user)
        if self.request.user.is_authenticated and profile.approved:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer



class ImagenProductoViewSet(viewsets.ModelViewSet):
    queryset = ImagenProducto.objects.all()
    serializer_class = ImagenProductoSerializer

    def perform_create(self, serializer):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


class UserApprovalStatus(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtiene el perfil asociado al usuario actual
        try:
            profile = Profile.objects.get(user=request.user)
            return Response({'approved': profile.approved})
        except Profile.DoesNotExist:
            return Response({'error': 'El perfil no está asociado al usuario'}, status=status.HTTP_404_NOT_FOUND)