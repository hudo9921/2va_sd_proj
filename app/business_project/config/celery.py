import os
from celery import Celery
from celery.schedules import crontab


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('business_logic')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.broker_url = 'redis://redis:6379'
app.conf.beat_schedule = {
    'order_manager': {
        'task': 'business_logic.tasks.order_manager',
        'schedule': 10.0,
    },
}

