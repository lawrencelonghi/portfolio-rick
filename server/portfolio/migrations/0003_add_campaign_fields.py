# Generated manually for campaign grouping feature

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0002_remove_work_image_work_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='work',
            name='campaign',
            field=models.CharField(default='Sem Campanha', help_text='Nome da campanha para agrupar imagens', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='work',
            name='is_cover',
            field=models.BooleanField(default=False, help_text='Imagem de capa da campanha (aparece na home)'),
        ),
        migrations.AddField(
            model_name='work',
            name='order',
            field=models.IntegerField(default=0, help_text='Ordem de exibição (menor aparece primeiro)'),
        ),
        migrations.AlterModelOptions(
            name='work',
            options={'ordering': ['campaign', 'order']},
        ),
    ]