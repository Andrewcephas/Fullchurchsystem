"""
Church Management System - Django Serializers
REST API serializers for all models
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import (
    Branch, Member, UserRole, Attendance, AttendanceMember, Finance, Event,
    Sermon, SundaySchool, SundaySchoolMember, SundaySchoolAttendance, Notice, PrayerRequest,
    Communication, MemberTransfer, NotificationPreference, NotificationSent,
    BackupLog, DataAccessLog, PrivateMessage, SiteSettings, SocialQuote, LoginActivity
)


class UserSerializer(serializers.ModelSerializer):
    """User serializer with role and branch information"""
    role = serializers.SerializerMethodField()
    branch = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'role', 'branch']
        read_only_fields = ['id']

    def get_role(self, obj):
        try:
            user_role = obj.role
            return user_role.role
        except:
            return None

    def get_branch(self, obj):
        try:
            user_role = obj.role
            if user_role.branch:
                return user_role.branch.branch_name
            return None
        except:
            return None


class BranchSerializer(serializers.ModelSerializer):
    """Branch serializer"""
    class Meta:
        model = Branch
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class MemberSerializer(serializers.ModelSerializer):
    """Member serializer with all profile details"""
    branch = serializers.PrimaryKeyRelatedField(read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch',
        queryset=Branch.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )
    
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
    branch = serializers.PrimaryKeyRelatedField(read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch',
        queryset=Branch.objects.all(),
        write_only=True
    )
    members = AttendanceMemberSerializer(many=True, read_only=True, source='members.all')
    
    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class FinanceSerializer(serializers.ModelSerializer):
    """Finance serializer"""
    branch = serializers.PrimaryKeyRelatedField(read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch',
        queryset=Branch.objects.all(),
        write_only=True
    )
    approved_by_email = serializers.CharField(source='approved_by.email', read_only=True)
    
    class Meta:
        model = Finance
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class EventSerializer(serializers.ModelSerializer):
    """Event serializer"""
    branch = serializers.PrimaryKeyRelatedField(read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch',
        queryset=Branch.objects.all(),
        write_only=True
    )
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    date = serializers.DateTimeField(source='event_date', read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SermonSerializer(serializers.ModelSerializer):
    """Sermon serializer"""
    branch = serializers.PrimaryKeyRelatedField(read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch',
        queryset=Branch.objects.all(),
        write_only=True
    )
    
    class Meta:
        model = Sermon
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SundaySchoolSerializer(serializers.ModelSerializer):
    """Sunday School serializer"""
    branch = serializers.PrimaryKeyRelatedField(read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch',
        queryset=Branch.objects.all(),
        write_only=True
    )
    teacher_name = serializers.CharField(source='class_teacher.get_full_name', read_only=True)
    
    class Meta:
        model = SundaySchool
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SundaySchoolMemberSerializer(serializers.ModelSerializer):
    """Sunday School enrollment serializer"""
    class_name = serializers.CharField(source='sunday_school_class.class_name', read_only=True)
    member_name = serializers.CharField(source='member.name', read_only=True)
    member_id = serializers.UUIDField(source='member.id', read_only=True)
    
    class Meta:
        model = SundaySchoolMember
        fields = '__all__'
        read_only_fields = ['id', 'enrolled_at']


class SundaySchoolAttendanceSerializer(serializers.ModelSerializer):
    """Sunday School attendance serializer"""
    class_name = serializers.CharField(source='sunday_school_class.class_name', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = SundaySchoolAttendance
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class NoticeSerializer(serializers.ModelSerializer):
    """Notice serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True, allow_null=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch',
        queryset=Branch.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Notice
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class PrayerRequestSerializer(serializers.ModelSerializer):
    """Prayer request serializer"""
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch',
        queryset=Branch.objects.all(),
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = PrayerRequest
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class CommunicationSerializer(serializers.ModelSerializer):
    """Communication serializer"""
    branch = serializers.PrimaryKeyRelatedField(read_only=True)
    branch_name = serializers.CharField(source='branch.branch_name', read_only=True)
    branch_id = serializers.PrimaryKeyRelatedField(
        source='branch',
        queryset=Branch.objects.all(),
        write_only=True
    )
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Communication
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'title', 'created_by']
        extra_kwargs = {
            'title': {'required': False},
            'message': {'required': True}
        }


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
    receiver_id = serializers.PrimaryKeyRelatedField(
        source='receiver',
        queryset=User.objects.all(),
        write_only=True
    )
    
    class Meta:
        model = PrivateMessage
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'sender']
        extra_kwargs = {
            'subject': {'required': False},
            'message': {'required': True}
        }
    
    def create(self, validated_data):
        # Auto-generate subject from message if not provided
        message = validated_data.get('message', '')
        if 'subject' not in validated_data or not validated_data.get('subject'):
            validated_data['subject'] = message[:50] + ('...' if len(message) > 50 else '')
        return super().create(validated_data)


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Site settings serializer"""
    class Meta:
        model = SiteSettings
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SocialQuoteSerializer(serializers.ModelSerializer):
    """Social quote serializer"""
    class Meta:
        model = SocialQuote
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'usage_count']


class LoginActivitySerializer(serializers.ModelSerializer):
    """Login activity serializer"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = LoginActivity
        fields = '__all__'
        read_only_fields = ['id', 'login_at']


class MemberTransferSerializer(serializers.ModelSerializer):
    """Member transfer serializer"""
    from_branch_name = serializers.CharField(source='from_branch.branch_name', read_only=True)
    to_branch_name = serializers.CharField(source='to_branch.branch_name', read_only=True)
    member_name = serializers.CharField(source='member.name', read_only=True)
    approved_by_email = serializers.CharField(source='approved_by.email', read_only=True)
    
    class Meta:
        model = MemberTransfer
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'approved_by']


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Notification preference serializer"""
    class Meta:
        model = NotificationPreference
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
