from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import AnalysisSerializer
from .services import AnalysisService
from .pdf_parser import DocumentParser


# Create your views here.
class AnalysisAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = AnalysisSerializer(data=request.data)
        if serializer.is_valid():
            analysis = serializer.save(user=request.user)
            resume_text = DocumentParser.extract_text(analysis.resume_file.path)
            analysis.resume_text = resume_text
            result = AnalysisService.analyze_resume(
                resume_text, analysis.job_description
            )
            return Response(
                {"Analysis": AnalysisSerializer(analysis).data, "result": result},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
