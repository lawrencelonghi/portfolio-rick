# Generated manually to finalize migration

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0005_migrate_campaign_data'),
    ]

    operations = [
        # 1. Remover o campo antigo 'campaign' (CharField)
        migrations.RemoveField(
            model_name='work',
            name='campaign',
        ),
        
        # 2. Renomear 'campaign_fk' para 'campaign'
        migrations.RenameField(
            model_name='work',
            old_name='campaign_fk',
            new_name='campaign',
        ),
        
        # 3. Tornar o campo obrigatório
        migrations.AlterField(
            model_name='work',
            name='campaign',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='works', to='portfolio.campaign', verbose_name='Campanha'),
        ),
        
        # 4. Atualizar Meta do Work
        migrations.AlterModelOptions(
            name='work',
            options={'ordering': ['order'], 'verbose_name': 'Trabalho', 'verbose_name_plural': 'Trabalhos'},
        ),
    ]