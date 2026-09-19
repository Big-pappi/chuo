from rest_framework import serializers
from core.models import Book, BorrowRecord


class BookSerializer(serializers.ModelSerializer):
    """Serializer for Book model."""
    
    university_name = serializers.CharField(source='university.name', read_only=True)
    
    class Meta:
        model = Book
        fields = [
            'id',
            'university',
            'university_name',
            'isbn',
            'title',
            'author',
            'category',
            'publisher',
            'year',
            'total_copies',
            'available_copies',
            'location',
            'cover_image',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BorrowRecordSerializer(serializers.ModelSerializer):
    """Serializer for BorrowRecord model."""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_isbn = serializers.CharField(source='book.isbn', read_only=True)
    
    class Meta:
        model = BorrowRecord
        fields = [
            'id',
            'book',
            'book_title',
            'book_isbn',
            'user',
            'user_email',
            'user_name',
            'borrow_date',
            'due_date',
            'return_date',
            'status',
            'fine',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
