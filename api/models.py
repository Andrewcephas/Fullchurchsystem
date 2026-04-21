"""
Church Management System - Django Models
Database models for all church management entities
"""

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator
import uuid

class Branch(models.Model):
    """Church branch/location"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    pastor_name = models.CharField(max_length=255, null=True, blank=True)
    church_email = models.EmailField(null=True, blank=True)
    church_phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'branches'
        ordering = ['branch_name']

    def __str__(self):
        return self.branch_name


class Member(models.Model):
    """Church member with comprehensive profile"""
    CATEGORY_CHOICES = [
        ('Adult', 'Adult'),
        ('Youth', 'Youth'),
        ('Sunday School', 'Sunday School'),
    ]
    MEMBERSHIP_STATUS = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('transferred', 'Transferred'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)
    member_category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='Adult')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='members')
    join_date = models.DateField(null=True, blank=True)
    
    # Enhanced profile fields
    spouse_name = models.CharField(max_length=255, null=True, blank=True)
    spouse_phone = models.CharField(max_length=20, null=True, blank=True)
    children_count = models.IntegerField(null=True, blank=True, default=0)
    blood_type = models.CharField(max_length=10, null=True, blank=True)
    occupation = models.CharField(max_length=255, null=True, blank=True)
    emergency_contact_name = models.CharField(max_length=255, null=True, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, null=True, blank=True)
    ministry_interests = models.JSONField(default=list, blank=True)
    membership_status = models.CharField(max_length=20, choices=MEMBERSHIP_STATUS, default='active')
    notes = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'members'
        ordering = ['name']
        indexes = [
            models.Index(fields=['branch', 'membership_status']),
            models.Index(fields=['email']),
            models.Index(fields=['phone']),
        ]

    def __str__(self):
        return self.name


class Permission(models.Model):
    """Specific permission codenames"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    codename = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100, default='General')

    class Meta:
        db_table = 'permissions'
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.category}: {self.name}"


class Role(models.Model):
    """Customizable roles with multiple permissions"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    permissions = models.ManyToManyField(Permission, related_name='roles', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'roles'
        ordering = ['name']

    def __str__(self):
        return self.name


class UserRole(models.Model):
    """User role and permissions"""
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('branch_admin', 'Branch Admin'),
        ('secretary', 'Secretary'),
        ('sunday_school_teacher', 'Sunday School Teacher'),
        ('member', 'Member'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='role')
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='member')
    custom_role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_roles')
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_roles'

    def __str__(self):
        return f"{self.user.email} - {self.custom_role.name if self.custom_role else self.get_role_display()}"

    def get_permissions(self):
        """Get list of permission codenames for this user"""
        if self.custom_role:
            permissions = list(self.custom_role.permissions.values_list('codename', flat=True))
            # Bishop always gets everything if their role name is 'Bishop' or role is 'super_admin'
            if self.role == 'super_admin' or self.custom_role.name.lower() == 'bishop':
                return ['*'] # Master permission
            return permissions
        
        # Fallback for legacy roles
        legacy_permissions = {
            'super_admin': ['*'],
            'branch_admin': [
                'view_members', 'add_members', 'edit_members', 'delete_members',
                'view_finance', 'add_finance', 'manage_events', 'manage_sermons',
                'manage_notices', 'manage_prayer_requests', 'view_reports'
            ],
            'secretary': [
                'view_members', 'add_members', 'edit_members', 
                'manage_attendance', 'manage_sunday_school'
            ],
            'sunday_school_teacher': ['manage_sunday_school'],
            'member': []
        }
        return legacy_permissions.get(self.role, [])


class Attendance(models.Model):
    """Service attendance records"""
    SERVICE_TYPE_CHOICES = [
        ('sunday', 'Sunday Service'),
        ('weekday', 'Weekday Service'),
        ('conference', 'Conference'),
        ('sunday_school', 'Sunday School'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='attendance')
    service_date = models.DateField(db_column='date')
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES, default='sunday')
    count = models.IntegerField(default=0)
    online_count = models.IntegerField(default=0)
    total_members = models.IntegerField(null=True, blank=True)
    attendance_year = models.IntegerField(null=True, blank=True)
    attendance_month = models.IntegerField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendance'
        ordering = ['-service_date']
        indexes = [
            models.Index(fields=['branch', 'service_date']),
            models.Index(fields=['service_type']),
        ]

    def __str__(self):
        return f"{self.branch.branch_name} - {self.service_date}"


class AttendanceMember(models.Model):
    """Individual member attendance tracking"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE, related_name='members')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='attendance_records')
    checked_in_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'attendance_members'
        unique_together = ['attendance', 'member']

    def __str__(self):
        return f"{self.member.name} - {self.attendance.service_date}"


class Finance(models.Model):
    """Financial giving records"""
    CATEGORY_CHOICES = [
        ('tithe', 'Tithe'),
        ('offering', 'Offering'),
        ('donation', 'Donation'),
        ('pledge', 'Pledge'),
        ('project_fund', 'Project Fund'),
        ('other', 'Other'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('mobile_money', 'Mobile Money'),
        ('bank_transfer', 'Bank Transfer'),
        ('cheque', 'Cheque'),
        ('card', 'Card'),
        ('other', 'Other'),
    ]
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='finance')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='offering')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash')
    giver = models.CharField(max_length=255, null=True, blank=True)
    is_anonymous = models.BooleanField(default=False)
    date = models.DateField()
    receipt_number = models.CharField(max_length=50, null=True, blank=True, unique=True)
    notes = models.TextField(null=True, blank=True)
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_finance')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'finance'
        ordering = ['-date']
        indexes = [
            models.Index(fields=['branch', 'date']),
            models.Index(fields=['category']),
            models.Index(fields=['approval_status']),
        ]

    def __str__(self):
        return f"{self.category.title()} - {self.amount} - {self.date}"


class Event(models.Model):
    """Church events"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=255)
    description = models.TextField()
    event_date = models.DateTimeField()
    location = models.CharField(max_length=255, null=True, blank=True)
    is_conference = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'events'
        ordering = ['-event_date']

    def __str__(self):
        return self.title


class Sermon(models.Model):
    """Sermon records"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='sermons')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    speaker = models.CharField(max_length=255, default='Bishop Paul Ndolo Mulu')
    sermon_date = models.DateField()
    video_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sermons'
        ordering = ['-sermon_date']

    def __str__(self):
        return self.title


class SundaySchool(models.Model):
    """Sunday School classes"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='sunday_schools')
    class_name = models.CharField(max_length=100)
    class_teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='sunday_school_classes')
    teacher_name = models.CharField(max_length=255, null=True, blank=True)  # Text name if not linked to User
    age_group = models.CharField(max_length=100, null=True, blank=True)
    member_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'sunday_schools'
        unique_together = ['branch', 'class_name']

    def __str__(self):
        return f"{self.class_name} - {self.branch.branch_name}"


class SundaySchoolMember(models.Model):
    """Enrollment: Member in a Sunday School class"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sunday_school_class = models.ForeignKey(SundaySchool, on_delete=models.CASCADE, related_name='enrollments')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='sunday_school_enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sunday_school_members'
        unique_together = ['sunday_school_class', 'member']

    def __str__(self):
        return f"{self.member.name} - {self.sunday_school_class.class_name}"


class SundaySchoolAttendance(models.Model):
    """Class attendance record for a specific date"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sunday_school_class = models.ForeignKey(SundaySchool, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    present_count = models.IntegerField(default=0)
    notes = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sunday_school_attendance'
        unique_together = ['sunday_school_class', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.sunday_school_class.class_name} - {self.date}"


class Notice(models.Model):
    """Church notices and announcements"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='notices', null=True, blank=True)
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_global = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notices'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class PrayerRequest(models.Model):
    """Prayer requests"""
    REQUEST_STATUS = [
        ('new', 'New'),
        ('processed', 'Processed'),
        ('answered', 'Answered'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='prayer_requests', null=True, blank=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    request = models.TextField()
    status = models.CharField(max_length=20, choices=REQUEST_STATUS, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'prayer_requests'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.status}"


class Communication(models.Model):
    """Branch communications"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='communications', null=True, blank=True)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_bishop_broadcast = models.BooleanField(default=False, help_text='If True, visible to all branch admins/secretaries')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'communications'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class MemberTransfer(models.Model):
    """Member branch transfers"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='transfers')
    from_branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name='transfers_from')
    to_branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name='transfers_to')
    transfer_date = models.DateTimeField(auto_now_add=True)
    reason = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    approval_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'member_transfers'
        ordering = ['-transfer_date']

    def __str__(self):
        return f"{self.member.name} - {self.from_branch} to {self.to_branch}"


class NotificationPreference(models.Model):
    """User notification preferences"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preference')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='notification_preferences')
    email_enabled = models.BooleanField(default=True)
    sms_enabled = models.BooleanField(default=True)
    whatsapp_enabled = models.BooleanField(default=False)
    push_enabled = models.BooleanField(default=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    email_address = models.EmailField(null=True, blank=True)
    whatsapp_number = models.CharField(max_length=20, null=True, blank=True)
    notify_events = models.BooleanField(default=True)
    notify_meetings = models.BooleanField(default=True)
    notify_announcements = models.BooleanField(default=True)
    notify_prayer_requests = models.BooleanField(default=True)
    notify_finance_updates = models.BooleanField(default=False)
    notify_attendance = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'notification_preferences'

    def __str__(self):
        return f"{self.user.email} - Notifications"


class NotificationSent(models.Model):
    """Log of sent notifications"""
    CHANNEL_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('whatsapp', 'WhatsApp'),
        ('push', 'Push'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('delivered', 'Delivered'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications_received')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    message = models.TextField()
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    related_to_id = models.UUIDField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivery_response = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications_sent'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} - {self.user.email}"


class BackupLog(models.Model):
    """Database backup logs"""
    BACKUP_TYPE_CHOICES = [
        ('full', 'Full'),
        ('incremental', 'Incremental'),
        ('member_data', 'Member Data'),
        ('finance_data', 'Finance Data'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    backup_type = models.CharField(max_length=20, choices=BACKUP_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    backup_size_bytes = models.BigIntegerField(null=True, blank=True)
    records_backed_up = models.IntegerField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)
    storage_location = models.CharField(max_length=255, null=True, blank=True)
    retention_days = models.IntegerField(default=30)
    initiated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'backup_logs'
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.get_backup_type_display()} - {self.get_status_display()}"


class DataAccessLog(models.Model):
    """Data access audit logs"""
    OPERATION_CHOICES = [
        ('select', 'Select'),
        ('insert', 'Insert'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('export', 'Export'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='data_access_logs')
    table_name = models.CharField(max_length=100)
    operation = models.CharField(max_length=20, choices=OPERATION_CHOICES)
    record_count = models.IntegerField(null=True, blank=True)
    filters_applied = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'data_access_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['table_name', 'operation']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.operation} on {self.table_name}"


class PrivateMessage(models.Model):
    """Private messages between users"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'private_messages'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender.email} to {self.receiver.email}"


class SiteSettings(models.Model):
    """Global site settings"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=255, unique=True)
    value = models.JSONField()
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'site_settings'

    def __str__(self):
        return self.key


class SocialQuote(models.Model):
    """Social media quotes with church branding"""
    THEME_CHOICES = [
        ('Faith', 'Faith'),
        ('Prayer', 'Prayer'),
        ('Love', 'Love'),
        ('Hope', 'Hope'),
        ('Worship', 'Worship'),
        ('Grace', 'Grace'),
        ('Strength', 'Strength'),
        ('Healing', 'Healing'),
        ('Salvation', 'Salvation'),
        ('Peace', 'Peace'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    theme = models.CharField(max_length=50, choices=THEME_CHOICES)
    quote_text = models.TextField()
    author = models.CharField(max_length=255, null=True, blank=True)
    reference = models.CharField(max_length=255, null=True, blank=True)  # Bible reference
    is_active = models.BooleanField(default=True)
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'social_quotes'
        ordering = ['-usage_count', '?']
        indexes = [
            models.Index(fields=['theme', 'is_active']),
            models.Index(fields=['usage_count']),
        ]

    def __str__(self):
        return f"{self.theme}: {self.quote_text[:50]}..."


class LoginActivity(models.Model):
    """Track user login activity"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_activities')
    user_email = models.EmailField(null=True, blank=True)
    login_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        db_table = 'login_activity'
        ordering = ['-login_at']

    def __str__(self):
        return f"{self.user.username} - {self.login_at}"

