# Generated manually for Campaign model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0003_add_campaign_fields'),
    ]

    operations = [
        # 1. Criar o modelo Campaign
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='Nome da Campanha')),
                ('order', models.IntegerField(default=0, help_text='Ordem de exibição na home (menor aparece primeiro)')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Campanha',
                'verbose_name_plural': 'Campanhas',
                'ordering': ['order', '-created_at'],
            },
        ),
        
        # 2. Adicionar campo temporário nullable para campaign FK
        migrations.AddField(
            model_name='work',
            name='campaign_fk',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='works', to='portfolio.campaign', verbose_name='Campanha'),
        ),
    ]