import pandas as pd
from django.http import request
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer, PorterStemmer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split



file_path = r'F:\Datasets\twitter_validation.csv'

def preprocess_text(text):
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    stemmer = PorterStemmer()

    words = word_tokenize(text)
    words = [word.lower() for word in words if word.isalpha() and word.lower() not in stop_words]
    words = [lemmatizer.lemmatize(word) for word in words]
    words = [stemmer.stem(word) for word in words]

    return ' '.join(words)

def analyze_sentiment_using_BoW_logistic(request,user_input):
    try:

        df = pd.read_csv(file_path, usecols=['Sentiment', 'Text'], encoding='utf-8', header=0, names=['ID', 'Game', 'Sentiment', 'Text'])
        df['Text'].fillna("", inplace=True)
        sentiment_mapping = {'Positive': 1, 'Negative': 0, 'Neutral': 2}
        df['sentiment'] = df['Sentiment'].map(sentiment_mapping)
        df = df.dropna(subset=['sentiment'])

        if len(df) < 2:
            raise ValueError("Insufficient data for train-test split. Please check the dataset.")

        df['Text'] = df['Text'].apply(preprocess_text)

        X_train, X_test, y_train, y_test = train_test_split(df['Text'], df['sentiment'], test_size=0.2, random_state=42)
        bow_vectorizer = CountVectorizer()
        X_train_bow = bow_vectorizer.fit_transform(X_train.values.astype('U'))
        X_test_bow = bow_vectorizer.transform(X_test.values.astype('U'))


        model = LogisticRegression(multi_class='multinomial', max_iter=500, random_state=42)

        model.fit(X_train_bow, y_train)

        user_input_processed = preprocess_text(user_input)

        input_bow = bow_vectorizer.transform([user_input_processed])
        prediction_probabilities = model.predict_proba(input_bow)[0]
        probability_negative = prediction_probabilities[sentiment_mapping['Negative']]
        probability_neutral = prediction_probabilities[sentiment_mapping['Neutral']]
        probability_positive = prediction_probabilities[sentiment_mapping['Positive']]
        max_sentiment_index = prediction_probabilities.argmax()
        predicted_sentiment = next((key for key, value in sentiment_mapping.items() if value == max_sentiment_index), 'Unknown')

        print(f"Predicted Sentiment ({model.__class__.__name__}): {predicted_sentiment}")
        print(f"Probability of Negative Sentiment: {probability_negative:.2%}")
        print(f"Probability of Neutral Sentiment: {probability_neutral:.2%}")
        print(f"Probability of Positive Sentiment: {probability_positive:.2%}")

        y_pred = model.predict(X_test_bow)

        print("Classification Report:")
        print(classification_report(y_test, y_pred))

        overall_accuracy = accuracy_score(y_test, y_pred)
        print(f"Overall Accuracy: {overall_accuracy:.2%}")

        result = {
            'predicted_sentiment': predicted_sentiment,
            'probability_negative': probability_negative,
            'probability_neutral': probability_neutral,
            'probability_positive': probability_positive,
            'classification_report': classification_report(y_test, y_pred,output_dict=True),
            'overall_accuracy': overall_accuracy * 100,
        }
        probability_percentage = probability_negative * 100




        return result

    except Exception as e:
        print("Error:", str(e))
        return {'error': 'An error occurred during sentiment analysis'}


user_input = "User input from frontend"


result = analyze_sentiment_using_BoW_logistic(request,user_input)
print("\n" + "=" * 50 + "\n")
