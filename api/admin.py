"""
Church Management System - Django Admin Configuration
Register models for admin interface
"""

from django.contrib import admin
from api.models import (
    Branch, Member, UserRole, Attendance, AttendanceMember, Finance, Event,
    Sermon, SundaySchool, Notice, PrayerRequest, Communication, MemberTransfer,
    NotificationPreference, NotificationSent, BackupLog, DataAccessLog,
    PrivateMessage, SiteSettings
)


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ['branch_name', 'location', 'pastor_name', 'created_at']
    list_filter = ['created_at']
    search_fields = ['branch_name', 'location']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'branch', 'member_category', 'membership_status', 'phone']
    list_filter = ['branch', 'member_category', 'membership_status', 'created_at']
    search_fields = ['name', 'email', 'phone']
    readonly_fields = ['id', 'created_at', 'updated_at']
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'email', 'phone', 'gender', 'date_of_birth', 'address')
        }),
        ('Church Information', {
            'fields': ('branch', 'department', 'member_category', 'join_date', 'membership_status')
        }),
        ('Family Information', {
            'fields': ('spouse_name', 'spouse_phone', 'children_count')
        }),
        ('Professional & Health', {
            'fields': ('occupation', 'blood_type')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone')
        }),
        ('Additional', {
            'fields': ('ministry_interests', 'notes')
        }),
        ('System Fields', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'branch', 'created_at']
    list_filter = ['role', 'branch', 'created_at']
    search_fields = ['user__email', 'user__first_name']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['branch', 'service_date', 'service_type', 'count', 'online_count']
    list_filter = ['branch', 'service_type', 'service_date']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'service_date'


@admin.register(Finance)
class FinanceAdmin(admin.ModelAdmin):
    list_display = ['branch', 'date', 'category', 'amount', 'approval_status', 'is_anonymous']
    list_filter = ['branch', 'category', 'approval_status', 'date']
    search_fields = ['giver', 'notes']
    readonly_fields = ['id', 'created_at', 'updated_at']
    date_hierarchy = 'date'


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'branch', 'event_date', 'is_conference', 'created_by']
    list_filter = ['branch', 'is_conference', 'event_date']
    search_fields = ['title', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(Sermon)
class SermonAdmin(admin.ModelAdmin):
    list_display = ['title', 'branch', 'speaker', 'sermon_date']
    list_filter = ['branch', 'speaker', 'sermon_date']
    search_fields = ['title', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(SundaySchool)
class SundaySchoolAdmin(admin.ModelAdmin):
    list_display = ['class_name', 'branch', 'class_teacher', 'member_count']
    list_filter = ['branch']
    search_fields = ['class_name']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'branch', 'is_global', 'created_by', 'created_at']
    list_filter = ['is_global', 'branch', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(PrayerRequest)
class PrayerRequestAdmin(admin.ModelAdmin):
    list_display = ['name', 'branch', 'status', 'created_at']
    list_filter = ['branch', 'status', 'created_at']
    search_fields = ['name', 'email', 'phone']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(Communication)
class CommunicationAdmin(admin.ModelAdmin):
    list_display = ['title', 'branch', 'created_by', 'created_at']
    list_filter = ['branch', 'created_at']
    search_fields = ['title', 'message']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(MemberTransfer)
class MemberTransferAdmin(admin.ModelAdmin):
    list_display = ['member', 'from_branch', 'to_branch', 'status', 'transfer_date']
    list_filter = ['status', 'from_branch', 'to_branch', 'transfer_date']
    search_fields = ['member__name', 'reason']
    readonly_fields = ['id', 'transfer_date', 'created_at', 'updated_at']


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'branch', 'email_enabled', 'sms_enabled', 'push_enabled']
    list_filter = ['branch', 'email_enabled', 'sms_enabled']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(NotificationSent)
class NotificationSentAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification_type', 'channel', 'status', 'created_at']
    list_filter = ['channel', 'status', 'created_at']
    search_fields = ['user__email', 'title']
    readonly_fields = ['id', 'created_at']


@admin.register(BackupLog)
class BackupLogAdmin(admin.ModelAdmin):
    list_display = ['backup_type', 'status', 'started_at', 'initiated_by']
    list_filter = ['backup_type', 'status', 'started_at']
    readonly_fields = ['id', 'created_at']


@admin.register(DataAccessLog)
class DataAccessLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'operation', 'table_name', 'created_at']
    list_filter = ['operation', 'table_name', 'created_at']
    search_fields = ['user__email']
    readonly_fields = ['id', 'created_at']


@admin.register(PrivateMessage)
class PrivateMessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['sender__email', 'receiver__email', 'subject']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['key', 'updated_at']
    search_fields = ['key']
    readonly_fields = ['id', 'created_at', 'updated_at']
