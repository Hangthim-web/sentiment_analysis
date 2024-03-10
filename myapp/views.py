
import json

from django.contrib.auth import logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .sentiment_algorithms.BoW_Logistic import analyze_sentiment_using_BoW_logistic
from .sentiment_algorithms.BoW_Multinomail import analyze_sentiment_using_BoW_and_NB
from .sentiment_algorithms.BoW_RandomForest import analyze_sentiment_using_BoW_and_RF
from .sentiment_algorithms.BoW_SVM import analyze_sentiment_using_BoW_and_SVM
from .sentiment_algorithms.tdfidf_logistic import analyze_sentiment_using_TFIDF_and_LogisticRegression
from .sentiment_algorithms.tdfidf_multinomail import analyze_sentiment_using_TFIDF_and_NB
from .sentiment_algorithms.tdfidf_random import analyze_sentiment_using_TFIDF_and_RandomForest
from .sentiment_algorithms.tdfidf_svm import analyze_sentiment_using_TFIDF_and_SVM
# from .sentiment_algorithms.word2vec_SVM import analyze_sentiment_using_Word2Vec_and_SVM
# from .sentiment_algorithms.word2vec_logistic import analyze_sentiment_using_Word2Vec_and_LogisticRegression
# from .sentiment_algorithms.word2vec_random import analyze_sentiment_using_Word2Vec_and_RandomForest
from .serializers import UserSerializer, UserLoginSerializer


@csrf_exempt
def sentiment_bow_naive(request):
    return analyze_sentiment(request, analyze_sentiment_using_BoW_and_NB)

@csrf_exempt
def sentiment_bow_logistic(request):
    return analyze_sentiment(request, analyze_sentiment_using_BoW_logistic)

@csrf_exempt
def sentiment_bow_random(request):
    return analyze_sentiment(request, analyze_sentiment_using_BoW_and_RF)

@csrf_exempt
def sentiment_bow_svm(request):
    return analyze_sentiment(request, analyze_sentiment_using_BoW_and_SVM)

@csrf_exempt
def sentiment_tfidf_naive(request):
    return analyze_sentiment(request, analyze_sentiment_using_TFIDF_and_NB)
@csrf_exempt
def sentiment_tfidf_logistic(request):
    return analyze_sentiment(request, analyze_sentiment_using_TFIDF_and_LogisticRegression)
@csrf_exempt
def sentiment_tfidf_random(request):
    return analyze_sentiment(request, analyze_sentiment_using_TFIDF_and_RandomForest)
@csrf_exempt
def sentiment_tfidf_svm(request):
    return analyze_sentiment(request, analyze_sentiment_using_TFIDF_and_SVM)

@csrf_exempt
def custom_logout(request):
    logout(request)
    return JsonResponse({"message": "Logout successful"})
# @csrf_exempt  # Add this decorator
# def sentiment_word2vec_logistic(request):
#     return analyze_sentiment(request, analyze_sentiment_using_Word2Vec_and_LogisticRegression)
# @csrf_exempt  # Add this decorator
# def sentiment_word2vec_random(request):
#     return analyze_sentiment(request, analyze_sentiment_using_Word2Vec_and_RandomForest)
# @csrf_exempt  # Add this decorator
# def sentiment_word2vec_svm(request):
#     return analyze_sentiment(request, analyze_sentiment_using_Word2Vec_and_SVM)
# @login_required(login_url='/api/login/')


@csrf_exempt
def analyze_sentiment(request, sentiment_function):
    print(f"User Authenticated: {request.user.is_authenticated}")
    print(f"Authorization Header: {request.headers.get('Authorization')}")
    print(f"Request Method: {request.method}")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_input = data.get('user_input', '')
            print(f"Received user input: {user_input}")  # Add this line to print user input
            result = sentiment_function(request = request,user_input=user_input)
            return JsonResponse(result)

        except Exception as e:
            print(f"Error during sentiment analysis: {str(e)}")  # Add this line to print exceptions
            return JsonResponse({'error': 'An error occurred during sentiment analysis'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class UserLoginView(generics.CreateAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']


        print(f"Attempting to log in user: {user.username}")
        print(f"Password provided: {serializer.validated_data['password']}")
        print(f"User authenticated: {user.is_authenticated}")

        refresh = RefreshToken.for_user(user)
        data = {'refresh': str(refresh), 'access': str(refresh.access_token)}
        return Response(data, status=status.HTTP_200_OK)