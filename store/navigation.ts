export const state = () => ({

  links: [
    {
      name: 'Tests du refactoring',
      href: '/refactor-test',
      icon: 'build',
      id: 'refactor-test',
    },
    'separator',
    {
      name: 'Timeline',
      href: '/timeline',
      icon: 'timeline',
      id: 'timeline',
    },
    {
      name: 'Cours',
      href: '/notes',
      icon: 'insert_drive_file',
      id: 'notes',
    },
    {
      name: 'Devoirs',
      href: '/homework',
      icon: 'book',
      id: 'homework',
    },
    {
      name: 'Emploi du temps',
      href: '/coming-soon',
      icon: 'today',
      id: 'schedule',
    },
    {
      name: 'Notes',
      href: '/coming-soon',
      icon: 'school',
      id: 'grades',
    },
    {
      name: 'Sac',
      href: '/coming-soon',
      icon: 'work_outline',
      id: 'bag',
    },
    'separator',
    {
      name: 'Paramètres',
      href: '/settings',
      icon: 'settings',
      id: 'settings',
    },
    {
      name: 'Vos contributions',
      href: '/reports',
      icon: 'bug_report',
      id: 'reports',
    },
    {
      name: 'Signaler un bug',
      modal: 'add-report',
      icon: 'bug_report',
      id: 'new-report',
    },
  ],
})

export const getters = {
  textColor: (state, getters) => backgroundColor =>
    // TODO: handle var(--) ?
    /* returns the corresponding text color most visible
     * on backgroundColor: either 'black' or 'white'.
     */
    tinycolor(backgroundColor).isLight() ? 'black' : 'white',
  formatTime: (state, getters) => time => {
    if (time === null) return null
    return format(time, 'HH:mm')
  },
  drawerLinks: state =>
    state.links.filter(link => {
      if (link === 'separator') return true
      return !['new-report'].includes(link.id)
    }),
  sideRailLinks: state =>
    state.links.filter(link => {
      if (link === 'separator') return false
      return ['timeline', 'notes', 'homework', 'grades', 'new-report'].includes(
        link.id
      )
    }),
}
