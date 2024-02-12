from rest_framework import serializers
from .models import Producto, Categoria, ImagenProducto



class ImagenProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenProducto
        fields = ('producto', 'imagen',)



class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    imagenes = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = ('id', 'nombre', 'estado', 'categoria', 'categoria_nombre', 'imagenes')

    def get_imagenes(self, obj):
        imagenes = ImagenProducto.objects.filter(producto=obj)
        return [imagen.imagen.url for imagen in imagenes]



class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ('id', 'nombre')