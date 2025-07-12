from django.contrib import admin
from django.urls import path, include
from .health_check import health_check, detailed_health_check

urlpatterns = [
    path('admin/', admin.site.urls),

    # Health check endpoints
    path('health/', health_check, name='health-check'),
    path('health/detailed/', detailed_health_check, name='detailed-health-check'),

    # API endpoints
    path('api/accounts/', include('accounts.urls')),
    path('api/kikuu/', include('kikuu.urls')),
    path('api/store/', include('store.urls')),
    path('api/carts/', include('carts.urls')),
    path('api/orders/', include('orders.urls')),
]
