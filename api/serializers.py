"""
Church Management System - Django Serializers
REST API serializers for all models
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import (
    Branch, Member, UserRole, Attendance, AttendanceMember, Finance, Event,
    Sermon, SundaySchool, Notice, PrayerRequest, Communication, MemberTransfer,
    NotificationPreference, NotificationSent, BackupLog, DataAccessLog,
    PrivateMessage, SiteSettings
)


class UserSerializer(serializers.ModelSerializer):
    """User serializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class BranchSerializer(serializers.ModelSerializer):
    """Branch serializer"""
    class Meta:
        model = Branch
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class MemberSerializer(serializers.ModelSerializer):
    """Member serializer with all profile details"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    
    class Meta:
        model = Member
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserRoleSerializer(serializers.ModelSerializer):
    """User role serializer"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    
    class Meta:
        model = UserRole
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class AttendanceMemberSerializer(serializers.ModelSerializer):
    """Individual attendance serializer"""
    member_name = serializers.CharField(source='member.name', read_only=True)
    
    class Meta:
        model = AttendanceMember
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class AttendanceSerializer(serializers.ModelSerializer):
    """Attendance serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    members = AttendanceMemberSerializer(many=True, read_only=True, source='members.all')
    
    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class FinanceSerializer(serializers.ModelSerializer):
    """Finance serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    approved_by_email = serializers.CharField(source='approved_by.email', read_only=True)
    
    class Meta:
        model = Finance
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class EventSerializer(serializers.ModelSerializer):
    """Event serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SermonSerializer(serializers.ModelSerializer):
    """Sermon serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    
    class Meta:
        model = Sermon
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SundaySchoolSerializer(serializers.ModelSerializer):
    """Sunday School serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    teacher_name = serializers.CharField(source='class_teacher.first_name', read_only=True)
    
    class Meta:
        model = SundaySchool
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class NoticeSerializer(serializers.ModelSerializer):
    """Notice serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True, allow_null=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Notice
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class PrayerRequestSerializer(serializers.ModelSerializer):
    """Prayer request serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    
    class Meta:
        model = PrayerRequest
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class CommunicationSerializer(serializers.ModelSerializer):
    """Communication serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Communication
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class MemberTransferSerializer(serializers.ModelSerializer):
    """Member transfer serializer"""
    member_name = serializers.CharField(source='member.name', read_only=True)
    from_branch_name = serializers.CharField(source='from_branch.branch_name', read_only=True)
    to_branch_name = serializers.CharField(source='to_branch.branch_name', read_only=True)
    approved_by_email = serializers.CharField(source='approved_by.email', read_only=True)
    
    class Meta:
        model = MemberTransfer
        fields = '__all__'
        read_only_fields = ['id', 'transfer_date', 'created_at', 'updated_at']


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Notification preference serializer"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    
    class Meta:
        model = NotificationPreference
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationSentSerializer(serializers.ModelSerializer):
    """Notification sent serializer"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    
    class Meta:
        model = NotificationSent
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class BackupLogSerializer(serializers.ModelSerializer):
    """Backup log serializer"""
    initiated_by_email = serializers.CharField(source='initiated_by.email', read_only=True)
    
    class Meta:
        model = BackupLog
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class DataAccessLogSerializer(serializers.ModelSerializer):
    """Data access log serializer"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = DataAccessLog
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class PrivateMessageSerializer(serializers.ModelSerializer):
    """Private message serializer"""
    sender_email = serializers.CharField(source='sender.email', read_only=True)
    receiver_email = serializers.CharField(source='receiver.email', read_only=True)
    
    class Meta:
        model = PrivateMessage
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Site settings serializer"""
    class Meta:
        model = SiteSettings
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
