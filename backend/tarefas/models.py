from django.db import models
from django.contrib.auth.models import User

class Tarefa(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    titulo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    data_agendada = models.DateField(null=True, blank=True)
    hora_agendada = models.TimeField(null=True, blank=True)
    alarme_ativo = models.BooleanField(default=False)
    concluida = models.BooleanField(default=False)
    criada_em = models.DateTimeField(auto_now_add=True)
    atualizada_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-criada_em']

    def __str__(self):
        return self.titulo