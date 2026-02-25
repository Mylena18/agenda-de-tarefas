# Generated migration for adding alarme_ativo field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tarefas', '0002_add_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='tarefa',
            name='alarme_ativo',
            field=models.BooleanField(default=False),
        ),
    ]
