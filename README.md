# Schoolsyst — frontend
[![HitCount](http://hits.dwyl.io/schoolsyst/schoolsyst/frontend.svg)](http://hits.dwyl.io/schoolsyst/schoolsyst/frontend)
![GitHub repo size](https://img.shields.io/github/repo-size/schoolsyst/frontend?style=flat-square)
![GitHub issues by-label](https://img.shields.io/github/issues/schoolsyst/frontend/enhancement?style=flat-square)
![GitHub issues by-label](https://img.shields.io/github/issues/schoolsyst/frontend/bug?style=flat-square)
![GitHub issues by-label](https://img.shields.io/github/issues/schoolsyst/frontend/from:schoolsyst.com?style=flat-square)
> The code for the nuxt.js-powered available at https://app.schoolsyst.com

## What is schoolsyst?

Schoolsyst is a web app designed to help students throughout their entire days, from note-taking to grades-managing.
It offers the following features:

- Take your notes from an intelligent word processor meant for writing consistently beautiful notes easily and as fast as possible.
- Add your homework using a smart date picker, and easily everything you need to get done in one page.
- Enter your grades and analyze your performance with diverse stats and goals you can set up for yourself.
- Take a quick peek at the Timeline to know how long you have to wait before the current course finishes, or to check where and when your next course takes place.
- Learn efficiently from your notes by letting the software ask you questions, and estimate your grades
- Easily share your notes with classmates in PDF, plain text and other formats
- Add schedule 'mutations' -- deleted, rescheduled or added courses, and see them on your schedule.
- (coming soon) Let schoolsyst wake you up, taking into account holidays and schedule changes.
- (coming soon) Fire up the 'bag' app to help you do your bag when you just want to go to sleep.

## Why can't I understand anything written on the app ?

I built schoolsyst alone, and the app is, as of now, targeted at french people. I *will* translate it at some point but I need to learn about school system differences between France, USA, UK and other countries before opening it up.

## How do I run this locally ?

For now, schoolsyst runs on a tiny VPS, and the API is therefore limited to requests from `*.schoolsyst.com`. If you want to run this app locally, you may want to also run the API, explained on [the repo's README](https://github.com/schoolsyst/backend/tree/master/README.md).

Here's how to install the frontend:

1. Clone the repo and `cd` into it

```bash
git clone https://github.com/schoolsyst/frontend.git
cd frontend
```

2. Install NodeJS
_The installation procedure changes depending on your platform, head over to [NodeJS's website](https://nodejs.org/)_

3. Install the project's dependencies

```bash
yarn # Using yarn, or
npm install # Using npm
```

4. Start the app
```bash
yarn dev # Using yarn, or
npm run dev # Using npm
```

This will serve the app on http://localhost:3000

## I have ideas on how to improve this!

Great to hear!
- If you already have code modifications ready to implement your idea, start a pull request
- If you no idea on how to code it (or some), make an issue about it.

Please take a look at the [roadmap](https://github.com/schoolsyst/frontend/issues/1) before submitting you idea

All people who helped the project will have their names (and more info if you want) on https://www.schoolsyst.com/contributors
