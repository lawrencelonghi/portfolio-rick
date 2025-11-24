# Generated manually to migrate data

from django.db import migrations


def migrate_campaigns(apps, schema_editor):
    Work = apps.get_model('portfolio', 'Work')
    Campaign = apps.get_model('portfolio', 'Campaign')
    
    # Pegar todos os nomes únicos de campanhas
    campaign_names = Work.objects.values_list('campaign', flat=True).distinct()
    
    # Criar objetos Campaign
    for name in campaign_names:
        if name:  # Ignorar vazios
            Campaign.objects.get_or_create(name=name)
    
    # Linkar Works às Campaigns
    for work in Work.objects.all():
        if work.campaign:
            campaign_obj = Campaign.objects.get(name=work.campaign)
            work.campaign_fk = campaign_obj
            work.save()


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio', '0004_create_campaign_model'),
    ]

    operations = [
        migrations.RunPython(migrate_campaigns, migrations.RunPython.noop),
    ]