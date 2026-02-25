from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Tarefa

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class TarefaSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Tarefa
        fields = ['id', 'user', 'titulo', 'descricao', 'data_agendada', 'hora_agendada', 'alarme_ativo', 'concluida', 'criada_em', 'atualizada_em']
        read_only_fields = ['id', 'criada_em', 'atualizada_em']
