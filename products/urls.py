from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CategoriaViewSet, ImagenProductoViewSet, UserApprovalStatus

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'categorias', CategoriaViewSet)
router.register(r'imagenes', ImagenProductoViewSet)

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('docs/', include_docs_urls(title='Productos API')),
    path('api/v1/user/approved/', UserApprovalStatus.as_view(), name='user_approval_status'),
]