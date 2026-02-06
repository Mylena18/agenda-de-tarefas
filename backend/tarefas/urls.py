from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import TarefaViewSet, register, login, me

router = DefaultRouter()
router.register('tarefas', TarefaViewSet, basename='tarefa')

urlpatterns = [
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/me/', me, name='me'),
] + router.urls
