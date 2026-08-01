from django.urls import path
from .views import AnalysisAPIView

urlpatterns = [path("analyze/", AnalysisAPIView.as_view(), name="analyze")]
