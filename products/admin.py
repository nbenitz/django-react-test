from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Producto, Categoria, Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False



class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'get_approved')

    def get_approved(self, obj):
        return obj.profile.approved if hasattr(obj, 'profile') else None

    get_approved.short_description = 'Aprobado'

    list_display_links = ['username']
    list_filter = ['is_staff', 'is_superuser']
    search_fields = ['username', 'email', 'first_name', 'last_name']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

admin.site.register(Producto)
admin.site.register(Categoria)

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)



