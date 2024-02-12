from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from .serializer import ProductoSerializer, ImagenProductoSerializer, CategoriaSerializer
from .models import Producto, Categoria, ImagenProducto



class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def perform_create(self, serializer):
        # Guardar el producto
        producto = serializer.save()

        # Verificar si hay imágenes en la solicitud
        imagenes = self.request.FILES.getlist('imagenes')

        # Guardar cada imagen asociada al producto
        for imagen in imagenes:
            ImagenProducto.objects.create(producto=producto, imagen=imagen)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer



class ImagenProductoViewSet(viewsets.ModelViewSet):
    queryset = ImagenProducto.objects.all()
    serializer_class = ImagenProductoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)