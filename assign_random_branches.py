import os
import django
import random

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from api.models import Member, Branch

def assign_random_branches():
    branches = list(Branch.objects.all())
    if not branches:
        print("No branches found. Please create at least one branch first.")
        return

    # Find members without a branch or with a placeholder
    members_to_update = Member.objects.all()
    count = 0

    for member in members_to_update:
        branch = random.choice(branches)
        member.branch = branch
        member.save()
        count += 1
        print(f"Assigned {member.name} to {branch.branch_name}")

    print(f"Successfully updated {count} members.")

if __name__ == "__main__":
    assign_random_branches()
