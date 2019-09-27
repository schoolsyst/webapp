# Priorities

## For back-to-school (Closed Beta)
- [x] exercises
    - missing: edit exercise title
- [x] tests
    - missing: edit notions to learn
    - missing: change due date
- [x] note-taking
    - missing: quick actions in editor 
        - jump to file of same subject
    - missing: status bar in editor 
        - battery level
        - words count
        - lines count?
- [ ] basic settings (no fromatting, just key-value text inputs)

## Just after (Open Beta)
- [ ] setup page
- [ ] schedule
- [ ] fancy settings
- [ ] dark mode (see at the bottom of this document)

## Less-important features (Release)
- [ ] presentation website @ schoolsyst.com, application @ app.schoolsyst.com & API @ api.schoolsyst.com & API docs @ dev.schoolsyst.com
- [x] custom markdown theme
    - missing: `\<ol>`s
- [ ] grades (stats)
- [ ] learn\_it integration
- [ ] bag
- [ ] Markdown user guide page 

## Dark mode primitive CSS
```css
/* Primitive 'dark mode' css */
body, nav {
  background-color: #0a0a0a !important;
  color: #fff;
}

.modal-wrapper {
  background-color: #111 !important;
}

nav.slide-out {
  background: #555 !important;
}

nav.slide-out:hover {
  background: #000 !important;
}

::placeholder {
  color: #fff !important;
}

html {
  --grey: #222;
  --offset-blue: #05223f;
}

.CardTest .progress {
  background: hsla(0,0%,0%,.25) !important;
}

.CardTest .top-bar {
  background: hsla(0,0%,0%,.25) !important;
}

.CardTest .progress-infos {
  color: white !important;
}

.ItemExercise .main-content::before {
  background: white;
  opacity: 1 !important;
}

.ItemExercise .expand .icon {
  color: white !important;
}

select, input, textarea {
  color: white
}

.ButtonIcon .icon {
  color: white !important;
}

.BaseModal .close-modal {
  color: white;
}

.ModalDialogConfirm .message, .ModalDialogConfirm .heading {
  color: white !important;
}

#mirror tbody tr,
#mirror tbody td {
  background: #1a1a1a;
  border-top: 2px solid #aaa5;
  border-bottom: 2px solid #aaa5;
}
```