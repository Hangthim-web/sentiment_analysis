# urls.py
from django.urls import path
from .views import UserRegistrationView, UserLoginView, sentiment_bow_naive, sentiment_bow_logistic, \
    sentiment_bow_random, sentiment_bow_svm, sentiment_tfidf_naive, sentiment_tfidf_logistic, sentiment_tfidf_random, \
    sentiment_tfidf_svm, custom_logout

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('sentiment_bow_naive/', sentiment_bow_naive, name='sentiment_bow_naive'),
    path('sentiment_bow_logistic/', sentiment_bow_logistic, name='sentiment_bow_logistic'),
    path('sentiment_bow_random/', sentiment_bow_random, name='sentiment_bow_random'),
    path('sentiment_bow_svm/', sentiment_bow_svm, name='sentiment_bow_svm'),
    path('logout/', custom_logout, name='custom_logout'),
    path('sentiment_tfidf_naive/', sentiment_tfidf_naive, name='sentiment_tfidf_naive'),
    path('sentiment_tfidf_logistic/', sentiment_tfidf_logistic, name='sentiment_tfidf_logistic'),
    path('sentiment_tfidf_random/', sentiment_tfidf_random, name='sentiment_tfidf_random'),
    path('sentiment_tfidf_svm/', sentiment_tfidf_svm, name='sentiment_tfidf_svm'),
    # path('sentiment_word2vec_logistic/', sentiment_word2vec_logistic, name='sentiment_word2vec_logistic'),
    # path('sentiment_word2vec_random/', sentiment_word2vec_random, name='sentiment_word2vec_random'),
    # path('sentiment_word  2vec_svm/', sentiment_word2vec_svm, name='sentiment_word2vec_svm'),
]