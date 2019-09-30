# TO-DOs
Variouts todos that don't belong in a specific file

- [ ] Reorganize component styles by sections w/ `//---section comments---`
- [ ] SASS -> Stylus
- [x] chroma -> tinycolor2
- [ ] fusejs -> wade
- [ ] moment -> dayjs
- [x] Move all $axios.get calls to nuxtServerInit
- [ ] /homework/: use `<<Note name>>` in the additionnal notes to create a link to that note
- [ ] When getting test names from description, take only first line of desc & trim it.
- [ ] Controles prévus: sort by due date, only show 5 grades and show more... btn
- [ ] "La moyenne était de 17.1/20 avant la dernière note" ~> "La moyenne était de 17.1/20 avant la dernière note (x/20 en matière)" & put in Tooltip component: info icon with title attribute (as slot ?)
- [ ] Reduce font size@mobile BigNumber
- [ ] Other homework group "Late" for uncompleted but due in the past homework
- [ ] Special <ItemExercise> <ItemExerciseLate> that provides 3 btns on hover: resched, delete, and complete
- [ ] /sac/  attention contrôle de ... Demain prendre matériel adapté
- [ ] /bag/ Dismissable (w/ `__hidden__` setting initially set to true) notice when Monday is next day to say it assumes that the bag wasn't emptied in the weekend
    - [ ] Other setting to switch to mode where it assumes the contrary ?
- [x] all pages with layout=default: page title to "(x) Page title" where x is the num. of homework for tomorrow
    - [ ] Needs to be: "(x&y)" where y is the number of tests for tomorrow and x is the number of exercises for tomorrow. show ":)" when y+x==0