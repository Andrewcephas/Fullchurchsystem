"""
Church Management System - Django Views
REST API viewsets for all endpoints
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Q, Sum, Count
import csv
from io import StringIO

from api.models import (
    Branch, Member, UserRole, Attendance, AttendanceMember, Finance, Event,
    Sermon, SundaySchool, SundaySchoolMember, SundaySchoolAttendance, Notice, PrayerRequest,
    Communication, MemberTransfer, NotificationPreference, NotificationSent,
    BackupLog, DataAccessLog, PrivateMessage, SiteSettings, SocialQuote, LoginActivity,
    PasswordResetRequest
)
from api.serializers import (
    BranchSerializer, MemberSerializer, UserRoleSerializer, AttendanceSerializer,
    AttendanceMemberSerializer, FinanceSerializer, EventSerializer, SermonSerializer,
    SundaySchoolSerializer, NoticeSerializer, PrayerRequestSerializer,
    CommunicationSerializer, MemberTransferSerializer, NotificationPreferenceSerializer,
    NotificationSentSerializer, BackupLogSerializer, DataAccessLogSerializer,
    PrivateMessageSerializer, SiteSettingsSerializer, UserSerializer, SocialQuoteSerializer,
    LoginActivitySerializer, PasswordResetRequestSerializer
)


# Permissions
class IsAuthenticated(permissions.IsAuthenticated):
    """Check if user is authenticated"""
    pass


class IsSuperAdmin(permissions.BasePermission):
    """Allow only super admins"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.role.role == 'super_admin'
        except:
            return False


class IsBranchAdminOrSuper(permissions.BasePermission):
    """Allow branch admins and super admins"""
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.role.role in ['super_admin', 'branch_admin']
        except:
            return False


# Viewsets
class BranchViewSet(viewsets.ModelViewSet):
    """Branch management"""
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['branch_name', 'location']
    ordering_fields = ['branch_name', 'created_at']
    ordering = ['branch_name']


class MemberViewSet(viewsets.ModelViewSet):
    """Member management with comprehensive profiles"""
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'join_date', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter members by branch and ministry isolation"""
        user = self.request.user
        if not user.is_authenticated:
            return Member.objects.none()
        
        try:
            role = user.role.role
            # Bishop/SuperAdmin sees everything
            if role == 'super_admin':
                return Member.objects.all()
            
            # Ministry Isolation: Only Pastor and Secretary can manage all members in branch
            # Sunday School Teacher can only see members in Sunday School category in their branch
            if role in ['branch_admin', 'secretary']:
                return Member.objects.filter(branch=user.role.branch)
            elif role == 'sunday_school_teacher':
                return Member.objects.filter(branch=user.role.branch, member_category='Sunday School')
            
            return Member.objects.none()
        except:
            return Member.objects.none()

    @action(detail=True, methods=['get'])
    def profile(self, request, pk=None):
        """Get full member profile"""
        member = self.get_object()
        serializer = self.get_serializer(member)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_import(self, request):
        """Bulk import members"""
        if not IsBranchAdminOrSuper().has_permission(request, self):
            return Response(
                {'error': 'Only admins can bulk import'},
                status=status.HTTP_403_FORBIDDEN
            )
        # Implementation for CSV import
        return Response({'message': 'Bulk import functionality'})


class UserRoleViewSet(viewsets.ModelViewSet):
    """User role management"""
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [ SearchFilter]
    # filterset_fields = ['role', 'branch']
    search_fields = ['user__email', 'user__first_name']


class AttendanceViewSet(viewsets.ModelViewSet):
    """Attendance tracking"""
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ OrderingFilter]
    # filterset_fields = ['branch', 'service_type', 'service_date']
    ordering_fields = ['service_date']
    ordering = ['-service_date']

    def get_queryset(self):
        """Filter attendance by user's branch if not super admin"""
        user = self.request.user
        if not user.is_authenticated:
            return Attendance.objects.none()
        
        try:
            if user.role.role == 'super_admin':
                return Attendance.objects.all()
            else:
                return Attendance.objects.filter(branch=user.role.branch)
        except:
            return Attendance.objects.none()

    @action(detail=True, methods=['post'])
    def check_in_member(self, request, pk=None):
        """Record member attendance"""
        attendance = self.get_object()
        member_id = request.data.get('member_id')
        
        if not member_id:
            return Response(
                {'error': 'member_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            member = Member.objects.get(id=member_id)
            attendance_member, created = AttendanceMember.objects.get_or_create(
                attendance=attendance,
                member=member
            )
            serializer = AttendanceMemberSerializer(attendance_member)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Member.DoesNotExist:
            return Response(
                {'error': 'Member not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class FinanceViewSet(viewsets.ModelViewSet):
    """Finance management"""
    queryset = Finance.objects.all()
    serializer_class = FinanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ OrderingFilter]
    # filterset_fields = ['branch', 'category', 'approval_status', 'date']
    ordering_fields = ['date', 'amount']
    ordering = ['-date']

    def get_queryset(self):
        """Filter finance by branch and role (Ministry Isolation)"""
        user = self.request.user
        if not user.is_authenticated:
            return Finance.objects.none()
        
        try:
            role = user.role.role
            if role == 'super_admin':
                return Finance.objects.all()
            
            # Ministry Isolation: Only Pastor and Secretary can see Finance
            if role in ['branch_admin', 'secretary']:
                return Finance.objects.filter(branch=user.role.branch)
            
            # Sunday School teachers cannot see finance
            return Finance.objects.none()
        except:
            return Finance.objects.none()

    @action(detail=False, methods=['post'])
    def export_report(self, request):
        """Export finance report as CSV"""
        queryset = self.get_queryset()
        branch_id = request.query_params.get('branch')
        category = request.query_params.get('category')
        
        if branch_id:
            queryset = queryset.filter(branch_id=branch_id)
        if category:
            queryset = queryset.filter(category=category)
        
        # Create CSV
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['Date', 'Category', 'Amount', 'Method', 'Giver', 'Status'])
        
        for item in queryset:
            writer.writerow([
                item.date,
                item.get_category_display(),
                item.amount,
                item.payment_method,
                'Anonymous' if item.is_anonymous else item.giver,
                item.approval_status
            ])
        
        return Response({
            'csv': output.getvalue(),
            'filename': 'finance-report.csv'
        })

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get financial summary"""
        queryset = self.get_queryset()
        
        summary = {
            'total_giving': queryset.aggregate(Sum('amount'))['amount__sum'] or 0,
            'total_tithes': queryset.filter(category='tithe').aggregate(Sum('amount'))['amount__sum'] or 0,
            'total_offerings': queryset.filter(category='offering').aggregate(Sum('amount'))['amount__sum'] or 0,
            'total_donations': queryset.filter(category='donation').aggregate(Sum('amount'))['amount__sum'] or 0,
            'pending_approval': queryset.filter(approval_status='pending').count(),
            'transaction_count': queryset.count(),
        }
        return Response(summary)


class EventViewSet(viewsets.ModelViewSet):
    """Event management"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ SearchFilter, OrderingFilter]
    # filterset_fields = ['branch', 'is_conference']
    search_fields = ['title', 'description']
    ordering_fields = ['event_date']
    ordering = ['-event_date']

    def get_queryset(self):
        """Filter events by user's branch if not super admin"""
        user = self.request.user
        if not user.is_authenticated:
            return Event.objects.none()
        
        try:
            if user.role.role == 'super_admin':
                return Event.objects.all()
            else:
                return Event.objects.filter(branch=user.role.branch)
        except:
            return Event.objects.none()


class SermonViewSet(viewsets.ModelViewSet):
    """Sermon management"""
    queryset = Sermon.objects.all()
    serializer_class = SermonSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ SearchFilter, OrderingFilter]
    # filterset_fields = ['branch', 'speaker']
    search_fields = ['title', 'description']
    ordering_fields = ['sermon_date']
    ordering = ['-sermon_date']

    def get_queryset(self):
        """Filter sermons by user's branch if not super admin"""
        user = self.request.user
        if not user.is_authenticated:
            return Sermon.objects.none()
        
        try:
            if user.role.role == 'super_admin':
                return Sermon.objects.all()
            else:
                return Sermon.objects.filter(branch=user.role.branch)
        except:
            return Sermon.objects.none()


class NoticeViewSet(viewsets.ModelViewSet):
    """Notice management"""
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ SearchFilter, OrderingFilter]
    # filterset_fields = ['is_global']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Get notices for user's branch or global notices"""
        user = self.request.user
        if not user.is_authenticated:
            return Notice.objects.none()
        
        try:
            if user.role.role == 'super_admin':
                return Notice.objects.all()
            else:
                return Notice.objects.filter(
                    Q(is_global=True) | Q(branch=user.role.branch)
                )
        except:
            return Notice.objects.filter(is_global=True)


class PrayerRequestViewSet(viewsets.ModelViewSet):
    """Prayer request management"""
    queryset = PrayerRequest.objects.all()
    serializer_class = PrayerRequestSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ OrderingFilter]
    # filterset_fields = ['status']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter prayer requests by user's branch if not super admin"""
        user = self.request.user
        if not user.is_authenticated:
            return PrayerRequest.objects.none()
        
        try:
            if user.role.role == 'super_admin':
                return PrayerRequest.objects.all()
            else:
                return PrayerRequest.objects.filter(branch=user.role.branch)
        except:
            return PrayerRequest.objects.none()


class MemberTransferViewSet(viewsets.ModelViewSet):
    """Member transfer management"""
    queryset = MemberTransfer.objects.all()
    serializer_class = MemberTransferSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ OrderingFilter]
    # filterset_fields = ['status']
    ordering_fields = ['transfer_date']
    ordering = ['-transfer_date']

    def get_queryset(self):
        """Filter transfers by user's branch if not super admin"""
        user = self.request.user
        if not user.is_authenticated:
            return MemberTransfer.objects.none()
        
        try:
            if user.role.role == 'super_admin':
                return MemberTransfer.objects.all()
            else:
                return MemberTransfer.objects.filter(
                    Q(from_branch=user.role.branch) | Q(to_branch=user.role.branch)
                )
        except:
            return MemberTransfer.objects.none()

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a transfer"""
        if not IsBranchAdminOrSuper().has_permission(request, self):
            return Response(
                {'error': 'Only admins can approve transfers'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        transfer = self.get_object()
        if transfer.status != 'pending':
            return Response(
                {'error': 'Can only approve pending transfers'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transfer.status = 'approved'
        transfer.approved_by = request.user
        transfer.approval_date = timezone.now()
        transfer.save()
        
        serializer = self.get_serializer(transfer)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a transfer"""
        if not IsBranchAdminOrSuper().has_permission(request, self):
            return Response(
                {'error': 'Only admins can reject transfers'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        transfer = self.get_object()
        if transfer.status != 'pending':
            return Response(
                {'error': 'Can only reject pending transfers'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transfer.status = 'rejected'
        transfer.save()
        
        serializer = self.get_serializer(transfer)
        return Response(serializer.data)


class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """Notification preference management"""
    queryset = NotificationPreference.objects.all()
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Users can only see their own preferences"""
        user = self.request.user
        return NotificationPreference.objects.filter(user=user)

    @action(detail=False, methods=['get', 'post'])
    def my_preferences(self, request):
        """Get or update user's notification preferences"""
        try:
            prefs = NotificationPreference.objects.get(user=request.user)
        except NotificationPreference.DoesNotExist:
            prefs = None
        
        if request.method == 'POST':
            serializer = self.get_serializer(prefs, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        
        if prefs:
            serializer = self.get_serializer(prefs)
            return Response(serializer.data)
        return Response({'message': 'No preferences set'})


class BackupLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Backup log viewing (Super Admin only)"""
    queryset = BackupLog.objects.all()
    serializer_class = BackupLogSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [ OrderingFilter]
    # filterset_fields = ['status', 'backup_type']
    ordering_fields = ['started_at']
    ordering = ['-started_at']

    @action(detail=False, methods=['post'])
    def create_backup(self, request):
        """Create a new backup"""
        if not IsSuperAdmin().has_permission(request, self):
            return Response(
                {'error': 'Only super admins can create backups'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        backup_type = request.data.get('backup_type', 'full')
        backup = BackupLog.objects.create(
            backup_type=backup_type,
            status='in_progress',
            initiated_by=request.user
        )
        
        serializer = self.get_serializer(backup)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class DataAccessLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Data access log viewing (Super Admin only)"""
    queryset = DataAccessLog.objects.all()
    serializer_class = DataAccessLogSerializer
    permission_classes = [IsSuperAdmin]
    filter_backends = [ OrderingFilter]
    # filterset_fields = ['operation', 'table_name', 'user']
    ordering_fields = ['created_at']
    ordering = ['-created_at']


class SocialQuoteViewSet(viewsets.ModelViewSet):
    """Social media quotes management with generation"""
    queryset = SocialQuote.objects.filter(is_active=True)
    serializer_class = SocialQuoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ SearchFilter, OrderingFilter]
    # filterset_fields = ['theme', 'is_active']
    search_fields = ['quote_text', 'author', 'reference']
    ordering_fields = ['usage_count', 'created_at']
    ordering = ['-usage_count']

    def get_queryset(self):
        """Return active quotes ordered by usage"""
        return SocialQuote.objects.filter(is_active=True).order_by('-usage_count', '?')

    @action(detail=False, methods=['post'])
    def generate(self, request):
        """Generate/retrieve a quote for a specific theme"""
        theme = request.data.get('theme', 'Faith')
        
        # Validate theme
        valid_themes = [choice[0] for choice in SocialQuote.THEME_CHOICES]
        if theme not in valid_themes:
            return Response(
                {'error': f'Invalid theme. Choose from: {", ".join(valid_themes)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get a random quote for this theme, weighted by usage count
        import random
        quotes = SocialQuote.objects.filter(theme=theme, is_active=True)
        
        if quotes.exists():
            # Weighted random selection: lower usage_count = higher chance
            quotes_list = list(quotes)
            weights = [1 / (q.usage_count + 1) for q in quotes_list]
            selected_quote = random.choices(quotes_list, weights=weights, k=1)[0]
            
            # Increment usage count
            selected_quote.usage_count += 1
            selected_quote.save()
            
            serializer = self.get_serializer(selected_quote)
            return Response({'quotes': [serializer.data]})
        else:
            # No quotes in database, return a fallback message
            return Response(
                {'error': f'No quotes available for theme: {theme}', 
                 'theme': theme,
                 'quote': 'Please add quotes to the database through the admin panel.'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def themes(self, request):
        """Get all available themes"""
        return Response([
            {'value': choice[0], 'label': choice[1]}
            for choice in SocialQuote.THEME_CHOICES
        ])


class CommunicationViewSet(viewsets.ModelViewSet):
    """Branch communications / announcements"""
    queryset = Communication.objects.all()
    serializer_class = CommunicationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ OrderingFilter]
    # filterset_fields = ['branch']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter communications by user's branch if not super admin"""
        user = self.request.user
        if not user.is_authenticated:
            return Communication.objects.none()
        try:
            if user.role.role == 'super_admin':
                return Communication.objects.all()
            else:
                return Communication.objects.filter(branch=user.role.branch)
        except:
            return Communication.objects.none()

    def perform_create(self, serializer):
        # Auto-generate title from message if not provided
        message = serializer.validated_data.get('message', '')
        title = message[:50] + ('...' if len(message) > 50 else '')
        serializer.save(
            created_by=self.request.user,
            title=title or 'Announcement'
        )


class PrivateMessageViewSet(viewsets.ModelViewSet):
    """Private messages between users"""
    serializer_class = PrivateMessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ OrderingFilter]
    # filterset_fields = ['sender', 'receiver', 'is_read']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Return messages where user is sender OR receiver"""
        user = self.request.user
        if not user.is_authenticated:
            return PrivateMessage.objects.none()
        return PrivateMessage.objects.filter(
            Q(sender=user) | Q(receiver=user)
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class SiteSettingsViewSet(viewsets.ModelViewSet):
    """Global site settings (key-value store)"""
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Settings are global - any authenticated user can read"""
        return SiteSettings.objects.all().order_by('key')

    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Bulk update multiple settings (super admin only)"""
        if not request.user.is_superuser:
            return Response(
                {'error': 'Only super admins can update site settings'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        settings_data = request.data
        updated = []
        for key, value in settings_data.items():
            obj, created = SiteSettings.objects.update_or_create(
                key=key,
                defaults={'value': value}
            )
            updated.append(key)
        
        return Response({
            'message': f'Updated {len(updated)} settings',
            'updated_keys': updated
        })


class SundaySchoolViewSet(viewsets.ModelViewSet):
    """Sunday School management with classes, members, and attendance"""
    queryset = SundaySchool.objects.all()
    serializer_class = SundaySchoolSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [ SearchFilter, OrderingFilter]
    # filterset_fields = ['branch', 'class_teacher']
    search_fields = ['class_name']
    ordering_fields = ['class_name', 'created_at']
    ordering = ['class_name']

    def get_queryset(self):
        """Filter classes by branch and role (Ministry Isolation)"""
        user = self.request.user
        if not user.is_authenticated:
            return SundaySchool.objects.none()
        try:
            role = user.role.role
            if role == 'super_admin':
                return SundaySchool.objects.all()
            
            # Sunday School Teachers, Pastors and Secretaries can see SS data for their branch
            if role in ['branch_admin', 'secretary', 'sunday_school_teacher']:
                return SundaySchool.objects.filter(branch=user.role.branch)
            
            return SundaySchool.objects.none()
        except:
            return SundaySchool.objects.none()

    @action(detail=False, methods=['get'])
    def members(self, request):
        """Get members for a specific class (or all classes for branch)"""
        class_id = request.query_params.get('class_id')
        branch_id = request.query_params.get('branch_id')
        
        queryset = SundaySchoolMember.objects.all()
        
        # Filter by branch
        if branch_id:
            queryset = queryset.filter(sunday_school_class__branch_id=branch_id)
        elif class_id:
            queryset = queryset.filter(sunday_school_class_id=class_id)
        else:
            # If no filter, restrict to user's branch
            try:
                if request.user.role.role == 'super_admin':
                    pass  # show all
                else:
                    queryset = queryset.filter(sunday_school_class__branch=request.user.role.branch)
            except:
                return Response({'error': 'Unauthorized'}, status=401)
        
        serializer = SundaySchoolMemberSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def members(self, request):
        """Enroll a member in a class"""
        class_id = request.data.get('class_id')
        member_id = request.data.get('member_id')
        
        if not class_id or not member_id:
            return Response(
                {'error': 'class_id and member_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            ss_class = SundaySchool.objects.get(id=class_id)
            member = Member.objects.get(id=member_id)
        except (SundaySchool.DoesNotExist, Member.DoesNotExist):
            return Response({'error': 'Invalid class or member'}, status=404)
        
        # Check branch access
        try:
            if request.user.role.role != 'super_admin' and ss_class.branch != request.user.role.branch:
                return Response({'error': 'Cannot assign across branches'}, status=403)
        except:
            return Response({'error': 'Unauthorized'}, status=401)
        
        enrollment, created = SundaySchoolMember.objects.get_or_create(
            sunday_school_class=ss_class,
            member=member
        )
        
        if created:
            # Update member count
            ss_class.member_count = SundaySchoolMember.objects.filter(sunday_school_class=ss_class).count()
            ss_class.save(update_fields=['member_count'])
        
        serializer = SundaySchoolMemberSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])
    def members(self, request):
        """Remove a member from a class"""
        class_id = request.query_params.get('class_id')
        member_id = request.query_params.get('member_id')
        
        if not class_id or not member_id:
            return Response(
                {'error': 'class_id and member_id required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            enrollment = SundaySchoolMember.objects.get(
                sunday_school_class_id=class_id,
                member_id=member_id
            )
            ss_class = enrollment.sunday_school_class
            enrollment.delete()
            
            # Update member count
            ss_class.member_count = SundaySchoolMember.objects.filter(sunday_school_class=ss_class).count()
            ss_class.save(update_fields=['member_count'])
            
            return Response({'message': 'Member removed'})
        except SundaySchoolMember.DoesNotExist:
            return Response({'error': 'Enrollment not found'}, status=404)

    @action(detail=False, methods=['get'])
    def attendance(self, request):
        """Get attendance records for a class"""
        class_id = request.query_params.get('class_id')
        
        queryset = SundaySchoolAttendance.objects.all()
        
        if class_id:
            queryset = queryset.filter(sunday_school_class_id=class_id)
        
        # Branch filtering
        try:
            if request.user.role.role != 'super_admin':
                queryset = queryset.filter(sunday_school_class__branch=request.user.role.branch)
        except:
            return Response({'error': 'Unauthorized'}, status=401)
        
        serializer = SundaySchoolAttendanceSerializer(queryset.order_by('-date'), many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def attendance(self, request):
        """Create attendance record for a class"""
        class_id = request.data.get('class_id')
        date = request.data.get('date')
        present_count = request.data.get('present_count')
        notes = request.data.get('notes', '')
        
        if not class_id or not date or not present_count:
            return Response(
                {'error': 'class_id, date, and present_count required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            ss_class = SundaySchool.objects.get(id=class_id)
        except SundaySchool.DoesNotExist:
            return Response({'error': 'Invalid class'}, status=404)
        
        # Check branch access
        try:
            if request.user.role.role != 'super_admin' and ss_class.branch != request.user.role.branch:
                return Response({'error': 'Cannot record attendance for other branches'}, status=403)
        except:
            return Response({'error': 'Unauthorized'}, status=401)
        
        record, created = SundaySchoolAttendance.objects.get_or_create(
            sunday_school_class=ss_class,
            date=date,
            defaults={
                'present_count': present_count,
                'notes': notes,
                'created_by': request.user
            }
        )
        
        if not created:
            record.present_count = present_count
            record.notes = notes
            record.save()
        
        serializer = SundaySchoolAttendanceSerializer(record)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class AnalyticsViewSet(viewsets.ViewSet):
    """Analytics and reporting"""
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def member_growth(self, request):
        """Member growth statistics"""
        user = request.user
        try:
            if user.role.role == 'super_admin':
                branches = Branch.objects.all()
            else:
                branches = Branch.objects.filter(id=user.role.branch_id)
        except:
            branches = Branch.objects.none()
        
        data = []
        for branch in branches:
            count = Member.objects.filter(branch=branch).count()
            data.append({
                'branch': branch.branch_name,
                'members': count
            })
        
        return Response(data)

    @action(detail=False, methods=['get'])
    def attendance_summary(self, request):
        """Attendance summary"""
        user = request.user
        try:
            if user.role.role == 'super_admin':
                attendance = Attendance.objects.all()
            else:
                attendance = Attendance.objects.filter(branch=user.role.branch)
        except:
            attendance = Attendance.objects.none()
        
        summary = {
            'total_attendance': attendance.aggregate(Sum('count'))['count__sum'] or 0,
            'avg_attendance': attendance.aggregate(Count('id'))['id__count'],
            'online_attendance': attendance.aggregate(Sum('online_count'))['online_count__sum'] or 0,
        }
        
        return Response(summary)

    @action(detail=False, methods=['get'])
    def financial_summary(self, request):
        """Financial summary"""
        user = request.user
        try:
            if user.role.role == 'super_admin':
                finance = Finance.objects.all()
            else:
                finance = Finance.objects.filter(branch=user.role.branch)
        except:
            finance = Finance.objects.none()
        
        summary = {
            'total_giving': finance.aggregate(Sum('amount'))['amount__sum'] or 0,
            'approved': finance.filter(approval_status='approved').aggregate(Sum('amount'))['amount__sum'] or 0,
            'pending': finance.filter(approval_status='pending').aggregate(Sum('amount'))['amount__sum'] or 0,
            'transaction_count': finance.count(),
        }
        
        return Response(summary)


# Authentication Views
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    """User login with session authentication"""
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Track login activity
            LoginActivity.objects.create(
                user=user,
                user_email=user.email,
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500]
            )
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                'message': 'Login successful'
            })
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    """User logout"""
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'})


class UserView(APIView):
    """Get current user information"""
    def get(self, request):
        if request.user.is_authenticated:
            serializer = UserSerializer(request.user)
            return Response(serializer.data)
        return Response(
            {'error': 'Not authenticated'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LoginActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """Login activity tracking - read only"""
    queryset = LoginActivity.objects.all()
    serializer_class = LoginActivitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter]
    ordering_fields = ['login_at']
    ordering = ['-login_at']

    def get_queryset(self):
        """Filter by user role"""
        user = self.request.user
        try:
            if user.role.role == 'super_admin':
                return LoginActivity.objects.all()
            else:
                return LoginActivity.objects.filter(user=user)
        except:
            return LoginActivity.objects.filter(user=user)

    def list(self, request):
        limit = request.query_params.get('limit')
        queryset = self.get_queryset()
        if limit:
            queryset = queryset[:int(limit)]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AdminUserViewSet(viewsets.ViewSet):
    """Admin user management - for super admin to create/manage users"""
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['username', 'email']
    ordering_fields = ['username', 'date_joined']
    ordering = ['username']


    def list(self, request):
        """List all users (Super Admin only)"""
        if not self.has_super_admin(request):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all().order_by('username')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Get user details (Super Admin only)"""
        if not self.has_super_admin(request):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def has_super_admin(self, request):
        """Check if user is super admin"""
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.role.role == 'super_admin' or request.user.is_superuser
        except:
            return request.user.is_superuser

    def list(self, request):
        """List all admin users"""
        if not self.has_super_admin(request):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.filter(is_staff=True)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def create(self, request):
        """Create new admin user - Initially inactive until Super Admin activates"""
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        role = request.data.get('role', 'secretary')
        branch_id = request.data.get('branch_id')

        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user - default to inactive for Super Admin review
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            is_staff=True,
            is_active=False  # Must be activated by Super Admin
        )

        # If the creator is not super_admin, they can only create users for their own branch
        current_user_role = getattr(request.user, 'role', None)
        if current_user_role and current_user_role.role != 'super_admin':
            branch_id = current_user_role.branch_id
        
        # Create user role
        UserRole.objects.create(
            user=user,
            role=role,
            branch_id=branch_id if branch_id else None
        )

        return Response({
            'message': 'Account created successfully. It is currently inactive pending Super Admin activation.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user account (Super Admin only)"""
        if not self.has_super_admin(request):
            return Response({'error': 'Only Super Admins can activate accounts'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(pk=pk)
            user.is_active = True
            user.save()
            return Response({'message': f'User {user.username} activated successfully'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        """Reset user password"""
        if not self.has_super_admin(request):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        user_id = request.data.get('user_id')
        new_password = request.data.get('new_password')

        if not user_id or not new_password:
            return Response(
                {'error': 'user_id and new_password required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        user.set_password(new_password)
        user.save()

        return Response({'message': 'Password reset successful'})

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def request_reset(self, request):
        """Allow users to request a password reset"""
        username = request.data.get('username')
        if not username:
            return Response({'error': 'Username or email required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(Q(username=username) | Q(email=username))
            # Check if there is already a pending request
            if PasswordResetRequest.objects.filter(user=user, status='pending').exists():
                return Response({'message': 'A reset request is already pending for this account.'})
            
            PasswordResetRequest.objects.create(user=user)
            return Response({'message': 'Password reset request submitted. Please contact your Bishop for approval.'})
        except User.DoesNotExist:
            # For security, return same message even if user doesn't exist
            return Response({'message': 'If an account exists, a reset request has been submitted.'})

class PasswordResetViewSet(viewsets.ModelViewSet):
    """Management of password reset requests (Super Admin only)"""
    queryset = PasswordResetRequest.objects.all()
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [IsSuperAdmin]

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve reset and set a new password"""
        reset_req = self.get_object()
        new_password = request.data.get('new_password')
        
        if not new_password:
            return Response({'error': 'New password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = reset_req.user
        user.set_password(new_password)
        user.save()
        
        reset_req.status = 'processed'
        reset_req.new_password_temp = new_password
        reset_req.processed_by = request.user
        reset_req.processed_at = timezone.now()
        reset_req.save()
        
        return Response({'message': f'Password for {user.username} has been reset.'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject reset request"""
        reset_req = self.get_object()
        reset_req.status = 'rejected'
        reset_req.processed_by = request.user
        reset_req.processed_at = timezone.now()
        reset_req.save()
        return Response({'message': 'Reset request rejected.'})
