# Generated manually

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tarefas', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='tarefa',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='tarefa',
            name='data_agendada',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tarefa',
            name='hora_agendada',
            field=models.TimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='tarefa',
            name='atualizada_em',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterModelOptions(
            name='tarefa',
            options={'ordering': ['-criada_em']},
        ),
    ]
