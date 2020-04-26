# schoolsyst: organizing components

Components should be stateless: this makes them easier to debug & test. Appart from utility getters defined in `store/index.js`, no component should import state/getters/actions or mutations (mutations shouldn't be called anywhere except inside actions, by the way.)

Only the pages/layouts are responsible for state CRUD operations. Data should be passed by props to components via `v-bind`, or `v-model` when using inputs, 



## Legend

| What            | it means                                   |
| --------------- | ------------------------------------------ |
| *(Italic text)* | Notes                                      |
| _Subcomponent_  | Component implemented as a "variant" prop. |
| 🚧 Component    | To-Do component                            |
| 🗃 Component    | Stateful components.                       |
| ▶ Component     | Components that takes inputs               |

## The tree

- Logos
  
  - compound (+animations)
  
  - symbol (+animations)
  
  - wordmark (+animations)

- Buttons (+disabled & dangerous states, +inline, +small)
  
  - Outline
  
  - Primary
  
  - Icon

- ▶ Inputs
  
  - Text input
    
    - passwords
    
    - date
      
      - due date (smart)
    
    - plain text
      
      - *block variant (textarea)*
    
    - number
      
      - *integer*
      
      - *float*
  
  - Checkbox
  
  - Radios
  
  - Dropdown
    
    - text
    
    - 🗃 subject
  
  - button switch (button group)

- Links
  
  - inline link

- State screens
  
  - Loading
    
    - *logo*
    
    - *spinner*
  
  - Success
    
    - *thumbs-up*
    
    - *checkmark*
  
  - Error
  
  - Empty

- Cards
  
  - Add
    
    - *homework*
    
    - *note*
    
    - *grade*
    
    - *subject*
  
  - Homework
  
  - Note
  
  - Subject
  
  - **Grade**
  
  - Report

- Headings
  
  - Uppercase
  
  - Regular

- Modals
  
  - ▶ Objects
    
    - homework
    
    - grade
    
    - subject
    
    - event
    
    - mutation
  
  - ▶ Pickers
    
    - 🗃 subject _(Only use when using the dropdown is not possible)_
    
    - color
  
  - dialogs
    
    - confirm (w/ challenge)
  
  - context menu

- Subject
  
  - Badge
  
  - Dot

- Schedule

- Unique components (prefixed with "The") _(This is not a base component)_
  
  - TheNavigation
    
    - Side _(on desktop)_
    
    - Bottom _(on mobile)_
  
  - TheTopBar
  
  - TheDrawer

## How it is implemented

Each node that has at least one non-variant (non-italic) node is implemented by a base components with its name constructed from his parent nodes, eg.

- Modal
  
  - dialog
    
    - confirm

The component "confirm", named `ModalDialogConfirm`, inherits "`BaseModalDialog`", which inherits itself from `BaseModal`. But 

- Cards
  
  - Add
    
    - *homework*

here, "_homework_" is implemented as a variant of "Add", eg. you use `<CardAdd variant="homework">` to use it.

## ▶ Dealing with components that take inputs

Props are immutable in vue, and that's a problem for components that take inputs: we pass down data to components via them, but we can't change them. We instead use `v-model`, and, internally in the component, declare props, and mutate values with `$emit('input', newValue)`

## 🗃 Avoiding & dealing with stateful components

Sometimes, having a component rely on the store is inevitable. Before resorting to such a solution, consider the following:

- Can't I pass the data as a prop?
  e.g, you saw subject-selecting components that rely on the store to get the full list of the user's subjects. But is it _really_ too impractical to just pass the subjects list as a prop every time? In this case, we only _pull_ data, we don't _mutate_, so I consider the choice justified.

If you go for it, here's what you _must_ do:

- Load _all_ of the state you'll need.
  This means calling the appropriate action beginning with `load`, preferably without `force: true`, except if you must.
  You shouldn't rely on the page to have loaded the state for you, and if the page has, then the action won't hit the API again (when `force` is `false`)


