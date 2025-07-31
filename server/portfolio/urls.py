from django.urls import path
from .views import work_list

urlpatterns = [
    path('api/works/', work_list, name='work-list'),
]