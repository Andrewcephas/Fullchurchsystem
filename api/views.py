"""
Church Management System - Django Views
REST API viewsets for all endpoints
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Q, Sum, Count
import csv
from io import StringIO

from api.models import (
    Branch, Member, UserRole, Attendance, AttendanceMember, Finance, Event,
    Sermon, SundaySchool, Notice, PrayerRequest, Communication, MemberTransfer,
    NotificationPreference, NotificationSent, BackupLog, DataAccessLog,
    PrivateMessage, SiteSettings
)
from api.serializers import (
    BranchSerializer, MemberSerializer, UserRoleSerializer, AttendanceSerializer,
    AttendanceMemberSerializer, FinanceSerializer, EventSerializer, SermonSerializer,
    SundaySchoolSerializer, NoticeSerializer, PrayerRequestSerializer,
    CommunicationSerializer, MemberTransferSerializer, NotificationPreferenceSerializer,
    NotificationSentSerializer, BackupLogSerializer, DataAccessLogSerializer,
    PrivateMessageSerializer, SiteSettingsSerializer, UserSerializer
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
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['branch', 'member_category', 'membership_status', 'department']
    search_fields = ['name', 'email', 'phone']
    ordering_fields = ['name', 'join_date', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter members by user's branch if not super admin"""
        user = self.request.user
        if not user.is_authenticated:
            return Member.objects.none()
        
        try:
            if user.role.role == 'super_admin':
                return Member.objects.all()
            else:
                return Member.objects.filter(branch=user.role.branch)
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
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['role', 'branch']
    search_fields = ['user__email', 'user__first_name']


class AttendanceViewSet(viewsets.ModelViewSet):
    """Attendance tracking"""
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['branch', 'service_type', 'service_date']
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
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['branch', 'category', 'approval_status', 'date']
    ordering_fields = ['date', 'amount']
    ordering = ['-date']

    def get_queryset(self):
        """Filter finance by user's branch if not super admin"""
        user = self.request.user
        if not user.is_authenticated:
            return Finance.objects.none()
        
        try:
            if user.role.role == 'super_admin':
                return Finance.objects.all()
            else:
                return Finance.objects.filter(branch=user.role.branch)
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
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['branch', 'is_conference']
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
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['branch', 'speaker']
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
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_global']
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
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status']
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
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status']
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
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'backup_type']
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
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['operation', 'table_name', 'user']
    ordering_fields = ['created_at']
    ordering = ['-created_at']


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


class LoginView(APIView):
    """User login with session authentication"""
    permission_classes = []

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

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


class LogoutView(APIView):
    """User logout"""
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
