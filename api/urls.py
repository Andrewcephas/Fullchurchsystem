"""
Church Management System - Django URL routing
API endpoints configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    BranchViewSet, MemberViewSet, UserRoleViewSet, AttendanceViewSet,
    FinanceViewSet, EventViewSet, SermonViewSet, NoticeViewSet,
    PrayerRequestViewSet, MemberTransferViewSet, NotificationPreferenceViewSet,
    BackupLogViewSet, DataAccessLogViewSet, SocialQuoteViewSet, AnalyticsViewSet,
    LoginView, LogoutView, UserView
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'branches', BranchViewSet)
router.register(r'members', MemberViewSet)
router.register(r'user-roles', UserRoleViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'finance', FinanceViewSet)
router.register(r'events', EventViewSet)
router.register(r'sermons', SermonViewSet)
router.register(r'notices', NoticeViewSet)
router.register(r'prayer-requests', PrayerRequestViewSet)
router.register(r'member-transfers', MemberTransferViewSet)
router.register(r'notification-preferences', NotificationPreferenceViewSet)
router.register(r'backup-logs', BackupLogViewSet)
router.register(r'data-access-logs', DataAccessLogViewSet)
router.register(r'social-quotes', SocialQuoteViewSet, basename='social-quotes')
router.register(r'analytics', AnalyticsViewSet, basename='analytics')

app_name = 'api'

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/user/', UserView.as_view(), name='auth-user'),
]
