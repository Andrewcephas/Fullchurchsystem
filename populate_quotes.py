"""
Populate SocialQuote model with initial data
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
django.setup()

from api.models import SocialQuote

quotes_data = [
    # Faith
    {'theme': 'Faith', 'quote_text': 'Faith is the assurance of things hoped for, the conviction of things not seen.', 'author': 'Hebrews 11:1', 'reference': 'Hebrews 11:1'},
    {'theme': 'Faith', 'quote_text': 'Without faith it is impossible to please Him, for he who comes to God must believe that He is.', 'author': 'Hebrews 11:6', 'reference': 'Hebrews 11:6'},
    {'theme': 'Faith', 'quote_text': 'For we walk by faith, not by sight.', 'author': '2 Corinthians 5:7', 'reference': '2 Corinthians 5:7'},
    
    # Prayer
    {'theme': 'Prayer', 'quote_text': 'Pray without ceasing.', 'author': '1 Thessalonians 5:17', 'reference': '1 Thessalonians 5:17'},
    {'theme': 'Prayer', 'quote_text': 'Call to Me and I will answer you, and tell you great and mighty things.', 'author': 'Jeremiah 33:3', 'reference': 'Jeremiah 33:3'},
    {'theme': 'Prayer', 'quote_text': 'The prayer of a righteous person is powerful and effective.', 'author': 'James 5:16', 'reference': 'James 5:16'},
    
    # Love
    {'theme': 'Love', 'quote_text': 'For God so loved the world that He gave His only Son, that whoever believes in Him should not perish but have eternal life.', 'author': 'John 3:16', 'reference': 'John 3:16'},
    {'theme': 'Love', 'quote_text': 'Love is patient, love is kind...', 'author': '1 Corinthians 13:4-7', 'reference': '1 Corinthians 13'},
    {'theme': 'Love', 'quote_text': 'Above all, love each other deeply, for love covers over a multitude of sins.', 'author': '1 Peter 4:8', 'reference': '1 Peter 4:8'},
    
    # Hope
    {'theme': 'Hope', 'quote_text': 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', 'author': 'Jeremiah 29:11', 'reference': 'Jeremiah 29:11'},
    {'theme': 'Hope', 'quote_text': 'We have this hope as an anchor for the soul, firm and secure.', 'author': 'Hebrews 6:19', 'reference': 'Hebrews 6:19'},
    {'theme': 'Hope', 'quote_text': 'May the God of hope fill you with all joy and peace as you trust in Him.', 'author': 'Romans 15:13', 'reference': 'Romans 15:13'},
    
    # Worship
    {'theme': 'Worship', 'quote_text': 'God is spirit, and His worshipers must worship in spirit and truth.', 'author': 'John 4:24', 'reference': 'John 4:24'},
    {'theme': 'Worship', 'quote_text': 'Let everything that has breath praise the Lord. Praise the Lord!', 'author': 'Psalm 150:6', 'reference': 'Psalm 150:6'},
    {'theme': 'Worship', 'quote_text': 'I will bless the Lord at all times; His praise shall continually be in my mouth.', 'author': 'Psalm 34:1', 'reference': 'Psalm 34:1'},
    
    # Grace
    {'theme': 'Grace', 'quote_text': 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.', 'author': 'Ephesians 2:8-9', 'reference': 'Ephesians 2:8'},
    {'theme': 'Grace', 'quote_text': 'But because of His great love for us, God, who is rich in mercy, made us alive with Christ.', 'author': 'Ephesians 2:4-5', 'reference': 'Ephesians 2:4'},
    {'theme': 'Grace', 'quote_text': 'Let us then approach God’s throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need.', 'author': 'Hebrews 4:16', 'reference': 'Hebrews 4:16'},
    
    # Strength
    {'theme': 'Strength', 'quote_text': 'I can do all things through Christ who strengthens me.', 'author': 'Philippians 4:13', 'reference': 'Philippians 4:13'},
    {'theme': 'Strength', 'quote_text': 'The Lord is my strength and my shield; my heart trusts in Him, and He helps me.', 'author': 'Psalm 28:7', 'reference': 'Psalm 28:7'},
    {'theme': 'Strength', 'quote_text': 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', 'author': 'Joshua 1:9', 'reference': 'Joshua 1:9'},
    
    # Healing
    {'theme': 'Healing', 'quote_text': 'He Himself bore our sins in His body on the tree, that we might die to sin and live to righteousness. By His wounds you have been healed.', 'author': '1 Peter 2:24', 'reference': '1 Peter 2:24'},
    {'theme': 'Healing', 'quote_text': 'The Lord sustains all who fall and lifts up all who are bowed down.', 'author': 'Psalm 145:14', 'reference': 'Psalm 145:14'},
    {'theme': 'Healing', 'quote_text': 'He heals the brokenhearted and binds up their wounds.', 'author': 'Psalm 147:3', 'reference': 'Psalm 147:3'},
    
    # Salvation
    {'theme': 'Salvation', 'quote_text': 'If you declare with your mouth, "Jesus is Lord," and believe in your heart that God raised Him from the dead, you will be saved.', 'author': 'Romans 10:9', 'reference': 'Romans 10:9'},
    {'theme': 'Salvation', 'quote_text': 'For the Son of Man came to seek and to save the lost.', 'author': 'Luke 19:10', 'reference': 'Luke 19:10'},
    {'theme': 'Salvation', 'quote_text': 'I am the way and the truth and the life. No one comes to the Father except through Me.', 'author': 'John 14:6', 'reference': 'John 14:6'},
    
    # Peace
    {'theme': 'Peace', 'quote_text': 'Peace I leave with you; My peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.', 'author': 'John 14:27', 'reference': 'John 14:27'},
    {'theme': 'Peace', 'quote_text': 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', 'author': 'Philippians 4:6', 'reference': 'Philippians 4:6'},
    {'theme': 'Peace', 'quote_text': 'The peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.', 'author': 'Philippians 4:7', 'reference': 'Philippians 4:7'},
]

created = 0
for quote_data in quotes_data:
    quote, created_flag = SocialQuote.objects.get_or_create(
        theme=quote_data['theme'],
        quote_text=quote_data['quote_text'],
        defaults={
            'author': quote_data.get('author'),
            'reference': quote_data.get('reference'),
            'is_active': True,
            'usage_count': 0
        }
    )
    if created_flag:
        created += 1

print(f"Created {created} new quotes")
print(f"Total quotes in DB: {SocialQuote.objects.count()}")
