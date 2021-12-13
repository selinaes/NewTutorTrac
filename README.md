# TutorTrac
CS 317 final project: reimagining TutorTrac as a mobile app.

## Alpha Version Overview
### State of implementation

What we've got going in Alpha:
1. Firebase email-password authentification
2. Multiple screens navigation, using React Navigation
3. Passing states between screens, using Context
4. Display of static data on Profile screen and Sessions Listing screen

Our next steps:
1. Firebase shared storage & fetch data from remote to replace static data
2. Self checkin & checkout by students
3. Course selection after logging in
4. Adding, editing, deleting sessions
5. Additional features (if time allows)
    1.  Push notifications
    2.  Sorting & filtering of sessions
    3.  Google calendar integration
    4.  Map integration
6. Testing

### Currently not working (compared to Work Plan for Alpha)
1. Session card: currently the main session card is the same as the simplified one
2. Profile picture: we have not yet added profile picture in ProfileScreen 
3. Session detail screen: card can be clicked, but will not lead to a detail screen (because we have not yet implemented it)
4. Sorting not working: session listing sorting attempted, but had some issue

### Changes to Revised Plan
1. We are changing from Google authentification to email-password authentification
2. Altered relationship between datasets, added Courses as its own dataset

### Updated Work Plan
- Finish planned Alpha version: by Dec 13
- Core features: by Dec 18
- Additional features: by Dec 21
- Testing: by Dec 22


